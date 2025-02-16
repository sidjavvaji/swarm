'use client';

import { motion } from 'framer-motion';

interface HoneycombPatternProps {
  className?: string;
  color?: string;
  size?: number;
  opacity?: number;
}

export default function HoneycombPattern({ 
  className = '', 
  color = 'from-primary',
  size = 60,
  opacity = 0.3 
}: HoneycombPatternProps) {
  const cells = Array.from({ length: 48 });
  const rows = 6;
  const cols = 8;

  return (
    <div className={`grid ${className}`} style={{
      gridTemplateColumns: `repeat(${cols}, ${size}px)`,
      gridTemplateRows: `repeat(${rows}, ${size * 0.866}px)`, // height = width * sin(60°)
      transform: 'translateX(-25%)', // Offset to create staggered effect
    }}>
      {cells.map((_, index) => {
        const row = Math.floor(index / cols);
        const isEvenRow = row % 2 === 0;
        
        return (
          <motion.div
            key={index}
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity, scale: 1 }}
            transition={{ 
              duration: 0.8,
              delay: index * 0.02,
              ease: "easeOut"
            }}
          >
            <div className={`absolute inset-1 bg-gradient-to-br ${color} to-transparent`}
                 style={{
                   clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                   transform: isEvenRow ? 'translateX(50%)' : 'none'
                 }} />
            <div className="absolute inset-1 border-2 border-black/20"
                 style={{
                   clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                   transform: isEvenRow ? 'translateX(50%)' : 'none'
                 }} />
          </motion.div>
        );
      })}
    </div>
  );
} 