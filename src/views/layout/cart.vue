<template>
  <div class="cart-container">
     <!-- 购物车头部 -->
     <div class="cart-head">
      <van-nav-bar title="购物车" fixed/>
    </div>

    <!-- 商品总数 & 编辑 -->
    <div v-if="this.token && this.cartlist.length !== 0" class="cart-countnumber">
      <p>共<span>{{ totalGoods }}</span>件商品</p>
      <p class="cart-edit" @click="cartEdit">
        <van-icon v-if="isEditflag" name="edit" />
        <span v-if="isEditflag">编辑</span>
        <span v-else style="color: red;">完成</span>
      </p>
    </div>

    <!-- 购物车商品 -->
    <div class="cartlist-content" v-if="this.token && this.cartlist.length !== 0">
      <!-- 真正的商品内容 -->
      <div class="cartlist-item" v-for="item in cartlist" :key="item.goods_id">
        <!-- 左侧按钮 -->
        <div class="checkbox">
          <van-checkbox :value="item.isCheck" @click="toggleCheck(item.goods_id)" checked-color="rgb(250, 34, 9)" icon-size="20px"/>
        </div>
        <!-- 商品页 -->
        <div class="good-item">
          <!-- 商品左侧 -->
          <div class="item-left" @click="$router.push(`/prodetail?item=${item.goods_id}`)">
            <!-- 商品图片 -->
            <img :src="item.goods.goods_image" alt="">
          </div>
          <!-- 商品右侧 -->
          <div class="item-right">
            <!-- 商品标题 -->
            <div class="item-title text-elipsis-2" @click="$router.push(`/prodetail?item=${item.goods_id}`)">{{ item.goods.goods_name }}</div>
            <!-- 商品价格 -->
            <div class="item-price">
              <!-- 售出价格 -->
              <span class="new">￥{{ item.goods.goods_price_max }}</span>
              <!-- CountBox组件 -->
              <!-- 本来想直接通过辅助函数直接获取一个包裹item.goods_id, EmitValue, item.goods_sku_id的对象，但是不知道为啥在括号中再包对象时识别不了item.xxx😓😓😓 -->
              <CountBox :value="item.goods_num" @input="(EmitValue) => {handleUpdataCartList(item.goods_id, EmitValue, item.goods_sku_id)}"></CountBox>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 商品统计 --- 全选 --- 合计 --- 去结算 -->
    <div v-if="this.token && this.cartlist.length !== 0" class="cart-status">
      <!-- 全选按钮 -->
      <div class="check-all">
        <!-- 这里ischeckAll 控制着全选框的按钮，那莪要改的话肯定要获取全选框的值，我直接把 ischeckAll 传过去就完事了嗷😁😁😁 -->
        <van-checkbox :value="isCheckAll" @click="toggleCheckAll(isCheckAll)" checked-color="rgb(250, 34, 9)" icon-size="20px">全选</van-checkbox>
      </div>
      <!-- 合计价钱 -->
      <div class="total-price">合计:
        <span class="price">￥{{ isCheckTotalPrice }}</span>
      </div>
      <!-- 去结算 || 删除 -->
      <div v-if="isEditflag" class="goPay count-box" @click="goPay">去结算({{ isCheckGoodNumber }})</div>
      <div v-else class="delete count-box" @click="del">删除</div>
    </div>

    <!-- 当未登录（没有查询到token时（未登录） || 登录了但是购物车数据为空） -->
    <div v-else class="search-null">
        <svg t="1750594157038" class="icon" viewBox="0 0 1290 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1872" width="300px" height="200">
          <path d="M1289.569352 843.862535c0-42.568113-36.539493-77.730254-84.87662-84.761239-1.47831-32.573296-32.854535-58.48338-71.607887-58.483381-39.48169 0-71.586254 27.02062-71.586253 60.329465 0 21.100169 12.547606 39.229296 31.729577 49.974085 0 0.360563-0.360563 0.735549-0.360563 1.103324-115.149521-24.056789-279.003944-39.229296-460.208676-39.229296-126.954366 0-245.053296 7.398761-344.323606 19.982422-3.692169-44.781972-47.608789-79.569127-101.49138-79.569126-52.036507 0-94.474817 32.566085-100.74862 74.759211-25.462986 9.252056-43.556056 30.72-43.556056 55.519549 0 2.95662 0.374986 5.552676 0.74276 8.509296-27.676845 14.061972-43.173859 29.24169-43.173859 45.156958 0 68.838761 283.056676 124.726085 632.550761 124.726084 346.16969 0 627.019718-54.776789 632.55076-122.88 15.129239-14.429746 24.359662-34.044394 24.359662-55.144563" fill="#F0EFEF" p-id="1873"></path>
          <path d="M1171.109859 877.164169c0 32.94107-229.916845 59.586704-513.716282 59.586704-283.806648 0-513.723493-26.645634-513.723492-59.586704s229.916845-59.586704 513.723492-59.586704c283.799437-0.367775 513.716282 26.277859 513.716282 59.586704" fill="#DFDFDF" p-id="1874"></path>
          <path d="M459.213521 173.950197V105.861408c0-19.989634 16.232563-36.272676 36.164507-36.272676h558.368451c19.931944 0 35.803944 16.283042 35.803944 36.272676v665.830761c0 19.982423-16.239775 36.272676-35.803944 36.272676h-68.269071" fill="#FFFFFF" p-id="1875"></path>
          <path d="M262.129577 443.392h-32.104563v-32.19831H208.621972v32.19831h-32.104564v21.467944h32.104564v32.19831h21.403042v-32.19831h32.111775v-21.467944zM320.079324 22.210704h-21.403042V0.360563H277.273239V22.210704h-21.403042v21.460733h21.403042v21.467943h21.403043V43.671437h21.403042V22.210704z m925.212845 461.896113h-32.104563v-32.566085h-21.410254v32.19831h-32.104563v21.467944h32.104563v32.19831h21.410254v-32.19831h32.104563v-21.100169z" fill="#D7D8D8" p-id="1876"></path>
          <path d="M1215.762028 803.140507h-115.88507c5.170479-7.766535 7.752113-16.658028 7.752112-26.277859V96.602141c0-26.277859-21.403042-47.745803-47.601577-47.745803H489.104225c-26.205746 0-47.608789 21.467944-47.608788 47.738592v69.949295h21.403042v-69.949295c0-14.429746 11.812056-26.270648 26.205746-26.270648h570.916057c14.39369 0 26.205746 11.840901 26.205746 26.277859v680.260507c0 14.436958-11.812056 26.277859-26.198535 26.277859h-80.456113c-5.906028 0-10.701521 4.817127-10.701521 10.737578 0 2.95662 1.103324 5.552676 2.95662 7.773746 1.838873 1.846085 4.795493 3.331606 7.377127 3.331606h236.558422c5.913239 0 10.701521-4.817127 10.701521-10.737578 0-2.95662-1.103324-5.920451-3.317183-7.773746-2.213859-1.846085-4.427718-3.331606-7.384338-3.331606z" fill="#D7D8D8" p-id="1877"></path>
          <path d="M1225.728 251.673239a22.066479 22.066479 0 0 0 10.701521 18.879099 22.023211 22.023211 0 0 0 21.403042 0c6.641577-3.69938 10.701521-11.105352 10.701522-18.879099a22.066479 22.066479 0 0 0-10.701522-18.871887 22.023211 22.023211 0 0 0-21.403042 0 22.066479 22.066479 0 0 0-10.701521 18.871887z" fill="#FFFFFF" p-id="1878"></path>
          <path d="M1247.131042 294.609127a42.979155 42.979155 0 0 1-39.856676-26.645634c-6.641577-16.290254-2.95662-34.794366 9.230423-47.010254a43.159437 43.159437 0 0 1 46.866028-9.252056c16.239775 6.663211 26.56631 22.578479 26.56631 39.972056 0 11.473127-4.427718 22.578479-12.547606 30.352226-8.112676 7.773746-18.821408 12.583662-30.258479 12.583662z m0-64.771606a21.302085 21.302085 0 0 0-19.931943 13.326423 21.756394 21.756394 0 0 0 4.802704 23.689014c6.273803 6.288225 15.504225 8.141521 23.616901 4.809915a21.366986 21.366986 0 0 0 13.283155-19.989634 22.340507 22.340507 0 0 0-21.770817-21.835718z" fill="#D7D8D8" p-id="1879"></path>
          <path d="M107.505577 185.055549a32.176676 32.176676 0 0 0 32.104564 32.19831 32.176676 32.176676 0 0 0 32.104563-32.19831c0-11.465915-6.273803-22.210704-16.232563-28.123943a31.232 31.232 0 0 0-32.111775 0c-9.590986 5.913239-15.864789 16.658028-15.864789 28.123943z" fill="#FFFFFF" p-id="1880"></path>
          <path d="M139.610141 239.089577a53.651831 53.651831 0 0 1-50.190423-32.566084c-8.487662-19.989634-4.059944-43.303662 11.069296-59.21893s38.385577-20.357408 58.678085-12.215887c20.299718 8.148732 33.582873 28.123944 33.582873 49.974085 0 29.234479-23.616901 53.291268-53.139831 54.026816z m0-86.607323a31.989183 31.989183 0 0 0-30.26569 19.254084c-5.163268 11.840901-2.581634 26.270648 6.273803 35.529916 8.862648 9.252056 23.256338 12.208676 35.428957 7.39876a32.191099 32.191099 0 0 0 20.299719-29.977239c0-17.393577-14.025915-31.462761-31.736789-32.19831z" fill="#D7D8D8" p-id="1881"></path>
          <path d="M402.37431 191.718761h537.340394c16.975324 0 25.455775 8.509296 25.455775 25.535098v665.095211c0 17.018592-8.480451 25.535099-25.455775 25.535099H402.37431c-16.975324 0-25.462986-8.509296-25.462986-25.535099v-665.095211c0-17.018592 8.487662-25.535099 25.462986-25.535098z" fill="#F9F9F9" p-id="1882"></path><path d="M945.988507 170.258028H396.468282c-9.965972 0-19.189183 4.067155-26.198536 10.730366-7.016563 6.656-10.708732 16.283042-10.708732 26.27786v718.018704h544.356958c1.471099 0.360563 2.949408 0.360563 4.427718 0h37.275042c20.292507 0 36.532282-16.658028 36.900057-37.015437V207.266254c0.367775-20.357408-16.239775-37.015437-36.532282-37.015437z m15.129239 717.268733a15.215775 15.215775 0 0 1-15.129239 15.179718H396.468282a15.605183 15.605183 0 0 1-11.069296-4.442141 14.848 14.848 0 0 1-4.427718-10.737577V207.266254c0-8.509296 7.009352-15.547493 15.504225-15.547493h549.513014c4.059944 0 8.119887 1.47831 10.701521 4.44214 2.581634 2.95662 4.427718 7.030986 4.427718 11.105353v680.260507z" fill="#D7D8D8" p-id="1883"></path>
          <path d="M730.833127 306.082254H472.496676a10.723155 10.723155 0 0 1-10.708732-10.730367c0-5.927662 4.802704-10.737577 10.708732-10.737577h258.336451c5.898817 0 10.701521 4.809915 10.701521 10.737577 0 5.913239-4.802704 10.730366-10.701521 10.730367z m-43.181071 168.404732H472.496676a10.723155 10.723155 0 0 1-10.708732-10.737578c0-5.920451 4.802704-10.730366 10.708732-10.730366h215.15538c5.906028 0 10.701521 4.809915 10.701521 10.730366s-4.795493 10.737577-10.701521 10.737578z m107.765183-84.386254h-322.920563a10.723155 10.723155 0 0 1-10.708732-10.737577c0-5.920451 4.802704-10.730366 10.708732-10.730366h322.920563a10.723155 10.723155 0 1 1 0 21.467943z" fill="#D7D8D8" p-id="1884"></path>
          <path d="M490.943099 700.992901c0 65.507155 52.779268 118.437859 118.098929 118.43786s118.09893-52.930704 118.09893-118.43786-52.779268-118.437859-118.09893-118.437859-118.09893 52.930704-118.098929 118.437859z m62.377464 50.702423a75.884169 75.884169 0 0 1 0-106.582535v106.582535z" fill="#FFFFFF" p-id="1885"></path><path d="M553.320563 763.168451c-2.95662 0-5.538254-1.110535-7.384338-2.95662-33.582873-33.67662-33.582873-88.085634 0-121.769465 1.846085-2.22107 4.795493-3.331606 7.377127-3.331605 2.95662 0 5.538254 1.110535 7.384338 3.331605 2.213859 1.853296 3.317183 4.809915 3.317183 7.773747 0 2.95662-1.103324 5.552676-3.317183 7.773746-25.095211 25.167324-25.095211 65.882141 0 91.41724 2.95662 2.95662 4.059944 7.773746 2.213859 11.840901-1.47831 2.95662-5.538254 5.552676-9.590986 5.920451z" fill="#D7D8D8" p-id="1886"></path>
          <path d="M869.224563 947.856225l-136.177577-136.566986a21.006423 21.006423 0 0 0-18.460845-5.927662l-5.531042-7.030985c53.882592-54.401803 54.985915-141.384113 2.956619-197.271437-52.036507-55.887324-138.766423-60.322254-196.341183-10.362592-57.567549 49.974085-65.319662 136.941972-17.710873 196.528676 47.608789 59.593915 133.963718 70.692056 195.230648 25.167324l5.531042 6.295437c-2.95662 7.773746-1.103324 17.018592 4.795493 22.946254l135.074254 136.574197c4.059944 4.067155 9.590986 6.288225 15.129239 6.288225a21.67707 21.67707 0 0 0 19.931944-13.319211c3.317183-8.148732 1.47831-17.025803-4.427719-23.32124zM490.575324 700.992901c0-65.507155 52.779268-118.437859 118.09893-118.437859s118.09893 52.930704 118.098929 118.437859-52.779268 118.437859-118.098929 118.43786c-65.319662-0.374986-118.09893-53.291268-118.09893-118.43786z" fill="#D7D8D8" p-id="1887"></path>
        </svg>
        <p>亲，暂无相关数据呢</p>
        <button @click="$router.replace('/home')">去逛逛</button>
      </div>

  </div>
