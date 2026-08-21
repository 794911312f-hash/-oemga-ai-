export interface BrainState {
  attention_level: number;       // 0 to 1
  cognitive_load: number;        // 0 to 1
  emotional_state: number;       // -1 to 1
  curiosity_level: number;       // 0 to 1
  confidence: number;            // 0 to 1
  active_goal?: string | null;
  current_task?: string | null;
}

export interface ConsciousnessState {
  awareness_level: number;
  self_reflection: boolean;
  attention_focus: string;
  emotional_valence: number;
  cognitive_coherence: number;
  timestamp: number;
}

export type ReasoningStrategy = 'chain_of_thought' | 'tree_of_thought' | 'self_consistency';

export interface ProbabilisticThoughtStep {
  step_index: number;
  step_title: string;
  weight_w: number;              // w_i: وزن أهمية الخطوة أو المحور
  confidence_c: number;          // C_i: معامل الثقة في الخطوة [0, 1]
  step_prob: number;             // w_i * C_i
  justification?: string;        // التبرير المنطقي أو البرهاني للخطوة
}

export interface BranchEvaluationMetrics {
  f1_logical_coherence: number;      // f1(s): التماسك المنطقي الداخلي (w1 = 0.35)
  f2_empirical_precision: number;    // f2(s): الدقة والبرهان التخصصي (w2 = 0.30)
  f3_systemic_depth: number;         // f3(s): العمق والشمولية المنظومية (w3 = 0.20)
  f4_aesthetic_rhetoric: number;     // f4(s): الفصاحة والبلاغة والجمالية (w4 = 0.15)
  formula_expression: string;        // V(s) = 0.35*f1 + 0.30*f2 + 0.20*f3 + 0.15*f4
  total_value: number;               // V(s) الناتج
}

export interface ThoughtBranch {
  id: number;
  content: string;
  score: number;                     // V(s) Final Score
  probabilistic_score_P_S?: number;  // P(S) = \prod_{i=1}^n (w_i \cdot C_i)
  steps_evaluation?: ProbabilisticThoughtStep[]; // الخطوات الاحتمالية المفصلة
  weights_vector?: number[];         // [w1, w2, ..., wn]
  confidence_vector?: number[];      // [C1, C2, ..., Cn]
  trajectory_status?: 'optimal' | 'viable' | 'pruned';
  formula_latex?: string;            // P(S) = \prod_{i=1}^n w_i \cdot C_i
  metrics?: BranchEvaluationMetrics;
  evaluated_logic?: string;
  strengths?: string[];
  risks?: string[];
}

export interface MetaCognitiveVerification {
  verified: boolean;
  hallucination_risk_score: number;       // 0 to 1 (e.g. 0.03 = 3% risk)
  factual_consistency_score: number;      // 0 to 1 (e.g. 0.98 = 98% consistent)
  epistemic_audit_passed: boolean;
  knowledge_graph_anchors: Array<{
    entity: string;
    category: string;
    matched_axiom: string;
    status: 'verified' | 'inferred' | 'novel';
  }>;
  contradictions_detected: Array<{
    claim: string;
    reason: string;
    severity: 'low' | 'medium' | 'high';
  }>;
  verification_summary: string;
  verification_certificate_id: string;
  verified_at: number;
}

export interface VectorContextItem {
  id: string;
  title?: string;
  text: string;
  category: string;
  similarity: number;
  timestamp?: number;
  metadata?: Record<string, any>;
}

export interface ReasoningResult {
  strategy: ReasoningStrategy;
  steps?: string[];
  conclusion?: string;
  branches?: ThoughtBranch[];
  best_branch?: ThoughtBranch;
  answers?: string[];
  best_answer?: string;
  summary: string;
  evaluation_formula?: string;       // e.g. "P(S) = \prod_{i=1}^n (w_i \cdot C_i)"
  formula_weights?: Record<string, number>;
  optimal_trajectory_P_S?: number;   // P(S^*)
}

