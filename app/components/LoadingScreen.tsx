import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <div className="relative w-[60px] h-[60px]">
        {/* Animated hexagons */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0"
            style={{
              border: '4px solid',
              borderRadius: '10px',
              borderColor: i === 0 ? '#F59E0B' : i === 1 ? '#6366F1' : '#9333EA'
            }}
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              delay: i * 0.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      {/* Loading text */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Loading
        </h3>
        <p className="text-white/60 text-sm">Please wait while we process your request</p>
      </motion.div>
    </div>
  );
} 