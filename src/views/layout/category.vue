<template>
  <div class="category-container">
    <!-- 商品分类页头部 -->
    <div class="category-head">
      <van-nav-bar title="全部分类" fixed/>
    </div>

    <!-- 搜索框 -->
    <van-search
    shape="round"
    :readonly=true
    @click="$router.push('/search')"
    placeholder="搜索商品" />

    <!-- 分类页主体 -->
    <div class="category-content">
      <!-- 左边导航栏 -->
      <div class="sidebar-left">
        <ul class="sidebar-list">
          <!-- 每次点击都更新this.itemlist列表数据，所以下面的 “右边商品栏也会更新了” -->
          <li @click="itemlist = item.children" v-for="(item,index) in sidebarlist" :key="item.category_id" class="sidebar-item">
            <!-- 下面中index === activeIndex 是为了点击对应导航栏时让他高亮，因为每次点击都会使activeIndex等于index，而该标签高亮的条件就是当this.activeIndex值 === index -->
            <a :class="{ active: index === activeIndex }" @click="activeIndex = index" href="javascript:;">{{ item.name }}</a>
          </li>
        </ul>
      </div>
      <!-- 右边商品栏 -->
      <div class="item-right">
        <van-grid :column-num="3" :gutter="10" icon-size="60px" :border="false">
          <van-grid-item
          v-for="value in itemlist"
          @click="$router.push(`/searchlist?goodsid=${value.category_id}`)"
          :key="value.category_id"
          :icon="value.image.external_url"
          :text="value.name"/>
        </van-grid>
      </div>
    </div>
  </div>
</template>

<script>
// 导入自定义封装getCategoryItem，用来获取分类页数据
import { getCategoryItem } from '@/api/category'

export default {
  name: 'LayoutCateGory',
  data () {
    return {
      sidebarlist: null,
      itemlist: null,
      activeIndex: 0
    }
  },
  async created () {
    const res = await getCategoryItem()
    // console.log(res)
    this.sidebarlist = res.data.list
    this.itemlist = this.sidebarlist[0].children
    // console.log(this.sidebarlist)
    // console.log(this.itemlist)
  }
}
</script>

<style lang="less" scoped>
// 全局样式
.category-container{
  width: 100%;
  padding-top: 100px;
  padding-bottom: 50px;
}

// 头
.van-nav-bar{
    z-index: 999;
    /deep/ .van-nav-bar__title{
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
}

// 分类页主体
.category-content{
  width: 100%;
  height: 80vh;
  display: flex;
  justify-content: space-between;
// 分类页左侧导航栏
  .sidebar-left{
    width: 22%;
    overflow: scroll;
    .sidebar-list{
      width: 100%;
      .sidebar-item{
        color: rgb(68, 68, 68);
        background-color: rgb(248, 248, 248);
        padding: 10px 0;
        a {
          display: block;
          height: 45px;
          line-height: 45px;
          text-align: center;
          color: #444444;
          font-size: 14px;
          &.active {
            color: #fb442f;
            background-color: #fff;
          }
        }
      }
    }
  }

// 分类页右侧物品栏
  .item-right{
    width: 75%;
    overflow: scroll;
    .van-grid{
      /deep/.van-grid-item__text{
      font-size: 15px;
    }
    }
  }
}

</style>
