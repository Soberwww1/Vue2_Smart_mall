<template>
  <div class="good-item" @click="$router.push(`/prodetail?item=${value.goods_id}`)">
    <!-- 商品右侧 -->
    <div class="item-left">
      <!-- 商品图片 -->
      <img :src="value.goods_image" alt="">
    </div>
    <!-- 商品左侧 -->
    <div class="item-right">
      <!-- 商品标题 -->
      <div class="item-title text-elipsis-2">{{ value.goods_name }}</div>
      <!-- 已售数量 -->
      <p>已售{{ value.goods_sales }}件</p>
      <!-- 商品价格 -->
      <div class="item-price">
        <!-- 售出价格 -->
        <span class="new">￥{{ value.goods_price_max }}</span>
        <!-- 划线价格 -->
        <span v-if="value.line_price_max !== '0.00'" class="old">￥{{ value.line_price_max }}</span>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'GoodItem',
  props: {
    value: {
      type: Object,
      require: true
    }
  }

}
</script>

<style lang="less" scoped>
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
      // overflow: hidden;
      font-size: 14px;
    }
    p{
      color: #999;
      font-size: 12px;
    }
    .item-price{
      color: #999;
      font-size: 16px;
      .new{
        color: #f03c3c;
        margin-right: 10px;
      }
      .old{
        text-decoration: line-through;
        font-size: 12px;
      }
    }
  }
}

</style>
