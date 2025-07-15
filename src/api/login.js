import request from '@/utils/request'

// 获取图形验证码
export const getimg = () => {
  return request({
    url: '/captcha/image'
  })
}

// 获取短信验证码
// API文档中要求传入三个参数 --- 图形验证码、图形验证码唯一标识、验证手机号码
export const getverifycode = (captchaCode, captchaKey, mobile) => {
  return request({
    url: '/captcha/sendSmsCaptcha',
    method: 'post',
    form: {
      captchaCode,
      captchaKey,
      mobile
    }
  })
}

// 手机验证码登录，在编写这个小模块时我惊奇发现这里竟然不能用以下axios老语法😂😂😂 --- 招笑了老弟
// export const login = (mobile, smsCode) => {
//   return request({
//     url: '/passport/login',
//     method: 'post',
//     form: {
//       isParty: false,
//       partyData: {},
//       mobile,
//       smsCode
//     }
//   })
// }
export const login = (mobile, smsCode) => {
  return request.post('/passport/login', {
    form: {
      isParty: false,
      partyData: {},
      mobile,
      smsCode
    }
  })
}
