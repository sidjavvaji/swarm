'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface HoneycombProps {
  color?: 'primary' | 'secondary' | 'accent';
  size?: number;
  count?: number;
}

const colorClasses = {
  primary: 'from-primary/10',
  secondary: 'from-secondary/10',
  accent: 'from-accent/10'
};

export default function HoneycombBackground({ 
  color = 'primary', 
  size = 32, 
  count = 20 
}: HoneycombProps) {
  const honeycombs = useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    scale: 0.5 + Math.random() * 1.5,
    rotation: Math.random() * 360,
    delay: Math.random() * 5
  })), [count]);

  const fromColorClass = colorClasses[color];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-secondary/5 to-transparent" />
      <div className="honeycomb-bg" />
      {honeycombs.map((honeycomb) => (
        <motion.div
          key={honeycomb.id}
          className={`absolute bg-gradient-to-br ${fromColorClass} to-secondary/10`}
          style={{
            width: size,
            height: size,
            left: `${honeycomb.x}%`,
            top: `${honeycomb.y}%`,
            clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
          }}
          initial={{ 
            opacity: 0,
            scale: 0,
            rotate: honeycomb.rotation 
          }}
          animate={{ 
            opacity: [0.3, 0.5, 0.3],
            scale: [honeycomb.scale, honeycomb.scale * 1.2, honeycomb.scale],
            rotate: [honeycomb.rotation, honeycomb.rotation + 360]
          }}
          transition={{
            duration: 10 + Math.random() * 5,
            delay: honeycomb.delay,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      ))}
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
    </div>
  );
} 