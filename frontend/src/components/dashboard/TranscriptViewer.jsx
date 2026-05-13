import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, AlignLeft, Play, AlertCircle } from 'lucide-react';

const TranscriptViewer = ({ transcript, searchResults, onTimestampClick, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const contentRef = useRef(null);

  // If there are search results from the backend semantic search, highlight them
  const hasSemanticResults = searchResults && searchResults.length > 0;

  // Local text-based search filtering for the viewer
  const filteredSegments = transcript?.transcript_segments?.filter((seg) =>
    seg.text.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="glass-card p-6 h-[600px] flex flex-col">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <AlignLeft className="w-5 h-5 text-cyan-400" /> Video Transcript
        </h3>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
            <p className="text-sm text-gray-400 animate-pulse">Extracting and analyzing transcript...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!transcript) {
    return (
      <div className="glass-card p-6 h-[600px] flex flex-col">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <AlignLeft className="w-5 h-5 text-cyan-400" /> Video Transcript
        </h3>
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <AlignLeft className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Search for a video to view its transcript.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 h-[600px] flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <AlignLeft className="w-5 h-5 text-cyan-400" /> Video Transcript
        </h3>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Filter transcript..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>
      </div>

      <div 
        ref={contentRef}
        className="flex-1 overflow-y-auto pr-2 space-y-2 scroll-smooth"
      >
        {filteredSegments.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm">
            No segments found matching "{searchTerm}"
          </div>
        ) : (
          filteredSegments.map((segment, index) => {
            // Check if this segment is part of the semantic search results
            const isHighlighted = hasSemanticResults && searchResults.some(
              res => res.start <= segment.start + 2 && res.end >= segment.start - 2
            );

            return (
              <motion.div
                key={`${segment.start}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(index * 0.01, 0.5) }}
                className={`group flex items-start gap-3 p-3 rounded-lg transition-all ${
                  isHighlighted 
                    ? 'bg-cyan-500/10 border border-cyan-500/30' 
                    : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                <button
                  onClick={() => onTimestampClick?.(segment.start)}
                  className="mt-0.5 flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded bg-white/5 text-cyan-400 text-xs font-mono group-hover:bg-cyan-500/20 group-hover:text-cyan-300 transition-colors"
                >
                  <Play className="w-3 h-3" />
                  {formatTime(segment.start)}
                </button>
                <p className={`text-sm leading-relaxed ${isHighlighted ? 'text-white' : 'text-gray-300 group-hover:text-gray-200'}`}>
                  {segment.text}
                </p>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TranscriptViewer;
