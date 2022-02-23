import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 初始的 state 数据
let initState = {
  // 登录成功之后的 token 信息
  tokenInfo: {},
  // 用户的基本信息
  user: {},
  // 用户的简介
  profile: {}
}

// 读取本地存储中的数据
const stateStr = localStorage.getItem('state')
// 判断是否有数据
if (stateStr) {
  initState = JSON.parse(stateStr)
}

export default new Vuex.Store({
  state: initState,
  mutations: {
    // 把 state 中的数据，持久化存储到 localStorage 中
    saveToStorage(state) {
      localStorage.setItem('state', JSON.stringify(state))
    },
    // 更新 token 的信息
    updateTokenInfo(state, payload) {
      state.tokenInfo = payload
      this.commit('saveToStorage')
    },
    // 更新用户的基本信息
    updateUserInfo(state, payload) {
      state.user = payload
      this.commit('saveToStorage')
    },
    // 更新用户的简介信息
    updateProfile(state, payload) {
      state.profile = payload
      this.commit('saveToStorage')
    },
    // 清空 state 中的关键数据
    cleanState(state) {
      state.tokenInfo = {}
      state.user = {}
      state.profile = {}
      // 清空本地存储
      window.localStorage.clear()
    }
  }
})
