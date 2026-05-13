import { motion } from 'framer-motion';
import { Clock, TrendingUp, ChevronRight, PlayCircle } from 'lucide-react';

const TimestampList = ({ results, onTimestampClick, isLoading }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="glass-card p-6 h-full min-h-[300px] flex flex-col">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-400" /> Topic Timestamps
        </h3>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-sm text-gray-400 animate-pulse">Searching transcript...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="glass-card p-6 h-full min-h-[300px] flex flex-col">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-400" /> Topic Timestamps
        </h3>
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <Clock className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Search for a topic to see exact timestamps.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-400" /> Exact Matches
        </h3>
        <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20">
          {results.length} found
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3">
        {results.map((result, index) => {
          const scorePercent = Math.round((result.similarity || 0) * 100);
          const isHighMatch = scorePercent >= 80;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => onTimestampClick?.(result.start)}
              className="group relative bg-white/5 border border-white/10 rounded-xl p-4 cursor-pointer hover:bg-white/10 hover:border-blue-500/30 transition-all overflow-hidden"
            >
              {/* Highlight bar for high matches */}
              {isHighMatch && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-blue-500" />
              )}
              
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="flex items-center gap-1 text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                      <PlayCircle className="w-3 h-3" />
                      {formatTime(result.start)}
                    </span>
                    <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded border ${
                      isHighMatch ? 'text-green-400 bg-green-500/10 border-green-500/20' : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                    }`}>
                      <TrendingUp className="w-3 h-3" />
                      {scorePercent}% match
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 line-clamp-2 group-hover:text-white transition-colors">
                    "{result.text}"
                  </p>
                </div>
                <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-colors flex-shrink-0">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TimestampList;
