export interface TestConfig {
  basics: {
    name: string;
    simultaneous: number;
    duration: number;
    environment: 'staging' | 'production';
  };
  customer: {
    accents: string[];
    pace: string[];
    noise: string[];
    interruption: number;
    emotions: string[];
  };
  conversation: {
    industry: string;
    complexity: number;
    maxTurns: number;
    responseThreshold: number;
    successCriteria: string;
  };
  network: {
    latency: number;
    packetLoss: number;
    bandwidth: number;
    stability: 'stable' | 'variable' | 'poor';
  };
  scenario: {
    template: string;
    edgeCaseFreq: number;
    errorRate: number;
    vocabulary: string[];
    topics: string[];
  };
  quality: {
    minResponseTime: number;
    completionRate: number;
    maxErrorRate: number;
    contextScore: number;
    clarityThreshold: number;
  };
}

export interface SimulationResult {
  id: string;
  config_id: string;
  status: 'starting' | 'running' | 'completed' | 'failed';
  start_time: string;
  end_time: string | null;
  total_conversations: number;
  successful_conversations: number;
  created_at: string;
  updated_at: string;
} 