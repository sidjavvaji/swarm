'use client';

import { useState } from 'react';
import Navigation from '../../components/Navigation';

// Mock data for demonstration
const mockTests = [
  {
    id: 1,
    name: 'Drive-through Order Test Suite',
    status: 'completed',
    progress: 100,
    totalTests: 100000,
    successRate: 97.5,
    avgResponseTime: 1.2,
    startTime: '2024-02-15T10:00:00',
    endTime: '2024-02-15T11:30:00',
  },
  {
    id: 2,
    name: 'Menu Item Recognition Suite',
    status: 'in-progress',
    progress: 65,
    totalTests: 50000,
    successRate: 95.8,
    avgResponseTime: 1.4,
    startTime: '2024-02-15T11:45:00',
  },
  {
    id: 3,
    name: 'Accent Variation Tests',
    status: 'queued',
    progress: 0,
    totalTests: 75000,
    startTime: '2024-02-15T12:00:00',
  },
];

export default function Results() {
  const [selectedTest, setSelectedTest] = useState(mockTests[0]);

  return (
    <main className="min-h-screen relative">
      <div className="gradient-background" />
      <Navigation />

      <div className="pt-32 px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="scroll-section">
            <h1 className="text-4xl font-bold mb-8">
              <span className="gradient-text">Test Results</span>
            </h1>
            <p className="text-white/70 mb-12 max-w-2xl">
              Monitor and analyze your voice AI test results in real-time.
              Get detailed insights into performance metrics and identify areas for improvement.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Test List Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              {mockTests.map((test) => (
                <button
                  key={test.id}
                  className={`w-full text-left p-4 rounded-lg transition-all ${
                    selectedTest.id === test.id
                      ? 'bg-surface-light border border-swarm-gold/20'
                      : 'bg-surface/40 border border-white/10 hover:border-white/20'
                  }`}
                  onClick={() => setSelectedTest(test)}
                >
                  <h3 className="font-medium text-white mb-2">{test.name}</h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className={`
                      px-2 py-1 rounded-full text-xs
                      ${test.status === 'completed' ? 'bg-green-500/20 text-green-300' : ''}
                      ${test.status === 'in-progress' ? 'bg-blue-500/20 text-blue-300' : ''}
                      ${test.status === 'queued' ? 'bg-yellow-500/20 text-yellow-300' : ''}
                    `}>
                      {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                    </span>
                    <span className="text-white/50">{test.totalTests.toLocaleString()} tests</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="stat-card scroll-section">
                  <div className="text-4xl font-bold gradient-text mb-2">
                    {selectedTest.status === 'completed' ? `${selectedTest.successRate}%` : '--'}
                  </div>
                  <div className="text-white/70">Success Rate</div>
                </div>
                <div className="stat-card scroll-section">
                  <div className="text-4xl font-bold gradient-text mb-2">
                    {selectedTest.status === 'completed' ? `${selectedTest.avgResponseTime}s` : '--'}
                  </div>
                  <div className="text-white/70">Avg Response Time</div>
                </div>
                <div className="stat-card scroll-section">
                  <div className="text-4xl font-bold gradient-text mb-2">
                    {selectedTest.totalTests.toLocaleString()}
                  </div>
                  <div className="text-white/70">Total Tests</div>
                </div>
              </div>

              {/* Progress Section */}
              {selectedTest.status !== 'completed' && (
                <div className="card scroll-section">
                  <h3 className="text-xl font-semibold mb-6 gradient-text">Test Progress</h3>
                  <div className="w-full bg-surface-light rounded-full h-4 mb-4">
                    <div
                      className="bg-gradient-to-r from-swarm-gold to-swarm-light h-full rounded-full transition-all duration-500"
                      style={{ width: `${selectedTest.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>{selectedTest.progress}% Complete</span>
                    <span>{selectedTest.totalTests.toLocaleString()} Total Tests</span>
                  </div>
                </div>
              )}

              {/* Detailed Results */}
              <div className="card scroll-section">
                <h3 className="text-xl font-semibold mb-6 gradient-text">Test Details</h3>
                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-white/10">
                    <span className="text-white/70">Start Time</span>
                    <span className="text-white">
                      {new Date(selectedTest.startTime).toLocaleString()}
                    </span>
                  </div>
                  {selectedTest.endTime && (
                    <div className="flex justify-between py-3 border-b border-white/10">
                      <span className="text-white/70">End Time</span>
                      <span className="text-white">
                        {new Date(selectedTest.endTime).toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between py-3 border-b border-white/10">
                    <span className="text-white/70">Status</span>
                    <span className={`
                      px-2 py-1 rounded-full text-xs
                      ${selectedTest.status === 'completed' ? 'bg-green-500/20 text-green-300' : ''}
                      ${selectedTest.status === 'in-progress' ? 'bg-blue-500/20 text-blue-300' : ''}
                      ${selectedTest.status === 'queued' ? 'bg-yellow-500/20 text-yellow-300' : ''}
                    `}>
                      {selectedTest.status.charAt(0).toUpperCase() + selectedTest.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-4 scroll-section">
                <button className="px-6 py-3 rounded-lg border border-white/20 text-white/90 hover:bg-white/5 transition-colors">
                  Export Results
                </button>
                <button className="glow-button">
                  View Full Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 