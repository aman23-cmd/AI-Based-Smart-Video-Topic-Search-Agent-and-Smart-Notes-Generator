import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Link as LinkIcon, Loader2 } from 'lucide-react';

/**
 * SearchBox — Main search input component for the home page.
 * Accepts YouTube URL and topic query. Purely presentational here.
 */
const SearchBox = () => {
  const [url, setUrl] = useState('');
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // On the landing page this just redirects to signup/login
    // In dashboard, a different version is used
    if (url || query) {
      window.location.href = '/signup';
    }
  };

  return (
    <section className="relative py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`glass-card p-6 transition-all duration-500 ${
            focused ? 'glow-cyan border-cyan-500/30' : ''
          }`}
        >
          <h3 className="text-xl font-semibold text-white mb-4 text-center">
            Try It Now — Search Any Video Topic
          </h3>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* URL Input */}
            <div className="relative">
              <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Paste YouTube video URL..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className="glass-input w-full pl-11"
                id="hero-url-input"
              />
            </div>

            {/* Topic Query Input */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder='Search topic (e.g., "Binary Search", "Neural Networks")...'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className="glass-input w-full pl-11"
                id="hero-query-input"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="glass-button w-full flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              Search Topics
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-3">
            Free to use • No credit card required • Instant results
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default SearchBox;
