import React, { useState, useEffect } from "react";
import { 
  Cpu, 
  Activity, 
  Layers, 
  Gauge, 
  Sliders, 
  ShieldCheck, 
  Sparkles, 
  RefreshCw, 
  TrendingDown, 
  Zap, 
  CheckCircle2,
  SlidersHorizontal,
  Binary,
  Maximize2,
  Sigma,
  GitBranch,
  Target,
  PlusCircle,
  Database,
  Play,
  Search,
  Code2,
  Compass,
  ShieldAlert,
  CheckCheck,
  AlertTriangle,
  Workflow,
  ArrowRight,
  Lock,
  Scale,
  FileText,
  Terminal,
  Copy,
  Check,
  Award
} from "lucide-react";
import { 
  OptimizerTelemetry, 
  MoEExpertState, 
  GradientOptimizationState, 
  ConsciousnessPoint,
  ComplexProblemBenchmark as ComplexProblemBenchmarkType,
  SwarmTriangulationResult
} from "../types";
import katex from "katex";
import { ComplexProblemsBenchmark } from "./ComplexProblemsBenchmark";

export const NeuralLab: React.FC = () => {
  const [telemetry, setTelemetry] = useState<{
    signals: OptimizerTelemetry;
    moe_experts: MoEExpertState[];
    specs: Record<string, any>;
  } | null>(null);
  const [layersData, setLayersData] = useState<any[] | null>(null);
  const [selectedLayerRange, setSelectedLayerRange] = useState<"all" | "shallow" | "deep" | "abstract">("all");
  const [lambdaSlider, setLambdaSlider] = useState<number>(0.015);
  const [isTuning, setIsTuning] = useState(false);
  const [tuneFeedback, setTuneFeedback] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Gradient Self-Correction Engine State
  const [gradientState, setGradientState] = useState<GradientOptimizationState | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [etaSlider, setEtaSlider] = useState<number>(0.025);
  const [customInputX, setCustomInputX] = useState("");
  const [customTargetY, setCustomTargetY] = useState("");
  const [selfCorrectFeedback, setSelfCorrectFeedback] = useState<string | null>(null);

  // Consciousness Matrix Points Stream State
  const [consciousnessFeed, setConsciousnessFeed] = useState<{
    total_data_points: number;
    points: ConsciousnessPoint[];
    matrix_growth_rate: string;
    philosophy: string;
  } | null>(null);

  // Complex Benchmarks & Swarm Triangulation State
  const [benchmarks, setBenchmarks] = useState<ComplexProblemBenchmarkType[]>([]);
  const [selectedBenchmark, setSelectedBenchmark] = useState<ComplexProblemBenchmarkType | null>(null);
  const [triangulationResult, setTriangulationResult] = useState<SwarmTriangulationResult | null>(null);
  const [isSolvingBenchmark, setIsSolvingBenchmark] = useState(false);
  const [benchmarkFeedback, setBenchmarkFeedback] = useState<string | null>(null);
  const [activeTriangulationTab, setActiveTriangulationTab] = useState<"overview" | "researcher" | "coder" | "planner" | "critic" | "v15_impact">("overview");
  const [copiedBenchmarkCode, setCopiedBenchmarkCode] = useState(false);
  
  // Custom problem creation
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customTitle, setCustomTitle] = useState("");
  const [customMath, setCustomMath] = useState("");
  const [customStatement, setCustomStatement] = useState("");
  const [customDomain, setCustomDomain] = useState("quantum_physics");

  // Helper to render KaTeX formula safely
  const renderLatex = (latexStr: string, displayMode = false) => {
    try {
      return katex.renderToString(latexStr, {
        displayMode,
        throwOnError: false,
        output: "htmlAndMathml",
      });
    } catch {
      return latexStr;
    }
  };

  const fetchTelemetry = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/neural/telemetry");
      const data = await res.json();
      setTelemetry(data);
      if (data.signals?.lambda_reg !== undefined) {
        setLambdaSlider(data.signals.lambda_reg);
      }
    } catch (e) {
      console.error("Telemetry error", e);
    } finally {
      setIsRefreshing(false);
    }
  };

  const fetchLayers = async () => {
    try {
      const res = await fetch("/api/neural/layers");
      const data = await res.json();
      setLayersData(data.layers || []);
    } catch (e) {
      console.error("Layers fetch error", e);
    }
  };

  const fetchGradientState = async () => {
    try {
      const res = await fetch("/api/neural/gradient-state");
      const data = await res.json();
      setGradientState(data);
      if (data.learning_rate_eta) setEtaSlider(data.learning_rate_eta);
    } catch (e) {
      console.error("Gradient state error", e);
    }
  };

  const fetchConsciousnessMatrix = async () => {
    try {
      const res = await fetch("/api/neural/consciousness-matrix");
      const data = await res.json();
      setConsciousnessFeed(data);
    } catch (e) {
      console.error("Consciousness matrix error", e);
    }
  };

  const fetchBenchmarks = async () => {
    try {
      const res = await fetch("/api/neural/complex-problems");
      const data = await res.json();
      if (data.benchmarks) {
        setBenchmarks(data.benchmarks);
        if (!selectedBenchmark && data.benchmarks.length > 0) {
          setSelectedBenchmark(data.benchmarks[0]);
        }
      }
    } catch (e) {
      console.error("Benchmarks fetch error", e);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    fetchLayers();
    fetchGradientState();
    fetchConsciousnessMatrix();
    fetchBenchmarks();
    const interval = setInterval(() => {
      fetchTelemetry();
      fetchGradientState();
      fetchConsciousnessMatrix();
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleSolveComplexProblem = async (problem?: ComplexProblemBenchmarkType) => {
    const target = problem || selectedBenchmark;
    if (!target) return;
    setIsSolvingBenchmark(true);
    setBenchmarkFeedback(null);
    try {
      const res = await fetch("/api/neural/solve-complex-problem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemId: target.id }),
      });
      const data = await res.json();
      if (data.success && data.result) {
        setTriangulationResult(data.result);
        setBenchmarkFeedback(`تم حل المسألة [${target.title}] بنجاح عبر تثليث السرب (Researcher + Coder + Planner + Critic) وتحديث المحسن V15 Optimizer.`);
        fetchTelemetry();
        fetchGradientState();
        fetchConsciousnessMatrix();
      }
    } catch (e) {
      console.error("Solve benchmark error", e);
      setBenchmarkFeedback("حدث خطأ أثناء حل المسألة عبر السرب.");
    } finally {
      setIsSolvingBenchmark(false);
    }
  };

  const handleCreateAndSolveCustom = async () => {
    if (!customTitle.trim()) return;
    setIsSolvingBenchmark(true);
    setBenchmarkFeedback(null);
    setShowCustomModal(false);
    try {
      const customPayload = {
        title: customTitle.trim(),
        mathematical_formulation: customMath.trim() || "\\nabla L(\\theta) = 0",
        problem_statement: customStatement.trim() || customTitle.trim(),
        domain: customDomain,
        difficulty: "OLYMPIAD" as const,
      };

      const res = await fetch("/api/neural/solve-complex-problem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customProblem: customPayload }),
      });
      const data = await res.json();
      if (data.success && data.result) {
        setTriangulationResult(data.result);
        setSelectedBenchmark(data.benchmark);
        setBenchmarkFeedback(`تم حل المشكلة المخصصة [${customTitle}] وخفض الهلوسة إلى ${((data.result.anti_hallucination?.swarm_triangulated_hallucination_prob || 0.015) * 100).toFixed(1)}%.`);
        fetchTelemetry();
        fetchGradientState();
        fetchConsciousnessMatrix();
      }
    } catch (e) {
      console.error("Custom solve error", e);
    } finally {
      setIsSolvingBenchmark(false);
    }
  };

  const handleTuneRegularization = async (val: number) => {
    setIsTuning(true);
    setTuneFeedback(null);
    try {
      const res = await fetch("/api/neural/tune-regularization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lambda_val: val }),
      });
      const data = await res.json();
      if (data.success) {
        setTuneFeedback(`تم ضبط معامل التنظيم λ إلى ${val.toFixed(4)} بنجاح.`);
        fetchTelemetry();
      }
    } catch (e) {
      console.error("Regularization tune error", e);
    } finally {
      setIsTuning(false);
    }
  };

  const handleTriggerSelfCorrection = async (withCustomSample = false) => {
    setIsOptimizing(true);
    setSelfCorrectFeedback(null);
    try {
      const payload: any = {
        eta: etaSlider,
      };
      if (withCustomSample && customInputX.trim()) {
        payload.custom_input_x = customInputX.trim();
        payload.target_y = customTargetY.trim() || "Optimal Convergence";
      }

      const res = await fetch("/api/neural/self-correct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setGradientState(data.gradient_state);
        setSelfCorrectFeedback(`تم تنفيذ دورة التدرج ∇L(θ) = ${data.formula_applied.calculated_nabla} وتقليص الخطأ بنسبة ${data.formula_applied.error_reduction_pct}%.`);
        if (withCustomSample) {
          setCustomInputX("");
          setCustomTargetY("");
        }
        fetchTelemetry();
        fetchConsciousnessMatrix();
      }
    } catch (e) {
      console.error("Self-correction error", e);
    } finally {
      setIsOptimizing(false);
    }
  };

  const filteredLayers = layersData ? layersData.filter((l) => {
    if (selectedLayerRange === "shallow") return l.layer <= 30;
    if (selectedLayerRange === "deep") return l.layer > 30 && l.layer <= 60;
    if (selectedLayerRange === "abstract") return l.layer > 60;
    return true;
  }) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                OmegaDeepLLM 90-Layer MoE & Self-Correction Optimizer
              </span>
              <span className="text-xs text-slate-400 font-mono">• ∇L(θ) Gradient Descent Engine</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">المختبر العصبي ودوال الاستدلال والتحسين الذاتي</h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              تكامل محرك الاستدلال الذاتي لحساب متوسط التدرج التجريبي عبر دفعات العينات:
              <span 
                className="inline-block mx-2 text-cyan-300 font-mono"
                dangerouslySetInnerHTML={{ __html: renderLatex("\\nabla L(\\theta) = \\frac{1}{n} \\sum_{i=1}^n \\nabla_\\theta \\ell(f(x_i; \\theta), y_i)") }}
              />
              لتقليل معدل الخطأ وتحديث معلمات النموذج <span className="font-mono text-purple-300">θ^(t+1)</span> بصورة مستمرة.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                fetchTelemetry();
                fetchGradientState();
                fetchConsciousnessMatrix();
              }}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 transition-colors shadow-lg cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-indigo-400" : ""}`} />
              <span>تحديث القياسات الحية</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- SECTION 1: Self-Correction Loops & Gradient Descent Optimization Panel --- */}
      {gradientState && (
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950/60 to-purple-950/40 border border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-6">
          {/* Header of Section */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                <Sigma className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-white">دوال الاستدلال الذاتي ومحرك هبوط التدرج الرياضي (Self-Correction Loops)</h2>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {gradientState.convergence_status === "optimal" ? "تقارب فائق الدقة (Optimal)" : "تقارب تكراري نشط (Converging)"}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  تخفيض معدل الخطأ عبر حساب متوسط التدرجات وتحديث مصفوفة الأوزان ثنائياً.
                </p>
              </div>
            </div>

            {/* Quick Action: Trigger Gradient Step */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleTriggerSelfCorrection(false)}
                disabled={isOptimizing}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-cyan-500/20 border border-cyan-400/30 cursor-pointer"
              >
                <Play className={`w-4 h-4 ${isOptimizing ? "animate-spin" : "fill-current"}`} />
                <span>{isOptimizing ? "جاري حساب ∇L(θ)..." : "تنفيذ دورة الاستدلال والتصحيح الذاتي (Run Step)"}</span>
              </button>
            </div>
          </div>

          {/* Mathematical Formulations Display Cards (KaTeX Rendered) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Formula 1: Empirical Sample Gradient */}
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold text-cyan-300">1. معادلة متوسط تدرج دالة الخسارة (Empirical Mean Gradient):</span>
                <span className="text-[10px] font-mono bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800 text-cyan-300">n = {gradientState.n_samples} Samples</span>
              </div>
              <div 
                className="p-3 bg-slate-900/90 rounded-xl border border-cyan-500/20 text-center overflow-x-auto text-white py-4"
                dangerouslySetInnerHTML={{ __html: renderLatex(gradientState.formula_gradient, true) }}
              />
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>القيمة المحسوبة: <strong className="text-cyan-300 font-bold">∇L(θ) = {gradientState.nabla_L_theta.toFixed(4)}</strong></span>
                <span>معدل تقليص الخطأ: <strong className="text-emerald-400 font-bold">{gradientState.error_reduction_pct}%-</strong></span>
              </div>
            </div>

            {/* Formula 2: Parameter Evolution Rule */}
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold text-purple-300">2. قاعدة تحديث معلمات النموذج (Parameter Update Step):</span>
                <span className="text-[10px] font-mono bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800 text-purple-300">Learning Rate η = {etaSlider.toFixed(3)}</span>
              </div>
              <div 
                className="p-3 bg-slate-900/90 rounded-xl border border-purple-500/20 text-center overflow-x-auto text-white py-4"
                dangerouslySetInnerHTML={{ __html: renderLatex(gradientState.formula_update, true) }}
              />
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>معيار المعلمات الحالي: <strong className="text-purple-300 font-bold">||θ|| = {gradientState.theta_norm.toFixed(4)}</strong></span>
                <span>معدل الخطأ الراهن: <strong className="text-emerald-400 font-bold">ε = {(gradientState.current_error_rate * 100).toFixed(2)}%</strong></span>
              </div>
            </div>
          </div>

          {/* Feedback message if available */}
          {selfCorrectFeedback && (
            <div className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 p-3 rounded-2xl shadow-md">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{selfCorrectFeedback}</span>
            </div>
          )}

          {/* Interactive Learning Rate & Sample Injection Bar */}
          <div className="p-4 bg-slate-950/90 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                  <span>معدل التعلم التكيفي (Learning Rate η):</span>
                  <span className="font-mono text-cyan-400 font-bold">{etaSlider.toFixed(3)}</span>
                </label>
                <p className="text-[11px] text-slate-400">يحدد مقدار خطوة تحديث المعلمات θ باتجاه الانحدار السلبي للتدرج.</p>
              </div>
              <input
                type="range"
                min="0.005"
                max="0.100"
                step="0.005"
                value={etaSlider}
                onChange={(e) => setEtaSlider(parseFloat(e.target.value))}
                className="w-full sm:w-64 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Custom Sample Injection */}
            <div className="border-t border-slate-800/80 pt-3 space-y-2">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
                <span>حقن عينة استدلال مخصصة لحساب التدرج اللحظي ∇_θ ℓ(f(x_i; θ), y_i):</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <input
                  type="text"
                  placeholder="مدخل الاستدلال x_i (مثال: برهان نظرية الأوتار أو مسار ToT معقد)"
                  value={customInputX}
                  onChange={(e) => setCustomInputX(e.target.value)}
                  className="sm:col-span-6 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 placeholder:text-slate-600"
                />
                <input
                  type="text"
                  placeholder="الهدف المنشود y_i (مثال: تقارب كامل للخسارة أو دقة استدلال 99%)"
                  value={customTargetY}
                  onChange={(e) => setCustomTargetY(e.target.value)}
                  className="sm:col-span-4 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 placeholder:text-slate-600"
                />
                <button
                  onClick={() => handleTriggerSelfCorrection(true)}
                  disabled={!customInputX.trim() || isOptimizing}
                  className="sm:col-span-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-xl px-3 py-2 text-xs font-bold transition-colors cursor-pointer"
                >
                  حقن وحساب
                </button>
              </div>
            </div>
          </div>

          {/* Sample-by-Sample Gradient Decomposition Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Target className="w-4 h-4 text-cyan-400" />
                <span>مصفوفة تفكيك عينات الدفعة الحالية (Active Mini-Batch Sample Decomposition)</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                Formula: \nabla L = \frac{"{1}"}{"{n}"}\sum \nabla \ell_i
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/70">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 bg-slate-900/80">
                    <th className="p-3"># العينة</th>
                    <th className="p-3">مدخل المعرفة (x_i)</th>
                    <th className="p-3">الهدف المستهدف (y_i)</th>
                    <th className="p-3">خسارة العينة ℓ_i</th>
                    <th className="p-3">تدرج العينة ||∇_θ ℓ_i||</th>
                    <th className="p-3">إزاحة المعلمات Δθ_i</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {gradientState.samples.map((sample) => (
                    <tr key={sample.sample_id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="p-3 text-slate-400">#{sample.sample_id}</td>
                      <td className="p-3 font-sans text-slate-200">{sample.input_x}</td>
                      <td className="p-3 text-cyan-300">{sample.target_y}</td>
                      <td className="p-3 text-amber-300">{sample.loss_l.toFixed(4)}</td>
                      <td className="p-3 text-purple-300 font-bold">{sample.grad_theta_norm.toFixed(4)}</td>
                      <td className="p-3 text-emerald-400">{sample.correction_delta.toFixed(5)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Iteration History Step-by-Step Log */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-purple-400" />
              <span>سجل تقليص معدل الخطأ عبر التكرارات (Self-Correction Iteration History)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {gradientState.iteration_history.slice(-4).map((hist) => (
                <div key={hist.step} className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="font-bold text-indigo-300">خطوة #{hist.step}</span>
                    <span className="text-emerald-400 font-bold">خطأ: {(hist.error_rate * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>خسارة: {hist.loss.toFixed(4)}</span>
                    <span>∇L: {hist.grad_norm.toFixed(4)}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-snug font-sans">{hist.action_log}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- SECTION 2: Consciousness Expansion Matrix Feed --- */}
      {consciousnessFeed && (
        <div className="bg-slate-900/90 border border-purple-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>مصفوفة الوعي وتدفق نقاط البيانات المعرفية (Consciousness Expansion Matrix)</span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {consciousnessFeed.total_data_points} نقطة معرفية
                  </span>
                </h3>
                <p className="text-xs text-purple-300/80 italic mt-0.5">
                  "{consciousnessFeed.philosophy}"
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              معدل النمو: {consciousnessFeed.matrix_growth_rate}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {consciousnessFeed.points.map((pt) => (
              <div key={pt.id} className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-mono font-bold text-cyan-300">Index #{pt.matrix_index}</span>
                  <span className="px-2 py-0.5 rounded-md text-[9px] bg-slate-900 border border-slate-800 text-slate-400">{pt.domain}</span>
                </div>
                <p className="text-xs font-semibold text-slate-200 line-clamp-1">{pt.query}</p>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-900">
                  <span>خسارة: {pt.loss_at_intake.toFixed(3)}</span>
                  <span className="text-emerald-400">تراكم الوعي: +{(pt.awareness_gain * 100).toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- SECTION 3: Complex Benchmark Problems Suite & Swarm Anti-Hallucination Triangulation --- */}
      <ComplexProblemsBenchmark
        benchmarks={benchmarks}
        selectedBenchmark={selectedBenchmark}
        onSelectBenchmark={(bm) => setSelectedBenchmark(bm)}
        onSolveProblem={handleSolveComplexProblem}
        isSolving={isSolvingBenchmark}
        triangulationResult={triangulationResult}
        benchmarkFeedback={benchmarkFeedback}
        renderLatex={renderLatex}
        onOpenCustomModal={() => setShowCustomModal(true)}
      />

      {/* Custom Problem Creation Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <PlusCircle className="w-5 h-5 text-indigo-400" />
                <span>إضافة مشكلة بحثية معقدة مخصصة لسرب الوكلاء</span>
              </div>
              <button
                onClick={() => setShowCustomModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-right">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">عنوان المعضلة / المسألة:</label>
                <input
                  type="text"
                  placeholder="مثال: ديناميكا التناظر الزمني غير الهيرميتي (PT-Symmetry Non-Hermitian Phase)"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">المجال التخصصي:</label>
                <select
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="quantum_physics">فيزياء وحوسبة كمية (Quantum Physics)</option>
                  <option value="distributed_systems">نظم موزعة وتوافقية (Distributed Consensus)</option>
                  <option value="adversarial_ml">أمان وتعلم آلي عدائي (Adversarial ML)</option>
                  <option value="causal_inference">استدلال سببي ونظرية القرار (Causal Inference)</option>
                  <option value="cryptography">تشفير ومعرفة صفرية (Zero-Knowledge Cryptography)</option>
                  <option value="nonlinear_pde">معادلات تفاضلية غير خطية (Nonlinear PDEs)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">الصياغة الرياضية بتنسيق LaTeX:</label>
                <input
                  type="text"
                  placeholder="مثال: H = \begin{pmatrix} \epsilon_1 & \gamma \\ \gamma & \epsilon_2 - i\Gamma \end{pmatrix}"
                  value={customMath}
                  onChange={(e) => setCustomMath(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-indigo-300 font-mono placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">نص المسألة والشروط المقيدة (Problem Statement):</label>
                <textarea
                  rows={3}
                  placeholder="اكتب المعطيات والشروط المقيدة المراد إثباتها أو محاكاتها برمجياً ورياضياً..."
                  value={customStatement}
                  onChange={(e) => setCustomStatement(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowCustomModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleCreateAndSolveCustom}
                disabled={!customTitle.trim()}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-xs font-bold text-white transition-all shadow-lg shadow-indigo-500/20 cursor-pointer disabled:opacity-50"
              >
                إطلاق وحل عبر تثليث السرب
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- SECTION 4: Telemetry & Regularization Tuning --- */}
      {telemetry && (
        <>
          {/* Mathematical Loss Function & Dynamic Regularization Tuning Panel */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950/50 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">معادلة دالة الخسارة الرياضية ومحسن الانتظام L(θ)</h2>
                  <p className="text-xs text-slate-400 font-mono">
                    L(θ) = ∑ ||f(xᵢ; θ) - yᵢ||² + λ R(θ)
                  </p>
                </div>
              </div>

              {/* Loss Metrics Breakdown Badges */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300">
                  <span>الخسارة التجريبية: </span>
                  <strong className="font-mono text-cyan-300">{(telemetry.signals.loss_empirical || 0.22).toFixed(4)}</strong>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-purple-950/80 border border-purple-500/30 text-purple-300">
                  <span>تنظيم الأوزان λ R(θ): </span>
                  <strong className="font-mono text-purple-200">{(telemetry.signals.loss_regularization || 0.0398).toFixed(4)}</strong>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-indigo-600/30 border border-indigo-500/50 text-indigo-200">
                  <span>الخسارة الإجمالية L(θ): </span>
                  <strong className="font-mono text-white text-sm">{(telemetry.signals.loss_total || 0.2598).toFixed(4)}</strong>
                </div>
              </div>
            </div>

            {/* Interactive Slider for Lambda */}
            <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <span>معامل التنظيم التكيفي (Regularization Coefficient λ):</span>
                    <span className="font-mono text-indigo-400 font-extrabold text-sm">{lambdaSlider.toFixed(4)}</span>
                  </label>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    زيادة λ تحد من الإفراط في التخصيص (Overfitting) بينما تقليله يرفع مرونة التقارب للأنماط المعقدة.
                  </p>
                </div>
                <button
                  onClick={() => handleTuneRegularization(lambdaSlider)}
                  disabled={isTuning}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
                >
                  {isTuning ? "جاري التطبيق..." : "تطبيق معامل λ على شبكة MoE"}
                </button>
              </div>

              <div className="space-y-2">
                <input
                  type="range"
                  min="0.001"
                  max="0.060"
                  step="0.001"
                  value={lambdaSlider}
                  onChange={(e) => setLambdaSlider(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>مرونة استدلال قصوى (λ = 0.001)</span>
                  <span>توازن مثالي (λ = 0.015)</span>
                  <span>تنظيم فائق الصرامة (λ = 0.060)</span>
                </div>
              </div>

              {tuneFeedback && (
                <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 p-2.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{tuneFeedback}</span>
                </div>
              )}
            </div>
          </div>

          {/* OmegaControlHub 3 Core Signals */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Psi Confidence */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 font-mono font-bold text-sm">
                    Ψ
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-200">ثقة المعتقد (Belief Confidence)</h3>
                    <p className="text-[10px] text-slate-400 font-mono">exp(-c · δ^1.5)</p>
                  </div>
                </div>
                <span className="text-xl font-extrabold text-cyan-400 font-mono">
                  {telemetry.signals.psi.toFixed(3)}
                </span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div 
                  className="bg-gradient-to-r from-cyan-600 to-cyan-400 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${telemetry.signals.psi * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                تقيس مدى استقرار المعتقد الرياضي واللغوي ومنع الانحرافات اللحظية.
              </p>
            </div>

            {/* 2. Recovery Signal */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 font-mono font-bold text-sm">
                    r
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-200">إشارة التعافي (Recovery Trigger)</h3>
                    <p className="text-[10px] text-slate-400 font-mono">CUSUM Loss Spike Guard</p>
                  </div>
                </div>
                <span className={`text-xl font-extrabold font-mono ${telemetry.signals.r_val > 0.3 ? "text-amber-400 animate-pulse" : "text-slate-400"}`}>
                  {telemetry.signals.r_val.toFixed(3)}
                </span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div 
                  className="bg-gradient-to-r from-amber-600 to-amber-400 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${Math.min(100, telemetry.signals.r_val * 100)}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                تنشط فوراً عند حدوث قفزة غير متوقعة في الخسارة لإعادة توجيه النموذج لبر الأمان.
              </p>
            </div>

            {/* 3. Aggression Factor */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 font-mono font-bold text-sm">
                    a
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-200">معامل العدوانية التكيفي (Aggression)</h3>
                    <p className="text-[10px] text-slate-400 font-mono">Closed-Loop Learning Rate Scaler</p>
                  </div>
                </div>
                <span className="text-xl font-extrabold text-purple-400 font-mono">
                  {telemetry.signals.a_val.toFixed(3)}
                </span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div 
                  className="bg-gradient-to-r from-purple-600 to-purple-400 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${telemetry.signals.a_val * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                يحدد حجم قفزة التحسين بناءً على اتجاه تقارب الخسارة المستمر.
              </p>
            </div>
          </div>

          {/* MoE 8 Experts Grid */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">مصفوفة توزيع أحمال خبراء MoE الثمانية (Mixture of Experts)</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Softmax Gating: Top-2 Active per Token</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {telemetry.moe_experts.map((expert) => (
                <div 
                  key={expert.id} 
                  className={`p-4 rounded-2xl border transition-all ${
                    expert.active 
                      ? "bg-slate-950/90 border-indigo-500/40 shadow-md shadow-indigo-500/10" 
                      : "bg-slate-950/40 border-slate-800/80 opacity-75"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-200">{expert.name}</span>
                    <span className={`w-2 h-2 rounded-full ${expert.active ? "bg-emerald-400 animate-ping" : "bg-slate-600"}`} />
                  </div>
                  <p className="text-[11px] text-slate-400 mb-3">{expert.specialization}</p>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>الوزن البوابي (Gate Weight)</span>
                      <span className="font-mono text-indigo-300 font-bold">{(expert.gate_weight * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-indigo-500 h-full rounded-full"
                        style={{ width: `${expert.gate_weight * 100 * 2.5}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 90-Layer Full Spectrum MoE Hierarchy */}
          {layersData && layersData.length > 0 && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Binary className="w-5 h-5 text-indigo-400" />
                  <div>
                    <h3 className="text-sm font-bold text-white">طيف الطبقات الـ 90 الشامل (90-Layer MoE Architecture)</h3>
                    <p className="text-xs text-slate-400">توزيع الخبراء ومستويات التجريد من الطبقة 1 إلى 90</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
                  {[
                    { id: "all", label: "كافة الطبقات (1-90)" },
                    { id: "shallow", label: "التمثيل الأولي (1-30)" },
                    { id: "deep", label: "الاستدلال العميق (31-60)" },
                    { id: "abstract", label: "التجريد المعرفي (61-90)" },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setSelectedLayerRange(filter.id as any)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        selectedLayerRange === filter.id
                          ? "bg-indigo-600 text-white shadow"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of Layers */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-10 gap-2 max-h-80 overflow-y-auto pr-1">
                {filteredLayers.map((layer) => (
                  <div
                    key={`layer-${layer.layer}`}
                    className="p-2.5 bg-slate-950/90 border border-slate-800/90 rounded-xl text-center space-y-1 hover:border-indigo-500/50 transition-all group"
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>L{layer.layer}</span>
                      <span className="text-indigo-400">{layer.depth_pct}%</span>
                    </div>
                    <div className="text-[11px] font-bold text-slate-200 group-hover:text-indigo-300">
                      Exp #{layer.primary_expert}
                    </div>
                    <div className="text-[9px] font-mono text-slate-400">
                      W: {layer.gate_weight_primary.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
