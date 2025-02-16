import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { TestConfig } from '../types/test-config';

const supabase = createClientComponentClient();

export const database = {
  // Test Configurations
  async createTestConfig(config: TestConfig) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User must be logged in to create a test configuration');

    const { data, error } = await supabase
      .from('test_configurations')
      .insert({
        name: config.basics.name,
        simultaneous_conversations: config.basics.simultaneous,
        duration_minutes: config.basics.duration,
        environment: config.basics.environment,
        twilio_number: config.basics.twilio_number,
        accent_types: config.customer.accents,
        speaking_pace: config.customer.pace,
        background_noise: config.customer.noise,
        interruption_frequency: config.customer.interruption,
        emotion_types: config.customer.emotions,
        industry: config.conversation.industry,
        complexity_level: config.conversation.complexity,
        max_turns: config.conversation.maxTurns,
        response_threshold_ms: config.conversation.responseThreshold,
        latency_ms: config.network.latency,
        packet_loss_percentage: config.network.packetLoss,
        bandwidth_kbps: config.network.bandwidth,
        connection_stability: config.network.stability,
        min_response_time_ms: config.quality.minResponseTime,
        required_completion_rate: config.quality.completionRate,
        max_error_rate: config.quality.maxErrorRate,
        context_score_threshold: config.quality.contextScore,
        prompt_template: config.scenario.template,
        edge_case_frequency: config.scenario.edgeCaseFreq,
        error_injection_rate: config.scenario.errorRate,
        user_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getTestConfigs() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User must be logged in to get test configurations');

    const { data, error } = await supabase
      .from('test_configurations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Test Simulations
  async createSimulation(configId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User must be logged in to create a simulation');

    const { data, error } = await supabase
      .from('test_simulations')
      .insert({
        config_id: configId,
        status: 'starting',
        total_conversations: 0,
        successful_conversations: 0,
        user_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateSimulationStatus(id: string, status: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User must be logged in to update simulation status');

    const { error } = await supabase
      .from('test_simulations')
      .update({ status })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  },

  // Dashboard Metrics
  async getDashboardMetrics() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User must be logged in to get dashboard metrics');

    const { data: simulations, error: simulationsError } = await supabase
      .from('test_simulations')
      .select(`
        *,
        test_configurations (*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (simulationsError) throw simulationsError;

    const { data: metrics, error: metricsError } = await supabase
      .from('technical_metrics')
      .select(`
        *,
        voice_conversations!inner (*)
      `)
      .eq('voice_conversations.user_id', user.id)
      .order('created_at', { ascending: false });

    if (metricsError) throw metricsError;

    return {
      simulations,
      metrics
    };
  },

  // Results
  async getTestResults(simulationId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User must be logged in to get test results');

    if (simulationId === 'all') {
      const { data, error } = await supabase
        .from('voice_conversations')
        .select(`
          *,
          quality_metrics (*),
          technical_metrics (*),
          analysis_results (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data || [];
    }

    const { data, error } = await supabase
      .from('voice_conversations')
      .select(`
        *,
        quality_metrics (*),
        technical_metrics (*),
        analysis_results (*)
      `)
      .eq('simulation_id', simulationId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Voice Conversations
  async createVoiceConversation(simulationId: string, data: Partial<VoiceConversation>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User must be logged in to create a voice conversation');

    const { data: conversation, error } = await supabase
      .from('voice_conversations')
      .insert({
        ...data,
        simulation_id: simulationId,
        user_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return conversation;
  },

  // Quality Metrics
  async createQualityMetrics(conversationId: string, metrics: Partial<ConversationQualityMetrics>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User must be logged in to create quality metrics');

    // Verify the conversation belongs to the user
    const { data: conversation } = await supabase
      .from('voice_conversations')
      .select('id')
      .eq('id', conversationId)
      .eq('user_id', user.id)
      .single();

    if (!conversation) throw new Error('Conversation not found or unauthorized');

    const { data, error } = await supabase
      .from('quality_metrics')
      .insert({
        conversation_id: conversationId,
        ...metrics
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Technical Metrics
  async createTechnicalMetrics(conversationId: string, metrics: Partial<TechnicalPerformanceMetrics>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User must be logged in to create technical metrics');

    // Verify the conversation belongs to the user
    const { data: conversation } = await supabase
      .from('voice_conversations')
      .select('id')
      .eq('id', conversationId)
      .eq('user_id', user.id)
      .single();

    if (!conversation) throw new Error('Conversation not found or unauthorized');

    const { data, error } = await supabase
      .from('technical_metrics')
      .insert({
        conversation_id: conversationId,
        ...metrics
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Semantic Analysis
  async createSemanticAnalysis(conversationId: string, analysis: Partial<SemanticAnalysisResults>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User must be logged in to create semantic analysis');

    // Verify the conversation belongs to the user
    const { data: conversation } = await supabase
      .from('voice_conversations')
      .select('id')
      .eq('id', conversationId)
      .eq('user_id', user.id)
      .single();

    if (!conversation) throw new Error('Conversation not found or unauthorized');

    const { data, error } = await supabase
      .from('analysis_results')
      .insert({
        conversation_id: conversationId,
        ...analysis
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}; 