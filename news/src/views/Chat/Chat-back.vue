<template>
  <div class="container">
    <!-- 固定导航 -->
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="智能客服"></van-nav-bar>

    <!-- 聊天主体区域 -->
    <div class="chat-list">
      <!-- 左侧是客服 -->
      <div v-for="(item, index) in list" :key="index">
        <div class="chat-item left" v-if="item.name === 'xs'">
          <van-image fit="cover" round src="https://img.yzcdn.cn/vant/cat.jpeg" />
          <div class="chat-pao">{{item.msg}}</div>
        </div>

        <!-- 右侧是当前用户 -->
        <div class="chat-item right" v-else>
          <div class="chat-pao">{{item.msg}}</div>
          <van-image fit="cover" round :src="profile.photo || 'https://img.yzcdn.cn/vant/cat.jpeg'" />
        </div>
      </div>
    </div>

    <!-- 对话区域 -->
    <div class="reply-container van-hairline--top">
      <van-field v-model.trim="word" placeholder="说点什么...">
        <template #button>
          <span @click="send()" style="font-size:12px;color:#999">提交</span>
        </template>
      </van-field>
    </div>
  </div>
</template>

<script>
// 按需导入辅助函数
import { mapState } from 'vuex'
// 1.1 导入 sockjs-client 包
import SockJS from 'sockjs-client'
// 1.2 定义变量，存储 websocket 实例
let sock = null

export default {
  name: 'Chat',
  data() {
    return {
      // 用户填写的内容
      word: '',
      // 所有的聊天消息
      list: []
    }
  },
  created() {
    // 创建客户端 websocket 的实例
    sock = new SockJS('http://www.liulongbin.top:9999/chat')

    // 建立连接的事件
    sock.onopen = () => {
      console.log('open')
    }

    // 接收到消息的事件
    sock.onmessage = e => {
      // 把服务器发送过来的消息，存储到 list 数组中
      this.list.push({
        name: 'xs',
        msg: e.data
      })
    }

    // 关闭的事件
    sock.onclose = () => {
      console.log('close')
    }
  },
  // 组件被销毁之前，清空 sock 对象
  beforeDestroy() {
    sock.close()
    sock = null
  },
  methods: {
    // 向服务端发送消息
    send() {
      // 判断内容是否为空
      if (!this.word) return

      // 添加聊天消息到 list 列表中
      this.list.push({
        name: 'me',
        msg: this.word
      })

      // 把消息发送给 websocket 服务器
      sock.send(this.word)

      // 清空文本框的内容
      this.word = ''
    },
    // 滚动到页面底部
    scrollToBottom() {
      // 获取到所有的聊天 Item 项
      const chatItem = document.querySelectorAll('.chat-item')
      // 获取到最后一项对应的 DOM 元素
      const lastItem = chatItem[chatItem.length - 1]
      // 调用 scrollIntoView() 方法，显示这个元素
      lastItem.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      })
    }
  },
  watch: {
    list() {
      // 监视到 list 数据变化后，等下次 DOM 更新完毕，再执行滚动到底部的操作
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    }
  },
  computed: {
    // 把用户的信息，映射为当前组件的计算属性
    ...mapState(['profile'])
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background: #fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item {
      padding: 10px;
      .van-image {
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao {
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before {
          content: '';
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top: 0.5px solid #c2d9ea;
          border-right: 0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right {
  text-align: right;
  .chat-pao {
    margin-left: 0;
    margin-right: 15px;
    &::before {
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left {
  text-align: left;
  .chat-pao {
    margin-left: 15px;
    margin-right: 0;
    &::before {
      left: -5px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
}
</style>
