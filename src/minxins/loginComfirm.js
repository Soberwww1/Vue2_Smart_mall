import { Dialog } from 'vant'
// 自定义验证本地登录函数

export default {
  created () {},
  data () {
    return {}
  },
  methods: {
    logincomfirm () {
      if (!this.$store.getters['user/token']) {
        Dialog.confirm({
          title: '温馨提示',
          message: '此时此刻需要您先登录哦',
          confirmButtonText: '去登陆',
          cancelButtonText: '再逛会'
        })
          // 确认按钮 --- 此处就是对应着 去登陆
          .then(() => {
            // 那么现在没有登录就是要跳转登陆页面登录
            // 这里有个小注意点 --- 这里跳转不要用 $router.push() ; 而是要用$router.replace()，$router.replace() 是将当前页面出 history栈 然后将目标页面压入栈中（相当于栈的长度不变，但是栈顶的元素变了）
            // 这是因为 $router.push(目标路由)就是将当前页面压入 history历史栈 中，再去目标页面，然后在目标页面带你返回也可以回到之前的页面
            // 但是这里不需要这样，为了用户体验考虑，这里跳转到登录页面肯定是要买东西（从购物车跳转的嘛），而商品详情页是从商品分类页或者首页商品列表跳转而来，
            // 在登录之后肯定是想直接加入购物车，但是push会将登录页也加入历史，那么在用户回到商品详情页时再返回就返回到了登录页，再返回才是商品分类页或者商品列表（严重影响体验）
            this.$router.replace({
              path: '/login',
              query: {
              // 此处就是将该页面的url传递给登录页面，然后当登录完成 再跳转到本页面
                backUrl: this.$route.fullPath
              }
            })
          })
          // 取消按钮 --- 此处就是对应着 再逛会 --- 此时既然是取消，就不必再做什么
          .catch(() => {})
      }
    }
  },
  computed: {},
  watch: {}
}
