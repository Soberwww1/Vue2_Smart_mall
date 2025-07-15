<template>
  <div class="pay-container">
    <!-- 主页头部 -->
    <div class="pay-head">
      <van-nav-bar
      title="订单结算页"
      left-arrow
      fixed
      @click-left="$router.back()"
      />
    </div>

    <!-- 地址栏 -->
    <div class="pay-address">
      <!-- 左侧地址 -->
      <div class="left">
        <van-icon size="35px" name="location-o" />
        <!-- 用户信息 上收货名，电话号码 --- 下收货地址 -->
        <div class="user-info" v-if="selectedAddress.address_id">
          <p class="info"><span class="username">{{ username }}</span><span class="usernumber">{{ userphone }}</span></p>
          <p class="address">{{ detailAddress }}</p>
        </div>
        <p v-else style="font-size: 18px;">请选择配送地址</p>
      </div>
      <!-- 右侧按钮 --- 去往地址编辑 -->
      <div class="right">{{ '&gt;' }}</div>
    </div>

    <!-- 订单 -->
    <div class="pay-content" v-if="order.goodsList">
      <div class="good-item" v-for="item in order.goodsList" :key="item.goods_id" @click="$router.push(`/prodetail?item=${item.goods_id}`)">
        <!-- 商品左侧 -->
        <div class="item-left">
          <!-- 商品图片 -->
          <img :src="item.goods_image" alt="">
        </div>
        <!-- 商品右侧 -->
        <div class="item-right">
          <!-- 商品标题 -->
          <div class="item-title text-elipsis-2">{{ item.goods_name }}</div>
          <!-- 商品信息 -->
          <div class="item-info">
            <!-- 售出数量 -->
            <span class="sale-num">x{{ item.total_num }}</span>
            <!-- 售出价格 -->
            <span class="item-price price-active">￥{{ item.goods_price_max }}</span>
          </div>
        </div>
      </div>
      <!-- 订单总数 -->
      <div class="goods_total">共{{ totalGoodsNumber }}件商品，合计：<span class="price-active">￥{{  totalGoodsPrice }}</span></div>
    </div>

    <!-- 订单总金额 -->
    <div class="total-prixe" v-if="order">
      <div class="pay-price"><span>订单总金额：</span><span class="price-active">￥{{ order.orderTotalPrice }}</span></div>
      <div class="discount-coupons" v-if="order.couponList"><span>优惠劵：</span><span class="price-active">有{{ order.couponList.length }}张优惠劵</span></div>
      <div class="delivery-fee"><span>配送费：</span><span class="price-active">￥{{ order.expressPrice }}</span></div>
    </div>

    <!-- 支付方式 -->
    <div class="pay-tool">
      <p>支付方式</p>
      <van-radio-group v-model="radio">
        <van-radio name="1" shape="square">
          <div class="balance-pay">
            <van-icon size="30px" name="balance-pay" />
            <span>余额支付（可用￥{{ personal.balance }}元）</span>
          </div>
        </van-radio>
      </van-radio-group>
    </div>

    <!-- 买家留言 -->
    <div class="buyer-message">
      <textarea v-model="remark" placeholder="买家留言（50字以内）"></textarea>
    </div>
    <!-- 订单结算 -->
    <div class="footer-fixed">
      <div class="left">实付款：<span>￥{{ order.orderTotalPrice }}</span></div>
      <div class="tipsbtn" @click="submitOrder">提交订单</div>
    </div>
  </div>
</template>

<script>
import { checkOrder, submitOrder } from '@/api/pay'

// 获取查询用户地址的API
import { getAddress, getDefaultAddressID } from '@/api/address'

