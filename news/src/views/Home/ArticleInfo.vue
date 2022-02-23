<template>
  <div @click="$emit('click')" class="article-info-container">
    <van-cell>
      <!-- 标题区域的插槽 -->
      <template #title>
        <div class="title-box">
          <!-- 标题 -->
          <span>{{article.title}}</span>
          <!-- 单张图片 -->
          <img alt="" v-if="article.cover.type === 1" class="thumb" v-lazy="article.cover.images[0]" />
        </div>
        <!-- 三张图片 -->
        <div class="thumb-box" v-if="article.cover.type > 1">
          <img v-for="(imgsrc, i) in article.cover.images" :key="i" alt="" class="thumb" v-lazy="imgsrc" />
        </div>
      </template>
      <!-- label 区域的插槽 -->
      <template #label>
        <div class="label-box">
          <span>{{article.aut_name}}&nbsp;&nbsp;{{article.comm_count}}评论&nbsp;&nbsp;{{article.pubdate | dateFormat}}</span>
          <!-- 关闭按钮 -->
          <van-icon name="cross" @click.stop="onCloseClick" v-if="closable" />
        </div>
      </template>
    </van-cell>

    <!-- 动作面板 -->
    <van-action-sheet v-model="show" cancel-text="取消" :closeable="false" @closed="onSheetClose" get-container="body">
      <!-- 展示第一个面板 -->
      <div v-if="showFirstAction">
        <van-cell :title="item.name" v-for="(item, i) in actions" :key="i" clickable title-class="center-title" @click="onCellClick(item)" />
      </div>
      <!-- 展示第二个面板 -->
      <div v-else>
        <van-cell title="返回" title-class="center-title" @click="showFirstAction = true" />
        <van-cell :title="item.label" v-for="(item, i) in reports" :key="i" clickable title-class="center-title" @click="onFeedbackCellClick(item)" />
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
import reports from '@/api/constant/reports'
import { dislikeArticle, reportArticle } from '@/api/home'

export default {
  name: 'ArticleInfo',
  props: {
    article: {
      type: Object,
      required: true
    },
    closable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 控制 ActionSheet 的显示与隐藏
      show: false,
      actions: [
        { name: '不感兴趣' },
        { name: '反馈垃圾内容' },
        { name: '拉黑作者' }
      ],
      // 是否展示第一个面板
      showFirstAction: true,
      // 反馈的选项
      reports
    }
  },
  methods: {
    // 点击了叉号按钮
    onCloseClick() {
      this.show = true
    },
    // 点击第一层的 item 项
    async onCellClick(info) {
      if (info.name === '不感兴趣') {
        // 调用接口，将此文章设置为不感兴趣
        const { data: res } = await dislikeArticle(
          this.article.art_id.toString()
        )
        // 接口调用成功
        if (res.message === 'OK') {
          // TODO：将此文章从列表中移除
          this.$emit('remove-article', this.article.art_id.toString())
        }
        this.show = false
      } else if (info.name === '拉黑作者') {
        console.log('拉黑作者')
        this.show = false
      } else if (info.name === '反馈垃圾内容') {
        this.showFirstAction = false
      }
    },
    // 监听 Sheet 关闭完成后的事件
    onSheetClose() {
      // 下次默认渲染第一个面板
      this.showFirstAction = true
      // TODO：清空文章的 Id
    },
    // 点击了反馈面板中的按钮
    async onFeedbackCellClick(info) {
      // 发起请求，反馈文章的问题
      const { data: res } = await reportArticle(
        this.article.art_id.toString(), // 文章的 Id
        info.value // 文章存在的问题编号
      )
      if (res.message === 'OK') {
        // 反馈成功，从列表中移除对应的文章
        this.$emit('remove-article', this.article.art_id.toString())
      }
      this.show = false
    }
  }
}
</script>

<style lang="less" scoped>
.article-info-container {
  border-top: 1px solid #f8f8f8;
}

.label-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.thumb {
  width: 113px;
  height: 70px;
  background-color: #f8f8f8;
  object-fit: cover;
}

.title-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.thumb-box {
  display: flex;
  justify-content: space-between;
}

.center-title {
  text-align: center;
}
</style>
