'use client';

import { useEffect } from 'react';
import Navigation from '../../components/Navigation';

export default function Documentation() {
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

  return (
    <main className="min-h-screen relative">
      <div className="gradient-background" />
      <Navigation />

      <div className="pt-32 px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="scroll-section">
            <h1 className="text-4xl font-bold mb-8">
              <span className="gradient-text">Documentation</span>
            </h1>
            <p className="text-white/70 mb-12 max-w-2xl">
              Learn how to use Swarm to scale your voice AI testing with our comprehensive guides and API documentation.
            </p>
          </div>

          {/* Quick Start */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8 scroll-section">
              <span className="gradient-text">Quick Start</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="card scroll-section">
                <h3 className="text-xl font-semibold mb-4 gradient-text">1. Create a Test Suite</h3>
                <p className="text-white/70 mb-4">
                  Start by creating a new test suite with your desired parameters:
                </p>
                <pre className="bg-surface-light/50 p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm text-white/90">{`{
  "testName": "Drive-through AI Test",
  "numTests": 10000,
  "prompt": "Customer ordering scenario",
  "variations": {
    "accents": ["neutral", "regional"]
  }
}`}</code>
                </pre>
              </div>
              <div className="card scroll-section">
                <h3 className="text-xl font-semibold mb-4 gradient-text">2. Configure Endpoints</h3>
                <p className="text-white/70 mb-4">
                  Set up your voice AI endpoints for testing:
                </p>
                <pre className="bg-surface-light/50 p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm text-white/90">{`{
  "endpoint": "https://api.your-ai.com/voice",
  "method": "POST",
  "headers": {
    "Authorization": "Bearer YOUR_API_KEY"
  }
}`}</code>
                </pre>
              </div>
            </div>
          </section>

          {/* API Reference */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8 scroll-section">
              <span className="gradient-text">API Reference</span>
            </h2>
            <div className="space-y-8">
              <div className="card scroll-section">
                <h3 className="text-xl font-semibold mb-4 gradient-text">Test Creation</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className="px-2 py-1 rounded-md bg-green-500/20 text-green-300 text-sm mr-4">POST</span>
                    <code className="text-white/90">/api/v1/tests</code>
                  </div>
                  <p className="text-white/70">Create a new test suite with specified parameters.</p>
                </div>
              </div>
              <div className="card scroll-section">
                <h3 className="text-xl font-semibold mb-4 gradient-text">Results Retrieval</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className="px-2 py-1 rounded-md bg-blue-500/20 text-blue-300 text-sm mr-4">GET</span>
                    <code className="text-white/90">/api/v1/tests/:id/results</code>
                  </div>
                  <p className="text-white/70">Retrieve detailed results for a specific test suite.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Best Practices */}
          <section>
            <h2 className="text-2xl font-bold mb-8 scroll-section">
              <span className="gradient-text">Best Practices</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card scroll-section">
                <div className="feature-icon">
                  <svg className="w-6 h-6 text-swarm-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4 gradient-text">Performance</h3>
                <p className="text-white/70">
                  Optimize your test suites by batching similar scenarios and using appropriate concurrency levels.
                </p>
              </div>
              <div className="card scroll-section">
                <div className="feature-icon">
                  <svg className="w-6 h-6 text-swarm-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4 gradient-text">Security</h3>
                <p className="text-white/70">
                  Implement proper authentication and use environment variables for sensitive data.
                </p>
              </div>
              <div className="card scroll-section">
                <div className="feature-icon">
                  <svg className="w-6 h-6 text-swarm-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4 gradient-text">Reliability</h3>
                <p className="text-white/70">
                  Implement retry mechanisms and proper error handling in your test scenarios.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
} 