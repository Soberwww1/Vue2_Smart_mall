<template>
  <div class="user-container">
    <!-- 用户头 --- 点击登录 -->
    <div class="user-head">
      <!-- 用户头像 -->
      <img @click="login" :src="defaultimg" alt="">
      <!-- 是否登录 -->
      <div @click="login" class="islogin">
        <p>{{ nikeName }}</p>
        <p>{{ mobile }}</p>
      </div>
    </div>
    <!-- 账户信息 -->
    <div class="user-info">
      <van-grid :border="false" :column-num="4">
        <van-grid-item>
          <span class="active">{{ accountBalance }}</span>
          <!-- <span class="active">{{ '---' }}</span> -->
          <p>账户余额</p>
        </van-grid-item>
        <van-grid-item>
          <span class="active">{{ accountPoints }}</span>
          <p>积分</p>
        </van-grid-item>
        <van-grid-item>
          <span class="active">{{ accountCoupon }}</span>
          <p>优惠劵</p>
        </van-grid-item>
        <van-grid-item @click="skip('/purse')">
          <van-icon size="40" name="paid" />
          <p>我的钱包</p>
        </van-grid-item>
      </van-grid>
    </div>
    <!-- 用户订单需求 -->
    <div class="my-needs">
      <van-grid :border="false">
        <van-grid-item @click="skip('/myorder/all')">
          <van-icon size="35" name="description-o"/>
          <p>全部订单</p>
        </van-grid-item>
        <van-grid-item @click="skip('/myorder/payment')">
          <van-icon size="35" name="pending-payment"/>
          <p>待支付</p>
        </van-grid-item>
        <van-grid-item @click="skip('/myorder/delivery')">
          <van-icon size="35" name="logistics"/>
          <p>待发货</p>
        </van-grid-item>
        <van-grid-item @click="skip('/myorder/received')">
          <van-icon size="35" name="sign"/>
          <p>待收货</p>
        </van-grid-item>
      </van-grid>
    </div>
    <!-- 用户服务 -->
    <div class="my-service">
      <!-- 标题 -->
      <p class="title">我的服务</p>
      <van-grid :border="false" :column-num="4">
        <van-grid-item @click="skip('/address')">
          <van-icon size="35" color="red" name="guide-o"/>
          <p>收货地址</p>
        </van-grid-item>
        <van-grid-item @click="skip('/coupon')">
          <van-icon size="35" color="red" name="point-gift-o"/>
          <p>领劵中心</p>
        </van-grid-item>
        <van-grid-item @click="skip('/mycoupon')">
          <van-icon size="35" color="red" name="balance-pay"/>
          <p>优惠劵</p>
        </van-grid-item>
        <van-grid-item @click="skip('/help')">
          <van-icon size="35" color="red" name="service-o"/>
          <p>我的帮助</p>
        </van-grid-item>
        <van-grid-item @click="skip('/points')">
          <van-icon size="35" color="red" name="miniprogram-o"/>
          <p>我的积分</p>
        </van-grid-item>
        <van-grid-item @click="skip('/saleservice')">
          <van-icon size="35" color="red" name="smile-comment-o"/>
          <p>退换/售后</p>
        </van-grid-item>
        <van-grid-item/>
        <van-grid-item/>
      </van-grid>
    </div>
    <!-- 退出登录 -->
    <div v-if="$store.getters['user/token']" class="login-out">
      <button @click="canclelogin">退出登录</button>
    </div>
  </div>
</template>

<script>
// 导入vuex辅助函数
import { mapMutations } from 'vuex'

// 导入vant组件
import { Dialog } from 'vant'

// 导入默认头像
import defaultimg from '@/assets/default-avatar.png'

// 导入获取我的 --- 余额 --- 积分 --- 优惠劵
import { getInfo, getAsserts } from '@/api/user'

