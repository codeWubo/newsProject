const path = require('path')

// 获取当前编译的环境 development 或 production
const env = process.env.NODE_ENV
// 当前是否处于发布模式
const isProd = env === 'production'

// 自定义主题的文件路径
const coverPath = path.join(__dirname, './src/cover.less')

// 自定义的 webpack 配置项
const customWebpackConfig = {
  // 打包优化
  externals: {
    'highlight.js': 'hljs',
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
    axios: 'axios',
    vant: 'vant',
    'socket.io-client': 'io',
    dayjs: 'dayjs',
    'bignumber.js': 'BigNumber'
  }
}

module.exports = {
  // publicPath: '/vue2-toutiao',
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // 通过 less 文件覆盖（文件路径为绝对路径）
          hack: `true; @import "${coverPath}";`
        }
      }
    }
  },
  // 增强 vue-cli 的 webpack 配置项
  configureWebpack: isProd ? customWebpackConfig : {},
  // 对 webpack 已有的配置进行修改
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      // 打印 html 插件的参数项
      // console.log(args)

      // 当前是否处于发布模式
      args[0].isProd = isProd
      return args
    })
  }
}
