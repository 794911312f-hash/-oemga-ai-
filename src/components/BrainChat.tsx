import React, { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Sparkles, 
  GitFork, 
  ListOrdered, 
  Layers, 
  Award, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  RotateCcw,
  Zap,
  Compass,
  ArrowUpRight,
  ShieldCheck,
  Code,
  Image as ImageIcon,
  FileText,
  Paperclip,
  X,
  Sigma,
  Atom,
  Eye,
  Download,
  Maximize2,
  BookOpen,
  ScrollText,
  FlaskConical,
  Feather,
  CheckCircle2
} from "lucide-react";
import { ThoughtTrace, ReasoningStrategy, ChatAttachment } from "../types";
import { MathRenderer } from "./MathRenderer";

interface BrainChatProps {
  onSendMessage: (text: string, strategy: ReasoningStrategy, attachments?: ChatAttachment[]) => void;
  isThinking: boolean;
  thoughtTraces: ThoughtTrace[];
}

export const BrainChat: React.FC<BrainChatProps> = ({
  onSendMessage,
  isThinking,
  thoughtTraces,
}) => {
  const [inputText, setInputText] = useState("");
  const [strategy, setStrategy] = useState<ReasoningStrategy>("tree_of_thought");
  const [expandedTraceId, setExpandedTraceId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [selectedImageModal, setSelectedImageModal] = useState<string | null>(null);
  const [showFormulaDrawer, setShowFormulaDrawer] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const presetPrompts = [
    { 
      title: "💻 الوعي الذاتي: الكود المصدري ومعمارية نظام Omega AI", 
      text: "ما هو الكود المستعمل في إنشائك وبنائك؟ اشرح لي المعمارية البرمجية بالتفصيل، كيف تم تنظيم ملف server.ts و App.tsx وبقية المكونات، وكيف تتكامل خوارزميات التفكير والذاكرة؟" 
    },
    { 
      title: "📜 سؤال أدبي: تحليل بلاغي ونقدي لقصيدة المتنبي", 
      text: "حلل أدبياً وبلاغياً مطلع قصيدة أبي الطيب المتنبي: 'وا حَرّ قَلباهُ مِمّنْ قَلبُهُ شَبِمُ ... ومَنْ بجِسْمي وَحالي عِندَهُ سَقَمُ'، مع استخراج التشبيه، الاستعارة، الطباق، بحر البسيط، وتوضيح الأبعاد النفسية والجمالية للمتنبي." 
    },
    { 
      title: "🔬 سؤال علمي: النفق الكمومي ومعادلة شرودنغر", 
      text: "اشرح ظاهرة النفق الكمومي (Quantum Tunneling) لجسيم يصطدم بحاجز جهد مستطيل $V_0 > E$، واشتق دالة الموجة $\\Psi(x)$ في المناطق الثلاث واحسب معامل النفاذية $T \\approx e^{-2\\kappa a}$ حيث $\\kappa = \\frac{\\sqrt{2m(V_0 - E)}}{\\hbar}$ وتطبيقاتها في المجهر النفقي STM." 
    },
    { 
      title: "⏰ الوقت والتاريخ وفروق التوقيت الدولية اللحظية", 
      text: "ما هو الوقت والتاريخ اللحظي الحالي بالتفصيل (الميلادي والهجري واليوم والتوقيت العالمي UTC)، وما هو فارق التوقيت الآن بين مكة المكرمة وطوكيو ولندن ونيويورك؟" 
    },
    { 
      title: "📜 سؤال أدبي: بلاغة القرآن وجماليات البيان", 
      text: "فصل في علم البلاغة الفروق الدقيقة بين التشبيه التمثيلي والاستعارة المكنية والتصريحية مع ضرب أمثلة من عيون الشعر العربي والقرآن الكريم." 
    },
    { 
      title: "🔬 سؤال علمي: معادلات ماكسويل والنسبية الخاصة", 
      text: "استعرض معادلات ماكسويل الأربعة بصيغتها التفاضلية وصيغة الموترات النسبية (Electromagnetic Field Tensor $F^{\\mu\\nu}$) واستنتج سرعة الضوء $c = \\frac{1}{\\sqrt{\\mu_0 \\varepsilon_0}}$." 
    },
    { 
      title: "🔬 سؤال علمي: تكامل غاوس وتحويلات فورييه", 
      text: "احسب تكامل غاوس $\\int_{-\\infty}^{\\infty} e^{-a x^2} dx = \\sqrt{\\frac{\\pi}{a}}$ واشتق تحويل فورييه لدالة غاوسية $\\mathcal{F}\\{e^{-a t^2}\\}(\\omega)$ مع توضيح مبدأ عدم اليقين." 
    },
  ];

  const quickFormulaCategories = [
    {
      name: "الفيزياء الكوانتية والنووية",
      formulas: [
        { label: "معادلة شرودنغر", code: "i\\hbar \\frac{\\partial}{\\partial t}\\Psi(\\mathbf{r},t) = \\left[ -\\frac{\\hbar^2}{2m}\\nabla^2 + V(\\mathbf{r},t) \\right] \\Psi(\\mathbf{r},t)" },
        { label: "مبدأ هايزنبرغ لعدم اليقين", code: "\\Delta x \\cdot \\Delta p \\ge \\frac{\\hbar}{2}" },
        { label: "معادلة ديراك للجسيمات النسبية", code: "(i\\gamma^\\mu \\partial_\\mu - m)\\psi = 0" },
        { label: "تكافؤ الكتلة والطاقة", code: "E^2 = (pc)^2 + (m_0 c^2)^2" },
      ]
    },
    {
      name: "الكهرومغناطيسية والنسبية العامة",
      formulas: [
        { label: "معادلات ماكسويل (تفاضلية)", code: "\\nabla \\cdot \\mathbf{E} = \\frac{\\rho}{\\varepsilon_0}, \\quad \\nabla \\times \\mathbf{E} = -\\frac{\\partial \\mathbf{B}}{\\partial t}, \\quad \\nabla \\cdot \\mathbf{B} = 0, \\quad \\nabla \\times \\mathbf{B} = \\mu_0\\mathbf{J} + \\mu_0\\varepsilon_0\\frac{\\partial\\mathbf{E}}{\\partial t}" },
        { label: "معادلة أينشتاين للجاذبية", code: "G_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4} T_{\\mu\\nu}" },
        { label: "متري شوارزشيلد للزمكان", code: "ds^2 = -\\left(1 - \\frac{2GM}{c^2 r}\\right) c^2 dt^2 + \\left(1 - \\frac{2GM}{c^2 r}\\right)^{-1} dr^2 + r^2 d\\Omega^2" },
      ]
    },
    {
      name: "الرياضيات والتفاضل والتكامل",
      formulas: [
        { label: "متطابقة أويلر الأنيقة", code: "e^{i\\pi} + 1 = 0" },
        { label: "تحويل فورييه المستمر", code: "\\hat{f}(\\xi) = \\int_{-\\infty}^{\\infty} f(x) e^{-2\\pi i x \\xi} dx" },
        { label: "نظرية ستوكس للتدفق والدوران", code: "\\oint_{\\partial \\Sigma} \\mathbf{F} \\cdot d\\mathbf{r} = \\iint_{\\Sigma} (\\nabla \\times \\mathbf{F}) \\cdot d\\mathbf{S}" },
        { label: "مصفوفة التحويل الخطي", code: "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}^{-1} = \\frac{1}{ad - bc} \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}" },
      ]
    }
  ];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    if (thoughtTraces.length > 0) {
      setExpandedTraceId(thoughtTraces[thoughtTraces.length - 1].id);
    }
  }, [thoughtTraces]);

  const handleFiles = async (files: FileList | File[]) => {
    const fileList = Array.from(files);
    for (const file of fileList) {
      const isImage = file.type.startsWith("image/");
      const isDoc = file.type.includes("pdf") || file.type.includes("text") || file.type.includes("json") || file.type.includes("csv") || file.name.endsWith(".py") || file.name.endsWith(".ts") || file.name.endsWith(".js") || file.name.endsWith(".txt") || file.name.endsWith(".md");

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const newAttachment: ChatAttachment = {
          id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          name: file.name,
          type: isImage ? "image" : isDoc ? "document" : "data",
          mimeType: file.type || "application/octet-stream",
          size: file.size,
          dataUrl: result,
          extractedText: !isImage && typeof result === "string" && !file.type.includes("pdf") ? result : undefined,
        };
        setAttachments((prev) => [...prev, newAttachment]);
      };

      if (isImage || file.type.includes("pdf")) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (e.clipboardData.files && e.clipboardData.files.length > 0) {
      handleFiles(e.clipboardData.files);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputText.trim() && attachments.length === 0) || isThinking) return;
    onSendMessage(inputText, strategy, attachments);
    setInputText("");
    setAttachments([]);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const insertFormula = (latex: string) => {
    setInputText((prev) => `${prev} $$${latex}$$ `);
    setShowFormulaDrawer(false);
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col h-[calc(100vh-8.5rem)] max-w-6xl mx-auto px-4 py-4 relative transition-colors ${
        isDragging ? "ring-2 ring-indigo-500/80 bg-indigo-950/20 rounded-3xl" : ""
      }`}
    >
      {/* Drag & Drop Visual Overlay */}
      {isDragging && (
        <div className="absolute inset-4 z-50 rounded-3xl bg-slate-950/90 border-2 border-dashed border-indigo-400 flex flex-col items-center justify-center pointer-events-none backdrop-blur-sm">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-400 flex items-center justify-center mb-3">
            <Paperclip className="w-8 h-8 text-indigo-400 animate-bounce" />
          </div>
          <h3 className="text-lg font-bold text-slate-100">أفلت المستندات أو الصور هنا</h3>
          <p className="text-sm text-indigo-300">يتم تحميل الملفات وتضمينها فوراً في منظومة التحليل والمعادلات</p>
        </div>
      )}

      {/* Top Strategy & Tools Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/70 border border-slate-800 rounded-2xl p-3 mb-4 backdrop-blur-md">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>محرك الاستدلال:</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setStrategy("tree_of_thought")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                strategy === "tree_of_thought"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>شجرة التفكير (ToT)</span>
            </button>
            <button
              type="button"
              onClick={() => setStrategy("chain_of_thought")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                strategy === "chain_of_thought"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>سلسلة التفكير (CoT)</span>
            </button>
          </div>
        </div>

        {/* Quick Actions (Math & Physics Formulas Drawer) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowFormulaDrawer(!showFormulaDrawer)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 text-xs font-semibold text-indigo-300 transition-all shadow-sm"
          >
            <Sigma className="w-3.5 h-3.5 text-indigo-400" />
            <span>معادلات الرياضيات والفيزياء</span>
          </button>
        </div>
      </div>

      {/* Math & Physics Formula Insertion Palette */}
      {showFormulaDrawer && (
        <div className="mb-4 p-4 bg-slate-900/95 border border-indigo-500/30 rounded-2xl shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Atom className="w-4 h-4 text-purple-400" />
              <h4 className="text-xs font-bold text-slate-100">مكتبة الصيغ والمعادلات العلمية والفيزيائية</h4>
              <span className="text-[10px] text-slate-400 font-mono">(LaTeX KaTeX Enabled)</span>
            </div>
            <button
              onClick={() => setShowFormulaDrawer(false)}
              className="text-slate-400 hover:text-slate-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {quickFormulaCategories.map((cat, cIdx) => (
              <div key={cIdx} className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5">
                <h5 className="text-[11px] font-bold text-indigo-300 mb-2">{cat.name}</h5>
                <div className="space-y-1.5">
                  {cat.formulas.map((item, fIdx) => (
                    <button
                      key={fIdx}
                      type="button"
                      onClick={() => insertFormula(item.code)}
                      className="w-full text-right p-2 rounded-lg bg-slate-900/80 hover:bg-indigo-950/60 border border-slate-800/60 hover:border-indigo-500/40 text-slate-200 hover:text-indigo-200 transition-all flex flex-col gap-1 text-[11px]"
                    >
                      <span className="font-semibold text-slate-300">{item.label}</span>
                      <span className="font-mono text-[10px] text-slate-400 truncate dir-ltr">{item.code}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages & Traces Stream */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-6">
        {thoughtTraces.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 py-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center mb-4 shadow-xl shadow-indigo-500/10">
              <Compass className="w-8 h-8 text-indigo-400 animate-pulse" />
            </div>
            <h2 className="text-xl font-bold text-slate-100 mb-2">مرحباً بك في العقل التنفيذي والفيزيائي Omega Brain</h2>
            <p className="text-sm text-slate-400 max-w-xl mb-6 leading-relaxed">
              منظومة استدلال فائقة تدعم كتابة معادلات الرياضيات والفيزياء بدقة LaTeX كاملة، تحليل المستندات والصور المتعددة، التفكير الشجري (ToT)، والتأمل الذاتي Metacognition.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-3xl text-right">
              {presetPrompts.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputText(preset.text);
                  }}
                  className="p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-indigo-500/40 text-right group transition-all"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-indigo-300 group-hover:text-indigo-200">{preset.title}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{preset.text}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          thoughtTraces.map((trace) => {
            const isExpanded = expandedTraceId === trace.id;
            return (
              <div key={trace.id} className="space-y-4">
                {/* User Input Bubble with Attachments */}
                <div className="flex justify-start">
                  <div className="max-w-3xl bg-indigo-950/50 border border-indigo-500/30 rounded-2xl rounded-tr-sm p-4 text-slate-100 shadow-md">
                    <div className="text-[11px] font-semibold text-indigo-400 mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span>أنت</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400 font-mono text-[10px]">{trace.timestamp}</span>
                      </div>
                      {trace.attachments && trace.attachments.length > 0 && (
                        <span className="text-[10px] bg-indigo-900/60 border border-indigo-500/30 px-2 py-0.5 rounded-md text-indigo-200">
                          {trace.attachments.length} مرفقات
                        </span>
                      )}
                    </div>

                    {/* Render User Attachments if any */}
                    {trace.attachments && trace.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2.5 mb-3">
                        {trace.attachments.map((att) => (
                          <div
                            key={att.id}
                            className="flex items-center gap-2 p-2 bg-slate-900/90 border border-indigo-500/30 rounded-xl overflow-hidden shadow-sm"
                          >
                            {att.type === "image" ? (
                              <div 
                                onClick={() => setSelectedImageModal(att.dataUrl)}
                                className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-700 cursor-pointer group shrink-0"
                              >
                                <img src={att.dataUrl} alt={att.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                  <Eye className="w-4 h-4 text-white" />
                                </div>
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-indigo-950 flex items-center justify-center text-indigo-400 shrink-0">
                                <FileText className="w-5 h-5" />
                              </div>
                            )}
                            <div className="min-w-0 pr-1">
                              <p className="text-xs font-semibold text-slate-200 truncate max-w-[160px]">{att.name}</p>
                              <span className="text-[10px] font-mono text-slate-400">{formatFileSize(att.size)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="text-sm font-medium leading-relaxed">
                      <MathRenderer content={trace.input} />
                    </div>
                  </div>
                </div>

                {/* Omega Response & Thought Architecture Accordion */}
                <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl overflow-hidden shadow-xl">
                  {/* Thought Inspection Toggle Header */}
                  <div 
                    onClick={() => setExpandedTraceId(isExpanded ? null : trace.id)}
                    className="flex items-center justify-between p-3.5 bg-slate-950/60 border-b border-slate-800/60 cursor-pointer hover:bg-slate-950/80 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-lg">
                        <Zap className="w-3.5 h-3.5 text-indigo-400" />
                        <span>سجل التفكير المعرفي (Thought Trace)</span>
                      </span>

                      {/* Literary vs Scientific Domain Badge */}
                      {trace.classification && (
                        <span className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg border ${
                          trace.classification.type === "literary"
                            ? "bg-rose-500/15 border-rose-500/30 text-rose-300"
                            : trace.classification.type === "scientific"
                            ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-300"
                            : "bg-purple-500/15 border-purple-500/30 text-purple-300"
                        }`}>
                          {trace.classification.type === "literary" ? (
                            <Feather className="w-3.5 h-3.5 text-rose-400" />
                          ) : trace.classification.type === "scientific" ? (
                            <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />
                          ) : (
                            <Atom className="w-3.5 h-3.5 text-purple-400" />
                          )}
                          <span>{trace.classification.domain_label || (trace.classification.type === "literary" ? "أدبي وبلاغي" : "علمي وفيزيائي")}</span>
                        </span>
                      )}

                      <span className="text-[11px] text-slate-400">
                        الاستراتيجية: <strong className="text-slate-200 font-mono">{trace.reasoning.strategy}</strong>
                      </span>
                      <span className="text-[11px] text-slate-400">
                        جودة التأمل: <strong className="text-emerald-300 font-mono">{(trace.reflection.quality_score * 100).toFixed(0)}%</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="text-xs font-medium">{isExpanded ? "طي التفاصيل" : "عرض خطوات التفكير"}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>

                  {/* Collapsible Deep Cognitive Details */}
                  {isExpanded && (
                    <div className="p-4 bg-slate-950/40 border-b border-slate-800/60 space-y-4">
                      {/* 0. Question Comprehension & Domain Analysis Card */}
                      {trace.classification && (
                        <div className={`p-3.5 rounded-xl border ${
                          trace.classification.type === "literary"
                            ? "bg-rose-950/20 border-rose-500/30"
                            : trace.classification.type === "scientific"
                            ? "bg-cyan-950/20 border-cyan-500/30"
                            : "bg-purple-950/20 border-purple-500/30"
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {trace.classification.type === "literary" ? (
                                <BookOpen className="w-4 h-4 text-rose-400" />
                              ) : (
                                <FlaskConical className="w-4 h-4 text-cyan-400" />
                              )}
                              <span className="text-xs font-bold text-slate-100">
                                تشخيص وتمايز السؤال: {trace.classification.domain_label}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                              مستوى العمق: {trace.classification.depth_level || "متقدم"}
                            </span>
                          </div>

                          <p className="text-xs text-slate-300 leading-relaxed mb-2.5">
                            <strong className="text-slate-100">الفهم الجوهري لمقصد السائل: </strong>
                            {trace.classification.comprehension_summary}
                          </p>

                          {trace.classification.style_applied && (
                            <p className="text-[11px] text-slate-400 mb-2.5">
                              <strong className="text-slate-300">الأسلوب المتبع: </strong>
                              {trace.classification.style_applied}
                            </p>
                          )}

                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {trace.classification.key_themes?.map((theme, tIdx) => (
                              <span key={tIdx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900/80 border border-slate-700/80 text-slate-300">
                                #{theme}
                              </span>
                            ))}
                            {trace.classification.rhetorical_or_scientific_markers?.map((marker, mIdx) => (
                              <span key={mIdx} className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-950/60 border border-indigo-500/30 text-indigo-300">
                                ✦ {marker}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 1. Tree of Thought Visualizer */}
                      {trace.reasoning.branches && trace.reasoning.branches.length > 0 && (
                        <div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 mb-2">
                            <GitFork className="w-3.5 h-3.5 text-indigo-400" />
                            <span>مسارات التفكير الشجري (ToT Multi-Branch Exploration):</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                            {trace.reasoning.branches.map((branch) => {
                              const isBest = trace.reasoning.best_branch?.id === branch.id;
                              return (
                                <div
                                  key={branch.id}
                                  className={`p-3 rounded-xl border transition-all text-xs ${
                                    isBest
                                      ? "bg-indigo-950/40 border-indigo-500/60 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/40"
                                      : "bg-slate-900/50 border-slate-800 text-slate-300"
                                  }`}
                                >
                                  <div className="flex items-center justify-between mb-1.5">
                                    <span className="font-bold flex items-center gap-1">
                                      {isBest && <Award className="w-3.5 h-3.5 text-amber-400" />}
                                      <span>المسار {branch.id}</span>
                                    </span>
                                    <span className={`px-1.5 py-0.5 rounded font-mono text-[10px] font-bold ${
                                      isBest ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-slate-800 text-slate-400"
                                    }`}>
                                      درجة التقييم: {(branch.score * 100).toFixed(0)}%
                                    </span>
                                  </div>
                                  <div className="text-slate-300 leading-relaxed">
                                    <MathRenderer content={branch.content} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* 2. Chain of Thought Steps if present */}
                      {trace.reasoning.steps && trace.reasoning.steps.length > 0 && (
                        <div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 mb-2">
                            <ListOrdered className="w-3.5 h-3.5 text-indigo-400" />
                            <span>خطوات الاستدلال المتسلسل (CoT):</span>
                          </div>
                          <div className="space-y-1.5">
                            {trace.reasoning.steps.map((step, sIdx) => (
                              <div key={sIdx} className="text-xs bg-slate-900/70 border border-slate-800 p-2.5 rounded-lg text-slate-300 flex items-start gap-2">
                                <span className="w-4 h-4 rounded-full bg-indigo-900/80 text-indigo-300 text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                                  {sIdx + 1}
                                </span>
                                <div className="flex-1">
                                  <MathRenderer content={step} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 3. Planning & World Model Summary Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                        {/* Plan */}
                        <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl text-xs">
                          <div className="flex items-center gap-1.5 font-bold text-slate-200 mb-2">
                            <Layers className="w-3.5 h-3.5 text-purple-400" />
                            <span>خطة التنفيذ الهرمية ({trace.plan.steps.length} مراحل):</span>
                          </div>
                          <div className="space-y-1.5">
                            {trace.plan.steps.map((pStep, pIdx) => (
                              <div key={pIdx} className="flex items-center justify-between gap-2 p-1.5 bg-slate-950/60 rounded border border-slate-800/60">
                                <span className="text-slate-300 text-[11px]">{pStep.description}</span>
                                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-indigo-500/20 text-indigo-300 rounded">
                                  مرحلة {pStep.id}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Metacognitive Reflection */}
                        <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl text-xs">
                          <div className="flex items-center gap-1.5 font-bold text-slate-200 mb-2">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>التأمل الذاتي (Self-Reflection):</span>
                          </div>
                          <div className="space-y-1 text-[11px] text-slate-300">
                            {trace.reflection.lessons.map((lesson, lIdx) => (
                              <div key={lIdx} className="flex items-center gap-1 text-emerald-300/90">
                                <span>✓</span>
                                <span>{lesson}</span>
                              </div>
                            ))}
                            {trace.reflection.improvement_suggestions.map((sug, sIdx) => (
                              <div key={sIdx} className="flex items-center gap-1 text-amber-300/90">
                                <span>⚡</span>
                                <span>{sug}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Main AI Response Body (Rendered with KaTeX Math & Physics) */}
                  <div className="p-5 text-slate-200">
                    <div className="flex items-center justify-between mb-4 border-b border-slate-800/60 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xs font-extrabold font-mono shadow-md shadow-indigo-600/30">
                          Ω
                        </div>
                        <div>
                          <span className="font-bold text-xs text-indigo-200 block">استجابة العقل التنفيذي والمعرفي Omega Brain</span>
                          <span className="text-[10px] text-slate-400">دقة المعادلات والتحليل الفيزيائي والرياضي</span>
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(trace.response, trace.id)}
                        className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors"
                      >
                        {copiedId === trace.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedId === trace.id ? "تم النسخ" : "نسخ الإجابة"}</span>
                      </button>
                    </div>

                    <div className="text-sm font-normal leading-relaxed text-slate-100">
                      <MathRenderer content={trace.response} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {isThinking && (
          <div className="bg-slate-900/80 border border-indigo-500/40 rounded-2xl p-5 shadow-2xl animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-mono text-xs font-bold animate-spin">
                Ω
              </div>
              <div>
                <h4 className="text-xs font-bold text-indigo-300">جاري استدعاء محركات التفكير والصياغة الرياضية في Omega Brain...</h4>
                <p className="text-[11px] text-slate-400">تحليل المرفقات • استخراج القوانين الفيزيائية • التفكير الشجري (ToT) • صياغة LaTeX • التدقيق الذاتي</p>
              </div>
            </div>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Image Preview Modal */}
      {selectedImageModal && (
        <div 
          onClick={() => setSelectedImageModal(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-2 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedImageModal(null)}
              className="absolute top-4 right-4 z-10 bg-slate-950/80 text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={selectedImageModal} alt="Preview" className="max-w-full max-h-[80vh] rounded-xl object-contain" />
          </div>
        </div>
      )}

      {/* Input Form with Attachments Bar */}
      <form onSubmit={handleSubmit} className="mt-4 shrink-0" onPaste={handlePaste}>
        {/* Pending Attachments Strip */}
        {attachments.length > 0 && (
          <div className="flex items-center gap-2 mb-2 p-2 bg-slate-900/90 border border-indigo-500/30 rounded-xl overflow-x-auto shadow-md">
            {attachments.map((att) => (
              <div
                key={att.id}
                className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-950 rounded-lg border border-slate-800 shrink-0 text-xs"
              >
                {att.type === "image" ? (
                  <img src={att.dataUrl} alt={att.name} className="w-6 h-6 rounded object-cover border border-slate-700" />
                ) : (
                  <FileText className="w-4 h-4 text-indigo-400" />
                )}
                <span className="text-slate-200 truncate max-w-[140px] text-[11px] font-medium">{att.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">({formatFileSize(att.size)})</span>
                <button
                  type="button"
                  onClick={() => removeAttachment(att.id)}
                  className="text-slate-400 hover:text-rose-400 p-0.5 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="relative flex items-end gap-2 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-2.5 shadow-2xl focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 backdrop-blur-xl transition-all">
          {/* File Upload Hidden Inputs */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
            multiple
            accept=".pdf,.txt,.json,.csv,.md,.py,.ts,.js,.doc,.docx"
            className="hidden"
          />
          <input
            type="file"
            ref={imageInputRef}
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
            multiple
            accept="image/*"
            className="hidden"
          />

          {/* Upload Buttons */}
          <div className="flex items-center gap-1 shrink-0 pb-1">
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="p-2 rounded-xl text-slate-400 hover:text-indigo-300 hover:bg-slate-800 transition-colors"
              title="رفع صور ورسومات بيانية ومعادلات مصورة"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-xl text-slate-400 hover:text-indigo-300 hover:bg-slate-800 transition-colors"
              title="رفع مستندات أو ملفات برمجية (PDF, TXT, CSV, JSON, Code)"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setShowFormulaDrawer(!showFormulaDrawer)}
              className="p-2 rounded-xl text-slate-400 hover:text-purple-300 hover:bg-slate-800 transition-colors"
              title="إدراج معادلات رياضية وفيزيائية (LaTeX)"
            >
              <Sigma className="w-4 h-4" />
            </button>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="اطرح مسألتك الرياضية، سؤالك الفيزيائي، اطلب تحليل مستند أو صورة، أو اكتب استفسارك هنا..."
            rows={2}
            className="flex-1 bg-transparent border-0 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-0 resize-none px-2 py-1"
          />

          <button
            type="submit"
            disabled={(!inputText.trim() && attachments.length === 0) || isThinking}
            className={`p-3 rounded-xl font-bold flex items-center justify-center transition-all shrink-0 ${
              (!inputText.trim() && attachments.length === 0) || isThinking
                ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/30"
            }`}
          >
            <Send className="w-4 h-4 rotate-180" />
          </button>
        </div>
      </form>
    </div>
  );
};
