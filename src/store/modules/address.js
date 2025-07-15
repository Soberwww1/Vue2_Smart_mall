// 导入自定义获取地址数据API
import { getAddress } from '@/api/address'

// 获取后台用户登录地址数据
export default {
  namespaced: true,
  state () {
    return {
      // 地址列表
      addressList: []
    }
  },
  mutations: {
    // 设置存入地址列表数据
    setAddress (state, array) {
      state.addressList = array
    }
  },
  actions: {
    // 拉取数据，更新地址列表
    async getAddress (context) {
      const res = await getAddress()
      context.commit('setAddress', res.data.list)
    }
  },
  getters: {}

}
