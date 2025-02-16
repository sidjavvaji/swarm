'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}

export default function Card({ children, className = '', hover = true, delay = 0 }: CardProps) {
  return (
    <motion.div
      className={`relative p-6 rounded-2xl overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={hover ? { scale: 1.02 } : undefined}
    >
      {/* Background layers */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="absolute inset-px rounded-2xl bg-gradient-to-br from-white/5 to-white/0" />
      
      {/* Animated border */}
      <div className="absolute inset-0">
        <div className="absolute inset-px rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 animate-gradient" />
        </div>
      </div>

      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-secondary/0 to-accent/0 opacity-0 group-hover:opacity-20 transition-opacity duration-500" />

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-16 h-16">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent transform -rotate-45" />
      </div>
      <div className="absolute bottom-0 right-0 w-16 h-16">
        <div className="absolute inset-0 bg-gradient-to-tl from-accent/20 to-transparent transform -rotate-45" />
      </div>
    </motion.div>
  );
}

// Also export as a named export
export { Card };

export function MetricCard({ title, value, change, icon }: { title: string; value: string; change: number; icon: string }) {
  return (
    <Card>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-white/70">{title}</h3>
          <p className="text-2xl font-semibold mt-1 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            {value}
          </p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className={`text-sm mt-4 ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
        {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% from last period
      </div>
    </Card>
  );
}

export function FeatureCard({ title, icon, description, delay = 0 }: { title: string; icon: string; description: string; delay?: number }) {
  return (
    <Card delay={delay} className="group">
      <span className="text-3xl mb-4 block">{icon}</span>
      <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
        {title}
      </h3>
      <p className="text-white/70 leading-relaxed">{description}</p>
    </Card>
  );
}

export function StatCard({ title, value, subtitle, delay = 0 }: { title: string; value: string; subtitle: string; delay?: number }) {
  return (
    <Card delay={delay} className="text-center group">
      <h4 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
        {value}
      </h4>
      <p className="text-lg font-medium text-white/90 mb-1">{title}</p>
      <p className="text-sm text-white/70">{subtitle}</p>
    </Card>
  );
} 