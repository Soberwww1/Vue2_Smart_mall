<template>
  <div class="product-detail-container">
      <!-- 商品页头部 -->
      <div class="product-head">
        <van-nav-bar
        title="商品详情页"
        left-arrow
        fixed
        @click-left="$router.back()" />
      </div>

      <!-- 轮播图 -->
      <div class="product-swiper">
        <van-swipe @change="onChange" class="my-swipe" :autoplay="3000" :touchable=true indicator-color="#333">
          <van-swipe-item v-for="(item,index) in itemImage" :key="index">
            <img v-lazy="item.external_url" alt="">
          </van-swipe-item>
          <!-- 指示滑块 -->
          <template #indicator>
            <div class="custom-indicator">{{ current + 1 }} / {{ itemImage.length }}</div>
          </template>
        </van-swipe>
      </div>

      <!-- 商品说明 -->
      <div class="product-describe">
        <!-- 商品价格 + 商品库存 -->
        <div class="item-top">
          <div class="left-price">
            <span class="new">￥{{ itemDetail.goods_price_min }}</span>
            <span class="old">￥{{ itemDetail.line_price_max }}</span>
          </div>
          <div class="right-quantity">
            <span>已售{{ itemDetail.goods_sales }}件</span>
          </div>
        </div>
        <!-- 商品描述 -->
        <p class="item-desc text-elipsis-2">{{ itemDetail.goods_name }}</p>
        <!-- 小说明 -->
        <div class="item-attent-point">
          <van-icon color="red" name="passed">
            <span>七天无理由退货</span>
          </van-icon>
          <van-icon color="red" name="passed">
            <span>48小时发货</span>
          </van-icon>
        </div>
      </div>

      <!-- 商品评论 -->
      <div class="product-comment">
        <div class="comment-head">
          <span>商品评价({{ total }})条</span>
          <button>查看更多&gt;</button>
        </div>
        <div class="comment-content" v-for="item in commentlist" :key="item.comment_id">
          <div class="content-top">
            <!-- 用户头像 -->
            <img :src='item.user.avatar_url || defaultimg' alt="">
            <!-- 用户名 -->
            <p class="username">{{ item.user.nick_name }}</p>
            <!-- 评分系统 -->
            <van-rate
            :value="item.score/2"
            :size="25"
            :allow-half="true"
            :readonly="true"
            color="#ffd21e"
            void-icon="star"
            void-color="#eee"
            />
          </div>
          <!-- 评论 -->
          <p class="usercomment text-elipsis-2">{{ item.content }}</p>
          <!-- 发布时间 -->
          <p class="commit-time">{{ item.create_time }}</p>
        </div>
      </div>

      <!-- 商品描述 -->
      <div v-html="itemDetail.content" class="content"></div>

      <!-- 商品购买 or 加入购物车 -->
      <van-goods-action>
        <van-goods-action-icon icon="chat-o" text="客服" @click="onClickIcon" />
        <van-goods-action-icon icon="cart-o" text="购物车" @click="skipcart" />
        <van-goods-action-icon icon="shop-o" text="店铺" @click="onClickIcon" />
        <van-goods-action-button type="warning" text="加入购物车" @click="onClickButton('cart')" />
        <van-goods-action-button type="danger" text="立即购买" @click="onClickButton('buy')"/>
      </van-goods-action>

      <!-- 公共弹层 --- 加入购物车\立即购买 -->
      <van-action-sheet v-model="show">
        <div class="content">
          <!-- 弹出框顶端 -->
          <div class="content-top">
            <!-- 左边图片 -->
            <img :src="itemDetail.goods_image" alt="">
            <!-- 中间 价格 & 库存 -->
            <div class="middle-price">
              <p class="item-price">￥{{ itemDetail.goods_price_max }}</p>
              <p class="item-quantity">库存：{{ itemDetail.stock_total }}</p>
            </div>
            <!-- 右边叉号❌ -->
            <div @click="show = false" class="right-dispear">
              <van-icon name="cross" />
            </div>
          </div>
          <!-- 弹出框中间 --- 购买数量  + or - -->
          <div class="content-center">
            <span>数量</span>
            <CountBox v-model="CountNumber"></CountBox>
          </div>
          <!-- 购买按钮 -->
          <button v-if="mode === 'cart'" class="content-bottom cart" @click="addCart">加入购物车</button>
          <button v-else class="content-bottom buy" @click="goBuyNow">立即购买</button>
        </div>
      </van-action-sheet>
  </div>
</template>

<script>
// 导入Dialog 提示框
import { Toast } from 'vant'

