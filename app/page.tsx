'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from './components/Navigation';
import { useAuth } from './context/AuthContext';

export default function Home() {
  const router = useRouter();
  const { user, signInWithGoogle } = useAuth();

  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1
    });

    document.querySelectorAll('.scroll-section').forEach(section => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const handleStartTesting = () => {
    if (user) {
      router.push('/create');
    } else {
      signInWithGoogle();
    }
  };

  return (
    <main className="min-h-screen relative">
      <div className="gradient-background" />
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center scroll-section">
          <h1 className="text-7xl font-bold mb-6">
            <span className="gradient-text">Scale Your Voice AI Testing</span>
          </h1>
          <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
            Simulate millions of voice interactions without the overhead of real audio playback
          </p>
          <div className="flex gap-4 justify-center">
            <button 
              className="glow-button"
              onClick={handleStartTesting}
            >
              Start Testing
            </button>
            <button className="px-6 py-3 rounded-lg border border-white/20 text-white/90 hover:bg-white/5 transition-colors">
              View Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center scroll-section">
            <span className="gradient-text">Powerful Features</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card scroll-section" style={{ animationDelay: "0.1s" }}>
              <div className="feature-icon">
                <svg className="w-6 h-6 text-swarm-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 gradient-text">Mass Simulation</h3>
              <p className="text-white/70">
                Test your voice AI system with 100,000+ simulated interactions without actual audio playback.
                Achieve unprecedented scale in testing.
              </p>
            </div>
            <div className="card scroll-section" style={{ animationDelay: "0.2s" }}>
              <div className="feature-icon">
                <svg className="w-6 h-6 text-swarm-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 gradient-text">Real-time Analytics</h3>
              <p className="text-white/70">
                Monitor test progress and results in real-time. Get detailed insights into your voice AI&apos;s performance
                across various scenarios.
              </p>
            </div>
            <div className="card scroll-section" style={{ animationDelay: "0.3s" }}>
              <div className="feature-icon">
                <svg className="w-6 h-6 text-swarm-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 gradient-text">Twilio Integration</h3>
              <p className="text-white/70">
                Seamless integration with Twilio for call handling and management. Scale your testing
                infrastructure effortlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-16 bg-surface-light/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center scroll-section">
            <span className="gradient-text">How It Works</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="scroll-section">
                <h3 className="text-xl font-semibold mb-4 text-swarm-gold">1. Define Your Test Cases</h3>
                <p className="text-white/70">
                  Provide your test prompts and scenarios. Our platform generates diverse test cases
                  that cover a wide range of user interactions.
                </p>
              </div>
              <div className="scroll-section">
                <h3 className="text-xl font-semibold mb-4 text-swarm-gold">2. Generate Audio Data</h3>
                <p className="text-white/70">
                  We create simulated audio data that represents real user speech patterns,
                  without actually playing or recording audio.
                </p>
              </div>
              <div className="scroll-section">
                <h3 className="text-xl font-semibold mb-4 text-swarm-gold">3. Test at Scale</h3>
                <p className="text-white/70">
                  Run thousands of simultaneous tests against your voice AI system,
                  collecting comprehensive performance data.
                </p>
              </div>
            </div>
            <div className="bg-surface-light/10 rounded-xl p-8 scroll-section">
              <pre className="text-sm font-mono text-white/70">
                <code>{`// Example Test Configuration
{
  "testCases": 100000,
  "scenario": "drive-through-order",
  "variations": {
    "accents": ["neutral", "regional"],
    "background": ["quiet", "noisy"],
    "speed": ["normal", "fast", "slow"]
  },
  "success_criteria": {
    "accuracy": 0.95,
    "response_time": "< 2s"
  }
}`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="stat-card scroll-section">
            <h4 className="text-4xl font-bold gradient-text mb-2">100k+</h4>
            <p className="text-white/70">Simultaneous Tests</p>
          </div>
          <div className="stat-card scroll-section" style={{ animationDelay: '0.1s' }}>
            <h4 className="text-4xl font-bold gradient-text mb-2">99.9%</h4>
            <p className="text-white/70">Uptime</p>
          </div>
          <div className="stat-card scroll-section" style={{ animationDelay: '0.2s' }}>
            <h4 className="text-4xl font-bold gradient-text mb-2">24/7</h4>
            <p className="text-white/70">Monitoring</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto text-center scroll-section">
          <h2 className="text-3xl font-bold mb-6">
            <span className="gradient-text">Ready to Scale Your Testing?</span>
          </h2>
          <p className="text-xl text-white/70 mb-8">
            Join leading companies using Swarm to test and improve their voice AI systems.
          </p>
          <button className="glow-button">
            Get Started Now
          </button>
        </div>
      </section>
    </main>
  );
}
