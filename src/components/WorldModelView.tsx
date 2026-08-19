import React, { useState } from "react";
import { 
  Globe2, 
  Share2, 
  TrendingUp, 
  ShieldAlert, 
  Play, 
  Sparkles, 
  Cpu, 
  Compass,
  Layers,
  ArrowRight,
  ShieldCheck
} from "lucide-react";

export const WorldModelView: React.FC = () => {
  const [actionInput, setActionInput] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);
  const [predictionResult, setPredictionResult] = useState<any>(null);

  const defaultEntities = [
    { name: "OmegaBrain", type: "Core Cognitive Host", description: "المركز التنفيذي الرئيسي وتنسيق التفكير" },
    { name: "SwarmTeam", type: "Autonomous Agents", description: "فريق الوكلاء الخمسة المتكامل" },
    { name: "MemoryMatrix", type: "Persistent Knowledge Hub", description: "بنوك الذاكرة الخمسة والتضمينات المتجهية" },
    { name: "NeuralOptimizer", type: "OmegaV15 Engine", description: "المحسن المغلق الحلقات ومراقبة CUSUM" },
    { name: "UserEnvironment", type: "External Context", description: "بيئة المستخدم والمهام الحية" },
  ];

  const defaultRelationships = [
    { from: "OmegaBrain", to: "SwarmTeam", description: "توجيه وتكليف المهام المعقدة" },
    { from: "SwarmTeam", to: "MemoryMatrix", description: "استرجاع المعرفة وحفظ الخبرات" },
    { from: "OmegaBrain", to: "NeuralOptimizer", description: "تعديل إشارات الثقة Ψ والعدوانية a" },
    { from: "UserEnvironment", to: "OmegaBrain", description: "إرسال الاستفسارات والبيانات" },
  ];

  const actionPresets = [
    "إعادة موازنة أوزان خبراء MoE الثمانية أثناء الحمل المعرفي الفائق",
    "تفعيل آلية الاسترداد السريع RecoveryManager بعد اكتشاف انحراف في الخسارة",
    "توسيع بنك الذاكرة المتجهية بـ 100,000 تضمين دلالي جديد",
    "عزل مهمة برمجية غير موثوقة داخل بيئة تنفيذ Python معزولة تماماً",
  ];

  const handleSimulate = async (actionText: string) => {
    if (!actionText.trim() || isSimulating) return;
    setIsSimulating(true);
    setPredictionResult(null);

    try {
      const res = await fetch("/api/world-model/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: actionText,
          current_situation: "نظام أوميجا قيد الاستعداد الفائق بكامل محركاته",
        }),
      });
      const data = await res.json();
      setPredictionResult(data);
    } catch (e) {
      console.error("Simulation error", e);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-indigo-950/80 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Dynamic World Model & Predictive Simulation
              </span>
              <span className="text-xs text-slate-400">• Mental Simulations & Causal Graph</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">نموذج العالم ومحاكي التنبؤ بالمآلات</h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              بناء فهم داخلي للكيانات والعلاقات، واختبار سيناريوهات الإجراءات المستقبلية وحساب احتمالات النتائج قبل اتخاذ القرار.
            </p>
          </div>
        </div>

        {/* Action Prediction Launcher */}
        <div className="mt-6 pt-6 border-t border-slate-800/80">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={actionInput}
              onChange={(e) => setActionInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSimulate(actionInput);
              }}
              placeholder="اكتب الإجراء الذي ترغب في محاكاته وتوقع نتائجه ومخاطره..."
              className="flex-1 bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
            <button
              onClick={() => handleSimulate(actionInput)}
              disabled={!actionInput.trim() || isSimulating}
              className={`px-6 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shrink-0 ${
                !actionInput.trim() || isSimulating
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/30"
              }`}
            >
              {isSimulating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>جاري المحاكاة التنبؤية...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>محاكاة وتوقع النتائج</span>
                </>
              )}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-400">
            <span>سيناريوهات مقترحة:</span>
            {actionPresets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActionInput(p);
                  handleSimulate(p);
                }}
                className="bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-emerald-300 px-3 py-1 rounded-lg transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Simulation Result */}
      {predictionResult && (
        <div className="bg-slate-900/80 border border-emerald-500/30 rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
              <Sparkles className="w-5 h-5" />
              <span>نتائج المحاكاة التنبؤية للإجراء: "{predictionResult.action}"</span>
            </div>
            <span className="text-xs text-slate-400">نموذج المحاكاة التنبؤي (World Model Engine)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {predictionResult.outcomes?.map((out: any, idx: number) => {
              const probPct = (out.probability * 100).toFixed(0);
              return (
                <div key={idx} className="p-5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">سيناريو {idx + 1}</span>
                    <span className="px-2 py-0.5 rounded-full font-mono text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      احتمالية: {probPct}%
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-medium">{out.scenario}</p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                    <span>الأثر: <strong className="text-indigo-300">{out.impact || "إيجابي"}</strong></span>
                    <span>المخاطر: <strong className="text-amber-300">{out.risk || "منخفضة"}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>

          {predictionResult.recommended_safeguards && (
            <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl text-xs space-y-1.5">
              <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>إجراءات الحماية الموصى بها (Recommended Safeguards):</span>
              </span>
              <ul className="space-y-1 text-slate-300 pr-5 list-disc">
                {predictionResult.recommended_safeguards.map((sg: string, sIdx: number) => (
                  <li key={sIdx}>{sg}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Entity & Relationship Graph Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Entities */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>الكيانات الرئيسية المسجلة في نموذج العالم (Entity Nodes)</span>
          </div>

          <div className="space-y-2.5">
            {defaultEntities.map((ent, idx) => (
              <div key={idx} className="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-2xl text-xs flex items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-slate-100 block">{ent.name}</span>
                  <span className="text-[11px] text-slate-400">{ent.description}</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-1 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-500/30 whitespace-nowrap">
                  {ent.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Relationships */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
            <Share2 className="w-4 h-4 text-purple-400" />
            <span>شبكة العلاقات والروابط السببية (Causal Graph Edges)</span>
          </div>

          <div className="space-y-2.5">
            {defaultRelationships.map((rel, idx) => (
              <div key={idx} className="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-2xl text-xs space-y-1.5">
                <div className="flex items-center gap-2 font-mono text-indigo-300 text-[11px]">
                  <span>{rel.from}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 rotate-180" />
                  <span className="text-purple-300">{rel.to}</span>
                </div>
                <p className="text-slate-300 text-[11px]">{rel.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
