<template>
  <div class="home-container">
    <!-- 主页头部 -->
    <div class="home-head">
      <van-nav-bar title="智慧商城" fixed/>
    </div>

    <!-- 搜索框 -->
    <van-search
    shape="round"
    :readonly=true
    @click="$router.push('/search')"
    placeholder="搜索你要找的商品" />

    <!-- 轮播图 -->
    <div class="home-swiper">
    <van-swipe class="my-swipe" :autoplay="3000" :touchable=true indicator-color="white">
      <van-swipe-item v-for="(item,index) in bannerList" :key="index">
        <img v-lazy="item.imgUrl" alt="">
      </van-swipe-item>
    </van-swipe>
    </div>

    <!-- 滚动条 -->
    <div class="home-marquee">
      <!-- <img src="" alt=""> -->
      <van-icon name="volume-o" />
      <vue-marquee color="white">
        <span>智慧商城2.0全新上线!!!</span>
      </vue-marquee>
    </div>

    <!-- 主页中间棋盘导航栏 -->
    <div class="home-grid">
      <!-- <van-grid :border="false" :column-num="5" :gutter="10" rouder>
        <van-grid-item
        :icon="item.imgUrl"
        :text="item.text"
          v-for="item in navList" :key="item.imgUrl" @click="route(item.text)">
        </van-grid-item>
      </van-grid> -->
      <van-grid :border="false" :column-num="5" :gutter="10">
        <van-grid-item
        v-for="item in navList"
        :key="item.imgUrl"
        @click="gripskip">
          <van-image
            :src="item.imgUrl"
          />
          <p>{{ item.text }}</p>
        </van-grid-item>
      </van-grid>
    </div>

    <!-- 主会场 -->
    <div class="home-main">
      <!-- 服了，就一张图片有啥好获取的？？？ -->
      <img :src="mainimg" alt="">
    </div>

    <!-- 猜你喜欢 -->
    <div class="home-like">
      <div class="like-head">—————猜你喜欢 —————</div>
      <!-- 使用props传递 -->
      <GoodItem :value="item" v-for="(item) in proList" :key="item.goods_id"></GoodItem>
    </div>
  </div>
</template>

<script>
// 导入封装好的请求数据的方法
import { getHomeData } from '@/api/home'

// 导入vuex仓库辅助函数
import { mapMutations } from 'vuex'

// 导入商品组件
import GoodItem from '@/components/GoodItem.vue'

export default {
  name: 'LayoutHome',
  components: {
    GoodItem
  },
  data () {
    return {
      bannerList: [], // 轮播
      navList: [], // 导航
      proList: [], // 商品
      mainimg: '' // 主会场图片
    }
  },
  async created () {
    const res = await getHomeData()
    // 将获取的首页数据解构
    const { pageData: { items } } = res.data
    // 获取轮播图数据
    this.bannerList = items[1].data
    // 获取棋盘导航数据
    this.navList = items[3].data
    // 获取主会场图片
    this.mainimg = items[4].data[0].imgUrl
    // 获取商品数据
    this.proList = items[6].data
    // console.log(this.proList)
  },
  methods: {
    // 导入vuex仓库辅助函数
    ...mapMutations('tabbarActive', ['changeActive']),
    // 点击跳转 --- 点击导航栏跳转商品分类页
    gripskip () {
      this.$router.push('/category')
      // 向vuex仓库传递active更新值
      this.changeActive(1)
    }
  }
}
</script>

<style lang="less" scoped>
// 全局样式
.home-container{
  width: 100%;
  padding-top: 100px;
  padding-bottom: 50px;
}

// 头
.van-nav-bar{
    z-index: 999;
    background-color: rgb(194, 20, 1);
    /deep/ .van-nav-bar__title{
    color: white;
    font-size: 20px;
    font-weight: bold;
  }
}

// 搜索框
.van-search{
  position: fixed;
  width: 100%;
  top: 46px;
  z-index: 999;
  background-color: rgb(241, 241, 242);
  /deep/.van-field__control{
    color: rgb(69, 70, 71);
  }
}

// 轮播图
.my-swipe .van-swipe-item {
  width: 100%;
  height: 185px;
  color: #fff;
  font-size: 30px;
  text-align: center;
  img{
    width: 100%;
    height: 185px;
  }
}

// 滚动横幅
.home-marquee{
  background-color: rgb(82, 82, 82);
  padding: 5px 0;
  display: flex;
  align-content: center;
  .van-icon{
    width: 30px;
    height: 30px;
    font-size: 20px;
    line-height: 30px;
    text-align: center;
    color: white;
  }
  /deep/.vue-marquee{
    width: 100%;
    margin: 0;
    padding: 0;
    height: 30px;
    .vue-marquee-wrapper{
      font-size: 17px;
      background-color: rgb(82, 82, 82);
    }
  }
}

// 棋盘导航栏
// 针对于我自己写的img、p标签
.home-grid{
  margin-top: 20px;
  /deep/.van-grid-item{
    height: 65px;
    border-radius: 20px;
    p{
      font-size: 10px;
    }
  }
}

// 针对于vant属性的样式（效果一样的样式我写两份，真是脱裤子放屁）
// .home-grid{
//   margin-top: 20px;
//   /deep/.van-grid-item{
//     height: 65px;
//     border-radius: 20px;
//     .van-icon{
//       .van-icon__image{
//         // 图片
//         width: 44px;
//         height: 44px;
//       }
//     }
//     .van-grid-item__text{
//       font-size: 10px;
//       color: black;
//       margin-top: -1px;
//     }
//   }
// }

// 主会场
.home-main{
  margin-top: 20px;
  width: 100%;
  img{
    width: 100%;
  }
}

// 猜你喜欢 --- 商品页面
.home-like{
  width: 100%;
  .like-head{
    width: 100%;
    padding: 13px 0;
    text-align: center;
    font-size: 17px;
    border-bottom: 2px solid rgb(246, 246, 246);
    margin-bottom: 5px;
  }
}

</style>
