import axios from '@/utils/request'

// 获取文章详情数据
export const getArticleInfo = artId => {
  return axios.get(`/v1_0/articles/${artId}`)
}

// 关注用户
export const followUser = uid => {
  return axios.post('/v1_0/user/followings', {
    target: uid
  })
}

// 取消关注用户
export const unfollowUser = uid => {
  return axios.delete(`/v1_0/user/followings/${uid}`)
}

/**
 * 点赞
 * @param {*} id 文章Id
 * @returns
 */
export const addLike = id => {
  return axios.post('/v1_0/article/likings', {
    target: id
  })
}

/**
 * 取消点赞
 * @param {*} id 文章Id
 * @returns
 */
export const delLike = id => {
  return axios.delete(`/v1_0/article/likings/${id}`)
}

// 获取文章的评论列表
export const getCmtList = (artId, offset) => {
  return axios.get('/v1_0/comments', {
    params: {
      // a 表示对文章的评论；c 表示对评论的回复
      type: 'a',
      // 文章的 Id
      source: artId,
      // 获取评论数据的偏移量，值为评论 id，表示从此 id 的数据向后取，不传表示从第一页开始读取数据
      offset
    }
  })
}

// 评论点赞
export const addCmtLike = cmtId => {
  return axios.post('/v1_0/comment/likings', {
    target: cmtId
  })
}

// 评论取消点赞
export const removeCmtLike = cmtId => {
  return axios.delete(`/v1_0/comment/likings/${cmtId}`)
}

// 对文章发表评论
export const pubComment = (artId, content) => {
  return axios.post('/v1_0/comments', {
    target: artId,
    content
  })
}
