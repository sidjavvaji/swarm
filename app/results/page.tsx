'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navigation from '../components/Navigation';
import { Card } from '../components/Card';
import { database } from '../../lib/database';
import { useAuth } from '../context/AuthContext';
import type { VoiceConversation } from '../../types/database';
import LoadingScreen from '../components/LoadingScreen';

interface TestResult {
  // Basic Info
  id: string;
  startTime: string;
  endTime: string;
  duration: string;
  callSid: string;
  completionStatus: string;
  systemPrompt: string;
  conversationType: string;

  // Message Data
  messages: {
    speakerType: string;
    text: string;
    timestamp: string;
    sequenceNumber: number;
    responseTime: number;
    tokenCount: number;
    messageType: string;
    sentimentScore: number;
  }[];

  // Technical Performance
  technical: {
    latencyStats: {
      avg: number;
      min: number;
      max: number;
      p95: number;
    };
    tokenUsage: {
      total: number;
      perMessage: number;
      efficiency: number;
    };
    errorCounts: {
      total: number;
      byType: Record<string, number>;
    };
    modelTemperature: number;
    memoryUsage: number;
    avgResponseTime: number;
    apiErrors: string[];
  };

  // Conversation Quality
  quality: {
    coherenceScore: number;
    taskCompletion: number;
    contextRetention: number;
    naturalLanguage: number;
    appropriateness: number;
    engagement: number;
    errorRecovery: number;
    overallQuality: number;
  };

  // Task-Specific (Restaurant)
  taskSpecific: {
    orderAccuracy: number;
    requiredClarifications: number;
    completionTime: number;
    validationResults: boolean;
    specialRequests: number;
    menuKnowledge: number;
    upsellAttempts: number;
  };

  // Error Tracking
  errors: {
    type: string;
    severity: string;
    description: string;
    recoveryAttempt: string;
    recoverySuccess: boolean;
    timestamp: string;
  }[];

  // Semantic Analysis
  semantic: {
    intentClassification: Record<string, number>;
    entityExtraction: string[];
    topicClassification: string[];
    semanticRoleLabels: Record<string, string>;
    conversationFlow: string[];
  };

  // Training Feedback
  trainingFeedback: {
    type: string;
    suggestion: string;
    priority: string;
    implementationStatus: string;
  }[];

  // Context Management
  context: {
    updates: {
      timestamp: string;
      type: string;
      value: string;
    }[];
    retentionScore: number;
    validPeriods: { start: string; end: string }[];
  };
}

interface Message {
  role: 'assistant' | 'user';
  content: string;
  timestamp: string;
}

interface EntityExtraction {
  entity?: string;
  value?: string;
}

interface ErrorDetail {
  type: string;
  message: string;
  timestamp: string;
}

interface TransformedMessage {
  speakerType: string;
  text: string;
  timestamp: string;
  responseTime: number;
  tokenCount: number;
  messageType: string;
  sentimentScore: number;
}

interface IntentClassification {
  [key: string]: number;
}

interface SemanticAnalysis {
  intentClassification: IntentClassification;
  entityExtraction: string[];
  topicClassification: string[];
  semanticRoleLabels: Record<string, string>;
  conversationFlow: string[];
}

interface TransformedResult {
  id: string;
  startTime: string;
  endTime: string;
  duration: string;
  callSid: string;
  completionStatus: string;
  conversationType: string;
  messages: TransformedMessage[];
  technical: {
    latencyStats: {
      avg: number;
      min: number;
      max: number;
      p95: number;
    };
    tokenUsage: {
      total: number;
      perMessage: number;
      efficiency: number;
    };
    errorCounts: {
      total: number;
      byType: Record<string, number>;
    };
    modelTemperature: number;
    memoryUsage: number;
    avgResponseTime: number;
    apiErrors: string[];
  };
  quality: {
    coherenceScore: number;
    taskCompletion: number;
    contextRetention: number;
    naturalLanguage: number;
    appropriateness: number;
    engagement: number;
    errorRecovery: number;
    overallQuality: number;
  };
  semantic: SemanticAnalysis;
  errors: {
    type: string;
    severity: string;
    description: string;
    recoveryAttempt: string;
    recoverySuccess: boolean;
    timestamp: string;
  }[];
  taskSpecific: {
    orderAccuracy: number;
    requiredClarifications: number;
    completionTime: number;
    menuKnowledge: number;
    specialRequests: number;
    upsellAttempts: number;
    validationResults: boolean;
  };
}

