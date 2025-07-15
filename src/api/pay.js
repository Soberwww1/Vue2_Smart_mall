import request from '@/utils/request'

// 订单结算 --- 进入订单页检查要购买的商品
export const checkOrder = (mode, obj) => {
  return request.get('/checkout/order', {
    params: {
      mode, // 两个模式 --- 1、从购物车跳转购买'cart'；2、直接从商品详情页跳转购买'buyNow'
      // 这个对象自动展开 --- 假如是cart模式该对象就是包裹着cartId；
      // 假如是buyNow模式该对象就是包裹着 goodsId、goodsNum、goodsSkuId
      ...obj,
      // cartIds, // 购物车ID --- 当模式是cart时使用
      // goodsId, // 商品ID --- 商品详情页跳转使用
      // goodsNum, // 商品数量 --- 商品详情页跳转使用
      // goodsSkuId, // 特定规格商品ID --- 商品详情页跳转使用
      delivery: 10, // 物流方式 --- 10：快递配送；20：上门自提
      shopId: 0, // 自提门店ID
      couponId: 0, // 优惠卷ID
      isUsePoints: 0 // 是否使用积分兑换（太麻烦，不实现）0不使用；1使用
    }
  })
}

// 提交订单
export const submitOrder = (mode, obj) => {
  return request.post('/checkout/submit', {
    mode,
    ...obj,
    delivery: 10, // 物流方式 --- 10：快递配送；20：上门自提
    shopId: 0, // 自提门店ID
    couponId: 0, // 优惠卷ID
    isUsePoints: 0 // 是否使用积分兑换（太麻烦，不实现）0不使用；1使用
  })
}
