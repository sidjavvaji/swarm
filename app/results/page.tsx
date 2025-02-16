'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '../components/Navigation';
import { Card } from '../components/Card';

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

const mockResult: TestResult = {
  id: "TEST-123",
  startTime: "2024-03-15T10:00:00Z",
  endTime: "2024-03-15T10:05:23Z",
  duration: "5m 23s",
  callSid: "CA123456789",
  completionStatus: "Completed",
  systemPrompt: "You are a restaurant order assistant...",
  conversationType: "Restaurant Order",

  messages: [
    {
      speakerType: "AI",
      text: "Welcome to our restaurant! How can I help you today?",
      timestamp: "2024-03-15T10:00:00Z",
      sequenceNumber: 1,
      responseTime: 150,
      tokenCount: 12,
      messageType: "greeting",
      sentimentScore: 0.8
    },
    // Add more messages...
  ],

  technical: {
    latencyStats: {
      avg: 180,
      min: 120,
      max: 350,
      p95: 250
    },
    tokenUsage: {
      total: 1250,
      perMessage: 25,
      efficiency: 0.85
    },
    errorCounts: {
      total: 2,
      byType: {
        "timeout": 1,
        "transcription": 1
      }
    },
    modelTemperature: 0.7,
    memoryUsage: 256,
    avgResponseTime: 180,
    apiErrors: ["Timeout at 10:02:15"]
  },

  quality: {
    coherenceScore: 0.92,
    taskCompletion: 1.0,
    contextRetention: 0.95,
    naturalLanguage: 0.88,
    appropriateness: 0.96,
    engagement: 0.90,
    errorRecovery: 0.85,
    overallQuality: 0.92
  },

  taskSpecific: {
    orderAccuracy: 0.98,
    requiredClarifications: 2,
    completionTime: 323,
    validationResults: true,
    specialRequests: 1,
    menuKnowledge: 0.95,
    upsellAttempts: 2
  },

  errors: [
    {
      type: "timeout",
      severity: "minor",
      description: "Response delayed beyond threshold",
      recoveryAttempt: "Retry with reduced context",
      recoverySuccess: true,
      timestamp: "2024-03-15T10:02:15Z"
    }
  ],

  semantic: {
    intentClassification: {
      "order": 0.6,
      "inquiry": 0.3,
      "clarification": 0.1
    },
    entityExtraction: ["menu_item", "quantity", "special_request"],
    topicClassification: ["food_ordering", "menu_inquiry"],
    semanticRoleLabels: {
      "agent": "restaurant_assistant",
      "customer": "diner"
    },
    conversationFlow: ["greeting", "menu_inquiry", "order_placement", "confirmation"]
  },

  trainingFeedback: [
    {
      type: "response_improvement",
      suggestion: "Add more menu item suggestions",
      priority: "medium",
      implementationStatus: "pending"
    }
  ],

  context: {
    updates: [
      {
        timestamp: "2024-03-15T10:00:30Z",
        type: "order_item",
        value: "margherita_pizza"
      }
    ],
    retentionScore: 0.95,
    validPeriods: [
      {
        start: "2024-03-15T10:00:00Z",
        end: "2024-03-15T10:05:23Z"
      }
    ]
  }
};

export default function Results() {
  const [activeTab, setActiveTab] = useState('overview');
  const result = mockResult; // Replace with actual data fetching

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
                <p className="text-lg font-semibold gradient-text">{result.id}</p>
              </div>
              <div>
                <h3 className="text-sm text-white/70">Duration</h3>
                <p className="text-lg font-semibold gradient-text">{result.duration}</p>
              </div>
              <div>
                <h3 className="text-sm text-white/70">Status</h3>
                <p className="text-lg font-semibold gradient-text">{result.completionStatus}</p>
              </div>
              <div>
                <h3 className="text-sm text-white/70">Type</h3>
                <p className="text-lg font-semibold gradient-text">{result.conversationType}</p>
              </div>
            </div>
          </Card>

          {/* Main Content */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <QualityMetricsCard quality={result.quality} />
              <TechnicalMetricsCard technical={result.technical} />
              <TaskSpecificCard taskSpecific={result.taskSpecific} />
            </div>
          )}

          {activeTab === 'messages' && (
            <Card>
              <div className="space-y-4">
                {result.messages.map((message, index) => (
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
                  <MetricItem label="Average" value={`${result.technical.latencyStats.avg}ms`} />
                  <MetricItem label="Minimum" value={`${result.technical.latencyStats.min}ms`} />
                  <MetricItem label="Maximum" value={`${result.technical.latencyStats.max}ms`} />
                  <MetricItem label="95th Percentile" value={`${result.technical.latencyStats.p95}ms`} />
                </div>
              </Card>
              
              <Card>
                <h3 className="text-lg font-semibold mb-4 gradient-text">Token Usage</h3>
                <div className="grid grid-cols-2 gap-4">
                  <MetricItem label="Total" value={result.technical.tokenUsage.total} />
                  <MetricItem label="Per Message" value={result.technical.tokenUsage.perMessage} />
                  <MetricItem label="Efficiency" value={`${(result.technical.tokenUsage.efficiency * 100).toFixed(1)}%`} />
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold mb-4 gradient-text">Error Analysis</h3>
                <div className="space-y-2">
                  {Object.entries(result.technical.errorCounts.byType).map(([type, count]) => (
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
                  <MetricItem label="Memory Usage" value={`${result.technical.memoryUsage}MB`} />
                  <MetricItem label="Model Temperature" value={result.technical.modelTemperature} />
                  <MetricItem label="Avg Response Time" value={`${result.technical.avgResponseTime}ms`} />
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'quality' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(result.quality).map(([key, value]) => (
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
                  {Object.entries(result.semantic.intentClassification).map(([intent, score]) => (
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
                  {result.semantic.entityExtraction.map((entity, index) => (
                    <span key={index} className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm">
                      {entity}
                    </span>
                  ))}
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold mb-4 gradient-text">Topic Classification</h3>
                <div className="flex flex-wrap gap-2">
                  {result.semantic.topicClassification.map((topic, index) => (
                    <span key={index} className="px-3 py-1 rounded-full bg-secondary/20 text-secondary text-sm">
                      {topic}
                    </span>
                  ))}
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold mb-4 gradient-text">Conversation Flow</h3>
                <div className="space-y-2">
                  {result.semantic.conversationFlow.map((step, index) => (
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
                {result.errors.map((error, index) => (
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

function MetricItem({ label, value }) {
  return (
    <div>
      <div className="text-sm text-white/70">{label}</div>
      <div className="text-lg font-semibold gradient-text">{value}</div>
    </div>
  );
}

function QualityMetricsCard({ quality }) {
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

function TechnicalMetricsCard({ technical }) {
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

function TaskSpecificCard({ taskSpecific }) {
  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4 gradient-text">Task Performance</h3>
      <div className="space-y-4">
        <MetricItem label="Order Accuracy" value={`${(taskSpecific.orderAccuracy * 100).toFixed(1)}%`} />
        <MetricItem label="Clarifications" value={taskSpecific.requiredClarifications} />
        <MetricItem label="Completion Time" value={`${taskSpecific.completionTime}s`} />
        <MetricItem label="Menu Knowledge" value={`${(taskSpecific.menuKnowledge * 100).toFixed(1)}%`} />
      </div>
    </Card>
  );
} 