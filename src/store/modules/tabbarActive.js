export default {
  namespaced: true,
  state () {
    return {
      active: 0 // Tabber的 active 状态
    }
  },
  mutations: {
    // 更改active值
    changeActive (state, value) {
      state.active = value
    }
  },
  getters: {}
}