export default function Results() {
  const [activeTab, setActiveTab] = useState('overview');
  const [results, setResults] = useState<any[]>([]);  // Still using any for results until we have complete types
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchResults = async () => {
      if (!user) return;

      try {
        const fetchedResults = await database.getTestResults('all');
        console.log('Raw results from database:', fetchedResults);
        setResults(fetchedResults);
      } catch (error) {
        console.error('Error fetching results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [user]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black">
        <Navigation />
        <LoadingScreen />
      </main>
    );
  }

  if (!results || results.length === 0) {
    return (
      <main className="min-h-screen bg-black">
        <Navigation />
        <div className="pt-24 px-4">
          <div className="text-center">No results available</div>
        </div>
      </main>
    );
  }

  const result = results[0];
  console.log('Processing result:', result);

  // Transform database data to match the UI structure
  const transformedResult: TransformedResult = {
    id: result.id,
    startTime: result.created_at,
    endTime: result.updated_at,
    duration: result.duration ? `${result.duration}s` : 'N/A',
    callSid: result.call_sid,
    completionStatus: result.status,
    conversationType: "Restaurant Order",

    messages: ((result.transcript?.messages || []) as Message[]).map((msg: Message): TransformedMessage => ({
      speakerType: msg.role,
      text: msg.content,
      timestamp: msg.timestamp,
      responseTime: result?.technical_metrics?.[0]?.avg_latency_ms || 0,
      tokenCount: result?.technical_metrics?.[0]?.tokens_per_message || 0,
      sentimentScore: result?.quality_metrics?.[0]?.sentiment_score || 0.5,
      messageType: msg.role === 'assistant' ? 'response' : 'user_input'
    })),

    technical: {
      latencyStats: {
        avg: result?.technical_metrics?.[0]?.avg_latency_ms || 0,
        min: result?.technical_metrics?.[0]?.min_latency_ms || 0,
        max: result?.technical_metrics?.[0]?.max_latency_ms || 0,
        p95: result?.technical_metrics?.[0]?.p95_latency_ms || 0
      },
      tokenUsage: {
        total: result?.technical_metrics?.[0]?.total_tokens || 0,
        perMessage: result?.technical_metrics?.[0]?.tokens_per_message || 0,
        efficiency: result?.technical_metrics?.[0]?.token_efficiency || 0
      },
      errorCounts: {
        total: (result?.error_details || []).length,
        byType: {}
      },
      modelTemperature: result?.technical_metrics?.[0]?.model_temperature || 0,
      memoryUsage: result?.technical_metrics?.[0]?.memory_usage_mb || 0,
      avgResponseTime: result?.technical_metrics?.[0]?.avg_latency_ms || 0,
      apiErrors: []
    },

    quality: {
      coherenceScore: result?.quality_metrics?.[0]?.coherence_score || 0,
      taskCompletion: result?.quality_metrics?.[0]?.task_completion_score || 0,
      contextRetention: result?.quality_metrics?.[0]?.context_retention_score || 0,
      naturalLanguage: result?.quality_metrics?.[0]?.natural_language_score || 0,
      appropriateness: result?.quality_metrics?.[0]?.appropriateness_score || 0,
      engagement: result?.quality_metrics?.[0]?.engagement_score || 0,
      errorRecovery: result?.quality_metrics?.[0]?.error_recovery_score || 0,
      overallQuality: result?.quality_metrics?.[0]?.overall_quality_score || 0
    },

    semantic: {
      intentClassification: (result?.analysis_results?.[0]?.intent_classification || {}) as IntentClassification,
      entityExtraction: ((result?.analysis_results?.[0]?.entity_extraction || []) as EntityExtraction[])
        .map(e => e.entity || e.value || ''),
      topicClassification: (result?.analysis_results?.[0]?.topic_classification || []) as string[],
      semanticRoleLabels: (result?.analysis_results?.[0]?.semantic_role_labels || {}) as Record<string, string>,
      conversationFlow: (result?.analysis_results?.[0]?.conversation_flow || []) as string[]
    } as SemanticAnalysis,

    errors: (result?.error_details || []).map((error: any) => ({
      type: error.type,
      severity: result.error_severity || 'unknown',
      description: error.message,
      recoveryAttempt: result.recovery_attempt || 'none',
      recoverySuccess: result.recovery_success || false,
      timestamp: error.timestamp
    })),

    taskSpecific: {
      orderAccuracy: result?.quality_metrics?.[0]?.order_accuracy || 0,
      requiredClarifications: result?.quality_metrics?.[0]?.required_clarifications || 0,
      completionTime: result?.quality_metrics?.[0]?.completion_time || 0,
      menuKnowledge: result?.quality_metrics?.[0]?.menu_knowledge || 0,
      specialRequests: result?.quality_metrics?.[0]?.special_requests || 0,
      upsellAttempts: result?.quality_metrics?.[0]?.upsell_attempts || 0,
      validationResults: true
    }
  };

  return (
    <main className="min-h-screen bg-black">
      <div className="rhombus-pattern" />
      <Navigation />

      <div className="pt-24 px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold gradient-text">
              Test Results
            </h1>
            <div className="flex gap-2">
              {['overview', 'messages', 'technical', 'quality', 'semantic', 'errors'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? 'bg-primary/20 text-primary'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Basic Info Card */}
          <Card className="mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <h3 className="text-sm text-white/70">Test ID</h3>
                <p className="text-lg font-semibold gradient-text">{transformedResult.id}</p>
              </div>
              <div>
                <h3 className="text-sm text-white/70">Duration</h3>
                <p className="text-lg font-semibold gradient-text">{transformedResult.duration}</p>
              </div>
              <div>
                <h3 className="text-sm text-white/70">Status</h3>
                <p className="text-lg font-semibold gradient-text">{transformedResult.completionStatus}</p>
              </div>
              <div>
                <h3 className="text-sm text-white/70">Type</h3>
                <p className="text-lg font-semibold gradient-text">{transformedResult.conversationType}</p>
              </div>
            </div>
          </Card>

          {/* Main Content */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <QualityMetricsCard quality={transformedResult.quality} />
              <TechnicalMetricsCard technical={transformedResult.technical} />
              <TaskSpecificCard taskSpecific={transformedResult.taskSpecific} />
            </div>
          )}

          {activeTab === 'messages' && (
            <Card>
              <div className="space-y-4">
                {transformedResult.messages.map((message, index) => (
                  <div key={index} className="p-4 bg-black/20 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-white/70">{message.speakerType}</span>
                      <span className="text-xs text-white/50">{message.timestamp}</span>
                    </div>
                    <p className="text-white/90 mb-2">{message.text}</p>
                    <div className="grid grid-cols-4 gap-4 text-sm text-white/70">
                      <div>Response: {message.responseTime}ms</div>
                      <div>Tokens: {message.tokenCount}</div>
                      <div>Type: {message.messageType}</div>
                      <div>Sentiment: {message.sentimentScore.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === 'technical' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h3 className="text-lg font-semibold mb-4 gradient-text">Latency Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <MetricItem label="Average" value={`${transformedResult.technical.latencyStats.avg}ms`} />
                  <MetricItem label="Minimum" value={`${transformedResult.technical.latencyStats.min}ms`} />
                  <MetricItem label="Maximum" value={`${transformedResult.technical.latencyStats.max}ms`} />
                  <MetricItem label="95th Percentile" value={`${transformedResult.technical.latencyStats.p95}ms`} />
                </div>
              </Card>
              
              <Card>
                <h3 className="text-lg font-semibold mb-4 gradient-text">Token Usage</h3>
                <div className="grid grid-cols-2 gap-4">
                  <MetricItem label="Total" value={transformedResult.technical.tokenUsage.total} />
                  <MetricItem label="Per Message" value={transformedResult.technical.tokenUsage.perMessage} />
                  <MetricItem label="Efficiency" value={`${(transformedResult.technical.tokenUsage.efficiency * 100).toFixed(1)}%`} />
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold mb-4 gradient-text">Error Analysis</h3>
                <div className="space-y-2">
                  {Object.entries(transformedResult.technical.errorCounts.byType).map(([type, count]) => (
                    <div key={type} className="flex justify-between items-center">
                      <span className="text-white/70 capitalize">{type}</span>
                      <span className="text-white/90">{count}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold mb-4 gradient-text">System Metrics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <MetricItem label="Memory Usage" value={`${transformedResult.technical.memoryUsage}MB`} />
                  <MetricItem label="Model Temperature" value={transformedResult.technical.modelTemperature} />
                  <MetricItem label="Avg Response Time" value={`${transformedResult.technical.avgResponseTime}ms`} />
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'quality' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(transformedResult.quality).map(([key, value]) => (
                <Card key={key}>
                  <h3 className="text-lg font-semibold mb-4 gradient-text capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  <div className="relative pt-2">
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-black/40">
                      <div
                        style={{ width: `${value * 100}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-primary via-secondary to-accent"
                      />
                    </div>
                    <div className="text-2xl font-bold mt-2 gradient-text">
                      {(value * 100).toFixed(1)}%
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'semantic' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h3 className="text-lg font-semibold mb-4 gradient-text">Intent Classification</h3>
                <div className="space-y-2">
                  {Object.entries(transformedResult.semantic.intentClassification).map(([intent, score]) => (
                    <div key={intent} className="flex justify-between items-center">
                      <span className="text-white/70 capitalize">{intent.replace(/_/g, ' ')}</span>
                      <span className="text-white/90">{(score * 100).toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold mb-4 gradient-text">Entity Extraction</h3>
                <div className="flex flex-wrap gap-2">
                  {transformedResult.semantic.entityExtraction.map((entity: string, index: number) => (
                    <span key={index} className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm">
                      {entity}
                    </span>
                  ))}
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold mb-4 gradient-text">Topic Classification</h3>
                <div className="flex flex-wrap gap-2">
                  {transformedResult.semantic.topicClassification.map((topic: string, index: number) => (
                    <span key={index} className="px-3 py-1 rounded-full bg-secondary/20 text-secondary text-sm">
                      {topic}
                    </span>
                  ))}
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold mb-4 gradient-text">Conversation Flow</h3>
                <div className="space-y-2">
                  {transformedResult.semantic.conversationFlow.map((step: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-full bg-accent/20 text-accent text-sm flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="text-white/90 capitalize">{step.replace(/_/g, ' ')}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'errors' && (
            <Card>
              <div className="space-y-4">
                {transformedResult.errors.map((error, index) => (
                  <div key={index} className="p-4 bg-black/20 rounded-lg border border-red-500/20">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-sm font-medium text-red-400">{error.type}</span>
                        <span className="mx-2 text-white/30">|</span>
                        <span className="text-sm text-white/70">{error.severity}</span>
                      </div>
                      <span className="text-xs text-white/50">{error.timestamp}</span>
                    </div>
                    <p className="text-white/90 mb-2">{error.description}</p>
                    <div className="mt-2 pt-2 border-t border-white/10">
                      <p className="text-sm text-white/70">Recovery Attempt: {error.recoveryAttempt}</p>
                      <div className="mt-1 flex items-center">
                        <span className="text-sm text-white/70">Recovery Status:</span>
                        <span className={`ml-2 text-sm ${error.recoverySuccess ? 'text-green-400' : 'text-red-400'}`}>
                          {error.recoverySuccess ? 'Successful' : 'Failed'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}

interface MetricItemProps {
  label: string;
  value: string | number;
}

function MetricItem({ label, value }: MetricItemProps) {
  return (
    <div>
      <div className="text-sm text-white/70">{label}</div>
      <div className="text-lg font-semibold gradient-text">{value}</div>
    </div>
  );
}

interface QualityMetricsProps {
  quality: {
    coherenceScore: number;
    taskCompletion: number;
    contextRetention: number;
    naturalLanguage: number;
    appropriateness: number;
    engagement: number;
    errorRecovery: number;
    overallQuality: number;
  };
}

function QualityMetricsCard({ quality }: QualityMetricsProps) {
  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4 gradient-text">Quality Metrics</h3>
      <div className="space-y-4">
        {Object.entries(quality).map(([key, value]) => (
          <div key={key} className="flex justify-between items-center">
            <span className="text-white/70 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
            <span className="text-white/90">{(value * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

interface TechnicalMetricsProps {
  technical: {
    latencyStats: {
      avg: number;
      min: number;
      max: number;
      p95: number;
    };
    tokenUsage: {
      total: number;
      perMessage: number;
      efficiency: number;
    };
    errorCounts: {
      total: number;
      byType: Record<string, number>;
    };
    memoryUsage: number;
    avgResponseTime: number;
  };
}

function TechnicalMetricsCard({ technical }: TechnicalMetricsProps) {
  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4 gradient-text">Technical Performance</h3>
      <div className="space-y-4">
        <MetricItem label="Average Latency" value={`${technical.latencyStats.avg}ms`} />
        <MetricItem label="Token Usage" value={technical.tokenUsage.total} />
        <MetricItem label="Error Count" value={technical.errorCounts.total} />
        <MetricItem label="Memory Usage" value={`${technical.memoryUsage}MB`} />
      </div>
    </Card>
  );
}

interface TaskSpecificProps {
  taskSpecific: {
    orderAccuracy: number;
    requiredClarifications: number;
    completionTime: number;
    menuKnowledge: number;
    specialRequests: number;
    upsellAttempts: number;
    validationResults: boolean;
  };
}

function TaskSpecificCard({ taskSpecific }: TaskSpecificProps) {
  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4 gradient-text">Task Performance</h3>
      <div className="space-y-4">
        <MetricItem label="Order Accuracy" value={`${(taskSpecific.orderAccuracy * 100).toFixed(1)}%`} />
        <MetricItem label="Required Clarifications" value={taskSpecific.requiredClarifications} />
        <MetricItem label="Completion Time" value={`${taskSpecific.completionTime}s`} />
        <MetricItem label="Menu Knowledge" value={`${(taskSpecific.menuKnowledge * 100).toFixed(1)}%`} />
        <MetricItem label="Special Requests" value={taskSpecific.specialRequests} />
        <MetricItem label="Upsell Attempts" value={taskSpecific.upsellAttempts} />
        <MetricItem label="Validation" value={taskSpecific.validationResults ? "Passed" : "Failed"} />
      </div>
    </Card>
  );
} 