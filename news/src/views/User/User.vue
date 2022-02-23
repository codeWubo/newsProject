<template>
  <div class="user-container" v-if="user.name">
    <!-- 用户基本信息面板 -->
    <div class="user-card">
      <!-- 用户头像、姓名 -->
      <van-cell>
        <!-- 使用 title 插槽来自定义标题 -->
        <template #icon>
          <img :src="user.photo" alt="" class="avatar">
        </template>
        <template #title>
          <span class="username">{{user.name}}</span>
        </template>
        <template #label>
          <van-tag color="#fff" text-color="#007bff">申请认证</van-tag>
        </template>
      </van-cell>
      <!-- 动态、关注、粉丝 -->
      <div class="user-data">
        <div class="user-data-item">
          <span>{{user.art_count}}</span>
          <span>动态</span>
        </div>
        <div class="user-data-item">
          <span>{{user.follow_count}}</span>
          <span>关注</span>
        </div>
        <div class="user-data-item">
          <span>{{user.fans_count}}</span>
          <span>粉丝</span>
        </div>
      </div>
    </div>

    <!-- 操作面板 -->
    <van-cell-group class="action-card">
      <van-cell icon="edit" title="编辑资料" is-link :to="{name: 'user-edit'}" />
      <van-cell icon="chat-o" title="智能客服" is-link to="/chat" />
      <van-cell icon="warning-o" title="退出登录" is-link @click="logout" />
    </van-cell-group>
  </div>
</template>

<script>
// 按需导入 API 接口
import { getUserInfo } from '@/api/user'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'User',
  data() {
    return {}
  },
  computed: {
    // 映射需要的 state 数据
    ...mapState(['user'])
  },
  // 被激活了
  activated() {
    this.initUserInfo()
  },
  methods: {
    // 映射需要的 mutations 方法
    ...mapMutations(['updateUserInfo', 'cleanState']),
    // 初始化用户的基本信息
    async initUserInfo() {
      const { data: res } = await getUserInfo()
      if (res.message === 'OK') {
        console.log(res)
        // this.user = res.data
        this.updateUserInfo(res.data)
      }
    },
    // 退出登录
    async logout() {
      // 1. 询问用户是否退出登录
      const confirmResult = await this.$dialog
        .confirm({
          title: '提示',
          message: '确认退出登录吗？'
        })
        .catch(err => err)

      // 2. 用户取消了退出登录
      if (confirmResult === 'cancel') return

      // 3. 执行退出登录的操作
      // 3.1 调用 mutations 中的方法，清空 vuex 中的数据
      this.cleanState()
      // 3.2 跳转到登录页面
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
.user-container {
  .user-card {
    background-color: #007bff;
    color: white;
    padding-top: 20px;
    .van-cell {
      background: #007bff;
      color: white;
      &::after {
        display: none;
      }
      .avatar {
        width: 60px;
        height: 60px;
        background-color: #fff;
        border-radius: 50%;
        margin-right: 10px;
      }
      .username {
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
  .user-data {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    font-size: 14px;
    padding: 30px 0;
    .user-data-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 33.33%;
    }
  }
}
</style>
