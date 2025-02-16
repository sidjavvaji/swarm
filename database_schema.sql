-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Voice Conversations table (base table)
CREATE TABLE voice_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    simulation_id TEXT NOT NULL,
    call_sid TEXT NOT NULL,
    phone_number TEXT,
    status TEXT NOT NULL,
    duration INTEGER,
    transcript JSONB,
    message_timestamps JSONB,
    token_counts JSONB,
    response_times JSONB,
    error_details JSONB,
    conversation_metrics JSONB,
    error_severity TEXT,
    recovery_attempt TEXT,
    recovery_success BOOLEAN,
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Test Configurations table
CREATE TABLE test_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    simultaneous_conversations INTEGER NOT NULL,
    duration_minutes INTEGER NOT NULL,
    environment TEXT NOT NULL,
    accent_types TEXT[] NOT NULL,
    speaking_pace TEXT[] NOT NULL,
    background_noise TEXT[] NOT NULL,
    interruption_frequency INTEGER NOT NULL,
    emotion_types TEXT[] NOT NULL,
    industry TEXT NOT NULL,
    complexity_level INTEGER NOT NULL,
    max_turns INTEGER NOT NULL,
    response_threshold_ms INTEGER NOT NULL,
    success_criteria TEXT,
    latency_ms INTEGER,
    packet_loss_percentage DECIMAL,
    bandwidth_kbps INTEGER,
    connection_stability TEXT,
    min_response_time_ms INTEGER,
    required_completion_rate DECIMAL,
    max_error_rate DECIMAL,
    context_score_threshold DECIMAL,
    clarity_threshold DECIMAL,
    edge_case_frequency DECIMAL,
    error_injection_rate DECIMAL,
    vocabulary TEXT[],
    topics TEXT[],
    prompt_template TEXT NOT NULL,
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Test Simulations table
CREATE TABLE test_simulations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_id UUID REFERENCES test_configurations(id),
    status TEXT NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    total_conversations INTEGER NOT NULL DEFAULT 0,
    successful_conversations INTEGER NOT NULL DEFAULT 0,
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Quality Metrics table
CREATE TABLE quality_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES voice_conversations(id),
    coherence_score DECIMAL,
    task_completion_score DECIMAL,
    context_retention_score DECIMAL,
    natural_language_score DECIMAL,
    appropriateness_score DECIMAL,
    engagement_score DECIMAL,
    error_recovery_score DECIMAL,
    overall_quality_score DECIMAL,
    order_accuracy DECIMAL,
    required_clarifications INTEGER,
    completion_time INTEGER,
    menu_knowledge DECIMAL,
    special_requests INTEGER,
    upsell_attempts INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Technical Metrics table
CREATE TABLE technical_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES voice_conversations(id),
    avg_latency_ms INTEGER,
    min_latency_ms INTEGER,
    max_latency_ms INTEGER,
    p95_latency_ms INTEGER,
    total_tokens INTEGER,
    tokens_per_message DECIMAL,
    token_efficiency DECIMAL,
    memory_usage_mb INTEGER,
    model_temperature DECIMAL DEFAULT 0.7,
    conversation_type TEXT DEFAULT 'Restaurant Order',
    sentiment_score DECIMAL,
    message_type TEXT,
    api_errors JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Analysis Results table
CREATE TABLE analysis_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES voice_conversations(id),
    intent_classification JSONB,
    entity_extraction JSONB,
    topic_classification TEXT[],
    semantic_role_labels JSONB,
    conversation_flow TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_voice_conversations_simulation ON voice_conversations(simulation_id);
CREATE INDEX idx_voice_conversations_status ON voice_conversations(status);
CREATE INDEX idx_voice_conversations_created ON voice_conversations(created_at);
CREATE INDEX idx_simulations_config ON test_simulations(config_id);
CREATE INDEX idx_simulations_status ON test_simulations(status);
CREATE INDEX idx_quality_metrics_conversation ON quality_metrics(conversation_id);
CREATE INDEX idx_technical_metrics_conversation ON technical_metrics(conversation_id);
CREATE INDEX idx_analysis_results_conversation ON analysis_results(conversation_id);

-- Create function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_voice_conversations_updated_at
    BEFORE UPDATE ON voice_conversations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_configurations_updated_at
    BEFORE UPDATE ON test_configurations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_simulations_updated_at
    BEFORE UPDATE ON test_simulations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 