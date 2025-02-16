'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '../components/Navigation';
import HoneycombPattern from '../components/HoneycombPattern';

interface TestConfig {
  basics: {
    name: string;
    simultaneous: number;
    duration: number;
    environment: 'production' | 'staging';
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
    stability: string;
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
  const [config, setConfig] = useState<TestConfig>({
    basics: {
      name: '',
      simultaneous: 100,
      duration: 60,
      environment: 'staging'
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
      stability: 'stable'
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

  const handleStartTest = () => {
    console.log('Starting test with config:', config);
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
                <Slider
                  label="Simultaneous Conversations"
                  min={100}
                  max={1000}
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
                <InputField
                  label="Response Time Threshold (ms)"
                  type="number"
                  placeholder="e.g., 2000"
                  value={config.conversation.responseThreshold}
                  onChange={e => setConfig({
                    ...config,
                    conversation: { ...config.conversation, responseThreshold: Number(e.target.value) }
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
                    network: { ...config.network, stability: e.target.value }
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

            <div className="mt-12 flex justify-end">
              <motion.button
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary via-secondary to-accent text-black font-semibold text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartTest}
              >
                Start Test
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
} 