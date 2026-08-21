// ==========================================================
// محرك الذاكرة الشعاعية السياقية التكيفية (Adaptive Vector Memory)
// ==========================================================
import { VectorContextItem, MemoryBankItem } from "../types";

export interface VectorNode {
  id: string;
  title: string;
  text: string;
  category: 'conversation' | 'fact' | 'concept' | 'user_profile' | 'code' | 'physics_math' | 'literature';
  embedding: number[];
  timestamp: number;
  tags: string[];
  access_count: number;
  importance_weight: number;
  source: string;
}

export class VectorMemoryEngine {
  private static instance: VectorMemoryEngine;
  private vectorStore: Map<string, VectorNode> = new Map();
  private readonly EMBEDDING_DIM = 64;

  private constructor() {
    this.seedDefaultVectorKnowledge();
    this.loadFromStorage();
  }

  public static getInstance(): VectorMemoryEngine {
    if (!VectorMemoryEngine.instance) {
      VectorMemoryEngine.instance = new VectorMemoryEngine();
    }
    return VectorMemoryEngine.instance;
  }

  /**
   * توليد متجهات التضمين الدلالية ذات 64 بعداً مع المعايرة القياسية L2
   */
  public generateEmbedding(text: string): number[] {
    const clean = (text || "").toLowerCase().trim();
    const vec = new Array(this.EMBEDDING_DIM).fill(0);
    if (!clean) return vec;

    for (let i = 0; i < clean.length; i++) {
      const code = clean.charCodeAt(i);
      const pos1 = (code * 31 + i * 17) % this.EMBEDDING_DIM;
      const pos2 = (code * 47 + i * 23) % this.EMBEDDING_DIM;
      const sign = (i % 2 === 0) ? 1 : -1;
      
      vec[pos1] += sign * (code / 255.0);
      vec[pos2] += 0.65 * Math.sin(code + i);

      // N-gram trigram contextual diffusion
      if (i > 1) {
        const prevCode = clean.charCodeAt(i - 1);
        const prevPrevCode = clean.charCodeAt(i - 2);
        const trigramPos = (prevPrevCode * 13 + prevCode * 29 + code * 53) % this.EMBEDDING_DIM;
        vec[trigramPos] += 0.45 * Math.cos(prevCode + code);
      }
    }

    // L2 Normalization: ||v||_2 = 1
    let norm = 0;
    for (let i = 0; i < this.EMBEDDING_DIM; i++) {
      norm += vec[i] * vec[i];
    }
    norm = Math.sqrt(norm) || 1;
    return vec.map((v) => parseFloat((v / norm).toFixed(5)));
  }

