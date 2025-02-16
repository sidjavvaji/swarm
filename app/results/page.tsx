'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navigation from '../components/Navigation';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingScreen from '../components/LoadingScreen';
import Card from '../components/Card';
import { useRouter } from 'next/navigation';

interface QualityMetrics {
  coherence_score: number;
  task_completion_score: number;
  context_retention_score: number;
  natural_language_score: number;
  appropriateness_score: number;
  engagement_score: number;
  error_recovery_score: number;
  overall_quality_score: number;
  order_accuracy: number;
  required_clarifications: number;
  completion_time: number;
  menu_knowledge: number;
  special_requests: number;
  upsell_attempts: number;
}

interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

interface IntentClassification {
  intent: string;
  confidence: number;
  entities?: Record<string, unknown>;
}

interface EntityExtraction {
  entity: string;
  value: string;
  confidence: number;
}

interface SemanticRoleLabel {
  role: string;
  text: string;
  confidence: number;
}

interface TechnicalMetrics {
  avg_latency_ms: number;
  min_latency_ms: number;
  max_latency_ms: number;
  p95_latency_ms: number;
  total_tokens: number;
  tokens_per_message: number;
  token_efficiency: number;
  memory_usage_mb: number;
  model_temperature: number;
  conversation_type: string;
  sentiment_score: number;
  message_type: string;
  api_errors: ApiError[];
}

interface AnalysisResults {
  intent_classification: IntentClassification[];
  entity_extraction: EntityExtraction[];
  topic_classification: string[];
  semantic_role_labels: SemanticRoleLabel[];
  conversation_flow: string[];
}

interface Conversation {
  id: string;
  call_sid: string;
  status: string;
  created_at: string;
}

interface QueryResponse {
  id: string;
  call_sid: string;
  created_at: string;
  status: string;
  transcript: Array<{
    role: string;
    content: string;
    timestamp: string;
  }>;
  quality_metrics: QualityMetrics[];
  technical_metrics: TechnicalMetrics[];
  analysis_results: AnalysisResults[];
}

const formatPercent = (value: number) => {
  // All values from DB are in decimal form (0.XX), so multiply by 100 to get percentage
  return `${(value * 100).toFixed(2)}%`;
};

const formatDecimal = (value: number) => {
  // For non-percentage decimals, show 2 decimal places
  return value.toFixed(2);
};

const TabButton = ({ active, onClick, children, icon }: { 
  active: boolean; 
  onClick: () => void; 
  children: React.ReactNode;
  icon: string;
}) => (
  <motion.button
    onClick={onClick}
    className={`px-6 py-3 rounded-xl text-sm font-medium transition-all relative flex items-center gap-2 ${
      active ? 'text-white' : 'text-white/80 hover:text-white'
    }`}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <span className="text-lg">{icon}</span>
    {children}
    {active && (
      <motion.div
        layoutId="activeTab"
        className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-xl -z-10 border border-white/10"
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
    )}
  </motion.button>
);

