<template>
  <div>
    <van-sticky>
      <van-nav-bar title="登录" />
    </van-sticky>

    <!-- 提交表单且验证通过后触发 submit 事件 -->
    <van-form @submit="onSubmit">
      <van-field v-model="formLogin.mobile" type="tel" label="手机号" placeholder="请输入手机号" required :rules="formLoginRules.mobile" />
      <van-field v-model="formLogin.code" type="password" label="密码" placeholder="请输入密码" required :rules="formLoginRules.code" />
      <div style="margin: 16px;">
        <van-button block type="info" native-type="submit">登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login } from '@/api/user'
import { mapMutations } from 'vuex'

export default {
  name: 'Login',
  data() {
    return {
      // 登录的表单数据对象
      formLogin: {
        mobile: '13888888888',
        code: '246810'
      },
      // 登录表单的验证规则对象
      formLoginRules: {
        mobile: [
          { required: true, message: '请填写手机号', trigger: 'onBlur' },
          {
            pattern: /^1\d{10}$/,
            message: '请填写正确的手机号',
            trigger: 'onBlur'
          }
        ],
        code: [{ required: true, message: '请填写密码', trigger: 'onBlur' }]
      }
    }
  },
  methods: {
    // 映射 mutations 中的方法
    ...mapMutations(['updateTokenInfo']),
    // 组件内自定义的方法
    async onSubmit() {
      const { data: res } = await login(this.formLogin)
      if (res.message === 'OK') {
        this.updateTokenInfo(res.data)

        // 判断是否携带了 pre 参数
        if (this.$route.query.pre) {
          // 如果有，则跳转到指定页面
          this.$router.push(this.$route.query.pre)
        } else {
          // 如果没有，则跳转到 / 主页
          this.$router.push('/')
        }
        // 跳转到主页
        // this.$router.push('/')
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
