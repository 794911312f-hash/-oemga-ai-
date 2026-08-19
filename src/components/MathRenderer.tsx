import React, { useState } from "react";
import katex from "katex";
import { Copy, Check, Terminal, Sigma } from "lucide-react";

interface MathRendererProps {
  content: string;
  className?: string;
}

export const MathRenderer: React.FC<MathRendererProps> = ({ content, className = "" }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Helper to render KaTeX safely
  const renderMath = (latex: string, displayMode: boolean): string => {
    try {
      return katex.renderToString(latex.trim(), {
        displayMode,
        throwOnError: false,
        output: "htmlAndMathml",
        strict: false,
      });
    } catch (err) {
      console.warn("KaTeX render error:", err);
      return `<span class="text-amber-400 font-mono">${latex}</span>`;
    }
  };

  // Parse markdown content with math, code blocks, tables, lists, and headers
  const renderFormattedContent = () => {
    if (!content) return null;

    // Split by code blocks first
    const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let blockIndex = 0;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Text before code block
      if (match.index > lastIndex) {
        const textBefore = content.substring(lastIndex, match.index);
        parts.push(
          <div key={`text-${blockIndex++}`}>
            {parseTextWithMath(textBefore, blockIndex)}
          </div>
        );
      }

      const lang = match[1] || "code";
      const codeContent = match[2];
      const currentIdx = blockIndex++;

      if (lang === "math" || lang === "latex") {
        // Direct LaTeX block
        const html = renderMath(codeContent, true);
        parts.push(
          <div key={`mathblock-${currentIdx}`} className="my-3 p-3 bg-slate-900/90 border border-indigo-500/30 rounded-xl overflow-x-auto text-center shadow-md relative group">
            <div dangerouslySetInnerHTML={{ __html: html }} />
            <button
              onClick={() => handleCopy(codeContent, currentIdx)}
              className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800/80 hover:bg-slate-700 p-1.5 rounded-md text-xs text-slate-300 flex items-center gap-1"
              title="نسخ صيغة LaTeX"
            >
              {copiedIndex === currentIdx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="text-[10px] font-mono">LaTeX</span>
            </button>
          </div>
        );
      } else {
        // Standard code block
        parts.push(
          <div key={`code-${currentIdx}`} className="my-3 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-lg text-left" dir="ltr">
            <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-mono text-[11px] text-indigo-300">
                <Terminal className="w-3.5 h-3.5" />
                {lang}
              </span>
              <button
                onClick={() => handleCopy(codeContent, currentIdx)}
                className="flex items-center gap-1 hover:text-slate-200 transition-colors"
              >
                {copiedIndex === currentIdx ? (
                  <span className="flex items-center gap-1 text-emerald-400 text-[11px]">
                    <Check className="w-3.5 h-3.5" /> تم النسخ
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px]">
                    <Copy className="w-3.5 h-3.5" /> نسخ
                  </span>
                )}
              </button>
            </div>
            <pre className="p-3.5 overflow-x-auto text-xs font-mono text-slate-200 leading-relaxed">
              <code>{codeContent}</code>
            </pre>
          </div>
        );
      }

      lastIndex = match.index + match[0].length;
    }

    // Remaining text after last code block
    if (lastIndex < content.length) {
      const remainingText = content.substring(lastIndex);
      parts.push(
        <div key={`text-final`}>
          {parseTextWithMath(remainingText, blockIndex++)}
        </div>
      );
    }

    return parts;
  };

  // Helper to parse blocks, math ($$ and $), headings, and paragraphs
  const parseTextWithMath = (rawText: string, keyPrefix: number): React.ReactNode[] => {
    // Break paragraphs by double newlines or single newlines with headings/bullet points
    const lines = rawText.split("\n");
    const elements: React.ReactNode[] = [];

    let inTable = false;
    let tableRows: string[][] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Table detection
      if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
        inTable = true;
        const cells = line
          .split("|")
          .map((c) => c.trim())
          .filter((c, idx, arr) => idx > 0 && idx < arr.length - 1);
        
        // Skip separator row |---|---|
        if (!cells.every((c) => /^[-:]+$/.test(c))) {
          tableRows.push(cells);
        }
        continue;
      } else if (inTable) {
        // Flush table
        elements.push(renderTable(tableRows, `${keyPrefix}-tbl-${i}`));
        inTable = false;
        tableRows = [];
      }

      if (!line.trim()) {
        elements.push(<div key={`${keyPrefix}-space-${i}`} className="h-2" />);
        continue;
      }

      // Headings
      if (line.startsWith("### ")) {
        elements.push(
          <h3 key={`${keyPrefix}-h3-${i}`} className="text-base font-bold text-indigo-200 mt-3 mb-1.5 flex items-center gap-1.5">
            <span className="w-1.5 h-4 bg-indigo-500 rounded-full inline-block"></span>
            {renderInlineMath(line.replace("### ", ""))}
          </h3>
        );
        continue;
      }
      if (line.startsWith("## ")) {
        elements.push(
          <h2 key={`${keyPrefix}-h2-${i}`} className="text-lg font-bold text-slate-100 mt-4 mb-2 pb-1 border-b border-slate-800 flex items-center gap-2">
            <span className="w-2 h-5 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full inline-block"></span>
            {renderInlineMath(line.replace("## ", ""))}
          </h2>
        );
        continue;
      }
      if (line.startsWith("# ")) {
        elements.push(
          <h1 key={`${keyPrefix}-h1-${i}`} className="text-xl font-extrabold text-white mt-4 mb-2 pb-1 border-b border-indigo-500/30">
            {renderInlineMath(line.replace("# ", ""))}
          </h1>
        );
        continue;
      }

      // Block math: $$ ... $$ on its own or inline
      if (line.trim().startsWith("$$") && line.trim().endsWith("$$") && line.trim().length > 4) {
        const mathExpr = line.trim().slice(2, -2);
        const html = renderMath(mathExpr, true);
        elements.push(
          <div
            key={`${keyPrefix}-blockmath-${i}`}
            className="my-3 py-2.5 px-4 bg-slate-900/80 border border-indigo-500/25 rounded-xl overflow-x-auto text-center shadow-inner"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
        continue;
      }

      // Bullet points
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ") || line.trim().startsWith("• ")) {
        const bulletText = line.trim().replace(/^[-*•]\s+/, "");
        elements.push(
          <div key={`${keyPrefix}-bullet-${i}`} className="flex items-start gap-2.5 my-1 text-slate-200 pr-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-2"></span>
            <span className="flex-1 leading-relaxed">{renderInlineMath(bulletText)}</span>
          </div>
        );
        continue;
      }

      // Numbered lists
      const numMatch = line.trim().match(/^(\d+)\.\s+(.*)/);
      if (numMatch) {
        elements.push(
          <div key={`${keyPrefix}-num-${i}`} className="flex items-start gap-2.5 my-1 text-slate-200 pr-2">
            <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-500/30 shrink-0 mt-0.5">
              {numMatch[1]}
            </span>
            <span className="flex-1 leading-relaxed">{renderInlineMath(numMatch[2])}</span>
          </div>
        );
        continue;
      }

      // Standard text line
      elements.push(
        <p key={`${keyPrefix}-p-${i}`} className="my-1.5 text-slate-200 leading-relaxed">
          {renderInlineMath(line)}
        </p>
      );
    }

    if (inTable && tableRows.length > 0) {
      elements.push(renderTable(tableRows, `${keyPrefix}-tbl-end`));
    }

    return elements;
  };

  const renderTable = (rows: string[][], key: string) => {
    if (rows.length === 0) return null;
    const header = rows[0];
    const body = rows.slice(1);

    return (
      <div key={key} className="my-3 overflow-x-auto rounded-xl border border-slate-800 shadow-md">
        <table className="w-full text-xs text-right border-collapse">
          <thead className="bg-slate-900/90 text-indigo-300 font-bold border-b border-slate-800">
            <tr>
              {header.map((col, idx) => (
                <th key={idx} className="p-2.5 border-l border-slate-800/60 last:border-0">
                  {renderInlineMath(col)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-950/50">
            {body.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-slate-900/40">
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="p-2.5 border-l border-slate-800/40 last:border-0 text-slate-200">
                    {renderInlineMath(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Helper to parse inline math $...$ or $$...$$ and bold/inline code within a single line
  const renderInlineMath = (text: string): React.ReactNode => {
    if (!text) return null;

    // First handle display math if embedded inside line: $$...$$
    // Next handle inline math: $...$
    // Also handle \frac{...}{...}, \int, etc if without dollar signs in isolated contexts
    const tokenRegex = /(\$\$(.*?)\$\$|\$([^$]+?)\$|`([^`]+?)`|\*\*([^*]+?)\*\*|\*([^*]+?)\*)/g;
    const nodes: React.ReactNode[] = [];
    let lastIdx = 0;
    let match: RegExpExecArray | null;
    let tokenIdx = 0;

    while ((match = tokenRegex.exec(text)) !== null) {
      if (match.index > lastIdx) {
        nodes.push(text.substring(lastIdx, match.index));
      }

      if (match[2]) {
        // Block math $$...$$
        const html = renderMath(match[2], true);
        nodes.push(
          <span
            key={`block-${tokenIdx++}`}
            className="inline-block my-1 px-2 py-0.5 bg-slate-900/90 border border-indigo-500/20 rounded text-center mx-1"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } else if (match[3]) {
        // Inline math $...$
        const html = renderMath(match[3], false);
        nodes.push(
          <span
            key={`inline-${tokenIdx++}`}
            className="inline-katex px-1 font-serif text-indigo-100"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } else if (match[4]) {
        // Inline code `...`
        nodes.push(
          <code
            key={`code-${tokenIdx++}`}
            className="px-1.5 py-0.5 mx-0.5 rounded bg-slate-800/90 text-indigo-300 font-mono text-xs border border-slate-700/60"
            dir="ltr"
          >
            {match[4]}
          </code>
        );
      } else if (match[5]) {
        // Bold **...**
        nodes.push(
          <strong key={`bold-${tokenIdx++}`} className="font-bold text-slate-100">
            {match[5]}
          </strong>
        );
      } else if (match[6]) {
        // Italic *...*
        nodes.push(
          <em key={`italic-${tokenIdx++}`} className="italic text-slate-200">
            {match[6]}
          </em>
        );
      }

      lastIdx = match.index + match[0].length;
    }

    if (lastIdx < text.length) {
      nodes.push(text.substring(lastIdx));
    }

    return nodes;
  };

  return <div className={`math-rendered-container ${className}`}>{renderFormattedContent()}</div>;
};
