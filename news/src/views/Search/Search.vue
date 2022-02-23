<template>
  <div>
    <!-- 头部区域 -->
    <div class="search-header">
      <!-- 后退按钮 -->
      <van-icon name="arrow-left" color="white" size="18" class="goback" @click="$router.go(-1)" />
      <!-- 搜索组件 -->
      <van-search v-model.trim="kw" placeholder="请输入搜索关键词" background="#007BFF" shape="round" ref="search" @input="onInput" />
    </div>

    <!-- 搜索建议 -->
    <div class="sugg-list" v-if="kw.length !== 0">
      <div class="sugg-item" v-for="(item, i) in suggList" :key="i" v-html="item" @click="gotoSearchResult"></div>
    </div>

    <!-- 搜索历史 -->
    <div class="search-history" v-else>
      <!-- 标题 -->
      <van-cell title="搜索历史">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
          <van-icon name="delete" class="search-icon" @click="clearHistory" />
        </template>
      </van-cell>

      <!-- 历史列表 -->
      <div class="history-list">
        <span class="history-item" v-for="(tag, i) in history" :key="i" @click="gotoSearchResult(tag)">{{tag}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getSuggList } from '@/api/search'

export default {
  name: 'Search',
  data() {
    return {
      // 搜索关键词
      kw: '',
      // 延时器的 Id
      timerId: null,
      // 建议列表
      suggList: [],
      // 搜索历史
      history: JSON.parse(window.localStorage.getItem('searchHistory') || '[]')
    }
  },
  mounted() {
    // 如果搜索组件的 ref 引用存在，则获取下面的 input 输入框，使其自动获得焦点
    this.$refs.search && this.$refs.search.querySelector('input').focus()
  },
  methods: {
    // 监听文本框的输入事件
    onInput() {
      // 清除延时器
      clearTimeout(this.timerId)
      // 判断是否输入了内容
      if (this.kw.length === 0) {
        this.suggList = []
        return
      }
      // 创建延时器
      this.timerId = setTimeout(() => {
        // TODO：请求搜索建议的关键词
        this.getKeywordsList()
      }, 500)
    },
    // 请求搜索关键词的列表
    async getKeywordsList() {
      const { data: res } = await getSuggList(this.kw)
      if (res.message === 'OK') {
        this.suggList = this.hightlightKeywords(res.data.options)
        // 创建一个 Set 对象，用来去重
        const set = new Set([this.kw, ...this.history])
        // 把去重之后的结果，转化成数组，存放到 history 数组中
        this.history = Array.from(set)
      }
    },
    // 高亮关键词
    hightlightKeywords(arr) {
      // 1. 创建正则实例，其中：
      // 修饰符 i 表示执行对大小写不敏感的匹配
      // 修饰符 g 表示全局匹配（查找所有匹配而非在找到第一个匹配后停止）
      const reg = new RegExp(this.kw, 'ig')
      // 2. 循环数组中的每一项，返回一个处理好的新数组
      return arr.map(x => {
        // 2.1 调用字符串的 .replace(正则, 替换的函数) 方法进行替换
        const result = x.replace(reg, val => {
          // 2.2 return 一个替换的结果
          return `<span style="color: red; font-weight: bold;">${val}</span>`
        })
        // 3. 当前 map 循环需要 return 一个处理的结果
        return result
      })
    },
    // 清空历史记录
    clearHistory() {
      this.history = []
    },
    // 点击搜索结果，跳转到搜索结果页
    gotoSearchResult(e) {
      // 获取到搜索关键字
      const q = typeof e === 'string' ? e : e.target.innerText
      // 编程式导航 + 命名路由
      this.$router.push({
        // 路由名称
        name: 'search-result',
        // 路由参数
        params: {
          kw: q
        }
      })
    }
  },
  watch: {
    // 监视 history 数组的变化，持久化存储到本地
    history(newVal) {
      window.localStorage.setItem('searchHistory', JSON.stringify(newVal))
    }
  }
}
</script>

<style lang="less" scoped>
.search-header {
  height: 46px;
  display: flex;
  align-items: center;
  background-color: #007bff;
  overflow: hidden;
  // 后退按钮
  .goback {
    padding-left: 14px;
  }
  // 搜索组件
  .van-search {
    flex: 1;
  }
}

.sugg-list {
  .sugg-item {
    padding: 0 15px;
    border-bottom: 1px solid #f8f8f8;
    font-size: 14px;
    line-height: 50px;
    // 实现省略号的三行代码
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.search-icon {
  font-size: 16px;
  line-height: inherit;
}

.history-list {
  padding: 0 10px;
  .history-item {
    display: inline-block;
    font-size: 12px;
    padding: 8px 14px;
    background-color: #efefef;
    margin: 10px 8px 0px 8px;
    border-radius: 10px;
  }
}
</style>
