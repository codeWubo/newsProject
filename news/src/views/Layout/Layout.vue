<template>
  <div class="layout-container">
    <!-- 路由占位符 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>

    <!-- TabBar 区域 -->
    <van-tabbar route>
      <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/user">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'Layout',
  data() {
    return {}
  }
}
</script>

<style lang="less" scoped>
.layout-container {
  padding-bottom: 50px;
}

.van-tabbar {
  border-top: 1px solid #f8f8f8;
}
</style>