export interface PlanStep {
  id: number | string;
  description: string;
  status?: 'pending' | 'executing' | 'completed' | 'failed';
  subtasks?: string[];
}

export interface Plan {
  goal: string;
  goal_analysis?: {
    goal_type?: string;
    difficulty?: string;
    resources?: string;
    raw_analysis: string;
  };
  subgoals?: PlanStep[];
  steps: PlanStep[];
  estimated_complexity: number;
  confidence: number;
}

export interface ReflectionResult {
  quality_score: number;
  errors: string[];
  lessons: string[];
  improvement_suggestions: string[];
}

export interface EntityNode {
  name: string;
  type?: string;
  description?: string;
  raw?: string;
}

export interface RelationshipEdge {
  from?: string;
  to?: string;
  description: string;
  relation_type?: string;
}

export type QuestionDomainType = 'scientific' | 'literary' | 'hybrid' | 'general';

export interface QuestionClassification {
  type: QuestionDomainType;
  domain_label: string;             // e.g. "أدبي - شعر وبلاغة ونقد", "علمي - فيزياء ورياضيات"
  comprehension_summary: string;   // الفهم العميق لجوهر السؤال ومقصد السائل
  depth_level: 'introductory' | 'intermediate' | 'advanced' | 'philosophical_critical';
  style_applied: string;           // الأسلوب المعتمد في الرد (أدبي رصين وبليغ / علمي برهاني صارم)
  key_themes?: string[];          // المحاور والمفاهيم الجوهرية
  rhetorical_or_scientific_markers?: string[]; // الشواهد الأدبية والبلاغية أو النظريات والقوانين العلمية
}

export interface Situation {
  input: string;
  classification?: QuestionClassification;
  entities: EntityNode[];
  relationships: RelationshipEdge[];
  context: Record<string, any>;
  summary: string;
  predicted_outcomes?: { outcome: string; probability: number }[];
}

export interface ChatAttachment {
  id: string;
  name: string;
  type: 'image' | 'document' | 'code' | 'data';
  mimeType: string;
  size: number;
  dataUrl: string; // Base64 data url for preview and payload
  extractedText?: string;
}

export interface ThoughtTrace {
  id: string;
  timestamp: string;
  input: string;
  classification?: QuestionClassification;
  attachments?: ChatAttachment[];
  epistemic_matrix?: EpistemicMatrix;
  epistemic_claims?: EpistemicClaim[];
  meta_cognition?: MetaCognitiveVerification;
  retrieved_vector_context?: VectorContextItem[];
  situation: Situation;
  plan: Plan;
  reasoning: ReasoningResult;
  response: string;
  reflection: ReflectionResult;
  consciousness: ConsciousnessState;
  code_executions?: {
    code: string;
    output: string;
    success: boolean;
    error?: string;
  }[];
}


export interface InferredRelationship {
  from: string;
  to: string;
  relation: string;
  strength: number;              // 0 to 1
  cosineSimilarity: number;      // -1 to 1
  explanation: string;
  domain: 'cross_discipline' | 'mathematical' | 'linguistic' | 'architectural';
}

export interface SemanticConceptNode {
  name: string;
  definition: string;
  category?: string;
  embedding?: number[];
  inferredConnections?: InferredRelationship[];
}

export interface MemoryBankItem {
  id: string;
  type: 'short_term' | 'long_term' | 'episodic' | 'semantic' | 'vector' | 'sensory' | 'procedural';
  category?: string;
  title: string;
  content: any;
  timestamp: number | string;
  tags?: string[];
  similarity?: number;
  embedding?: number[];
}

export interface LatencyMetrics {
  t_fetch_ms: number;
  t_inference_ms: number;
  t_render_ms: number;
  t_total_ms: number;
  threshold_ms: number;
  compliant: boolean;
  formula_expression: string;
  efficiency_status: 'optimal' | 'compliant' | 'warning';
}

export interface SearchQueryParsing {
  requires_external_search: boolean;
  intent: string;
  extracted_entities: string[];
  generated_search_terms: string[];
  search_domain: string;
  confidence: number;
}

