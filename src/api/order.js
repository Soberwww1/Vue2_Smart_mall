import request from '@/utils/request'

// 获取订单
export const getOrder = async () => {
  const sortlist = [
    { name: 'all', params: { dataType: 'all' } },
    { name: 'comment', params: { dataType: 'comment', page: '1' } },
    { name: 'received', params: { dataType: 'received', page: '1' } },
    { name: 'delivery', params: { dataType: 'delivery', page: '1' } },
    { name: 'payment', params: { dataType: 'payment', page: '1' } }
  ]
  const inputlist = sortlist.map(item => {
    return request.get('/order/list', { params: item.params }).then((res) => {
      return { name: item.name, data: res.data }
    })
  })
  const tempresults = await Promise.all(inputlist)
  return tempresults.reduce((result, item) => {
    result[item.name] = item.data
    return result
  }, {})
}

// 取消订单
export const cancelOrder = (orderId) => {
  return request.post('/order/cancel', {
    orderId
  })
}
