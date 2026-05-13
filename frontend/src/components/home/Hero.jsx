import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Sparkles, ArrowRight, Play } from 'lucide-react';

/**
 * Hero — Landing page hero section with animated gradient,
 * floating orbs, and prominent call-to-action.
 */
const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb orb-cyan w-96 h-96 -top-20 -left-20" style={{ animationDelay: '0s' }} />
        <div className="orb orb-purple w-80 h-80 top-1/3 right-0" style={{ animationDelay: '2s' }} />
        <div className="orb orb-pink w-64 h-64 bottom-20 left-1/4" style={{ animationDelay: '4s' }} />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid opacity-50" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-sm font-medium mb-8"
        >
          <Sparkles className="w-4 h-4" />
          <span>AI-Powered Video Intelligence</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6"
        >
          <span className="text-white">Find Any Topic in</span>
          <br />
          <span className="gradient-text animate-gradient bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
            Any Video Instantly
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Smart AI agent that searches video transcripts, detects exact timestamps,
          and generates concise study notes — making long educational videos instantly navigable.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link
            to="/signup"
            className="glass-button flex items-center gap-2 text-base group"
          >
            <Search className="w-5 h-5" />
            Start Searching Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#features"
            className="glass-button-outline flex items-center gap-2 text-base"
          >
            <Play className="w-5 h-5" />
            See How It Works
          </a>
        </motion.div>

        {/* Hero visual — Glassmorphism search preview */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <div className="glass-card p-6 rounded-2xl glow-cyan">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex-1 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center px-3">
                <span className="text-xs text-gray-500">https://youtube.com/watch?v=...</span>
              </div>
            </div>

            <div className="bg-dark-400/50 rounded-xl p-5 border border-white/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center px-4">
                  <span className="text-gray-400 text-sm">Search "Binary Search Algorithm"...</span>
                </div>
              </div>

              {/* Mock results */}
              <div className="space-y-2">
                {[
                  { time: '14:32', text: 'Introduction to Binary Search — divide and conquer approach', score: '98%' },
                  { time: '22:15', text: 'Binary Search implementation in Python with examples', score: '95%' },
                  { time: '35:48', text: 'Time complexity analysis — O(log n) explanation', score: '89%' },
                ].map((result, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + i * 0.15 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/3 border border-white/5 hover:bg-white/5 hover:border-cyan-500/20 transition-all cursor-pointer group"
                  >
                    <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded-md">{result.time}</span>
                    <span className="flex-1 text-sm text-gray-300 group-hover:text-white transition-colors">{result.text}</span>
                    <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">{result.score}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