export interface NewsArticle {
  title: string;
  source: string;
  url: string;
  snippet: string;
  pubDate?: string;
  category?: string;
  relevance_score?: number;
}

export interface AgentExecutionLog {
  agent: 'manager' | 'researcher' | 'coder' | 'planner' | 'critic';
  status: 'idle' | 'running' | 'completed' | 'failed';
  action: string;
  output?: any;
  timestamp: string;
}

export interface SwarmResult {
  task: string;
  task_type: string;
  analysis: string;
  agents_used: string[];
  latency_metrics?: LatencyMetrics;
  results: {
    researcher?: {
      parsing?: SearchQueryParsing;
      queries: string[];
      search_results: NewsArticle[];
      analysis: string;
      summary: string;
      latency?: LatencyMetrics;
    };
    coder?: {
      code: string;
      execution_result: {
        success: boolean;
        output: string;
        error?: string;
        result?: any;
      };
      file_saved?: string;
      fixed_iterations?: number;
    };
    planner?: {
      goal_analysis: string;
      plan: { step: number; description: string }[];
      evaluation: string;
    };
    critic?: {
      score: number;
      strengths: string[];
      weaknesses: string[];
      improvements: string[];
      review: string;
    };
  };
  final_result: string;
  review: {
    score: number;
    text: string;
  };
}

export interface OptimizerTelemetry {
  psi: number;          // Belief confidence [0.1, 0.99]
  r_val: number;        // Recovery activation [0, 1]
  a_val: number;        // Aggression scale [0.2, 0.95]
  grad_norm: number;
  belief: number;
  loss_ema: number;
  prev_loss: number;
  trust_region: number;
  shift_detected: boolean;
  step_count: number;
  recent_losses: number[];
  // Mathematical Loss Formulation: L(theta) = \sum ||f(x_i; theta) - y_i||^2 + \lambda R(theta)
  loss_total: number;       // L(theta)
  loss_empirical: number;   // \sum ||f(x_i; theta) - y_i||^2
  loss_regularization: number; // \lambda R(theta)
  lambda_reg: number;       // \lambda coefficient
  convergence_rate: number; // rate of loss decay
  layer_activations?: Array<{ layer: number; norm: number; active_expert: number; gate_weight: number }>;
}

export interface WorldClockCity {
  city: string;
  timezone: string;
  offset: string;
  time?: string;
}

export interface TimeSnapshot {
  timestamp: number;
  iso: string;
  gregorian_ar: string;
  time_ar: string;
  time_en: string;
  hijri_ar: string;
  utc: string;
  day_name: string;
  world_clocks: WorldClockCity[];
}

export interface MoEExpertState {
  id: number;
  name: string;
  specialization: string;
  load_factor: number;
  gate_weight: number;
  active: boolean;
}

export interface CodebaseFileMetadata {
  path: string;
  name: string;
  category: 'backend' | 'frontend' | 'component' | 'config' | 'style';
  language: string;
  description: string;
  lines?: number;
  size?: number;
  content?: string;
  keyExports?: string[];
  keyFeatures?: string[];
}

export interface CodebaseManifest {
  appName: string;
  version: string;
  runtime: string;
  framework: string;
  architectureSummary: string;
  totalFiles: number;
  totalLines: number;
  files: CodebaseFileMetadata[];
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  endpoints: {
    method: string;
    path: string;
    description: string;
    handler: string;
  }[];
}

export interface SampleGradientTrace {
  sample_id: number;
  input_x: string;
  target_y: string;
  loss_l: number;
  grad_theta_norm: number;
  correction_delta: number;
}

export interface GradientOptimizationState {
  formula_gradient: string;
  formula_update: string;
  n_samples: number;
  learning_rate_eta: number;
  nabla_L_theta: number;
  theta_norm: number;
  current_error_rate: number;
  previous_error_rate: number;
  error_reduction_pct: number;
  samples: SampleGradientTrace[];
  iteration_history: Array<{
    step: number;
    loss: number;
    grad_norm: number;
    error_rate: number;
    theta_norm: number;
    action_log: string;
  }>;
  convergence_status: 'converging' | 'optimal' | 'recalibrating';
}

