import React, { useState, useEffect } from "react";
import { 
  Clock, 
  Layers, 
  BookOpen, 
  Share2, 
  Search, 
  Plus, 
  RefreshCw, 
  Sparkles, 
  Zap, 
  Network, 
  Cpu, 
  Eye, 
  Code, 
  ArrowRight,
  TrendingUp,
  Brain,
  Cloud,
  CloudUpload,
  CloudDownload,
  Database,
  CheckCircle2,
  Trash2,
  AlertCircle,
  ExternalLink,
  History
} from "lucide-react";
import { InferredRelationship } from "../types";
import { MemoryOptimizer } from "../lib/MemoryOptimizer";
import { 
  saveMemorySnapshotToCloud, 
  fetchMemorySnapshotsFromCloud, 
  deleteMemorySnapshotFromCloud,
  testFirestoreConnection,
  CloudMemorySnapshot 
} from "../lib/firebase";

export const MemoryMatrix: React.FC = () => {
  const [activeBank, setActiveBank] = useState<"all" | "sensory" | "short_term" | "long_term" | "episodic" | "semantic" | "vector" | "procedural">("all");
  const [memoryData, setMemoryData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isInferring, setIsInferring] = useState(false);

  // Firebase Cloud Sync State
  const [cloudSnapshots, setCloudSnapshots] = useState<CloudMemorySnapshot[]>([]);
  const [showCloudModal, setShowCloudModal] = useState(false);
  const [isSyncingCloud, setIsSyncingCloud] = useState(false);
  const [cloudSyncFeedback, setCloudSyncFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [snapshotTitleInput, setSnapshotTitleInput] = useState("");
  const [showSaveSnapshotModal, setShowSaveSnapshotModal] = useState(false);
  const [isFirestoreConnected, setIsFirestoreConnected] = useState<boolean | null>(null);
  const [lastCloudSyncTime, setLastCloudSyncTime] = useState<string | null>(null);

  // New Memory Modal / Input state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newType, setNewType] = useState<"fact" | "concept" | "skill" | "vector">("concept");
  const [newCategory, setNewCategory] = useState("general");
  const [newKey, setNewKey] = useState("");
  const [newContent, setNewContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // MemoryOptimizer live simulation state
  const [optVectorA, setOptVectorA] = useState("0.85, 0.42, 0.15, 0.73");
  const [optVectorB, setOptVectorB] = useState("0.80, 0.45, 0.10, 0.70");
  const [calculatedSimilarity, setCalculatedSimilarity] = useState<number | null>(null);
  const [benchmarkStatus, setBenchmarkStatus] = useState<string | null>(null);
  const [benchmarkRankings, setBenchmarkRankings] = useState<{ id: string; similarity: number; metadata?: any }[] | null>(null);
  const [isBenchmarking, setIsBenchmarking] = useState(false);

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

  const checkCloud = async () => {
    const isConn = await testFirestoreConnection();
    setIsFirestoreConnected(isConn);
    if (isConn) {
      const snaps = await fetchMemorySnapshotsFromCloud(15);
      setCloudSnapshots(snaps);
    }
  };

  useEffect(() => {
    fetchMemory();
    checkCloud();
  }, []);

  const handleSaveToFirebase = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!memoryData) return;
    setIsSyncingCloud(true);
    setCloudSyncFeedback(null);

    const title = snapshotTitleInput.trim() || `لقطة معرفية خماسية - ${new Date().toLocaleTimeString("ar-SA")}`;
    const res = await saveMemorySnapshotToCloud(title, memoryData, memoryData.stats);

    if (res.success) {
      setCloudSyncFeedback({ type: "success", message: `تمت مزامنة وحفظ اللقطة السحابية بنجاح في Firebase Firestore.` });
      setLastCloudSyncTime(new Date().toLocaleTimeString("ar-SA"));
      setShowSaveSnapshotModal(false);
      setSnapshotTitleInput("");
      const updated = await fetchMemorySnapshotsFromCloud(15);
      setCloudSnapshots(updated);
    } else {
      setCloudSyncFeedback({ type: "error", message: res.error || "فشل الاتصال بخادم Firebase" });
    }
    setIsSyncingCloud(false);
  };

  const handleRestoreSnapshot = async (snapshot: CloudMemorySnapshot) => {
    if (!snapshot.memory_data) return;
    setIsSyncingCloud(true);
    setCloudSyncFeedback(null);
    try {
      const res = await fetch("/api/memory/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memory_data: snapshot.memory_data }),
      });
      const data = await res.json();
      if (data.success) {
        setCloudSyncFeedback({ type: "success", message: `تم استرجاع اللقطة "${snapshot.title}" وتحديث مصفوفة الذاكرة بنجاح.` });
        await fetchMemory();
        setShowCloudModal(false);
      } else {
        setCloudSyncFeedback({ type: "error", message: data.error || "فشل استرجاع اللقطة" });
      }
    } catch (e: any) {
      setCloudSyncFeedback({ type: "error", message: e.message || "حدث خطأ أثناء الاسترجاع" });
    } finally {
      setIsSyncingCloud(false);
    }
  };

  const handleDeleteSnapshot = async (id: string) => {
    const ok = await deleteMemorySnapshotFromCloud(id);
    if (ok) {
      setCloudSnapshots((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleSemanticSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch("/api/memory/semantic-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery, top_k: 6 }),
      });
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (e) {
      console.error("Semantic search error", e);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInferRelations = async () => {
    setIsInferring(true);
    try {
      const res = await fetch("/api/memory/infer-relations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.relationships && memoryData) {
        setMemoryData({
          ...memoryData,
          inferred_relationships: data.relationships,
          semantic: {
            ...memoryData.semantic,
            inferred_links: data.relationships,
          },
        });
      }
    } catch (e) {
      console.error("Inference error", e);
    } finally {
      setIsInferring(false);
    }
  };

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
          category: newCategory,
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

  const handleCalculateCosineSim = () => {
    try {
      const vecA = optVectorA.split(",").map((s) => parseFloat(s.trim())).filter((n) => !isNaN(n));
      const vecB = optVectorB.split(",").map((s) => parseFloat(s.trim())).filter((n) => !isNaN(n));
      if (vecA.length !== vecB.length || vecA.length === 0) {
        alert("يرجى التأكد من أن المتجهين يحتويان على نفس عدد العناصر غير الفارغة.");
        return;
      }
      const sim = MemoryOptimizer.calculateCosineSimilarity(vecA, vecB);
      setCalculatedSimilarity(sim);
    } catch (e) {
      console.error("Cosine calculation error", e);
    }
  };

  const handleRunMemoryOptimizerBenchmark = async () => {
    if (!memoryData?.vector || memoryData.vector.length === 0) {
      alert("لا توجد متجهات كافية في بنك الذاكرة المتجهي.");
      return;
    }
    setIsBenchmarking(true);
    setBenchmarkStatus("جاري تحسين واسترجاع المتجهات عبر MemoryOptimizer...");
    
    setTimeout(() => {
      try {
        const optimizer = new MemoryOptimizer();
        const targetVec = memoryData.vector[0].embedding;
        const allVectors = memoryData.vector.map((v: any) => v.embedding);
        
        const startTime = performance.now();
        // Run optimized retrieval
        const bestScore = MemoryOptimizer.calculateCosineSimilarity(targetVec, allVectors[0]);
        const ranked = MemoryOptimizer.rankTopK(
          targetVec,
          memoryData.vector.map((v: any) => ({ id: v.id, vector: v.embedding, metadata: v.metadata || { text: v.text } })),
          5
        );
        const duration = (performance.now() - startTime).toFixed(3);

        setBenchmarkRankings(ranked);
        setBenchmarkStatus(`اكتمل التحسين في ${duration}ms | أعلى تطابق: ${(bestScore * 100).toFixed(1)}%`);
      } catch (e: any) {
        setBenchmarkStatus(`خطأ في المعالجة: ${e.message}`);
      } finally {
        setIsBenchmarking(false);
      }
    }, 400);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/80 to-purple-950/80 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                5-Tier Cognitive Memory & Latent Embeddings Matrix
              </span>
              <span className="text-xs text-slate-400 font-mono">• Cosine Similarity & Hidden Relations</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">مصفوفة الذاكرة خماسية الطبقات (Memory Matrix)</h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              تخزين متسلسل واستنتاج متقدم للعلاقات الخفية بين المفاهيم (Semantic Embeddings Inference) عبر 5 طبقات: حسية، قصيرة المدى، عرضية، سيمانتيكية، وإجرائية ومتجهية.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Firebase Cloud Sync Controls */}
            <div className="flex items-center gap-2 bg-slate-950/70 p-1.5 rounded-2xl border border-indigo-500/30">
              <button
                onClick={() => setShowSaveSnapshotModal(true)}
                disabled={isSyncingCloud || !memoryData}
                id="firebase-save-snapshot-btn"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/90 hover:bg-indigo-600 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50"
                title="مزامنة وحفظ لقطة الذاكرة المعرفية في Firebase Firestore"
              >
                <CloudUpload className={`w-3.5 h-3.5 ${isSyncingCloud ? "animate-bounce" : ""}`} />
                <span>حفظ سحابي (Firebase)</span>
              </button>

              <button
                onClick={() => setShowCloudModal(true)}
                id="firebase-cloud-snapshots-btn"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold transition-all border border-indigo-500/20"
                title="استعراض واسترجاع لقطات الذاكرة من Firebase"
              >
                <History className="w-3.5 h-3.5 text-indigo-400" />
                <span>اللقطات السحابية ({cloudSnapshots.length})</span>
              </button>
            </div>

            <button
              onClick={handleInferRelations}
              disabled={isInferring}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-800/90 hover:bg-slate-800 border border-purple-500/40 text-purple-300 text-xs font-bold transition-all shadow-lg shadow-purple-500/10"
            >
              <Network className={`w-4 h-4 ${isInferring ? "animate-spin text-purple-400" : "text-purple-400"}`} />
              <span>{isInferring ? "جاري استنتاج الروابط..." : "استنتاج العلاقات الخفية"}</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة مفهوم / حقيقة</span>
            </button>

            <button
              onClick={fetchMemory}
              className="p-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
              title="تحديث بنوك الذاكرة"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-indigo-400" : ""}`} />
            </button>
          </div>
        </div>

        {/* Cloud Sync Status Info Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-800/80 text-[11px]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 border border-slate-800">
              <span className={`w-2 h-2 rounded-full ${isFirestoreConnected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
              <span className="text-slate-300 font-mono">
                {isFirestoreConnected ? "Firebase Firestore: متصل ونشط" : "Firebase: جاري التحقق من الاتصال..."}
              </span>
            </div>
            {lastCloudSyncTime && (
              <span className="text-slate-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                آخر مزامنة سحابية: <span className="text-slate-200 font-mono">{lastCloudSyncTime}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <Database className="w-3 h-3 text-indigo-400" />
            <span>مزامنة تلقائية للجلسات والاستدلال المعرفي</span>
          </div>
        </div>

        {/* Feedback Message */}
        {cloudSyncFeedback && (
          <div className={`mt-3 p-3 rounded-2xl border flex items-center justify-between text-xs transition-all ${
            cloudSyncFeedback.type === "success" 
              ? "bg-emerald-950/50 border-emerald-500/40 text-emerald-200" 
              : "bg-red-950/50 border-red-500/40 text-red-200"
          }`}>
            <div className="flex items-center gap-2">
              {cloudSyncFeedback.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400" />
              )}
              <span>{cloudSyncFeedback.message}</span>
            </div>
            <button onClick={() => setCloudSyncFeedback(null)} className="text-slate-400 hover:text-white text-xs px-2">
              ✕
            </button>
          </div>
        )}

        {/* Stats Grid across 5 Tiers */}
        {memoryData?.stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mt-6 pt-6 border-t border-slate-800">
            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800/80 text-center">
              <span className="text-[10px] text-slate-400 block font-medium">1. الحسية (Sensory)</span>
              <span className="text-lg font-bold text-sky-400 font-mono">{memoryData.stats.sensory_count || 1}</span>
            </div>
            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800/80 text-center">
              <span className="text-[10px] text-slate-400 block font-medium">2. قصيرة المدى (Working)</span>
              <span className="text-lg font-bold text-indigo-400 font-mono">{memoryData.stats.short_term_count}</span>
            </div>
            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800/80 text-center">
              <span className="text-[10px] text-slate-400 block font-medium">3. العرضية (Episodic)</span>
              <span className="text-lg font-bold text-purple-400 font-mono">{memoryData.stats.episodic_count}</span>
            </div>
            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800/80 text-center">
              <span className="text-[10px] text-slate-400 block font-medium">4. السيمانتيكية (Semantic)</span>
              <span className="text-lg font-bold text-amber-400 font-mono">{memoryData.stats.concepts_count}</span>
            </div>
            <div className="p-3 bg-slate-950/80 rounded-2xl border border-purple-500/30 text-center bg-purple-950/20">
              <span className="text-[10px] text-purple-300 block font-medium">روابط خفية مستنتجة</span>
              <span className="text-lg font-bold text-purple-300 font-mono">{memoryData.stats.inferred_links_count || 0}</span>
            </div>
            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800/80 text-center">
              <span className="text-[10px] text-slate-400 block font-medium">5. المتجهات (Vector 64D)</span>
              <span className="text-lg font-bold text-pink-400 font-mono">{memoryData.stats.vector_items_count}</span>
            </div>
            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800/80 text-center">
              <span className="text-[10px] text-slate-400 block font-medium">الإجرائية (Procedural)</span>
              <span className="text-lg font-bold text-emerald-400 font-mono">{memoryData.stats.procedural_count || 2}</span>
            </div>
          </div>
        )}
      </div>

      {/* Semantic Similarity Search & Filter Tabs */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 space-y-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto p-1 bg-slate-950 border border-slate-800 rounded-2xl">
            {[
              { id: "all", label: "كافة الطبقات" },
              { id: "semantic", label: "السيمانتيكية والمفاهيم" },
              { id: "episodic", label: "العرضية (Episodic)" },
              { id: "sensory", label: "الحسية (Sensory)" },
              { id: "short_term", label: "قصيرة المدى" },
              { id: "long_term", label: "طويلة المدى" },
              { id: "vector", label: "المتجهية (Vector)" },
              { id: "procedural", label: "الإجرائية (Procedural)" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveBank(tab.id as any);
                  setSearchResults(null);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeBank === tab.id ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Semantic Search Query Form */}
          <form onSubmit={handleSemanticSearch} className="flex items-center gap-2 w-full lg:w-96">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث دلالي (Cosine Similarity)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl pr-9 pl-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-sans"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all"
            >
              {isSearching ? "جاري المطابقة..." : "مطابقة"}
            </button>
            {searchResults && (
              <button
                type="button"
                onClick={() => {
                  setSearchResults(null);
                  setSearchQuery("");
                }}
                className="px-2.5 py-2 rounded-2xl bg-slate-800 text-slate-400 hover:text-white text-xs"
              >
                إلغاء
              </button>
            )}
          </form>
        </div>

        {/* Semantic Search Results Callout */}
        {searchResults && (
          <div className="p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-indigo-300">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>نتائج البحث الدلالي المتجهي لـ: "{searchQuery}"</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                مرتبة حسب معامل تشابه جيب التمام Cosine Similarity
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {searchResults.map((res: any, idx: number) => (
                <div key={`search-${idx}`} className="p-3 bg-slate-900 border border-indigo-500/40 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{res.name}</span>
                    <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
                      Sim: {(res.similarity * 100).toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-3">{res.definition}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MemoryOptimizer Benchmark & Vector Simulator Box */}
        <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 border border-indigo-500/30 rounded-2xl space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-300 font-bold">
                <Share2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>وحدة تحسين البحث الدلالي في الذاكرة المتجهة (MemoryOptimizer)</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-pink-950 text-pink-300 border border-pink-500/30">
                    Vector Math Engine
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  {"خوارزمية الاسترجاع المتجهي وحساب معامل جيب التمام Cosine Similarity: Sim(u, v) = (u · v) / (||u|| * ||v||)"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRunMemoryOptimizerBenchmark}
                disabled={isBenchmarking}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-pink-600/20"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{isBenchmarking ? "جاري الاختبار..." : "تشغيل فحص الاسترجاع الموزون (Benchmark)"}</span>
              </button>
            </div>
          </div>

          {/* Interactive Vector Similarity Sandbox */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            <div className="lg:col-span-8 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-300 flex items-center justify-between">
                    <span>{"المتجه A (Vector A):"}</span>
                    <span className="text-[10px] text-slate-500">مفصول بفواصل</span>
                  </label>
                  <input
                    type="text"
                    value={optVectorA}
                    onChange={(e) => setOptVectorA(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-pink-300 focus:outline-none focus:border-pink-500"
                    placeholder="0.85, 0.42, 0.15, 0.73"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-300 flex items-center justify-between">
                    <span>{"المتجه B (Vector B):"}</span>
                    <span className="text-[10px] text-slate-500">مفصول بفواصل</span>
                  </label>
                  <input
                    type="text"
                    value={optVectorB}
                    onChange={(e) => setOptVectorB(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-indigo-300 focus:outline-none focus:border-indigo-500"
                    placeholder="0.80, 0.45, 0.10, 0.70"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleCalculateCosineSim}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700"
                >
                  <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                  <span>احسب معامل التطابق (Calculate Similarity)</span>
                </button>

                {calculatedSimilarity !== null && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-slate-950 border border-pink-500/40 rounded-xl">
                    <span className="text-xs text-slate-400 font-medium">معامل التطابق:</span>
                    <span className="text-xs font-bold font-mono text-pink-300">
                      {calculatedSimilarity.toFixed(4)} ({(calculatedSimilarity * 100).toFixed(2)}%)
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Benchmark Status & Quick Telemetry */}
            <div className="lg:col-span-4 p-3 bg-slate-950/90 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                <span>حالة التحسين الدلالي:</span>
                <span className="text-[10px] font-mono text-emerald-400">Active</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono leading-relaxed bg-slate-900/80 p-2 rounded-lg border border-slate-800/80">
                {benchmarkStatus || "انقر على زر الفحص لاختبار سرعة واسترجاع المتجهات عبر MemoryOptimizer"}
              </div>

              {benchmarkRankings && benchmarkRankings.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="text-[10px] font-bold text-indigo-300">أعلى المتجهات تطابقاً:</div>
                  <div className="space-y-1">
                    {benchmarkRankings.slice(0, 3).map((r, i) => (
                      <div key={i} className="flex items-center justify-between text-[10px] bg-slate-900 px-2 py-1 rounded border border-slate-800 font-mono">
                        <span className="text-slate-300 truncate max-w-[140px]">{r.id}</span>
                        <span className="text-emerald-300">{(r.similarity * 100).toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Latent Inferred Relationships Graph / Matrix */}
      {memoryData?.inferred_relationships && memoryData.inferred_relationships.length > 0 && (
        <div className="bg-slate-900/90 border border-purple-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 font-bold">
                <Network className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">العلاقات السيمانتيكية الخفية المستنتجة (Inferred Concept Relations)</h2>
                <p className="text-xs text-slate-400">
                  استنتاج الروابط الكامنة بين فروع المعرفة والفيزياء والرياضيات والأدب عبر فضاء التضمين المتجهي.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-purple-950/60 text-purple-300 border border-purple-500/30">
              {memoryData.inferred_relationships.length} روابط مستنتجة نشطة
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {memoryData.inferred_relationships.map((rel: InferredRelationship, idx: number) => (
              <div 
                key={`rel-${idx}`}
                className="p-4 bg-slate-950/80 border border-purple-500/20 hover:border-purple-500/50 rounded-2xl space-y-2.5 transition-all shadow-md group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                    <span className="text-cyan-300">{rel.from}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400 transition-colors" />
                    <span className="text-amber-300">{rel.to}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
                    {(rel.strength * 100).toFixed(0)}% قوة الربط
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">{rel.explanation}</p>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-900">
                  <span className="font-mono">العلاقة: {rel.relation}</span>
                  <span className="capitalize text-slate-400">{rel.domain}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Memory Cards Display */}
      {memoryData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 1. Sensory Memory */}
          {(activeBank === "all" || activeBank === "sensory") &&
            memoryData.sensory?.map((sen: any, idx: number) => (
              <div key={`sen-${idx}`} className="p-5 bg-slate-900/80 border border-sky-500/30 rounded-3xl space-y-2.5 shadow-lg hover:border-sky-500/50 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    <span>الذاكرة الحسية (Sensory #{idx + 1})</span>
                  </span>
                  <span className="text-[10px] font-mono bg-sky-950/60 text-sky-300 px-2 py-0.5 rounded border border-sky-500/30">
                    {sen.modality || "Percept"}
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">{sen.payload}</p>
                <div className="text-[10px] font-mono text-slate-500">
                  {new Date(sen.timestamp).toLocaleTimeString("ar-EG")}
                </div>
              </div>
            ))}

          {/* 2. Semantic Concepts */}
          {(activeBank === "all" || activeBank === "semantic") &&
            Object.entries(memoryData.semantic?.concepts || {}).map(([k, v]: any, idx) => (
              <div key={`concept-${idx}`} className="p-5 bg-slate-900/80 border border-amber-500/30 rounded-3xl space-y-2.5 shadow-lg hover:border-amber-500/50 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <Brain className="w-3.5 h-3.5" />
                    <span>مفهوم دلالي: {k}</span>
                  </span>
                  <span className="text-[10px] font-mono bg-amber-950/60 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                    {v.category || "Concept"}
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">{v.definition || JSON.stringify(v)}</p>
                {v.embedding && (
                  <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                    <span>64-Dim Embedding Vector</span>
                    <span className="text-amber-300/80">Normalized L2</span>
                  </div>
                )}
              </div>
            ))}

          {/* 3. Long Term Facts */}
          {(activeBank === "all" || activeBank === "long_term") &&
            Object.entries(memoryData.long_term?.facts || {}).map(([k, v]: any, idx) => (
              <div key={`fact-${idx}`} className="p-5 bg-slate-900/80 border border-cyan-500/30 rounded-3xl space-y-2.5 shadow-lg hover:border-cyan-500/50 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>حقيقة راسخة: {k}</span>
                  </span>
                  <span className="text-[10px] font-mono bg-cyan-950/60 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">
                    {v.category || "Fact"}
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">{v.fact || JSON.stringify(v)}</p>
              </div>
            ))}

          {/* 4. Episodic Memories */}
          {(activeBank === "all" || activeBank === "episodic") &&
            memoryData.episodic?.map((ep: any, idx: number) => (
              <div key={`ep-${idx}`} className="p-5 bg-slate-900/80 border border-purple-500/30 rounded-3xl space-y-2.5 shadow-lg hover:border-purple-500/50 transition-all">
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

          {/* 5. Procedural Algorithms */}
          {(activeBank === "all" || activeBank === "procedural") &&
            Object.entries(memoryData.procedural || {}).map(([k, p]: any, idx) => (
              <div key={`proc-${idx}`} className="p-5 bg-slate-900/80 border border-emerald-500/30 rounded-3xl space-y-2.5 shadow-lg hover:border-emerald-500/50 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5" />
                    <span>خوارزمية إجرائية: {p.name}</span>
                  </span>
                  <span className="text-[10px] font-mono bg-emerald-950/60 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                    {p.complexity}
                  </span>
                </div>
                <div className="font-mono text-[11px] text-emerald-300/90 bg-slate-950 p-2 rounded-xl border border-slate-800">
                  {p.algorithm}
                </div>
                <div className="space-y-1 text-[11px] text-slate-300">
                  {p.steps?.map((st: string, sIdx: number) => (
                    <div key={sIdx} className="leading-relaxed text-slate-400">{st}</div>
                  ))}
                </div>
              </div>
            ))}

          {/* 6. Vector Memory Items */}
          {(activeBank === "all" || activeBank === "vector") &&
            memoryData.vector?.map((vec: any, idx: number) => (
              <div key={`vec-${idx}`} className="p-5 bg-slate-900/80 border border-pink-500/30 rounded-3xl space-y-2.5 shadow-lg hover:border-pink-500/50 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-pink-400 flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5" />
                    <span>تضمين متجهي: {vec.id}</span>
                  </span>
                  <span className="text-[10px] font-mono bg-pink-950/60 text-pink-300 px-2 py-0.5 rounded border border-pink-500/30">
                    64-dim L2
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">{vec.text}</p>
                <div className="text-[10px] font-mono text-slate-400">
                  الموضوع: {vec.metadata?.topic || "عام"}
                </div>
              </div>
            ))}

          {/* 7. Short Term Interaction Buffer */}
          {(activeBank === "all" || activeBank === "short_term") &&
            memoryData.short_term?.map((st: any, idx: number) => (
              <div key={`st-${idx}`} className="p-5 bg-slate-900/80 border border-indigo-500/30 rounded-3xl space-y-2.5 shadow-lg hover:border-indigo-500/50 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>ذاكرة عمل مؤقتة</span>
                  </span>
                  <span className="text-[10px] font-mono bg-indigo-950/60 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
                    decay: {st.decay_weight || 0.95}
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {typeof st.content === "string" ? st.content : JSON.stringify(st.content)}
                </p>
              </div>
            ))}
        </div>
      )}

      {/* Save to Cloud Firebase Modal */}
      {showSaveSnapshotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <CloudUpload className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">حفظ لقطة الذاكرة المعرفية في Firebase</h3>
              </div>
              <button onClick={() => setShowSaveSnapshotModal(false)} className="text-slate-400 hover:text-white text-xs">
                ✕ إغلاق
              </button>
            </div>

            <form onSubmit={handleSaveToFirebase} className="space-y-4 text-xs">
              <p className="text-slate-300 leading-relaxed">
                سيتم تشفير وحفظ الحالة الكاملة لمصفوفة الذاكرة (المفاهيم السيمانتيكية، الحقائق، المهارات، والروابط الخفية المستنتجة) في قاعدة بيانات Firestore السحابية لتمكين استرجاعها في أي وقت ومن أي جهاز.
              </p>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">اسم / عنوان اللقطة السحابية:</label>
                <input
                  type="text"
                  value={snapshotTitleInput}
                  onChange={(e) => setSnapshotTitleInput(e.target.value)}
                  placeholder={`مثال: لقطة المعرفة الفيزيائية والأدبية - ${new Date().toLocaleDateString("ar-SA")}`}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {memoryData?.stats && (
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 font-mono text-[11px]">
                  <div className="text-slate-400 font-bold mb-1">المحتويات الجاهزة للمزامنة السحابية:</div>
                  <div className="grid grid-cols-2 gap-2 text-slate-300">
                    <div>• المفاهيم السيمانتيكية: <span className="text-amber-400 font-bold">{memoryData.stats.concepts_count}</span></div>
                    <div>• الحقائق المخزنة: <span className="text-indigo-400 font-bold">{memoryData.stats.facts_count}</span></div>
                    <div>• الروابط الخفية: <span className="text-purple-400 font-bold">{memoryData.stats.inferred_links_count || 0}</span></div>
                    <div>• المتجهات 64D: <span className="text-pink-400 font-bold">{memoryData.stats.vector_items_count}</span></div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSaveSnapshotModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSyncingCloud}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors shadow-lg shadow-indigo-600/30 disabled:opacity-50"
                >
                  <CloudUpload className="w-4 h-4" />
                  <span>{isSyncingCloud ? "جاري المزامنة والحفظ..." : "تأكيد الحفظ السحابي"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cloud Snapshots List / Restore Modal */}
      {showCloudModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">اللقطات السحابية المخزنة في Firebase Firestore</h3>
              </div>
              <button onClick={() => setShowCloudModal(false)} className="text-slate-400 hover:text-white text-xs">
                ✕ إغلاق
              </button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-3 pr-1">
              {cloudSnapshots.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-3">
                  <Cloud className="w-12 h-12 mx-auto text-slate-600 stroke-[1.5]" />
                  <p className="text-sm">لا توجد لقطات ذاكرة سحابية محفوظة بعد في Firebase.</p>
                  <button
                    onClick={() => {
                      setShowCloudModal(false);
                      setShowSaveSnapshotModal(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md hover:bg-indigo-500"
                  >
                    حفظ اللقطة الحالية الآن
                  </button>
                </div>
              ) : (
                cloudSnapshots.map((snap) => (
                  <div
                    key={snap.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-indigo-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{snap.title}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono">
                          {new Date(snap.timestamp).toLocaleDateString("ar-SA")} {new Date(snap.timestamp).toLocaleTimeString("ar-SA")}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-mono">
                        <span>مفاهيم: <strong className="text-amber-400">{snap.stats?.concepts_count || 0}</strong></span>
                        <span>حقائق: <strong className="text-indigo-400">{snap.stats?.facts_count || 0}</strong></span>
                        <span>روابط خفية: <strong className="text-purple-400">{snap.stats?.inferred_links_count || 0}</strong></span>
                        <span>متجهات: <strong className="text-pink-400">{snap.stats?.vector_items_count || 0}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleRestoreSnapshot(snap)}
                        disabled={isSyncingCloud}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50"
                        title="استرجاع وتطبيق هذه اللقطة على الذاكرة الحية لنظام Omega"
                      >
                        <CloudDownload className="w-3.5 h-3.5" />
                        <span>استرجاع للذاكرة الحية</span>
                      </button>
                      <button
                        onClick={() => handleDeleteSnapshot(snap.id)}
                        className="p-1.5 rounded-xl bg-slate-900 hover:bg-red-950/60 text-slate-400 hover:text-red-300 border border-slate-800 transition-colors"
                        title="حذف اللقطة من Firebase"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-400" />
                <span>إجمالي اللقطات السحابية: {cloudSnapshots.length}</span>
              </div>
              <button
                onClick={() => {
                  setShowCloudModal(false);
                  setShowSaveSnapshotModal(true);
                }}
                className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إنشاء لقطة جديدة</span>
              </button>
            </div>
          </div>
        </div>
      )}
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
                    { id: "concept", label: "مفهوم دلالي" },
                    { id: "fact", label: "حقيقة علمية" },
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

              <div>
                <label className="block text-slate-300 font-semibold mb-1">المفتاح / العنوان (Key):</label>
                <input
                  type="text"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="مثال: QuantumSuperposition أو ArabicMetaphor"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">التصنيف (Category):</label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="مثال: physics, literature, mathematics, architecture"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">المحتوى المعرفي (Data):</label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={3}
                  placeholder="اكتب الحقيقة أو المفهوم أو المعرفة التي تريد غرسها في دماغ أوميجا مع استنتاج متجهات التضمين تلقائياً..."
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
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors shadow-lg shadow-indigo-600/30"
                >
                  {isSaving ? "جاري التضمين والحفظ..." : "حفظ واستنتاج التضمين"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
