import Taro from '@tarojs/taro'
import '@tarojs/async-await'

// 请求拦截器
const interceptor = (chain) => {
  Taro.showLoading({
    title: '加载中...',
    mask: true
  })
  let requestParams = chain.requestParams
  // const { method, data, url } = requestParams
  let { header } = requestParams
  requestParams.header = {
    ...header,
    Authorization: 'Bearer ' + Taro.getStorageSync('r_token')
  }
  console.log(requestParams)
  return chain.proceed(requestParams)
    .then(res => {
      Taro.hideLoading()
      return res
    })
}
Taro.addInterceptor(interceptor)
Taro.addInterceptor(Taro.interceptors.logInterceptor)
Taro.addInterceptor(Taro.interceptors.timeoutInterceptor)



// const baseUrl = 'http://172.20.10.11:3000/api'
const baseUrl = 'http://192.168.0.124:3000/api'

const $get =  (url, data = {}) => {
  return new Promise((resolve, reject) => {
    Taro.request({
      url,
      data,
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err.data)
    })
  })
}

const $post =  (url, data = {}) => {
  return new Promise((resolve, reject) => {
    Taro.request({
      url,
      data,
      method: 'POST'
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err.data)
    })
  })
}

const api = {
  // 获取书籍
  getBooks: (data = {}) => {
    return $get(`${baseUrl}/novel`,data)
  },
  // 获取该书本所有章节
  getBookDetail: (id) => {
    return $get(`${baseUrl}/novel/${id}`)
  },
  // 获取该书本所有章节
  getBookList: (data = {}) => {
    return $get(`${baseUrl}/chapter/list`,  data)
  },
  // 获取该章节基本信息
  getchapter: (data = {}) => {
    return $get(`${baseUrl}/chapter/one`,  data)
  },
  // 获取该章节内容
  getchapterContent: (data = {}) => {
    return $get(`${baseUrl}/chapter/content`,  data)
  },
  // 获取该书的阅读位置
  getchapterPosition: (data = {}) => {
    return $get(`${baseUrl}/record/getOne`,  data)
  },
  // 获取用户记录
  getRecords: (data = {}) => {
    return $get(`${baseUrl}/record/getRecords`,  data)
  },

  // 登录
  login: (data = {}) => {
    return $post(`${baseUrl}/auth/login`,  data)
  },
}

export default api
