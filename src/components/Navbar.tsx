import React, { useState, useEffect } from "react";
import { 
  Brain, 
  Users, 
  Cpu, 
  Database, 
  Globe2, 
  Code2, 
  FileCode2,
  Activity, 
  Sparkles,
  Zap,
  ShieldCheck,
  RefreshCw,
  Sigma,
  Clock,
  Calendar,
  Focus,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Building2,
  Youtube,
  Server
} from "lucide-react";
import { BrainState, ConsciousnessState, OptimizerTelemetry } from "../types";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  brainState: BrainState;
  consciousness: ConsciousnessState;
  optimizer?: OptimizerTelemetry;
  onResetMemory: () => void;
  isProcessing: boolean;
  isFocusMode: boolean;
  onToggleFocusMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  brainState,
  consciousness,
  optimizer,
  onResetMemory,
  isProcessing,
  isFocusMode,
  onToggleFocusMode,
}) => {
  const [liveTimeString, setLiveTimeString] = useState<string>("");
  const [liveDateString, setLiveDateString] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveTimeString(
        new Intl.DateTimeFormat("ar-EG", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }).format(now)
      );
      setLiveDateString(
        new Intl.DateTimeFormat("ar-EG", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }).format(now)
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navTabs = [
    { id: "brain", label: "العقل التنفيذي", sublabel: "Omega Brain", icon: Brain },
    { id: "media", label: "الصور والفيديوهات", sublabel: "Multimodal Studio", icon: ImageIcon },
    { id: "blueprints", label: "المخططات والهندسة", sublabel: "CAD & Blueprints", icon: Building2 },
    { id: "social", label: "استخبارات اليوتيوب", sublabel: "YouTube & Social", icon: Youtube },
    { id: "servers", label: "الخوادم المجانية", sublabel: "Free Cloud APIs", icon: Server },
    { id: "codebase", label: "كود ومعمارية النظام", sublabel: "Self-Code Awareness", icon: FileCode2 },
    { id: "latex", label: "استوديو LaTeX", sublabel: "Math & Physics", icon: Sigma },
    { id: "time", label: "الوقت والتقويم", sublabel: "Chrono Matrix", icon: Clock },
    { id: "swarm", label: "خلية الوكلاء", sublabel: "Swarm Agents", icon: Users },
    { id: "neural", label: "المختبر العصبي", sublabel: "90-Layer MoE & V15", icon: Cpu },
    { id: "memory", label: "مصفوفة الذاكرة", sublabel: "5-Tier Memory", icon: Database },
    { id: "world", label: "نموذج العالم", sublabel: "World Model", icon: Globe2 },
    { id: "code", label: "منفذ الأكواد", sublabel: "Code Sandbox", icon: Code2 },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isFocusMode 
        ? "bg-slate-950/95 backdrop-blur-2xl border-b border-emerald-500/20 shadow-xl shadow-emerald-950/10" 
        : "bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl shadow-indigo-950/20"
    }`}>
      {/* Top Telemetry Ticker - Hidden in Deep Focus Mode to remove distraction */}
      {!isFocusMode && (
        <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900/90 to-purple-950/60 border-b border-slate-800/50 px-4 py-1.5 text-xs text-slate-300 transition-all duration-300">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isProcessing ? "bg-amber-400 animate-ping" : "bg-emerald-400 animate-pulse"}`} />
                <span className="font-semibold text-slate-200">
                  {isProcessing ? "معالجة التفكير الاستدلالي..." : "نظام أوميجا في وضع الاستعداد الفائق"}
                </span>
              </div>

              {/* Live Clock Ticker Badge */}
              {liveTimeString && (
                <div 
                  onClick={() => setActiveTab("time")}
                  title="عرض مصفوفة التوقيت وساعات العالم"
                  className="cursor-pointer flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-950/80 hover:bg-indigo-900/80 border border-indigo-500/40 text-cyan-300 transition-colors font-mono text-[11px]"
                >
                  <Clock className="w-3 h-3 text-cyan-400 animate-pulse" />
                  <span className="font-bold">{liveTimeString}</span>
                  <span className="text-slate-400 font-sans">|</span>
                  <span className="text-slate-300 font-sans">{liveDateString}</span>
                </div>
              )}

              <div className="hidden sm:flex items-center gap-3 text-slate-400">
                <span>مستوى الوعي: <strong className="text-indigo-300 font-mono">{(consciousness.awareness_level * 100).toFixed(0)}%</strong></span>
                <span>•</span>
                <span>الاتساق المعرفي: <strong className="text-emerald-300 font-mono">{(consciousness.cognitive_coherence * 100).toFixed(0)}%</strong></span>
                <span>•</span>
                <span>الحمل المعرفي: <strong className="text-amber-300 font-mono">{(brainState.cognitive_load * 100).toFixed(0)}%</strong></span>
                {optimizer && (
                  <>
                    <span>•</span>
                    <span>ثقة المحسن (Ψ): <strong className="text-cyan-300 font-mono">{optimizer.psi.toFixed(2)}</strong></span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onResetMemory}
                title="إعادة ضبط الذاكرة المؤقتة"
                className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors border border-slate-700/50"
              >
                <RefreshCw className="w-3 h-3" />
                <span>تفريغ المؤقتة</span>
              </button>
              <div className="flex items-center gap-1 text-[11px] bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-full font-mono">
                <ShieldCheck className="w-3 h-3 text-indigo-400" />
                <span>Omega Deep LLM</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className={`flex items-center justify-between gap-4 transition-all duration-300 ${isFocusMode ? "h-14" : "h-16"}`}>
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => setActiveTab("brain")}>
            <div className={`relative rounded-xl p-[1.5px] shadow-lg transition-all duration-300 ${
              isFocusMode 
                ? "w-9 h-9 bg-gradient-to-tr from-emerald-600 to-cyan-500 shadow-emerald-500/20" 
                : "w-10 h-10 bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 shadow-indigo-500/20"
            }`}>
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Brain className={`transition-all duration-300 ${
                  isFocusMode ? "w-4 h-4 text-emerald-400" : "w-5 h-5 text-indigo-400 animate-pulse"
                }`} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-l from-indigo-200 via-white to-purple-200 bg-clip-text text-transparent font-['Plus_Jakarta_Sans']">
                  OMEGA-AI
                </span>
                {isFocusMode ? (
                  <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>تركيز عميق</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30 uppercase tracking-wider">
                    Brain v2
                  </span>
                )}
              </div>
              {!isFocusMode && (
                <p className="text-[11px] text-slate-400 font-medium">المركز التنفيذي والذكاء المنظومي</p>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 overflow-x-auto py-2 no-scrollbar">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? isFocusMode
                        ? "bg-emerald-500/20 text-emerald-200 border border-emerald-500/40 shadow-md shadow-emerald-500/10"
                        : "bg-gradient-to-r from-indigo-600/20 to-purple-600/20 text-white border border-indigo-500/40 shadow-md shadow-indigo-500/10"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? (isFocusMode ? "text-emerald-400" : "text-indigo-400") : "text-slate-400"}`} />
                  <div className="text-right">
                    <div className={isActive ? (isFocusMode ? "text-emerald-200 font-semibold" : "text-indigo-200 font-semibold") : ""}>
                      {tab.label}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Deep Focus Mode Toggle Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              id="deep-focus-mode-btn"
              onClick={onToggleFocusMode}
              title={isFocusMode ? "إيقاف نمط التركيز والعودة للواجهة الكاملة (Esc)" : "تفعيل نمط التركيز العميق وإخفاء العناصر المشتتة"}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all shadow-md ${
                isFocusMode
                  ? "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 ring-1 ring-emerald-500/30 shadow-emerald-500/20"
                  : "bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 hover:border-emerald-500/50 shadow-slate-950/40"
              }`}
            >
              <Focus className={`w-4 h-4 transition-transform ${isFocusMode ? "text-emerald-400 rotate-90 scale-110" : "text-slate-400 group-hover:text-emerald-400"}`} />
              <span className="hidden md:inline">
                {isFocusMode ? "نمط التركيز العميق (نشط)" : "نمط التركيز العميق"}
              </span>
              {isFocusMode && (
                <span className="text-[10px] font-normal bg-emerald-950/80 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30 hidden lg:inline">
                  Esc
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
