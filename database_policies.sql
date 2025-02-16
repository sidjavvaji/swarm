-- Enable Row Level Security
ALTER TABLE test_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE technical_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;

-- Create policies for test_configurations
CREATE POLICY "Users can view their own test configurations"
  ON test_configurations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own test configurations"
  ON test_configurations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policies for test_simulations
CREATE POLICY "Users can view their own test simulations"
  ON test_simulations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own test simulations"
  ON test_simulations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own test simulations"
  ON test_simulations FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policies for voice_conversations
CREATE POLICY "Users can view their own voice conversations"
  ON voice_conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own voice conversations"
  ON voice_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policies for quality_metrics
CREATE POLICY "Users can view quality metrics for their conversations"
  ON quality_metrics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM voice_conversations
      WHERE voice_conversations.id = quality_metrics.conversation_id
      AND voice_conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create quality metrics for their conversations"
  ON quality_metrics FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM voice_conversations
      WHERE voice_conversations.id = conversation_id
      AND voice_conversations.user_id = auth.uid()
    )
  );

-- Create policies for technical_metrics
CREATE POLICY "Users can view technical metrics for their conversations"
  ON technical_metrics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM voice_conversations
      WHERE voice_conversations.id = technical_metrics.conversation_id
      AND voice_conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create technical metrics for their conversations"
  ON technical_metrics FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM voice_conversations
      WHERE voice_conversations.id = conversation_id
      AND voice_conversations.user_id = auth.uid()
    )
  );

-- Create policies for analysis_results
CREATE POLICY "Users can view analysis results for their conversations"
  ON analysis_results FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM voice_conversations
      WHERE voice_conversations.id = analysis_results.conversation_id
      AND voice_conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create analysis results for their conversations"
  ON analysis_results FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM voice_conversations
      WHERE voice_conversations.id = conversation_id
      AND voice_conversations.user_id = auth.uid()
    )
  ); 