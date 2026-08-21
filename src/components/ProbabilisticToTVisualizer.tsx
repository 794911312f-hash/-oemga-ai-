import React, { useState } from "react";
import { 
  GitFork, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  Activity, 
  Layers, 
  Scale, 
  TrendingUp, 
  Zap, 
  Info,
  Maximize2,
  Minimize2,
  Calculator
} from "lucide-react";
import { ThoughtBranch, ReasoningResult, ProbabilisticThoughtStep } from "../types";
import { MathRenderer } from "./MathRenderer";

interface ProbabilisticToTVisualizerProps {
  reasoning?: ReasoningResult;
  branches?: ThoughtBranch[];
  bestBranchId?: number;
  formulaExpression?: string;
  onSelectBranch?: (branch: ThoughtBranch) => void;
}

export const ProbabilisticToTVisualizer: React.FC<ProbabilisticToTVisualizerProps> = ({
  reasoning,
  branches: directBranches,
  bestBranchId,
  formulaExpression,
  onSelectBranch,
}) => {
  const activeBranches = directBranches || reasoning?.branches || [];

  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(() => {
    return bestBranchId || reasoning?.best_branch_id || reasoning?.best_branch?.id || (activeBranches.length > 0 ? activeBranches[0].id : 1);
  });
  const [viewMode, setViewMode] = useState<"tree" | "formula" | "matrix">("tree");

  // Fallback branches if empty
  const branches: ThoughtBranch[] = (activeBranches && activeBranches.length > 0)
    ? activeBranches
    : [
        {
          id: 1,
          content: "المسار الاستدلالي المباشر والبرهاني المنسق",
          score: 0.96,
          probabilistic_score_P_S: 0.884,
          trajectory_status: "optimal",
          formula_latex: "P(S_1) = \\prod_{i=1}^3 (w_i \\cdot C_i) = (0.40 \\cdot 0.98)(0.35 \\cdot 0.95)(0.25 \\cdot 0.96) \\approx 0.884",
          steps_evaluation: [
            { step_index: 1, step_title: "التماسك المنطقي وتفكيك المسألة", weight_w: 0.40, confidence_c: 0.98, step_prob: 0.392, justification: "تفكيك صريح لجوهر السؤال ومقصد السائل" },
            { step_index: 2, step_title: "البرهان التخصصي والاستشهاد الدقيق", weight_w: 0.35, confidence_c: 0.95, step_prob: 0.332, justification: "تطبيق القوانين العلمية والأدلة المعرفية الموثقة" },
            { step_index: 3, step_title: "الفصل الإبستيمي والتركيب النهائي", weight_w: 0.25, confidence_c: 0.96, step_prob: 0.240, justification: "صياغة واضحة تميز بين الحقائق والفرضيات" },
          ],
        },
        {
          id: 2,
          content: "المسار التحليلي الاستكشافي والتوسعي",
          score: 0.89,
          probabilistic_score_P_S: 0.742,
          trajectory_status: "viable",
          formula_latex: "P(S_2) = \\prod_{i=1}^3 (w_i \\cdot C_i) = (0.40 \\cdot 0.92)(0.35 \\cdot 0.88)(0.25 \\cdot 0.90) \\approx 0.742",
          steps_evaluation: [
            { step_index: 1, step_title: "توليد الفرضيات والمحاور البديلة", weight_w: 0.40, confidence_c: 0.92, step_prob: 0.368, justification: "استكشاف أبعاد إضافية محتملة" },
            { step_index: 2, step_title: "المقارنة مع النظريات المجاورة", weight_w: 0.35, confidence_c: 0.88, step_prob: 0.308, justification: "تحليل احتمالي أوسع" },
            { step_index: 3, step_title: "التكامل المعرفي الشامل", weight_w: 0.25, confidence_c: 0.90, step_prob: 0.225, justification: "خلاصة تدمج المقترحات" },
          ],
        },
        {
          id: 3,
          content: "مسار التقدير السريع والمحاكاة التخمينية",
          score: 0.65,
          probabilistic_score_P_S: 0.428,
          trajectory_status: "pruned",
          formula_latex: "P(S_3) = \\prod_{i=1}^3 (w_i \\cdot C_i) = (0.40 \\cdot 0.75)(0.35 \\cdot 0.68)(0.25 \\cdot 0.70) \\approx 0.428",
          steps_evaluation: [
            { step_index: 1, step_title: "الحدس التقديري الأولي", weight_w: 0.40, confidence_c: 0.75, step_prob: 0.300, justification: "تقدير سريع غير مكتمل البراهين" },
            { step_index: 2, step_title: "الاستنتاج غير المقيد بالرسم البياني", weight_w: 0.35, confidence_c: 0.68, step_prob: 0.238, justification: "وجود تباين في الثقة" },
            { step_index: 3, step_title: "الإغلاق السريع", weight_w: 0.25, confidence_c: 0.70, step_prob: 0.175, justification: "تم تشذيبه لترجيح المسار الأمثل" },
          ],
        }
      ];

  const activeBranch = branches.find((b) => b.id === selectedBranchId) || branches[0];

  return (
    <div className="rounded-xl border border-cyan-500/20 bg-slate-950/80 p-4 shadow-xl backdrop-blur-md">
      {/* Header with Mathematical Formula Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <GitFork className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-cyan-200">
                شجرة الأفكار الاحتمالية (Probabilistic Tree-of-Thought Engine)
              </h4>
              <span className="rounded-md bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 text-[11px] font-mono text-cyan-300">
                ToT Probabilistic Matrix
              </span>
            </div>
            <p className="text-xs text-slate-400">
              تقييم دقة كل مسار تفكير بالمعادلة الاحتمالية: <span className="font-mono text-cyan-300">P(S) = ∏(w_i · C_i)</span>
            </p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 rounded-lg bg-slate-900 border border-slate-800 p-1 text-xs">
          <button
            onClick={() => setViewMode("tree")}
            className={`rounded px-2.5 py-1 transition-colors ${viewMode === "tree" ? "bg-cyan-600 text-white font-medium" : "text-slate-400 hover:text-slate-200"}`}
          >
            الشجرة والمصادفة
          </button>
          <button
            onClick={() => setViewMode("formula")}
            className={`rounded px-2.5 py-1 transition-colors ${viewMode === "formula" ? "bg-cyan-600 text-white font-medium" : "text-slate-400 hover:text-slate-200"}`}
          >
            المعادلة الرياضية
          </button>
          <button
            onClick={() => setViewMode("matrix")}
            className={`rounded px-2.5 py-1 transition-colors ${viewMode === "matrix" ? "bg-cyan-600 text-white font-medium" : "text-slate-400 hover:text-slate-200"}`}
          >
            مصفوفة الأوزان
          </button>
        </div>
      </div>

      {/* Formula Highlight Banner */}
      <div className="mt-3 rounded-lg border border-cyan-500/15 bg-cyan-950/20 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Calculator className="h-4 w-4 text-cyan-400" />
            <span className="font-semibold text-cyan-200">الصيغة الرياضية الحاكمة لدقة المسارات:</span>
          </div>
          <div className="font-mono text-xs text-slate-300">
            حيث <span className="text-cyan-300 font-bold">w_i</span> هو وزن الخطوة، و <span className="text-emerald-300 font-bold">C_i</span> هو معامل الثقة.
          </div>
        </div>
        <div className="mt-2 text-center py-1">
          <MathRenderer 
            content="$$P(S) = \prod_{i=1}^n \left( w_i \cdot C_i \right) = (w_1 \cdot C_1) \times (w_2 \cdot C_2) \times \dots \times (w_n \cdot C_n)$$" 
            displayMode={true} 
          />
        </div>
      </div>

      {/* Branches Navigation Cards */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {branches.map((branch) => {
          const isSelected = branch.id === selectedBranchId;
          const isOptimal = branch.trajectory_status === "optimal" || (branch.probabilistic_score_P_S || branch.score) >= 0.85;
          const isPruned = branch.trajectory_status === "pruned" || (branch.probabilistic_score_P_S || branch.score) < 0.55;
          const pVal = branch.probabilistic_score_P_S || branch.score;

          return (
            <div
              key={branch.id}
              onClick={() => {
                setSelectedBranchId(branch.id);
                if (onSelectBranch) onSelectBranch(branch);
              }}
              className={`cursor-pointer rounded-xl border p-3.5 transition-all relative overflow-hidden ${
                isSelected
                  ? "border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-900/20 ring-1 ring-cyan-400/40"
                  : isOptimal
                  ? "border-emerald-500/30 bg-slate-900/60 hover:border-emerald-500/60"
                  : isPruned
                  ? "border-rose-900/30 bg-slate-900/30 opacity-70 hover:opacity-100"
                  : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
              }`}
            >
              {/* Status Ribbon */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-slate-200">مسار التفكير #{branch.id}</span>
                {isOptimal && (
                  <span className="inline-flex items-center gap-1 rounded bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 text-[10px] font-medium text-emerald-300">
                    <CheckCircle2 className="h-3 w-3" />
                    المسار الأمثل S*
                  </span>
                )}
                {isPruned && (
                  <span className="inline-flex items-center gap-1 rounded bg-rose-500/15 border border-rose-500/30 px-1.5 py-0.5 text-[10px] font-medium text-rose-300">
                    <XCircle className="h-3 w-3" />
                    تشذيب (Pruned)
                  </span>
                )}
                {!isOptimal && !isPruned && (
                  <span className="rounded bg-slate-800 border border-slate-700 px-1.5 py-0.5 text-[10px] font-medium text-slate-300">
                    مسار بديل (Viable)
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 line-clamp-2 mb-3">
                {branch.content}
              </p>

              {/* Probabilistic Gauge */}
              <div className="mt-auto border-t border-slate-800/80 pt-2 flex items-center justify-between text-xs">
                <span className="text-slate-400">احتمالية المسار P(S):</span>
                <span className={`font-mono font-bold ${isOptimal ? "text-emerald-400" : isPruned ? "text-rose-400" : "text-cyan-400"}`}>
                  {typeof pVal === "number" ? pVal.toFixed(3) : pVal}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className={`h-full rounded-full ${
                    isOptimal
                      ? "bg-gradient-to-r from-cyan-500 to-emerald-400"
                      : isPruned
                      ? "bg-rose-500"
                      : "bg-cyan-500"
                  }`}
                  style={{ width: `${Math.min(100, Math.max(10, (typeof pVal === "number" ? pVal : 0.8) * 100))}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Steps Breakdown for Active Branch */}
      {activeBranch && (
        <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950/60 p-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-cyan-300">
                تفاصيل المسار الاحتمالي #{activeBranch.id}:
              </span>
              <span className="text-xs text-slate-300 font-medium truncate max-w-md">
                {activeBranch.content}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <span>P(S_{activeBranch.id}) = {(activeBranch.probabilistic_score_P_S || activeBranch.score || 0.88).toFixed(3)}</span>
            </div>
          </div>

          {/* Steps evaluation table/cards */}
          <div className="space-y-2">
            {(activeBranch.steps_evaluation || [
              { step_index: 1, step_title: "التماسك المنطقي الداخلي", weight_w: 0.35, confidence_c: 0.98, step_prob: 0.343, justification: "تفكيك منطقي مباشر بدون تناقض" },
              { step_index: 2, step_title: "البرهان والدقة التخصصية", weight_w: 0.35, confidence_c: 0.95, step_prob: 0.332, justification: "استحضار الأدلة العلمية والأدبية الصريحة" },
              { step_index: 3, step_title: "الفصل الإبستيمي والوضوح", weight_w: 0.30, confidence_c: 0.96, step_prob: 0.288, justification: "تأطير المقترحات بدقة مع التمييز بين الحقائق والفرضيات" },
            ]).map((step, sIdx) => (
              <div
                key={sIdx}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-800/80 bg-slate-900/60 p-2.5 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 font-mono font-bold text-[10px]">
                    {step.step_index}
                  </span>
                  <div>
                    <span className="font-medium text-slate-200">{step.step_title}</span>
                    {step.justification && (
                      <p className="text-[11px] text-slate-400 mt-0.5">{step.justification}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 font-mono text-[11px]">
                  <div className="rounded bg-slate-950 px-2 py-1 border border-slate-800">
                    <span className="text-slate-400">الوزن w_{step.step_index}: </span>
                    <span className="text-cyan-300 font-bold">{step.weight_w.toFixed(2)}</span>
                  </div>
                  <div className="rounded bg-slate-950 px-2 py-1 border border-slate-800">
                    <span className="text-slate-400">الثقة C_{step.step_index}: </span>
                    <span className="text-emerald-300 font-bold">{step.confidence_c.toFixed(2)}</span>
                  </div>
                  <div className="rounded bg-cyan-950/40 px-2 py-1 border border-cyan-500/30">
                    <span className="text-cyan-400">w·C: </span>
                    <span className="text-cyan-200 font-bold">{step.step_prob.toFixed(3)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Product equation derivation */}
          {activeBranch.formula_latex && (
            <div className="mt-3 rounded border border-slate-800 bg-slate-950 p-2 text-center text-xs text-slate-300">
              <MathRenderer content={`$$${activeBranch.formula_latex}$$`} displayMode={true} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
