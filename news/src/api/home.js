import axios from '@/utils/request'

// 获取频道列表
export const getChannelList = () => {
  return axios.get('/v1_0/user/channels')
}

// 获取所有频道列表
export const getAllChannels = () => {
  return axios.get('/v1_0/channels')
}

// 更新我的频道列表
export const updateMyChannels = data => {
  return axios.put('/v1_0/user/channels', data)
}

// 根据频道 Id 获取文章列表数据
export const getArticleList = id => {
  return axios.get('/v1_1/articles', {
    params: {
      channel_id: id, // 频道id
      timestamp: Date.now(), // 时间戳整数 单位毫秒
      with_top: 1
    }
  })
}

// 将文章设置为不感兴趣
export const dislikeArticle = artId => {
  return axios.post('/v1_0/article/dislikes', {
    target: artId
  })
}

// 举报文章
export const reportArticle = (artId, type) => {
  return axios.post('/v1_0/article/reports', {
    target: artId, // 文章的 Id
    type // 举报的类型
  })
}
