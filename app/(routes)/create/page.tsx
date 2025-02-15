'use client';

import { useState } from 'react';
import Navigation from '../../components/Navigation';

export default function CreateTest() {
  const [formData, setFormData] = useState({
    testName: '',
    description: '',
    prompt: '',
    numTests: 1000,
    variations: {
      accents: ['neutral'],
      background: ['quiet'],
      speed: ['normal'],
    },
    successCriteria: {
      accuracy: 0.95,
      responseTime: 2,
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <main className="min-h-screen relative">
      <div className="gradient-background" />
      <Navigation />

      <div className="pt-32 px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="scroll-section">
            <h1 className="text-4xl font-bold mb-8">
              <span className="gradient-text">Create New Test</span>
            </h1>
            <p className="text-white/70 mb-12 max-w-2xl">
              Configure your voice AI test parameters. Our platform will generate and execute
              test cases based on your specifications.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Basic Information */}
              <div className="card scroll-section">
                <h3 className="text-xl font-semibold mb-6 gradient-text">Basic Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/70 mb-2">Test Name</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g., Drive-through Order Test Suite"
                      value={formData.testName}
                      onChange={(e) => setFormData({ ...formData, testName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 mb-2">Description</label>
                    <textarea
                      className="input-field min-h-[100px]"
                      placeholder="Describe the purpose and scope of your test suite"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Test Configuration */}
              <div className="card scroll-section">
                <h3 className="text-xl font-semibold mb-6 gradient-text">Test Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/70 mb-2">Number of Tests</label>
                    <input
                      type="number"
                      className="input-field"
                      min="1"
                      max="1000000"
                      value={formData.numTests}
                      onChange={(e) => setFormData({ ...formData, numTests: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 mb-2">Base Prompt</label>
                    <textarea
                      className="input-field min-h-[100px]"
                      placeholder="e.g., You are a customer ordering from a drive-through..."
                      value={formData.prompt}
                      onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Variations */}
              <div className="card scroll-section">
                <h3 className="text-xl font-semibold mb-6 gradient-text">Test Variations</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-white/70 mb-2">Accent Types</label>
                    <div className="flex flex-wrap gap-2">
                      {['neutral', 'regional', 'international'].map((accent) => (
                        <button
                          key={accent}
                          type="button"
                          className={`px-4 py-2 rounded-lg border transition-colors ${
                            formData.variations.accents.includes(accent)
                              ? 'border-swarm-gold text-swarm-gold'
                              : 'border-white/10 text-white/70 hover:border-white/30'
                          }`}
                          onClick={() => {
                            const newAccents = formData.variations.accents.includes(accent)
                              ? formData.variations.accents.filter(a => a !== accent)
                              : [...formData.variations.accents, accent];
                            setFormData({
                              ...formData,
                              variations: { ...formData.variations, accents: newAccents }
                            });
                          }}
                        >
                          {accent}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/70 mb-2">Background Noise</label>
                    <div className="flex flex-wrap gap-2">
                      {['quiet', 'moderate', 'noisy'].map((noise) => (
                        <button
                          key={noise}
                          type="button"
                          className={`px-4 py-2 rounded-lg border transition-colors ${
                            formData.variations.background.includes(noise)
                              ? 'border-swarm-gold text-swarm-gold'
                              : 'border-white/10 text-white/70 hover:border-white/30'
                          }`}
                          onClick={() => {
                            const newBackground = formData.variations.background.includes(noise)
                              ? formData.variations.background.filter(b => b !== noise)
                              : [...formData.variations.background, noise];
                            setFormData({
                              ...formData,
                              variations: { ...formData.variations, background: newBackground }
                            });
                          }}
                        >
                          {noise}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Success Criteria */}
              <div className="card scroll-section">
                <h3 className="text-xl font-semibold mb-6 gradient-text">Success Criteria</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/70 mb-2">Required Accuracy (%)</label>
                    <input
                      type="number"
                      className="input-field"
                      min="0"
                      max="100"
                      step="0.1"
                      value={formData.successCriteria.accuracy * 100}
                      onChange={(e) => setFormData({
                        ...formData,
                        successCriteria: {
                          ...formData.successCriteria,
                          accuracy: parseFloat(e.target.value) / 100
                        }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 mb-2">Max Response Time (seconds)</label>
                    <input
                      type="number"
                      className="input-field"
                      min="0"
                      step="0.1"
                      value={formData.successCriteria.responseTime}
                      onChange={(e) => setFormData({
                        ...formData,
                        successCriteria: {
                          ...formData.successCriteria,
                          responseTime: parseFloat(e.target.value)
                        }
                      })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Section */}
            <div className="flex justify-end space-x-4 scroll-section">
              <button
                type="button"
                className="px-6 py-3 rounded-lg border border-white/20 text-white/90 hover:bg-white/5 transition-colors"
              >
                Save as Draft
              </button>
              <button
                type="submit"
                className="glow-button"
              >
                Start Test Run
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
} 