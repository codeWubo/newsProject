import axios from '@/utils/request'

// 获取搜索关键词的列表
export const getSuggList = kw => {
  return axios.get('/v1_0/suggestion', {
    params: {
      q: kw
    }
  })
}

// 根据关键词查询搜索结果列表的数据
export const getSearchResult = (q, page) => {
  return axios.get('/v1_0/search', {
    params: {
      q,
      page
    }
  })
}