export interface SwarmDecisionBridge {
  theoretical_concept: string;
  mathematical_basis: string;
  executive_decision: string;
  swarm_consensus_score: number;
  tactical_roles: {
    manager: { role: string; command: string; status: 'active' | 'approved' };
    researcher: { role: string; empirical_grounding: string; sources_count: number };
    coder: { role: string; executable_patch: string; validation: 'passed' | 'testing' };
    planner: { role: string; critical_path: string[]; horizon: string };
    critic: { role: string; loss_verification: string; score: number };
  };
  executable_actions: Array<{
    id: string;
    action: string;
    target_module: string;
    priority: 'critical' | 'high' | 'medium';
    status: 'completed' | 'executing' | 'queued';
  }>;
}

export interface ConsciousnessPoint {
  id: string;
  query: string;
  timestamp: number;
  domain: string;
  loss_at_intake: number;
  gradient_delta: number;
  awareness_gain: number;
  matrix_index: number;
}

export interface AntiHallucinationMetrics {
  single_pass_hallucination_prob: number;  // e.g. 0.42 (42% in standard single LLM pass)
  swarm_triangulated_hallucination_prob: number; // e.g. 0.02 (2% after multi-agent cross-verification)
  grounding_index_pct: number;            // e.g. 98.4%
  empirical_sources_verified: number;     // e.g. 5 sources
  code_formal_proof_passed: boolean;       // true
  causal_dag_consistency_score: number;   // 0.99
  critic_rigor_score: number;             // 9.85 / 10
  entropy_reduction_pct: number;          // e.g. 78.5%
}

export interface V15OptimizerImpact {
  loss_before: number;
  loss_after: number;
  loss_delta_pct: number;
  psi_belief_confidence: number;
  gradient_norm_stabilized: number;
  lambda_adaptive_reg: number;
  convergence_speedup_x: number;
  theta_norm: number;
}

export interface ComplexProblemBenchmark {
  id: string;
  title: string;
  domain: 'quantum_physics' | 'distributed_systems' | 'adversarial_ml' | 'causal_inference' | 'cryptography' | 'nonlinear_pde' | 'custom';
  domain_ar: string;
  difficulty: 'EXTREME' | 'HARD' | 'OLYMPIAD';
  mathematical_formulation: string;
  problem_statement: string;
  hallucination_vulnerability_desc: string;
  agent_roles_strategy: {
    researcher: string;
    coder: string;
    planner: string;
    critic: string;
  };
  sample_verification_code?: string;
  expected_solution_summary?: string;
}

export interface SwarmTriangulationResult {
  problem: ComplexProblemBenchmark;
  solution_overview: string;
  anti_hallucination: AntiHallucinationMetrics;
  v15_optimizer_impact: V15OptimizerImpact;
  agent_traces: {
    researcher: {
      citations: string[];
      grounded_facts: string[];
      empirical_summary: string;
    };
    coder: {
      formal_code: string;
      simulation_stdout: string;
      assertions_passed: number;
      total_assertions: number;
    };
    planner: {
      causal_steps: string[];
      dag_edges: Array<{ from: string; to: string; rule: string }>;
    };
    critic: {
      penalized_claims: string[];
      confirmed_truths: string[];
      review_score: number;
      final_verdict: string;
    };
  };
  consciousness_point_created?: ConsciousnessPoint;
}

// ==========================================
// 7 NEW COGNITIVE DIMENSIONS & ADVANCED TYPES
// ==========================================

export type EpistemicType = 'fact' | 'hypothesis' | 'proposal';
export type EpistemicClaimType = EpistemicType;

export interface EpistemicClaim {
  id: string;
  type: EpistemicType;
  title: string;
  content: string;
  confidence: number;
  epistemic_tag_ar: 'حقيقة مثبتة' | 'فرضية قيد البحث' | 'اقتراح استدلالي';
  citation_or_basis?: string;
  is_verified?: boolean;
}

