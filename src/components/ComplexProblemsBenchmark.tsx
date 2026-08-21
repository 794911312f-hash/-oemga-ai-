import React, { useState } from "react";
import { 
  ComplexProblemBenchmark, 
  SwarmTriangulationResult 
} from "../types";
import { 
  Cpu, 
  Search, 
  Code2, 
  Compass, 
  ShieldAlert, 
  ShieldCheck, 
  CheckCheck, 
  Sparkles, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  Workflow, 
  ArrowRight, 
  Activity, 
  Sigma, 
  Copy, 
  Check, 
  Terminal, 
  Layers, 
  FileText,
  PlusCircle,
  TrendingDown,
  Zap,
  Award
} from "lucide-react";

interface ComplexProblemsBenchmarkProps {
  benchmarks: ComplexProblemBenchmark[];
  selectedBenchmark: ComplexProblemBenchmark | null;
  onSelectBenchmark: (b: ComplexProblemBenchmark) => void;
  onSolveProblem: (b?: ComplexProblemBenchmark) => Promise<void>;
  isSolving: boolean;
  triangulationResult: SwarmTriangulationResult | null;
  benchmarkFeedback: string | null;
  renderLatex: (latex: string, display?: boolean) => string;
  onOpenCustomModal: () => void;
}

export const ComplexProblemsBenchmark: React.FC<ComplexProblemsBenchmarkProps> = ({
  benchmarks,
  selectedBenchmark,
  onSelectBenchmark,
  onSolveProblem,
  isSolving,
  triangulationResult,
  benchmarkFeedback,
  renderLatex,
  onOpenCustomModal,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "researcher" | "coder" | "planner" | "critic" | "v15_impact">("overview");
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950/70 to-purple-950/50 border border-indigo-500/40 rounded-3xl p-6 shadow-2xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
            <Workflow className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">منظومة المشكلات المعقدة وتثليث سرب الوكلاء لمكافحة الهلوسة</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Anti-Hallucination Triangulation Suite
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              ربط الوكلاء الاربعة (Researcher, Coder, Planner, Critic) لحل معضلات استدلالية معقدة وقمع الهلوسة إلى أدنى مستوى وتغذية المحسن V15.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenCustomModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-xs font-bold text-slate-200 border border-slate-700 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-purple-400" />
            <span>مشكلة مخصصة</span>
          </button>

          <button
            onClick={() => onSolveProblem()}
            disabled={isSolving || !selectedBenchmark}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-500/25 border border-indigo-400/30 cursor-pointer disabled:opacity-50"
          >
            <Play className={`w-4 h-4 ${isSolving ? "animate-spin" : "fill-current"}`} />
            <span>{isSolving ? "جاري التثليث وسحق الهلوسة..." : "حل المسألة بتثليث السرب (Solve via Swarm)"}</span>
          </button>
        </div>
      </div>

      {/* Problem Selection Carousel / Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-300 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span>مصفوفة المشكلات العلمية والاستدلالية المعقدة (Benchmark Suite):</span>
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            {benchmarks.length} مسألة معتمدة
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {benchmarks.map((bm) => {
            const isSelected = selectedBenchmark?.id === bm.id;
            return (
              <div
                key={bm.id}
                onClick={() => onSelectBenchmark(bm)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer text-right space-y-2.5 ${
                  isSelected
                    ? "bg-slate-950 border-indigo-500/80 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/40"
                    : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-950/90"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold font-mono ${
                    bm.difficulty === "OLYMPIAD" 
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" 
                      : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  }`}>
                    {bm.difficulty}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {bm.domain_ar}
                  </span>
                </div>

                <h3 className={`text-xs font-bold line-clamp-2 ${isSelected ? "text-white" : "text-slate-200"}`}>
                  {bm.title}
                </h3>

                <div 
                  className="p-2 bg-slate-900/90 rounded-xl border border-slate-800 text-center text-xs overflow-x-auto text-indigo-300 font-mono"
                  dangerouslySetInnerHTML={{ __html: renderLatex(bm.mathematical_formulation, false) }}
                />

                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {bm.problem_statement}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Benchmark Detailed Strategy & Invariant Inspector */}
      {selectedBenchmark && (
        <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-400 font-mono">تفاصيل المعضلة المختارة:</span>
                <h3 className="text-sm font-extrabold text-white">{selectedBenchmark.title}</h3>
              </div>
              <p className="text-xs text-slate-300 mt-1">{selectedBenchmark.problem_statement}</p>
            </div>

            <button
              onClick={() => onSolveProblem(selectedBenchmark)}
              disabled={isSolving}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isSolving ? "جاري التحليل والتثليث..." : "تطبيق السرب على هذه المسألة"}</span>
            </button>
          </div>

          {/* KaTeX Mathematical Formulation */}
          <div className="p-3.5 bg-slate-900/90 rounded-xl border border-indigo-500/20 text-center text-white overflow-x-auto">
            <div className="text-[10px] text-slate-400 font-mono mb-1">الصياغة الرياضية الصارمة (Strict Formulation):</div>
            <div dangerouslySetInnerHTML={{ __html: renderLatex(selectedBenchmark.mathematical_formulation, true) }} />
          </div>

          {/* Hallucination Vulnerability & Why Swarm is Required */}
          <div className="p-3.5 bg-amber-950/30 border border-amber-500/30 rounded-xl flex items-start gap-3 text-xs">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-amber-300">موطن الهلوسة في النماذج الأحادية (Hallucination Vulnerability):</span>
              <p className="text-slate-300 leading-relaxed">{selectedBenchmark.hallucination_vulnerability_desc}</p>
            </div>
          </div>

          {/* 4 Agent Roles Strategy Grid */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-300">استراتيجية توزيع الأدوار لتثليث الحقيقة (Swarm Triangulation Roles):</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
              {/* Researcher */}
              <div className="p-3 bg-slate-900/80 rounded-xl border border-cyan-500/20 space-y-1">
                <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
                  <Search className="w-3.5 h-3.5" />
                  <span>Researcher (الباحث)</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">{selectedBenchmark.agent_roles_strategy.researcher}</p>
              </div>

              {/* Coder */}
              <div className="p-3 bg-slate-900/80 rounded-xl border border-emerald-500/20 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Coder (المبرمج)</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">{selectedBenchmark.agent_roles_strategy.coder}</p>
              </div>

              {/* Planner */}
              <div className="p-3 bg-slate-900/80 rounded-xl border border-purple-500/20 space-y-1">
                <div className="flex items-center gap-1.5 text-purple-300 font-bold">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Planner (المخطط)</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">{selectedBenchmark.agent_roles_strategy.planner}</p>
              </div>

              {/* Critic */}
              <div className="p-3 bg-slate-900/80 rounded-xl border border-rose-500/20 space-y-1">
                <div className="flex items-center gap-1.5 text-rose-300 font-bold">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Critic (الناقد)</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">{selectedBenchmark.agent_roles_strategy.critic}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Triangulation Feedback Notification */}
      {benchmarkFeedback && (
        <div className="flex items-center gap-2 p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl text-xs text-emerald-300">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{benchmarkFeedback}</span>
        </div>
      )}

      {/* --- LIVE TRIANGULATION RESULTS & ANTI-HALLUCINATION TELEMETRY --- */}
      {triangulationResult && (
        <div className="bg-slate-950 border border-indigo-500/50 rounded-3xl p-6 shadow-2xl space-y-6 animate-fadeIn">
          {/* Header of Results */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">نتائج التثليث وسحق الهلوسة لمسألة: {triangulationResult.problem.title}</h3>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    VERIFIED CONSENSUS
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  تم إجراء التحقق المتبادل بين الوكلاء الأربعة وتأكيد خلو البرهان من أي انحيازات معرفية.
                </p>
              </div>
            </div>
          </div>

          {/* Anti-Hallucination Quantitative Comparison Gauge */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Metric 1: Hallucination Drop */}
            <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>احتمالية الهلوسة (Hallucination Risk)</span>
                <ShieldAlert className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  {(triangulationResult.anti_hallucination.swarm_triangulated_hallucination_prob * 100).toFixed(1)}%
                </span>
                <span className="text-xs line-through text-rose-400 font-mono">
                  {(triangulationResult.anti_hallucination.single_pass_hallucination_prob * 100).toFixed(1)}% فردي
                </span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${Math.max(5, 100 - triangulationResult.anti_hallucination.swarm_triangulated_hallucination_prob * 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400">انخفاض مخاطر الهلوسة بنسبة <strong>-{(100 - (triangulationResult.anti_hallucination.swarm_triangulated_hallucination_prob / triangulationResult.anti_hallucination.single_pass_hallucination_prob) * 100).toFixed(0)}%</strong></p>
            </div>

            {/* Metric 2: Grounding Index */}
            <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>مؤشر التأصيل التجريبي (Grounding)</span>
                <Search className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-black text-cyan-400 font-mono">
                {triangulationResult.anti_hallucination.grounding_index_pct.toFixed(1)}%
              </div>
              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-cyan-500 h-full rounded-full"
                  style={{ width: `${triangulationResult.anti_hallucination.grounding_index_pct}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400">{triangulationResult.anti_hallucination.empirical_sources_verified} مراجع علمية مثبتة</p>
            </div>

            {/* Metric 3: Causal Consistency */}
            <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>اتساق المسار السببي (Causal DAG)</span>
                <Compass className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-black text-purple-400 font-mono">
                {(triangulationResult.anti_hallucination.causal_dag_consistency_score * 100).toFixed(1)}%
              </div>
              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-purple-500 h-full rounded-full"
                  style={{ width: `${triangulationResult.anti_hallucination.causal_dag_consistency_score * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400">انعدام التناقض المنطقي بين الحلقات</p>
            </div>

            {/* Metric 4: Critic Rigor Score */}
            <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>صرامة الناقد (Critic Rigor)</span>
                <Award className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-amber-400 font-mono">
                {triangulationResult.anti_hallucination.critic_rigor_score.toFixed(2)} / 10
              </div>
              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-amber-500 h-full rounded-full"
                  style={{ width: `${(triangulationResult.anti_hallucination.critic_rigor_score / 10) * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400">انخفاض الإنتروبيا المعرفية بنسبة {triangulationResult.anti_hallucination.entropy_reduction_pct}%</p>
            </div>
          </div>

          {/* Multi-Agent Output Tabs Navigation */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-900 rounded-2xl border border-slate-800 text-xs font-bold">
            {[
              { id: "overview", label: "نظرة عامة والبرهان المعتمد", icon: Workflow },
              { id: "researcher", label: "الباحث (Researcher Grounding)", icon: Search },
              { id: "coder", label: "المبرمج (Coder Simulation)", icon: Code2 },
              { id: "planner", label: "المخطط (Causal DAG Steps)", icon: Compass },
              { id: "critic", label: "الناقد (Anti-Hallucination Audit)", icon: ShieldAlert },
              { id: "v15_impact", label: "أثر التحسين على V15 Optimizer", icon: Zap },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                    isActive 
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30" 
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content 1: Overview */}
          {activeTab === "overview" && (
            <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                <FileText className="w-4 h-4" />
                <span>البرهان الشامل والحل المعرفي المعتمد من سرب الوكلاء:</span>
              </div>
              <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-line bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                {triangulationResult.solution_overview}
              </div>
            </div>
          )}

          {/* Tab Content 2: Researcher */}
          {activeTab === "researcher" && (
            <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                <Search className="w-4 h-4" />
                <span>المراجع الأكاديمية والحقائق المؤصلة تجريبياً (Empirical Grounding):</span>
              </div>
              
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-300">المراجع والبحوث المعتمدة:</span>
                <ul className="space-y-1.5 text-xs text-cyan-300 font-mono">
                  {triangulationResult.agent_traces.researcher.citations.map((cit, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>{cit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-300">الحقائق العلمية المثبتة:</span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {triangulationResult.agent_traces.researcher.grounded_facts.map((fact, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {triangulationResult.agent_traces.researcher.empirical_summary}
              </p>
            </div>
          )}

          {/* Tab Content 3: Coder */}
          {activeTab === "coder" && (
            <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <Code2 className="w-4 h-4" />
                  <span>كود التحقق البرمجي الصارم (Formal Python Verification Script):</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 px-2 py-0.5 rounded">
                    {triangulationResult.agent_traces.coder.assertions_passed} / {triangulationResult.agent_traces.coder.total_assertions} Assertions Passed
                  </span>
                  <button
                    onClick={() => handleCopyCode(triangulationResult.agent_traces.coder.formal_code)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 transition-colors"
                  >
                    {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCode ? "تم النسخ" : "نسخ الكود"}</span>
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto text-left" dir="ltr">
                <pre>{triangulationResult.agent_traces.coder.formal_code}</pre>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                  <span>مخرجات المحاكاة (Simulation Stdout):</span>
                </div>
                <p className="text-xs font-mono text-cyan-300">{triangulationResult.agent_traces.coder.simulation_stdout}</p>
              </div>
            </div>
          )}

          {/* Tab Content 4: Planner */}
          {activeTab === "planner" && (
            <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
                <Compass className="w-4 h-4" />
                <span>المسار السببي الاستدلالي ومخطط DAG غير الحلقي:</span>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300">الخطوات السببية المتسلسلة (Causal Chain):</span>
                <div className="space-y-2">
                  {triangulationResult.agent_traces.planner.causal_steps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                      <div className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-300 font-mono font-bold flex items-center justify-center text-xs shrink-0">
                        {idx + 1}
                      </div>
                      <span className="text-slate-200">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {triangulationResult.agent_traces.planner.dag_edges && (
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-300">روابط الاستدلال ومحاذاة القواعد (DAG Logic Rules):</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    {triangulationResult.agent_traces.planner.dag_edges.map((edge, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-purple-300 font-mono">
                          <span>{edge.from}</span>
                          <ArrowRight className="w-3 h-3 text-slate-500" />
                          <span>{edge.to}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono bg-slate-950 px-1.5 py-0.5 rounded block text-center">
                          Rule: {edge.rule}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab Content 5: Critic */}
          {activeTab === "critic" && (
            <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                  <ShieldAlert className="w-4 h-4" />
                  <span>تدقيق الناقد وحظر الادعاءات الوهمية (Anti-Hallucination Audit):</span>
                </div>
                <span className="text-xs font-mono text-amber-300 font-bold bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-500/30">
                  Score: {triangulationResult.agent_traces.critic.review_score} / 10
                </span>
              </div>

              {triangulationResult.agent_traces.critic.penalized_claims.length > 0 && (
                <div className="p-4 bg-rose-950/30 rounded-xl border border-rose-500/30 space-y-2">
                  <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>ادعاءات مفخخة/وهمية تم اكتشافها وإسقاطها (Penalized Hallucinations):</span>
                  </span>
                  <ul className="space-y-1 text-xs text-rose-200">
                    {triangulationResult.agent_traces.critic.penalized_claims.map((claim, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-rose-400 font-bold">✕</span>
                        <span>{claim}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="p-4 bg-emerald-950/30 rounded-xl border border-emerald-500/30 space-y-2">
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>حقائق مصادق عليها نهائياً (Confirmed Truths):</span>
                </span>
                <ul className="space-y-1 text-xs text-emerald-200">
                  {triangulationResult.agent_traces.critic.confirmed_truths.map((truth, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{truth}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <strong>الحكم النهائي (Final Verdict):</strong> {triangulationResult.agent_traces.critic.final_verdict}
              </div>
            </div>
          )}

          {/* Tab Content 6: V15 Optimizer Closed-Loop Impact */}
          {activeTab === "v15_impact" && (
            <div className="p-5 bg-gradient-to-br from-slate-900 to-indigo-950/80 rounded-2xl border border-indigo-500/40 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>التأثير اللحظي على المحسن المغلق V15 Optimizer:</span>
                </div>
                <span className="text-[10px] font-mono bg-indigo-900/60 px-2 py-0.5 rounded text-indigo-300 border border-indigo-700">
                  Closed-Loop Feedback Active
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-slate-950/90 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[11px] text-slate-400">انخفاض الخسارة اللحظية (Loss Delta)</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-emerald-400 font-mono">
                      {triangulationResult.v15_optimizer_impact.loss_after.toFixed(3)}
                    </span>
                    <span className="text-xs text-rose-400 line-through font-mono">
                      {triangulationResult.v15_optimizer_impact.loss_before.toFixed(3)}
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold font-mono">
                    {triangulationResult.v15_optimizer_impact.loss_delta_pct}%
                  </span>
                </div>

                <div className="p-4 bg-slate-950/90 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[11px] text-slate-400">حالة الثقة المعرفية (Belief State Ψ)</span>
                  <div className="text-xl font-bold text-cyan-400 font-mono">
                    {triangulationResult.v15_optimizer_impact.psi_belief_confidence.toFixed(3)}
                  </div>
                  <span className="text-[10px] text-cyan-300 font-mono">Top Precision Confidence</span>
                </div>

                <div className="p-4 bg-slate-950/90 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[11px] text-slate-400">استقرار معيار التدرج (Grad Norm ||∇L||)</span>
                  <div className="text-xl font-bold text-purple-400 font-mono">
                    {triangulationResult.v15_optimizer_impact.gradient_norm_stabilized.toFixed(4)}
                  </div>
                  <span className="text-[10px] text-purple-300 font-mono">تسريع التقارب {triangulationResult.v15_optimizer_impact.convergence_speedup_x}x</span>
                </div>
              </div>

              {triangulationResult.consciousness_point_created && (
                <div className="p-3.5 bg-slate-950 rounded-xl border border-purple-500/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-slate-300">تم تسجيل نقطة وعي جديدة في مصفوفة الوعي المستمر:</span>
                    <strong className="text-purple-300 font-mono">Index #{triangulationResult.consciousness_point_created.matrix_index}</strong>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                    +{(triangulationResult.consciousness_point_created.awareness_gain * 100).toFixed(1)}% Awareness
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
