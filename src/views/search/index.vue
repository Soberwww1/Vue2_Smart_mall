<template>
  <div class="search-container">
    <!-- 搜索页头部 -->
    <div class="search-head">
      <van-nav-bar
      title="商品搜索"
      left-arrow
      fixed
      @click-left="$router.back()" />
    </div>

    <!-- 搜索框搜索 -->
    <van-search
      v-model="value"
      show-action
      placeholder="请输入您搜索的商品"
      @search="onSearch(value)"
      background="rgb(247, 247, 247)"
    >
      <template #action>
        <div class="searchbtn" @click="onSearch(value)">搜索</div>
      </template>
    </van-search>

    <!-- 搜索历史记录 -->
    <div class="search-history">
      <!-- 历史记录的标题与删除标志 -->
      <div class="history-title">
        <span class="title">最近搜索</span>
        <van-icon @click="onclear" name="delete-o" />
      </div>
      <!-- 一个个小历史记录 -->
      <ul class="history-list">
        <li @click="onSearch(item)" v-for="item in history" :key="item" class="list-item">{{ item.trim() }}</li>

      </ul>
    </div>
  </div>
</template>

<script>

// 导入自行封装的查找数据请求函数
import { gethistory, sethistory } from '@/utils/storage'
import { Toast } from 'vant'

// 导入自定义的存储函数，将搜索记录本地存储化，防止刷新丢失
// import { sethistory, gethistory } from '@/utils/storage'

export default {
  name: 'SearchIndex',
  data () {
    return {
      value: '',
      history: gethistory()
    }
  },
  methods: {
    onSearch (itemname) {
      // 当输入为空时提示
      if (!itemname.trim()) {
        Toast('请先输入再搜索')
        return
      }
      // 为-1说明history中没有该值，之前没有搜索过
      const index = this.history.indexOf(itemname)
      if (index === -1) {
        this.history.unshift(itemname)
        sethistory(this.history)
      } else {
        // 删除原历史所在位置，添加历史记录到第一位，并将更新后的history存储本地
        this.history.splice(index, 1)
        this.history.unshift(itemname)
        sethistory(this.history)
      }

      // 这一步就是跳转到搜索列表页面，并且传递给他要搜索的东西
      this.$router.push(`/searchlist?item=${itemname}`)
    },
    // 一键清除历史记录
    onclear () {
      this.history = []
      sethistory(this.history)
    }
  }

}
</script>

<style lang="less" scoped>
// 搜索主题
.search-container{
  width: 100%;
  height:730px;
  padding-top: 100px;
  padding-bottom: 50px;
  background-color: rgb(247, 247, 247);
}
// 头
.van-nav-bar{
    z-index: 999;
    /deep/ .van-nav-bar__title{
    font-size: 20px;
  }
}
// 搜索框
.van-search{
  position: fixed;
  width: 100%;
  top: 46px;
  z-index: 999;
  // 搜索框
  .van-search__content{
    background-color: rgb(255, 255, 255);
    border-radius: 5px 0 0 5px;
  }
  // 搜索按钮
  .van-search__action{
    width: 60px;
    padding: 0;
    margin-right: 10px;
    // 搜索按钮中间
    .searchbtn{
      background-color: rgb(250, 34, 9);
      width: 100%;
      text-align: center;
      color: white;
      border-radius: 0 5px 5px 0;
    }
  }
}

// 搜索历史记录样式
.search-history{
  width: 100%;
  padding: 10px;
  // 搜索记录标题
  .history-title{
    height: 25px;
    color: rgb(119, 119, 119);
    // background-color: pink;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  // 搜索记录历史
  .history-list{
    width: 100%;
    // background-color: tomato;
    padding: 10px 5px;
    margin-top: 10px;
    display: flex;
    justify-content: start;
    align-content: start;
    flex-wrap: wrap;
    // 每个搜索小item
    .list-item{
      width: 90px;
      height: 30px;
      border: 1px solid #ccc;
      line-height: 30px;
      background-color: white;
      border-radius: 20px;
      text-align: center;
      margin: 0 10px 10px 0;
    }
  }
}

</style>
