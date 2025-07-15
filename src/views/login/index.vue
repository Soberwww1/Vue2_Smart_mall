<template>
  <div class="loginindex">
    <!-- 登录头 -->
    <van-nav-bar
      title="会员登录"
      left-text="返回"
      left-arrow
      @click-left="$router.back()"
    />

    <!-- 登录体 -->

    <!-- 登录标题 -->
    <div class="logincontent">
      <div class="logincontent_title">
        <p class="title">手机号登录</p>
        <p class="">未注册的手机号登录后将自动注册</p>
      </div>

    <!-- 提交表单 -->
    <form action="" class="logincontent_info">
      <div class="usernumber inputbox">
        <input v-model="UserNumber" type="text" placeholder="请输入手机号码">
      </div>
      <div class="verifyimg inputbox">
        <input v-model="PicCode" type="text" placeholder="请输入图形验证码">
        <img :src="VerifyImg" alt="" @click="getimg">
      </div>
      <div class="verifyimg inputbox">
        <input v-model="VerifySms" type="text" placeholder="请输入短信验证码">
        <!--
        给button绑定的点击函数得实现
        1、获取短信验证码功能
        2、点击倒计时60s
         -->
        <button @click="HandleVerify">{{ VerifyMsg }}</button>
      </div>
      <button @click="login" type="button" class="info_login">登录</button>
    </form>
    </div>
  </div>
</template>

<script>
// 导入vant组件
import { Toast } from 'vant'

