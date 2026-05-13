import videoService from '../services/videoService';
import SearchModel from '../models/SearchModel';

/**
 * SearchPresenter — Business logic for video search and notes (MVP pattern).
 * Coordinates between the View (React component) and the Model (SearchModel).
 */
class SearchPresenter {
  constructor(updateView) {
    this.model = new SearchModel();
    this.updateView = updateView;
    this._notifyView();
  }

  /**
   * Push current model state to the view
   */
  _notifyView() {
    this.updateView(this.model.toState());
  }

  /**
   * Extract transcript from YouTube video URL
   * @param {string} videoUrl
   * @returns {Promise<boolean>}
   */
  async extractTranscript(videoUrl) {
    this.model.setLoading(true);
    this.model.setError(null);
    this._notifyView();

    try {
      const data = await videoService.extractTranscript(videoUrl);
      this.model.setTranscript(data);
      this._notifyView();
      return true;
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to extract transcript. Check the URL.';
      this.model.setError(message);
      this._notifyView();
      return false;
    } finally {
      this.model.setLoading(false);
      this._notifyView();
    }
  }

  /**
   * Search for a topic within the current video
   * @param {string} query
   * @param {string} videoUrl
   * @returns {Promise<boolean>}
   */
  async searchTopic(query, videoUrl) {
    this.model.setLoading(true);
    this.model.setError(null);
    this._notifyView();

    try {
      const data = await videoService.searchTopic(query, videoUrl);
      this.model.setSearchResults(data.results || []);
      this._notifyView();
      return true;
    } catch (err) {
      const message = err.response?.data?.error || 'Search failed. Please try again.';
      this.model.setError(message);
      this._notifyView();
      return false;
    } finally {
      this.model.setLoading(false);
      this._notifyView();
    }
  }

  /**
   * Generate AI notes from transcript
   * @param {string} transcriptId
   * @param {string} topic
   * @param {string} noteType
   * @returns {Promise<boolean>}
   */
  async generateNotes(transcriptId, topic, noteType = 'bullet') {
    this.model.setLoading(true);
    this.model.setError(null);
    this._notifyView();

    try {
      const data = await videoService.generateNotes(transcriptId, topic, noteType);
      this.model.setCurrentNote(data);
      this._notifyView();
      return true;
    } catch (err) {
      const message = err.response?.data?.error || 'Note generation failed.';
      this.model.setError(message);
      this._notifyView();
      return false;
    } finally {
      this.model.setLoading(false);
      this._notifyView();
    }
  }

  /**
   * Load saved notes list
   */
  async loadNotes() {
    try {
      const data = await videoService.getNotes();
      this.model.setNotes(data.notes || []);
      this._notifyView();
    } catch (err) {
      console.error('Failed to load notes:', err);
    }
  }

  /**
   * Load search history
   */
  async loadHistory() {
    try {
      const data = await videoService.getHistory();
      this.model.setHistory(data.history || []);
      this._notifyView();
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  }

  /**
   * Delete a note
   * @param {number} noteId
   */
  async deleteNote(noteId) {
    try {
      await videoService.deleteNote(noteId);
      await this.loadNotes();
    } catch (err) {
      console.error('Failed to delete note:', err);
    }
  }

  /**
   * Reset search state
   */
  reset() {
    this.model.reset();
    this._notifyView();
  }

  /**
   * Format timestamp utility
   * @param {number} seconds
   * @returns {string}
   */
  formatTimestamp(seconds) {
    return SearchModel.formatTimestamp(seconds);
  }
}

export default SearchPresenter;
