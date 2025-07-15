import { getinfo, setinfo } from '@/utils/storage'

// 这里是用户个人信息仓库
export default {
  namespaced: true,
  state () {
    return {
      // 每当vuex仓库初始化，会从本地自动搜寻是否存储数据，存了数据就获取
      // （getinfo函数中已经包括未存数据应该怎么办的情况了），正是有了这个初始化就获取数据方法的定义，
      // 不管怎么刷新，vuex仓库数据都会随localstorage更新
      userinfo: getinfo()
    }
  },
  mutations: {
    setUserInfo (state, userobj) {
      // 将获得的数据更新 vuex仓库
      state.userinfo = userobj
      // 同时也更新本地存储数据
      setinfo(userobj)
    }
  },
  actions: {
  },
  getters: {
    token (state) {
      return state.userinfo.token
    }
  }
}
