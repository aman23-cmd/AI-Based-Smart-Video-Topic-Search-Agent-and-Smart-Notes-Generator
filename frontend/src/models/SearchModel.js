/**
 * SearchModel — Data model for search and transcript state (MVP pattern).
 * Manages video search results, transcripts, and generated notes.
 */
class SearchModel {
  constructor() {
    this.transcript = null;
    this.searchResults = [];
    this.notes = [];
    this.currentNote = null;
    this.history = [];
    this.loading = false;
    this.error = null;
    this.videoInfo = null;
  }

  /**
   * Set transcript data
   * @param {Object} data - { id, video_id, video_url, video_title, transcript_text, segments }
   */
  setTranscript(data) {
    this.transcript = data;
    this.videoInfo = {
      id: data.video_id,
      url: data.video_url,
      title: data.video_title,
    };
    this.error = null;
  }

  /**
   * Set search results with timestamp matches
   * @param {Array} results - [{ text, start, end, similarity }]
   */
  setSearchResults(results) {
    this.searchResults = results;
    this.error = null;
  }

  /**
   * Set generated notes
   * @param {Object} note - { id, topic, content, type, key_concepts, questions }
   */
  setCurrentNote(note) {
    this.currentNote = note;
    this.error = null;
  }

  /**
   * Set notes list
   * @param {Array} notes
   */
  setNotes(notes) {
    this.notes = notes;
  }

  /**
   * Set search history
   * @param {Array} history
   */
  setHistory(history) {
    this.history = history;
  }

  /**
   * Clear all search state
   */
  reset() {
    this.transcript = null;
    this.searchResults = [];
    this.currentNote = null;
    this.videoInfo = null;
    this.error = null;
  }

  /**
   * Set error
   * @param {string} error
   */
  setError(error) {
    this.error = error;
  }

  /**
   * Set loading state
   * @param {boolean} loading
   */
  setLoading(loading) {
    this.loading = loading;
  }

  /**
   * Format timestamp seconds to MM:SS
   * @param {number} seconds
   * @returns {string}
   */
  static formatTimestamp(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Serialize to plain object (for React state)
   * @returns {Object}
   */
  toState() {
    return {
      transcript: this.transcript,
      searchResults: this.searchResults,
      notes: this.notes,
      currentNote: this.currentNote,
      history: this.history,
      loading: this.loading,
      error: this.error,
      videoInfo: this.videoInfo,
    };
  }
}

export default SearchModel;
