'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navigation from '../components/Navigation';
import { database } from '../../lib/database';
import { useAuth } from '../context/AuthContext';
import {
  LineChart,
  BarChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { TechnicalPerformanceMetrics, TestSimulation } from '../../types/database';
import LoadingScreen from '../components/LoadingScreen';

interface DashboardMetrics {
  simulations: TestSimulation[];
  metrics: TechnicalPerformanceMetrics[];
}

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: string;
}

const MetricCard = ({ title, value, change, icon }: MetricCardProps) => (
  <motion.div 
    className="p-6 rounded-2xl bg-white/5 border border-primary/20 hover:border-primary/40 transition-colors"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-sm font-medium text-white/70">{title}</h3>
        <p className="text-2xl font-semibold mt-1 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          {value}
        </p>
      </div>
      <span className="text-2xl">{icon}</span>
    </div>
    <div className={`text-sm ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
      {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% from last period
    </div>
  </motion.div>
);

export default function Dashboard() {
  const [results, setResults] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!user) return;
      
      try {
        const dashboardMetrics = await database.getDashboardMetrics();
        setResults(dashboardMetrics);
      } catch (error) {
        console.error('Error fetching metrics:', error);
        setResults(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [user]);

  // Calculate percentage changes
  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const getMetricChanges = () => {
    if (!results?.simulations) return { activeTests: 0, avgResponseTime: 0, successRate: 0, totalTestsToday: 0 };

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

    // Current period metrics
    const currentActiveTests = results.simulations.filter(s => s.status === 'running').length;
    const currentAvgResponseTime = results.metrics?.reduce((acc, m) => acc + (m.avg_latency_ms || 0), 0) / (results.metrics?.length || 1);
    const currentSuccessRate = results.simulations.reduce((acc, s) => acc + ((s.successful_conversations || 0) / (s.total_conversations || 1)), 0) / results.simulations.length * 100;
    const currentTotalTests = results.simulations.filter(s => new Date(s.created_at) > oneDayAgo).length;

    // Previous period metrics
    const previousActiveTests = results.simulations.filter(s => 
      s.status === 'running' && new Date(s.created_at) > twoDaysAgo && new Date(s.created_at) < oneDayAgo
    ).length;
    const previousAvgResponseTime = results.metrics?.filter(m => 
      new Date(m.created_at) > twoDaysAgo && new Date(m.created_at) < oneDayAgo
    ).reduce((acc, m) => acc + (m.avg_latency_ms || 0), 0) / (results.metrics?.length || 1);
    const previousSuccessRate = results.simulations
      .filter(s => new Date(s.created_at) > twoDaysAgo && new Date(s.created_at) < oneDayAgo)
      .reduce((acc, s) => acc + ((s.successful_conversations || 0) / (s.total_conversations || 1)), 0) / results.simulations.length * 100;
    const previousTotalTests = results.simulations.filter(s => 
      new Date(s.created_at) > twoDaysAgo && new Date(s.created_at) < oneDayAgo
    ).length;

    return {
      activeTests: calculatePercentageChange(currentActiveTests, previousActiveTests),
      avgResponseTime: calculatePercentageChange(currentAvgResponseTime, previousAvgResponseTime),
      successRate: calculatePercentageChange(currentSuccessRate, previousSuccessRate),
      totalTestsToday: calculatePercentageChange(currentTotalTests, previousTotalTests)
    };
  };

  const changes = getMetricChanges();

  if (loading) {
    return (
      <main className="min-h-screen bg-black">
        <Navigation />
        <LoadingScreen />
      </main>
    );
  }

  if (!results) {
    return (
      <main className="min-h-screen bg-black">
        <Navigation />
        <div className="pt-24 px-4 pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">No metrics available</div>
          </div>
        </div>
      </main>
    );
  }

  // Calculate summary metrics with default values
  const activeTests = results?.simulations?.filter(s => s?.status === 'running')?.length || 0;
  const avgResponseTime = results?.metrics?.length 
    ? results.metrics.reduce((acc, m) => acc + (m?.avg_latency_ms || 0), 0) / results.metrics.length 
    : 0;
  const successRate = results?.simulations?.length
    ? (results.simulations.reduce((acc, s) => acc + ((s?.successful_conversations || 0) / (s?.total_conversations || 1)), 0) / results.simulations.length * 100)
    : 0;
  const totalTestsToday = results?.simulations?.filter(s => {
    if (!s?.created_at) return false;
    const date = new Date(s.created_at);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  })?.length || 0;

  // Prepare chart data with default values
  const responseTimeData = results?.metrics?.map(m => ({
    time: new Date(m?.created_at || Date.now()).toLocaleTimeString(),
    value: m?.avg_latency_ms || 0
  })) || [];

  const completionRateData = results?.simulations?.map(s => ({
    scenario: s?.test_configurations?.name || 'Unknown',
    rate: ((s?.successful_conversations || 0) / (s?.total_conversations || 1)) * 100
  })) || [];

  return (
    <main className="min-h-screen bg-black">
      <Navigation />

      <div className="pt-24 px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Dashboard
            </h1>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Active Tests"
              value={activeTests.toString()}
              change={changes.activeTests}
              icon="🔄"
            />
            <MetricCard
              title="Avg Response Time"
              value={`${Math.round(avgResponseTime)}ms`}
              change={changes.avgResponseTime}
              icon="⚡"
            />
            <MetricCard
              title="Success Rate"
              value={`${successRate.toFixed(1)}%`}
              change={changes.successRate}
              icon="✅"
            />
            <MetricCard
              title="Total Tests Today"
              value={totalTestsToday.toString()}
              change={changes.totalTestsToday}
              icon="📊"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Response Time Trend */}
            <div className="p-6 rounded-2xl bg-white/5 border border-primary/20">
              <h3 className="text-lg font-medium mb-6 text-white/90">Response Time Trend</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={responseTimeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis 
                      dataKey="time" 
                      stroke="#ffffff"
                      tick={{ fill: '#ffffff' }}
                    />
                    <YAxis 
                      stroke="#ffffff"
                      tick={{ fill: '#ffffff' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#000000', 
                        border: '1px solid rgba(245, 158, 11, 0.2)',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#F59E0B"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Completion Rate by Scenario */}
            <div className="p-6 rounded-2xl bg-white/5 border border-primary/20">
              <h3 className="text-lg font-medium mb-6 text-white/90">Completion Rate by Scenario</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={completionRateData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis 
                      dataKey="scenario" 
                      stroke="#ffffff"
                      tick={{ fill: '#ffffff' }}
                    />
                    <YAxis 
                      stroke="#ffffff"
                      tick={{ fill: '#ffffff' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#000000', 
                        border: '1px solid rgba(245, 158, 11, 0.2)',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar 
                      dataKey="rate" 
                      fill="#F59E0B"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Tests */}
          <div className="rounded-2xl bg-white/5 border border-primary/20 overflow-hidden">
            <div className="p-6 border-b border-primary/20">
              <h3 className="text-lg font-medium text-white/90">Recent Tests</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-primary/20">
                    <th className="px-6 py-3 text-left text-sm font-medium text-white/70">Test ID</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-white/70">Scenario</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-white/70">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-white/70">Duration</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-white/70">Success Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {results.simulations.map(simulation => (
                    <tr key={simulation.id} className="border-b border-white/5">
                      <td className="px-6 py-4 text-sm text-white/90">{simulation.id.slice(0, 8)}</td>
                      <td className="px-6 py-4 text-sm text-white/90">{simulation.test_configurations?.name || 'Unknown'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          simulation.status === 'completed' 
                            ? 'bg-green-400/10 text-green-400'
                            : simulation.status === 'running'
                            ? 'bg-blue-400/10 text-blue-400'
                            : 'bg-red-400/10 text-red-400'
                        }`}>
                          {simulation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-white/90">
                        {simulation.end_time 
                          ? `${Math.round((new Date(simulation.end_time).getTime() - new Date(simulation.start_time).getTime()) / 1000)}s`
                          : '-'
                        }
                      </td>
                      <td className="px-6 py-4 text-sm text-white/90">
                        {((simulation.successful_conversations / simulation.total_conversations) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 