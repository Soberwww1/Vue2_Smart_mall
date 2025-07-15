import request from '@/utils/request'

// 获取已知商品ID的商品
export const getProductItem = (goodsId) => {
  return request.get('/goods/detail', {
    params: {
      goodsId
    }
  })
}

// 获取特定商品评论
export const getCommit = (goodsId, limit) => {
  return request.get('/comment/listRows', {
    params: {
      goodsId,
      limit
    }
  })
}