</template>

<script>
// 导入 vuex 辅助函数
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'

// 导入 CountBox 小组件
import CountBox from '@/components/CountBox.vue'

// 导入Dialog弹框提示组件
import { Dialog } from 'vant'

export default {
  name: 'LayoutCart',
  components: {
    CountBox
  },
  data () {
    return {
      isEditflag: true
    }
  },
  methods: {
    // 商品删除，当然还有确认弹框 --- 因为使用了promise.then，我就直接return要使用的异步方法deleteCartGoods了
    async del () {
      if (this.isCheckGoodList.length === 0) return
      await Dialog.confirm({
        title: '友情提示',
        message: '您确定要删除该商品吗'
      })
        .then(async () => {
          this.isEditflag = true
          await this.deleteCartGoods()
        })
        .catch(() => {
        })
    },
    // 该结算跳转从购物车出发，则只需要携带 cartId
    goPay () {
      const cartIds = this.isCheckGoodList.map(item => item.id).join(',')
      this.$router.push({
        path: '/pay',
        query: {
          mode: 'cart',
          cartIds
        }
      })
    },
    // 点击编辑后会让 去购买/删除 两个按钮轮换
    cartEdit () {
      // 小优化，有空给这个点击事件做个节流吧，不然快速连续点击容易出现bug
      this.isEditflag = !this.isEditflag
      // this.editName = this.isEditflag ? '编辑' : '完成'
      // 下面是对交互的优化：
      // 当用户选择删除时，作为商城不希望用户删除，所以会将所有复选框全部变为 false
      // 当用户选择去购买时，作为商城希望用户多多购买，所有会将所有复选框全部变为 true
      if (this.isEditflag === false) {
        this.toggleCheckAll(true)
      } else {
        this.toggleCheckAll(false)
      }
    },
    ...mapMutations('cart', ['toggleCheck', 'toggleCheckAll']),
    ...mapActions('cart', ['getCartList', 'deleteCartGoods']),
    // 设置方法，将获取的参数传递给vuex仓库中的异步函数 --- updateCartList
    handleUpdataCartList (goodsId, goodsNum, goodsSkuId) {
      this.$store.dispatch('cart/updateCartList', { goodsId, goodsNum, goodsSkuId })
    }
  },
  computed: {
    ...mapState('cart', ['cartlist']),
    ...mapGetters('cart', ['totalGoods', 'isCheckAll', 'isCheckGoodList', 'isCheckGoodNumber', 'isCheckTotalPrice']),

    // 设置获取 本地token 辅助函数
    ...mapGetters('user', ['token'])
  },
  async created () {
  /*
    将cart数据存储为vuex --- VS --- 不存储store数据，直接进行数据请求
    1、cart.vue 页面初始化需要购物车数据 --- 要进行数据获取 --- 无论是否有vuex都需要
    2、商品的全选反选 --- 核心要求 ---> 大控小：点击全选后，所有小选项与大选项选项一样；小控大：加入说没有存放所有小选项的数组，就判断不了是不是全选使用find函数判断
    3、购物车中商品的 +&- ---> 核心要求：给CountBox设置input事件监听 获取CountBox传来的数据，然后将获取的数据传到request.post('/cart/update', {xxx})请求体中
    4、商品的删除 与 购买 ---> 核心要求：获取删除的商品的id，集合成数组 cartIds 调用request.post('/cart/clear', {cartIds}) 删除数据，如果页面数据来源于vuex，那么重新调用vuex中自定义的获取数据（重新拉下即可）；如果未使用vuex，将data中的cartGoodslist清理即可

    1、现在需要实现全选反选
    2、商品合计于商品总数需要响应式计算
    3、点击+&-需要实现购物车商品更新
    4、点击“编辑”，去结算键 变成 删除键
    5、点击删除删除购物车（需要进行数据请求）
    6、当所有复选框都没勾选时，去结算 or 删除颜色变成灰色；合计价钱保持两位数
  */
    if (!this.token) {
      return
    }
    await this.getCartList()
    console.log(this.cartlist)
  }

}
</script>

