<template>
  <div class="home-container">
    <!-- 头部区域 -->
    <van-nav-bar fixed>
      <template #left>
        <h4>程序员资讯</h4>
      </template>
      <template #right>
        <van-icon name="search" color="white" size="18" @click="$router.push('/search')" />
      </template>
    </van-nav-bar>

    <!-- Tab 标签页 -->
    <van-tabs fixed offset-top="1.22667rem" v-model="activeTabIndex">
      <van-tab v-for="item in channels" :key="item.id" :title="item.name">
        <!-- 文章列表组件 -->
        <article-list :id="item.id"></article-list>
      </van-tab>
    </van-tabs>

    <!-- 右侧的编辑频道的小图标 -->
    <van-icon name="plus" size="14" class="moreChannels" @click="show = true" />

    <!-- 弹出层组件 -->
    <!-- close-on-click-overlay 是否在点击遮罩层后关闭（false 不关闭） -->
    <van-popup v-model="show" :close-on-click-overlay="false" @closed="onPopupClosed">
      <div class="popup-container">
        <!-- 弹出层的头部区域 -->
        <van-nav-bar title="频道管理">
          <template #right>
            <van-icon name="cross" size="14" color="white" @click="show = false" />
          </template>
        </van-nav-bar>
        <!-- 弹出层的主体区域 -->
        <div class="pop-body">
          <!-- 我的频道 -->
          <div class="my-channel-box">
            <div class="channel-title">
              <div>
                <span class="title-bold">已添加频道：</span>
                <span class="title-gray">{{isEdit ? '点击移除频道' : '点击进入频道'}}</span>
              </div>
              <span @click="isEdit = !isEdit" class="btn-edit">{{isEdit ? '完成' : '编辑'}}</span>
            </div>
            <!-- 我的频道列表 -->
            <van-row type="flex">
              <van-col span="6" v-for="(item, i) in channels" :key="item.id">
                <!-- 频道的 Item 项 -->
                <div class="channel-item van-hairline--surround" @click="removeChannel(item.id, i)">
                  {{item.name}}
                  <!-- 删除的徽标 -->
                  <van-badge color="transparent" class="cross-badge" v-if="isEdit && item.id !== 0">
                    <template #content>
                      <van-icon name="cross" class="badge-icon" color="#cfcfcf" size="12" />
                    </template>
                  </van-badge>
                </div>
              </van-col>
            </van-row>
          </div>

          <div class="van-hairline--top sp-line"></div>

          <!-- 更多频道 -->
          <div class="more-channel-box">
            <div class="channel-title">
              <div>
                <span class="title-bold">可添加频道：</span>
                <span class="title-gray">点击添加频道</span>
              </div>
            </div>
            <!-- 更多频道列表 -->
            <van-row type="flex">
              <van-col span="6" v-for="item in moreChannels" :key="item.id">
                <div class="channel-item van-hairline--surround" @click="addChannel(item)">{{item.name}}</div>
              </van-col>
            </van-row>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
// 按需导入获取频道列表数据的 API 方法
import { getChannelList, getAllChannels, updateMyChannels } from '@/api/home'
import ArticleList from './ArticleList.vue'

export default {
  name: 'Home',
  data() {
    return {
      // 频道列表
      channels: [],
      // 所有频道的列表数据
      allChannels: [],
      // 控制弹出层的显示与隐藏
      show: false,
      // 频道数据是否处于编辑状态
      isEdit: false,
      // 激活的 Tab 标签页索引
      activeTabIndex: 0
    }
  },
  created() {
    this.getChannels()
    this.getAllChannels()
  },
  methods: {
    // 获取频道列表的数据
    async getChannels() {
      const { data: res } = await getChannelList()
      if (res.message === 'OK') {
        this.channels = res.data.channels
      }
    },
    // 获取所有频道列表的数据
    async getAllChannels() {
      const { data: res } = await getAllChannels()
      if (res.message === 'OK') {
        this.allChannels = res.data.channels
      }
    },
    // 移除频道
    removeChannel(id, index) {
      // 如果当前不处于编辑状态，直接 return
      if (!this.isEdit) {
        this.activeTabIndex = index
        this.show = false
        return
      }
      // 如果当前要删除的 Id 等于 0，则不允许被删除
      if (id === 0) return
      // 对频道列表进行过滤
      this.channels = this.channels.filter(x => x.id !== id)
      this.updateChannels()
    },
    // 更新频道数据
    async updateChannels() {
      // 1. 处理要发送到服务器的 data 数据
      const data = {
        channels: this.channels
          .filter(x => x.id !== 0) // 不需要把 “推荐” 发送给后端
          .map((x, i) => ({
            id: x.id, // 频道的 Id
            seq: i + 1 // 频道的序号（给后端排序用的）
          }))
      }
      // 2. 调用 API 接口，把频道数据存储到后端
      const { data: res } = await updateMyChannels(data)
      if (res.message === 'OK') {
        // 3. 通过 notify 弹框提示用户更新成功
        this.$notify({ type: 'success', message: '更新成功', duration: 1000 })
      }
    },
    // 新增频道
    addChannel(channel) {
      this.channels.push(channel)
      this.updateChannels()
    },
    // 监听关闭弹出层且动画结束后触发的事件
    onPopupClosed() {
      this.isEdit = false
    }
  },
  computed: {
    // 更多频道的数据
    moreChannels() {
      return this.allChannels.filter(x => {
        const index = this.channels.findIndex(y => y.id === x.id)
        if (index === -1) return true
      })
    }
  },
  components: {
    ArticleList
  }
}
</script>

<style lang="less" scoped>
.home-container {
  padding-top: 46px;
}

.logo {
  height: 80%;
}

// 设置 tabs 容器的样式
/deep/ .van-tabs__wrap {
  padding-right: 30px;
  background-color: #fff;
}

// 设置小图标的样式
.moreChannels {
  position: fixed;
  top: 62px;
  right: 8px;
  z-index: 999;
}

.van-popup,
.popup-container {
  background-color: transparent;
  height: 100%;
  width: 100%;
}

.popup-container {
  display: flex;
  flex-direction: column;
}

.pop-body {
  flex: 1;
  overflow: scroll;
  padding: 8px;
  background-color: white;
}

.my-channel-box,
.more-channel-box {
  .channel-title {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    line-height: 28px;
    padding: 0 6px;
    .title-bold {
      font-weight: bold;
    }
    .title-gray {
      color: gray;
      font-size: 12px;
    }
  }
}

.btn-edit {
  border: 1px solid #a3a2a2;
  padding: 0 10px;
  line-height: 20px;
  height: 20px;
  border-radius: 6px;
  font-size: 12px;
}

.channel-item {
  font-size: 12px;
  text-align: center;
  line-height: 36px;
  background-color: #fafafa;
  margin: 6px;
}

.cross-badge {
  position: absolute;
  right: -3px;
  top: 0;
  border: none;
}

.sp-line {
  margin: 10px 0 20px 0;
}
</style>
