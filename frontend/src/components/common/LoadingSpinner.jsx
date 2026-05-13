import { motion } from 'framer-motion';

/**
 * LoadingSpinner — Animated loading indicator with optional text.
 * Uses gradient ring animation for a premium look.
 */
const LoadingSpinner = ({ text = 'Loading...', size = 'md' }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center gap-4 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        {/* Outer glow */}
        <div className={`${sizes[size]} rounded-full border-2 border-transparent animate-spin`}
          style={{
            borderTopColor: '#06b6d4',
            borderRightColor: '#8b5cf6',
            filter: 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.4))',
          }}
        />
        {/* Inner dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 animate-pulse" />
        </div>
      </div>
      {text && (
        <p className="text-sm text-gray-400 animate-pulse">{text}</p>
      )}
    </motion.div>
  );
};

export default LoadingSpinner;