<style lang="less" scoped>
// 主体样式
.cart-container{
  width: 100%;
  height: 100vh;
  padding-top: 100px;
  padding-bottom: 50px;
  background-color: rgb(245, 245, 245);

  // 头
  .van-nav-bar{
      z-index: 999;
      /deep/ .van-nav-bar__title{
      font-size: 20px;
      font-weight: bold;
    }
  }

  // 商品总数 & 编辑
  .cart-countnumber{
    position: fixed;
    width: 100%;
    top: 46px;
    z-index: 999;
    height: 40px;
    background-color: rgb(245, 245, 245);
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    p{
      // background-color: pink;;
      line-height: 30px;
      font-size: 16px;
      span{
        height: 30px;
        margin: 0 5px;
      }
    }
  }
}

// 购物车列表样式
.cartlist-content{
  width: 100%;
  height: 105vh;
  // margin-bottom: 100px;
  background-color: rgb(246, 246, 246);
}
.cartlist-item{
  width: 100%;
  height: 135px;
  font-size: 12px;
  background-color: white;
  padding: 0 10px;
  border-bottom: 12px solid rgb(246, 246, 246);
  display: flex;
  align-items: center;
  // 右侧按钮
  .checkbox{
    width: 90px;
    padding: 0 10px;
  }

  // 左侧商品页
  .good-item{
    display: flex;
    cursor: pointer;
    // 左侧商品页 --- 右侧图片
    .item-left{
      width: 32%;
      img{
        border-radius: 10px;
        width: 100%;
        height: 100%;
      }
    }
    // 左侧商品页 --- 左侧详情介绍
    .item-right{
      width: 68%;
      margin-left: 4%;
      padding: 0 0 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .item-title{
        width: 100%;
        height: 39px;
        font-size: 14px;
      }
      .item-price{
        display: flex;
        justify-content: space-between;
        .new{
          font-size: 16px;
          color: #f03c3c;
          margin-right: 10px;
        }
      }
    }
  }
}

