import request from '@/utils/request'

/*
  注意，这里虽然使用了async\await，但是本质上还是返回了promise对象，所以，在调用这个api的组件中仍然需要使用async、await，异步处理
*/
export const search = async (categoryId = '0', goodsName = '') => {
  const sortlist = [
    { name: 'comprehensive', params: { page: '1', goodsName, categoryId, sortPrice: '0', sortType: 'all' } }, // 按照综合
    { name: 'quantity', params: { page: '1', goodsName, categoryId, sortPrice: '0', sortType: 'sales' } }, // 按照销量
    { name: 'pricehigh', params: { page: '1', goodsName, categoryId, sortPrice: '1', sortType: 'price' } }, // 价格从高到低
    { name: 'pricelow', params: { page: '1', goodsName, categoryId, sortPrice: '0', sortType: 'price' } }// 价格从低到高
  ]
  const inputlist = sortlist.map(item =>
    request.get('/goods/list', { params: item.params })
      .then(res => ({ name: item.name, data: res.data })) // 标记数据类型
  )
  const tempresults = await Promise.all(inputlist)
  return tempresults.reduce((result, item) => {
    result[item.name] = item.data
    return result
  }, {})
}
