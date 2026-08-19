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

export interface ThoughtBranch {
  id: number;
  content: string;
  score: number;
  evaluated_logic?: string;
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


export interface MemoryBankItem {
  id: string;
  type: 'short_term' | 'long_term' | 'episodic' | 'semantic' | 'vector';
  category?: string;
  title: string;
  content: any;
  timestamp: number | string;
  tags?: string[];
  similarity?: number;
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
  results: {
    researcher?: {
      queries: string[];
      search_results: { title: string; url: string; snippet: string }[];
      analysis: string;
      summary: string;
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