// 商品统计 --- 全选 --- 合计 --- 结算 --- 删除
.cart-status{
  background-color: white;
  justify-content: end;
  font-size: 17px;
  position: fixed;
  left: 0;
  bottom: 50px;
  width: 100%;
  z-index: 999;
  padding: 0 10px;
  height: 50px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #999;
  .check-all{
    position: absolute;
    left: 20px;
    // background-color: pink;
  }
  // 合计 --- 价钱
  .total-price{
    height: 50px;
    line-height: 50px;
    margin-right: 5px;
    .price{
      color: rgb(250, 34, 9);
    }
  }
  // 结算键 & 删除键
  .count-box{
    width: 125px;
    background-color: rgb(250, 44, 32);
    color: white;
    border-radius: 20px;
    height: 35px;
    text-align: center;
    line-height: 35px;
    cursor: pointer;
  }
}

// 没有登陆 || 购物车为空
// 如果goods是空，就是没搜到
.search-null{
  text-align: center;
  svg{
    margin-top: 40px;
  }
  p{
    font-size: 20px;
    color: rgb(112, 111, 111);
  }
  button{
    margin-top: 50px;
    border: 0;
    border-radius: 20px;
    width: 150px;
    height: 35px;
    color: white;
    font-size: 20px;
    background-color: rgb(254, 93, 51);
  }
}

</style>
