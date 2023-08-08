import { createStore } from 'vuex'
import router from '../router'

export default createStore({
  state: {
    sidebarVisible: '',
    sidebarUnfoldable: false,
    isAuthenticated:
      localStorage.getItem('isAuthenticated') === 'true' || false,
    lastActivityTimestamp:
      localStorage.getItem('lastActivityTimestamp') || null,
  },
  mutations: {
    toggleSidebar(state) {
      state.sidebarVisible = !state.sidebarVisible
    },
    toggleUnfoldable(state) {
      state.sidebarUnfoldable = !state.sidebarUnfoldable
    },
    updateSidebarVisible(state, payload) {
      state.sidebarVisible = payload.value
    },
    setIsAuthenticated(state, value) {
      state.isAuthenticated = value
      localStorage.setItem('isAuthenticated', value)
    },
    updateLastActivityTimestamp(state) {
      state.lastActivityTimestamp = Date.now().toString()
      localStorage.setItem('lastActivityTimestamp', state.lastActivityTimestamp)
    },
    clearAuthentication(state) {
      state.isAuthenticated = false
      state.lastActivityTimestamp = null
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('lastActivityTimestamp')
    },
  },
  actions: {
    login({ commit }) {
      // Perform login logic
      // Upon successful login:
      commit('setIsAuthenticated', true)
      commit('updateLastActivityTimestamp')
    },
    logout({ commit }) {
      // Perform logout logic
      // Upon successful logout:
      commit('clearAuthentication')
    },
    checkAuthenticationTimeout({ state, commit }) {
      const currentTime = Date.now()
      const lastActivityTime = parseInt(state.lastActivityTimestamp)
      if (
        state.isAuthenticated &&
        lastActivityTime &&
        currentTime - lastActivityTime > 900000 // 15 minute in milliseconds
      ) {
        commit('clearAuthentication')
        router.push('/pages/login')
      }
    },
  },
  modules: {},
  getters: {
    isAuthenticated: (state) => state.isAuthenticated,
  },
  plugins: [
    (store) => {
      store.subscribe((mutation) => {
        if (mutation.type !== 'updateLastActivityTimestamp') {
          store.dispatch('checkAuthenticationTimeout')
        }
      })
    },
  ],
})
