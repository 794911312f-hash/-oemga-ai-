import React, { useState, useEffect } from "react";
import {
  FileCode2,
  FolderTree,
  Cpu,
  Layers,
  Sparkles,
  Copy,
  Check,
  Download,
  Terminal,
  ExternalLink,
  ShieldCheck,
  Zap,
  BookOpen,
  HelpCircle,
  ChevronRight,
  Code2,
  Package,
  Network,
  Search,
  RefreshCw,
  Eye,
  CheckCircle2,
  ArrowRight,
  Database,
  Globe2,
  Clock,
  Sigma,
  Bot
} from "lucide-react";
import { CodebaseManifest, CodebaseFileMetadata } from "../types";

interface CodebaseExplorerProps {
  onAskBrain?: (prompt: string) => void;
}

export const CodebaseExplorer: React.FC<CodebaseExplorerProps> = ({ onAskBrain }) => {
  const [manifest, setManifest] = useState<CodebaseManifest | null>(null);
  const [selectedFilePath, setSelectedFilePath] = useState<string>("server.ts");
  const [fileContent, setFileContent] = useState<string>("");
  const [fileMeta, setFileMeta] = useState<any>(null);
  const [loadingFile, setLoadingFile] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeViewTab, setActiveViewTab] = useState<"code" | "architecture" | "explain" | "endpoints" | "dependencies">("code");
  const [copied, setCopied] = useState<boolean>(false);
  const [aiExplanation, setAiExplanation] = useState<string>("");
  const [explaining, setExplaining] = useState<boolean>(false);
  const [customQuestion, setCustomQuestion] = useState<string>("");

  // Fetch codebase manifest
  useEffect(() => {
    fetch("/api/codebase/manifest")
      .then((res) => res.json())
      .then((data) => {
        setManifest(data);
      })
      .catch((err) => console.error("Manifest load error:", err));
  }, []);

  // Fetch selected file content
  useEffect(() => {
    if (!selectedFilePath) return;
    setLoadingFile(true);
    setAiExplanation("");
    fetch("/api/codebase/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filePath: selectedFilePath }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.content) {
          setFileContent(data.content);
          setFileMeta(data);
        }
      })
      .catch((err) => console.error("File read error:", err))
      .finally(() => setLoadingFile(false));
  }, [selectedFilePath]);

  const handleExplainFile = async (customQ?: string) => {
    setExplaining(true);
    try {
      const res = await fetch("/api/codebase/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filePath: selectedFilePath,
          question: customQ || customQuestion || `اشرح دور الملف ${selectedFilePath} وأهم الدوال فيه وكيف يرتبط بباقي أجزاء نظام أوميجا.`,
          codeSnippet: fileContent.slice(0, 3500),
        }),
      });
      const data = await res.json();
      if (data.explanation) {
        setAiExplanation(data.explanation);
        setActiveViewTab("explain");
      }
    } catch (e) {
      console.error("Explain error:", e);
    } finally {
      setExplaining(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(fileContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = selectedFilePath.split("/").pop() || "code.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredFiles = manifest?.files.filter((f) => {
    const matchesCategory = activeCategory === "all" || f.category === activeCategory;
    const matchesSearch =
      f.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectedFileMetadata = manifest?.files.find((f) => f.path === selectedFilePath);

  const presetQuestions = [
    {
      title: "🔬 التمييز بين الأسئلة الأدبية والعلمية",
      q: "أين يوجد كود التمييز بين الأسئلة الأدبية والعلمية في server.ts و BrainChat.tsx وكيف تم برمجته؟",
    },
    {
      title: "🛠️ دالة ترميم الـ JSON وإصلاح LaTeX",
      q: "كيف تعمل دالة safeJsonParse في server.ts لإصلاح خطأ Bad escaped character في صيغ LaTeX؟",
    },
    {
      title: "⏰ نظام الوقت اللحظي والتقويم الهجري",
      q: "كيف يقوم نظام أوميجا بحساب الوقت اللحظي وساعات عواصم العالم والتقويم الهجري عبر Intl؟",
    },
    {
      title: "🧠 شجرة التفكير ToT والاستدلال المعرفي",
      q: "كيف يتم توليد وتقييم مسارات شجرة الأفكار Tree of Thought وربطها بالواجهة؟",
    },
    {
      title: "🐝 خلية الوكلاء الذكية Swarm",
      q: "كيف يتم التنسيق وتوزيع الأدوار بين وكلاء Swarm (الباحث، المبرمج، المخطط، الناقد)؟",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5 font-mono">
                <FileCode2 className="w-3.5 h-3.5 text-indigo-400" />
                Codebase Self-Introspection & Architecture Engine
              </span>
              <span className="text-xs text-slate-400 font-mono">• Full-Stack TypeScript 5.8</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              مستكشف الكود الذاتي والمعمارية البرمجية
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              يمتلك <strong>Omega-AI</strong> وعياً ذاتياً شاملاً بكافة أسطر الكود والملفات والمعماريات البرمجية المستعملة في بنائه، متيحاً لك تصفح شجرة الملفات الحية، فحص الكود المصدري، وتحليل المعمارية التفاعلية.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveViewTab("code")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeViewTab === "code" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30" : "bg-slate-800/80 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>مستعرض الأكواد</span>
            </button>
            <button
              onClick={() => setActiveViewTab("architecture")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeViewTab === "architecture" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30" : "bg-slate-800/80 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <Network className="w-4 h-4" />
              <span>مخطط المعمارية</span>
            </button>
            <button
              onClick={() => setActiveViewTab("endpoints")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeViewTab === "endpoints" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30" : "bg-slate-800/80 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>مسارات الـ API</span>
            </button>
            <button
              onClick={() => setActiveViewTab("dependencies")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeViewTab === "dependencies" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30" : "bg-slate-800/80 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <Package className="w-4 h-4" />
              <span>حزمة التبعيات</span>
            </button>
          </div>
        </div>

        {/* Global Architecture Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3">
            <span className="text-[11px] text-slate-400">إجمالي الملفات الأساسية</span>
            <div className="text-xl font-bold text-indigo-300 font-mono mt-0.5">
              {manifest?.totalFiles || 17} ملفاً
            </div>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3">
            <span className="text-[11px] text-slate-400">أسطر الكود البرمجي (LOC)</span>
            <div className="text-xl font-bold text-emerald-300 font-mono mt-0.5">
              {(manifest?.totalLines || 4500).toLocaleString()} سطر
            </div>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3">
            <span className="text-[11px] text-slate-400">نمط البناء والمعمارية</span>
            <div className="text-sm font-bold text-cyan-300 font-mono mt-1 truncate">
              Express + React 19 + Vite
            </div>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3">
            <span className="text-[11px] text-slate-400">محرك الذكاء واللغة</span>
            <div className="text-sm font-bold text-purple-300 font-mono mt-1 truncate">
              Gemini 2.0/3.7 Flash + KaTeX
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area Based on Active Tab */}
      {activeViewTab === "code" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* File Explorer Sidebar */}
          <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4 flex flex-col h-[750px]">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <FolderTree className="w-4 h-4 text-indigo-400" />
                <span>شجرة ملفات المشروع الحية</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {filteredFiles?.length} ملف
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute right-3 top-2.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث في أسماء الملفات ووظائفها..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: "all", label: "الكل" },
                { id: "backend", label: "الخادم" },
                { id: "frontend", label: "الواجهة" },
                { id: "component", label: "المكونات" },
                { id: "config", label: "الإعدادات" },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                    activeCategory === c.id
                      ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/40"
                      : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Files List */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 -mr-1">
              {filteredFiles?.map((file) => {
                const isSelected = selectedFilePath === file.path;
                return (
                  <div
                    key={file.path}
                    onClick={() => setSelectedFilePath(file.path)}
                    className={`p-3 rounded-2xl cursor-pointer transition-all border text-right ${
                      isSelected
                        ? "bg-indigo-950/60 border-indigo-500/50 shadow-md shadow-indigo-950/30"
                        : "bg-slate-950/40 hover:bg-slate-950/80 border-slate-800/60 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-xs font-mono font-bold ${isSelected ? "text-indigo-300" : "text-slate-200"}`}>
                        {file.name}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800/60 text-slate-400 border border-slate-700/50">
                        {file.lines ? `${file.lines}L` : file.language}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {file.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Code Viewer and Inspector Panel */}
          <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4 flex flex-col h-[750px]">
            {/* Active File Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-indigo-300 bg-indigo-950/60 px-2.5 py-1 rounded-xl border border-indigo-500/30">
                    {selectedFilePath}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {fileMeta?.lineCount || 0} أسطر • {((fileMeta?.size || 0) / 1024).toFixed(1)} KB
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">
                  {selectedFileMetadata?.description}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExplainFile()}
                  disabled={explaining}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{explaining ? "جاري التحليل..." : "شرح الكود بـ AI"}</span>
                </button>
                <button
                  onClick={copyCode}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors border border-slate-700/60"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "تم النسخ" : "نسخ"}</span>
                </button>
                <button
                  onClick={downloadFile}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors border border-slate-700/60"
                  title="تنزيل الملف"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Key Features Chips if available */}
            {selectedFileMetadata?.keyFeatures && selectedFileMetadata.keyFeatures.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pb-2">
                <span className="text-[11px] text-slate-400 font-semibold">الميزات الرئيسية:</span>
                {selectedFileMetadata.keyFeatures.map((feat, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950 text-indigo-300 border border-slate-800"
                  >
                    {feat}
                  </span>
                ))}
              </div>
            )}

            {/* Code Content Viewer */}
            <div className="flex-1 bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden flex flex-col font-mono text-xs shadow-inner">
              <div className="bg-slate-900/80 border-b border-slate-800/80 px-4 py-2 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
                  <span>{selectedFilePath} (Read-Only Live Code)</span>
                </span>
                <span>UTF-8 • {fileMeta?.extension || ".ts"}</span>
              </div>

              <div className="flex-1 overflow-auto p-4 leading-relaxed text-slate-200 text-right font-mono" dir="ltr">
                {loadingFile ? (
                  <div className="flex items-center justify-center h-full text-slate-500 gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
                    <span>جاري قراءة الكود المصدري...</span>
                  </div>
                ) : (
                  <pre className="text-xs text-slate-200 whitespace-pre-wrap font-mono select-text">
                    {fileContent.split("\n").map((line, i) => (
                      <div key={i} className="table-row hover:bg-slate-900/60 transition-colors">
                        <span className="table-cell pr-4 text-slate-600 select-none text-right w-10 font-mono text-[11px]">
                          {i + 1}
                        </span>
                        <span className="table-cell pl-2 text-slate-200 font-mono">
                          {line || " "}
                        </span>
                      </div>
                    ))}
                  </pre>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Deep Explanation Tab */}
      {activeViewTab === "explain" && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">التحليل المعماري وتفسير الكود بـ AI</h3>
                <p className="text-xs text-slate-400">الملف المفحوص: <span className="font-mono text-indigo-300">{selectedFilePath}</span></p>
              </div>
            </div>

            <button
              onClick={() => handleExplainFile()}
              disabled={explaining}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${explaining ? "animate-spin" : ""}`} />
              <span>إعادة التحليل المعماري</span>
            </button>
          </div>

          {/* AI Explanation Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
            {aiExplanation ? (
              aiExplanation
            ) : explaining ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
                <RefreshCw className="w-8 h-8 animate-spin text-purple-400" />
                <span>يقوم العقل التنفيذي Omega Brain بفحص الأسطر والمعمارية وتقديم الشرح...</span>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 space-y-3">
                <Sparkles className="w-10 h-10 text-indigo-400 mx-auto animate-pulse" />
                <p>اضغط على "شرح الكود بـ AI" لتوليد دراسة معمارية تفصيلية لهذا الملف ووظائفه.</p>
                <button
                  onClick={() => handleExplainFile()}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition-all"
                >
                  بدء فحص الملف الآن
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* System Architecture Flowchart Tab */}
      {activeViewTab === "architecture" && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Network className="w-5 h-5 text-indigo-400" />
                <span>مخطط المعمارية وتدفق البيانات المعرفية (Architecture & Data Flow)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                يوضح كيف تترابط طبقات واجهة المستخدم مع خادم Express ومحركات الذكاء الاصطناعي ومصفوفات الذاكرة.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              End-to-End Pipeline
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1: Frontend Layer */}
            <div className="bg-slate-950 border border-indigo-500/30 rounded-2xl p-5 space-y-3 relative overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold font-mono text-sm">
                1
              </div>
              <h4 className="font-bold text-indigo-200 text-sm">طبقة العرض والواجهة التفاعلية (Frontend UI)</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                مبنية بـ <strong>React 19 + TypeScript + Tailwind CSS</strong>، توفر التبويبات التفاعلية (BrainChat, LatexStudio, ChronoMatrix, SwarmStudio, NeuralLab, MemoryMatrix, CodebaseExplorer).
              </p>
              <div className="pt-2 border-t border-slate-850 text-[11px] font-mono text-slate-400 space-y-1">
                <div>• KaTeX Math Rendering</div>
                <div>• Multi-modal attachments</div>
                <div>• Real-time ticker clocks</div>
              </div>
            </div>

            {/* Step 2: Backend API & Memory Hub */}
            <div className="bg-slate-950 border border-purple-500/30 rounded-2xl p-5 space-y-3 relative overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold font-mono text-sm">
                2
              </div>
              <h4 className="font-bold text-purple-200 text-sm">خادم المعالجة المركزية والذاكرة (Express Hub)</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                ملف <strong>server.ts</strong> يدير مسارات API (/api/think, /api/agents/swarm, /api/codebase/*)، مع مصفوفة الذاكرة 5-Tier ودالة <strong>safeJsonParse</strong> لترميم الـ JSON.
              </p>
              <div className="pt-2 border-t border-slate-850 text-[11px] font-mono text-slate-400 space-y-1">
                <div>• Safe JSON self-repair</div>
                <div>• 5-Tier Memory persistence</div>
                <div>• Intl Clock & Hijri Calendar</div>
              </div>
            </div>

            {/* Step 3: AI Models & Reasoning Core */}
            <div className="bg-slate-950 border border-cyan-500/30 rounded-2xl p-5 space-y-3 relative overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold font-mono text-sm">
                3
              </div>
              <h4 className="font-bold text-cyan-200 text-sm">محرك الاستدلال والوعي (Reasoning Engine)</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                الاتصال بنماذج <strong>Gemini 2.0 / 3.7 Flash</strong> عبر <code>@google/genai</code>، مع تطبيق شجرة التفكير ToT، التمييز الأدبي والعلمي، ومحاكاة 90-Layer MoE.
              </p>
              <div className="pt-2 border-t border-slate-850 text-[11px] font-mono text-slate-400 space-y-1">
                <div>• Tree-of-Thought (ToT)</div>
                <div>• Domain Classifier (Lit/Sci)</div>
                <div>• OmegaV15 Closed-Loop Optimizer</div>
              </div>
            </div>
          </div>

          {/* Detailed Component Matrix Table */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h4 className="text-sm font-bold text-slate-200">مصفوفة الربط بين الوحدات (Module Interconnection Matrix)</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs text-slate-300">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="py-2.5 px-3">الوحدة البرمجية</th>
                    <th className="py-2.5 px-3">الملف المصدري</th>
                    <th className="py-2.5 px-3">المسار الخلفي المقترن</th>
                    <th className="py-2.5 px-3">الوظيفة المعرفية والتقنية</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-indigo-300 font-sans">العقل التنفيذي</td>
                    <td className="py-2.5 px-3 text-slate-400">src/components/BrainChat.tsx</td>
                    <td className="py-2.5 px-3 text-cyan-400">POST /api/think</td>
                    <td className="py-2.5 px-3 text-slate-300 font-sans">تفكير ToT، تمييز أدبي/علمي، KaTeX، وسائط</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-indigo-300 font-sans">استوديو LaTeX</td>
                    <td className="py-2.5 px-3 text-slate-400">src/components/LatexStudio.tsx</td>
                    <td className="py-2.5 px-3 text-cyan-400">MathRenderer + KaTeX</td>
                    <td className="py-2.5 px-3 text-slate-300 font-sans">صياغة وتصيير معادلات الفيزياء والرياضيات</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-indigo-300 font-sans">مصفوفة التوقيت</td>
                    <td className="py-2.5 px-3 text-slate-400">src/components/ChronoMatrix.tsx</td>
                    <td className="py-2.5 px-3 text-cyan-400">GET /api/chrono/now</td>
                    <td className="py-2.5 px-3 text-slate-300 font-sans">توقيت لحظي، تقويم هجري/ميلادي، عواصم العالم</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-indigo-300 font-sans">خلية Swarm</td>
                    <td className="py-2.5 px-3 text-slate-400">src/components/SwarmStudio.tsx</td>
                    <td className="py-2.5 px-3 text-cyan-400">POST /api/agents/swarm</td>
                    <td className="py-2.5 px-3 text-slate-300 font-sans">تنسيق 4 وكلاء (باحث، مبرمج، مخطط، ناقد)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-indigo-300 font-sans">المختبر العصبي</td>
                    <td className="py-2.5 px-3 text-slate-400">src/components/NeuralLab.tsx</td>
                    <td className="py-2.5 px-3 text-cyan-400">GET /api/neural/telemetry</td>
                    <td className="py-2.5 px-3 text-slate-300 font-sans">محاكاة 90-طبقة MoE وتليمتري المحسن V15</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-indigo-300 font-sans">مصفوفة الذاكرة</td>
                    <td className="py-2.5 px-3 text-slate-400">src/components/MemoryMatrix.tsx</td>
                    <td className="py-2.5 px-3 text-cyan-400">GET /api/memory/get</td>
                    <td className="py-2.5 px-3 text-slate-300 font-sans">إدارة 5 طبقات ذاكرة (قصيرة، طويلة، عرضية، دلالية، متجهة)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-indigo-300 font-sans">استكشاف الكود الذاتي</td>
                    <td className="py-2.5 px-3 text-slate-400">src/components/CodebaseExplorer.tsx</td>
                    <td className="py-2.5 px-3 text-cyan-400">GET /api/codebase/manifest</td>
                    <td className="py-2.5 px-3 text-slate-300 font-sans">الوعي الذاتي، قراءة الأكواد الحية، فحص المعمارية</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* API Endpoints Catalog Tab */}
      {activeViewTab === "endpoints" && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-emerald-400" />
                <span>دليل مسارات الخادم (Backend REST API Catalog)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                كافة نقاط الاتصال المعرفة داخل خادم <code>server.ts</code> المتاحة للواجهة والأنظمة الخارجية.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {manifest?.endpoints.length || 12} Endpoints
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {manifest?.endpoints.map((ep, idx) => (
              <div
                key={idx}
                className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 space-y-2 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono font-bold text-xs text-cyan-300">{ep.path}</span>
                  <span
                    className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded ${
                      ep.method === "POST"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    }`}
                  >
                    {ep.method}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {ep.description}
                </p>
                <div className="text-[10px] font-mono text-slate-500">
                  Handler: {ep.handler}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dependencies & Packages Tab */}
      {activeViewTab === "dependencies" && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-indigo-400" />
                <span>حزمة التبعيات والمكتبات (Dependencies & Stack)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                المكتبات والتقنيات المثبتة في <code>package.json</code> ودور كل منها في منظومة أوميجا.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Production & Dev Stack
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Production Dependencies */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h4 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                <span>حزم الإنتاج الأساسية (Production Dependencies)</span>
              </h4>
              <div className="space-y-2">
                {manifest?.dependencies &&
                  Object.entries(manifest.dependencies).map(([pkg, role]) => (
                    <div
                      key={pkg}
                      className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
                    >
                      <span className="font-mono font-bold text-slate-200">{pkg}</span>
                      <span className="font-sans text-[11px] text-slate-400 text-left" dir="ltr">
                        {role}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Development Dependencies */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h4 className="text-sm font-bold text-purple-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-400" />
                <span>أدوات التطوير والبناء (Dev Dependencies)</span>
              </h4>
              <div className="space-y-2">
                {manifest?.devDependencies &&
                  Object.entries(manifest.devDependencies).map(([pkg, role]) => (
                    <div
                      key={pkg}
                      className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
                    >
                      <span className="font-mono font-bold text-slate-200">{pkg}</span>
                      <span className="font-sans text-[11px] text-slate-400 text-left" dir="ltr">
                        {role}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preset Q&A Box about Omega's Codebase */}
      <div className="bg-gradient-to-r from-indigo-950/40 via-slate-900 to-purple-950/40 border border-indigo-500/20 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-400" />
            <span>استفسارات معمارية شائعة حول كود أوميجا (Quick Code Q&A)</span>
          </h3>
          <span className="text-[11px] text-slate-400">انقر على أي سؤال للشرح الفوري</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {presetQuestions.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCustomQuestion(item.q);
                handleExplainFile(item.q);
              }}
              className="p-3 rounded-2xl bg-slate-950/70 hover:bg-indigo-950/50 border border-slate-800 hover:border-indigo-500/40 text-right transition-all group"
            >
              <div className="text-xs font-bold text-slate-200 group-hover:text-indigo-200 flex items-center justify-between">
                <span>{item.title}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition-transform rotate-180" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                {item.q}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
