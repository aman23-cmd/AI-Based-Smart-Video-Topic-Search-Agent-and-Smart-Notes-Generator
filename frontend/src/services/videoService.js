import api from './api';

/**
 * Video service — handles transcript extraction, topic search, and notes generation.
 */
const videoService = {
  /**
   * Extract transcript from a YouTube video URL
   * @param {string} videoUrl - YouTube video URL
   * @returns {Promise} Transcript data with segments
   */
  async extractTranscript(videoUrl) {
    const response = await api.post('/video/transcript', { video_url: videoUrl });
    return response.data;
  },

  /**
   * Search for a topic in video transcripts
   * @param {string} query - Topic to search for
   * @param {string} videoUrl - YouTube video URL
   * @returns {Promise} Search results with timestamps and matching segments
   */
  async searchTopic(query, videoUrl) {
    const response = await api.post('/video/search', { query, video_url: videoUrl });
    return response.data;
  },

  /**
   * Get search history for current user
   * @returns {Promise} Array of past searches
   */
  async getHistory() {
    const response = await api.get('/video/history');
    return response.data;
  },

  /**
   * Generate AI notes from transcript
   * @param {string} transcriptId - ID of the transcript
   * @param {string} topic - Topic to generate notes about
   * @param {string} noteType - Type: 'short', 'bullet', 'exam', 'concepts', 'questions'
   * @returns {Promise} Generated notes
   */
  async generateNotes(transcriptId, topic, noteType = 'bullet') {
    const response = await api.post('/notes/generate', {
      transcript_id: transcriptId,
      topic,
      note_type: noteType,
    });
    return response.data;
  },

  /**
   * Get all saved notes for current user
   * @returns {Promise} Array of saved notes
   */
  async getNotes() {
    const response = await api.get('/notes/list');
    return response.data;
  },

  /**
   * Get a specific note by ID
   * @param {number} noteId 
   * @returns {Promise} Note data
   */
  async getNote(noteId) {
    const response = await api.get(`/notes/${noteId}`);
    return response.data;
  },

  /**
   * Delete a note
   * @param {number} noteId 
   * @returns {Promise} Deletion confirmation
   */
  async deleteNote(noteId) {
    const response = await api.delete(`/notes/${noteId}`);
    return response.data;
  },
};

export default videoService;
