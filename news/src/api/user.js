import axios from '@/utils/request'

// 登录
export const login = data => {
  return axios.post('/v1_0/authorizations', data)
}

// 获取用户的基本信息
export const getUserInfo = () => {
  return axios.get('/v1_0/user')
}

// 获取用户的简介信息
export const getProfile = () => {
  return axios.get('/v1_0/user/profile')
}

// 修改姓名，生日，性别都使用此接口，修改传参即可
export const updateProfile = data => {
  return axios.patch('/v1_0/user/profile', data)
}

// 更新用户的头像
export const updateUserPhoto = fd => {
  return axios.patch('/v1_0/user/photo', fd)
}
