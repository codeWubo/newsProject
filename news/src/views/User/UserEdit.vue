<template>
  <div class="user-edit-container">
    <!-- Header 区域 -->
    <van-nav-bar title="编辑资料" left-arrow @click-left="$router.back()" fixed />

    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center>
        <template #default>
          <van-image round class="avatar" :src="profile.photo" @click="choosePhoto" />
          <!-- file 选择框 -->
          <input type="file" ref="iptFile" v-show="false" accept="image/*" @change="onFileChange" />
        </template>
      </van-cell>
      <van-cell title="名称" is-link :value="profile.name" @click="showNameDialog" />
      <van-cell title="性别" is-link :value="profile.gender === 1 ? '男' : '女'" @click="isShowGender = true" />
      <van-cell title="生日" is-link :value="profile.birthday" @click="isShowBirth = true" />
    </van-cell-group>

    <!-- 修改用户名称的对话框 -->
    <van-dialog v-model="isShowNameDialog" title="修改名称" show-cancel-button :before-close="onNameDialogBeforeClose" @closed="username = ''">
      <!-- 输入框 -->
      <van-field v-model.trim="username" input-align="center" maxlength="7" placeholder="请输入名称" autofocus ref="unameRef" />
    </van-dialog>

    <!-- 修改性别 -->
    <van-action-sheet v-model="isShowGender" :actions="genderActions" @select="onGenderSelect" title="请选择性别" close-on-click-action />

    <!-- 修改时间 -->
    <van-action-sheet v-model="isShowBirth">
      <van-datetime-picker v-model="currentDate" type="date" title="选择出生日期" :min-date="minDate" :max-date="maxDate" :show-toolbar="true" @cancel="onPickerCancel" @confirm="onPickerConfirm" />
    </van-action-sheet>
  </div>
</template>

<script>
// 1. 按需导入 API 和辅助函数
import { getProfile, updateProfile, updateUserPhoto } from '@/api/user'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'UserEdit',
  data() {
    return {
      // 是否展示修改用户名的对话框
      isShowNameDialog: false,
      // 名称
      username: '',
      // 是否展示选择性别的 ActionSheet
      isShowGender: false,
      // 性别的可选项
      genderActions: [
        { name: '男', value: 1 },
        { name: '女', value: 0 }
      ],
      // 是否展示选择出生日期的 ActionSheet
      isShowBirth: false,
      // 最小的可选的日期
      minDate: new Date(1900, 0, 1),
      // 最大的可选日期
      maxDate: new Date(2030, 10, 1),
      // 当前日期
      currentDate: new Date()
    }
  },
  // 2. 页面首次被加载时请求用户的简介
  created() {
    this.getUserProfile()
  },
  computed: {
    // 2.1 映射数据
    ...mapState(['profile'])
  },
  // 侦听器
  watch: {
    profile(newVal) {
      if (newVal.birthday) {
        this.currentDate = new Date(newVal.birthday)
      }
    }
  },
  methods: {
    // 2.2 映射方法
    ...mapMutations(['updateProfile']),
    // 3. 获取用户的简介信息
    async getUserProfile() {
      const { data: res } = await getProfile()
      if (res.message === 'OK') {
        console.log(res)
        this.updateProfile(res.data)
      }
    },
    // 展示修改名称的对话框
    showNameDialog() {
      this.username = this.profile.name
      this.isShowNameDialog = true
      this.$nextTick(() => {
        this.$refs.unameRef.focus()
      })
    },
    // 用户名对话框 - 关闭之前
    onNameDialogBeforeClose(action, done) {
      // 1. 取消
      if (action !== 'confirm') {
        done()
        return
      }
      // 2. 确认
      if (this.username.length === 0 || this.username.length > 7) {
        // 长度不合法
        this.$notify({
          type: 'warning',
          message: '名称的长度为1-7个字符',
          duration: 2000
        })
        done(false)
        return
      }
      // 3. TODO：发起请求修改名称
      this.updateUserProfile(
        { name: this.username },
        '名称被占用，请更换后重试！',
        done
      )
    },
    // 更新用户简介的方法
    async updateUserProfile(data, errMsg, done) {
      try {
        // 3.1 发起请求，更新数据库
        const { data: res } = await updateProfile(data)
        if (res.message === 'OK') {
          // 重新请求用户的数据
          this.getUserProfile()
          console.log(res)
          // 提示用户成功
          this.$toast.success('修改成功！')
          // 关闭对话框
          done && done()
        }
      } catch {
        // 3.2 如果网络请求失败，则对用户进行友好提示
        this.$notify({
          type: 'warning',
          message: errMsg,
          duration: 2000
        })
        done && done(false)
      }
    },
    // 选择了性别
    onGenderSelect(item) {
      const data = { gender: item.value }
      this.updateUserProfile(data, '性别更新失败，请稍后再试！')
    },
    // 日期控件 - 取消
    onPickerCancel() {
      this.isShowBirth = false
    },
    // 日期控件 - 确认
    onPickerConfirm(value) {
      // 1. 隐藏选择日期的 ActionSheet
      this.isShowBirth = false

      // 2. 格式化时间
      const dt = new Date(value)
      const y = dt.getFullYear()
      const m = (dt.getMonth() + 1).toString().padStart(2, '0')
      const d = dt.getDate().toString().padStart(2, '0')

      const dtStr = `${y}-${m}-${d}`

      // 3. 更新出生日期
      this.updateUserProfile({ birthday: dtStr }, '更新生日失败，请稍后再试！')
    },
    // 选择头像的照片
    choosePhoto() {
      this.$refs.iptFile.click()
    },
    // 文件选择框的选中项发生了变化
    async onFileChange(e) {
      // 1. 获取选中的文件列表
      const files = e.target.files
      // 2. 判断选中的个数是否为 0
      if (files.length === 0) return

      // 3.1 创建 FormData 实例
      const fd = new FormData()
      // 3.2 添加用户的头像
      fd.append('photo', files[0])

      // 4.1 调用接口
      const { data: res } = await updateUserPhoto(fd)
      if (res.message === 'OK') {
        // 4.2 重新拉取数据
        this.getUserProfile()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.user-edit-container {
  padding-top: 46px;
  .avatar {
    width: 50px;
    height: 50px;
  }
}
</style>