// 导入自定义的商品详情页获取API
import { getProductItem, getCommit } from '@/api/product'

// 导入自定义的加入购物车API
import { addCart } from '@/api/cart'

// 导入图片 奶奶滴，原来本地图片还要导入而不能使用相对位置吗😓😓😓
import defaultimg from '@/assets/default-avatar.png'
// 导入自定义组件 --- 数字加减框
import CountBox from '@/components/CountBox.vue'

// 导入自定义验证是否本地登录函数
import loginComfirm from '@/minxins/loginComfirm'

// 导入vuex辅助函数
import { mapMutations } from 'vuex'
export default {
  name: 'ProductDetailIndex',
  mixins: [loginComfirm],
  components: {
    CountBox
  },
  data () {
    return {
      itemDetail: '', // 特定ID商品页所有数据对象
      itemImage: [], // 轮播图片列表
      commentlist: [], // 评论列表
      total: 0, // 评论总数
      defaultimg,
      current: 0,
      show: false, // 控制弹层是否弹出，true弹出，false隐藏
      mode: 'cart',
      CountNumber: 1 // 数字框
    }
  },
  methods: {
    // 控制轮播指示器
    onChange (index) {
      this.current = index
    },
    // onclickicon、onclickbutton是商品购买的部分的方法
    // 点击图标
    onClickIcon () {
      Toast('功能开发中，敬请期待!!!')
    },
    // 商品详情跳转购物车 --- 保持对应导航栏高亮
    skipcart () {
      this.$router.push('/cart')
      // 向vuex仓库传递active更新值
      this.changeActive(2)
    },
    // 点击购买、加入购物车 按钮
    onClickButton (key) {
      if (key === 'cart') {
        this.mode = 'cart'
      } else {
        this.mode = 'buy'
      }
      this.show = true
    },
    // 设置弹框弹出来的确认键，这里是真正的加入 购物车 & 立即购买
    // 设置加入购物车
    async addCart () {
      // if (!this.$store.getters['user/token']) {
      //   Dialog.confirm({
      //     title: '温馨提示',
      //     message: '此时此刻需要您先登录哦',
      //     confirmButtonText: '去登陆',
      //     cancelButtonText: '再逛会'
      //   })
      //     // 确认按钮 --- 此处就是对应着 去登陆
      //     .then(() => {
      //       // 那么现在没有登录就是要跳转登陆页面登录
      //       // 这里有个小注意点 --- 这里跳转不要用 $router.push() ; 而是要用$router.replace()，$router.replace() 是将当前页面出 history栈 然后将目标页面压入栈中（相当于栈的长度不变，但是栈顶的元素变了）
      //       // 这是因为 $router.push(目标路由)就是将当前页面压入 history历史栈 中，再去目标页面，然后在目标页面带你返回也可以回到之前的页面
      //       // 但是这里不需要这样，为了用户体验考虑，这里跳转到登录页面肯定是要买东西（从购物车跳转的嘛），而商品详情页是从商品分类页或者首页商品列表跳转而来，
      //       // 在登录之后肯定是想直接加入购物车，但是push会将登录页也加入历史，那么在用户回到商品详情页时再返回就返回到了登录页，再返回才是商品分类页或者商品列表（严重影响体验）
      //       this.$router.replace({
      //         path: '/login',
      //         query: {
      //           // 此处就是将该页面的url传递给登录页面，然后当登录完成 再跳转到本页面
      //           backUrl: this.$route.fullPath
      //         }
      //       })
      //     })
      //     // 取消按钮 --- 此处就是对应着 再逛会 --- 此时既然是取消，就不必再做什么
      //     .catch(() => {})

      //   return // 这里
      // }
      if (this.logincomfirm()) {
        return
      }
      const res = await addCart(this.itemDetail.goods_id, this.CountNumber, this.itemDetail.skuList[0].goods_sku_id)
      console.log(res)
      Toast(res.message)
    },
    // 设置立即购买
    goBuyNow () {
      if (this.logincomfirm()) {
        return
      }
      // 跳转到订单详情页中
      // const obj = { goodsId: this.itemDetail.goods_id, goodsNum: this.CountNumber, goodsSkuId: this.itemDetail.skuList[0].goods_sku_id }
      this.$router.push({
        path: '/pay',
        query: {
          mode: 'buyNow',
          goodsId: String(this.itemDetail.goods_id),
          goodsNum: this.CountNumber,
          goodsSkuId: this.itemDetail.skuList[0].goods_sku_id
        }
      })
    },
    // 导入控制对应导航栏高亮的辅助函数
    ...mapMutations('tabbarActive', ['changeActive'])
  },
  async created () {
    // 这是获取特定ID的商品
    const res = await getProductItem(this.$route.query.item)
    // 这是获取特定ID的商品的 --- 商品评论
    const commitresult = await getCommit(this.$route.query.item, 3)
    const { data: { detail } } = res
    const { data: { list, total } } = commitresult
    this.itemDetail = detail
    this.itemImage = detail.goods_images
    this.total = total
    this.commentlist = list
    // console.log(this.commentlist)
    // console.log(res)
    console.log(detail)
  }

}
</script>

