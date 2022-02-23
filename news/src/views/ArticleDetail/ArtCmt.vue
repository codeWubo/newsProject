<template>
  <div :class="isShowCmtInput ? 'art-cmt-container-2' : 'art-cmt-container-1'">
    <!-- 评论列表 -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" class="cmt-list" :immediate-check="false">
      <!-- 评论的 Item 项 -->
      <div class="cmt-item" v-for="item in cmtlist" :key="item.com_id.toString()">
        <!-- 头部区域 -->
        <div class="cmt-header">
          <!-- 头部左侧 -->
          <div class="cmt-header-left">
            <img :src="item.aut_photo" alt="" class="avatar">
            <span class="uname">{{item.aut_name}}</span>
          </div>
          <!-- 头部右侧 -->
          <div class="cmt-header-right">
            <van-icon name="like" size="16" color="red" v-if="item.is_liking" @click="setLike(false, item)" />
            <van-icon name="like-o" size="16" color="gray" v-else @click="setLike(true, item)" />
          </div>
        </div>
        <!-- 主体区域 -->
        <div class=" cmt-body">
          {{item.content}}
        </div>
        <!-- 尾部区域 -->
        <div class="cmt-footer">{{item.pubdate | dateFormat}}</div>
      </div>
    </van-list>

    <!-- 底部添加评论区域 - 1 -->
    <div class="add-cmt-box van-hairline--top" v-if="!isShowCmtInput">
      <van-icon name="arrow-left" size="18" @click="$router.back()" />
      <div class="ipt-cmt-div" @click="showTextarea">发表评论</div>
      <div class="icon-box">
        <!-- 评论的小图标 -->
        <van-badge :content="cmtCount ? cmtCount : ''" :max="99">
          <van-icon name="comment-o" size="20" @click="scrollToCmtList" />
        </van-badge>
        <!-- 收藏的小图标 -->
        <van-icon name="star-o" size="20" />
        <!-- 分享的小图标 -->
        <van-icon name="share-o" size="20" />
      </div>
    </div>

    <!-- 底部添加评论区域 - 2 -->
    <div class="cmt-box van-hairline--top" v-else>
      <textarea placeholder="友善评论、理性发言、阳光心灵" ref="cmtIpt" @blur="onCmtIptBlur" v-model.trim="cmt"></textarea>
      <van-button type="default" :disabled="cmt.length === 0" @click="pubCmt">发布</van-button>
    </div>
  </div>
</template>

<script>
// http://localhost:8080/#/article/1323570687952027648
import {
  getCmtList,
  addCmtLike,
  removeCmtLike,
  pubComment
} from '@/api/article'

