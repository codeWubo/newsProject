<template>
  <div class="search-result-container">
    <!-- Header 区域 -->
    <van-nav-bar title="搜索结果" left-arrow @click-left="$router.go(-1)" fixed />

    <!-- 上拉加载更多 -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <!-- 文章信息组件 -->
      <article-info v-for="item in searchResult" :key="item.art_id.toString()" :article="item" :closable="false" @click="gotoDetail(item.art_id.toString())"></article-info>
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search'
import ArticleInfo from '@/views/Home/ArticleInfo.vue'

export default {
  name: 'SearchResult',
  props: ['kw'],
  data() {
    return {
      // 页码值
      page: 1,
      // 搜索的结果
      searchResult: [],
      // 是否正在请求数据
      loading: false,
      // 数据是否已经加载完毕
      finished: false,
      // 缓存的搜索关键词
      preKw: ''
    }
  },
  // 组件被激活
  activated() {
    // 如果这次的 kw 和上次缓存的 kw 值不同，且上一次的 kw 不为空，则需要重新请求列表数据
    if (this.kw !== this.preKw && this.preKw !== '') {
      // 1. 重置数据
      this.page = 1
      this.searchResult = []
      this.loading = false
      this.finished = false
      // 2. 重新请求列表数据
      this.onLoad()
    }
  },
  // 组件被缓存
  deactivated() {
    // 组件被缓存时，将搜索关键词保存到 data 中
    this.preKw = this.kw
  },
  methods: {
    // 上拉触底
    async onLoad() {
      // 请求数据
      const { data: res } = await getSearchResult(this.kw, this.page)
      // 判断是否请求成功
      if (res.message === 'OK') {
        // 拼接数据
        this.searchResult = [...this.searchResult, ...res.data.results]
        // 重置加载状态
        this.loading = false
        // 页码值 + 1
        this.page += 1
        // 判断数据是否加载完毕
        if (res.data.results.length === 0) {
          this.finished = true
        }
      }
    },
    // 跳转到详情页
    gotoDetail(artId) {
      this.$router.push('/article/' + artId)
    }
  },
  components: {
    ArticleInfo
  }
}
</script>

<style lang="less" scoped>
.search-result-container {
  padding-top: 46px;
}
</style>
