import { motion } from 'framer-motion';
import { FileText, Trash2, Download, Sparkles } from 'lucide-react';

const NotesPanel = ({ notes, currentNote, onDelete, onGenerate }) => {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" /> AI Generated Notes
        </h3>
      </div>

      {currentNote ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium">{currentNote.notes_type || 'bullet'}</span>
            <span className="text-sm text-gray-400">{currentNote.topic}</span>
          </div>
          <div className="bg-dark-400/50 rounded-xl p-5 border border-white/5 max-h-96 overflow-y-auto">
            <div className="prose prose-invert prose-sm max-w-none text-gray-300 whitespace-pre-wrap">{currentNote.notes_content || currentNote.content}</div>
          </div>
          {currentNote.key_concepts && currentNote.key_concepts.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-white mb-2">Key Concepts</h4>
              <div className="flex flex-wrap gap-2">
                {currentNote.key_concepts.map((c, i) => (
                  <span key={i} className="px-2 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs">{c}</span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No notes generated yet. Search a topic and generate AI notes.</p>
        </div>
      )}

      {notes && notes.length > 0 && (
        <div className="mt-6 border-t border-white/5 pt-4">
          <h4 className="text-sm font-medium text-gray-400 mb-3">Saved Notes</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {notes.map((note) => (
              <div key={note.id} className="flex items-center justify-between p-3 rounded-lg bg-white/3 border border-white/5 hover:bg-white/5 transition-all">
                <div>
                  <p className="text-sm text-white">{note.topic}</p>
                  <p className="text-xs text-gray-500">{note.notes_type} • {new Date(note.created_at).toLocaleDateString()}</p>
                </div>
                <button onClick={() => onDelete?.(note.id)} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesPanel;