export default {
  name: 'PayIndex',
  data () {
    return {
      addressList: [], // 收货地址列表
      defaultAddress: [], // 默认地址对象
      order: {}, // 收集商品信息
      personal: {}, // 用户信息
      setting: {}, // 积分信息
      radio: 1,
      remark: '' // 买家留言
    }
  },
  created () {
    /*
      今日任务：
      1、订单结算页静态页面完成
      2、cart购物车商品结算 --- 跳转订单结算页
      3、商品详情页商品购买 ---跳转订单结算页
      4、我的页面静态页面完成
    */

    // 获取用户地址
    this.getAddress()
    // 获取订单信息
    this.checkOrder()
  },
  methods: {
    // 获取用户地址列表 + 用户默认地址ID
    async getAddress () {
      // 获取用户地址列表
      const { data: { list } } = await getAddress()
      this.addressList = list || [] // 因为一开始不会给你分配初始地址，防止地址为空
      console.log(list)
      // 一开始没有默认地址，默认添加的第一个收货地址就是默认地址
      if (list) {
        // 获取默认地址ID，因为一个用户可以有多个地址，但是默认收货地址只能是一个
        const { data: { defaultId } } = await getDefaultAddressID()
        this.defaultAddress = list.filter(item => (item.address_id === defaultId))
        console.log(this.defaultAddress)
      }
    },
    // 页面渲染开始就得从后台数据库中拉取数据进行订单确认
    async checkOrder () {
      let mode = ''
      let obj = {}
      // 先判断传来的是 购物车 还是 立即购买
      if (this.$route.query.mode === 'cart') {
      // 传输参数时将mode
        obj = { cartIds: this.$route.query.cartIds }
        mode = 'cart'
      }
      if (this.$route.query.mode === 'buyNow') {
        obj = {
          goodsId: this.$route.query.goodsId,
          goodsNum: this.$route.query.goodsNum,
          goodsSkuId: this.$route.query.goodsSkuId
        }
        mode = this.$route.query.mode
      }
      // console.log(mode)
      // console.log(obj)
      const res = await checkOrder(mode, obj)
      // console.log(res)
      const { data: { order, personal, setting } } = res
      this.order = order // 导入
      this.personal = personal
      this.setting = setting
      // console.log(order)
    },
    // 订单提交方法 --- 点击提交订单进行数据提交
    async submitOrder () {
      let mode = ''
      let obj = {}
      // 先判断传来的是 购物车 还是 立即购买
      if (this.$route.query.mode === 'cart') {
      // 传输参数时将mode
        obj = {
          cartIds: this.$route.query.cartIds,
          remark: this.remark
        }
        mode = 'cart'
      }
      if (this.$route.query.mode === 'buyNow') {
        obj = {
          goodsId: this.$route.query.goodsId,
          goodsNum: this.$route.query.goodsNum,
          goodsSkuId: this.$route.query.goodsSkuId,
          remark: this.remark
        }
        mode = 'buyNow'
      }
      await submitOrder(mode, obj)
      this.$router.replace('/myorder')
    }
  },
  computed: {
    // 获取默认用户信息
    selectedAddress () {
      return this.defaultAddress[0] || {}
    },
    // 使用detailAddress计算属性获取用户地址
    detailAddress () {
      const tempaddress = this.selectedAddress.region
      return tempaddress.province + tempaddress.city + tempaddress.region
    },
    username () {
      return this.selectedAddress.name
    },
    userphone () {
      return this.selectedAddress.phone
    },
    // 获取商品数
    totalGoodsNumber () {
      const number = this.order.goodsList.reduce((sum, item) => {
        return sum + item.total_num
      }, 0)
      return number
    },
    // // 获取商品总价
    totalGoodsPrice () {
      const price = this.order.goodsList.reduce((sum, item) => {
        return sum + (item.total_num * item.goods_price)
      }, 0).toFixed(2)
      return Number(price)
    }
  }

}
</script>

<style lang="less" scoped>
// 全局样式
.pay-container{
  width: 100%;
  padding-top: 46px;
  padding-bottom: 50px;
  background-color: rgb(250, 250, 250);
}

// 头
.van-nav-bar{
    z-index: 999;
    background-color: rgb(250, 250, 250);
    /deep/ .van-nav-bar__title{
    font-size: 20px;
    font-weight: bold;

  }
}
// 地址栏
.pay-address{
  position: relative;
  width: 100%;
  height: 70px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  // background-color: skyblue;
  background-color: rgb(250, 250, 250);
  // 添加条纹边框
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 5px;
    background-image: linear-gradient(
      45deg,
      #4dabf7 25%,
      #ff6b6b 25%,
      #ff6b6b 50%,
      #4dabf7 50%,
      #4dabf7 75%,
      #ff6b6b 75%
    );
    background-size: 8px 8px;
  }
  // 左边地址个人信息
  .left{
    display: flex;
    align-items: center;
    .van-icon{
      margin-right: 10px;
    }
    .user-info{
      font-size: 16px;
      .info span{
        margin-right: 5px;
      }
      .address{
        margin-top: 3px;
        color: rgb(119, 119, 119);
      }
    }
  }
  // 右边按钮 --- 跳转到地址编辑页
  .right{
    font-size: 20px;
    color: rgb(119, 119, 119);
  }
}

// 订单
.pay-content{
  // height: 100vh;
  margin-top: 20px;
  .good-item{
    width: 100%;
    height: 148px;
    font-size: 12px;
    padding: 0 10px;
    border-bottom: 12px solid rgb(246, 246, 246);
    display: flex;
    cursor: pointer;
    .item-left{
      width: 35%;
      background-color: skyblue;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .item-right{
      width: 60%;
      margin-left: 3%;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      .item-title{
        width: 100%;
        height: 39px;
        font-size: 14px;
      }
      .item-info{
        color: #999;
        font-size: 16px;
        display: flex;
        justify-content: space-between;
        .item-price{
          margin-right: 10px;
        }
      }
    }
  }
  .goods_total{
    height: 40px;
    line-height: 40px;
    text-align: end;
    // background-color: skyblue;
    background-color: white;
    padding-right: 10px;
  }
}

// 订单总金额
.total-prixe{
  margin-top: 10px;
  background-color: white;
  div{
    padding: 5px 10px 5px;
    display: flex;
    justify-content: space-between;
  }
}

// 支付方式
.pay-tool{
  padding: 0 10px;
  margin-top: 10px;
  background-color: white;
  .balance-pay{
    margin-top: 10px;
    .van-icon{
      margin-right: 10px;
    }
  }
}

// 买家留言
.buyer-message{
  margin: 10px 0;
  background-color: white;
  padding: 10px;
  textarea{
    width: 100%;
    height: 100px;
  }
}

// 订单结算
.footer-fixed {
  position: fixed;
  background-color: #fff;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 46px;
  line-height: 46px;
  border-top: 1px solid #efefef;
  font-size: 14px;
  display: flex;
  .left {
    flex: 1;
    padding-left: 12px;
    color: #666;
    span {
      color:#fa2209;
    }
  }
  .tipsbtn {
    width: 121px;
    background: linear-gradient(90deg,#f9211c,#ff6335);
    color: #fff;
    text-align: center;
    line-height: 46px;
    display: block;
    font-size: 14px;
  }
}

.price-active{
  color: red;
  font-size: 16px;
}
</style>
