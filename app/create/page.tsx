'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '../components/Navigation';
import { database } from '../../lib/database';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import LoadingScreen from '../components/LoadingScreen';

interface TestConfig {
  basics: {
    name: string;
    simultaneous: number;
    duration: number;
    environment: 'production' | 'staging';
    twilio_number: string;
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

// Add interfaces for component props
interface ConfigSectionProps {
  title: string;
  children: React.ReactNode;
}

interface InputFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  as?: string;
}

interface SelectFieldProps {
  label: string;
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

interface MultiSelectProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (value: string[]) => void;
}

interface SliderProps {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}

const ConfigSection = ({ title, children }: ConfigSectionProps) => (
  <div className="bg-black/20 rounded-2xl border border-white/10 p-6 backdrop-blur-lg">
    <h3 className="text-xl font-semibold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
      {title}
    </h3>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

const InputField = ({ label, type = 'text', placeholder = '', ...props }: InputFieldProps) => (
  <div>
    <label className="block text-sm font-medium text-white mb-2">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full px-4 py-2 rounded-xl bg-black/40 border border-white/30 text-white placeholder-white/50 focus:border-white/60 focus:ring-1 focus:ring-white/60"
      {...props}
    />
  </div>
);

const SelectField = ({ label, options, ...props }: SelectFieldProps) => (
  <div>
    <label className="block text-sm font-medium text-white mb-2">{label}</label>
    <select
      className="w-full px-4 py-2 rounded-xl bg-black/40 border border-white/30 text-white focus:border-white/60 focus:ring-1 focus:ring-white/60"
      {...props}
    >
      {options.map(option => (
        <option key={option.value} value={option.value} className="text-white bg-black">{option.label}</option>
      ))}
    </select>
  </div>
);

const MultiSelect = ({ label, options, selected, onChange }: MultiSelectProps) => (
  <div>
    <label className="block text-sm font-medium text-white mb-2">{label}</label>
    <div className="flex flex-wrap gap-2">
      {options.map(option => (
        <button
          key={option}
          className={`px-3 py-1 rounded-lg text-sm transition-colors ${
            selected.includes(option)
              ? 'bg-primary/20 text-primary border border-primary/30'
              : 'bg-black/20 text-white border border-white/30 hover:border-white/60'
          }`}
          onClick={() => {
            if (selected.includes(option)) {
              onChange(selected.filter(s => s !== option));
            } else {
              onChange([...selected, option]);
            }
          }}
        >
          {option}
        </button>
      ))}
    </div>
  </div>
);

const Slider = ({ label, min, max, value, onChange }: SliderProps) => (
  <div>
    <label className="block text-sm font-medium text-white mb-2">
      {label} ({value})
    </label>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={e => onChange(Number(e.target.value))}
      className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
      style={{
        background: 'linear-gradient(to right, #F59E0B, #6366F1, #9333EA)',
        height: '4px',
        border: '1px solid white'
      }}
    />
  </div>
);

export default function CreateTest() {
  const { user } = useAuth();
  const router = useRouter();
  const [config, setConfig] = useState<TestConfig>({
    basics: {
      name: '',
      simultaneous: 1,
      duration: 2,
      environment: 'staging',
      twilio_number: ''
    },
    customer: {
      accents: ['American'],
      pace: ['normal'],
      noise: ['quiet'],
      interruption: 0,
      emotions: ['neutral']
    },
    conversation: {
      industry: '',
      complexity: 3,
      maxTurns: 10,
      responseThreshold: 2000,
      successCriteria: ''
    },
    network: {
      latency: 0,
      packetLoss: 0,
      bandwidth: 1000,
      stability: 'stable' as const
    },
    scenario: {
      template: '',
      edgeCaseFreq: 10,
      errorRate: 5,
      vocabulary: [],
      topics: []
    },
    quality: {
      minResponseTime: 500,
      completionRate: 95,
      maxErrorRate: 5,
      contextScore: 80,
      clarityThreshold: 90
    }
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validateConfig = () => {
    const errors: string[] = [];

    // Validate basics
    if (!config.basics.name) errors.push('Test name is required');
    if (!config.basics.twilio_number) errors.push('Twilio number is required');
    if (!config.basics.twilio_number.match(/^\+\d{10,15}$/)) errors.push('Invalid Twilio number format (should be like +1234567890)');
    if (config.basics.simultaneous < 1) errors.push('Must have at least 1 simultaneous conversation');
    if (config.basics.duration < 1) errors.push('Duration must be at least 1 minute');
    if (!config.basics.environment) errors.push('Environment must be selected');

    // Validate customer settings
    if (config.customer.accents.length === 0) errors.push('At least one accent type must be selected');
    if (config.customer.pace.length === 0) errors.push('At least one speaking pace must be selected');
    if (config.customer.noise.length === 0) errors.push('At least one background noise type must be selected');
    if (config.customer.emotions.length === 0) errors.push('At least one emotion type must be selected');

    // Validate conversation settings
    if (!config.conversation.industry) errors.push('Industry/Use Case is required');
    if (config.conversation.complexity < 1) errors.push('Complexity level must be set');
    if (config.conversation.maxTurns < 1) errors.push('Maximum turns must be set');
    if (config.conversation.responseThreshold < 100) errors.push('Response threshold must be at least 100ms');

    // Validate scenario settings
    if (!config.scenario.template) errors.push('Prompt template is required');
    if (config.scenario.edgeCaseFreq < 0) errors.push('Edge case frequency must be set');
    if (config.scenario.errorRate < 0) errors.push('Error injection rate must be set');

    return errors;
  };

  const handleStartTest = async () => {
    const errors = validateConfig();
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirmStart = async () => {
    if (confirmationText.toLowerCase() !== 'create test') {
      return;
    }

    setIsLoading(true);
    try {
      if (!user) {
        throw new Error('User must be logged in to create a test');
      }

      // Create test configuration
      const testConfig = await database.createTestConfig(config);
      
      // Create simulation
      const simulation = await database.createSimulation(testConfig.id);

      // Trigger the backend to start running calls
      await fetch('https://swarm-backend-new.onrender.com/execute_large_calls?to_number=+18449514228&num_calls=3', {
        method: 'POST',
      });

      // Show success message
      setShowSuccess(true);
      
      // Wait for 2 seconds before redirecting
      setTimeout(() => {
        router.push(`/results?simulation=${simulation.id}`);
      }, 2000);

    } catch (error) {
      console.error('Error in handleConfirmStart:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setValidationErrors([`Failed to start test: ${errorMessage}`]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black relative overflow-x-hidden pb-20">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-secondary/10 to-transparent opacity-30" />
        <div className="rhombus-pattern" />
      </div>

      <Navigation />

      <div className="pt-32 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Create New Test
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ConfigSection title="Test Basics">
                <InputField
                  label="Test Name/ID"
                  value={config.basics.name}
                  placeholder="e.g., Restaurant Order Test #123"
                  onChange={e => setConfig({
                    ...config,
                    basics: { ...config.basics, name: e.target.value }
                  })}
                />
                <InputField
                  label="Twilio Number"
                  value={config.basics.twilio_number}
                  placeholder="e.g., +1234567890"
                  onChange={e => setConfig({
                    ...config,
                    basics: { ...config.basics, twilio_number: e.target.value }
                  })}
                />
                <Slider
                  label="Simultaneous Conversations"
                  min={1}
                  max={10}
                  value={config.basics.simultaneous}
                  onChange={value => setConfig({
                    ...config,
                    basics: { ...config.basics, simultaneous: value }
                  })}
                />
                <InputField
                  label="Duration (minutes)"
                  type="number"
                  placeholder="e.g., 60"
                  value={config.basics.duration}
                  onChange={e => setConfig({
                    ...config,
                    basics: { ...config.basics, duration: Number(e.target.value) }
                  })}
                />
                <SelectField
                  label="Environment"
                  options={[
                    { value: 'staging', label: 'Staging' },
                    { value: 'production', label: 'Production' }
                  ]}
                  value={config.basics.environment}
                  onChange={e => setConfig({
                    ...config,
                    basics: { ...config.basics, environment: e.target.value as 'staging' | 'production' }
                  })}
                />
              </ConfigSection>

              <ConfigSection title="Customer Simulation">
                <MultiSelect
                  label="Accent Types"
                  options={[
                    'American', 'British', 'Australian', 'Indian', 'Spanish',
                    'French', 'German', 'Italian', 'Chinese', 'Japanese',
                    'Korean', 'Russian', 'Arabic', 'Brazilian', 'Mexican'
                  ]}
                  selected={config.customer.accents}
                  onChange={value => setConfig({
                    ...config,
                    customer: { ...config.customer, accents: value }
                  })}
                />
                <MultiSelect
                  label="Speaking Pace"
                  options={['very slow', 'slow', 'normal', 'fast', 'very fast']}
                  selected={config.customer.pace}
                  onChange={value => setConfig({
                    ...config,
                    customer: { ...config.customer, pace: value }
                  })}
                />
                <MultiSelect
                  label="Background Noise"
                  options={[
                    'quiet', 'moderate', 'loud',
                    'restaurant', 'street', 'office',
                    'cafe', 'train', 'airport',
                    'home', 'car', 'crowd'
                  ]}
                  selected={config.customer.noise}
                  onChange={value => setConfig({
                    ...config,
                    customer: { ...config.customer, noise: value }
                  })}
                />
                <Slider
                  label="Interruption Frequency (%)"
                  min={0}
                  max={100}
                  value={config.customer.interruption}
                  onChange={value => setConfig({
                    ...config,
                    customer: { ...config.customer, interruption: value }
                  })}
                />
              </ConfigSection>

              <ConfigSection title="Conversation Parameters">
                <InputField
                  label="Industry/Use Case"
                  placeholder="e.g., Restaurant, Healthcare, Retail"
                  value={config.conversation.industry}
                  onChange={e => setConfig({
                    ...config,
                    conversation: { ...config.conversation, industry: e.target.value }
                  })}
                />
                <Slider
                  label="Complexity Level"
                  min={1}
                  max={5}
                  value={config.conversation.complexity}
                  onChange={value => setConfig({
                    ...config,
                    conversation: { ...config.conversation, complexity: value }
                  })}
                />
                <InputField
                  label="Maximum Turns"
                  type="number"
                  placeholder="e.g., 10"
                  value={config.conversation.maxTurns}
                  onChange={e => setConfig({
                    ...config,
                    conversation: { ...config.conversation, maxTurns: Number(e.target.value) }
                  })}
                />
              </ConfigSection>
              
              <ConfigSection title="Network Conditions">
                <Slider
                  label="Latency (ms)"
                  min={0}
                  max={500}
                  value={config.network.latency}
                  onChange={value => setConfig({
                    ...config,
                    network: { ...config.network, latency: value }
                  })}
                />
                <Slider
                  label="Packet Loss (%)"
                  min={0}
                  max={10}
                  value={config.network.packetLoss}
                  onChange={value => setConfig({
                    ...config,
                    network: { ...config.network, packetLoss: value }
                  })}
                />
                <InputField
                  label="Bandwidth (kbps)"
                  type="number"
                  value={config.network.bandwidth}
                  onChange={e => setConfig({
                    ...config,
                    network: { ...config.network, bandwidth: Number(e.target.value) }
                  })}
                />
                <SelectField
                  label="Connection Stability"
                  options={[
                    { value: 'stable', label: 'Stable' },
                    { value: 'variable', label: 'Variable' },
                    { value: 'poor', label: 'Poor' }
                  ]}
                  value={config.network.stability}
                  onChange={e => setConfig({
                    ...config,
                    network: { ...config.network, stability: e.target.value as 'stable' | 'variable' | 'poor' }
                  })}
                />
              </ConfigSection>

              <ConfigSection title="Quality Thresholds">
                <InputField
                  label="Minimum Response Time (ms)"
                  type="number"
                  value={config.quality.minResponseTime}
                  onChange={e => setConfig({
                    ...config,
                    quality: { ...config.quality, minResponseTime: Number(e.target.value) }
                  })}
                />
                <Slider
                  label="Required Completion Rate (%)"
                  min={0}
                  max={100}
                  value={config.quality.completionRate}
                  onChange={value => setConfig({
                    ...config,
                    quality: { ...config.quality, completionRate: value }
                  })}
                />
                <Slider
                  label="Maximum Error Rate (%)"
                  min={0}
                  max={100}
                  value={config.quality.maxErrorRate}
                  onChange={value => setConfig({
                    ...config,
                    quality: { ...config.quality, maxErrorRate: value }
                  })}
                />
                <Slider
                  label="Context Retention Score (%)"
                  min={0}
                  max={100}
                  value={config.quality.contextScore}
                  onChange={value => setConfig({
                    ...config,
                    quality: { ...config.quality, contextScore: value }
                  })}
                />
              </ConfigSection>

              <ConfigSection title="Scenario Settings">
                <InputField
                  label="Prompt for AI Testing"
                  as="textarea"
                  value={config.scenario.template}
                  onChange={e => setConfig({
                    ...config,
                    scenario: { ...config.scenario, template: e.target.value }
                  })}
                />
                <Slider
                  label="Edge Case Frequency (%)"
                  min={0}
                  max={100}
                  value={config.scenario.edgeCaseFreq}
                  onChange={value => setConfig({
                    ...config,
                    scenario: { ...config.scenario, edgeCaseFreq: value }
                  })}
                />
                <Slider
                  label="Error Injection Rate (%)"
                  min={0}
                  max={100}
                  value={config.scenario.errorRate}
                  onChange={value => setConfig({
                    ...config,
                    scenario: { ...config.scenario, errorRate: value }
                  })}
                />
              </ConfigSection>
            </div>

            {/* Create Test Button */}
            <div className="mt-8 flex justify-center">
              <motion.button
                onClick={handleStartTest}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary via-secondary to-accent text-black font-semibold text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Create Test
              </motion.button>
            </div>

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <div className="fixed top-24 right-4 z-50">
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 max-w-md">
                  <h4 className="text-red-400 font-medium mb-2">Please fix the following errors:</h4>
                  <ul className="list-disc list-inside text-sm text-red-300">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Confirmation Dialog */}
            {showConfirmation && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="bg-surface-light p-6 rounded-2xl max-w-md w-full mx-4">
                  <h3 className="text-xl font-semibold mb-4 gradient-text">Confirm Test Creation</h3>
                  <p className="text-white/70 mb-4">
                    Please type &quot;Create Test&quot; to confirm you want to create the test with the current configuration. This action may be computationally expensive.
                  </p>
                  <input
                    type="text"
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    placeholder="Type 'Create Test'"
                    className="w-full px-4 py-2 rounded-xl bg-black/40 border border-white/30 text-white mb-4"
                  />
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => {
                        setShowConfirmation(false);
                        setConfirmationText('');
                      }}
                      className="px-4 py-2 rounded-xl bg-white/5 text-white/70 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmStart}
                      disabled={confirmationText.toLowerCase() !== 'create test'}
                      className={`px-4 py-2 rounded-xl ${
                        confirmationText.toLowerCase() === 'create test'
                          ? 'bg-gradient-to-r from-primary via-secondary to-accent text-black'
                          : 'bg-white/5 text-white/30'
                      }`}
                    >
                      Create Test
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isLoading && <LoadingScreen />}

            {showSuccess && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
                <motion.div
                  className="bg-surface-light p-8 rounded-2xl max-w-md w-full mx-4"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", duration: 0.5 }}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 gradient-text">Test Created Successfully!</h3>
                    <p className="text-white/70 mb-4">
                      Your test has been initiated. Redirecting you to the results page...
                    </p>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
} 