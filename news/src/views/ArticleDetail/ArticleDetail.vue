<template>
  <div>
    <!-- Header 区域 -->
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />

    <div v-if="article.title">
      <!-- 文章信息区域 -->
      <div class="article-container">
        <!-- 文章标题 -->
        <h1 class="art-title">{{article.title}}</h1>

        <!-- 用户信息 -->
        <van-cell center :title="article.aut_name" :label="article.pubdate | dateFormat">
          <template #icon>
            <img :src="article.aut_photo" alt="" class="avatar">
          </template>
          <template #default>
            <div>
              <van-button type="info" size="mini" v-if="article.is_followed" @click="setFollow(false)">已关注</van-button>
              <van-button icon="plus" type="info" size="mini" plain v-else @click="setFollow(true)">关注</van-button>
            </div>
          </template>
        </van-cell>

        <!-- 分割线 -->
        <van-divider></van-divider>

        <!-- 文章内容 -->
        <div class="art-content" v-html="article.content"></div>

        <!-- 分割线 -->
        <van-divider>End</van-divider>

        <!-- 点赞 -->
        <div class="like-box">
          <van-button icon="good-job" type="danger" size="small" v-if="article.attitude === 1" @click="setLike(false)">已点赞</van-button>
          <van-button icon="good-job-o" type="danger" plain size="small" v-else @click="setLike(true)">点赞</van-button>
        </div>
      </div>

      <!-- 文章评论组件 -->
      <art-cmt :artId="article.art_id.toString()" v-if="article.art_id"></art-cmt>
    </div>

    <van-loading size="24px" vertical v-else class="loading">文章加载中...</van-loading>
  </div>
</template>

<script>
// 1. 按需导入 API 接口
import {
  getArticleInfo,
  followUser,
  unfollowUser,
  addLike,
  delLike
} from '@/api/article'

import ArtCmt from './ArtCmt.vue'
// 导入 highlight.js 模块
import hljs from 'highlight.js'

export default {
  name: 'ArticleDetail',
  props: {
    // 文章Id
    artId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      // 2. 定义文章详情的数据
      article: {}
    }
  },
  // 4. 页面初次加载时,请求详情数据
  created() {
    this.getArticleDetail()
  },
  // 1. 当组件的 DOM 更新完毕之后
  updated() {
    // 2. 判断是否有文章的内容
    if (this.article.content) {
      // 3. 对文章的内容进行高亮处理
      hljs.highlightAll()
    }
  },
  methods: {
    // 3. 声明获取文章数据的方法
    async getArticleDetail() {
      const { data: res } = await getArticleInfo(this.artId)
      if (res.message === 'OK') {
        this.article = res.data
      }
    },
    // 修改关注状态
    async setFollow(followState) {
      if (followState) {
        // 调用关注的接口
        await followUser(this.article.aut_id.toString())
        this.$toast.success('关注成功!')
      } else {
        // 调用取消关注的接口
        await unfollowUser(this.article.aut_id.toString())
        this.$toast.success('取消关注成功!')
      }

      // 修改文章的状态
      this.article.is_followed = followState
    },
    // 修改点赞状态
    async setLike(likeState) {
      if (likeState) {
        // 调用点赞的接口
        await addLike(this.article.art_id.toString())
        this.$toast.success('点赞成功!')
      } else {
        // 调用取消点赞的接口
        await delLike(this.article.art_id.toString())
        this.$toast.success('取消点赞成功!')
      }

      this.article.attitude = likeState ? 1 : -1
    }
  },
  // 注册组件
  components: {
    ArtCmt
  }
}
</script>

<style lang="less" scoped>
.article-container {
  padding: 10px;
  margin-top: 46px;
}
.art-title {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
}

.art-content {
  font-size: 12px;
  line-height: 24px;
  width: 100%;
  overflow-x: scroll;
  word-break: break-all;
}

.van-cell {
  padding: 5px 0;
  &::after {
    display: none;
  }
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f8f8f8;
  margin-right: 5px;
  border: none;
}

.like-box {
  display: flex;
  justify-content: center;
}

.loading {
  margin-top: 50px;
}
</style>
