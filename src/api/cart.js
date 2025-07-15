import request from '@/utils/request'

// 自定义加入购物车函数，将商品传回后台数据库
// goodsSkuId商品规格参数 goodsNum商品数量 goodsId商品ID
export const addCart = (goodsId, goodsNum, goodsSkuId) => {
  return request.post('/cart/add', {
    goodsId,
    goodsNum,
    goodsSkuId
  })
}

// 自定义获取购物车商品列表
export const getCartGoods = () => {
  return request.get('/cart/list')
}

// 购物车商品更新操作
// goodsId 商品ID，goodsNum 商品数量，goodsSkuId 同种商品不同规格ID
export const updateCartGoods = (goodsId, goodsNum, goodsSkuId) => {
  return request.post('/cart/update', {
    goodsId,
    goodsNum,
    goodsSkuId
  })
}

// 自定义删除购物车数据API
export const deleteCartGoods = (cartIds) => {
  return request.post('/cart/clear', {
    cartIds
  })
}
