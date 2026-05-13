import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Link as LinkIcon, AlertCircle, MonitorPlay } from 'lucide-react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import DashboardCards from '../components/dashboard/DashboardCards';
import TranscriptViewer from '../components/dashboard/TranscriptViewer';
import TimestampList from '../components/dashboard/TimestampList';
import NotesPanel from '../components/dashboard/NotesPanel';
import SearchPresenter from '../presenters/SearchPresenter';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [url, setUrl] = useState('');
  const [query, setQuery] = useState('');
  const [state, setState] = useState({
    transcript: null,
    searchResults: [],
    notes: [],
    currentNote: null,
    history: [],
    loading: false,
    error: null,
    videoInfo: null,
  });

  // Use a ref for presenter to keep the same instance
  const presenterRef = React.useRef(null);
  if (!presenterRef.current) {
    presenterRef.current = new SearchPresenter(setState);
  }
  const presenter = presenterRef.current;

  useEffect(() => {
    presenter.loadNotes();
    presenter.loadHistory();
  }, []);

  const handleExtractTranscript = async (e) => {
    e.preventDefault();
    if (!url) return;
    await presenter.extractTranscript(url);
  };

  const handleSearchTopic = async (e) => {
    e.preventDefault();
    if (!query || !state.videoInfo?.url) return;
    await presenter.searchTopic(query, state.videoInfo.url);
  };

  const handleGenerateNotes = async (noteType = 'bullet') => {
    if (!state.transcript?.id || !query) return;
    await presenter.generateNotes(state.transcript.id, query, noteType);
    setActiveTab('notes');
  };

  const handleDeleteNote = async (noteId) => {
    await presenter.deleteNote(noteId);
  };

  // Helper to open youtube at timestamp
  const handleTimestampClick = (seconds) => {
    if (state.videoInfo?.url) {
      // Basic formatting to support https://youtube.com/watch?v=...
      const baseUrl = state.videoInfo.url;
      const separator = baseUrl.includes('?') ? '&' : '?';
      window.open(`${baseUrl}${separator}t=${Math.floor(seconds)}s`, '_blank');
    }
  };

  // Compute dummy stats based on history and notes for now
  const stats = {
    searches: state.history?.length || 0,
    notes: state.notes?.length || 0,
    videos: state.transcript ? 1 : 0, // In reality, count unique video_ids in history
    timeSaved: Math.round((state.history?.length || 0) * 0.5), // Assume 0.5 hours saved per search
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark-500">
      <Header />
      
      <div className="flex-1 flex pt-16">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="flex-1 p-6 md:p-8 ml-0 sm:ml-[72px] lg:ml-[260px] transition-all duration-300">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto space-y-6"
          >
            {/* Header section with Stats */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">Welcome to your Dashboard</h1>
              <p className="text-gray-400">Search transcripts, find exact timestamps, and generate notes.</p>
            </div>
            
            <DashboardCards stats={stats} />

            {/* Main Content Area */}
            {activeTab === 'search' && (
              <div className="space-y-6">
                {state.error && (
                  <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {state.error}
                  </div>
                )}

                {/* Input Panel */}
                <div className="glass-card p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* URL Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        1. Load Video Transcript
                      </label>
                      <form onSubmit={handleExtractTranscript} className="flex gap-3">
                        <div className="relative flex-1">
                          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input
                            type="text"
                            placeholder="Paste YouTube URL..."
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={state.loading || !url}
                          className="px-6 py-2.5 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-all border border-white/10 disabled:opacity-50"
                        >
                          Load
                        </button>
                      </form>
                    </div>

                    {/* Topic Search */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        2. Search Topic
                      </label>
                      <form onSubmit={handleSearchTopic} className="flex gap-3">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input
                            type="text"
                            placeholder="Topic to search..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            disabled={!state.transcript}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 disabled:opacity-50"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={state.loading || !query || !state.transcript}
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium hover:from-cyan-400 hover:to-blue-400 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                        >
                          Search
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Video Info Indicator */}
                  {state.videoInfo && (
                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-sm text-cyan-400">
                      <MonitorPlay className="w-4 h-4" />
                      <span>Loaded Video ID: {state.videoInfo.id}</span>
                      <span className="text-gray-500 mx-2">•</span>
                      <span className="text-gray-400">{state.transcript?.transcript_segments?.length || 0} segments</span>
                    </div>
                  )}
                </div>

                {/* Results Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: Timestamps */}
                  <div className="lg:col-span-1">
                    <TimestampList 
                      results={state.searchResults} 
                      onTimestampClick={handleTimestampClick}
                      isLoading={state.loading && query !== ''} 
                    />
                    
                    {/* Generate Notes CTA */}
                    {state.searchResults?.length > 0 && (
                      <button
                        onClick={() => handleGenerateNotes('bullet')}
                        disabled={state.loading}
                        className="w-full mt-4 glass-button flex items-center justify-center gap-2"
                      >
                        <Search className="w-4 h-4" />
                        Generate Smart Notes
                      </button>
                    )}
                  </div>

                  {/* Right Column: Full Transcript Viewer */}
                  <div className="lg:col-span-2">
                    <TranscriptViewer 
                      transcript={state.transcript} 
                      searchResults={state.searchResults}
                      onTimestampClick={handleTimestampClick}
                      isLoading={state.loading && url !== '' && !state.transcript}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <NotesPanel 
                notes={state.notes} 
                currentNote={state.currentNote} 
                onDelete={handleDeleteNote}
                onGenerate={handleGenerateNotes}
              />
            )}

            {activeTab === 'history' && (
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Search History</h3>
                {state.history?.length > 0 ? (
                  <div className="space-y-3">
                    {state.history.map((h) => (
                      <div key={h.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                        <div>
                          <p className="font-medium text-white">"{h.query}"</p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                            <span>{new Date(h.created_at).toLocaleString()}</span>
                            <span>•</span>
                            <a href={h.video_url} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">
                              Video Link
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No search history found.</p>
                )}
              </div>
            )}

            {activeTab === 'bookmarks' && (
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Bookmarks</h3>
                <p className="text-gray-500 text-center py-12">Bookmarks feature coming soon.</p>
              </div>
            )}

            {activeTab === 'generate' && (
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-white mb-6">AI Notes</h3>
                <p className="text-gray-500 text-center py-12">Select a topic in the Search tab to generate notes here.</p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Settings</h3>
                <p className="text-gray-500 text-center py-12">User settings coming soon.</p>
              </div>
            )}

          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