const MetricCard = ({ title, value, icon, description, trend, trendValue, isPercentage = false }: { 
  title: string; 
  value: string | number; 
  icon: string;
    description: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  isPercentage?: boolean;
}) => (
  <Card hover={true}>
    <div className="h-full flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-white/90 mb-1">{title}</h3>
          <p className="text-3xl font-semibold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            {typeof value === 'number' 
              ? (isPercentage ? formatPercent(value) : formatDecimal(value))
              : value}
          </p>
          {trend && trendValue && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              trend === 'up' ? 'text-green-400' : 
              trend === 'down' ? 'text-red-400' : 
              'text-white/60'
            }`}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
            </div>
          )}
        </div>
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 flex items-center justify-center">
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
      <p className="text-sm text-white/80 mt-auto">{description}</p>
    </div>
  </Card>
);

const MetricSection = ({ title, subtitle, children }: { 
  title: string; 
  subtitle?: string;
  children: React.ReactNode;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="mb-12 w-full"
  >
    <div className="mb-6">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
        {title}
      </h2>
      {subtitle && (
        <p className="text-white/80 mt-2">{subtitle}</p>
      )}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
      {children}
    </div>
  </motion.div>
);

const AnalysisCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Card hover={true}>
    <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
      {title}
    </h3>
    <div className="text-white">
      {children}
    </div>
  </Card>
);

type Tab = 'overview' | 'quality' | 'technical' | 'conversation' | 'errors' | 'business' | 'script';

export default function ResultsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [data, setData] = useState<QueryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClientComponentClient();

  // Fetch all conversations
  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }

    async function fetchConversations() {
      try {
        const { data: conversationsData, error: conversationsError } = await supabase
          .from('voice_conversations')
          .select('id, call_sid, created_at, status')
          .order('created_at', { ascending: false });

        if (conversationsError) throw conversationsError;
        setConversations(conversationsData || []);
        
        // Set the first conversation as selected by default
        if (conversationsData && conversationsData.length > 0) {
          setSelectedConversation(conversationsData[0].id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching conversations');
      }
    }

    fetchConversations();
  }, [user, supabase, router]);

  // Fetch metrics for selected conversation
  useEffect(() => {
    if (!selectedConversation || !user) return;

    async function fetchMetrics() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('voice_conversations')
          .select(`
            id,
            call_sid,
            created_at,
            status,
            transcript,
            quality_metrics (
              coherence_score,
              task_completion_score,
              context_retention_score,
              natural_language_score,
              appropriateness_score,
              engagement_score,
              error_recovery_score,
              overall_quality_score,
              order_accuracy,
              required_clarifications,
              completion_time,
              menu_knowledge,
              special_requests,
              upsell_attempts
            ),
            technical_metrics (
              avg_latency_ms,
              min_latency_ms,
              max_latency_ms,
              p95_latency_ms,
              total_tokens,
              tokens_per_message,
              token_efficiency,
              memory_usage_mb,
              model_temperature,
              conversation_type,
              sentiment_score,
              message_type,
              api_errors
            ),
            analysis_results (
              intent_classification,
              entity_extraction,
              topic_classification,
              semantic_role_labels,
              conversation_flow
            )
          `)
          .eq('id', selectedConversation)
          .single();

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }
        
        console.log('Fetched data:', data);
        
        // Ensure we have all required data
        if (!data.quality_metrics || !data.technical_metrics || !data.analysis_results) {
          throw new Error('Missing required metrics data');
        }

        setData(data as QueryResponse);
      } catch (err) {
        console.error('Error details:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while fetching metrics');
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
  }, [selectedConversation, user, supabase]);

  if (loading) return (
    <main className="min-h-screen bg-black">
      <Navigation />
      <div className="fixed inset-0 mt-20 flex items-center justify-center">
        <LoadingScreen />
      </div>
    </main>
  );

  if (error) return (
    <main className="min-h-screen bg-black">
      <Navigation />
      <div className="pt-32 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/20 rounded-xl p-6"
          >
            <p className="text-red-400">{error}</p>
          </motion.div>
            </div>
          </div>
    </main>
  );

  const renderContent = () => {
    if (!data || !data.quality_metrics[0] || !data.technical_metrics[0] || !data.analysis_results[0]) return null;

    const quality = data.quality_metrics[0];
    const technical = data.technical_metrics[0];
    const analysis = data.analysis_results[0];

    switch (activeTab) {
      case 'overview':
        return (
          <>
            <MetricSection 
              title="Key Performance Indicators"
              subtitle="Essential metrics showing overall system performance"
            >
              <MetricCard
                title="Overall Quality"
                value={quality.overall_quality_score}
                icon="⭐"
                description="Overall quality score of the conversation"
                trend="up"
                isPercentage={true}
              />
              <MetricCard
                title="Order Accuracy"
                value={quality.order_accuracy}
                icon="🎯"
                description="Percentage of orders processed correctly"
                trend="up"
                isPercentage={true}
              />
              <MetricCard
                title="Average Latency"
                value={`${technical.avg_latency_ms} ms`}
                icon="⚡"
                description="Average response time"
                trend="down"
              />
            </MetricSection>

            <MetricSection 
              title="Quick Insights"
              subtitle="Key metrics at a glance"
            >
              <MetricCard
                title="Sentiment Score"
                value={technical.sentiment_score}
                icon="😊"
                description="Overall conversation sentiment"
                isPercentage={true}
              />
              <MetricCard
                title="Menu Knowledge"
                value={quality.menu_knowledge}
                icon="📖"
                description="AI's understanding of menu items"
                isPercentage={true}
              />
              <MetricCard
                title="Error Recovery"
                value={quality.error_recovery_score}
                icon="🔄"
                description="Effectiveness in recovering from errors"
                isPercentage={true}
              />
            </MetricSection>
          </>
        );

      case 'quality':
        return (
          <>
            <MetricSection title="Conversation Quality">
              <MetricCard
                title="Coherence"
                value={quality.coherence_score}
                icon="🔄"
                description="Measure of conversation flow and consistency"
                isPercentage={true}
              />
              <MetricCard
                title="Task Completion"
                value={quality.task_completion_score}
                icon="✅"
                description="Success rate in completing assigned tasks"
                isPercentage={true}
              />
              <MetricCard
                title="Context Retention"
                value={quality.context_retention_score}
                icon="🧠"
                description="Ability to maintain context throughout conversation"
                isPercentage={true}
              />
            </MetricSection>
            <MetricSection title="Interaction Quality">
              <MetricCard
                title="Natural Language"
                value={quality.natural_language_score}
                icon="💬"
                description="Natural language processing effectiveness"
                isPercentage={true}
              />
              <MetricCard
                title="Appropriateness"
                value={quality.appropriateness_score}
                icon="👌"
                description="Appropriateness of responses"
                isPercentage={true}
              />
              <MetricCard
                title="Engagement"
                value={quality.engagement_score}
                icon="🤝"
                description="Level of user engagement maintained"
                isPercentage={true}
              />
            </MetricSection>
          </>
        );

      case 'technical':
        return (
          <>
            <MetricSection title="Performance Metrics">
              <MetricCard
                title="Average Latency"
                value={`${technical.avg_latency_ms} ms`}
                icon="⚡"
                description="Average response time"
              />
              <MetricCard
                title="95th Percentile Latency"
                value={`${technical.p95_latency_ms} ms`}
                icon="📊"
                description="95th percentile of response times"
              />
              <MetricCard
                title="Memory Usage"
                value={`${technical.memory_usage_mb} MB`}
                icon="💾"
                description="Memory consumption"
              />
            </MetricSection>
            <MetricSection title="Token Usage">
              <MetricCard
                title="Total Tokens"
                value={technical.total_tokens}
                icon="🔢"
                description="Total tokens used in conversation"
              />
              <MetricCard
                title="Tokens per Message"
                value={technical.tokens_per_message}
                icon="📝"
                description="Average tokens used per message"
              />
              <MetricCard
                title="Token Efficiency"
                value={technical.token_efficiency}
                icon="🎯"
                description="Efficiency of token usage"
                isPercentage={true}
              />
            </MetricSection>
          </>
        );

      case 'conversation':
        return (
          <>
            <MetricSection title="Conversation Analysis">
              <Card>
                <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Topic Classification
                </h3>
                <div className="space-y-2">
                  {analysis.topic_classification.map((topic, index) => (
                    <div key={index} className="text-white/70 text-sm">
                      {topic}
                    </div>
                  ))}
                </div>
              </Card>
              <Card>
                <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Conversation Flow
                  </h3>
                <div className="space-y-2">
                  {analysis.conversation_flow.map((flow, index) => (
                    <div key={index} className="text-white/70 text-sm">
                      {flow}
                    </div>
                  ))}
                </div>
              </Card>
              <Card>
                <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Intent Classification
                </h3>
                <pre className="text-white/70 text-sm overflow-auto">
                  {JSON.stringify(analysis.intent_classification, null, 2)}
                </pre>
              </Card>
            </MetricSection>
          </>
        );

      case 'errors':
        return (
          <>
            <MetricSection title="Error Metrics">
              <MetricCard
                title="Error Recovery"
                value={quality.error_recovery_score}
                icon="🔄"
                description="Effectiveness in recovering from errors"
                isPercentage={true}
              />
              <MetricCard
                title="Required Clarifications"
                value={quality.required_clarifications}
                icon="❓"
                description="Number of clarifications needed"
              />
              <Card>
                <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  API Errors
                </h3>
                <pre className="text-white/70 text-sm overflow-auto">
                  {JSON.stringify(technical.api_errors, null, 2)}
                </pre>
              </Card>
            </MetricSection>
          </>
        );

      case 'business':
        return (
          <>
            <MetricSection 
              title="Business Impact Metrics"
              subtitle="Metrics showing direct business value"
            >
              <MetricCard
                title="Upsell Success"
                value={quality.upsell_attempts}
                icon="📈"
                description="Number of successful upsell attempts"
              />
              <MetricCard
                title="Special Requests"
                value={quality.special_requests}
                icon="🎯"
                description="Successfully handled special requests"
              />
              <MetricCard
                title="Completion Time"
                value={`${quality.completion_time}s`}
                icon="⏱️"
                description="Average order completion time"
              />
            </MetricSection>
          </>
        );

      case 'script':
        return (
          <>
            <MetricSection 
              title="Conversation Script"
              subtitle="Raw transcript data"
            >
              <div className="col-span-3">
              <Card>
                  <pre className="text-white/90 whitespace-pre-wrap overflow-auto">
                    {JSON.stringify(data.transcript, null, 2)}
                  </pre>
                </Card>
              </div>
            </MetricSection>
          </>
        );
    }
  };

  return (
    <main className="min-h-screen bg-black">
      <Navigation />
      
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0"
             style={{ 
               background: 'radial-gradient(circle at top center, rgba(245, 158, 11, 0.2) 0%, rgba(99, 102, 241, 0.15) 30%, rgba(147, 51, 234, 0.1) 60%, transparent 100%)',
               opacity: 0.5
             }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/90 to-black" />
                    </div>

      <div className="pt-32 px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Test Results
            </h1>
            <p className="text-white text-lg mb-8">
              Comprehensive analysis of your voice AI performance metrics
            </p>

            {/* Conversation Selector */}
            {conversations.length > 0 && (
              <div className="mb-8">
                <label className="block text-sm font-medium text-white mb-2">
                  Select Conversation
                </label>
                <select
                  value={selectedConversation || ''}
                  onChange={(e) => setSelectedConversation(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-black/40 border border-white/30 text-white focus:border-white/60 focus:ring-1 focus:ring-white/60"
                >
                  {conversations.map((conv) => (
                    <option key={conv.id} value={conv.id} className="bg-black">
                      {`Call ${conv.call_sid} (${new Date(conv.created_at).toLocaleString()}) - ${conv.status}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Enhanced Navigation Tabs */}
            <div className="flex flex-wrap gap-2 p-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon="📊">
                Overview
              </TabButton>
              <TabButton active={activeTab === 'quality'} onClick={() => setActiveTab('quality')} icon="⭐">
                Quality Analytics
              </TabButton>
              <TabButton active={activeTab === 'technical'} onClick={() => setActiveTab('technical')} icon="⚡">
                Technical Performance
              </TabButton>
              <TabButton active={activeTab === 'conversation'} onClick={() => setActiveTab('conversation')} icon="💬">
                Conversation Analysis
              </TabButton>
              <TabButton active={activeTab === 'errors'} onClick={() => setActiveTab('errors')} icon="🚨">
                Error Analytics
              </TabButton>
              <TabButton active={activeTab === 'business'} onClick={() => setActiveTab('business')} icon="💼">
                Business Impact
              </TabButton>
              <TabButton active={activeTab === 'script'} onClick={() => setActiveTab('script')} icon="📝">
                Conversation Script
              </TabButton>
                      </div>
          </motion.div>

          {/* Enhanced Content */}
          <AnimatePresence mode="wait">
            {data && renderContent()}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}


