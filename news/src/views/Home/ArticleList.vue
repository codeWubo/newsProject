<template>
  <!-- 下拉刷新 -->
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <!-- 上拉加载更多 -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <article-info v-for="item in articles" :key="item.art_id.toString()" :article="item" @remove-article="onArticleRemove" @click="gotoDetail(item.art_id.toString())"></article-info>
    </van-list>
  </van-pull-refresh>
</template>

<script>
import { getArticleList } from '@/api/home'
import ArticleInfo from './ArticleInfo.vue'

export default {
  name: 'AritcleList',
  props: {
    // 频道 Id
    id: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      // 文章列表的数据
      articles: [],
      // 是否正在加载数据
      loading: false,
      // 数据是否加载完毕
      finished: false,
      // 是否正在刷新列表数据
      refreshing: false
    }
  },
  methods: {
    // 获取文章列表数据
    async getArticleList(isRefresh) {
      const { data: res } = await getArticleList(this.id)
      if (res.message === 'OK') {
        if (isRefresh) {
          this.articles = [...res.data.results, ...this.articles]
          // 数据加载完成之后，把 refreshing 设置为 false，方便下次发起 Ajax 请求
          this.refreshing = false
        } else {
          this.articles = [...this.articles, ...res.data.results]
          // 数据加载完之后，需要把 loading 设置为 false，方便下次发起 Ajax 请求
          this.loading = false
        }

        // 判断所有数据是否加载完成
        if (res.data.results.length === 0) {
          this.finished = true
        }
      }
    },
    // 触发了上拉加载更多的操作
    onLoad() {
      this.getArticleList()
    },
    // 触发了下拉刷新
    onRefresh() {
      this.getArticleList(true)
    },
    // 触发了删除文章的自定义事件
    onArticleRemove(artId) {
      this.articles = this.articles.filter(x => x.art_id.toString() !== artId)
    },
    // 跳转到文章详情页
    gotoDetail(artId) {
      // 编程式导航 + 命名路由
      this.$router.push({
        name: 'article-detail',
        params: {
          artId
        }
      })
    }
  },
  components: {
    ArticleInfo
  }
}
</script>

<style lang="less" scoped>
</style>