export default {
  name: 'ArtCmt',
  props: {
    // 文章的 Id
    artId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      // 偏移量
      offset: null,
      // 是否正在加载数据
      loading: false,
      // 数据是否加载完毕了
      finished: false,
      // 评论列表的数据
      cmtlist: [],
      // 评论数量
      cmtCount: 0,
      // 是否展示评论的输入框
      isShowCmtInput: false,
      // 用户输入的评论内容
      cmt: ''
    }
  },
  created() {
    this.onLoad()
  },
  methods: {
    // 触发了加载数据的事件
    async onLoad() {
      const { data: res } = await getCmtList(this.artId, this.offset)
      console.log(res)
      if (res.message === 'OK') {
        // 为偏移量赋值
        this.offset = res.data.last_id
        this.cmtCount = res.data.total_count
        // 为评论列表数据赋值
        this.cmtlist = [...this.cmtlist, ...res.data.results]

        // 重置 loading 和 finished
        this.loading = false
        if (res.data.results.length === 0) {
          this.finished = true
        }
      }
    },
    // 切换评论的点赞与取消点赞
    async setLike(likeState, cmt) {
      // 获取评论的 Id
      const cmtId = cmt.com_id.toString()
      if (likeState) {
        // 点赞
        await addCmtLike(cmtId)
        this.$toast.success('点赞成功!')
      } else {
        // 取消点赞
        await removeCmtLike(cmtId)
        this.$toast.success('取消点赞成功!')
      }

      // 切换当前评论的点赞状态
      cmt.is_liking = likeState
    },
    // 点击发表评论的 div, 展示 textarea 所在的盒子
    showTextarea() {
      this.isShowCmtInput = true
      this.$nextTick(() => {
        this.$refs.cmtIpt.focus()
      })
    },
    // 文本框失去焦点
    onCmtIptBlur() {
      // 延迟隐藏的操作，否则无法触发按钮的 click 事件处理函数
      setTimeout(() => {
        this.isShowCmtInput = false
        this.cmt = ''
      })
    },
    // 滑动到评论列表区域
    scrollToCmtList() {
      // 目标位置（文章信息区域的高度）
      this.smoothScroll()
    },
    // 实现滚动条平滑滚动的方法
    smoothScroll() {
      // 1.1 返回文档在垂直方向已滚动的像素值
      const now = window.scrollY
      // 1.2 目标位置（文章信息区域的高度）
      let dist = document.querySelector('.article-container').offsetHeight
      // 1.3 可滚动高度 = 整个文档的高度 - 浏览器窗口的视口（viewport）高度
      const avalibleHeight =
        document.documentElement.scrollHeight - window.innerHeight

      // 2.1 如果【目标高度】 大于 【可滚动的高度】
      if (dist > avalibleHeight) {
        // 2.2 就把目标高度，设置为可滚动的高度
        dist = avalibleHeight
      }

      // 3. 动态计算出步长值
      const step = (dist - now) / 10

      setTimeout(() => {
        // 4.2 如果当前的滚动的距离不大于 1px，则直接滚动到目标位置，并退出递归
        if (Math.abs(step) <= 1) {
          console.log('stop')
          return window.scrollTo(0, dist)
        }
        // 4.1 每隔 10ms 执行一次滚动，并递归地进行下一次的滚动
        window.scrollTo(0, now + step)
        this.smoothScroll()
      }, 10)
    },
    // 发布新评论
    async pubCmt() {
      // 转存评论内容
      const cmt = this.cmt
      // 清空评论文本框
      this.cmt = ''
      // 隐藏输入区域
      this.isShowCmtInput = false
      // TODO：发布评论
      const { data: res } = await pubComment(this.artId, cmt)
      if (res.message === 'OK') {
        // 更新评论数据（头部插入）
        this.cmtlist = [res.data.new_obj, ...this.cmtlist]
        // 提示成功
        this.$toast.success('评论成功！')
        // 总评论数 +1
        this.cmtCount++
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cmt-list {
  padding: 10px;
  .cmt-item {
    padding: 15px 0;
    + .cmt-item {
      border-top: 1px solid #f8f8f8;
    }
    .cmt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .cmt-header-left {
        display: flex;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          background-color: #f8f8f8;
          border-radius: 50%;
          margin-right: 15px;
        }
        .uname {
          font-size: 12px;
        }
      }
    }
    .cmt-body {
      font-size: 14px;
      line-height: 28px;
      text-indent: 2em;
      margin-top: 6px;
      word-break: break-all;
    }
    .cmt-footer {
      font-size: 12px;
      color: gray;
      margin-top: 10px;
    }
  }
}

// 外层容器
.art-cmt-container-1 {
  padding-bottom: 46px;
}
.art-cmt-container-2 {
  padding-bottom: 80px;
}

// 发布评论的盒子
.add-cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 46px;
  line-height: 46px;
  padding-left: 10px;
  .ipt-cmt-div {
    flex: 1;
    border: 1px solid #efefef;
    border-radius: 15px;
    height: 30px;
    font-size: 12px;
    line-height: 30px;
    padding-left: 15px;
    margin-left: 10px;
    background-color: #f8f8f8;
  }
  .icon-box {
    width: 40%;
    display: flex;
    justify-content: space-evenly;
    line-height: 0;
  }
}

.child {
  width: 20px;
  height: 20px;
  background: #f2f3f5;
}

.cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding-left: 10px;
  box-sizing: border-box;
  background-color: white;
  textarea {
    flex: 1;
    height: 66%;
    border: 1px solid #efefef;
    background-color: #f8f8f8;
    resize: none;
    border-radius: 6px;
    padding: 5px;
  }
  .van-button {
    height: 100%;
    border: none;
  }
}
</style>
