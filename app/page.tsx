'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Navigation from './components/Navigation';
import { useAuth } from './context/AuthContext';
import { FeatureCard, StatCard } from './components/Card';
import Link from 'next/link';

const GradientLight = () => (
  <div className="fixed inset-0 pointer-events-none">
    <div className="absolute inset-0"
         style={{ 
           background: 'radial-gradient(circle at top center, rgba(245, 158, 11, 0.3) 0%, rgba(99, 102, 241, 0.15) 30%, rgba(147, 51, 234, 0.1) 50%, transparent 70%)',
           opacity: 0.4
         }} />
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/80 to-black" />
  </div>
);

export default function Home() {
  const router = useRouter();
  const { user, signInWithGoogle } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  const handleStartTesting = () => {
    if (user) {
      router.push('/create');
    } else {
      signInWithGoogle();
    }
  };

  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      <GradientLight />
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20">
        <div className="relative max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-7xl font-bold mb-6 leading-tight">
              <span className="gradient-text">
                Scale Your Voice AI Testing
              </span>
            </h1>
            <p className="text-white/70 mb-4">
              Let&apos;s revolutionize your voice AI testing
            </p>
            <div className="flex justify-center">
              <motion.button
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary via-secondary to-accent text-black font-semibold text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartTesting}
              >
                Start Testing Now
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-8">
            <FeatureCard
              title="Mass Simulation"
              description="Test your voice AI with up to 1,000 concurrent interactions. Scale testing without the overhead."
              icon="🔄"
              delay={0.2}
            />
            <FeatureCard
              title="Real-time Analytics"
              description="Monitor performance metrics and get instant insights into your AI's behavior."
              icon="📊"
              delay={0.4}
            />
            <FeatureCard
              title="Scenario Builder"
              description="Create and customize test scenarios with our intuitive builder."
              icon="🎯"
              delay={0.6}
            />
            <div className="md:col-span-3">
              <FeatureCard
                title="Comprehensive Testing"
                description="Test edge cases, validate responses, and ensure consistent performance across all scenarios with detailed analytics and reporting."
                icon="✨"
                delay={0.8}
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-2 relative">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-bold text-center mb-16">
              <span className="gradient-text">
                Why Choose Swarm?
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <StatCard
                title="Scale Testing"
                value="1,000+"
                subtitle="Concurrent Conversations"
                delay={0.2}
              />
              <StatCard
                title="Response Time"
                value="<200ms"
                subtitle="Average Latency"
                delay={0.4}
              />
              <StatCard
                title="Success Rate"
                value="99.9%"
                subtitle="Test Completion"
                delay={0.6}
              />
            </div>
            <div className="text-center max-w-4xl mx-auto">
              <p className="text-xl text-white/70 mb-8 leading-relaxed">
                Swarm is the next generation platform for testing voice AI systems at scale. 
                Our platform enables you to simulate thousands of concurrent conversations, 
                analyze performance in real-time, and get actionable insights to improve your AI's capabilities.
              </p>
              <motion.button
                className="px-12 py-4 rounded-xl bg-gradient-to-r from-primary via-secondary to-accent text-black font-semibold text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartTesting}
              >
                Get Started Now
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
