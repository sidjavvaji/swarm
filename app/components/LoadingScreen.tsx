import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative">
        {/* Animated hexagons */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              width: '60px',
              height: '60px',
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
        
        {/* Loading text */}
        <motion.div
          className="mt-24 text-center"
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
    </div>
  );
} 