// 导入获取购物车数据的API
import { getCartGoods, updateCartGoods, deleteCartGoods } from '@/api/cart'

// 这里是用户购物车信息仓库
export default {
  namespaced: true,
  state () {
    return {
      // 购物车商品列表存入vuex仓库
      cartlist: []
    }
  },
  mutations: {
    // 设置购物列表，直接将新获得的列表 重新替换 就列表
    setCartList (state, newlist) {
      /*
        这里注意：这里有一个很容易错的坑：
        在vue2中，对于动态添加的属性（就是事先未在state中声明的属性）是不会进行响应式更新的，如下列代码
        在setCartlist函数中，cartList已经被newlist替换了（原先是[]），但是在state.cartlist进行foreach循环时，不断给数组中每个
        元素添加一个新属性 isCheck ，因为没有实现声明，所以不会被响应式劫持，进而当鼠标点击复选框时页面的复选框也不会改变
        setCartList (state, newlist){
          state.cartlist = newlist
          state.cartlist.forEach(item => {
            item.isCheck = true
          })
        }，
        actions: {
          // 获取数据
          async getCartList (context) {
            const res = await getCartGoods()
            context.commit('setCartList', res.data.list)
          }
        },
      */
      newlist.forEach(item => {
        item.isCheck = true
      })
      state.cartlist = newlist
      // state.cartlist.forEach(item => {
      //   item.isCheck = true
      // })
    },
    // 设立点击时复选框状态
    toggleCheck (state, id) {
      state.cartlist.forEach(item => {
        if (item.goods_id === id) {
          item.isCheck = !item.isCheck
        }
      })
      // console.log(state.cartlist)
    },
    // 实现点击全选复选框控制所有小复选框
    toggleCheckAll (state, tempflag) {
      // console.log(tempflag)
      state.cartlist.forEach(item => {
        item.isCheck = !tempflag
      })
    }
  },
  actions: {
    // 获取购物车数据
    async getCartList (context) {
      const res = await getCartGoods()
      // res.data.list.forEach(item => {
      //   item.isCheck = true
      // })
      context.commit('setCartList', res.data.list)
    },
    // 更新购物车数据
    async updateCartList (context, obj) {
      const { goodsId, goodsNum, goodsSkuId } = obj
      // 更新后台数据
      await updateCartGoods(goodsId, goodsNum, goodsSkuId)
      // 这里是要更新vuex仓库，因为更新后台数据的接口中没有返回数据，所以只能再次调用 getCartList 方法，更新cartlist中数据
      context.dispatch('getCartList')
    },
    // 删除购物车选中的商品
    async deleteCartGoods (context) {
      // 先获取那些 isCheck已经是true的商品，然后直接用array.map函数返回只带有商品ID的 新数组 --- 奶奶滴，API文档也不写清楚，这个参数就是ID，我还以为是商品ID，搞得我排查半天错误🤮🤮🤮
      const cartIds = context.getters.isCheckGoodList.map(item => item.id)
      // 更新后台数据，同样也没有返回值
      await deleteCartGoods(cartIds)
      // 所以，对于vuex仓库的数据，就重新请求一遍后台进行更新
      context.dispatch('getCartList')
    }
  },
  getters: {
    // 实现商品总数统计等计算属性
    totalGoods (state) {
      return state.cartlist.reduce((sum, item) => {
        return sum + item.goods_num
      }, 0)
    },
    // 获取cartist中那些 isCheck是true 的元素（为后面删除选取商品做准备）
    isCheckGoodList (state) {
      return state.cartlist.filter(item => (item.isCheck === true))
    },
    // 获取cartist中那些 isCheck是true的元素，并且为他们计数
    isCheckGoodNumber (state, getters) {
      return getters.isCheckGoodList.reduce((sum, item) => (sum + item.goods_num), 0)
    },
    // 实现合计价格计算属性 先查找所有isCheck是true的复选框 再累加其价格
    isCheckTotalPrice (state, getters) {
      return getters.isCheckGoodList.reduce((sum, item) => {
        return sum + (item.goods_num * item.goods.goods_price_min)
        // toFixed(2)是想让所有计算的价格都保留两位小数，更规范
      }, 0).toFixed(2)
    },
    // 实现点击小复选框控制全选按钮
    isCheckAll (state) {
      const tempflag = state.cartlist.every(item => (item.isCheck === true))
      return tempflag
    }
  }
}
