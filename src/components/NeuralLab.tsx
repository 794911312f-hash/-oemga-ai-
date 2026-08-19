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
  CheckCircle2
} from "lucide-react";
import { OptimizerTelemetry, MoEExpertState } from "../types";

export const NeuralLab: React.FC = () => {
  const [telemetry, setTelemetry] = useState<{
    signals: OptimizerTelemetry;
    moe_experts: MoEExpertState[];
    specs: Record<string, any>;
  } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchTelemetry = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/neural/telemetry");
      const data = await res.json();
      setTelemetry(data);
    } catch (e) {
      console.error("Telemetry error", e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                OmegaDeepLLM 90-Layer Core & OmegaV15
              </span>
              <span className="text-xs text-slate-400">• Closed-Loop Feedback Control</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">المختبر العصبي ومحسن OmegaV15</h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              مراقبة حية لإشارات مركز التحكم OmegaControlHub، توازن أحمال الـ 8 خبراء MoE، ومنطقة الثقة Trust Region.
            </p>
          </div>

          <button
            onClick={fetchTelemetry}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-indigo-400" : ""}`} />
            <span>تحديث القياسات الحية</span>
          </button>
        </div>
      </div>

      {telemetry && (
        <>
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
                    <p className="text-[10px] text-slate-400 font-mono">exp(-c * delta^1.5)</p>
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
                تقيس مدى ثقة النموذج في التدرجات الحالية مقارنة بالمعتقد المتراكم لمنع التحديثات المضللة.
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
                    <p className="text-[10px] text-slate-400 font-mono">CUSUM Loss Spike Flag</p>
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
                تنشط فوراً عند حدوث قفزة مفاجئة في الخسارة لإعادة توجيه المسار إلى منطقة الاستقرار.
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
                    <h3 className="text-xs font-bold text-slate-200">مقياس العدوانية (Aggression Factor)</h3>
                    <p className="text-[10px] text-slate-400 font-mono">Closed-Loop Trend Adaptive</p>
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
                يتحكم بديناميكية خطوات التحديث وفقاً لاتجاه تحسن أو تراجع الخسارة في النوافذ الزمنية.
              </p>
            </div>
          </div>

          {/* Loss Trend & Specs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Loss History Chart Simulation */}
            <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white">منحنى تقارب الخسارة المستمر (Loss Trend EMA)</h3>
                </div>
                <span className="text-xs font-mono bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-300">
                  Step #{telemetry.signals.step_count}
                </span>
              </div>

              {/* Sparkline bars */}
              <div className="h-32 flex items-end gap-2 bg-slate-950/80 border border-slate-800/80 p-4 rounded-2xl">
                {telemetry.signals.recent_losses.map((loss, idx) => {
                  const maxLoss = 0.6;
                  const heightPct = Math.min(100, Math.max(15, (loss / maxLoss) * 100));
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                      <div 
                        className="w-full bg-gradient-to-t from-indigo-600 to-purple-400 rounded-t group-hover:from-indigo-400 group-hover:to-cyan-300 transition-all"
                        style={{ height: `${heightPct}%` }}
                      />
                      <span className="text-[9px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-5">
                        {loss.toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                <span>المتوسط المتحرك (Loss EMA): <strong className="text-slate-200 font-mono">{telemetry.signals.loss_ema.toFixed(4)}</strong></span>
                <span>منطقة الثقة (Trust Region): <strong className="text-emerald-300 font-mono">≤ {telemetry.signals.trust_region.toFixed(2)}</strong></span>
                <span>معيار التدرج (Grad Norm): <strong className="text-indigo-300 font-mono">{telemetry.signals.grad_norm.toFixed(4)}</strong></span>
              </div>
            </div>

            {/* Transformer Architecture Specs */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-white">مواصفات OmegaDeepLLM</h3>
              </div>

              <div className="space-y-2 text-xs">
                {Object.entries(telemetry.specs).map(([k, v], idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-slate-950/60 rounded-xl border border-slate-800/60">
                    <span className="text-slate-400 font-mono">{k}</span>
                    <span className="text-indigo-300 font-bold font-mono text-right">{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 8 MoE Experts Load Balancer */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">مصفوفة توزيع أحمال خبراء MoE الثمانية (Mixture of Experts)</h3>
              </div>
              <span className="text-xs text-slate-400">توجيه ديناميكي بالأوزان البوابية</span>
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
                      <span>حمل الخبير</span>
                      <span className="font-mono text-indigo-300">{(expert.load_factor * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-indigo-500 h-full rounded-full"
                        style={{ width: `${expert.load_factor * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
