import React, { useState, useEffect } from "react";
import { 
  Database, 
  Clock, 
  Layers, 
  BookOpen, 
  Share2, 
  Search, 
  Plus, 
  Check, 
  Trash2, 
  RefreshCw,
  Sparkles,
  Zap,
  Tag
} from "lucide-react";

export const MemoryMatrix: React.FC = () => {
  const [activeBank, setActiveBank] = useState<"all" | "short_term" | "long_term" | "episodic" | "semantic" | "vector">("all");
  const [memoryData, setMemoryData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // New Memory Modal / Input state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newType, setNewType] = useState<"fact" | "concept" | "skill" | "vector">("fact");
  const [newKey, setNewKey] = useState("");
  const [newContent, setNewContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const fetchMemory = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/memory");
      const data = await res.json();
      setMemoryData(data);
    } catch (e) {
      console.error("Memory fetch error", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMemory();
  }, []);

  const handleAddMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim() || isSaving) return;
    setIsSaving(true);
    try {
      await fetch("/api/memory/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: newType,
          key: newKey || `entry_${Date.now()}`,
          data: newContent,
        }),
      });
      setShowAddModal(false);
      setNewKey("");
      setNewContent("");
      await fetchMemory();
    } catch (e) {
      console.error("Error adding memory", e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                5-Tier Cognitive Memory Engine
              </span>
              <span className="text-xs text-slate-400">• Persistent & Vector Grounded</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">مصفوفة الذاكرة الشاملة (Memory Matrix)</h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              تخزين واسترجاع ديناميكي عبر 5 بنوك ذاكرة: قصيرة المدى (FIFO)، طويلة المدى، عرضية زمنية (Episodic)، دلالية معرفية (Semantic)، ومتجهية (Vector).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة معرفة / حقيقة جديدة</span>
            </button>
            <button
              onClick={fetchMemory}
              className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
              title="تحديث بنوك الذاكرة"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-indigo-400" : ""}`} />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        {memoryData?.stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-slate-800">
            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800/80 text-center">
              <span className="text-[10px] text-slate-400 block">قصيرة المدى</span>
              <span className="text-lg font-bold text-indigo-400 font-mono">{memoryData.stats.short_term_count}</span>
            </div>
            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800/80 text-center">
              <span className="text-[10px] text-slate-400 block">حقائق راسخة</span>
              <span className="text-lg font-bold text-cyan-400 font-mono">{memoryData.stats.facts_count}</span>
            </div>
            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800/80 text-center">
              <span className="text-[10px] text-slate-400 block">مهارات متقنة</span>
              <span className="text-lg font-bold text-emerald-400 font-mono">{memoryData.stats.skills_count}</span>
            </div>
            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800/80 text-center">
              <span className="text-[10px] text-slate-400 block">حلقات عرضية</span>
              <span className="text-lg font-bold text-purple-400 font-mono">{memoryData.stats.episodic_count}</span>
            </div>
            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800/80 text-center">
              <span className="text-[10px] text-slate-400 block">مفاهيم دلالية</span>
              <span className="text-lg font-bold text-amber-400 font-mono">{memoryData.stats.concepts_count}</span>
            </div>
            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800/80 text-center">
              <span className="text-[10px] text-slate-400 block">متجهات دلالية</span>
              <span className="text-lg font-bold text-pink-400 font-mono">{memoryData.stats.vector_items_count}</span>
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto p-1 bg-slate-900 border border-slate-800 rounded-2xl">
          <button
            onClick={() => setActiveBank("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeBank === "all" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            الكل
          </button>
          <button
            onClick={() => setActiveBank("short_term")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeBank === "short_term" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            قصيرة المدى
          </button>
          <button
            onClick={() => setActiveBank("long_term")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeBank === "long_term" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            طويلة المدى
          </button>
          <button
            onClick={() => setActiveBank("episodic")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeBank === "episodic" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            العرضية (Episodic)
          </button>
          <button
            onClick={() => setActiveBank("semantic")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeBank === "semantic" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            الدلالية (Semantic)
          </button>
          <button
            onClick={() => setActiveBank("vector")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeBank === "vector" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            المتجهية (Vector)
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث دلالي في الذاكرة..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pr-9 pl-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Memory Content Display */}
      {memoryData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 1. Long Term Facts */}
          {(activeBank === "all" || activeBank === "long_term") &&
            Object.entries(memoryData.long_term.facts || {}).map(([k, v]: any, idx) => (
              <div key={`fact-${idx}`} className="p-5 bg-slate-900/80 border border-cyan-500/20 rounded-3xl space-y-2.5 shadow-lg hover:border-cyan-500/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>حقيقة طويلة المدى: {k}</span>
                  </span>
                  <span className="text-[10px] font-mono bg-cyan-950/60 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">
                    {v.category || "General"}
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">{v.fact || JSON.stringify(v)}</p>
              </div>
            ))}

          {/* 2. Semantic Concepts */}
          {(activeBank === "all" || activeBank === "semantic") &&
            Object.entries(memoryData.semantic.concepts || {}).map(([k, v]: any, idx) => (
              <div key={`concept-${idx}`} className="p-5 bg-slate-900/80 border border-amber-500/20 rounded-3xl space-y-2.5 shadow-lg hover:border-amber-500/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    <span>مفهوم دلالي: {k}</span>
                  </span>
                  <span className="text-[10px] font-mono bg-amber-950/60 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                    Concept
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">{v.definition || JSON.stringify(v)}</p>
              </div>
            ))}

          {/* 3. Episodic Memories */}
          {(activeBank === "all" || activeBank === "episodic") &&
            memoryData.episodic?.map((ep: any, idx: number) => (
              <div key={`ep-${idx}`} className="p-5 bg-slate-900/80 border border-purple-500/20 rounded-3xl space-y-2.5 shadow-lg hover:border-purple-500/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>حلقة عرضية #{ep.id}</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {new Date(ep.timestamp).toLocaleTimeString("ar-EG")}
                  </span>
                </div>
                <div className="text-xs text-slate-300 space-y-1">
                  <div className="font-semibold text-slate-200">المدخل: "{ep.input}"</div>
                  <div className="text-slate-400 text-[11px] line-clamp-2">الاستجابة: {ep.response}</div>
                </div>
              </div>
            ))}

          {/* 4. Short Term Interaction Buffer */}
          {(activeBank === "all" || activeBank === "short_term") &&
            memoryData.short_term?.map((st: any, idx: number) => (
              <div key={`st-${idx}`} className="p-5 bg-slate-900/80 border border-indigo-500/20 rounded-3xl space-y-2.5 shadow-lg hover:border-indigo-500/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>ذاكرة تفاعل مؤقتة</span>
                  </span>
                  <span className="text-[10px] font-mono bg-indigo-950/60 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
                    {st.category}
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {typeof st.content === "string" ? st.content : JSON.stringify(st.content)}
                </p>
              </div>
            ))}

          {/* 5. Vector Memory Items */}
          {(activeBank === "all" || activeBank === "vector") &&
            memoryData.vector?.map((vec: any, idx: number) => (
              <div key={`vec-${idx}`} className="p-5 bg-slate-900/80 border border-pink-500/20 rounded-3xl space-y-2.5 shadow-lg hover:border-pink-500/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-pink-400 flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5" />
                    <span>تضمين متجهي: {vec.id}</span>
                  </span>
                  <span className="text-[10px] font-mono bg-pink-950/60 text-pink-300 px-2 py-0.5 rounded border border-pink-500/30">
                    64-dim embedding
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">{vec.text}</p>
              </div>
            ))}
        </div>
      )}

      {/* Add Memory Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">إضافة عنصر جديد إلى ذاكرة أوميجا</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white text-xs">
                ✕ إغلاق
              </button>
            </div>

            <form onSubmit={handleAddMemory} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">نوع بنك الذاكرة:</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: "fact", label: "حقيقة" },
                    { id: "concept", label: "مفهوم دلالي" },
                    { id: "skill", label: "مهارة" },
                    { id: "vector", label: "متجه نصي" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setNewType(t.id as any)}
                      className={`py-2 rounded-xl border text-center font-semibold transition-all ${
                        newType === t.id
                          ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {newType !== "vector" && (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">المفتاح / العنوان (Key):</label>
                  <input
                    type="text"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    placeholder="مثال: neural_optimizer_rules"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-semibold mb-1">المحتوى المعرفي (Data):</label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={3}
                  placeholder="اكتب الحقيقة أو المفهوم أو المعرفة التي تريد غرسها في دماغ أوميجا..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={!newContent.trim() || isSaving}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors"
                >
                  {isSaving ? "جاري الحفظ..." : "حفظ في الذاكرة"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
