// 获取当前编译的环境 development 或 production
const env = process.env.NODE_ENV
// 当前是否处于发布模式
const isProd = env === 'production'

// 插件的数组
const plugins = []
// 判断是否处于发布模式
if (isProd) {
  plugins.push('transform-remove-console')
}

module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins
}