export interface EpistemicMatrix {
  facts: EpistemicClaim[];
  hypotheses: EpistemicClaim[];
  proposals: EpistemicClaim[];
  summary: string;
  fact_ratio: number;
  hypothesis_ratio: number;
  proposal_ratio: number;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  thoughtTraces: ThoughtTrace[];
  tags: string[];
  pinned?: boolean;
  domain?: QuestionDomainType;
  summary?: string;
}

export type BlueprintCategory = 'architectural' | 'structural' | 'electrical' | 'plumbing' | 'network' | 'gantt';

export interface BlueprintElement {
  id: string;
  type: 'wall' | 'room' | 'door' | 'window' | 'electrical_outlet' | 'plumbing_pipe' | 'beam' | 'column' | 'dimension_label' | 'equipment';
  label: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  layer: 'structural' | 'architectural' | 'electrical' | 'plumbing' | 'dimensions';
  specs?: Record<string, any>;
  color?: string;
}

export interface BlueprintProject {
  id: string;
  title: string;
  category: BlueprintCategory;
  category_ar: string;
  description: string;
  dimensions: {
    width_m: number;
    height_m: number;
    scale_label: string;
    total_area_sqm: number;
  };
  layers: string[];
  elements: BlueprintElement[];
  svgCode?: string;
  materials_spec?: { item: string; quantity: string; standard: string }[];
  engineering_notes?: string[];
  lastModified: number;
}

export type ImageFormat = 'png' | 'jpeg' | 'webp' | 'svg';
export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4' | '21:9';

export interface MediaGenerationTask {
  id: string;
  type: 'image' | 'video';
  prompt: string;
  prompt_ar?: string;
  format: ImageFormat | 'mp4' | 'webm' | 'gif';
  style: string;
  aspectRatio: AspectRatio;
  resolution: string;
  status: 'idle' | 'generating' | 'completed' | 'failed';
  resultUrl?: string;
  svgCode?: string;
  timestamp: number;
  videoStoryboard?: {
    scenes: {
      scene_number: number;
      duration_sec: number;
      camera_angle: string;
      visual_description: string;
      dialogue_or_narration: string;
      motion_prompt: string;
      simulated_frame_color: string;
    }[];
    total_duration_sec: number;
    music_mood: string;
    veo_ai_prompt: string;
  };
}

export interface SocialIntelligenceAnalysis {
  id: string;
  platform: 'youtube' | 'facebook' | 'twitter' | 'linkedin' | 'instagram' | 'tiktok';
  urlOrTopic: string;
  title: string;
  summary: string;
  transcript_extracts?: { timestamp: string; speaker: string; text: string }[];
  key_takeaways: string[];
  sentiment: 'positive' | 'neutral' | 'critical' | 'analytical';
  sentiment_score: number;
  viral_score: number; // 0 to 100
  target_audience: string;
  optimal_posting_time: string;
  suggested_hooks: string[];
  generated_posts: {
    platform: string;
    content: string;
    hashtags: string[];
    call_to_action: string;
    estimated_engagement_rate: string;
  }[];
  timestamp: number;
}

export interface FreeCloudServerEndpoint {
  id: string;
  name: string;
  name_ar: string;
  category: 'knowledge' | 'weather' | 'ai_inference' | 'science' | 'developer' | 'geo' | 'finance' | 'public_data';
  category_ar: string;
  baseUrl: string;
  description: string;
  sampleEndpoint: string;
  method: 'GET' | 'POST';
  defaultHeaders?: Record<string, string>;
  defaultBody?: string;
  authType: 'none_free' | 'open_key_optional';
  rateLimit: string;
  docsUrl: string;
  popularParams?: { key: string; value: string; description: string }[];
}

export interface ApiTestResult {
  endpointId: string;
  url: string;
  method: string;
  statusCode: number;
  statusText: string;
  latencyMs: number;
  headers: Record<string, string>;
  responsePayload: any;
  timestamp: number;
  success: boolean;
}

