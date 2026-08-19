import React, { useState } from "react";
import katex from "katex";
import { 
  Sigma, 
  Copy, 
  Check, 
  Sparkles, 
  Atom, 
  BookOpen, 
  Layers, 
  Send, 
  RotateCcw, 
  Download, 
  Eye, 
  Code2, 
  HelpCircle,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { MathRenderer } from "./MathRenderer";

interface LatexStudioProps {
  onSendToBrain?: (latexPrompt: string) => void;
}

export const LatexStudio: React.FC<LatexStudioProps> = ({ onSendToBrain }) => {
  const [latexCode, setLatexCode] = useState<string>(
    `% معادلة شرودنغر المعتمدة على الزمن والجهد الكمومي
i\\hbar \\frac{\\partial}{\\partial t}\\Psi(\\mathbf{r},t) = \\left[ -\\frac{\\hbar^2}{2m}\\nabla^2 + V(\\mathbf{r},t) \\right] \\Psi(\\mathbf{r},t)

% مصفوفة هاميلتونيان و مستويات الطاقة
\\hat{H} = \\begin{pmatrix} E_1 & 0 & 0 \\\\ 0 & E_2 & 0 \\\\ 0 & 0 & E_3 \\end{pmatrix}, \\quad \\langle \\Psi | \\hat{H} | \\Psi \\rangle = \\sum_{n} |c_n|^2 E_n`
  );

  const [aiPrompt, setAiPrompt] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("physics");
  const [fontSize, setFontSize] = useState<"normal" | "large" | "huge">("large");

  // Quick Symbols categorized
  const symbolCategories = [
    {
      id: "greek",
      name: "الحروف اليونانية",
      symbols: [
        { label: "α", code: "\\alpha" },
        { label: "β", code: "\\beta" },
        { label: "γ", code: "\\gamma" },
        { label: "δ", code: "\\delta" },
        { label: "ε", code: "\\varepsilon" },
        { label: "θ", code: "\\theta" },
        { label: "λ", code: "\\lambda" },
        { label: "μ", code: "\\mu" },
        { label: "π", code: "\\pi" },
        { label: "σ", code: "\\sigma" },
        { label: "τ", code: "\\tau" },
        { label: "φ", code: "\\phi" },
        { label: "ψ", code: "\\psi" },
        { label: "ω", code: "\\omega" },
        { label: "Γ", code: "\\Gamma" },
        { label: "Δ", code: "\\Delta" },
        { label: "Θ", code: "\\Theta" },
        { label: "Λ", code: "\\Lambda" },
        { label: "Σ", code: "\\Sigma" },
        { label: "Φ", code: "\\Phi" },
        { label: "Ψ", code: "\\Psi" },
        { label: "Ω", code: "\\Omega" },
      ],
    },
    {
      id: "calculus",
      name: "التفاضل والتكامل",
      symbols: [
        { label: "∫ dx", code: "\\int f(x) \\, dx" },
        { label: "∫ₐᵇ", code: "\\int_{a}^{b} f(x) \\, dx" },
        { label: "∬", code: "\\iint_{D} f(x,y) \\, dA" },
        { label: "∮", code: "\\oint_{C} \\mathbf{F} \\cdot d\\mathbf{r}" },
        { label: "∂f/∂x", code: "\\frac{\\partial f}{\\partial x}" },
        { label: "df/dx", code: "\\frac{df}{dx}" },
        { label: "d²f/dx²", code: "\\frac{d^2 f}{dx^2}" },
        { label: "lim", code: "\\lim_{x \\to 0} f(x)" },
        { label: "∑", code: "\\sum_{i=1}^{n} a_i" },
        { label: "∏", code: "\\prod_{k=1}^{n} k" },
        { label: "∇", code: "\\nabla" },
        { label: "∇² (Laplacian)", code: "\\nabla^2" },
      ],
    },
    {
      id: "algebra",
      name: "الجبر والمصفوفات",
      symbols: [
        { label: "a/b", code: "\\frac{a}{b}" },
        { label: "√x", code: "\\sqrt{x}" },
        { label: "ⁿ√x", code: "\\sqrt[n]{x}" },
        { label: "x²", code: "x^{2}" },
        { label: "xᵢ", code: "x_{i}" },
        { label: "مصفوفة 2×2", code: "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}" },
        { label: "مصفوفة 3×3", code: "\\begin{pmatrix} a_{11} & a_{12} & a_{13} \\\\ a_{21} & a_{22} & a_{23} \\\\ a_{31} & a_{32} & a_{33} \\end{pmatrix}" },
        { label: "محدد |A|", code: "\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}" },
        { label: "معادلات متسقة", code: "\\begin{cases} 2x + y = 5 \\\\ x - 3y = -1 \\end{cases}" },
      ],
    },
    {
      id: "physics",
      name: "رموز الفيزياء والكوانتم",
      symbols: [
        { label: "ħ", code: "\\hbar" },
        { label: "⟨ψ|ϕ⟩", code: "\\langle \\psi | \\phi \\rangle" },
        { label: "|ψ⟩", code: "|\\psi\\rangle" },
        { label: "⟨ψ|", code: "\\langle\\psi|" },
        { label: "Ĥ", code: "\\hat{H}" },
        { label: "v⃗", code: "\\vec{v}" },
        { label: "⊗", code: "\\otimes" },
        { label: "†", code: "^\\dagger" },
        { label: "E=mc²", code: "E = mc^2" },
        { label: "μ₀", code: "\\mu_0" },
        { label: "ε₀", code: "\\varepsilon_0" },
        { label: "k_B", code: "k_B" },
      ],
    },
    {
      id: "relations",
      name: "العلاقات والمنطق",
      symbols: [
        { label: "≈", code: "\\approx" },
        { label: "≠", code: "\\neq" },
        { label: "≤", code: "\\le" },
        { label: "≥", code: "\\ge" },
        { label: "≡", code: "\\equiv" },
        { label: "∝", code: "\\propto" },
        { label: "±", code: "\\pm" },
        { label: "∓", code: "\\mp" },
        { label: "×", code: "\\times" },
        { label: "·", code: "\\cdot" },
        { label: "⟹", code: "\\implies" },
        { label: "⟺", code: "\\iff" },
        { label: "∀", code: "\\forall" },
        { label: "∃", code: "\\exists" },
        { label: "∈", code: "\\in" },
        { label: "∉", code: "\\notin" },
      ],
    },
  ];

  // Preset Scientific Formulations
  const scientificPresets = [
    {
      category: "physics",
      title: "معادلة شرودنغر الكمومية (Schrödinger)",
      desc: "تصف التطور الزمني والمكاني للدالة الموجية في الميكانيكا الكمية",
      code: `i\\hbar \\frac{\\partial}{\\partial t}\\Psi(\\mathbf{r},t) = \\left[ -\\frac{\\hbar^2}{2m}\\nabla^2 + V(\\mathbf{r},t) \\right] \\Psi(\\mathbf{r},t)`
    },
    {
      category: "physics",
      title: "معادلات ماكسويل الأربعة (Maxwell's Equations)",
      desc: "الصيغة التفاضلية الكهرومغناطيسية للمجالين الكهربائي والمغناطيسي",
      code: `\\begin{aligned}
\\nabla \\cdot \\mathbf{E} &= \\frac{\\rho}{\\varepsilon_0} \\\\[6pt]
\\nabla \\cdot \\mathbf{B} &= 0 \\\\[6pt]
\\nabla \\times \\mathbf{E} &= -\\frac{\\partial \\mathbf{B}}{\\partial t} \\\\[6pt]
\\nabla \\times \\mathbf{B} &= \\mu_0 \\mathbf{J} + \\mu_0 \\varepsilon_0 \\frac{\\partial \\mathbf{E}}{\\partial t}
\\end{aligned}`
    },
    {
      category: "physics",
      title: "معادلة أينشتاين للمجال والنسبية العامة (Einstein Field Equations)",
      desc: "علاقة انحناء الزمكان بتوزيع الكتلة والطاقة",
      code: `G_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4} T_{\\mu\\nu}, \\quad R_{\\mu\\nu} - \\frac{1}{2} R g_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4} T_{\\mu\\nu}`
    },
    {
      category: "physics",
      title: "معادلة ديراك للجسيمات النسبية (Dirac Equation)",
      desc: "تدمج ميكانيكا الكم مع النسبية الخاصة وتنبأت بوجود مضادات المادة",
      code: `\\left( i\\hbar \\gamma^\\mu \\partial_\\mu - mc \\right) \\psi = 0, \\quad \\{\\gamma^\\mu, \\gamma^\\nu\\} = 2g^{\\mu\\nu} I_4`
    },
    {
      category: "math",
      title: "تحويل فورييه وتكامل غاوس (Fourier Transform & Gaussian Integral)",
      desc: "تحليل الإشارات والتحويل الترددي مع تكامل التوزيع الطبيعي",
      code: `\\mathcal{F}\\{f(t)\\}(\\omega) = \\frac{1}{\\sqrt{2\\pi}} \\int_{-\\infty}^{\\infty} f(t) e^{-i\\omega t} \\, dt, \\quad \\int_{-\\infty}^{\\infty} e^{-a x^2} \\, dx = \\sqrt{\\frac{\\pi}{a}}`
    },
    {
      category: "math",
      title: "متطابقة أويلر ومتسلسلة تايلور (Euler Identity & Taylor Series)",
      desc: "أجمل معادلة في الرياضيات والتقريب الدالي للمتسلسلات",
      code: `e^{i\\pi} + 1 = 0, \\quad f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!} (x - a)^n`
    },
    {
      category: "math",
      title: "معادلات نافييه-ستوكس لحركة الموائع (Navier-Stokes)",
      desc: "معادلات ديناميكا الموائع اللزجة غير القابلة للانضغاط",
      code: `\\rho \\left( \\frac{\\partial \\mathbf{u}}{\\partial t} + (\\mathbf{u} \\cdot \\nabla)\\mathbf{u} \\right) = -\\nabla p + \\mu \\nabla^2 \\mathbf{u} + \\mathbf{f}, \\quad \\nabla \\cdot \\mathbf{u} = 0`
    },
    {
      category: "thermo",
      title: "الديناميكا الحرارية والإنتروبيا (Thermodynamics & Boltzmann)",
      desc: "القانون الثاني للديناميكا الحرارية ومعادلة بولتزمان الإحصائية",
      code: `S = k_B \\ln \\Omega, \\quad dU = T dS - P dV + \\sum_{i} \\mu_i dN_i, \\quad F = U - TS`
    },
  ];

  // Insert code into editor
  const insertSymbol = (code: string) => {
    setLatexCode((prev) => `${prev} ${code} `);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  // Safe KaTeX rendering for the preview
  const renderLatexLines = (raw: string) => {
    if (!raw.trim()) {
      return (
        <div className="text-slate-500 italic text-center py-12">
          اكتب كود LaTeX في المحرر أو اختر من مكتبة الصيغ لرؤية المعاينة الفورية هنا...
        </div>
      );
    }

    // Filter out LaTeX comment lines (% ...)
    const cleanLines = raw
      .split("\n")
      .filter((line) => !line.trim().startsWith("%"))
      .join("\n")
      .trim();

    if (!cleanLines) {
      return (
        <div className="text-slate-500 italic text-center py-12">
          المحتوى الحالي يحتوي على تعليقات فقط (%...). أضف معادلات LaTeX للمعاينة.
        </div>
      );
    }

    try {
      const renderedHtml = katex.renderToString(cleanLines, {
        displayMode: true,
        throwOnError: false,
        output: "htmlAndMathml",
        strict: false,
      });

      return (
        <div 
          className={`katex-preview-zone overflow-x-auto text-center py-6 px-4 ${
            fontSize === "huge" ? "text-2xl" : fontSize === "large" ? "text-xl" : "text-base"
          }`}
          dangerouslySetInnerHTML={{ __html: renderedHtml }} 
        />
      );
    } catch (err: any) {
      return (
        <div className="p-4 bg-rose-950/40 border border-rose-500/30 rounded-xl text-rose-300 text-xs">
          <div className="flex items-center gap-2 font-bold mb-1">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>خطأ في صياغة LaTeX:</span>
          </div>
          <p className="font-mono text-rose-200">{err?.message || String(err)}</p>
        </div>
      );
    }
  };

  // AI Equation Generator
  const handleGenerateAiFormula = async () => {
    if (!aiPrompt.trim() || isGenerating) return;
    setIsGenerating(true);

    try {
      const res = await fetch("/api/think", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input_text: `أنت خبير محترف في كتابة وصياغة معادلات LaTeX الرياضية والفيزيائية. اكتب فقط كود LaTeX النقي الكامل والمتقن للمعادلة أو المسألة التالية بدون أي مقدمات زائدة:\n"${aiPrompt}"`,
          strategy: "chain_of_thought",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.response) {
          // Extract LaTeX code from response if inside $$ or ```latex
          let extracted = data.response;
          const mathBlockMatch = data.response.match(/\$\$([\s\S]*?)\$\$/);
          const codeBlockMatch = data.response.match(/```(?:latex|math)?\n([\s\S]*?)```/);
          
          if (mathBlockMatch) {
            extracted = mathBlockMatch[1].trim();
          } else if (codeBlockMatch) {
            extracted = codeBlockMatch[1].trim();
          }

          setLatexCode(extracted);
          setAiPrompt("");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900/90 to-purple-950/80 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 border border-indigo-400/40 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <Sigma className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white">استوديو ومحرر معادلات LaTeX</h1>
              <span className="text-[11px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-full font-bold">
                KaTeX Live Engine
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              محرر مباشر للرموز الرياضية، معادلات الفيزياء الكوانتية، النسبية العامة، التفاضل والتكامل، مع توليد فوري بالذكاء الاصطناعي.
            </p>
          </div>
        </div>

        {/* AI Quick Generator Bar */}
        <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 rounded-2xl p-1.5 w-full md:w-auto min-w-[340px] shadow-inner">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerateAiFormula()}
            placeholder="اطلب معادلة (مثال: معادلات نافييه ستوكس، مصفوفة باولي)..."
            className="bg-transparent border-0 text-xs text-slate-100 placeholder-slate-500 focus:outline-none px-3 py-1.5 flex-1"
          />
          <button
            onClick={handleGenerateAiFormula}
            disabled={!aiPrompt.trim() || isGenerating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold transition-all disabled:opacity-50 shadow-md shadow-indigo-600/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isGenerating ? "توليد..." : "توليد LaTeX"}</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Grid (Editor + Live Visualizer) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Code Editor & Palette */}
        <div className="space-y-4">
          <div className="bg-slate-900/85 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2.5">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-bold text-slate-200">محرر كود LaTeX المصدر</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLatexCode("")}
                  className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 px-2 py-1 rounded bg-slate-950/60 border border-slate-800 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>تفريغ</span>
                </button>
                <button
                  onClick={() => copyToClipboard(latexCode, "raw")}
                  className="text-xs text-indigo-300 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-950/60 border border-indigo-500/30 hover:bg-indigo-900 transition-colors"
                >
                  {copiedType === "raw" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedType === "raw" ? "تم النسخ" : "نسخ الكود"}</span>
                </button>
              </div>
            </div>

            <textarea
              value={latexCode}
              onChange={(e) => setLatexCode(e.target.value)}
              rows={12}
              dir="ltr"
              placeholder="اكتب كود LaTeX هنا (مثال: \int_{0}^{\infty} e^{-x^2} dx = \frac{\sqrt{\pi}}{2})..."
              className="w-full bg-slate-950 font-mono text-xs text-emerald-300 p-4 rounded-xl border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 focus:outline-none resize-y leading-relaxed shadow-inner"
            />
          </div>

          {/* Categorized Symbol Palette */}
          <div className="bg-slate-900/85 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-3 border-b border-slate-800">
              {symbolCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    activeCategory === cat.id
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {symbolCategories
                .find((c) => c.id === activeCategory)
                ?.symbols.map((sym, idx) => (
                  <button
                    key={idx}
                    onClick={() => insertSymbol(sym.code)}
                    className="p-2 bg-slate-950 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-500/40 rounded-xl text-slate-200 hover:text-indigo-200 transition-all flex flex-col items-center justify-center gap-1 group shadow-sm"
                    title={sym.code}
                  >
                    <span className="font-serif text-sm font-bold text-indigo-300 group-hover:scale-110 transition-transform">
                      {sym.label}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500 truncate max-w-full dir-ltr">
                      {sym.code}
                    </span>
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Mathematical Preview & Exports */}
        <div className="space-y-4">
          <div className="bg-slate-900/85 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md flex flex-col h-full min-h-[480px]">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2.5">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-slate-200">المعاينة البصرية المباشرة (KaTeX Render)</h3>
              </div>

              {/* Font Size Selector */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setFontSize("normal")}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    fontSize === "normal" ? "bg-indigo-600 text-white" : "text-slate-400"
                  }`}
                >
                  عادي
                </button>
                <button
                  onClick={() => setFontSize("large")}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    fontSize === "large" ? "bg-indigo-600 text-white" : "text-slate-400"
                  }`}
                >
                  كبير
                </button>
                <button
                  onClick={() => setFontSize("huge")}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    fontSize === "huge" ? "bg-indigo-600 text-white" : "text-slate-400"
                  }`}
                >
                  عملاق
                </button>
              </div>
            </div>

            {/* Render Canvas */}
            <div className="flex-1 bg-slate-950/80 border border-slate-800/80 rounded-2xl p-6 flex items-center justify-center overflow-x-auto shadow-inner text-slate-100">
              {renderLatexLines(latexCode)}
            </div>

            {/* Export & Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(`$$${latexCode}$$`, "md")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                >
                  {copiedType === "md" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>نسخ بصيغة Markdown ($$)</span>
                </button>
              </div>

              {onSendToBrain && (
                <button
                  onClick={() => onSendToBrain(`يرجى شرح وتحليل واشتقاق هذه المعادلة الفيزيائية/الرياضية بالتفصيل:\n$$${latexCode}$$`)}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30"
                >
                  <Send className="w-3.5 h-3.5 rotate-180" />
                  <span>إرسال للعقل التنفيذي Omega Brain</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Preset Mathematical & Physical Encyclopedia */}
      <div className="bg-slate-900/85 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-800">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <h2 className="text-sm font-bold text-white">موسوعة النماذج والمعادلات الفيزيائية والرياضية الجاهزة</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {scientificPresets.map((preset, idx) => (
            <div
              key={idx}
              className="p-4 bg-slate-950/70 hover:bg-slate-950 border border-slate-800/80 hover:border-indigo-500/50 rounded-2xl transition-all flex flex-col justify-between group shadow-sm"
            >
              <div>
                <h4 className="text-xs font-bold text-slate-200 group-hover:text-indigo-300 transition-colors mb-1">
                  {preset.title}
                </h4>
                <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                  {preset.desc}
                </p>
                <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 overflow-x-auto text-center my-2 shadow-inner">
                  <MathRenderer content={`$$${preset.code}$$`} />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-800/60">
                <button
                  onClick={() => setLatexCode(preset.code)}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-500/30 text-[11px] font-bold text-indigo-200 transition-colors text-center"
                >
                  فتح في المحرر
                </button>
                <button
                  onClick={() => copyToClipboard(preset.code, `preset-${idx}`)}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                  title="نسخ كود LaTeX"
                >
                  {copiedType === `preset-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
