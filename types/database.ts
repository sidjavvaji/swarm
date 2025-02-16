export interface TestConfiguration {
  id: string;
  user_id: string;
  name: string;
  simultaneous_conversations: number;
  duration_minutes: number;
  environment: 'staging' | 'production';
  accent_types: string[];
  speaking_pace: string[];
  background_noise: string[];
  interruption_frequency: number;
  emotion_types: string[];
  industry: string;
  complexity_level: number;
  max_turns: number;
  response_threshold_ms: number;
  latency_ms: number;
  packet_loss_percentage: number;
  bandwidth_kbps: number;
  connection_stability: 'stable' | 'variable' | 'poor';
  min_response_time_ms: number;
  required_completion_rate: number;
  max_error_rate: number;
  context_score_threshold: number;
  prompt_template: string;
  edge_case_frequency: number;
  error_injection_rate: number;
  created_at: string;
  updated_at: string;
}

export interface TestSimulation {
  id: string;
  config_id: string;
  user_id: string;
  status: 'starting' | 'running' | 'completed' | 'failed';
  start_time: string;
  end_time: string | null;
  total_conversations: number;
  successful_conversations: number;
  created_at: string;
  updated_at: string;
  test_configurations?: TestConfiguration;
}

export interface VoiceConversation {
  id: string;
  simulation_id: string;
  call_sid: string;
  phone_number: string | null;
  status: string;
  duration: number;
  transcript: {
    messages: Array<{
      role: 'assistant' | 'user';
      content: string;
      timestamp: string;
    }>;
  };
  message_timestamps: {
    [messageId: string]: string;
  };
  token_counts: {
    [messageId: string]: number;
  };
  response_times: {
    [messageId: string]: number;
  };
  error_details: Array<{
    type: string;
    message: string;
    timestamp: string;
  }>;
  conversation_metrics: {
    turns: number;
    avgResponseTime: number;
    successfulTurns: number;
  };
  created_at: string;
  updated_at: string;
}

export interface ConversationQualityMetrics {
  id: string;
  conversation_id: string;
  coherence_score: number;
  task_completion_score: number;
  context_retention_score: number;
  natural_language_score: number;
  appropriateness_score: number;
  engagement_score: number;
  error_recovery_score: number;
  overall_quality_score: number;
  created_at: string;
}

export interface TechnicalPerformanceMetrics {
  id: string;
  conversation_id: string;
  avg_latency_ms: number;
  min_latency_ms: number;
  max_latency_ms: number;
  p95_latency_ms: number;
  total_tokens: number;
  tokens_per_message: number;
  token_efficiency: number;
  memory_usage_mb: number;
  api_errors: Array<{
    type: string;
    message: string;
    timestamp: string;
  }>;
  created_at: string;
}

export interface SemanticAnalysisResults {
  id: string;
  conversation_id: string;
  intent_classification: {
    [intent: string]: number;
  };
  entity_extraction: Array<{
    entity: string;
    type: string;
    value: string;
  }>;
  topic_classification: string[];
  semantic_role_labels: {
    [role: string]: string;
  };
  conversation_flow: string[];
  created_at: string;
}

export type Database = {
  test_configurations: TestConfiguration;
  test_simulations: TestSimulation;
  voice_conversations: VoiceConversation;
  conversation_quality_metrics: ConversationQualityMetrics;
  technical_performance_metrics: TechnicalPerformanceMetrics;
  semantic_analysis_results: SemanticAnalysisResults;
}; 