import { createStore } from 'vuex'

export default createStore({
  state: {
    userProfile: null
  },
  getters: {
  },
  mutations: {
    setUserProfile(state, payload) {
      state.userProfile = payload
    }
  },
  actions: {
  },
  modules: {
  }
})
