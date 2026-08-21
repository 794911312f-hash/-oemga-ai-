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
  CheckCircle2,
  Cloud,
  CloudUpload,
  CloudDownload,
  History,
  Trash2,
  Database,
  Plus,
  HelpCircle,
  AlertCircle,
  Filter,
  Globe
} from "lucide-react";
import { ThoughtTrace, ReasoningStrategy, ChatAttachment, EpistemicClaimType } from "../types";
import { MathRenderer } from "./MathRenderer";
import { ProbabilisticToTVisualizer } from "./ProbabilisticToTVisualizer";
import { MetaCognitiveVerifier } from "./MetaCognitiveVerifier";
import { CognitivePipelineFlow } from "./CognitivePipelineFlow";
import { CentralOrchestratorView } from "./CentralOrchestratorView";
import { 
  saveThinkingSessionToCloud, 
  fetchThinkingSessionsFromCloud, 
  deleteThinkingSessionFromCloud, 
  CloudThinkingSession 
} from "../lib/firebase";

interface BrainChatProps {
  onSendMessage: (text: string, strategy: ReasoningStrategy, attachments?: ChatAttachment[], options?: { enableSearchAgent?: boolean }) => void;
  isThinking: boolean;
  thoughtTraces: ThoughtTrace[];
  isFocusMode?: boolean;
  onRestoreSession?: (traces: ThoughtTrace[]) => void;
  onNewSession?: () => void;
}

