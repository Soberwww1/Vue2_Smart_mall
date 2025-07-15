// 定义用户数据存储变量名
const INFO_KEY = 'hm_shopping_info'
// 定义用户搜索历史数据存储变量名
const HISTORY_KEY = 'hm_history_list'

// 设置用户登录本地存储API
// 将用户登录数据存入本地
export const setinfo = (obj) => {
  localStorage.setItem(INFO_KEY, JSON.stringify(obj))
}
// 将用户登录数据信息从本地拿出
export const getinfo = () => {
  const tempobj = { token: '', userId: '' }
  const inputonbj = localStorage.getItem(INFO_KEY) ? localStorage.getItem(INFO_KEY) : JSON.stringify(tempobj)
  // 易错点：JSON.parse只能解析JSON数据，不管JSON.parse()括号里是空还是啥，只要不符合JSON数据全部报错
  // 所以上面要将 tempobj对象 先转化为 JSON格式，防止下面不能解析
  return JSON.parse(inputonbj)
}
// 将用户登录数据从本地删除
export const delinfo = () => {
  localStorage.removeItem(INFO_KEY)
}

// 设置用户搜索历史记录本地存储API
// 将用户搜索历史数据存储本都
export const sethistory = (arry) => {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(arry))
}

// 将用户搜索历史记录数据获取
export const gethistory = () => {
  const inputonbj = localStorage.getItem(HISTORY_KEY) ? JSON.parse(localStorage.getItem(HISTORY_KEY)) : []
  return inputonbj
}
