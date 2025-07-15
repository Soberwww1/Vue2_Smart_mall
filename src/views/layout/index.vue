<template>
    <div class="layoutindex">
        <router-view></router-view>

        <van-tabbar router v-model="active" active-color="#ee0a24" inactive-color="#000">
            <van-tabbar-item to="/home" icon="wap-home-o">首页</van-tabbar-item>
            <van-tabbar-item to="/category/:key?" icon="apps-o">分类页</van-tabbar-item>
            <van-tabbar-item to="/cart" icon="shopping-cart-o">购物车</van-tabbar-item>
            <van-tabbar-item to="/user" icon="manager-o">我的</van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script>
export default {
  name: 'LayoutIndex',
  computed: {
    active: {
      get () {
        return this.$store.state.tabbarActive.active
      },
      set (value) {
        this.$store.commit('tabbarActive/changeActive', value)
      }
    }
  }

}
</script>

<style lang="less" scoped>

</style>