<style lang="less" scoped>
// 综合主体
.product-detail-container{
  width: 100%;
  height: 100vh;
  padding-top: 46px; // 为固定定位的头部预留空间
  background-color: rgb(247, 247, 247);
}
// 头
.van-nav-bar{
  z-index: 9999;
  /deep/ .van-nav-bar__title{
    color: black;
    font-size: 20px;
    font-weight: bold;
  }
}

// 轮播图
/deep/.my-swipe{
  // 轮播主体
  .van-swipe-item {
    width: 100%;
    img{
      width: 100%;
    }
  }
  // 麻痹的轮播指示符 --- 根本没搞清楚这个JB玩意
  .custom-indicator{
    position: absolute;
    right: 10px;
    bottom: 40px;
    padding: 5px 10px;
    font-size: 16px;
    color: white;
    background-color: rgba(74, 70, 70, 0.41);
    border-radius: 15px;
  }
}

// 商品说明
.product-describe{
  background-color: white;
  padding: 10px;
  width: 100%;
  // 商品价格 --- 商品销售量
  .item-top{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-self: center;
    color: #999;
    font-size: 16px;
    // 左边价格
    .left-price{
      .new{
        font-size: 20px;
        color: #f03c3c;
        margin-right: 10px;
      }
      .old{
        text-decoration: line-through;
      }
    }
  }
  // 商品描述
  .item-desc{
    padding: 5px 0 10px 0;
    width: 100%;
    height: 50px;
    font-size: 16px;
  }
  // 小说明 --- 七天无理由xxx
  .item-attent-point{
    width: 100%;
    height: 50px;
    line-height: 50px;
    background-color: rgb(250, 250, 250);
    .van-icon{
      margin-left: 10px;
      span{
        color: #333;
      }
    }
  }
}

// 商品评论
.product-comment{
  width: 100%;
  // padding: 10px;
    background-color: white;
  // 商品评价（xxx）条 --- 查看更多！！！
  .comment-head{
    padding: 0 5px;
    width: 100%;
    height: 30px;
    line-height: 30px;
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    button{
      color: #999;
      font-size: 14px;
      padding: 0;
      margin: 0;
      border: 0;
      list-style: none;
      background-color: transparent;
    }
  }
  .comment-content{
    padding: 10px;
    margin-bottom: 10px;
    background-color: rgb(250, 250, 250);
    // 用户头像-用户名-评分
    .content-top{
      width: 100%;
      height: 40px;
      // background-color: tomato;
      display: flex;
      justify-content: start;
      align-items: center;
      img,
      .username{
        height: 30px;
        line-height: 30px;
      }
      .username{
        margin: 0 10px;
      }
    }
    // 评论
    .usercomment{
      width: 100%;
      height: 51px;
      font-size: 18px;
      // background-color: gold;
    }
    // 评价时间
    .commit-time{
      // background-color: pink;
      font-size: 14px;
      color: #999;
    }
  }
}

//底部商品购买 or 加入购物车

// 购买 or 加入购物车 弹出框
.van-action-sheet{
  padding: 15px 10px 10px;
  width: 100%;
  height: 300px;
  .content{
    .content-top{
      display: flex;
      justify-content: start;
      align-items: center;
      img{
        height: 110px;
      }
      .middle-price{
        margin-left: 20px;
        // background-color: skyblue;
        p{
          font-size: 22px;
          color: #f03c3c;
        }
        .item-quantity{
          font-size: 14px;
          color: #999;
        }
      }
      .right-dispear{
        position: absolute;
        top: 15px;
        right: 15px;
        font-size: 20px;
        // background-color: pink;
      }
    }
    .content-center{
      width: 100%;
      margin: 10px 0;
      // background-color: pink;
      font-size: 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .content-bottom{
      border: 0;
      border-radius: 30px;
      background-color: rgb(254, 86, 10);
      color: white;
      font-size: 20px;
      display: block;
      width: 300px;
      height: 48px;
      margin: 80px auto 0;
    }
    .cart{
      background-color: rgb(255, 148, 2);
    }
  }
}

</style>
