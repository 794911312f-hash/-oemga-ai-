// وحدة تحسين البحث الدلالي في الذاكرة المتجهة
export class MemoryOptimizer {
  /**
   * حساب تشابه جيب التمام (Cosine Similarity) بين متجهين:
   * Sim(A, B) = (A · B) / (||A|| * ||B||)
   */
  static calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
    if (!vecA || !vecB || vecA.length === 0 || vecA.length !== vecB.length) return 0;
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    const denom = normA * normB;
    return denom === 0 ? 0 : dotProduct / denom;
  }

  /**
   * تحسين استرجاع الذاكرة والبحث عن أعلى قيمة تشابه في القاعدة السياقية
   */
  async optimizeRetrieval(queryVector: number[], contextBase: number[][]): Promise<number> {
    if (!contextBase || contextBase.length === 0) return 0;
    return contextBase.reduce((best, current) => {
      const score = MemoryOptimizer.calculateCosineSimilarity(queryVector, current);
      return score > best ? score : best;
    }, 0);
  }

  /**
   * استرجاع أفضل K متجهات مرتبة تنازلياً حسب درجة التطابق الدلالي مع فهارسها
   */
  static rankTopK(
    queryVector: number[],
    contextBase: { id: string; vector: number[]; metadata?: any }[],
    topK: number = 5
  ): { id: string; similarity: number; metadata?: any }[] {
    if (!contextBase || contextBase.length === 0) return [];
    
    return contextBase
      .map((item) => ({
        id: item.id,
        similarity: MemoryOptimizer.calculateCosineSimilarity(queryVector, item.vector),
        metadata: item.metadata,
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
  }
}
