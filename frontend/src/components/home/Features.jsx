import { motion } from 'framer-motion';
import { Search, Brain, Clock, FileText, Bookmark, BarChart3 } from 'lucide-react';

/**
 * Features — Feature cards section with glassmorphism styling and
 * staggered animations. Showcases the platform's key capabilities.
 */
const features = [
  {
    icon: Search,
    title: 'Semantic Topic Search',
    description: 'Search any topic and find exactly where it is explained in the video using AI-powered semantic matching.',
    color: 'from-cyan-500 to-blue-500',
    glow: 'shadow-cyan-500/20',
  },
  {
    icon: Clock,
    title: 'Exact Timestamp Detection',
    description: 'Jump directly to the exact moment a topic starts. No more scrubbing through hours of content.',
    color: 'from-purple-500 to-pink-500',
    glow: 'shadow-purple-500/20',
  },
  {
    icon: Brain,
    title: 'AI-Generated Notes',
    description: 'Get concise, well-structured study notes auto-generated from video transcripts by advanced AI.',
    color: 'from-pink-500 to-rose-500',
    glow: 'shadow-pink-500/20',
  },
  {
    icon: FileText,
    title: 'Quick Revision Summaries',
    description: 'Generate bullet-point summaries, key concepts, and exam-ready notes in seconds.',
    color: 'from-amber-500 to-orange-500',
    glow: 'shadow-amber-500/20',
  },
  {
    icon: Bookmark,
    title: 'Save & Bookmark',
    description: 'Save your favourite search results and notes. Build your personal knowledge library over time.',
    color: 'from-green-500 to-emerald-500',
    glow: 'shadow-green-500/20',
  },
  {
    icon: BarChart3,
    title: 'Learning Analytics',
    description: 'Track your study progress with insights on topics covered, time saved, and search patterns.',
    color: 'from-blue-500 to-indigo-500',
    glow: 'shadow-blue-500/20',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

const Features = () => {
  return (
    <section id="features" className="relative py-24 overflow-hidden">
      {/* Section background */}
      <div className="absolute inset-0 bg-dots opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Everything You Need to{' '}
            <span className="gradient-text">Learn Faster</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Our AI agent analyses video transcripts intelligently, saving you hours of manual searching.
          </p>
        </motion.div>

        {/* Feature cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="glass-card p-6 group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg ${feature.glow} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
