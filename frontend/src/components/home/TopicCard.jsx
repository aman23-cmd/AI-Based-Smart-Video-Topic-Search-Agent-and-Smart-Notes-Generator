import { motion } from 'framer-motion';
import { Clock, ExternalLink, TrendingUp } from 'lucide-react';

/**
 * TopicCard — Displays a single topic search result with timestamp,
 * matching text, and relevance score. Clickable to jump to timestamp.
 */
const TopicCard = ({ result, index, onTimestampClick }) => {
  const { text, start, end, similarity } = result;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const scorePercent = Math.round((similarity || 0.85) * 100);
  const scoreColor =
    scorePercent >= 90
      ? 'text-green-400 bg-green-500/10 border-green-500/20'
      : scorePercent >= 70
      ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
      : 'text-amber-400 bg-amber-500/10 border-amber-500/20';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      onClick={() => onTimestampClick?.(start)}
      className="glass-card p-4 cursor-pointer group hover:border-cyan-500/30"
    >
      <div className="flex items-start gap-3">
        {/* Timestamp badge */}
        <button className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono hover:bg-cyan-500/20 transition-all">
          <Clock className="w-3 h-3" />
          {formatTime(start)}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-300 leading-relaxed group-hover:text-white transition-colors line-clamp-2">
            {text}
          </p>
          {end && (
            <p className="text-xs text-gray-500 mt-1">
              Duration: {formatTime(start)} → {formatTime(end)}
            </p>
          )}
        </div>

        {/* Score */}
        <div className={`flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium ${scoreColor}`}>
          <TrendingUp className="w-3 h-3" />
          {scorePercent}%
        </div>
      </div>
    </motion.div>
  );
};

export default TopicCard;
