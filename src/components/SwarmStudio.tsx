import React, { useState } from "react";
import { 
  Users, 
  Search, 
  Code2, 
  Compass, 
  ShieldAlert, 
  Play, 
  CheckCircle2, 
  Clock, 
  Award, 
  Sparkles,
  Terminal,
  FileCode,
  Check,
  Copy,
  ExternalLink,
  Zap
} from "lucide-react";
import { SwarmResult } from "../types";

export const SwarmStudio: React.FC = () => {
  const [taskInput, setTaskInput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [swarmResult, setSwarmResult] = useState<SwarmResult | null>(null);
  const [activeAgentTab, setActiveAgentTab] = useState<"overview" | "researcher" | "coder" | "planner" | "critic">("overview");
  const [copiedCode, setCopiedCode] = useState(false);

  const swarmPresets = [
    { title: "بناء خوارزمية ذكاء اصطناعي ذاتية التكيف", task: "برمجة خوارزمية بايثون متقدمة لتنظيم التدرجات في شبكات Transformer مع آلية مراقبة الانحراف CUSUM واختبارها." },
    { title: "بحث وتصميم نظام ذاكرة متجهية هجين", task: "إجراء دراسة بحثية شاملة وتصميم نظام ذاكرة متجهية هجين يدمج HNSW مع الذاكرة الدلالية والزمنية." },
    { title: "خطة تطوير ونشر نموذج 90 طبقة MoE", task: "وضع خطة هرمية وبرمجية كاملة لتدريب ونشر نموذج لغوي 90 طبقة مع 8 خبراء MoE وتوزيع الأحمال." },
  ];

  const handleRunSwarm = async (taskText: string) => {
    if (!taskText.trim() || isRunning) return;
    setIsRunning(true);
    setSwarmResult(null);

    try {
      const res = await fetch("/api/agents/swarm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: taskText }),
      });
      const data = await res.json();
      setSwarmResult(data);
      setActiveAgentTab("overview");
    } catch (err) {
      console.error("Swarm execution error:", err);
    } finally {
      setIsRunning(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const agentsList = [
    { id: "manager", name: "Manager Agent", role: "المدير والمنسق التنفيذي", icon: Users, color: "text-indigo-400 border-indigo-500/30 bg-indigo-950/40" },
    { id: "researcher", name: "Researcher Agent", role: "وكيل البحث والتحليل العميق", icon: Search, color: "text-cyan-400 border-cyan-500/30 bg-cyan-950/40" },
    { id: "coder", name: "Coder Agent", role: "وكيل البرمجة والتصحيح الذاتي", icon: Code2, color: "text-emerald-400 border-emerald-500/30 bg-emerald-950/40" },
    { id: "planner", name: "Planner Agent", role: "وكيل التخطيط والمسار الحرج", icon: Compass, color: "text-purple-400 border-purple-500/30 bg-purple-950/40" },
    { id: "critic", name: "Critic Agent", role: "وكيل النقد والاعتماد الصارم", icon: ShieldAlert, color: "text-amber-400 border-amber-500/30 bg-amber-950/40" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/80 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Multi-Agent Autonomous Swarm
              </span>
              <span className="text-xs text-slate-400">• 5 وكلاء متخصصين متكاملين</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">خلية الوكلاء الذكية (Omega Swarm)</h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              توزيع المهام المعقدة ذاتياً بين المدير والباحث والمبرمج والمخطط والناقد للوصول لأقصى دقة وتنفيذ برمجي خالي من الأخطاء.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 p-2 rounded-2xl">
            {agentsList.map((agent) => {
              const Icon = agent.icon;
              return (
                <div key={agent.id} className={`p-2 rounded-xl border ${agent.color} flex items-center gap-1.5 text-xs font-semibold`} title={agent.name}>
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{agent.name.split(" ")[0]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Task Input Launcher */}
        <div className="mt-6 pt-6 border-t border-slate-800/80">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRunSwarm(taskInput);
              }}
              placeholder="اكتب مهمة الفريق (مثال: بحث وتطوير خوارزمية ذكاء اصطناعي متقدمة مع كود كامل وخطة نشر)..."
              className="flex-1 bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
            <button
              onClick={() => handleRunSwarm(taskInput)}
              disabled={!taskInput.trim() || isRunning}
              className={`px-6 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shrink-0 ${
                !taskInput.trim() || isRunning
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/30"
              }`}
            >
              {isRunning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>الوكلاء قيد التنفيذ...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>تشغيل خلية الوكلاء</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-400">
            <span>مهام جاهزة سريعة:</span>
            {swarmPresets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTaskInput(p.task);
                  handleRunSwarm(p.task);
                }}
                className="bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-indigo-300 px-3 py-1 rounded-lg transition-colors"
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Swarm Live Execution State / Result */}
      {isRunning && (
        <div className="bg-slate-900/80 border border-indigo-500/40 rounded-3xl p-8 shadow-2xl text-center space-y-6 animate-pulse">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400">
            <Zap className="w-8 h-8 animate-bounce" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1">فريق Omega Swarm يتداول في تنفيذ المهمة...</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Manager يوجه الأهداف ⇾ Researcher يجمع الأدلة ⇾ Coder يبني الخوارزمية ⇾ Planner يضع الجدول ⇾ Critic يدقق النتائج.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {agentsList.slice(1).map((ag) => (
              <div key={ag.id} className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-center gap-2 justify-center">
                <ag.icon className="w-4 h-4 text-indigo-400 animate-spin" />
                <span>{ag.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {swarmResult && !isRunning && (
        <div className="space-y-6">
          {/* Swarm Result Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
            <button
              onClick={() => setActiveAgentTab("overview")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeAgentTab === "overview"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              نظرة عامة والحل النهائي
            </button>
            <button
              onClick={() => setActiveAgentTab("researcher")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeAgentTab === "researcher"
                  ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/20"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>مخرجات الباحث (Researcher)</span>
            </button>
            <button
              onClick={() => setActiveAgentTab("coder")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeAgentTab === "coder"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>كود المبرمج (Coder)</span>
            </button>
            <button
              onClick={() => setActiveAgentTab("planner")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeAgentTab === "planner"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>خطة المخطط (Planner)</span>
            </button>
            <button
              onClick={() => setActiveAgentTab("critic")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeAgentTab === "critic"
                  ? "bg-amber-600 text-white shadow-md shadow-amber-600/20"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>مراجعة الناقد (Critic Score: {swarmResult.review?.score || 9.5}/10)</span>
            </button>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeAgentTab === "overview" && (
            <div className="space-y-6">
              {/* Executive Summary Card */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">النتيجة التنفيذية النهائية</h2>
                      <p className="text-xs text-slate-400 font-mono">نوع المهمة: {swarmResult.task_type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-300">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <span>تقييم الناقد: {swarmResult.review?.score || 9.5} / 10</span>
                  </div>
                </div>

                <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {swarmResult.final_result}
                </div>

                {/* Manager Analysis Banner */}
                <div className="p-4 bg-indigo-950/30 border border-indigo-500/20 rounded-2xl text-xs text-slate-300">
                  <strong className="text-indigo-300 block mb-1">توجيهات Manager Agent:</strong>
                  <p>{swarmResult.analysis}</p>
                </div>
              </div>

              {/* Swarm Sub-Outputs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Researcher summary */}
                <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                    <Search className="w-4 h-4" />
                    <span>خلاصة البحث المعرفي</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {swarmResult.results?.researcher?.summary || swarmResult.results?.researcher?.analysis}
                  </p>
                </div>

                {/* Planner Roadmap summary */}
                <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
                    <Compass className="w-4 h-4" />
                    <span>تقييم الخطة التشغيلية</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {swarmResult.results?.planner?.evaluation || "تم وضع وتنسيق مراحل التنفيذ بنجاح."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RESEARCHER */}
          {activeAgentTab === "researcher" && swarmResult.results?.researcher && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-5">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-base">
                <Search className="w-5 h-5" />
                <span>تقرير Researcher Agent الشامل</span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-300 mb-2">استعلامات البحث المستخدمة:</h4>
                <div className="flex flex-wrap gap-2">
                  {swarmResult.results.researcher.queries?.map((q, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-lg text-xs bg-slate-950 border border-slate-800 text-cyan-300 font-mono">
                      🔍 {q}
                    </span>
                  ))}
                </div>
              </div>

              {swarmResult.results.researcher.search_results && (
                <div>
                  <h4 className="text-xs font-bold text-slate-300 mb-2">المصادر والمعطيات البحثية:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {swarmResult.results.researcher.search_results.map((res, rIdx) => (
                      <div key={rIdx} className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl text-xs space-y-1">
                        <div className="font-semibold text-slate-200">{res.title}</div>
                        <p className="text-slate-400 text-[11px]">{res.snippet}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold text-slate-300 mb-2">التحليل المعرفي المستنتج:</h4>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {swarmResult.results.researcher.analysis}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CODER */}
          {activeAgentTab === "coder" && swarmResult.results?.coder && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
                  <Code2 className="w-5 h-5" />
                  <span>حل المبرمج (Coder Agent Autonomous Output)</span>
                </div>
                <button
                  onClick={() => copyCode(swarmResult.results.coder?.code || "")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? "تم النسخ" : "نسخ الكود"}</span>
                </button>
              </div>

              {/* Code block */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 overflow-x-auto text-xs font-mono text-emerald-300 leading-relaxed" dir="ltr">
                <pre>{swarmResult.results.coder.code}</pre>
              </div>

              {/* Execution stdout */}
              {swarmResult.results.coder.execution_result && (
                <div className="p-4 bg-slate-950/90 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span>مخرجات التنفيذ الذاتي (Sandbox Execution Result):</span>
                  </div>
                  <div className="text-xs font-mono text-slate-300 whitespace-pre-wrap bg-slate-900/80 p-3 rounded-xl border border-slate-800" dir="ltr">
                    {swarmResult.results.coder.execution_result.output}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PLANNER */}
          {activeAgentTab === "planner" && swarmResult.results?.planner && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-5">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-base">
                <Compass className="w-5 h-5" />
                <span>خطة Planner Agent الهرمية</span>
              </div>

              <div className="space-y-3">
                {swarmResult.results.planner.plan?.map((step: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-200">
                    <div className="w-6 h-6 rounded-lg bg-purple-900/80 text-purple-300 font-mono font-bold flex items-center justify-center shrink-0">
                      {step.step || idx + 1}
                    </div>
                    <div className="pt-0.5">{step.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CRITIC */}
          {activeAgentTab === "critic" && swarmResult.results?.critic && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
                  <ShieldAlert className="w-5 h-5" />
                  <span>تقرير الاعتماد والنقد الصارم (Critic Agent)</span>
                </div>
                <div className="text-sm font-bold font-mono px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  التقييم: {swarmResult.results.critic.score} / 10
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl text-xs space-y-2">
                  <h4 className="font-bold text-emerald-300">نقاط القوة المستوفاة:</h4>
                  <ul className="space-y-1 text-slate-300">
                    {swarmResult.results.critic.strengths?.map((s, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-amber-950/20 border border-amber-500/30 rounded-2xl text-xs space-y-2">
                  <h4 className="font-bold text-amber-300">التوصيات والتحسينات المستقبلية:</h4>
                  <ul className="space-y-1 text-slate-300">
                    {swarmResult.results.critic.improvements?.map((imp, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="text-amber-400 font-bold">⚡</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-300 leading-relaxed">
                <strong className="text-slate-100 block mb-1">البيان الختامي للناقد:</strong>
                <p>{swarmResult.results.critic.review}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