  /**
   * حساب معامل تشابه جيب التمام (Cosine Similarity)
   * Sim(u, v) = (u . v) / (||u|| * ||v||)
   */
  public cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0) return 0;
    const len = Math.min(vecA.length, vecB.length);
    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < len; i++) {
      dot += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    const denom = Math.sqrt(normA) * Math.sqrt(normB);
    if (denom === 0) return 0;
    const sim = dot / denom;
    return Math.max(-1, Math.min(1, parseFloat(sim.toFixed(4))));
  }

  /**
   * إضافة أو تحديث عقدة في الذاكرة المتجهة
   */
  public addOrUpdateMemory(item: {
    id?: string;
    title: string;
    text: string;
    category?: VectorNode['category'];
    tags?: string[];
    importance_weight?: number;
    source?: string;
  }): VectorNode {
    const id = item.id || `vec-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const embedding = this.generateEmbedding(item.title + " " + item.text + " " + (item.tags || []).join(" "));
    
    const node: VectorNode = {
      id,
      title: item.title,
      text: item.text,
      category: item.category || 'concept',
      embedding,
      timestamp: Date.now(),
      tags: item.tags || [],
      access_count: 0,
      importance_weight: item.importance_weight || 1.0,
      source: item.source || 'user_interaction',
    };

    this.vectorStore.set(id, node);
    this.saveToStorage();
    return node;
  }

  /**
   * البحث الدلالي المتجهي واسترجاع أعلى k نتائج مطابقة
   */
  public searchSimilar(query: string, topK = 5, minThreshold = 0.25): Array<{
    node: VectorNode;
    similarity: number;
    relevance_pct: number;
  }> {
    const queryVector = this.generateEmbedding(query);
    const results: Array<{ node: VectorNode; similarity: number; relevance_pct: number }> = [];

    this.vectorStore.forEach((node) => {
      const sim = this.cosineSimilarity(queryVector, node.embedding);
      // We scale raw similarity to a positive 0-100% relevance score
      const relevance_pct = Math.round(Math.max(0, (sim + 1) / 2) * 100);

      if (sim >= minThreshold || results.length < 2) {
        results.push({
          node,
          similarity: sim,
          relevance_pct,
        });
      }
    });

    results.sort((a, b) => b.similarity - a.similarity);
    const topResults = results.slice(0, topK);

    // Record access
    topResults.forEach((res) => {
      res.node.access_count += 1;
    });

    return topResults;
  }

  /**
   * استخراج السياق الشعاعي التكيفي لتغذية محرك التفكير في النموذج
   */
  public retrieveContextForPrompt(query: string, maxTokensRough = 1500): VectorContextItem[] {
    const matches = this.searchSimilar(query, 4, 0.20);
    return matches.map((m) => ({
      id: m.node.id,
      title: m.node.title,
      text: m.node.text,
      category: m.node.category,
      similarity: m.similarity,
      timestamp: m.node.timestamp,
      metadata: {
        relevance_pct: m.relevance_pct,
        tags: m.node.tags,
        access_count: m.node.access_count,
      },
    }));
  }

  /**
   * الحصول على كافة العقد في الذاكرة
   */
  public getAllNodes(): VectorNode[] {
    return Array.from(this.vectorStore.values()).sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * حذف عقدة
   */
  public deleteNode(id: string): boolean {
    const deleted = this.vectorStore.delete(id);
    if (deleted) this.saveToStorage();
    return deleted;
  }

  /**
   * تفريغ الذاكرة وإعادة التعيين
   */
  public clearAll(): void {
    this.vectorStore.clear();
    this.seedDefaultVectorKnowledge();
    this.saveToStorage();
  }

  private saveToStorage(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const data = Array.from(this.vectorStore.entries());
        localStorage.setItem("omega_vector_database_v2", JSON.stringify(data));
      }
    } catch (e) {
      console.warn("Could not save vector memory to localStorage:", e);
    }
  }

  private loadFromStorage(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = localStorage.getItem("omega_vector_database_v2");
        if (raw) {
          const parsed = JSON.parse(raw);
          parsed.forEach(([k, v]: [string, VectorNode]) => {
            this.vectorStore.set(k, v);
          });
        }
      }
    } catch (e) {
      console.warn("Could not load vector memory from localStorage:", e);
    }
  }

  private seedDefaultVectorKnowledge(): void {
    const seeds: Array<Omit<VectorNode, 'id' | 'embedding' | 'access_count'>> = [
      {
        title: "معمارية العقل التنفيذي Omega Brain",
        text: "نظام ذكاء اصطناعي متعدد المسارات يدمج شبكات MoE ذات الـ 90 طبقة ومحسن OmegaV15 والذاكرة الشعاعية ومصفوفة الفصل المعرفي التوافقي.",
        category: "concept",
        timestamp: Date.now() - 86400000 * 2,
        tags: ["architecture", "omega", "moe", "system"],
        importance_weight: 1.0,
        source: "system_kernel",
      },
      {
        title: "خوارزمية شجرة الأفكار الاحتمالية Tree-of-Thought",
        text: "تقييم مسارات التفكير بالصيغة الاحتمالية P(S) = \\prod_{i=1}^n (w_i \\cdot C_i) حيث w_i وزن المسار و C_i معامل الثقة، لاختيار المسار الأمثل وتشذيب المسارات الهامشية.",
        category: "concept",
        timestamp: Date.now() - 86400000,
        tags: ["tot", "reasoning", "probability", "algorithms"],
        importance_weight: 0.95,
        source: "reasoning_engine",
      },
      {
        title: "طبقة ما وراء المعرفة والتحقق من الهلوسة Meta-Cognition",
        text: "طبقة برمجية وسيطة Verifier تدقق المخرجات قبل العرض وتقارن الادعاءات برسم بياني معرفي Knowledge Graph لتقليل الهلوسة الرقمية وتصنيف الادعاءات إلى حقائق وفرضيات ومقترحات.",
        category: "fact",
        timestamp: Date.now() - 43200000,
        tags: ["meta_cognition", "verifier", "knowledge_graph", "anti_hallucination"],
        importance_weight: 0.98,
        source: "verification_core",
      },
      {
        title: "معادلة شرودنغر والنفق الكمومي Quantum Tunneling",
        text: "i\\hbar \\frac{\\partial}{\\partial t}\\Psi = \\hat{H}\\Psi، ونفاذية الجسيم عبر حاجز الجهد T \\approx e^{-2\\kappa a} حيث \\kappa = \\frac{\\sqrt{2m(V_0-E)}}{\\hbar}.",
        category: "physics_math",
        timestamp: Date.now() - 21600000,
        tags: ["quantum", "schrodinger", "physics", "tunneling"],
        importance_weight: 0.90,
        source: "knowledge_base",
      },
      {
        title: "البلاغة العربية والتحليل الأدبي والبيان",
        text: "علم المعاني والبيان والبديع، التشبيه البليغ والاستعارة المكنية والطباق والجناس وجماليات النثر والشعر العربي للمتنبي والمعري وشوقي.",
        category: "literature",
        timestamp: Date.now() - 10800000,
        tags: ["rhetoric", "poetry", "literature", "arabic"],
        importance_weight: 0.88,
        source: "literary_corpus",
      },
    ];

    seeds.forEach((seed) => {
      const id = `seed-${seed.tags[0]}-${Date.now()}`;
      const embedding = this.generateEmbedding(seed.title + " " + seed.text + " " + seed.tags.join(" "));
      this.vectorStore.set(id, {
        ...seed,
        id,
        embedding,
        access_count: 0,
      });
    });
  }
}