// 导入辅助函数
import { mapMutations } from 'vuex'
// 导入api
import { getimg, getverifycode, login } from '@/api/login'
export default {
  name: 'LoginIndex',
  data () {
    return {
      // 用户输入的图片验证码PicCode
      PicCode: '',
      // 每次更新时进行数据请求，将最新的图片验证码更新到verifyimg
      VerifyImg: '',
      // 每传一图形验证码就会发送一个对应的key（辅佐验证）
      VerifyKey: '',
      // 用户手机号
      UserNumber: '',
      // 用户输入的短信验证码
      VerifySms: '',
      // 获取验证码按钮的展示信息
      VerifyMsg: '获取验证码',
      // 获取验证码按钮的节流开关
      VerifyFlag: false,
      // 定义定时器
      VerifyCount: null
    }
  },
  created () {
    // 页面一初始化，就赶紧请求数据获取图片验证码
    this.getimg()
  },
  methods: {
    // 获取图片验证码
    async getimg () {
      // 这里将数据请求的部分全部封装，以便复用
      const res = await getimg()
      // console.log(res.data)
      const { base64, key } = res.data
      this.VerifyImg = base64
      this.VerifyKey = key
      Toast('图片验证码刷新成功')
    },

    // 验证手机号、图形验证码格式 是否正确
    VerifyFn () {
      if (!/^1[3-9][0-9]{9}$/.test(this.UserNumber)) {
        Toast('请输入正确手机号码')
        return false
      }
      if (!/^[a-zA-Z0-9]{4}$/.test(this.PicCode)) {
        Toast('请输入正确的图形验证码')
        return false
      }
      return true
    },
    // 倒计时功能 + 节流（防止每次点击都会重新倒计时，一旦点击触发倒计时，就不能继续点击，直到倒计时结束）
    HandleFn () {
      if (!this.VerifyFlag) {
        let count = 30
        this.VerifyMsg = `${count}s后重新发送`
        this.VerifyFlag = true
        this.VerifyCount = setInterval(() => {
          count--
          this.VerifyMsg = `${count}s后重新发送`
          if (count === 0) {
            clearInterval(this.VerifyCount)
            this.VerifyMsg = '获取验证码'
            this.VerifyFlag = false
          }
        }, 1000)
      }
    },
    // 获取短信验证码（这里我有疑问，到底是在这里直接将参数传递了还是只写形参，之后在HandleVerify函数中再传递真正参数）
    async getverifycode (captchaCode, captchaKey, mobile) {
      const res = await getverifycode(captchaCode, captchaKey, mobile)
      console.log(res)
      const numbers = res.message.match(/\d+/g)
      Toast({
        message: `短信验证码:${numbers[0]}`,
        position: 'top'
      })
    },
    // 实现 点击获取验证码按钮后 倒计时60s + 获取短信验证码（前提是用户输入正确手机号+图形验证码验证成功）
    HandleVerify (event) {
      // 阻止默认提交事件
      event.preventDefault()
      // 编写判断条件 --- 点击获取短信验证码时会检查 手机号码是否正确输入、图片验证码是否正确输入 --- 全部正确核对后 Toast提示验证码
      if (this.VerifyFn()) {
        // 其实图形验证码也是在这个步骤进行验证的
        this.getverifycode(this.PicCode, this.VerifyKey, this.UserNumber)
        this.HandleFn()
      }
    },
    // 实现点击登录按钮，提交整个表单数据
    async login (event) {
      // 阻止默认提交事件
      event.preventDefault()
      // 真正login逻辑
      if (!this.VerifyFn()) {
        return
      }
      if (!/^[0-9]{6}$/.test(this.VerifySms)) {
        Toast('请输入正确的短信验证码')
        return
      }
      const res = await login(this.UserNumber, this.VerifySms)
      // 解构一下
      const { token, userId } = res.data
      // 使用辅助函数，将数据存储到vuex仓库
      // （至于刷新会不会将vuex数据清除，不用担心，在定义vuex的mutataion方法时已经将封装好的本地存储代码嵌入其中，每次更新存入vuex的数据也会同步更新到localstorage中）
      this.setUserInfo({ token, userId })

      // 实现登陆完毕跳转到/home --- 这里更新下 --- 加入说第一次打开登录，自然是登陆完就直接去首页，
      // 但是，当用户先浏览商品，并点开商品详情页然后跳转的登录页，此时为了更好的用户体验，应该再登录完毕后 再度跳转 之前的页面 --- 而之前的页面统一的关键字 --- backUrl

      // 这里有个小注意点 --- 这里跳转不要用 $router.push() ; 而是要用$router.replace()，$router.replace() 是将当前页面出 history栈 然后将目标页面压入栈中（相当于栈的长度不变，但是栈顶的元素变了）
      // 这是因为 $router.push(目标路由)就是将当前页面压入 history历史栈 中，再去目标页面，然后在目标页面带你返回也可以回到之前的页面
      // 但是这里不需要这样，为了用户体验考虑，这里跳转到登录页面肯定是要买东西（从购物车跳转的嘛），而商品详情页是从商品分类页或者首页商品列表跳转而来，
      // 在登录之后肯定是想直接加入购物车，但是push会将登录页也加入历史，那么在用户回到商品详情页时再返回就返回到了登录页，再返回才是商品分类页或者商品列表（严重影响体验）

      const url = this.$route.query.backUrl || '/home'
      this.$router.replace(url)
    },
    // 使用vuex辅助函数
    ...mapMutations('user', ['setUserInfo'])
  },
  // 退出界面后无论是验证码还是啥，直接关闭进程，防止浪费资源
  destroyed () {
    clearInterval(this.VerifyCount)
  }
}
</script>

<style lang="less" scoped>
.logincontent{
  margin-top: 30px;
  padding: 0 26px;
  .logincontent_title{
    // background-color: pink;
    p{
      color: #9d9797;
      margin-bottom: 10px;
    }
    .title{
      color: black;
      font-size: 30px;
    }
  }
  .logincontent_info{
    margin-top: 40px;
    .inputbox{
      color: #403c3c;
      width: 100%;
      height: 50px;
      margin-bottom: 20px;
      border-bottom: 0.5px solid #ccc;
      input{
        border: 0;
        width: 100%;
        height: 100%;
      }
    }
    .verifyimg,
    .verifyimg{
      input{
        width: 70%;
      }
      img,
      button{
        color: orange;
        width: 30%;
        background-color: #fff;
        border: 0;
        cursor: pointer;
      }
    }
    .info_login{
      background-color: orange;
      border: 0;
      width: 100%;
      height: 40px;
      border-radius: 20px;
      color: #fff;
      cursor: pointer;
      margin-top: 10px;
    }
  }
}
</style>