// 导入验证用户是否登录函数
import loginComfirm from '@/minxins/loginComfirm'
export default {
  name: 'LayoutUser',
  mixins: [loginComfirm],
  data () {
    return {
      defaultimg, // 图片
      userInfo: {}, // 用户信息列表
      userAssets: {} // 用户优惠劵信息
    }
  },
  async created () {
    // 登陆判断
    if (this.$store.getters['user/token']) {
      const { data: { userInfo } } = await getInfo()
      this.userInfo = userInfo || {}
      console.log(userInfo)
      const { data: { assets } } = await getAsserts()
      this.userAssets = assets
      console.log(assets)
    }
  },
  methods: {
    // 登录
    login () {
      if (!this.$store.getters['user/token']) {
        this.$router.replace('/login')
      }
    },
    // 跳转
    skip (path) {
      if (this.logincomfirm()) {
        return
      }
      this.$router.push(path)
    },
    // 退出登录
    canclelogin () {
      Dialog.confirm({
        title: '友情提示',
        message: '您确定要退出登录吗？'
      })
        .then(() => {
          this.setUserInfo({})
        })
        .catch(() => {})
    },
    // 辅助函数
    ...mapMutations('user', ['setUserInfo'])

  },
  computed: {
    islogin () {
      if (this.$store.getters['user/token']) {
        return true
      }
      return false
    },
    // 登录名
    nikeName () {
      if (this.islogin) {
        return this.userInfo.nick_name
      }
      return '未登录'
    },
    // 登录手机号
    mobile () {
      if (this.islogin) {
        return this.userInfo.mobile
      }
      return '点击登陆账号'
    },
    // 账户余额
    accountBalance () {
      if (this.islogin) {
        return this.userAssets.balance
      }
      return '---'
    },
    // 账户积分
    accountPoints () {
      if (this.islogin) {
        return this.userAssets.points
      }
      return '---'
    },
    // 优惠劵
    accountCoupon () {
      if (this.islogin) {
        return this.userAssets.coupon
      }
      return '---'
    }
  }

}
</script>

<!-- 样式 -->
<style lang="less" scoped>
// 公共变量
@text-color: #4a4848;
@font-size-normal: 16px;
@grid-margin: 10px;
@container-padding: 10px;

// 容器基础样式
.base-container {
  width: 100%;
  margin-bottom: @grid-margin;
  padding: 0 @container-padding;
}

// Grid 基础样式
.grid-base {
  border-radius: 20px;
  height: 100%;

  .van-grid-item {
    p {
      color: @text-color;
      font-size: @font-size-normal;
      margin-top: @grid-margin;
    }
  }
}

// 用户容器
.user-container {
  background-color: rgb(250, 250, 250);
  width: 100%;
}

// 用户头部
.user-head {
  padding: 20px @container-padding;
  height: 150px;
  display: flex;
  align-items: center;
  background: url("https://vcg05.cfp.cn/creative/vcg/800/new/VCG211509059836.jpg");

  img {
    height: 45px;
    margin-left: @container-padding;
    border-radius: 20px;
  }

  .islogin {
    margin-left: 20px;
    font-size: 12px;

    p:first-child {
      font-size: @font-size-normal;
      font-weight: bolder;
      margin-bottom: @grid-margin;
    }
  }
}

// 账户信息
.user-info {
  .base-container();
  height: 100px;

  .van-grid {
    height: 100%;

    .van-grid-item {
      // background-color: pink;
      width: 20px;
      &:last-child {
        .van-icon {
          margin-top: -10px;
        }
        p {
          margin-top: 5.5px;
        }
      }
    }
  }
}

// 用户需求
.my-needs {
  .base-container();
  height: 100px;

  .van-grid {
    .grid-base();
  }
}

// 用户服务
.my-service {
  .base-container();

  .title {
    font-size: @font-size-normal;
    padding: @container-padding;
    background-color: white;
  }

  .van-grid {
    .grid-base();
  }
}

// 退出登录按钮
.login-out {
  width: 100%;
  height: 100px;
  text-align: center;
  margin-top: 20px;

  button {
    width: 200px;
    height: 35px;
    color: @text-color;
    font-size: @font-size-normal;
  }
}

// 特殊字符样式
.active {
  color: red;
  font-size: 14px;
}
</style>
