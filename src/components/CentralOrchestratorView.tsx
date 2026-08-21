import React, { useState } from 'react';
import { 
  Compass, 
  Database, 
  Bot, 
  Search, 
  ShieldCheck, 
  GitCommit, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Sliders, 
  Zap, 
  Layers,
  ChevronDown,
  ChevronUp,
  Cpu
} from 'lucide-react';
import { CentralOrchestratorDecision, DynamicOrchestratorStep } from '../types';

interface CentralOrchestratorViewProps {
  decision?: CentralOrchestratorDecision;
  userQuery?: string;
  className?: string;
}

export const CentralOrchestratorView: React.FC<CentralOrchestratorViewProps> = ({
  decision,
  userQuery,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState<'memory' | 'agents' | 'search' | 'verify' | 'order' | null>(null);

  if (!decision) return null;

  const { call_memory, use_agents, should_search, should_verify, execution_schedule } = decision;

  return (
    <div className={`rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-slate-950 via-indigo-950/20 to-slate-950 p-4 sm:p-5 shadow-2xl space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-500/20 pb-3.5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 shadow-inner">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>المنسق المركزي الديناميكي (Dynamic Central Orchestrator)</span>
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-mono font-bold flex items-center gap-1">
                <Zap className="w-3 h-3 text-emerald-400" />
                <span>كفاءة التوجيه {((execution_schedule.adaptive_cost_efficiency_score || 0.96) * 100).toFixed(0)}%</span>
              </span>
            </div>
            <p className="text-xs text-indigo-200/70 mt-0.5">
              اتخاذ قرارات الاستدعاء، التوزيع، والتحقق التكيفي وفق مقصد السؤال
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-xs text-indigo-300 hover:text-indigo-100 px-2.5 py-1.5 rounded-lg bg-indigo-950/50 border border-indigo-500/30 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{isExpanded ? 'طي القرارات' : 'عرض القرارات الـ 5'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Dynamic Graph Route Banner */}
      <div className="p-3 rounded-xl bg-slate-900/80 border border-indigo-500/20 text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 text-indigo-300 font-mono font-bold shrink-0">
          <Cpu className="w-4 h-4 text-indigo-400" />
          <span>المسار المنطقي الديناميكي (Dynamic Execution Graph):</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] text-slate-300 bg-slate-950/90 px-3 py-1.5 rounded-lg border border-slate-800">
          {execution_schedule.execution_order.map((step, idx) => (
            <React.Fragment key={step.step_number}>
              <span className={`px-2 py-0.5 rounded font-bold transition-all ${
                step.is_activated 
                  ? 'bg-indigo-900/60 text-indigo-200 border border-indigo-500/40' 
                  : 'bg-slate-800 text-slate-500 line-through'
              }`}>
                {step.step_number}. {step.node_name.split(' ')[0]}
              </span>
              {idx < execution_schedule.execution_order.length - 1 && (
                <span className="text-indigo-400 font-bold">➔</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* The 5 Core Dynamic Orchestrator Questions */}
      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Question 1: هل أستدعي الذاكرة؟ */}
          <div 
            onClick={() => setSelectedQuestion(selectedQuestion === 'memory' ? null : 'memory')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
              selectedQuestion === 'memory'
                ? 'bg-cyan-950/60 border-cyan-400 ring-1 ring-cyan-400/30'
                : 'bg-slate-900/70 border-slate-800 hover:border-cyan-500/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-cyan-400">
                <Database className="w-4 h-4" />
                <span className="text-xs font-bold">1. هل أستدعي الذاكرة؟</span>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md flex items-center gap-1 border ${
                call_memory.decision 
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40' 
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {call_memory.decision ? <CheckCircle2 className="w-3 h-3 text-cyan-400" /> : <XCircle className="w-3 h-3 text-slate-400" />}
                <span>{call_memory.decision ? 'نعم (مفعّل)' : 'تجاوز'}</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed mb-2">
              {call_memory.rationale}
            </p>
            <div className="flex flex-wrap gap-1 text-[10px] font-mono text-cyan-200">
              {call_memory.modules_activated.map((m, idx) => (
                <span key={idx} className="bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800/60">
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* Question 2: هل أستخدم الوكلاء؟ */}
          <div 
            onClick={() => setSelectedQuestion(selectedQuestion === 'agents' ? null : 'agents')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
              selectedQuestion === 'agents'
                ? 'bg-amber-950/60 border-amber-400 ring-1 ring-amber-400/30'
                : 'bg-slate-900/70 border-slate-800 hover:border-amber-500/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-amber-400">
                <Bot className="w-4 h-4" />
                <span className="text-xs font-bold">2. هل أستخدم الوكلاء؟</span>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md flex items-center gap-1 border ${
                use_agents.decision 
                  ? 'bg-amber-950 text-amber-300 border-amber-500/40' 
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {use_agents.decision ? <CheckCircle2 className="w-3 h-3 text-amber-400" /> : <XCircle className="w-3 h-3 text-slate-400" />}
                <span>{use_agents.decision ? `سرب (${use_agents.selected_swarm_agents.length})` : 'مباشر'}</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed mb-2">
              {use_agents.rationale}
            </p>
            <div className="flex flex-wrap gap-1 text-[10px] font-mono text-amber-200">
              {use_agents.selected_swarm_agents.map((agent, idx) => (
                <span key={idx} className="bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-800/60">
                  {agent}
                </span>
              ))}
            </div>
          </div>

          {/* Question 3: هل أبحث؟ */}
          <div 
            onClick={() => setSelectedQuestion(selectedQuestion === 'search' ? null : 'search')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
              selectedQuestion === 'search'
                ? 'bg-purple-950/60 border-purple-400 ring-1 ring-purple-400/30'
                : 'bg-slate-900/70 border-slate-800 hover:border-purple-500/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-purple-400">
                <Search className="w-4 h-4" />
                <span className="text-xs font-bold">3. هل أبحث؟</span>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md flex items-center gap-1 border ${
                should_search.decision 
                  ? 'bg-purple-950 text-purple-300 border-purple-500/40' 
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {should_search.decision ? <CheckCircle2 className="w-3 h-3 text-purple-400" /> : <XCircle className="w-3 h-3 text-slate-400" />}
                <span>{should_search.decision ? should_search.search_type : 'لا يتطلب'}</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed mb-2">
              {should_search.rationale}
            </p>
            <div className="text-[10px] font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-900/60">
              نطاق البحث: {should_search.search_type}
            </div>
          </div>

          {/* Question 4: هل أتحقق؟ */}
          <div 
            onClick={() => setSelectedQuestion(selectedQuestion === 'verify' ? null : 'verify')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
              selectedQuestion === 'verify'
                ? 'bg-rose-950/60 border-rose-400 ring-1 ring-rose-400/30'
                : 'bg-slate-900/70 border-slate-800 hover:border-rose-500/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-rose-400">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-bold">4. هل أتحقق؟</span>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md flex items-center gap-1 border ${
                should_verify.decision 
                  ? 'bg-rose-950 text-rose-300 border-rose-500/40' 
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {should_verify.decision ? <CheckCircle2 className="w-3 h-3 text-rose-400" /> : <XCircle className="w-3 h-3 text-slate-400" />}
                <span>{should_verify.decision ? should_verify.verification_level : 'تجاوز'}</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed mb-2">
              {should_verify.rationale}
            </p>
            <div className="text-[10px] font-mono text-rose-300 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-900/60">
              مستوى التدقيق: {should_verify.verification_level}
            </div>
          </div>
        </div>
      )}

      {/* Question 5: بأي ترتيب؟ (Deep Execution Sequence Inspector) */}
      {isExpanded && (
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>5. بأي ترتيب؟ (Adaptive Execution Schedule - {execution_schedule.strategy_name}):</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              {execution_schedule.execution_order.length} مراحل مرتبة بأولويات ديناميكية
            </span>
          </div>

          <div className="space-y-2">
            {execution_schedule.execution_order.map((step) => (
              <div 
                key={step.step_number}
                className={`p-2.5 rounded-lg border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs transition-all ${
                  step.is_activated 
                    ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700' 
                    : 'bg-slate-950/50 border-slate-900 opacity-60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-500/40 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                    {step.step_number}
                  </span>
                  <div>
                    <span className="font-bold text-slate-200 block sm:inline mr-2">
                      {step.node_name}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      ({step.action})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono text-[10px] shrink-0 self-end sm:self-center">
                  <span className="text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    أولوية: {step.order_priority}
                  </span>
                  <span className={`px-2 py-0.5 rounded border font-bold ${
                    step.is_activated 
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30' 
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {step.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
