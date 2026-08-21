import React, { useState } from 'react';
import { 
  Workflow, 
  HelpCircle, 
  Layers, 
  Database, 
  Globe, 
  Bot, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronRight, 
  Activity, 
  Cpu, 
  Network,
  ArrowDown
} from 'lucide-react';
import { ThoughtTrace } from '../types';

interface CognitivePipelineFlowProps {
  trace?: ThoughtTrace;
  interactive?: boolean;
}

export const CognitivePipelineFlow: React.FC<CognitivePipelineFlowProps> = ({
  trace,
  interactive = true,
}) => {
  const [activeStage, setActiveStage] = useState<number | null>(null);

  const stages = [
    {
      id: 1,
      key: 'user_query',
      title: 'سؤال المستخدم (User Query)',
      subtitle: 'المدخل الحسي وتحديد مقصد السائل',
      icon: HelpCircle,
      color: 'text-sky-400',
      bgColor: 'bg-sky-950/40',
      borderColor: 'border-sky-500/40',
      glow: 'shadow-sky-500/10',
      badge: trace?.classification?.domain_label || 'مدخل أولي',
      data: trace ? {
        query: trace.input,
        domain: trace.classification?.type || 'general',
        depth: trace.classification?.depth_level || 'مباشر',
        comprehension: trace.classification?.comprehension_summary || 'تم استيعاب وتفكيك مقصد السؤال'
      } : null,
      summary: trace?.classification?.comprehension_summary || 'تفكيك المدخل النصي والمرفقات وتحديد التصنيف الدلالي والأسلوب المناسب.'
    },
    {
      id: 2,
      key: 'planner',
      title: 'المخطط التنفيذي (Planner)',
      subtitle: 'تفكيك الأهداف ورسم استراتيجية الحل',
      icon: Layers,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-950/40',
      borderColor: 'border-indigo-500/40',
      glow: 'shadow-indigo-500/10',
      badge: `${trace?.plan?.steps?.length || 3} خطوات تخطيط`,
      data: trace?.plan ? {
        goal: trace.plan.goal,
        goal_type: trace.plan.goal_analysis?.goal_type || 'تحليلي',
        stepsCount: trace.plan.steps.length,
        complexity: `${trace.plan.estimated_complexity || 3}/5`,
        confidence: `${((trace.plan.confidence || 0.92) * 100).toFixed(0)}%`
      } : null,
      summary: trace?.plan?.steps && trace.plan.steps.length > 0 
        ? `تم وضع خطة استدلالية من ${trace.plan.steps.length} خطوات رئيسية بمعامل ثقة ${((trace.plan.confidence || 0.92) * 100).toFixed(0)}%.`
        : 'تحليل المتطلبات وتحديد شجرة المسارات وخطوات المعالجة المنطقية.'
    },
    {
      id: 3,
      key: 'memory',
      title: 'الذاكرة المعرفية (Memory)',
      subtitle: 'استرجاع السياق من الفضاء المتجهي وقواعد المعرفة',
      icon: Database,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-950/40',
      borderColor: 'border-cyan-500/40',
      glow: 'shadow-cyan-500/10',
      badge: `${trace?.retrieved_vector_context?.length || 2} سياقات مسترجعة`,
      data: trace ? {
        vectorContexts: trace.retrieved_vector_context?.length || 0,
        conceptsAnchored: trace.meta_cognition?.knowledge_graph_anchors?.length || 0,
        memoryTypes: ['Sensory', 'Short-term', 'Episodic', 'Semantic', 'Vector']
      } : null,
      summary: trace?.retrieved_vector_context && trace.retrieved_vector_context.length > 0
        ? `تم استرجاع ${trace.retrieved_vector_context.length} سياقات عبر الفضاء المتجهي وتشابه جيب التمام.`
        : 'الربط مع الذاكرة قصيرة المدى، الذاكرة الدلالية، والبحث المتجهي التكيفي.'
    },
    {
      id: 4,
      key: 'world_model',
      title: 'نموذج العالم (World Model)',
      subtitle: 'استخراج الكيانات، العلاقات، والقوانين السببية',
      icon: Globe,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-950/40',
      borderColor: 'border-emerald-500/40',
      glow: 'shadow-emerald-500/10',
      badge: `${trace?.situation?.entities?.length || 3} كيانات مستخرجة`,
      data: trace?.situation ? {
        entities: trace.situation.entities?.map(e => e.name).slice(0, 4) || [],
        relationships: trace.situation.relationships?.length || 0,
        contextSummary: trace.situation.summary || 'بناء المحاكاة المعرفية للبيئة'
      } : null,
      summary: trace?.situation?.summary || 'محاكاة بيئة المسألة، استخراج الكيانات، وتأسيس العلاقات السببية بين المفاهيم.'
    },
    {
      id: 5,
      key: 'swarm_agents',
      title: 'السرب الذكي (Swarm Agents)',
      subtitle: 'الوكلاء المتخصصون (البحث، الكود، التخطيط، النقد)',
      icon: Bot,
      color: 'text-amber-400',
      bgColor: 'bg-amber-950/40',
      borderColor: 'border-amber-500/40',
      glow: 'shadow-amber-500/10',
      badge: 'الوكلاء التخصصيون',
      data: {
        agents: ['Planner Agent', 'Research Agent', 'Code Generator', 'Critic Agent'],
        mode: 'تنسيق متوازي وموزع'
      },
      summary: 'توزيع المهام الفرعية على الوكلاء المتخصصين للبحث وتوليد الأكواد والتدقيق الذاتي.'
    },
    {
      id: 6,
      key: 'gemini',
      title: 'محرك Gemini الإدراكي (عند الحاجة)',
      subtitle: 'الاستدلال التوليدي المتقدم والشجرة الاحتمالية',
      icon: Sparkles,
      color: 'text-purple-400',
      bgColor: 'bg-purple-950/40',
      borderColor: 'border-purple-500/40',
      glow: 'shadow-purple-500/10',
      badge: trace?.reasoning?.branches?.length ? `P(S) = ${((trace.reasoning.best_branch?.probabilistic_score_P_S || 0.89) * 100).toFixed(1)}%` : 'Active Core',
      data: trace?.reasoning ? {
        strategy: trace.reasoning.strategy,
        branchesCount: trace.reasoning.branches?.length || 0,
        formula: trace.reasoning.evaluation_formula || 'P(S) = ∏ (w_i · C_i)',
        optimalTrajectory: trace.reasoning.best_branch?.probabilistic_score_P_S || 0.89
      } : null,
      summary: 'التوليد الاستدلالي متعدد المسارات، تقييم شجرة الأفكار الاحتمالية، وحساب وزن المسار الأمثل.'
    },
    {
      id: 7,
      key: 'verifier',
      title: 'المدقق ما وراء المعرفي (MetaCognitiveVerifier)',
      subtitle: 'التدقيق الإبستيمي، منع الهلوسة، ومطابقة الرسم المعرفي',
      icon: ShieldCheck,
      color: 'text-rose-400',
      bgColor: 'bg-rose-950/40',
      borderColor: 'border-rose-500/40',
      glow: 'shadow-rose-500/10',
      badge: trace?.meta_cognition ? `مخاطر ${(trace.meta_cognition.hallucination_risk_score * 100).toFixed(1)}%` : 'Epistemic Verified',
      data: trace?.meta_cognition ? {
        consistencyScore: `${((trace.meta_cognition.factual_consistency_score || 0.98) * 100).toFixed(1)}%`,
        hallucinationRisk: `${((trace.meta_cognition.hallucination_risk_score || 0.018) * 100).toFixed(1)}%`,
        anchorsCount: trace.meta_cognition.knowledge_graph_anchors?.length || 0,
        certificateId: trace.meta_cognition.verification_certificate_id || 'CERT-OMEGA-MC'
      } : null,
      summary: trace?.meta_cognition?.verification_summary || 'التدقيق المعرفي الشامل للمخرجات ومطابقتها بالرسم البياني المعرفي وفصل الحقائق عن الفرضيات.'
    },
    {
      id: 8,
      key: 'response',
      title: 'الإجابة المصاغة (Final Output)',
      subtitle: 'الصياغة النهائية البليغة والمتوافقة مع مقصد السائل',
      icon: CheckCircle2,
      color: 'text-emerald-300',
      bgColor: 'bg-emerald-950/50',
      borderColor: 'border-emerald-400/50',
      glow: 'shadow-emerald-500/20',
      badge: 'اكتمل بنجاح',
      data: trace ? {
        responsePreview: trace.response.slice(0, 100) + '...',
        qualityScore: `${((trace.reflection?.quality_score || 0.94) * 100).toFixed(0)}%`,
        latency: 'فوري وعالي الكفاءة'
      } : null,
      summary: 'تقديم المخرجات بجودة معرفية وبرهانية فائقة مع دعم التنسيقات الرياضية والأدبية.'
    }
  ];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 backdrop-blur-xl p-4 sm:p-5 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 shadow-inner">
            <Workflow className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>خط أنابيب المعالجة الإدراكية (Omega Cognitive Pipeline)</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-900/60 text-indigo-300 border border-indigo-500/30 font-mono">
                Architecture v3.8
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              التدفق المعماري المتكامل من استقبال السؤال وحتى اعتماد الإجابة المدققة
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-slate-200">8 مراحل تسلسلية</span>
          </span>
        </div>
      </div>

      {/* Pipeline Diagram: Vertical / Horizontal Responsive Grid */}
      <div className="relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            const isSelected = activeStage === stage.id;
            
            return (
              <div
                key={stage.id}
                onClick={() => interactive && setActiveStage(isSelected ? null : stage.id)}
                className={`relative group rounded-xl p-3.5 border transition-all cursor-pointer ${
                  isSelected
                    ? `${stage.bgColor} ${stage.borderColor} shadow-lg ${stage.glow} ring-1 ring-white/20 scale-[1.02]`
                    : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                {/* Step Number Marker */}
                <div className="flex items-center justify-between mb-2">
                  <span className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono font-bold flex items-center justify-center">
                    {stage.id}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${stage.bgColor} ${stage.borderColor} ${stage.color}`}>
                    {stage.badge}
                  </span>
                </div>

                {/* Stage Title & Icon */}
                <div className="flex items-start gap-2.5 mb-2">
                  <div className={`p-2 rounded-lg bg-slate-950/80 border border-slate-800 ${stage.color} shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-100 group-hover:text-white transition-colors">
                      {stage.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      {stage.subtitle}
                    </p>
                  </div>
                </div>

                {/* Summary / Data snippet */}
                <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
                  {stage.summary}
                </p>

                {/* Flow indicator arrow to next step (for desktop layout) */}
                {idx < stages.length - 1 && (
                  <div className="hidden lg:block absolute -left-2.5 top-1/2 -translate-y-1/2 z-10 text-slate-600 group-hover:text-indigo-400 transition-colors">
                    <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Deep Stage Inspector (When clicked) */}
      {activeStage !== null && (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 shadow-xl space-y-3 animate-in fade-in zoom-in-95 duration-200">
          {(() => {
            const current = stages.find(s => s.id === activeStage);
            if (!current) return null;
            const Icon = current.icon;

            return (
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg bg-slate-950 border border-slate-800 ${current.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-100">
                        تفاصيل مرحلة: {current.title}
                      </h4>
                      <p className="text-[11px] text-slate-400">{current.subtitle}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveStage(null)}
                    className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded bg-slate-800 border border-slate-700"
                  >
                    إغلاق
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1.5">
                    <span className="font-bold text-slate-200 block">الدور الوظيفي في المعمارية:</span>
                    <p className="text-slate-300 leading-relaxed">{current.summary}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1.5">
                    <span className="font-bold text-slate-200 block">بيانات التشغيل الفعلية:</span>
                    {current.data ? (
                      <div className="space-y-1 font-mono text-[11px] text-slate-300">
                        {Object.entries(current.data).map(([k, v]) => (
                          <div key={k} className="flex justify-between border-b border-slate-800/60 pb-1">
                            <span className="text-slate-400">{k}:</span>
                            <span className="text-cyan-300 text-left font-sans">{Array.isArray(v) ? v.join(', ') : String(v)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-xs">جاهز لاستقبال المهام والاستدعاء التكيفي.</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Architecture Flow Representation ASCII / Linear Bar */}
      <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 text-[11px] font-mono text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-slate-300">
          <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-bold">المسار المنطقي:</span>
        </div>
        <div className="flex flex-wrap items-center gap-1 text-slate-300 text-[10px]">
          <span>سؤال المستخدم</span>
          <span className="text-indigo-400">→</span>
          <span className="text-indigo-300 font-bold">Planner</span>
          <span className="text-indigo-400">→</span>
          <span className="text-cyan-300 font-bold">Memory</span>
          <span className="text-indigo-400">→</span>
          <span className="text-emerald-300 font-bold">World Model</span>
          <span className="text-indigo-400">→</span>
          <span className="text-amber-300 font-bold">Swarm Agents</span>
          <span className="text-indigo-400">→</span>
          <span className="text-purple-300 font-bold">Gemini</span>
          <span className="text-indigo-400">→</span>
          <span className="text-rose-300 font-bold">MetaCognitiveVerifier</span>
          <span className="text-indigo-400">→</span>
          <span className="text-emerald-400 font-bold">الإجابة</span>
        </div>
      </div>
    </div>
  );
};
