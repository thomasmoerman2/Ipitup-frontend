import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    preferences: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    isOfflineMode: false
  }),

  getters: {
    getUser: state => state.user,
    getUserPreferences: state => state.preferences,
    isLoggedIn: state => state.isAuthenticated,
    hasError: state => state.error !== null
  },

  actions: {
    async initializeUser(userData) {
      try {
        this.loading = true;
        this.error = null;

        // Set user data
        this.user = userData;
        this.isAuthenticated = true;

        return true;
      } catch (error) {
        this.error = error.message;
        return false;
      } finally {
        this.loading = false;
      }
    },

    async loadUserPreferences(preferencesData) {
      try {
        this.loading = true;
        this.error = null;

        // Set preferences data
        this.preferences = preferencesData;

        return true;
      } catch (error) {
        this.error = error.message;
        return false;
      } finally {
        this.loading = false;
      }
    },

    clearUser() {
      this.user = null;
      this.preferences = null;
      this.isAuthenticated = false;
      this.error = null;
    },

    setError(error) {
      this.error = error;
    },

    clearError() {
      this.error = null;
    },

    setOfflineMode(value) {
      this.isOfflineMode = value;
    }
  }
});
