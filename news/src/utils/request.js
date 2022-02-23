import axios from 'axios'
import store from '@/store/index'
import JSONbig from 'json-bigint'
import router from '@/router/index'

// 处理大数问题
const transBigInt = data => {
  if (!data) return ''
  try {
    return JSONbig.parse(data)
  } catch {
    return JSON.parse(data)
  }
}

const instance = axios.create({
  // 请求根路径
  baseURL: 'http://www.liulongbin.top:8000',
  transformResponse: [transBigInt]
})

// 请求拦截器
instance.interceptors.request.use(
  config => {
    // 获取 token 值
    const tokenStr = store.state.tokenInfo.token
    // 判断 token 值是否存在
    if (tokenStr) {
      // 添加身份认证字段
      config.headers.Authorization = 'Bearer ' + tokenStr
    }
    return config
  },
  function(error) {
    return Promise.reject(error)
  }
)

// // 响应拦截器
// instance.interceptors.response.use(
//   response => {
//     return response
//   },
//   error => {
//     // 判断是否为未授权（Token 过期）
//     if (error.response && error.response.status === 401) {
//       // 清空 Store 中的关键数据
//       store.commit('cleanState')
//       // 跳转到登录页
//       router.push('/login?pre=' + router.currentRoute.fullPath)
//     }
//     return Promise.reject(error)
//   }
// )

// 响应拦截器
instance.interceptors.response.use(
  response => {
    return response
  },
  async error => {
    // 从 vuex 中获取 token 对象
    const tokenInfo = store.state.tokenInfo
    // 判断是否为未授权（Token 过期）
    if (error.response.status === 401 && tokenInfo.token) {
      try {
        // 发起请求，根据 refresh_token 重新请求新的 token 字符串
        const { data: res } = await axios({
          method: 'PUT',
          url: 'http://www.liulongbin.top:8000/v1_0/authorizations',
          headers: {
            Authorization: `Bearer ${tokenInfo.refresh_token}`
          }
        })
        // 更新 Store 中的 Token
        store.commit('updateTokenInfo', {
          refresh_token: tokenInfo.refresh_token,
          token: res.data.token
        })

        return instance(error.config)
      } catch {
        // 如果 refresh_token 也失效了，则清空 Store 中的关键数据
        store.commit('cleanState')
        // 并强制跳转到登录页
        router.push({
          path: '/login?pre=' + router.currentRoute.fullPath
        })
      }
    }
    return Promise.reject(error)
  }
)

export default instance
