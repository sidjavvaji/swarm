'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '../components/Navigation';
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

// Mock data - replace with real data from your backend
const mockData = {
  responseTime: [
    { time: '00:00', value: 150 },
    { time: '04:00', value: 200 },
    { time: '08:00', value: 180 },
    { time: '12:00', value: 250 },
    { time: '16:00', value: 300 },
    { time: '20:00', value: 200 },
  ],
  completionRate: [
    { scenario: 'Order Taking', rate: 95 },
    { scenario: 'Customer Support', rate: 88 },
    { scenario: 'Booking', rate: 92 },
    { scenario: 'Information', rate: 97 },
  ]
};

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

interface TabButtonProps {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}

const TabButton = ({ active, children, onClick }: TabButtonProps) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      active 
        ? 'bg-primary/10 text-primary border border-primary/20' 
        : 'text-white/70 hover:text-white hover:bg-white/5'
    }`}
  >
    {children}
  </button>
);

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

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
            <div className="flex gap-2">
              <TabButton 
                active={activeTab === 'overview'} 
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </TabButton>
              <TabButton 
                active={activeTab === 'performance'} 
                onClick={() => setActiveTab('performance')}
              >
                Performance
              </TabButton>
              <TabButton 
                active={activeTab === 'quality'} 
                onClick={() => setActiveTab('quality')}
              >
                Quality
              </TabButton>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Active Tests"
              value="1,234"
              change={12}
              icon="🔄"
            />
            <MetricCard
              title="Avg Response Time"
              value="180ms"
              change={-5}
              icon="⚡"
            />
            <MetricCard
              title="Success Rate"
              value="94.2%"
              change={3}
              icon="✅"
            />
            <MetricCard
              title="Total Tests Today"
              value="45,678"
              change={8}
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
                  <LineChart data={mockData.responseTime}>
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
                  <BarChart data={mockData.completionRate}>
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
                  <tr className="border-b border-white/5">
                    <td className="px-6 py-4 text-sm text-white/90">#1234</td>
                    <td className="px-6 py-4 text-sm text-white/90">Restaurant Order</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-400/10 text-green-400">
                        Completed
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-white/90">2m 34s</td>
                    <td className="px-6 py-4 text-sm text-white/90">98%</td>
                  </tr>
                  {/* Add more rows as needed */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 