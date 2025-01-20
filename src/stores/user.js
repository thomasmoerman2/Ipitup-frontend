import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    isOfflineMode: false
  }),

  getters: {
    getUser: state => state.user,
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

    clearUser() {
      this.user = null;
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