export const BrainChat: React.FC<BrainChatProps> = ({
  onSendMessage,
  isThinking,
  thoughtTraces,
  isFocusMode = false,
  onRestoreSession,
  onNewSession,
}) => {
  const [inputText, setInputText] = useState("");
  const [strategy, setStrategy] = useState<ReasoningStrategy>("tree_of_thought");
  const [searchAgentActive, setSearchAgentActive] = useState<boolean>(true);
  const [expandedTraceId, setExpandedTraceId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [selectedImageModal, setSelectedImageModal] = useState<string | null>(null);
  const [showFormulaDrawer, setShowFormulaDrawer] = useState<boolean>(false);

  // Epistemic Truth Filter: all | facts | hypotheses | proposals
  const [epistemicFilter, setEpistemicFilter] = useState<"all" | "facts" | "hypotheses" | "proposals">("all");

  // Firebase Sessions State
  const [savedSessions, setSavedSessions] = useState<CloudThinkingSession[]>([]);
  const [showSessionsModal, setShowSessionsModal] = useState(false);
  const [isSavingSession, setIsSavingSession] = useState(false);
  const [sessionSaveFeedback, setSessionSaveFeedback] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const presetPrompts = [
    { 
      title: "🌐 الأخبار الحية والتقصي اللحظي: أحدث مستجدات الجزائر اليوم", 
      text: "ما هي أحدث الأخبار والمستجدات الميدانية والقرارات في الجزائر اليوم مع ذكر المصادر الموثوقة والتواريخ اللحظية؟" 
    },
    { 
      title: "🎨 توليد صورة: ساحر شرير أمام قلعة قديمة (2D)", 
      text: "ارسم صورة لساحر شرير امام قلعة قديمة , 2D" 
    },
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

  const loadCloudSessions = async () => {
    const sessions = await fetchThinkingSessionsFromCloud(15);
    setSavedSessions(sessions);
  };

  useEffect(() => {
    loadCloudSessions();
  }, []);

  const handleSaveCurrentSessionToCloud = async () => {
    if (thoughtTraces.length === 0) return;
    setIsSavingSession(true);
    setSessionSaveFeedback(null);
    try {
      const firstInput = thoughtTraces[0]?.input || "جلسة استدلال معرفية";
      const title = firstInput.slice(0, 50) + (firstInput.length > 50 ? "..." : "");
      const sessionId = `session_${Date.now()}`;
      const res = await saveThinkingSessionToCloud(sessionId, title, thoughtTraces, strategy);
      if (res.success) {
        setSessionSaveFeedback("تم حفظ جلسة التفكير بنجاح في Firebase Firestore!");
        await loadCloudSessions();
        setTimeout(() => setSessionSaveFeedback(null), 4000);
      } else {
        setSessionSaveFeedback("تعذر حفظ الجلسة: " + (res.error || ""));
      }
    } catch (e: any) {
      setSessionSaveFeedback("حدث خطأ أثناء الحفظ السحابي");
    } finally {
      setIsSavingSession(false);
    }
  };

  const handleRestoreSessionFromCloud = (session: CloudThinkingSession) => {
    if (session.traces && onRestoreSession) {
      onRestoreSession(session.traces);
      if (session.activeStrategy) {
        setStrategy(session.activeStrategy as ReasoningStrategy);
      }
      setShowSessionsModal(false);
    }
  };

  const handleDeleteCloudSession = async (sessionId: string) => {
    const ok = await deleteThinkingSessionFromCloud(sessionId);
    if (ok) {
      setSavedSessions((prev) => prev.filter((s) => s.id !== sessionId));
    }
  };

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
    onSendMessage(inputText, strategy, attachments, { enableSearchAgent: searchAgentActive });
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
      className={`flex flex-col max-w-6xl mx-auto px-4 py-4 relative transition-all duration-300 ${
        isFocusMode 
          ? "h-[calc(100vh-5rem)] max-w-5xl" 
          : "h-[calc(100vh-8.5rem)]"
      } ${
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

          {/* Search Agent Live Toggle */}
          <button
            type="button"
            onClick={() => setSearchAgentActive(!searchAgentActive)}
            id="search-agent-toggle-btn"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              searchAgentActive
                ? "bg-emerald-950/80 border-emerald-500/50 text-emerald-300 shadow-sm shadow-emerald-900/20"
                : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
            title="تفعيل وكيل البحث الحي (Search Agent) عبر Google Search Grounding للتحقق من الأخبار اللحظية والمعطيات الميدانية"
          >
            <Globe className={`w-3.5 h-3.5 ${searchAgentActive ? "text-emerald-400 animate-pulse" : "text-slate-500"}`} />
            <span>Search Agent (Google Search)</span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono ${searchAgentActive ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-800 text-slate-400"}`}>
              {searchAgentActive ? "نشط" : "معطل"}
            </span>
          </button>
        </div>

        {/* Quick Actions (New Window, Firebase Cloud Sync & Math Formulas) */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* New Discussion Window Button */}
          {onNewSession && (
            <button
              type="button"
              onClick={onNewSession}
              id="new-discussion-window-btn"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-900/20 cursor-pointer"
              title="فتح نافذة نقاش ومحادثة جديدة تماماً مع تصفير السياق"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>محادثة جديدة</span>
            </button>
          )}

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-indigo-500/20">
            {thoughtTraces.length > 0 && (
              <button
                type="button"
                onClick={handleSaveCurrentSessionToCloud}
                disabled={isSavingSession}
                id="firebase-save-chat-session-btn"
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white text-[11px] font-bold transition-all shadow-sm disabled:opacity-50"
                title="حفظ جلسة التفكير الحالية مع كافة الفروع في Firebase"
              >
                <CloudUpload className={`w-3 h-3 ${isSavingSession ? "animate-bounce" : ""}`} />
                <span>حفظ الجلسة</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                loadCloudSessions();
                setShowSessionsModal(true);
              }}
              id="firebase-view-sessions-btn"
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 text-[11px] font-semibold transition-all"
              title="استعراض وتذكر جلسات التفكير السابقة المحفوظة في الذاكرة"
            >
              <History className="w-3 h-3 text-indigo-400" />
              <span>المحادثات السابقة ({savedSessions.length})</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowFormulaDrawer(!showFormulaDrawer)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 text-xs font-semibold text-indigo-300 transition-all shadow-sm"
          >
            <Sigma className="w-3.5 h-3.5 text-indigo-400" />
            <span>معادلات LaTeX</span>
          </button>
        </div>
      </div>

      {/* Epistemic Truth & Human Distinction Filtering Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950/70 border border-slate-800/80 rounded-xl px-3.5 py-2 mb-4 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-slate-400 font-medium">الفصل المعرفي والتمييز الإدراكي:</span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setEpistemicFilter("all")}
            className={`px-2.5 py-1 rounded-lg transition-all font-medium ${
              epistemicFilter === "all"
                ? "bg-slate-800 text-white font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            الكل (سياق شامل)
          </button>
          <button
            onClick={() => setEpistemicFilter("facts")}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 font-medium ${
              epistemicFilter === "facts"
                ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold"
                : "text-slate-400 hover:text-emerald-400"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>الحقائق والثوابت المبرهنة (Facts)</span>
          </button>
          <button
            onClick={() => setEpistemicFilter("hypotheses")}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 font-medium ${
              epistemicFilter === "hypotheses"
                ? "bg-amber-950 text-amber-300 border border-amber-500/40 font-bold"
                : "text-slate-400 hover:text-amber-400"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>الفرضيات والنظريات (Hypotheses)</span>
          </button>
          <button
            onClick={() => setEpistemicFilter("proposals")}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 font-medium ${
              epistemicFilter === "proposals"
                ? "bg-purple-950 text-purple-300 border border-purple-500/40 font-bold"
                : "text-slate-400 hover:text-purple-400"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span>المقترحات والاجتهادات الاستدلالية (Proposals)</span>
          </button>
        </div>
      </div>

      {sessionSaveFeedback && (
        <div className="mb-3 px-3 py-2 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{sessionSaveFeedback}</span>
          </div>
          <button onClick={() => setSessionSaveFeedback(null)} className="text-slate-400 hover:text-white text-xs">✕</button>
        </div>
      )}

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

                      {/* Literary vs Scientific vs General Domain Badge */}
                      {trace.classification && (
                        <span className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg border ${
                          trace.classification.type === "literary"
                            ? "bg-rose-500/15 border-rose-500/30 text-rose-300"
                            : trace.classification.type === "scientific"
                            ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-300"
                            : "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                        }`}>
                          {trace.classification.type === "literary" ? (
                            <Feather className="w-3.5 h-3.5 text-rose-400" />
                          ) : trace.classification.type === "scientific" ? (
                            <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                          <span>{trace.classification.domain_label || (trace.classification.type === "literary" ? "أدبي وبلاغي" : trace.classification.type === "scientific" ? "علمي وفيزيائي" : "حوار عام وترحيب")}</span>
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
                      {/* 0. Dynamic Central Orchestrator Decisions View */}
                      {trace.orchestrator_decision && (
                        <CentralOrchestratorView decision={trace.orchestrator_decision} userQuery={trace.input} />
                      )}

                      {/* Flow Diagram: The Complete Cognitive Execution Pipeline */}
                      <CognitivePipelineFlow trace={trace} />

                      {/* Search Agent Live Grounding Step */}
                      {trace.search_agent_result && (
                        <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4 text-emerald-400 animate-pulse" />
                              <span className="text-xs font-bold text-emerald-200">
                                وكيل البحث الميداني الحي (Google Search Grounding Agent)
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {trace.search_agent_result.latency_ms && (
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                                  {trace.search_agent_result.latency_ms} ms
                                </span>
                              )}
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-200 border border-emerald-500/30">
                                {trace.search_agent_result.source_engine || "Google Search Engine"}
                              </span>
                            </div>
                          </div>
                          <div className="text-[11px] text-slate-300 space-y-1">
                            <p>
                              <strong className="text-slate-200">استعلامات البحث المنفذة: </strong>
                              <span className="font-mono text-emerald-300">
                                {trace.search_agent_result.executed_queries && trace.search_agent_result.executed_queries.length > 0
                                  ? trace.search_agent_result.executed_queries.join(" • ")
                                  : trace.search_agent_result.query}
                              </span>
                            </p>
                            {trace.search_agent_result.search_queries && trace.search_agent_result.search_queries.length > 0 && (
                              <div className="flex flex-wrap gap-1 pt-1">
                                {trace.search_agent_result.search_queries.map((q, qIdx) => (
                                  <span key={qIdx} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-emerald-500/20 text-emerald-300 font-mono">
                                    🔍 {q}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* 0. Question Comprehension & Domain Analysis Card */}
                      {trace.classification && (
                        <div className={`p-3.5 rounded-xl border ${
                          trace.classification.type === "literary"
                            ? "bg-rose-950/20 border-rose-500/30"
                            : trace.classification.type === "scientific"
                            ? "bg-cyan-950/20 border-cyan-500/30"
                            : "bg-emerald-950/20 border-emerald-500/30"
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {trace.classification.type === "literary" ? (
                                <BookOpen className="w-4 h-4 text-rose-400" />
                              ) : trace.classification.type === "scientific" ? (
                                <FlaskConical className="w-4 h-4 text-cyan-400" />
                              ) : (
                                <Sparkles className="w-4 h-4 text-emerald-400" />
                              )}
                              <span className="text-xs font-bold text-slate-100">
                                تشخيص وتمايز السؤال: {trace.classification.domain_label}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                              مستوى العمق: {trace.classification.depth_level || "مباشر"}
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

                      {/* 0.5. Epistemic Truth Matrix & Human Cognitive Distinction (حقائق / فرضيات / مقترحات) */}
                      {trace.epistemic_matrix && (
                        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-lg space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-100">
                              <ShieldCheck className="w-4 h-4 text-emerald-400" />
                              <span>مصفوفة الفصل المعرفي الدقيق (Epistemic Matrix):</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-mono">
                              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                                حقائق: {((trace.epistemic_matrix.fact_ratio || 0.7) * 100).toFixed(0)}%
                              </span>
                              <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/30">
                                فرضيات: {((trace.epistemic_matrix.hypothesis_ratio || 0.15) * 100).toFixed(0)}%
                              </span>
                              <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
                                مقترحات: {((trace.epistemic_matrix.proposal_ratio || 0.15) * 100).toFixed(0)}%
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                            {/* Facts Column */}
                            <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 space-y-1.5">
                              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-300">
                                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                <span>الحقائق والثوابت المؤكدة</span>
                              </div>
                              <ul className="space-y-1 text-[11px] text-slate-200">
                                {trace.epistemic_matrix.facts?.map((fact, fIdx) => (
                                  <li key={fIdx} className="flex items-start gap-1">
                                    <span className="text-emerald-400 font-bold">✓</span>
                                    <span>{fact}</span>
                                  </li>
                                )) || <li className="text-slate-400">بيانات علمية مبرهنة</li>}
                              </ul>
                            </div>

                            {/* Hypotheses Column */}
                            <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/30 space-y-1.5">
                              <div className="flex items-center gap-1 text-[11px] font-bold text-amber-300">
                                <span className="w-2 h-2 rounded-full bg-amber-400" />
                                <span>الفرضيات والنماذج قيد البحث</span>
                              </div>
                              <ul className="space-y-1 text-[11px] text-slate-200">
                                {trace.epistemic_matrix.hypotheses?.map((hypo, hIdx) => (
                                  <li key={hIdx} className="flex items-start gap-1">
                                    <span className="text-amber-400 font-bold">~</span>
                                    <span>{hypo}</span>
                                  </li>
                                )) || <li className="text-slate-400">فرضيات علمية تتطلب برهنة</li>}
                              </ul>
                            </div>

                            {/* Proposals Column with Explicit Disclaimer */}
                            <div className="p-2.5 rounded-lg bg-purple-950/20 border border-purple-500/30 space-y-1.5">
                              <div className="flex items-center justify-between text-[11px] font-bold text-purple-300">
                                <div className="flex items-center gap-1">
                                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                                  <span>المقترحات والاجتهادات</span>
                                </div>
                                <span className="text-[9px] px-1 py-0.2 rounded bg-purple-900/60 text-purple-200">غير قطعي</span>
                              </div>
                              <ul className="space-y-1 text-[11px] text-slate-200">
                                {trace.epistemic_matrix.proposals?.map((prop, pIdx) => (
                                  <li key={pIdx} className="flex items-start gap-1">
                                    <span className="text-purple-400 font-bold">⚡</span>
                                    <span>{prop}</span>
                                  </li>
                                )) || <li className="text-slate-400">اجتهاد استدلالي مقترح</li>}
                              </ul>
                              <div className="mt-1 pt-1 border-t border-purple-500/20 text-[10px] text-purple-300/80 italic">
                                * تنبيه: هذا القسم يمثل اقتراحاً واجتهاداً استدلالياً من النموذج وليس حقيقة قطعية.
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 0.8. Adaptive Vector Context Retrieval Card */}
                      {trace.retrieved_vector_context && trace.retrieved_vector_context.length > 0 && (
                        <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Database className="w-4 h-4 text-cyan-400" />
                              <span className="text-xs font-bold text-cyan-200">
                                الذاكرة السياقية التكيفية المتجهة (Adaptive Vector Context):
                              </span>
                            </div>
                            <span className="text-[10px] font-mono bg-cyan-900/60 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">
                              {trace.retrieved_vector_context.length} سياقات مسترجعة
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {trace.retrieved_vector_context.map((ctx, cIdx) => (
                              <div key={cIdx} className="p-2 bg-slate-900/80 border border-slate-800 rounded-lg text-xs space-y-1">
                                <div className="flex items-center justify-between text-[10px]">
                                  <span className="font-bold text-cyan-300">{ctx.title || ctx.category}</span>
                                  <span className="font-mono text-slate-400">
                                    تطابق: {(Math.max(0, (ctx.similarity + 1) / 2) * 100).toFixed(0)}%
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-300 line-clamp-2">{ctx.text}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 1. Meta-Cognitive Verification Layer (Verifier vs Knowledge Graph) */}
                      {trace.meta_cognition && (
                        <MetaCognitiveVerifier
                          verification={trace.meta_cognition}
                          targetClaim={trace.input}
                        />
                      )}

                      {/* 2. Probabilistic Tree of Thought Visualizer: P(S) = \prod_{i=1}^n w_i \cdot C_i */}
                      {trace.reasoning.branches && trace.reasoning.branches.length > 0 && (
                        <ProbabilisticToTVisualizer
                          branches={trace.reasoning.branches}
                          bestBranchId={trace.reasoning.best_branch_id || trace.reasoning.best_branch?.id}
                          formulaExpression={trace.reasoning.evaluation_formula}
                        />
                      )}

                      {/* 3. Chain of Thought Steps if present */}
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

                    {/* Visual Artwork Display */}
                    {trace.generated_image && (
                      <div className="mb-5 rounded-2xl overflow-hidden border border-indigo-500/40 bg-slate-950/80 shadow-2xl">
                        <div className="p-3 bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/80 border-b border-indigo-500/20 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                              <ImageIcon className="w-4 h-4" />
                            </span>
                            <div>
                              <span className="text-xs font-bold text-slate-100 block">
                                اللوحة البصرية المولدة (AI Generated Artwork)
                              </span>
                              <span className="text-[10px] text-indigo-300/80 font-mono">
                                الأسلوب: {trace.generated_image.style || "2D Digital Illustration"}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedImageModal(trace.generated_image?.url || null)}
                              className="flex items-center gap-1 text-xs text-indigo-300 hover:text-white px-2.5 py-1 rounded-lg bg-indigo-950/60 border border-indigo-500/30 hover:border-indigo-400 transition-all"
                            >
                              <Maximize2 className="w-3.5 h-3.5" />
                              <span>تكبير وعرض كامل</span>
                            </button>
                            <a
                              href={trace.generated_image.url}
                              download="omega-artwork.jpg"
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 text-xs text-emerald-300 hover:text-white px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30 hover:border-emerald-400 transition-all"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>تحميل</span>
                            </a>
                          </div>
                        </div>

                        {/* Image Preview */}
                        <div className="relative group max-h-[500px] flex items-center justify-center bg-slate-950 p-2 overflow-hidden">
                          <img
                            src={trace.generated_image.url}
                            alt={trace.generated_image.prompt}
                            referrerPolicy="no-referrer"
                            className="max-h-[460px] w-auto max-w-full rounded-xl object-contain shadow-2xl transition-transform duration-300 group-hover:scale-[1.01]"
                          />
                        </div>

                        {/* Image Metadata & Prompt Bar */}
                        <div className="p-3 bg-slate-900/90 border-t border-slate-800 text-xs flex flex-col gap-1.5">
                          <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <span className="font-mono text-indigo-300">
                              ✦ الطلب الأصلي: {trace.generated_image.prompt}
                            </span>
                            <span className="text-[10px] font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-emerald-300">
                              {trace.generated_image.engine || "Gemini / Neural Visual Engine"}
                            </span>
                          </div>
                          {trace.generated_image.revised_prompt && (
                            <p className="text-[10px] font-mono text-slate-400/90 bg-slate-950/60 p-2 rounded border border-slate-800/80 leading-relaxed">
                              <strong className="text-slate-300">Prompt التوليد البصري المحسّن: </strong>
                              {trace.generated_image.revised_prompt}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Search Agent Live Grounding & Verified Sources Card */}
                    {trace.search_agent_result && (
                      <div className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900/80 to-teal-950/40 border border-emerald-500/40 text-xs shadow-xl">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-500/20 pb-3 mb-3">
                          <div className="flex items-center gap-2.5">
                            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-inner">
                              <Globe className="w-4 h-4 animate-pulse" />
                            </span>
                            <div>
                              <span className="font-bold text-emerald-200 block text-xs">
                                وكيل التقصي والبحث اللحظي (Google Search Agent & Ground Truth)
                              </span>
                              <span className="text-[10px] text-emerald-400/90">
                                تم جلب أحدث الأخبار والمعطيات الميدانية لحظياً والتحقق من مصداقيتها عبر الويب
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-mono">
                            {trace.search_agent_result.latency_ms && (
                              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                                زمن الاستجابة: {trace.search_agent_result.latency_ms} ms
                              </span>
                            )}
                            <span className="px-2.5 py-1 rounded-full bg-emerald-900/80 text-emerald-200 border border-emerald-500/40 flex items-center gap-1.5 font-bold shadow-sm">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                              <span>بث مباشر لحظي</span>
                            </span>
                          </div>
                        </div>

                        {trace.search_agent_result.grounding_sources && trace.search_agent_result.grounding_sources.length > 0 && (
                          <div className="space-y-2">
                            <span className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5">
                              <span>المصادر والروابط الإخبارية الموثقة لحظياً:</span>
                              <span className="text-[10px] font-normal text-emerald-400">({trace.search_agent_result.grounding_sources.length} مصادر)</span>
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {trace.search_agent_result.grounding_sources.map((src, sIdx) => (
                                <a
                                  key={sIdx}
                                  href={src.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-emerald-500/20 hover:border-emerald-500/50 text-slate-200 transition-all group shadow-sm"
                                >
                                  <div className="truncate flex-1 pl-2 text-right">
                                    <span className="text-[11px] font-bold text-emerald-300 group-hover:text-emerald-200 block truncate">
                                      {src.title}
                                    </span>
                                    <span className="text-[9px] text-slate-400 truncate block font-mono">
                                      {src.url.replace(/^https?:\/\/(www\.)?/, "").slice(0, 40)}...
                                    </span>
                                  </div>
                                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

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
      {/* Firebase Cloud Sessions Modal */}
      {showSessionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Cloud className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">جلسات التفكير المحفوظة سحابياً (Firebase Firestore)</h3>
              </div>
              <button onClick={() => setShowSessionsModal(false)} className="text-slate-400 hover:text-white text-xs">
                ✕ إغلاق
              </button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-3 pr-1">
              {savedSessions.length === 0 ? (
                <div className="text-center py-10 text-slate-400 space-y-2">
                  <History className="w-10 h-10 mx-auto text-slate-600 stroke-[1.5]" />
                  <p className="text-sm">لا توجد جلسات تفكير محفوظة سحابياً بعد.</p>
                  <p className="text-xs text-slate-500">يمكنك حفظ جلستك الحالية بالنقر على "حفظ الجلسة" في شريط الأدوات أعلاه.</p>
                </div>
              ) : (
                savedSessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-indigo-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-100">{session.title}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono">
                          {new Date(session.timestamp).toLocaleDateString("ar-SA")}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 font-mono">
                          {session.traces?.length || 0} مسار تفكير
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                        <span>الاستراتيجية: {session.activeStrategy === "tree_of_thought" ? "شجرة التفكير (ToT)" : "سلسلة التفكير (CoT)"}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleRestoreSessionFromCloud(session)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
                        title="استرجاع هذه الجلسة إلى واجهة التفكير"
                      >
                        <CloudDownload className="w-3.5 h-3.5" />
                        <span>فتح واسترجاع</span>
                      </button>
                      <button
                        onClick={() => handleDeleteCloudSession(session.id)}
                        className="p-1.5 rounded-xl bg-slate-900 hover:bg-red-950/60 text-slate-400 hover:text-red-300 border border-slate-800 transition-colors"
                        title="حذف الجلسة من Firebase"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-400" />
                <span>إجمالي الجلسات السحابية: {savedSessions.length}</span>
              </div>
              <button
                onClick={() => setShowSessionsModal(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Image Preview Modal */}
      {selectedImageModal && (
        <div 
          onClick={() => setSelectedImageModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 cursor-zoom-out animate-fadeIn"
        >
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <div className="absolute -top-10 right-0 flex items-center gap-2">
              <a
                href={selectedImageModal}
                download="artwork.jpg"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white text-xs flex items-center gap-1 px-3 border border-slate-700"
              >
                <Download className="w-4 h-4" />
                <span>تحميل الصورة</span>
              </a>
              <button
                onClick={() => setSelectedImageModal(null)}
                className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <img
              src={selectedImageModal}
              alt="Generated Visual"
              referrerPolicy="no-referrer"
              className="max-h-[85vh] max-w-full rounded-2xl shadow-2xl border border-slate-800 object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};
