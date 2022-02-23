## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).



## 1. 初始化项目



### 1.1 创建基本的项目结构

1. 运行如下的命令：

   ```bash
   vue create news
   ```

2. 清空 `App.vue` 组件中的代码，并删除 `components` 目录下的 `HelloWorld.vue` 组件

3. 清空 `/src/router/index.js` 路由模块：

   ```js
   import Vue from 'vue'
   import VueRouter from 'vue-router'
   
   Vue.use(VueRouter)
   
   // 清空路由规则
   const routes = []
   
   const router = new VueRouter({
     routes
   })
   
   export default router
   
   ```

4. 执行 `npm run serve` 命令，把项目运行起来看效果

5. 添加 `.prettierrc` 的配置文件：

   ```json
   {
     "semi": false,
     "singleQuote": true,
     "trailingComma": "none"
   }
   ```

6. 在 `.eslintrc.js` 配置文件中，添加如下的规则：

   ```js
   rules: {
     'space-before-function-paren': 0
   }
   ```



### 1.2 配置 vant 组件库

> 官网地址：https://vant-contrib.gitee.io/vant/#/zh-CN/

完整导入：

```js
import Vue from 'vue'

import Vant from 'vant'
import 'vant/lib/index.css'

Vue.use(Vant)
```



### 1.3 Vant 组件库的 rem 布局适配

> 参考文档：https://vant-contrib.gitee.io/vant/#/zh-CN/advanced-usage#rem-bu-ju-gua-pei

#### 1.3.1 配置 postcss-pxtorem

1. 运行如下的命令：

   ```bash
   npm install postcss-pxtorem -D
   ```

2. 在 vue 项目根目录下，创建 postcss 的配置文件 `postcss.config.js`，并初始化如下的配置：

   ```js
   module.exports = {
     plugins: {
       'postcss-pxtorem': {
         rootValue: 37.5, // 根节点的 font-size 值
         propList: ['*']  // 要处理的属性列表，* 代表所有属性
       }
     }
   }
   ```

3. 关于 px -> rem 的换算：

   ```
   iphone6
   
   375px = 10rem
   37.5px = 1rem
   1px = 1/37.5rem
   12px = 12/37.5rem = 0.32rem
   ```



#### 1.3.2 配置 amfe-flexible

1. 运行如下的命令：

   ```bash
   npm i amfe-flexible -S
   ```

2. 在 main.js 入口文件中导入 `amfe-flexible`：

   ```js
   import 'amfe-flexible'
   ```

   

### 1.4 配置 axios

1. 安装：

   ```bash
   npm i axios -S
   ```

2. 创建 `/src/utils/request.js` 模块：

   ```js
   import axios from 'axios'
   
   const instance = axios.create({
     // 请求根路径
     baseURL: 'http://toutiao-app.itheima.net'
   })
   
   export default instance
   ```

   

## 2. 登录功能



### 2.1 使用路由渲染登录组件

1. 创建 `/src/views/Login/Login.vue` 登录组件：

   ```vue
   <template>
     <div>
       <h1>登录组件</h1>
     </div>
   </template>
   
   <script>
   export default {
     name: 'Login'
   }
   </script>
   
   <style lang="less" scoped>
   </style>
   ```

2. 修改路由模块，导入`Login.vue` 登录组件并声明路由规则：

   ```js
   import Vue from 'vue'
   import VueRouter from 'vue-router'
   
   // 1. 导入组件
   import Login from '@/views/Login/Login.vue'
   
   Vue.use(VueRouter)
   
   const routes = [
     // 2. 登录组件的路由规则
     { path: '/login', component: Login, name: 'login' }
   ]
   
   const router = new VueRouter({
     routes
   })
   
   export default router
   ```

3. 在 `App.vue` 中声明路由占位符：

   ```vue
   <template>
     <div>
       <!-- 路由占位符 -->
       <router-view></router-view>
     </div>
   </template>
   
   <script>
   export default {
     name: 'App'
   }
   </script>
   
   <style lang="less" scoped>
   </style>
   ```

   

### 2.2 渲染登录组件的头部区域

> 基于 vant 导航组件下的 `NavBar 导航栏组件`，渲染 Login.vue 登录组件的头部区域

1. 渲染登录组件的 header 头部区域：

   ```xml
   <template>
     <div>
       <!-- NavBar 组件：只提供 title 标题 -->
       <van-nav-bar title="登录" />
     </div>
   </template>
   ```

2. 基于 vant 展示组件下的 `Sticy 粘性布局` 组件，实现 header 区域的吸顶效果：

   ```xml
   <template>
     <div>
       <van-sticky>
         <van-nav-bar title="登录" />
       </van-sticky>
     </div>
   </template>
   ```

   

### 2.3 覆盖 NavBar 组件的默认样式

> 3 种实现方案：
>
> 1. 定义**全局样式表**，通过审查元素的方式，找到对应的 class 类名后，进行样式的覆盖操作。
> 2. 通过**定制主题**的方式，直接覆盖 vant 组件库中的 less 变量；
> 3. 通过**定制主题**的方式，自定义 less 主题文件，基于文件的方式覆盖默认的 less 变量；
>
> 参考地址：https://vant-contrib.gitee.io/vant/#/zh-CN/theme



#### 方案1：全局样式表

1. 在 `src` 目录下新建 `index.less` 全局样式表，通过审查元素的方式找到对应的 class 类名，进行样式的覆盖：

   ```less
   // 覆盖 NavBar 组件的默认样式
   .van-nav-bar {
     background-color: #007bff;
     .van-nav-bar__title {
       color: white;
       font-size: 14px;
     }
   }
   ```

2. 在 `main.js` 中导入全局样式表即可：

   ```js
   // 导入 Vant 和 组件的样式表
   import Vant from 'vant'
   import 'vant/lib/index.css'
   
   // 导入全局样式表
   + import './index.less'
   
   // 注册全局插件
   Vue.use(Vant)
   ```

   

#### 方案2：定制主题 - 直接覆盖变量

1. 修改 `main.js` 中导入 vant 样式的代码，把 `.css` 的后缀名改为 `.less` 后缀名：

   ```js
   // 导入 Vant 和 组件的样式表
   import Vant from 'vant'
   
   // 这里要把 .css 后缀名改为 .less
   import 'vant/lib/index.less'
   ```

2. 在项目根目录下新建 `vue.config.js` 配置文件：

   ```js
   module.exports = {
     css: {
       loaderOptions: {
         less: {
           modifyVars: {
             // 直接覆盖变量，注意：变量名之前不需要加 @ 符号
             'nav-bar-background-color': '#007bff',
             'nav-bar-title-text-color': 'white',
             'nav-bar-title-font-size': '14px'
           }
         }
       }
     }
   }
   
   ```

   

#### 方案3：定制主题 - 基于 less 文件

1. 修改 `main.js` 中导入 vant 样式的代码，把 `.css` 的后缀名改为 `.less` 后缀名：

   ```js
   // 导入 Vant 和 组件的样式表
   import Vant from 'vant'
   // 这里要把 .css 后缀名改为 .less
   import 'vant/lib/index.less'
   ```

2. 在 `src` 目录下新建 `cover.less` 主题文件，用来覆盖 vant 默认主题中的 less 变量：

   ```less
   @blue: #007bff;
   @white: white;
   @font-14: 14px;
   
   // NavBar
   @nav-bar-background-color: @blue;
   @nav-bar-title-text-color: @white;
   @nav-bar-title-font-size: @font-14;
   ```

3. 在项目根目录下新建 `vue.config.js` 配置文件：

   ```js
   const path = require('path')
   
   // 自定义主题的文件路径
   const coverPath = path.join(__dirname, './src/cover.less')
   
   module.exports = {
     css: {
       loaderOptions: {
         less: {
           modifyVars: {
             // 通过 less 文件覆盖（文件路径为绝对路径）
             hack: `true; @import "${coverPath}";`
           }
         }
       }
     }
   }
   ```

   

### 2.4 实现登录功能

1. 渲染 DOM 结构：

   ```xml
   <!-- 提交表单且验证通过后触发 submit 事件 -->
   <van-form @submit="onSubmit">
     <van-field v-model="formLogin.mobile" type="tel" label="手机号" placeholder="请输入手机号" required :rules="formLoginRules.mobile" />
     <van-field v-model="formLogin.code" type="password" label="密码" placeholder="请输入密码" required :rules="formLoginRules.code" />
     <div style="margin: 16px;">
       <van-button block type="info" native-type="submit">登录</van-button>
     </div>
   </van-form>
   ```

2. 声明 data 数据和表单验证规则对象：

   ```js
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
   ```

3. 在 `src/api/` 目录下，封装 `user.js` 模块，对外提供登录的 API 方法：

   ```js
   import axios from '@/utils/request'
   
   // 登录
   export const login = data => {
     return axios.post('/v1_0/authorizations', data)
   }
   ```

4. 在 `Login.vue` 组件中，声明 `onSubmit` 方法如下：

   ```js
   import { login } from '@/api/user'
   
   methods: {
     // 组件内自定义的方法
     async onSubmit() {
       const { data: res } = await login(this.formLogin)
       console.log(res)
       if (res.message === 'OK') {
         // 把登录成功的结果，存储到 vuex 中
       }
     }
   }
   ```

   

### 2.5 把 token 存储到 vuex

1. 在 vuex 模块中声明 state 数据节点：

   ```js
   export default new Vuex.Store({
     state: {
       // 登录成功之后的 token 信息
       tokenInfo: {}
     }
   })
   ```

2. 声明 `updateTokenInfo` 方法：

   ```js
   mutations: {
     // 更新 token 的信息
     updateTokenInfo(state, payload) {
       state.tokenInfo = payload
     }
   },
   ```

3. 在 `Login.vue` 组件中，通过 `mapMutations` 辅助方法，把 `updateTokenInfo` 方法映射到当前组件中使用：

   ```js
   // 1. 按需导入辅助方法
   import { mapMutations } from 'vuex'
   
   export default {
     // 2. 映射 mutations 中的方法
     ...mapMutations(['updateTokenInfo']),
   
     // 3. 组件内自定义的方法
     async onSubmit() {
       const { data: res } = await login(this.formLogin)
       console.log(res)
       if (res.message === 'OK') {
         // 4. 更新 state 中的 token 信息
         this.updateTokenInfo(res.data)
         // 5. 跳转到主页
         this.$router.push('/')
       }
     }
   }
   ```

   

### 2.6 持久化存储 state

1. 定义 `initState` 对象：

   ```js
   // 初始的 state 数据
   let initState = {
     // 登录成功之后的 token 信息
     tokenInfo: {}
   }
   ```

2. 读取本地存储中的 state 数据：

   ```js
   // 读取本地存储中的数据
   const stateStr = localStorage.getItem('state')
   
   // 判断是否有数据
   if (stateStr) {
     initState = JSON.parse(stateStr)
   }
   ```

3. 为 vuex 中的 state 赋值：

   ```js
   export default new Vuex.Store({
     state: initState,
     // 省略其它代码...
   })
   ```

   

### 2.7 通过拦截器添加 token 认证

1. 在 `/src/utils/request.js` 模块中，声明请求拦截器：

   ```js
   instance.interceptors.request.use(
     config => {
       return config
     },
     error => {
       return Promise.reject(error)
     }
   )
   ```

2. 在 `request.js` 模块中导入 vuex 的 `store` 模块：

   ```js
   import store from '@/store/index'
   ```

3. 添加 token 认证信息：

   ```js
   instance.interceptors.request.use(
     config => {
       // 1. 获取 token 值
       const tokenStr = store.state.tokenInfo.token
       // 2. 判断 token 值是否存在
       if (tokenStr) {
         // 3. 添加身份认证字段
         config.headers.Authorization = 'Bearer ' + tokenStr
       }
       return config
     },
     function(error) {
       return Promise.reject(error)
     }
   )
   ```



## 3. 主页布局



### 3.1 实现 Layout 组件的布局

1. 在 `src/views/Layout` 目录下新建 `Layout.vue` 组件：

   ```vue
   <template>
     <div>
       <!-- 路由占位符 -->
   
       <!-- TabBar 区域 -->
     </div>
   </template>
   
   <script>
   export default {
     name: 'Layout'
   }
   </script>
   
   <style lang="less" scoped>
   </style>
   ```
   
2. 在路由模块中导入 `Layout.vue` 组件，并声明路由规则：

   ```js
   import Layout from '@/views/Layout/Layout.vue'
   
   const routes = [
     { path: '/login', component: Login, name: 'login' },
     // Layout 组件的路由规则
     { path: '/', component: Layout }
   ]
   ```

4. 渲染 TabBar 区域：

   ```xml
   <!-- TabBar 区域 -->
   <van-tabbar route>
     <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
     <van-tabbar-item icon="user-o" to="/user">我的</van-tabbar-item>
   </van-tabbar>
   ```

   美化样式：

   ```less
   .van-tabbar {
     border-top: 1px solid #f8f8f8;
   }
   ```

   

### 3.2 基于路由渲染 Home 和 User 组件

1. 在 `views` 目录下分别声明 `Home.vue` 和 `User.vue` 组件：

   - Home.vue 组件的基本结构：

     ```vue
     <template>
       <div class="home-container">
         <!-- 头部区域 -->
         <van-nav-bar fixed>
           <template #left>
             <img src="../../assets/toutiao_logo.png" alt="logo" class="logo" />
           </template>
           <template #right>
             <van-icon name="search" color="white" size="18" />
           </template>
         </van-nav-bar>
       </div>
     </template>
     
     <script>
       export default {
         name: 'Home'
       }
     </script>
     
     <style lang="less" scoped>
     .home-container {
       padding-top: 46px;
     }
       
     .logo {
       height: 80%;
     }
     </style>
     ```

   - User.vue 组件的基本结构：

     ```vue
     <template>
       <div>
         User 页面
       </div>
     </template>
     
     <script>
     export default {
       name: 'User'
     }
     </script>
     
     <style lang="less" scoped>
     </style>
     
     ```

2. 在路由模块中导入 Home 和 User 组件，并声明对应的路由规则：

   ```js
   import Home from '@/views/Home/Home.vue'
   import User from '@/views/User/User.vue'
   
   const routes = [
     { path: '/login', component: Login, name: 'login' },
     {
       path: '/',
       component: Layout,
       children: [
         // 默认子路由
         { path: '', component: Home, name: 'home' },
         { path: '/user', component: User, name: 'user' }
       ]
     }
   ]
   ```

3. 在 `Layout.vue` 组件中声明路由占位符：

   ```xml
   <!-- 路由占位符 -->
   <router-view></router-view>
   
   <!-- TabBar 区域 -->
   ```

   

### 3.3 获取频道列表的数据

1. 在 `/src/api` 目录下新建 `home.js` 模块：

   ```js
   import axios from '@/utils/request'
   
   // 获取频道列表
   export const getChannelList = () => {
     return axios.get('/v1_0/user/channels')
   }
   ```

2. 在 `Home.vue` 组件中按需导入 `getChannelList` 方法：

   ```js
   // 按需导入获取频道列表数据的 API 方法
   import { getChannelList } from '@/api/home'
   ```

3. 在 `data` 节点中声明 `channels` 数组，存放频道列表的数据：

   ```js
   data() {
     return {
       // 频道列表
       channels: []
     }
   }
   ```

4. 在 `created` 生命周期函数中预调用 `getChannels` 方法，获取频道列表的数据：

   ```js
   created() {
     this.getChannels()
   }
   ```

5. 在 `Home.vue` 组件的 `methods` 节点中声明 `getChannels` 方法如下：

   ```js
   // 获取频道列表的数据
   async getChannels() {
     const { data: res } = await getChannelList()
     // 判断数据是否请求成功
     if (res.message === 'OK') {
       this.channels = res.data.channels
     }
   }
   ```

   

### 3.4 渲染频道列表结构

> 基于 Vant 导航组件下的 Tab 标签页组件，渲染出频道列表的基础结构

1. 渲染频道列表的 DOM 结构：

   ```xml
   <!-- Tab 标签页 -->
   <van-tabs>
     <van-tab v-for="item in channels" :key="item.id" :title="item.name">
       {{item.name}}
     </van-tab>
   </van-tabs>
   ```

2. 在 `src/views/Home` 目录下新建 `ArticleList.vue` 组件：

   ```xml
   <template>
     <div>
       AritcleList 组件 --- {{id}}
     </div>
   </template>
   
   <script>
   export default {
     name: 'AritcleList',
     props: {
       // 频道 Id
       id: {
         type: Number,
         required: true
       }
     }
   }
   </script>
   
   <style lang="less" scoped>
   </style>
   ```

3. 在 `Home.vue` 组件中导入、注册并使用 `ArticleList` 组件

   导入：

   ```js
   import ArticleList from './ArticleList.vue'
   ```

   注册：

   ```js
   components: {
     ArticleList
   }
   ```

   使用：

   ```xml
   <!-- Tab 标签页 -->
   <van-tabs>
     <van-tab v-for="item in channels" :key="item.id" :title="item.name">
       <!-- 文章列表组件 -->
       <article-list :id="item.id"></article-list>
     </van-tab>
   </van-tabs>
   ```

4. 定制主题：定制选中项的高亮颜色：

   ```less
   // cover.less
   
   // Tab 标签页
   @tabs-bottom-bar-color: @blue;
   ```



### 3.5 根据频道 Id 获取文章列表数据

1. 在 `@/api` 目录下的 `home.js` 模块中，声明获取文章列表数据的方法：

   ```js
   // 根据频道 Id 获取文章列表数据
   export const getArticleList = id => {
     return axios.get('/v1_1/articles', {
       params: {
         channel_id: id, // 频道id
         timestamp: Date.now(), // 时间戳整数 单位毫秒
         with_top: 1
       }
     })
   }
   ```

2. 在 `ArticleList.vue` 组件中按需导入获取文章列表数据的方法：

   ```js
   import { getArticleList } from '@/api/home'
   ```

3. 在 `ArticleList.vue` 组件的 data 节点下声明文章列表的数组：

   ```js
   data() {
     return {
       // 文章列表的数据
       articles: []
     }
   },
   ```

4. 在 `created` 生命周期函数中预调用 `getArticleList` 方法：

   ```js
   created() {
     this.getArticleList()
   },
   ```

5. 在 `methods` 节点下声明 `getArticleList` 方法如下：

   ```js
   methods: {
     // 获取文章列表数据
     async getArticleList() {
       const { data: res } = await getArticleList(this.id)
       // 判断数据是否请求成功
       if (res.message === 'OK') {
         this.articles = res.data.results
       }
     }
   }
   ```

   

### 3.6 渲染文章列表的 DOM 结构

1. 渲染基本的标题和文章信息：

   ```xml
   <template>
     <div>
       <van-cell v-for="item in articles" :key="item.art_id">
         <!-- 标题区域的插槽 -->
         <template #title>
           <div class="title-box">
             <!-- 标题 -->
             <span>{{item.title}}</span>
           </div>
         </template>
         <!-- label 区域的插槽 -->
         <template #label>
           <div class="label-box">
             <span>{{item.aut_name}}&nbsp;&nbsp;{{item.comm_count}}评论&nbsp;&nbsp;{{item.pubdate}}</span>
             <!-- 关闭按钮 -->
             <van-icon name="cross" />
           </div>
         </template>
       </van-cell>
     </div>
   </template>
   ```

   并美化样式：

   ```less
   .label-box {
     display: flex;
     justify-content: space-between;
     align-items: center;
   }
   ```

2. 根据 `item.cover.type` 的值，按需渲染1张或3张图片：

   ```xml
   <template>
     <div>
       <van-cell v-for="item in articles" :key="item.art_id">
         <!-- 标题区域的插槽 -->
         <template #title>
           <div class="title-box">
             <!-- 标题 -->
             <span>{{item.title}}</span>
             <!-- 单张图片 -->
             <img :src="item.cover.images[0]" alt="" v-if="item.cover.type === 1" class="thumb">
           </div>
           <!-- 三张图片 -->
           <div class="thumb-box" v-if="item.cover.type > 1">
             <img v-for="(imgsrc, i) in item.cover.images" :key="i" :src="imgsrc" alt="" class="thumb">
           </div>
         </template>
         <!-- label 区域的插槽 -->
         <template #label>
           <div class="label-box">
             <span>{{item.aut_name}}&nbsp;&nbsp;{{item.comm_count}}评论&nbsp;&nbsp;{{item.pubdate}}</span>
             <!-- 关闭按钮 -->
             <van-icon name="cross" />
           </div>
         </template>
       </van-cell>
     </div>
   </template>
   ```

   并美化图片的样式：

   ```less
   .thumb {
     // 矩形黄金比例：0.618
     width: 113px;
     height: 70px;
     background-color: #f8f8f8;
     object-fit: cover;
   }
   
   .title-box {
     display: flex;
     justify-content: space-between;
     align-items: flex-start;
   }
   
   .thumb-box {
     display: flex;
     justify-content: space-between;
   }
   ```
   
   

### 3.7 实现 van-tabs 的吸顶效果

1. 在 `Home.vue` 组件中，为 `van-tabs` 组件添加 `sticky` 属性，即可开启纵向滚动吸顶效果。
2. 同时，为 `van-tabs` 组件添加 `offset-top="1.22667rem"` 属性，即可控制吸顶时距离顶部的位置。



### 3.8 实现上拉加载更多

> 基于 Vant 展示组件下的 List 列表组件，可以轻松实现上拉加载更多的效果。

1. 在 `ArticleList.vue` 组件中，使用 `van-list` 组件把文章对应的 `van-cell` 组件包裹起来，并提供如下的属性：

   ```xml
   <!-- 上拉加载更多 -->
   <!-- 1. v-model="loading" 用来控制当前是否正在请求下一页的数据； true 表示正在请求中、false 表示当前没有发起任何请求 -->
   <!-- 2. :finished="finished" 用来表示是否还有下一页数据； true 表示没有下一页的数据了；false 表示还有下一页数据 -->
   <!-- 3. finished-text="没有更多了" 用来设置数据加载完毕后，最终的提示 -->
   <!-- 4. @load="onLoad" 用来监听触底的事件，从而发起下一页数据的请求 -->
   <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
     <van-cell v-for="item in articles" :key="item.art_id">
       <!-- 省略不必要的代码... -->
     </van-cell>
   </van-list>
   ```

2. 在 data 中声明如下两个数据项，默认值都为 false：

   ```js
   data() {
     return {
       // 是否正在加载数据
       loading: false,
       // 数据是否加载完毕
       finished: false
     }
   }
   ```

3. 声明 `@load` 事件的处理函数如下：

   ```js
   // 触发了上拉加载更多的操作
   onLoad() {
     this.getArticleList()
   },
   ```

4. 修改 `getArticleList` 函数如下：

   ```js
   // 获取文章列表数据
   async getArticleList(isRefresh) {
     const { data: res } = await getArticleList(this.id)
     if (res.message === 'OK') {
       // 旧数据后面，拼接新数据
       this.articles = [...this.articles, ...res.data.results]
       // 数据加载完之后，需要把 loading 设置为 false，方便下次发起 Ajax 请求
       this.loading = false
   
       // 判断所有数据是否加载完成
       if (res.data.results.length === 0) {
         this.finished = true
       }
     }
   },
   ```

5. 注释掉 `created` 声明周期函数中，请求首屏数据的方法调用。因为 `van-list` 组件初次被渲染时，会立即触发一次 `@load` 事件：

   ```js
   created() {
     // this.getArticleList()
   },
   ```

   

### 3.9 实现下拉刷新

> 基于 Vant 反馈组件下的 PullRefresh 下拉刷新，可以轻松实现下拉刷新的效果。

1. 在 `ArticleList.vue` 组件中，使用 `van-pull-refresh` 组件把 `van-list` 列表组件包裹起来，并定义如下两个属性：

   ```xml
   <!-- 下拉刷新 -->
   <!-- v-model="refreshing" 用来控制当前是否正在请求下拉刷新的数据。 true 表示正在请求数据；false 表示没有发起任何请求 -->
   <!-- @refresh="onRefresh" 用来监听下拉刷新的事件，从而发起下拉刷新的数据请求 -->
   <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
     <!-- 上拉加载更多 -->
     <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
       <van-cell v-for="item in articles" :key="item.art_id">
         <!-- 省略其它代码... -->
       </van-cell>
     </van-list>
   </van-pull-refresh>
   ```

2. 在 `data` 中定义如下的数据节点：

   ```js
   data() {
     return {
       // 是否正在刷新列表数据
       refreshing: false
     }
   },
   ```

3. 在 `ArticleList.vue` 组件中声明 `@refresh` 的事件处理函数如下：

   ```js
   // 触发了下拉刷新
   onRefresh() {
     // true 表示当前以下拉刷新的方式，请求列表的数据
     this.getArticleList(true)
   }
   ```

4. 进一步改造 `getArticleList` 函数如下：

   ```js
   // 获取文章列表数据
   async getArticleList(isRefresh) {
     const { data: res } = await getArticleList(this.id)
     if (res.message === 'OK') {
       if (isRefresh) {
         // 当前为：下拉刷新
         this.articles = [...res.data.results, ...this.articles] // 新数据在前，旧数据在后
         // 数据加载完成之后，把 refreshing 设置为 false，方便下次发起 Ajax 请求
         this.refreshing = false
       } else {
         // 当前为上拉加载更多
         this.articles = [...this.articles, ...res.data.results] // 旧数据在前，新数据在后
         // 数据加载完之后，需要把 loading 设置为 false，方便下次发起 Ajax 请求
         this.loading = false
       }
   
       // 判断所有数据是否加载完成
       if (res.data.results.length === 0) {
         this.finished = true
       }
     }
   },
   ```

   

## 4. 文章列表



### 4.1 格式化时间

> dayjs 中文官网：https://dayjs.fenxianglu.cn/

1. 安装 `dayjs` 包：

   ```bash
   npm install dayjs --save
   ```

2. 在 `main.js` 入口文件中导入 `dayjs` 相关的模块：

   ```js
   // 导入 dayjs 的核心模块
   import dayjs from 'dayjs'
   
   // 导入计算相对时间的插件
   import relativeTime from 'dayjs/plugin/relativeTime'
   
   // 导入本地化的语言包
   import zh from 'dayjs/locale/zh-cn'
   ```

3. 配置插件和语言包：

   ```js
   // 配置插件
   dayjs.extend(relativeTime)
   
   // 配置语言包
   dayjs.locale(zh)
   ```

4. 定义格式化时间的全局过滤器：

   ```js
   Vue.filter('dateFormat', dt => {
     return dayjs().to(dt)
   })
   ```

5. 在 `ArticleList.vue` 组件中，使用全局过滤器格式化时间：

   ```xml
   <!-- label 区域的插槽 -->
   <template #label>
     <div class="label-box">
       <span>{{item.aut_name}}&nbsp;&nbsp;{{item.comm_count}}评论&nbsp;&nbsp;{{item.pubdate | dateFormat}}</span>
       <!-- 关闭按钮 -->
       <van-icon name="cross" />
     </div>
   </template>
   ```

   

### 4.2 文章列表图片的懒加载

> 基于 Vant 展示组件下的 Lazyload 懒加载指令，实现图片的懒加载效果

1. 在 `main.js` 入口文件中，按需导入 Lazyload 指令：

   ```js
   import Vant, { Lazyload } from 'vant'
   ```

2. 在 `main.js` 中将 `Lazyload` 注册为全局可用的指令：

   ```js
   Vue.use(Lazyload)
   ```

3. 在 `ArticleList.vue` 组件中，为 `<img>` 标签删除 `src` 属性，并应用 `v-lazy` 指令，指令的值是`要展示的图片地址`：

   ```xml
   <!-- 单张图片 -->
   <img alt="" v-if="item.cover.type === 1" class="thumb" v-lazy="item.cover.images[0]" />
   
   <!-- 三张图片 -->
   <div class="thumb-box" v-if="item.cover.type > 1">
     <img v-for="(imgsrc, i) in item.cover.images" :key="i" alt="" class="thumb" v-lazy="imgsrc" />
   </div>
   ```

   

### 4.3 把文章信息抽离为单个组件

1. 在 `@/views/Home` 目录之下新建 `ArticleInfo.vue` 组件，并声明 DOM 结构：

   ```xml
   <template>
     <van-cell>
       <!-- 标题区域的插槽 -->
       <template #title>
         <div class="title-box">
           <!-- 标题 -->
           <span>{{article.title}}</span>
           <!-- 单张图片 -->
           <img alt="" v-if="article.cover.type === 1" class="thumb" v-lazy="article.cover.images[0]" />
         </div>
         <!-- 三张图片 -->
         <div class="thumb-box" v-if="article.cover.type > 1">
           <img v-for="(imgsrc, i) in article.cover.images" :key="i" alt="" class="thumb" v-lazy="imgsrc" />
         </div>
       </template>
       <!-- label 区域的插槽 -->
       <template #label>
         <div class="label-box">
           <span>{{article.aut_name}}&nbsp;&nbsp;{{article.comm_count}}评论&nbsp;&nbsp;{{article.pubdate | dateFormat}}</span>
           <!-- 关闭按钮 -->
           <van-icon name="cross" />
         </div>
       </template>
     </van-cell>
   </template>
   ```

2. 定义 `props` 属性：

   ```js
   export default {
     name: 'ArticleInfo',
     props: {
       // 要渲染的文章信息对象
       article: {
         type: Object,
         required: true
       }
     }
   }
   ```

3. 美化组件样式：

   ```less
   .article-info-container {
     border-top: 1px solid #f8f8f8;
   }
   
   .label-box {
     display: flex;
     justify-content: space-between;
     align-items: center;
   }
   
   .thumb {
     width: 113px;
     height: 70px;
     background-color: #f8f8f8;
     object-fit: cover;
   }
   
   .title-box {
     display: flex;
     justify-content: space-between;
     align-items: flex-start;
   }
   
   .thumb-box {
     display: flex;
     justify-content: space-between;
   }
   ```

4. 在 `ArticleList.vue` 组件中导入、注册、并使用 `ArticleInfo.vue` 组件：

   导入：

   ```js
   import ArticleInfo from './ArticleInfo.vue'
   ```

   注册：

   ```js
   components: {
     ArticleInfo
   }
   ```

   使用：

   ```xml
   <template>
     <!-- 下拉刷新 -->
     <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
       <!-- 上拉加载更多 -->
       <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
         <!-- 使用 ArticleInfo 组件 -->
         <article-info v-for="item in articles" :key="item.art_id" :article="item"></article-info>
       </van-list>
     </van-pull-refresh>
   </template>
   ```

   

### 4.4 解决 js 中大数的问题

> js 中的安全数字：
>
> ```js
> > Number.MAX_SAFE_INTEGER
> > 9007199254740991
> 
> > Number.isSafeInteger(1323819148127502300)
> > false
> ```
> id 的值已经超出了 JavaScript 中最大的 Number 数值，会导致 JS 无法正确的进行数字的处理和运算，例如：
>
> ```js
> > 1323819148127502300 + 1 === 1323819148127502300 + 2
> > true
> ```

解决方案：**json-bigint**（https://www.npmjs.com/package/json-bigint）

1. 安装依赖包：

   ```bash
   npm i json-bigint -S
   ```

2. 在 `@/utils/request.js` 模块中导入 `json-bigint` 模块：

   ```js
   import bigInt from 'json-bigint'
   ```

3. 声明处理大数问题的方法：

   ```js
   // 处理大数问题
   const transBigInt = data => {
     try {
       // 尝试着进行大数的处理
       return bigInt.parse(data)
     } catch {
       // 大数处理失败时的后备方案
       return JSON.parse(data)
     }
   }
   ```

4. 在调用 `axios.create()` 方法期间，指定 `transformResponse` 选项：

   ```js
   const instance = axios.create({
     // 请求根路径
     baseURL: 'http://toutiao-app.itheima.net',
     transformResponse: [transBigInt]
   })
   ```

5. 在 `ArticleList.vue` 组件中使用**文章Id** 时，需要调用 `.toString()` 方法，把**大数对象**转为**字符串表示的数字**：

   ```xml
   <article-info v-for="item in articles" :key="item.art_id.toString()" :article="item"></article-info>
   ```

   

## 5. 反馈操作



### 5.1 展示反馈相关的动作面板

1. 在 `ActionInfo.vue` 组件中，为关闭按钮绑定点击事件处理函数：

   ```xml
   <!-- 关闭按钮 -->
   <!-- 通过 .stop 修饰符，阻止事件冒泡 -->
   <van-icon name="cross" @click.stop="onCloseClick" />
   ```

2. 在 `methods` 节点中声明 `onCloseClick` 事件处理函数如下：

   ```js
   // 点击了叉号按钮
   onCloseClick() {
     // 展示动作面板
     this.show = true
   },
   ```

3. 在 `ActionInfo.vue` 组件中声明**动作面板**的 DOM 结构：

   ```xml
   <!-- 动作面板 -->
   <!-- v-model="show" 用来控制动作面板的显示与隐藏 -->
   <!-- cancel-text="取消" 用来定义取消按钮的文本 -->
   <!-- :closeable="false" 用来隐藏右上角的关闭按钮 -->
   <!-- @closed="onSheetClose" 用来监听动作面板关闭之后的事件 -->
   <van-action-sheet v-model="show" cancel-text="取消" :closeable="false" @closed="onSheetClose">
     <!-- 自定义动作面板要渲染的内容 -->
   </van-action-sheet>
   ```

4. 在 `data` 中声明布尔值 `show`，用来控制动作面板的展示与隐藏：

   ```js
   data() {
     return {
       // 控制 ActionSheet 的显示与隐藏
       show: false
     }
   }
   ```

   

### 5.2 渲染第一个面板的数据

1. 在 `ArticleInfo.vue` 组件的 `data` 中声明 `actions` 数组：

   ```js
   data() {
     return {
       // 第一个面板的可选项列表
       actions: [
         { name: '不感兴趣' },
         { name: '反馈垃圾内容' },
         { name: '拉黑作者' }
       ],
     }
   }
   ```

2. 在动作面板中，循环渲染第一个面板的列表项：

   ```xml
   <!-- 动作面板 -->
   <van-action-sheet v-model="show" cancel-text="取消" :closeable="false" @closed="onSheetClose">
     <!-- 展示第一个面板 -->
     <div>
       <van-cell :title="item.name" v-for="(item, i) in actions" :key="i" clickable title-class="center-title" @click="onCellClick(item)" />
     </div>
   </van-action-sheet>
   ```

3. 在 `style` 节点中声明 `center-title` 美化每一项的样式：

   ```less
   .center-title {
     text-align: center;
   }
   ```

4. 在 `methods` 中声明 `onCellClick` 如下：

   ```js
   // 点击第一层的 item 项
   onCellClick(info) {
     if (info.name === '不感兴趣') {
       console.log('不感兴趣')
       this.show = false
     } else if (info.name === '拉黑作者') {
       console.log('拉黑作者')
       this.show = false
     } else if (info.name === '反馈垃圾内容') {
       // TODO：展示第二个面板的数据
     }
   },
   ```

   

### 5.3 渲染第二个面板的结构

1. 在 `ArticleInfo.vue` 组件中，找到动作面板对应的结构，并声明第二个面板对应的 DOM 结构：

   ```xml
       <!-- 动作面板 -->
       <van-action-sheet v-model="show" cancel-text="取消" :closeable="false" @closed="onSheetClose">
         <!-- 展示第一个面板 -->
         <div>
           <van-cell :title="item.name" v-for="(item, i) in actions" :key="i" clickable title-class="center-title" @click="onCellClick(item)" />
         </div>
         <!-- 展示第二个面板 -->
         <div v-else>
           <van-cell title="返回" title-class="center-title" />
         </div>
       </van-action-sheet>
   ```

2. 按需控制两个面板的显示与隐藏：

   - 在 data 中声明布尔值 `showFirstAction`，用来控制第一个面板的显示与隐藏（true：显示；false：隐藏）：

     ```js
     data() {
       return {
         // 是否展示第一个面板
         showFirstAction: true,
       }
     }
     ```

   - 使用 `v-if` 和 `v-else` 指令，控制两个面板的显示与隐藏：

     ```xml
     <!-- 展示第一个面板 -->
     <div v-if="showFirstAction">
       <van-cell :title="item.name" v-for="(item, i) in actions" :key="i" clickable title-class="center-title" @click="onCellClick(item)" />
     </div>
     <!-- 展示第二个面板 -->
     <div v-else>
       <van-cell title="返回" title-class="center-title" />
     </div>
     ```

   - 点击**反馈垃圾内容**显示第二个面板：

     ```js
     // 点击第一层的 item 项
     onCellClick(info) {
       if (info.name === '不感兴趣') {
         console.log('不感兴趣')
         this.show = false
       } else if (info.name === '拉黑作者') {
         console.log('拉黑作者')
         this.show = false
       } else if (info.name === '反馈垃圾内容') {
         // 将布尔值改为 false，即可显示第二个面板
         this.showFirstAction = false
       }
     },
     ```

   - 点击**返回**按钮，显示第一个面板：

     ```jsx
     <van-cell title="返回" title-class="center-title" @click="showFirstAction = true" />
     ```

3. 在动作面板关闭后，为了方便下次能够直接看到第一个面板，需要把 `showFirstAction` 的值重置为 `true`：

   ```js
   // 监听 Sheet 关闭完成后的事件
   onSheetClose() {
     // 下次默认渲染第一个面板
     this.showFirstAction = true
   },
   ```

   

### 5.4 渲染第二个面板的数据

1. 在 `@/api/constant` 目录下，新建 `reports.js` 模块，用来定义第二个面板要用到的**常量数据**：

   ```js
   // 以模块的方式导出 举报文章 时，后端接口约定的举报类型
   const reports = [
     {
       value: 0,
       label: '其它问题'
     },
     {
       value: 1,
       label: '标题夸张'
     },
     {
       value: 2,
       label: '低俗色情'
     },
     {
       value: 3,
       label: '错别字多'
     },
     {
       value: 4,
       label: '旧闻重复'
     },
     {
       value: 6,
       label: '内容不实'
     },
     {
       value: 8,
       label: '侵权'
     },
     {
       value: 5,
       label: '广告软文'
     },
     {
       value: 7,
       label: '涉嫌违法犯罪'
     }
   ]
   export default reports
   ```

2. 在 `ArticleInfo.vue` 组件中导入，并把常量数据挂载为 data 节点：

   ```js
   import reports from '@/api/constant/reports'
   
   export default {
     name: 'ArticleInfo',
     data() {
       return {
         // 第二个面板要用到的列表数据
         reports
       }
     }
   }
   ```

3. 在第二个面板中循环渲染列表数据，并为每一项绑定点击事件处理函数 `onFeedbackCellClick`：

   ```xml
   <!-- 展示第二个面板 -->
   <div v-else>
     <van-cell title="返回" title-class="center-title" @click="showFirstAction = true" />
     <van-cell :title="item.label" v-for="(item, i) in reports" :key="i" clickable title-class="center-title" @click="onFeedbackCellClick(item)" />
   </div>
   ```

4. 在 `methods` 节点下定义 `onFeedbackCellClick` 处理函数：

   ```js
   // 点击了反馈面板中的按钮
   onFeedbackCellClick(info) {
     // 关闭动作面板
     this.show = false
   }
   ```

   

### 5.5 指定动作面板的挂载位置

1. 默认情况下，我们在 `ArticleInfo.vue` 组件中使用的 `ActionSheet` 组件，因此它会被渲染到 `List 列表组件` 内部

   - 导致的问题：动作面板中的内容上下滑动时，会导致 `List 列表组件的` 下拉刷新

2. 解决方案：把 `ActionList` 组件，通过 `get-container` 属性，挂载到 `body` 元素下：

   ```xml
   <van-action-sheet v-model="show" cancel-text="取消" :closeable="false" @closed="onSheetClose" get-container="body">
     <!-- 省略其它代码 -->
   </van-action-sheet>
   ```

   

### 5.6 将文章设为不感兴趣

1. 在 `@/api/home.js` 模块中声明如下的 API 方法：

   ```js
   // 将文章设置为不感兴趣
   export const dislikeArticle = artId => {
     return axios.post('/v1_0/article/dislikes', {
       target: artId
     })
   }
   ```

2. 在 `ArticleInfo.vue` 组件中，按需导入 `dislikeArticle` 方法：

   ```js
   import { dislikeArticle } from '@/api/home'
   ```

3. 在 `onCellClick` 方法中调用不感兴趣的 API 接口：

   ```js
   if (info.name === '不感兴趣') {
     // 调用接口，将此文章设置为不感兴趣
     const { data: res } = await dislikeArticle(
       this.article.art_id.toString()
     )
     // 接口调用成功
     if (res.message === 'OK') {
       // TODO：将此文章从列表中移除
       console.log(this.article.art_id.toString())
     }
     // 关闭动作面板
     this.show = false
   }
   ```

   

### 5.7 从列表中移除不感兴趣的文章

1. 在 `ArticleInfo.vue` 组件中，通过 `this.$emit()` 触发自定义事件，把要删除的文章 Id 传递给父组件：

   ```js
   // 接口调用成功
   if (res.message === 'OK') {
     // TODO：将此文章从列表中移除
     this.$emit('remove-article', this.article.art_id.toString())
   }
   ```

2. 在 `ArticleList.vue` 组件中，监听 `ArticleInfo.vue` 组件的 `remove-article` 自定义事件：

   ```xml
   <article-info v-for="item in articles" :key="item.art_id.toString()" :article="item" @remove-article="onArticleRemove">
   </article-info>
   ```

3. 在 `ArticleList.vue` 组件中，声明 `onArticleRemove` 函数如下：

   ```js
   // 触发了删除文章的自定义事件
   onArticleRemove(artId) {
     this.articles = this.articles.filter(x => x.art_id.toString() !== artId)
   }
   ```

   

### 5.8 实现举报文章的功能

1. 在 `@/api/home.js` 模块中声明如下的方法：

   ```js
   // 举报文章
   export const reportArticle = (artId, type) => {
     return axios.post('/v1_0/article/reports', {
       target: artId, // 文章的 Id
       type // 举报的类型
     })
   }
   ```

2. 在 `ArticleInfo.vue` 中按需导入 `reportArticle` 方法：

   ```js
   import { dislikeArticle, reportArticle } from '@/api/home'
   ```

3. 在点击动作面板中反馈选项的时候，调用接口反馈提交反馈信息：

   ```xml
   <!-- 展示第二个面板 -->
   <div v-else>
     <van-cell title="返回" title-class="center-title" @click="showFirstAction = true" />
     <van-cell :title="item.label" v-for="(item, i) in reports" :key="i" clickable title-class="center-title" @click="onFeedbackCellClick(item)" />
   </div>
   ```

4. 声明 `onFeedbackCellClick` 如下：

   ```js
   // 点击了反馈面板中的按钮
   async onFeedbackCellClick(info) {
     // 发起请求，反馈文章的问题
     const { data: res } = await reportArticle(
       this.article.art_id.toString(), // 文章的 Id
       info.value // 文章存在的问题编号
     )
     if (res.message === 'OK') {
       // 反馈成功，从列表中移除对应的文章
       this.$emit('remove-article', this.article.art_id.toString())
     }
     
     // 关闭动作面板
     this.show = false
   }
   ```

   

## 6. 频道管理



### 6.1 渲染频道管理的小图标

1. 在 `Home.vue` 组件中，渲染小图标的基本结构：

   ```xml
   <template>
     <div>
       <!-- Tab 标签页 -->
       <van-tabs sticky offset-top="1.22667rem">
         <van-tab v-for="item in channels" :key="item.id" :title="item.name">
           <!-- 文章列表组件 -->
           <article-list :id="item.id"></article-list>
         </van-tab>
       </van-tabs>
   
       <!-- 右侧的编辑频道的小图标 -->
       <van-icon name="plus" size="14" class="moreChannels" />
     </div>
   </template>
   ```

2. 美化标签页和小图标的样式：

   ```less
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
   ```

   

### 6.2 渲染频道管理的 DOM 结构

1. 渲染基本的 DOM 结构：

   ```xml
   <!-- 弹出层组件 -->
   <!-- close-on-click-overlay 是否在点击遮罩层后关闭（false 不关闭） -->
   <van-popup v-model="show" :close-on-click-overlay="false">
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
             <span>我的频道：</span>
             <span>编辑</span>
           </div>
           <!-- 我的频道列表 -->
           <van-row type="flex">
             <van-col span="6" v-for="item in channels" :key="item.id">
               <div class="channel-item van-hairline--surround">{{item.name}}</div>
             </van-col>
           </van-row>
         </div>
   
         <!-- 更多频道 -->
         <div class="more-channel-box">
           <div class="channel-title">
             <span>点击添加更多频道：</span>
           </div>
           <!-- 更多频道列表 -->
           <van-row type="flex">
             <van-col span="6" v-for="item in channels" :key="item.id">
               <div class="channel-item van-hairline--surround">{{item.name}}</div>
             </van-col>
           </van-row>
         </div>
       </div>
     </div>
   </van-popup>
   ```

2. 美化样式：

   ```less
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
   
   .pop-header {
     height: 90px;
     background-color: #007bff;
     color: white;
     text-align: center;
     font-size: 14px;
     position: relative;
     .title {
       width: 100%;
       position: absolute;
       bottom: 15px;
     }
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
     }
   }
   
   .channel-item {
     font-size: 12px;
     text-align: center;
     line-height: 36px;
     background-color: #fafafa;
     margin: 5px;
   }
   ```

3. 在 data 中声明 `show` 来控制 popup 组件的显示与隐藏：

   ```js
   data() {
     return {
      // 控制弹出层组件的显示与隐藏
       show: false
     }
   }
   ```

4. 在点击 `+` 号小图标时展示弹出层：

   ```xml
   <!-- 右侧的编辑频道的小图标 -->
   <van-icon name="plus" size="14" class="moreChannels" @click="show = true" />
   ```

   

### 6.3 动态计算更多频道的列表数据

> 后台没有提供直接获取**更多频道**的 API 接口，需要程序员动态地进行计算：
>
> 更多频道 = 所有频道 - 我的频道
>
> 此时，需要先获取到所有频道地列表数据，再使用计算属性动态地进行筛选即可

1. 请求所有频道的列表数据：

   - 在 `@/api/home.js` 模块中封装 `getAllChannels` 方法：

     ```js
     // 获取所有频道列表
     export const getAllChannels = () => {
       return axios.get('/v1_0/channels')
     }
     ```

   - 在 `Home.vue` 组件中按需导入 `getAllChannels` 方法：

     ```js
     import { getChannelList, getAllChannels } from '@/api/home'
     ```

   - 在 `data` 中声明 `allChannels` 的数组，用来存放所有的频道列表数据：

     ```js
     data() {
       return {
         // 所有频道的列表数据
         allChannels: []
       }
     }
     ```

   - 在 `created` 声明周期函数中，预调用 `this.getAllChannels()` 方法：

     ```js
     created() {
       this.getChannels()
       // 请求所有的频道列表数据
       this.getAllChannels()
     },
     ```

   - 在 `methods` 中定义 `getAllChannels` 方法如下：

     ```js
     // 获取所有频道列表的数据
     async getAllChannels() {
       const { data: res } = await getAllChannels()
       if (res.message === 'OK') {
         this.allChannels = res.data.channels
       }
     },
     ```

2. 在 `Home.vue` 组件中声明 `moreChannels` 的计算属性：

   ```js
   computed: {
     // 更多频道的数据
     moreChannels() {
       // 1. 对数组进行 filter 过滤，返回的是符合条件的新数组
       return this.allChannels.filter(x => {
         // 判断当前循环项，是否在 “我的频道” 列表之中
         const index = this.channels.findIndex(y => y.id === x.id)
         // 如果不在，则 return true，表示需要把这一项存储到返回的新数组之中
         if (index === -1) return true
       })
     }
   },
   ```

3. 修改更多频道列表的数据源：

   ```xml
   <!-- 更多频道列表 -->
   <van-row type="flex">
     <!-- 把数据源从 channels 修改为计算属性 moreChannels -->
     <van-col span="6" v-for="item in moreChannels" :key="item.id">
       <div class="channel-item van-hairline--surround">{{item.name}}</div>
     </van-col>
   </van-row>
   ```

   

### 6.4 渲染删除的徽标

1. 在 `Home.vue` 组件的 data 节点下声明布尔值 `isEdit`，来控制当前是否处于编辑状态：

   ```js
   data() {
     return {
       // 频道数据是否处于编辑状态
       isEdit: false
     }
   }
   ```

2. 为编辑按钮绑定点击事件，动态切换 `isEdit` 的值和渲染的文本内容：

   ```xml
   <span @click="isEdit = !isEdit">{{isEdit ? '完成' : '编辑'}}</span>
   ```

3. 在我的频道中，渲染删除的徽标，并使用 v-if 控制其显示与隐藏：

   ```xml
   <!-- 我的频道列表 -->
   <van-row type="flex">
     <van-col span="6" v-for="item in channels" :key="item.id">
       <!-- 频道的 Item 项 -->
       <div class="channel-item van-hairline--surround">
         {{item.name}}
         <!-- 删除的徽标 -->
         <van-badge color="transparent" class="cross-badge" v-if="isEdit">
           <template #content>
             <van-icon name="cross" class="badge-icon" color="#cfcfcf" size="12" />
           </template>
         </van-badge>
       </div>
     </van-col>
   </van-row>
   ```

4. 美化删除徽标的样式：

   ```less
   .cross-badge {
     position: absolute;
     right: -3px;
     top: 0;
     border: none;
   }
   ```

   

### 6.5 实现删除频道的功能

> 注意：“推荐”这个频道不允许被删除！

1. 为频道的 Item 项绑定点击事件处理函数：

   ```xml
   <!-- 频道的 Item 项 -->
   <div class="channel-item van-hairline--surround" @click="removeChannel(item.id)">
   </div>
   ```

2. 在 `methods` 中声明点击事件处理函数：

   ```js
   // 移除频道
   removeChannel(id) {
     // 如果当前不处于编辑状态，直接 return
     if (!this.isEdit) return
     // 如果当前要删除的 Id 等于 0，则不允许被删除
     if (id === 0) return
     // 对频道列表进行过滤
     this.channels = this.channels.filter(x => x.id !== id)
   }
   ```

3. 不为 “推荐” 频道展示 “删除” 的徽标：

   ```xml
   <!-- 删除的徽标 -->
   <van-badge color="transparent" class="cross-badge" v-if="isEdit && item.id !== 0">
     <template #content>
       <van-icon name="cross" class="badge-icon" color="#cfcfcf" size="12" />
     </template>
   </van-badge>
   ```

4. 删除完毕之后，需要把最新的频道列表数据保存到后台数据库中：

   - 在 `@/api/home.js` 中定义更新频道列表数据的 API 方法：

     ```js
     // 更新我的频道列表
     export const updateMyChannels = data => {
       return axios.put('/v1_0/user/channels', data)
     }
     ```

   - 修改 `Home.vue` 组件的 methods 节点中声明更新频道数据的 `updateChannels` 方法：

     ```js
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
     ```

   - 在 `removeChannel` 方法中调用 `updateChannels` 方法，更新数据库中的频道数据：

     ```js
     // 移除频道
     removeChannel(id) {
       // 如果当前不处于编辑状态，直接 return
       if (!this.isEdit) return
       // 如果当前要删除的 Id 等于 0，则不允许被删除
       if (id === 0) return
       // 对频道列表进行过滤
       this.channels = this.channels.filter(x => x.id !== id)
       this.updateChannels()
     },
     ```



### 6.6 实现新增频道的功能

1. 为**更多频道列表**中的频道 Item 项绑定点击事件处理函数：

   ```xml
   <!-- 更多频道列表 -->
   <van-row type="flex">
     <van-col span="6" v-for="item in moreChannels" :key="item.id">
       <div class="channel-item van-hairline--surround" @click="addChannel(item)">{{item.name}}</div>
     </van-col>
   </van-row>
   ```

2. 在 `methods` 中声明 `addChannel` 如下：

   ```js
   // 新增频道
   addChannel(channel) {
     // 向前端数据中新增频道信息
     this.channels.push(channel)
     // 把前端数据保存到后台数据库中
     this.updateChannels()
   }
   ```

   

### 6.7 弹出层关闭时重置编辑的状态

1. 监听弹出层关闭完成后的事件：

   ```xml
   <!-- 监听 closed 事件 -->
   <van-popup v-model="show" :close-on-click-overlay="false" @closed="onPopupClosed">
   </van-popup>
   ```

2. 声明 `onPopupClosed` 方法如下：

   ```js
   // 监听关闭弹出层且动画结束后触发的事件
   onPopupClosed() {
     this.isEdit = false
   }
   ```

   

### 6.8 实现频道的点击联动效果

1. 在 `Home.vue` 组件中声明 `activeTabIndex` 索引值，用来记录激活的 tab 标签页的索引：

   ```js
   data() {
     return {
       // 激活的 Tab 标签页索引，默认激活第一项
       activeTabIndex: 0
     }
   }
   ```

2. 为 `van-tabs` 组件通过 `v-model` 指令双向绑定激活项的索引：

   ```xml
   <!-- Tab 标签页 -->
   <van-tabs sticky offset-top="1.22667rem" v-model="activeTabIndex">
     <van-tab v-for="item in channels" :key="item.id" :title="item.name">
       <!-- 文章列表组件 -->
       <article-list :id="item.id"></article-list>
     </van-tab>
   </van-tabs>
   ```

3. 在点击**我的频道 Item 项**时，把索引值传递到点击事件的处理函数中：

   ```xml
   <!-- 频道的 Item 项 -->
   <div class="channel-item van-hairline--surround" @click="removeChannel(item.id, i)">
   </div>
   ```

4. 改造 `removeChannel` 方法如下：

   ```js
   // 移除频道
   removeChannel(id, index) {
     // 当前不处于编辑状态
     if (!this.isEdit) {
       // 为 tab 标签页的激活项索引重新赋值
       this.activeTabIndex = index
       // 关闭弹出层
       this.show = false
       return
     }
     
     // 如果当前要删除的 Id 等于 0，则不允许被删除
     if (id === 0) return
     // 对频道列表进行过滤
     this.channels = this.channels.filter(x => x.id !== id)
     this.updateChannels()
   },
   ```

   

## 7. 文章搜索



### 7.1 基于路由渲染搜索组件

1. 在 `@/views/` 目录下新建 `Search` 文件夹，并创建 `Search.vue` 和 `SearchResult.vue` 组件。
   
2. 在路由模块中导入上述的两个组件，并声明对应的路由规则：

     ```js
     // 导入搜索相关的组件
     import Search from '@/views/Search/Search.vue'
     import SearchResult from '@/views/Search/SearchResult.vue'
     
     const routes = [
       { path: '/login', component: Login, name: 'login' },
       {
         path: '/',
         component: Layout,
         children: [
           { path: '', component: Home, name: 'home' },
           { path: '/user', component: User, name: 'user' }
         ]
       },
       // 搜索组件的路由规则
       { path: '/search', component: Search, name: 'search' },
       // 搜索结果组件的路由规则
       { path: '/search/:kw', component: SearchResult, name: 'search-result' }
     ]
     ```
3. 在 `Home.vue` 组件中，为 NavBar 右侧的搜索图标绑定点击事件处理函数，通过编程式导航跳转到搜索组件页面：

   ```xml
   <van-icon name="search" color="white" size="18" @click="$router.push('/search')" />
   ```

   

### 7.2 渲染搜索页面的 Header 区域

1. 在 `Search.vue` 组件中声明如下的 DOM 结构：

   ```xml
   <template>
     <div>
       <div class="search-header">
         <!-- 后退按钮 -->
         <van-icon name="arrow-left" color="white" size="18" class="goback" @click="$router.go(-1)" />
         <!-- 搜索组件 -->
         <van-search v-model.trim="kw" placeholder="请输入搜索关键词" background="#007BFF" shape="round" />
       </div>
     </div>
   </template>
   ```

2. 在 `data` 中声明 `kw` 关键词：

   ```js
   data() {
     return {
       // 搜索关键词
       kw: ''
     }
   }
   ```

3. 美化样式：

   ```less
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
   ```

   

### 7.3 实现搜索框自动获得焦点

1. 为 `van-search` 组件添加 `ref` 引用：

   ```xml
   <!-- 搜索组件 -->
   <van-search v-model.trim="kw" placeholder="请输入搜索关键词" background="#007BFF" shape="round" ref="search" />
   ```

2. 在 `mounted` 生命周期函数中，获取组件的引用，并通过 DOM 操作查找到 input 输入框，使其获得焦点：

   ```js
   mounted() {
     // 如果搜索组件的 ref 引用存在，则获取下面的 input 输入框，使其自动获得焦点
     this.$refs.search && this.$refs.search.querySelector('input').focus()
   }
   ```

   

### 7.4 实现输入框的防抖操作

1. 在 `data` 中声明 `timerId`，用来存储延时器的 Id：

   ```js
   data() {
     return {
       // 延时器的 Id
       timerId: null
     }
   }
   ```

2. 监听搜索组件的 `input` 输入事件：

   ```xml
   <!-- 搜索组件 -->
   <van-search v-model.trim="kw" placeholder="请输入搜索关键词" background="#007BFF" shape="round" ref="search" @input="onInput" />
   ```

3. 在 `methods` 中声明 `onInput` 处理函数：

   ```js
   // 监听文本框的输入事件
   onInput() {
     // 清除延时器
     clearTimeout(this.timerId)
   
     // 判断是否输入了内容
     if (this.kw.length === 0) return
   
     // 创建延时器
     this.timerId = setTimeout(() => {
       console.log(this.kw)
     }, 500)
   }
   ```

   

### 7.5 渲染搜索建议列表数据

1. 在 `@/api/` 目录下新建 `search.js` 模块：

   ```js
   import axios from '@/utils/request'
   
   // 获取搜索关键词的列表
   export const getSuggList = kw => {
     return axios.get('/v1_0/suggestion', {
       params: {
         q: kw
       }
     })
   }
   ```

2. 在 `Search.vue` 组件的 `data` 中声明搜索建议的数组：

   ```js
   data() {
     return {
       // 建议列表
       suggList: []
     }
   }
   ```

3. 在 `Search.vue` 组件中按需导入 `getSuggList` 方法：

   ```js
   import { getKwList } from '@/api/search'
   ```

4. 定义 `getKeywordsList` 方法如下：

   ```js
   // 请求搜索关键词的列表
   async getKeywordsList() {
     const { data: res } = await getSuggList(this.kw)
     if (res.message === 'OK') {
       this.suggList = res.data.options
     }
   }
   ```

5. 修改 `onInput` 方法：

   ```js
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
   ```

6. 基于 `v-for` 指令循环渲染搜索建议列表：

   ```xml
   <!-- 搜索建议 -->
   <div class="sugg-list">
     <div class="sugg-item" v-for="(item, i) in suggList" :key="i">{{item}}</div>
   </div>
   ```

7. 美化样式：

   ```less
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
   ```

   

### 7.6 高亮搜索关键词

1. 把插值表达式改造为 `v-html` 指令：

   ```xml
   <!-- 搜索建议 -->
   <div class="sugg-list">
     <div class="sugg-item" v-for="(item, i) in suggList" :key="i" v-html="item"></div>
   </div>
   ```

2. 在 `methods` 中声明 `hightlightKeywords` 方法：

   ```js
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
   }
   ```

3. 改造 `getKeywordsList` 方法：

   ```js
   // 请求搜索关键词的列表
   async getKeywordsList() {
     const { data: res } = await getSuggList(this.kw)
     if (res.message === 'OK') {
       // this.suggList = res.data.options
   
       // 调用 hightlightKeywords 方法，对关键字进行高亮处理
       this.suggList = this.hightlightKeywords(res.data.options)
     }
   },
   ```

   

### 7.7 渲染搜索历史的 DOM 结构

1. 在 `data` 中定义假数据：

   ```js
   data() {
     return {
       // 搜索历史
       history: ['API', 'java', 'css', '前端', '后台接口', 'python']
     }
   }
   ```

2. 渲染搜索历史的 DOM 结构：

   ```xml
   <!-- 搜索历史 -->
   <div class="search-history">
     <!-- 标题 -->
     <van-cell title="搜索历史">
       <!-- 使用 right-icon 插槽来自定义右侧图标 -->
       <template #right-icon>
         <van-icon name="delete" class="search-icon" />
       </template>
     </van-cell>
   
     <!-- 历史列表 -->
     <div class="history-list">
       <span class="history-item" v-for="(tag, i) in history" :key="i">{{tag}}</span>
     </div>
   </div>
   ```

3. 美化样式：

   ```less
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
   ```

4. 根据搜索关键字 `kw` 的 length 是否为 0，再结合 `v-if` 和 `v-else` 指令，实现**搜索建议**和**搜索历史**的按需展示：

   ```xml
   <!-- 搜索建议 -->
   <div class="sugg-list" v-if="kw.length !== 0"></div>
   
   <!-- 搜索历史 -->
   <div class="search-history" v-else></div>
   ```

   

### 7.8 存储搜索关键词

> 1. 关键词去重
> 2. 最新的关键词插入到头部位置
> 3. 通过 Set 对象实现数组的去重

1. 改造 `getKeywordsList` 方法：

   ```js
   // 请求搜索关键词的列表
   async getKeywordsList() {
     const { data: res } = await getSuggList(this.kw)
     if (res.message === 'OK') {
       this.suggList = this.hightlightKeywords(res.data.options)
       // 1. 创建一个 Set 对象，用来去重
       const set = new Set([this.kw, ...this.history])
       // 2. 把去重之后的结果，转化成数组，存放到 history 数组中
       this.history = Array.from(set)
     }
   },
   ```

2. 定义 watch 侦听器，监视数组的变化，持久化存储到 `localStorage` 中：

   ```js
   watch: {
     // 监视 history 数组的变化，持久化存储到本地
     history(newVal) {
       window.localStorage.setItem('searchHistory', JSON.stringify(newVal))
     }
   }
   ```

3. 在 `data` 中初始化 `history` 数组：

   ```js
   data() {
     return {
       // 搜索历史
       history: JSON.parse(window.localStorage.getItem('searchHistory') || '[]')
     }
   }
   ```

   

### 7.9 跳转到搜索结果页

1. 为搜索建议的 item 项绑定 `click` 点击事件处理函数：

   ```xml
   <!-- 搜索建议 -->
   <div class="sugg-list" v-if="kw.length !== 0">
     <div class="sugg-item" v-for="(item, i) in suggList" :key="i" v-html="item" @click="gotoSearchResult"></div>
   </div>
   ```

2. 为历史列表的 item 项绑定 `click` 点击事件处理函数：

   ```xml
   <!-- 历史列表 -->
   <div class="history-list">
     <span class="history-item" v-for="(tag, i) in history" :key="i" @click="gotoSearchResult(tag)">{{tag}}</span>
   </div>
   ```

3. 在 `Search.vue` 组件中声明如下的 methods 处理函数：

   ```js
   // 点击搜索结果 Or 搜索历史，跳转到搜索结果页
   gotoSearchResult(e) {
     // 1. 获取到搜索关键字
     const q = typeof e === 'string' ? e : e.target.innerText
   
     // 2. 编程式导航 + 命名路由
     this.$router.push({
       // 2.1 路由名称
       name: 'search-result',
       // 2.2 路由参数
       params: {
         kw: q
       }
     })
   }
   ```

4. 渲染搜索结果页面的基本 DOM 结构：

   ```vue
   <template>
     <div class="search-result-container">
       <!-- 点击实现后退效果 -->
       <van-nav-bar title="搜索结果" left-arrow @click-left="$router.go(-1)" fixed />
     </div>
   </template>
   
   <script>
   export default {
     name: 'SearchResult',
     props: ['kw']
   }
   </script>
   
   <style lang="less" scoped>
   .search-result-container {
     padding-top: 46px;
   }
   </style>
   ```

   

### 7.10 实现数据请求和上拉加载更多

1. 在 `@/api/search.js` 模块中封装 `getSearchResult` 方法：

   ```js
   // 根据关键词查询搜索结果列表的数据
   export const getSearchResult = (q, page) => {
     return axios.get('/v1_0/search', {
       params: {
         q,
         page
       }
     })
   }
   ```

2. 在 `SearchResult.vue` 组件中，通过 `van-list` 组件实现上拉加载更多的效果：

   ```xml
   <!-- 上拉加载更多 -->
   <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
     <!-- 文章信息组件 -->
     <article-info v-for="item in searchResult" :key="item.art_id" :article="item"></article-info>
   </van-list>
   ```

3. 在 `data` 中声明对应的数据节点：

   ```js
   data() {
     return {
       // 页码值
       page: 1,
       // 搜索的结果
       searchResult: [],
       // 是否正在请求数据
       loading: false,
       // 数据是否已经加载完毕
       finished: false
     }
   }
   ```

4. 导入接口和 `ArticleInfo.vue` 组件：

   ```js
   // 导入 API 接口
   import { getSearchResult } from '@/api/search'
   // 导入组件
   import ArticleInfo from '@/views/Home/ArticleInfo.vue'
   
   // 注册组件
   components: {
     ArticleInfo
   }
   ```

5. 在 methods 中声明 `onLoad` 处理函数如下：

   ```js
   // 加载数据
   async onLoad() {
     // 请求数据
     const { data: res } = await getSearchResult(this.kw, this.page)
     // 判断是否请求成功
     if (res.message === 'OK') {
       // 拼接数据
       this.searchResult = [...this.searchResult, ...res.data.results]
       // 重置加载状态
       this.loading = false
       // 页码值 + 1
       this.page += 1
       // 判断数据是否加载完毕
       if (res.data.results.length === 0) {
         this.finished = true
       }
     }
   }
   ```

   

### 7.11 自定义关闭按钮的显示与隐藏

1. 在 `ArticleInfo.vue` 组件中，新增名为 `closable` 的 props 节点：

   ```js
   props: {
     // 是否展示关闭按钮
     closable: {
       type: Boolean,
       // 默认值为 true，表示展示关闭按钮
       default: true
     }
   }
   ```

2. 使用 `v-if` 动态控制关闭按钮的展示与隐藏：

   ```xml
   <!-- 关闭按钮 -->
   <van-icon name="cross" @click.stop="onCloseClick" v-if="closable" />
   ```

3. 在 `SearchResult.vue` 组件中使用 `ArticleInfo.vue` 组件时，不展示关闭按钮：

   ```xml
   <!-- 上拉加载更多 -->
   <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
     <!-- 文章信息组件 -->
     <article-info v-for="item in searchResult" :key="item.art_id" :article="item" :closable="false"></article-info>
   </van-list>
   ```

   

## 8. 文章详情

### 8.1 通过路由渲染详情页组件

1. 在 `@/views/ArticleDetail` 目录下，新建 `ArticleDetail.vue` 组件：

   ```vue
   <template>
     <div>
       文章详情
     </div>
   </template>
   
   <script>
   export default {
     name: 'ArticleDetail',
     props: {
       // 文章Id
       artId: {
         type: [String, Number],
         required: true
       }
     }
   }
   </script>
   
   <style lang="less" scoped>
   </style>
   ```

2. 在 `@/router/index.js` 路由模块中，声明详情页的路由规则：

   ```js
   // 导入文章详情页
   import ArticleDetail from '@/views/ArticleDetail/ArticleDetail.vue'
   
   const routes = [
     // 省略其它代码...
   
     // 文章详情页的路由规则
     {
       path: '/article/:artId',
       component: ArticleDetail,
       name: 'article-detail',
       props: true // 开启路由的 props 传参
     }
   ]
   ```

3. 在文章列表页面和搜索结果页面，为 `<article-info>` 组件绑定 `click` 事件处理函数，通过编程式导航跳转到文章详情页：

   ```jsx
   <article-info v-for="item in articles" :key="item.art_id.toString()" :article="item" @remove-article="onArticleRemove" @click="gotoDetail(item.art_id.toString())"></article-info>
   
   methods: {
     // 跳转到文章详情页
     gotoDetail(artId) {
       // 编程式导航 + 命名路由
       this.$router.push({
         name: 'article-detail',
         params: { // 导航参数
           artId
         }
       })
     }
   }
   ```

4. 在 `ArticleInfo.vue` 组件中，为最外层包裹性质的容器绑定 `click` 事件处理函数，通过 `$emit()` 触发自定义的 `click` 事件：

   ```xml
   <div @click="$emit('click')">
     <van-cell>
       <!-- 省略其它代码... -->
     </van-cell>
   </div>
   ```



### 8.2 渲染文章详情页的基本结构

1. 声明如下的 DOM 结构：

   ```xml
   <template>
     <div>
       <!-- Header 区域 -->
       <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />
   
       <!-- 文章信息区域 -->
       <div class="article-container">
         <!-- 文章标题 -->
         <h1 class="art-title">小程序</h1>
   
         <!-- 用户信息 -->
         <van-cell center title="张三" label="3天前">
           <template #icon>
             <img src="" alt="" class="avatar">
           </template>
           <template #default>
             <div>
               <van-button type="info" size="mini">已关注</van-button>
               <van-button icon="plus" type="info" size="mini" plain>关注</van-button>
             </div>
           </template>
         </van-cell>
   
         <!-- 分割线 -->
         <van-divider></van-divider>
   
         <!-- 文章内容 -->
         <div class="art-content">好好学习, 天天向上</div>
   
         <!-- 分割线 -->
         <van-divider>End</van-divider>
   
         <!-- 点赞 -->
         <div class="like-box">
           <van-button icon="good-job" type="danger" size="small">已点赞</van-button>
           <van-button icon="good-job-o" type="danger" plain size="small">点赞</van-button>
         </div>
       </div>
     </div>
   </template>
   ```

2. 美化样式：

   ```less
   .article-container {
     padding: 10px;
     margin-top: 46px;
   }
   .art-title {
     font-size: 16px;
     font-weight: bold;
     margin: 10px 0;
   }
   
   .art-content {
     font-size: 12px;
     line-height: 24px;
     width: 100%;
     overflow-x: scroll;
     word-break: break-all;
   }
   
   .van-cell {
     padding: 5px 0;
     &::after {
       display: none;
     }
   }
   
   .avatar {
     width: 60px;
     height: 60px;
     border-radius: 50%;
     background-color: #f8f8f8;
     margin-right: 5px;
     border: none;
   }
   
   .like-box {
     display: flex;
     justify-content: center;
}
   ```
   
   

### 8.3 请求并渲染文章详情

1. 在 `@/api` 目录下新建 `article.js` 模块：

   ```js
   import axios from '@/utils/request'
   
   // 获取文章详情数据
   export const getArticleInfo = artId => {
     return axios.get(`/v1_0/articles/${artId}`)
   }
   ```

2. 在 `ArticleDetail.vue` 组件中发起数据请求：

   ```js
   // 1. 按需导入 API 接口
   import { getArticleInfo } from '@/api/article'
   
   export default {
     name: 'ArticleDetail',
     props: {
       // 文章Id
       artId: {
         type: [String, Number],
         required: true
       }
     },
     data() {
       return {
         // 2. 定义文章详情的数据
         article: {}
       }
     },
     // 4. 页面初次加载时,请求详情数据
     created() {
       this.getArticleDetail()
     },
     methods: {
       // 3. 声明获取文章数据的方法
       async getArticleDetail() {
         const { data: res } = await getArticleInfo(this.artId)
         if (res.message === 'OK') {
           console.log(res)
           this.article = res.data
         }
       }
     }
   }
   ```

3. 渲染文章详情的数据：

   ```xml
   <template>
     <div>
       <!-- Header 区域 -->
       <van-nav-bar title="文章详情" left-arrow @click-left="$router.back()" />
   
       <!-- 文章信息区域 -->
       <div class="article-container">
         <!-- 文章标题 -->
         <h1 class="art-title">{{article.title}}</h1>
   
         <!-- 用户信息 -->
         <van-cell center :title="article.aut_name" :label="article.pubdate | dateFormat">
           <template #icon>
             <img :src="article.aut_photo" alt="" class="avatar">
           </template>
           <template #default>
             <div>
               <van-button type="info" size="mini" v-if="article.is_followed">已关注</van-button>
               <van-button icon="plus" type="info" size="mini" plain v-else>关注</van-button>
             </div>
           </template>
         </van-cell>
   
         <!-- 分割线 -->
         <van-divider></van-divider>
   
         <!-- 文章内容 -->
         <div class="art-content" v-html="article.content"></div>
   
         <!-- 分割线 -->
         <van-divider>End</van-divider>
   
         <!-- 点赞 -->
         <div class="like-box">
           <van-button icon="good-job" type="danger" size="small" v-if="article.attitude === 1">已点赞</van-button>
           <van-button icon="good-job-o" type="danger" plain size="small" v-else>点赞</van-button>
         </div>
       </div>
     </div>
   </template>
   ```

   

### 8.4 实现关注和取消关注的功能

1. 在 `@/api/article.js` 模块中声明如下两个接口：

   ```js
   // 关注用户
   export const followUser = uid => {
     return axios.post('/v1_0/user/followings', {
       target: uid
     })
   }
   
   // 取消关注用户
   export const unfollowUser = uid => {
     return axios.delete(`/v1_0/user/followings/${uid}`)
   }
   ```

2. 在 `@/utils/request.js` 模块中，修改 `transBigInt` 函数如下：

   ```js
   // 处理大数问题
   const transBigInt = data => {
     // 如果接口请求成功后没有响应任何数据，则直接返回空字符串
     if (!data) return ''
     try {
       return bigInt.parse(data)
     } catch {
       return JSON.parse(data)
     }
   }
   ```

3. 在 `ArticleDetail.vue` 组件中，为关注按钮绑定点击事件处理函数：

   ```xml
   <van-button type="info" size="mini" v-if="article.is_followed" @click="setFollow(false)">已关注</van-button>
   <van-button icon="plus" type="info" size="mini" plain v-else @click="setFollow(true)">关注</van-button>
   ```

4. 按需导入相关的 API 方法，并定义 `setFollow` 方法如下：

   ```js
   // 1. 按需导入 API 接口
   import { getArticleInfo, followUser, unfollowUser } from '@/api/article'
   
   // 修改关注状态
   async setFollow(followState) {
     if (followState) {
       // 调用关注的接口
       await followUser(this.article.aut_id.toString())
       this.$toast.success('关注成功!')
     } else {
       // 调用取消关注的接口
       await unfollowUser(this.article.aut_id.toString())
       this.$toast.success('取消关注成功!')
     }
   
     // 修改文章的状态
     this.article.is_followed = followState
   }
   ```

   

### 8.5 实现点赞和取消点赞的功能

1. 在 `@/api/article.js` 模块中定义如下的方法：

   ```js
   /**
    * 点赞
    * @param {*} id 文章Id
    * @returns
    */
   export const addLike = id => {
     return axios.post('/v1_0/article/likings', {
       target: id
     })
   }
   
   /**
    * 取消点赞
    * @param {*} id 文章Id
    * @returns
    */
   export const delLike = id => {
     return axios.delete(`/v1_0/article/likings/${id}`)
   }
   ```

2. 在 `ArticleDetail.vue` 中，为点赞按钮绑定点击事件处理函数：

   ```xml
   <van-button icon="good-job" type="danger" size="small" v-if="article.attitude === 1" @click="setLike(false)">已点赞</van-button>
   <van-button icon="good-job-o" type="danger" plain size="small" v-else @click="setLike(true)">点赞</van-button>
   ```

3. 导入对应的 API 方法，并声明 `setLike` 方法如下：

   ```js
   // 1. 按需导入 API 接口
   import {
     getArticleInfo,
     followUser,
     unfollowUser,
     addLike,
     delLike
   } from '@/api/article'
   
   // 修改点赞状态
   async setLike(likeState) {
     if (likeState) {
       // 调用点赞的接口
       await addLike(this.article.art_id.toString())
       this.$toast.success('点赞成功!')
     } else {
       // 调用取消点赞的接口
       await delLike(this.article.art_id.toString())
       this.$toast.success('取消点赞成功!')
     }
   
     this.article.attitude = likeState ? 1 : -1
   }
   ```

   

## 9. 文章评论

### 9.1 渲染评论组件的基本结构

1. 在 `@/views/ArticleDetail` 目录下新建 `ArtCmt.vue` 组件：

   ```vue
   <template>
     <div>
       <!-- 评论列表 -->
       <div class="cmt-list">
         <!-- 评论的 Item 项 -->
         <div class="cmt-item">
           <!-- 头部区域 -->
           <div class="cmt-header">
             <!-- 头部左侧 -->
             <div class="cmt-header-left">
               <img src="" alt="" class="avatar">
               <span class="uname">zs</span>
             </div>
             <!-- 头部右侧 -->
             <div class="cmt-header-right">
               <van-icon name="like" size="16" color="red" />
               <van-icon name="like-o" size="16" color="gray" />
             </div>
           </div>
           <!-- 主体区域 -->
           <div class="cmt-body">
             基于字体的图标集，可以通过 Icon 组件使用，也可以在其他组件中通过 icon 属性引用。基于字体的图标集，可以通过 Icon 组件使用，也可以在其他组件中通过 icon 属性引用。
           </div>
           <!-- 尾部区域 -->
           <div class="cmt-footer">3天前</div>
         </div>
       </div>
     </div>
   </template>
   ```

2. 美化样式：

   ```less
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
   ```

3. 在 `ArticleDetal.vue` 组件中导入并使用 `ArtCmt.vue` 组件：

   ```jsx
   // 导入组件
   import ArtCmt from './ArtCmt.vue'
   
   // 注册组件
   components: {
     ArtCmt
   }
   
   <!-- 使用文章评论组件 -->
   <art-cmt></art-cmt>
   ```

   

### 9.2 请求并渲染评论列表的数据

> 带有评论的文章链接地址：http://localhost:8080/#/article/1323570687952027648

1. 在 `@/api/article.js` 中定义获取评论数据的接口：

   ```js
   // 获取文章的评论列表
   export const getCmtList = (artId, offset) => {
     return axios.get('/v1_0/comments', {
       params: {
         // a表示对文章的评论 ,c表示对评论的回复
         type: 'a',
         // 文章的 Id
         source: artId,
         //  获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
         offset
       }
     })
   }
   ```

2. 在 `ArtCmt.vue` 组件中声明文章 Id 的 props：

   ```js
   props: {
     // 文章的 Id
     artId: {
       type: [String, Number],
       required: true
     }
   },
   ```

3. 在 `ArticleDetail.vue` 组件中使用 `<art-cmt>` 组件时，把文章 Id 传递到评论组件中：

   ```xml
   <!-- 文章评论组件 -->
   <art-cmt :artId="article.art_id.toString()" v-if="article.art_id"></art-cmt>
   ```

4. 在 `ArtCmt.vue` 组件的 data 中声明如下的数据：

   ```js
   data() {
     return {
       // 偏移量
       offset: null,
       // 是否正在加载数据
       loading: false,
       // 数据是否加载完毕了
       finished: false,
       // 评论列表的数据
       cmtlist: []
     }
   },
   ```

5. 将 `class="cmt-list"` 的 div 替换为 `<van-list>` 组件：

   ```xml
   <!-- 评论列表 -->
   <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" class="cmt-list">
   </van-list>
   ```

6. 定义 `onLoad` 函数如下：

   ```js
   methods: {
     // 触发了加载数据的事件
     async onLoad() {
       const { data: res } = await getCmtList(this.artId, this.offset)
       if (res.message === 'OK') {
         // 为偏移量赋值
         this.offset = res.data.last_id
         // 为评论列表数据赋值
         this.cmtlist = [...this.cmtlist, ...res.data.results]
   
         // 重置 loading 和 finished
         this.loading = false
         if (res.data.results.length === 0) {
           this.finished = true
         }
       }
     }
   }
   ```

   

### 9.3 实现评论的点赞和取消点赞的功能

1. 在 `@/api/article.js` 模块中定义如下两个 API 接口：

   ```js
   // 评论点赞
   export const addCmtLike = cmtId => {
     return axios.post('/v1_0/comment/likings', {
       target: cmtId
     })
   }
   
   // 评论取消点赞
   export const removeCmtLike = cmtId => {
     return axios.delete(`/v1_0/comment/likings/${cmtId}`)
   }
   ```

2. 为点赞和取消点赞的图片绑定点击事件处理函数：

   ```xml
   <van-icon name="like" size="16" color="red" v-if="item.is_liking" @click="setLike(false, item)" />
   <van-icon name="like-o" size="16" color="gray" v-else @click="setLike(true, item)" />
   ```

3. 按需导入评论点赞的 API 方法：

   ```js
   import { getCmtList, addCmtLike, removeCmtLike } from '@/api/article'
   ```

4. 在 `methods` 中声明 `setLike` 方法如下：

   ```js
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
   }
   ```



### 9.4 渲染发布评论的基本结构

1. 渲染基本的 DOM 结构：

   ```xml
   <!-- 底部添加评论区域 - 1 -->
   <div class="add-cmt-box van-hairline--top">
     <van-icon name="arrow-left" size="18" @click="$router.back()" />
     <div class="ipt-cmt-div">发表评论</div>
     <div class="icon-box">
       <van-badge :content="cmtCount ? cmtCount : ''" :max="99">
         <van-icon name="comment-o" size="20" />
       </van-badge>
       <van-icon name="star-o" size="20" />
       <van-icon name="share-o" size="20" />
     </div>
   </div>
   
   <!-- 底部添加评论区域 - 2 -->
   <div class="cmt-box van-hairline--top">
     <textarea placeholder="友善评论、理性发言、阳光心灵"></textarea>
     <van-button type="default" disabled>发布</van-button>
   </div>
   ```

2. 在 `data` 中定义 `cmtCount` 的值：

   ```js
   data() {
     return {
       // 评论数量
       cmtCount: 0
     }
   },
   ```

3. 在请求数据的方法中，为 `cmtCount` 赋值：

   ```js
   // 触发了加载数据的事件
   async onLoad() {
     const { data: res } = await getCmtList(this.artId, this.offset)
     console.log(res)
     if (res.message === 'OK') {
       this.offset = res.data.last_id
       // 为评论数量赋值
       this.cmtCount = res.data.total_count
       this.cmtlist = [...this.cmtlist, ...res.data.results]
   
       this.loading = false
       if (res.data.results.length === 0) {
         this.finished = true
       }
     }
   },
   ```

4. 美化样式：

   ```less
   // 外层容器
   .art-cmt-container-1 {
     padding-bottom: 46px;
   }
   .art-cmt-container-2 {
     padding-bottom: 80px;
   }
   
   // 发布评论的盒子 - 1
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
   
   // 发布评论的盒子 - 2
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
   ```

   

### 9.5 实现 textarea 的按需展示

1. 在 `data` 中定义布尔值 `isShowCmtInput` 用来控制 textarea 的显示与隐藏：

   ```js
   data() {
     return {
       // 是否展示评论的输入框
       isShowCmtInput: false
     }
   }
   ```

2. 使用 v-if 和 v-else 指令控制两个区域的按需展示：

   ```xml
   <!-- 底部添加评论区域 - 1 -->
   <div class="add-cmt-box van-hairline--top" v-if="!isShowCmtInput"></div>
   
   <!-- 底部添加评论区域 - 2 -->
   <div class="cmt-box van-hairline--top" v-else></div>
   ```

3. 点击发表评论的 div，展示 textarea 所在的盒子：

   ```jsx
   <div class="ipt-cmt-div" @click="showTextarea">发表评论</div>
   
   // 点击发表评论的 div, 展示 textarea 所在的盒子
   showTextarea() {
     this.isShowCmtInput = true
     // 让文本框自动获得焦点
     this.$nextTick(() => {
       this.$refs.cmtIpt.focus()
     })
   },
   ```

4. 在 textarea 失去焦点时，重置布尔值为 false：

   ```jsx
   <textarea placeholder="友善评论、理性发言、阳光心灵" ref="cmtIpt" @blur="onCmtIptBlur"></textarea>
   
   // 文本框失去焦点
   onCmtIptBlur() {
     this.isShowCmtInput = false
   }
   ```

5. 动态控制 `ArtCmt.vue` 组件外层容器底部的 padding 距离：

   ```xml
   <div :class="isShowCmtInput ? 'art-cmt-container-2' : 'art-cmt-container-1'"></div>
   ```

   

### 9.6 点击评论按钮平滑滚动到评论列表

1. 为评论的小图标绑定 click 点击事件处理函数：

   ```xml
   <!-- 评论的小图标 -->
   <van-badge :content="cmtCount ? cmtCount : ''" :max="99">
     <van-icon name="comment-o" size="20" @click="scrollToCmtList" />
   </van-badge>
   ```

2. 在 `methods` 中声明 `scrollToCmtList` 函数如下：

   ```js
   // 实现滚动条平滑滚动的方法
   scrollToCmtList() {
     // 1.1 返回文档在垂直方向已滚动的像素值
     const now = window.scrollY
     // 1.2 目标位置（文章信息区域的高度）
     let dist = document.querySelector('.article-container').offsetHeight
     // 1.3 可滚动高度 = 整个文档的高度 - 浏览器窗口的视口（viewport）高度
     const avalibleHeight = document.documentElement.scrollHeight - window.innerHeight
   
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
         return window.scrollTo(0, dist)
       }
       // 4.1 每隔 10ms 执行一次滚动，并递归地进行下一次的滚动
       window.scrollTo(0, now + step)
       this.scrollToCmtList()
     }, 10)
   }
   ```

   

### 9.7 发布评论

1. 在 `@/api/article.js` 模块中定义如下的 API 方法：

   ```js
   // 对文章发表评论
   export const pubComment = (artId, content) => {
     return axios.post('/v1_0/comments', {
       target: artId, // 文章的 id
       content // 评论的内容
     })
   }
   ```

2. 在 `ArtCmt.vue` 组件中按需导入 API 方法：

   ```js
   import {
     getCmtList,
     addCmtLike,
     removeCmtLike,
     pubComment
   } from '@/api/article'
   ```

3. 为输入框添加 `v-model.trim` 的双向数据绑定：

   ```jsx
   <textarea placeholder="友善评论、理性发言、阳光心灵" ref="cmtIpt" v-model.trim="cmt"></textarea>
   
   data() {
     return {
       // 评论内容
       cmt: ''
     }
   }
   ```

4. 动态控制**发布按钮**的禁用状态：

   ```xml
   <van-button type="default" :disabled="cmt.length === 0">发布</van-button>
   ```

5. 修改输入框的 `blur` 事件处理函数：

   ```jsx
   <textarea placeholder="友善评论、理性发言、阳光心灵" ref="cmtIpt" @blur="onCmtIptBlur" v-model.trim="cmt"></textarea>
   
   // 文本框失去焦点
   onCmtIptBlur() {
     // 延迟隐藏的操作，否则无法触发按钮的 click 事件处理函数
     setTimeout(() => {
       this.isShowCmtInput = false
     })
   },
   ```

6. 为发布文章的按钮绑定点击事件处理函数：

   ```xml
   <van-button type="default" :disabled="cmt.length === 0" @click="pubCmt">发布</van-button>
   ```

7. 声明 `pubCmt` 事件处理函数：

   ```js
   // 发布新评论
   async pubCmt() {
     // 转存评论内容
     const cmt = this.cmt
     // 清空评论文本框
     this.cmt = ''
     // 隐藏输入区域
     this.isShowCmtInput = false
   
     // 发布评论
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
   ```

   

## 10. 个人中心



### 10.1 渲染个人中心页面的基本结构

1. 声明个人中心页面的基本 DOM 结构：

   ```xml
   <template>
     <div class="user-container">
       <!-- 用户基本信息面板 -->
       <div class="user-card">
         <!-- 用户头像、姓名 -->
         <van-cell>
           <!-- 使用 title 插槽来自定义标题 -->
           <template #icon>
             <img src="" alt="" class="avatar">
           </template>
           <template #title>
             <span class="username">用户名</span>
           </template>
           <template #label>
             <van-tag color="#fff" text-color="#007bff">申请认证</van-tag>
           </template>
         </van-cell>
         <!-- 动态、关注、粉丝 -->
         <div class="user-data">
           <div class="user-data-item">
             <span>0</span>
             <span>动态</span>
           </div>
           <div class="user-data-item">
             <span>0</span>
             <span>关注</span>
           </div>
           <div class="user-data-item">
             <span>0</span>
             <span>粉丝</span>
           </div>
         </div>
       </div>
   
       <!-- 操作面板 -->
       <van-cell-group class="action-card">
         <van-cell icon="edit" title="编辑资料" is-link />
         <van-cell icon="chat-o" title="小思同学" is-link />
         <van-cell icon="warning-o" title="退出登录" is-link />
       </van-cell-group>
     </div>
   </template>
   ```

2. 美化样式：

   ```less
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
   ```

   

### 10.2 获取并渲染用户的基本信息

1. 在 `@/api/user.js` 模块中，定义获取用户信息的 API 接口：

   ```js
   // 获取用户的基本信息
   export const getUserInfo = () => {
     return axios.get('/v1_0/user')
   }
   ```

2. 在 `User.vue` 组件中调用接口，获取用户的基本信息：

   ```js
   // 按需导入 API 接口
   import { getUserInfo } from '@/api/user'
   
   export default {
     name: 'User',
     data() {
       return {
         // 用户的基本信息
         user: {}
       }
     },
     created() {
       // 在组件初始化的时候，请求用户信息
       this.initUserInfo()
     },
     methods: {
       // 初始化用户的基本信息
       async initUserInfo() {
         const { data: res } = await getUserInfo()
         if (res.message === 'OK') {
           console.log(res)
           this.user = res.data
         }
       }
     }
   }
   ```

3. 渲染用户的基本信息：

   ```xml
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
   ```

   

### 10.3 把用户信息存储到 vuex

> 为了方便在多个页面之间共享用户的信息，可以把用户的信息存储到 vuex 中

1. 在 vuex 的 state 节点下，声明 `user` 数据节点：

   ```js
   // 初始的 state 数据
   let initState = {
     // 登录成功之后的 token 信息
     tokenInfo: {},
     // 用户的基本信息
     user: {}
   }
   ```

2. 在 `mutaions` 节点下新增 `updateUserInfo` 函数：

   ```js
   // 更新用户的基本信息
   updateUserInfo(state, payload) {
     state.user = payload
     this.commit('saveToStorage')
   }
   ```

3. 在 `User.vue` 组件中按需导入 vuex 的辅助函数：

   ```js
   import { mapState, mapMutations } from 'vuex'
   ```

4. 注释掉 `data` 节点下的 `user` 节点，并使用 `mapState` 把数据映射为 computed 计算属性：

   ```js
   export default {
     name: 'User',
     data() {
       return {
         // 用户的信息对象
         // user: {}
       }
     },
     computed: {
       // 映射需要的 state 数据
       ...mapState(['user'])
     },
   }
   ```

5. 使用 `mapMutations` 把方法映射为当前组件的 `methods` 处理函数，并进行调用：

   ```js
   methods: {
     // 1. 映射需要的 mutations 方法
     ...mapMutations(['updateUserInfo']),
   
     // 初始化用户的基本信息
     async initUserInfo() {
       const { data: res } = await getUserInfo()
       if (res.message === 'OK') {
         console.log(res)
         // 2. 注释掉下面这一行，不再把数据存储到当前组件的 data 中
         // this.user = res.data
         // 3. 把数据存储到 vuex 中
         this.updateUserInfo(res.data)
       }
     }
   }
   ```

6. 为了防止 `user` 为空对象时导致的数据渲染失败问题，可以为 `User.vue` 最外层的 div 元素添加 `v-if` 指令的判断：

   ```xml
   <template>
     <div class="user-container" v-if="user.name">
       <!-- 省略其它代码... -->
     </div>
   </template>
   ```

   

### 10.4 实现退出登录的功能

1. 为退出登录的 `van-cell` 组件绑定 `click` 点击事件处理函数：

   ```xml
   <van-cell icon="warning-o" title="退出登录" is-link @click="logout" />
   ```

2. 在 vuex 的 mutations 中定义 `cleanState` 方法：

   ```js
   // 清空 state 中的关键数据
   cleanState(state) {
     state.tokenInfo = {}
     state.user = {}
     // 清空本地存储
     window.localStorage.clear()
   }
   ```

3. 在 `User.vue` 组件中通过 `mapMutations` 辅助函数，把 `cleanState` 映射到当前组件中：

   ```js
   methods: {
     // 映射需要的 mutations 方法
     ...mapMutations(['updateUserInfo', 'cleanState']),
   }
   ```

4. 在 `User.vue` 组件的 methods 中声明 `logout` 方法如下：

   ```js
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
   ```



### 10.5 跳转到编辑用户资料的页面

1. 在 `@/views/User` 目录下新建 `UserEdit.vue` 组件：

   ```vue
   <template>
     <div class="user-edit-container">
       <!-- Header 区域 -->
       <van-nav-bar title="编辑资料" left-arrow @click-left="$router.back()" fixed />
     </div>
   </template>
   
   <script>
   export default {
     name: 'UserEdit'
   }
   </script>
   
   <style lang="less" scoped>
   .user-edit-container {
     padding-top: 46px;
   }
   </style>
   ```

2. 在 `@/router/index.js` 路由模块中导入 `UserEdit.vue` 组件并声明对应的路由规则：

   ```js
   // 导入编辑用户信息的组件
   import UserEdit from '@/views/User/UserEdit.vue'
   
   const routes = [
     // 编辑用户信息的路由规则
     {
       path: '/user/edit',
       component: UserEdit,
       name: 'user-edit'
     }
   ]
   ```

3. 在 `User.vue` 组件中，为**编辑资料**对应的 `van-cell` 组件添加 `to` 属性绑定：

   ```xml
   <!-- 通过命名路由实现导航跳转 -->
   <van-cell icon="edit" title="编辑资料" is-link :to="{name: 'user-edit'}" />
   ```

   

### 10.6 渲染用户的基本资料

1. 在 `@/api/user.js` 模块中定义如下的 API 方法：

   ```js
   // 获取用户的简介信息
   export const getProfile = () => {
     return axios.get('/v1_0/user/profile')
   }
   ```

2. 在 `@/store/index.js` 模块中定义 `profile` 节点来存放用户的简介，并提供更新 `profile` 的 mutations 方法：

   ```js
   // 初始的 state 数据
   let initState = {
     // 登录成功之后的 token 信息
     tokenInfo: {},
     // 用户的基本信息
     user: {},
     // 用户的简介
     profile: {}
   }
   
   export default new Vuex.Store({
     state: initState,
     mutations: {
       // 更新用户的简介信息
       updateProfile(state, payload) {
         state.profile = payload
         this.commit('saveToStorage')
       },
       // 清空 state 中的关键数据
       cleanState(state) {
         state.tokenInfo = {}
         state.user = {}
         state.profile = {}
         // 清空本地存储
         window.localStorage.clear()
       }
     }
   })
   ```

3. 在 `UserEdit.vue` 组件中请求用户的简介信息：

   ```js
   // 1. 按需导入 API 和辅助函数
   import { getProfile } from '@/api/user'
   import { mapState, mapMutations } from 'vuex'
   
   export default {
     name: 'UserEdit',
     // 2. 页面首次被加载时请求用户的简介
     created() {
       this.getUserProfile()
     },
     computed: {
       // 2.1 映射数据
       ...mapState(['profile'])
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
       }
     }
   }
   ```

4. 渲染用户的基本资料：

   ```xml
   <template>
     <div class="user-edit-container">
       <!-- Header 区域 -->
       <van-nav-bar title="编辑资料" left-arrow @click-left="$router.back()" fixed />
   
       <!-- 用户资料 -->
       <van-cell-group class="action-card">
         <van-cell title="头像" is-link center>
           <template #default>
             <van-image round class="avatar" :src="profile.photo" />
           </template>
         </van-cell>
         <van-cell title="名称" is-link :value="profile.name" />
         <van-cell title="性别" is-link :value="profile.gender === 1 ? '男' : '女'" />
         <van-cell title="生日" is-link :value="profile.birthday" />
       </van-cell-group>
     </div>
   </template>
   ```

5. 美化样式：

   ```less
   .user-edit-container {
     padding-top: 46px;
     .avatar {
       width: 50px;
       height: 50px;
     }
   }
   ```

   

### 10.7 展示修改名称的对话框

1. 在 `data` 中声明如下的数据：

   ```js
   data() {
     return {
       // 是否展示修改用户名的对话框
       isShowNameDialog: false,
       // 名称
       username: ''
     }
   }
   ```

2. 渲染对话框的基本 DOM 结构：

   ```xml
   <!-- 修改用户名称的对话框 -->
   <van-dialog v-model="isShowNameDialog" title="修改名称" show-cancel-button :before-close="onNameDialogBeforeClose" @closed="username = ''">
     <!-- 输入框 -->
     <van-field v-model.trim="username" input-align="center" maxlength="7" placeholder="请输入名称" autofocus ref="unameRef" />
   </van-dialog>
   ```

3. 为**名称**对应的 `van-cell` 绑定 click 事件处理函数：

   ```xml
   <van-cell title="名称" is-link :value="profile.name" @click="showNameDialog" />
   ```

4. 定义 `showNameDialog` 方法：

   ```js
   // 展示修改名称的对话框
   showNameDialog() {
     // 显示修改之前的旧名称
     this.username = this.profile.name
     this.isShowNameDialog = true
     // 让对话框中的文本框自动获得焦点
     this.$nextTick(() => {
       this.$refs.unameRef.focus()
     })
   },
   ```

5. 定义对话框 `before-close` 时对应的处理函数：

   ```js
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
     done(false)
   }
   ```

   

### 10.8 发起请求修改名称

1. 在 `@/api/user.js` 模块下新增 API：

   ```js
   // 修改姓名，生日，性别都使用此接口，修改传参即可
   export const updateProfile = data => {
     return axios.patch('/v1_0/user/profile', data)
   }
   ```

2. 修改 `onNameDialogBeforeClose` 方法，预调用 `updateUserProfile` 方法：

   ```js
   import { getProfile, updateProfile } from '@/api/user'
   
   // 用户名对话框 - 关闭之前
   onNameDialogBeforeClose(action, done) {
     // 省略其它代码...
     
     // 3. TODO：发起请求修改名称
     this.updateUserProfile(
       { name: this.username },
       '名称被占用，请更换后重试！',
       done
     )
   }
   ```

3. 定义 `updateUserProfile` 方法如下：

   ```js
   // 更新用户简介的方法
   async updateUserProfile(data, errMsg, done) {
     try {
       // 3.1 发起请求，更新数据库
       const { data: res } = await updateProfile(data)
       if (res.message === 'OK') {
         // 重新请求用户的数据
         this.getUserProfile()
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
   }
   ```

   

### 10.9 修改生日

1. 在 `UserEdit.vue` 组件的 data 中定义如下的数据：

   ```js
   data() {
     // 是否展示选择出生日期的 ActionSheet
     isShowBirth: false,
     // 最小的可选的日期
     minDate: new Date(1900, 0, 1),
     // 最大的可选日期
     maxDate: new Date(2030, 10, 1),
     // 当前日期
     currentDate: new Date()
   }
   ```

2. 基于 `van-action-sheet` 和 `van-datetime-picker` 渲染修改生日的 DOM 结构：

   ```xml
   <!-- 修改时间 -->
   <van-action-sheet v-model="isShowBirth">
     <!-- 日期选择控件 -->
     <van-datetime-picker v-model="currentDate" type="date" title="选择出生日期" :min-date="minDate" :max-date="maxDate" :show-toolbar="true" @cancel="onPickerCancel" @confirm="onPickerConfirm" />
   </van-action-sheet>
   ```

3. 点击**生日**的 `van-cell` 展示日期选择控件：

   ```xml
   <van-cell title="生日" is-link :value="profile.birthday" @click="isShowBirth = true" />
   ```

4. 定义 `onPickerCancel` 和 `onPickerConfirm` 方法如下：

   ```js
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
   }
   ```

   

### 10.10 更新用户头像

> 借助于 file 文件选择框，实现更新用户头像的功能

1. 在 `@/api/user.js` 模块中定义如下的 API 接口：

   ```js
   // 更新用户的头像
   export const updateUserPhoto = fd => {
     return axios.patch('/v1_0/user/photo', fd)
   }
   ```

2. 在 `UserEdit.vue` 组件中按需导入 `updateUserPhoto` 的 API 方法：

   ```js
   import { getProfile, updateProfile, updateUserPhoto } from '@/api/user'
   ```

3. 在**头像**对应的 `van-cell` 组件中，添加隐藏的 `input:file` 文件选择框：

   ```xml
   <van-cell title="头像" is-link center>
     <template #default>
       <van-image round class="avatar" :src="profile.photo" @click="choosePhoto" />
       <!-- file 选择框 -->
       <input type="file" ref="iptFile" v-show="false" accept="image/*" @change="onFileChange" />
     </template>
   </van-cell>
   ```

4. 定义 `choosePhoto` 事件处理函数如下：

   ```js
   // 选择头像的照片
   choosePhoto() {
     // 模拟点击操作
     this.$refs.iptFile.click()
   },
   ```

5. 定义 `onFileChange` 事件处理函数如下：

   ```js
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
   ```

   

## 11. 小思同学



### 11.0 认识 websocket



#### 11.0.1 什么是 websocket

和 http 协议类似，websocket 也是是一个网络通信协议，是用来满足前后端数据通信的。



#### 11.0.2 websocket 相比于 HTTP 的优势

HTTP 协议：客户端与服务器建立通信连接之后，服务器端只能**被动地**响应客户端的请求，无法主动给客户端发送消息。

websocket 协议：客户端与服务器建立通信连接之后，服务器端可以主动给客户端推送消息了！！！



#### 11.0.3 websocket 主要的应用场景

需要服务端主动向客户端发送数据的场景，比如我们现在要做的**智能聊天**



#### 11.0.4 HTTP 协议和 websocket 协议对比图

![](data:image/png;base64,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)



### 11.1 渲染小思同学的页面

1. 在 `@/views/Chat` 目录下新建 `Chat.vue` 组件：

   ```vue
   <template>
     <div class="container">
       <!-- 固定导航 -->
       <van-nav-bar fixed left-arrow @click-left="$router.back()" title="小思同学"></van-nav-bar>
   
       <!-- 聊天主体区域 -->
       <div class="chat-list">
         <!-- 左侧是机器人小思 -->
         <div class="chat-item left">
           <van-image fit="cover" round src="https://img.yzcdn.cn/vant/cat.jpeg" />
           <div class="chat-pao">hi，你好！我是小思</div>
         </div>
   
         <!-- 右侧是当前用户 -->
         <div class="chat-item right">
           <div class="chat-pao">我是编程小王子</div>
           <van-image fit="cover" round src="https://img.yzcdn.cn/vant/cat.jpeg" />
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
   export default {
     name: 'Chat',
     data() {
       return {
         word: ''
       }
     },
     methods: {
       send() {
         if (!this.word) return
         console.log(this.word)
       }
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
   ```

2. 在 `@/router/index.js` 路由模块中，导入组件并声明小思聊天的路由规则：

   ```js
   // 导入小思同学的组件页面
   import Chat from '@/views/Chat/Chat.vue'
   
   const routes = [
     // 小思聊天的路由规则
     {
       path: '/chat',
       component: Chat,
       name: 'chat'
     }
   ]
   ```

3. 在 `@/views/User/User.vue` 组件中，为**小思同学**对应的 `van-cell` 组件添加 `to` 属性：

   ```xml
   <van-cell icon="chat-o" title="小思同学" is-link to="/chat" />
   ```

   

### 11.2 动态渲染聊天消息

1. 在 data 中声明 `list` 数组，用来存放机器人和用户的聊天消息内容：

   ```js
   data() {
     return {
       // 用户填写的内容
       word: '',
       // 所有的聊天消息
       list: [
         // 1. 只根据 name 属性，即可判断出这个消息应该渲染到左侧还是右侧
         { name: 'xs', msg: 'hi，你好！我是小思' },
         { name: 'me', msg: '我是编程小王子' }
       ]
     }
   },
   ```

2. 动态渲染聊天消息：

   ```xml
   <!-- 聊天主体区域 -->
   <div class="chat-list">
     <!-- 左侧是机器人小思 -->
     <div v-for="(item, index) in list" :key="index">
       <div class="chat-item left" v-if="item.name === 'xs'">
         <van-image fit="cover" round src="https://img.yzcdn.cn/vant/cat.jpeg" />
         <div class="chat-pao">{{item.msg}}</div>
       </div>
   
       <!-- 右侧是当前用户 -->
       <div class="chat-item right" v-else>
         <div class="chat-pao">{{item.msg}}</div>
         <van-image fit="cover" round src="https://img.yzcdn.cn/vant/cat.jpeg" />
       </div>
     </div>
   </div>
   ```

3. 动态渲染用户的头像：

   ```jsx
   // 1. 按需导入辅助函数
   import { mapState } from 'vuex'
   
   computed: {
     // 2. 把用户的信息，映射为当前组件的计算属性
     ...mapState(['profile'])
   }
   
   <!-- 3. 动态绑定用户头像 -->
   <van-image fit="cover" round :src="profile.photo || 'https://img.yzcdn.cn/vant/cat.jpeg'" />
   ```

4. 用户点击按钮，把消息存储到 `list` 数组中：

   ```js
   methods: {
     send() {
       // 1. 判断内容是否为空
       if (!this.word) return
       // 2. 添加聊天消息到 list 列表中
       this.list.push({
         name: 'me',
         msg: this.word
       })
       // 3. 清空文本框的内容
       this.word = ''
     }
   },
   ```

   

### 11.3 配置 websocket 客户端

1. 安装 websocket 客户端相关的包：

   ```bash
   npm i socket.io-client@4.0.0 -S
   
   # 如果 npm 无法成功安装 socket.io-client，可以尝试用 yarn 来装包
   ```

   参考官方文档进行使用：https://socket.io/docs/v4/client-initialization/

2. 在 `Chat.vue` 组件中，导入 `socket.io-client` 模块：

   ```js
   // 1.1 导入 socket.io-client 包
   import { io } from 'socket.io-client'
   
   // 1.2 定义变量，存储 websocket 实例
   let socket = null
   ```

3. 在 `Chat.vue` 组件的 created 生命周期函数中，创建 websocket 实例对象：

   ```js
   created() {
     // 2. 创建客户端 websocket 的实例
     socket = io('ws://www.liulongbin.top:9999')
   }
   ```

4. 在 `Chat.vue` 组件的 beforeDestroy 生命周期函数中，关闭 websocket 连接并销毁 websocket 实例对象：

   ```js
   // 组件被销毁之前，清空 sock 对象
   beforeDestroy() {
     // 关闭连接
     socket.close()
     
     // 销毁 websocket 实例对象
     socket = null
   },
   ```

5. 在 `created` 生命周期函数中，监听 websocket 实例对象的 `connect`、`message`、`disconnect` 事件：

   ```js
   created() {
     // 创建客户端 websocket 的实例
     socket = io('ws://www.liulongbin.top:9999')
   
     // 建立连接的事件
     socket.on('connect', () => {
       console.log('connect')
     })
   
     // 接收到消息的事件
     socket.on('message', msg => {
       // 把服务器发送过来的消息，存储到 list 数组中
       this.list.push({
         name: 'xs',
         msg
       })
     })
   
     // 关闭的事件
     socket.on('disconnect', () => {
       console.log('disconnect')
     })
   },
   ```

6. 在 `message` 事件中，把服务器发送到客户端的消息，存储到 `list` 数组中：

   ```js
   // 接收到消息的事件
   socket.on('message', msg => {
     // 把服务器发送过来的消息，存储到 list 数组中
     this.list.push({
       name: 'xs',
       msg
     })
   })
   ```

7. 客户端调用 `socket.emit('send', 消息内容)` 方法把消息发送给 websocket 服务器：

   ```js
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
     socket.emit('send', this.word)
   
     // 清空文本框的内容
     this.word = ''
   }
   ```

   

### 11.4 自动滚动到底部

> https://developer.mozilla.org/zh-CN/docs/web/api/element/scrollintoview

1. 在 `methods` 中声明 `scrollToBottom` 方法：

   ```js
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
   ```

2. 在 `Chat.vue` 组件中定义 `watch` 侦听器，监视 `list` 数组的变化，从而自动滚动到页面底部：

   ```js
   watch: {
     list() {
       // 监视到 list 数据变化后，等下次 DOM 更新完毕，再执行滚动到底部的操作
       this.$nextTick(() => {
         this.scrollToBottom()
       })
     }
   },
   ```



## 12. 页面权限控制



### 12.1 未登录不允许访问 User 页面

1. 在 `@/router/index.js` 模块中声明全局前置导航守卫：

   ```js
   // 导入 store 模块，方便拿到 store 中的数据
   import store from '@/store/index'
   
   // 导航守卫
   router.beforeEach((to, from, next) => {
     const tokenInfo = store.state.tokenInfo // {token, refresh_token}
     // 访问的是有权限的页面
     if (to.path === '/user') {
       if (!tokenInfo.token) {
         // token 的值不存在，强制跳转到登录页
         next('/login?pre=' + to.fullPath)
       } else {
         // token 的值存在，放行
         next()
       }
     } else {
       // 访问的是普通页面
       next()
     }
   })
   ```

2. 在 `Login.vue` 组件中，修改 `onSubmit` 方法如下：

   ```js
   async onSubmit() {
     const { data: res } = await login(this.formLogin)
     if (res.message === 'OK') {
       this.updateTokenInfo(res.data)
   
       // 1. 判断是否携带了 pre 参数
       if (this.$route.query.pre) {
         // 1.1 如果有，则跳转到指定页面
         this.$router.push(this.$route.query.pre)
       } else {
         // 1.2 如果没有，则跳转到 / 主页
         this.$router.push('/')
       }
     }
   }
   ```

   

### 12.2 登录状态下不允许访问登录页

在路由导航守卫中添加如下的判断条件：

```js
else if (to.path === '/login') {
  if (!tokenInfo.token) {
    next()
  } else {
    next(false)
  }
}
```



## 13. Token 过期处理

> 两种主流方案：
>
> 1. 只要发现 Token 过期，则强制用户跳转到登录页，并清空本地和 Store 中的关键数据！
> 2. 如果发现 Token 过期，则自动基于 refresh_token 无感知地请求一个新 Token 回来，在替换掉旧 Token 的同时，继续上次未完成的请求！



### 13.1 方案1：强制跳转到登录页

1. 在 `@/utils/request.js` 模块中，导入 Store 和 Router 模块：

   ```js
   import store from '@/store/index'
   import router from '@/router/index'
   ```

2. 在 axios 的 `instance` 实例上声明响应拦截器，如果身份认证失败，则强制用户跳转到登录页：

   ```js
   // 响应拦截器
   instance.interceptors.response.use(
     response => {
       // 响应成功
       return response
     },
     error => {
       // 响应失败时，处理未授权的情况：
       // 1. 判断是否为未授权（Token 过期）
       if (error.response && error.response.status === 401) {
         // 2. 清空 Store 中的关键数据
         store.commit('cleanState')
         // 3. 跳转到登录页
         router.push('/login?pre=' + router.currentRoute.fullPath)
       }
       return Promise.reject(error)
     }
   )
   ```

   

### 13.2 方案2：无感知刷新 Token

1. 在 `@/utils/request.js` 模块中，导入 Store 和 Router 模块：

   ```js
   import store from '@/store/index'
   import router from '@/router/index'
   ```

2. 在 axios 的 `instance` 实例上声明响应拦截器，如果身份认证失败，则根据 `refresh_token` 重新请求一个有效的新 Token 回来：

   ```js
   // 响应拦截器
   instance.interceptors.response.use(
     response => {
       return response
     },
     async error => {
       // 1. 从 vuex 中获取 token 对象
       const tokenInfo = store.state.tokenInfo
       // 2. 判断是否为未授权（Token 过期）
       if (error.response && error.response.status === 401 && tokenInfo.token) {
         try {
           // 3.1 TODO: 发起请求，根据 refresh_token 重新请求一个有效的新 token
           // 3.2 TODO: 更新 Store 中的 Token
           // 3.3 基于上次未完成的配置，重新发起请求
           return instance(error.config)
         } catch {
           // 4. 证明 refresh_token 也失效了：
           // 4.1 则清空 Store 中的关键数据
           store.commit('cleanState')
           // 4.2 并强制跳转到登录页
           router.push({
             path: '/login?pre=' + router.currentRoute.fullPath
           })
         }
       }
       return Promise.reject(error)
     }
   )
   ```

3. 发起请求，根据 `refresh_token` 重新请求一个有效的新 token：

   ```js
   const { data: res } = await axios({
     method: 'PUT',
     url: 'http://toutiao-app.itheima.net/v1_0/authorizations',
     headers: {
       Authorization: `Bearer ${tokenInfo.refresh_token}`
     }
   })
   ```

4. 更新 Store 中的 Token：

   ```js
   store.commit('updateTokenInfo', {
     refresh_token: tokenInfo.refresh_token,
     token: res.data.token
   })
   ```



## 14. 项目优化



### 14.1 保持组件的状态

> 结合 vue 内置的 keep-alive 组件，可以实现组件的状态保持。
>
> 官方文档地址：https://cn.vuejs.org/v2/api/#keep-alive



#### 14.1.1 实现 Layout 组件的状态保持

1. 在 `App.vue` 组件中，在 `<router-view>` 路由占位符之外包裹一层 `<keep-alive>` 组件，从而实现 Layout 组件的状态保持：

   ```xml
   <template>
     <div>
       <!-- 路由占位符 -->
       <keep-alive>
         <router-view></router-view>
       </keep-alive>
     </div>
   </template>
   ```

2. 通过步骤 1，的确实现了 Layout 组件的状态保持。但是随之而来的：详情页也被缓存了，导致了文章数据不会动态刷新的问题。

3. 可以通过 `<keep-alive>` 组件提供的 `include` 属性，来有条件的缓存组件：

   ```xml
   <template>
     <div>
       <!-- 路由占位符 -->
       <keep-alive include="Layout">
         <router-view></router-view>
       </keep-alive>
     </div>
   </template>
   ```

   

#### 14.1.2 实现 Home 组件的状态保持

> 点击 tabBar 实现 Home 页面和 User 页面切换展示的时候，发现 Home 组件的状态每次都会被刷新

1. 在 `Layout.vue` 组件中，在 `<router-view>` 路由占位符之外包裹一层 `<keep-alive>` 组件，从而实现 Home 组件的状态保持：

   ```xml
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
   ```

2. 通过步骤 1，的确实现了 Home 组件的状态保持。但是随之而来的，`User.vue` 组件也被缓存了，导致修改用户头像后，头像不刷新的问题。

3. 可以在被缓存的 `User.vue` 组件中，声明 `activated` 和 `deactivated` 声明周期函数，来监听组件**被激活**和**被缓存**的状态变化：

   ```js
   created() {
     // 把下面这一行注释掉，因为 activated 在组件首次加载时也会调用一次
     // this.initUserInfo()
   },
   
   // 被激活了
   activated() {
     // 只要组件被激活了，就重新初始化用户的信息
     this.initUserInfo()
   },
   // 被缓存了
   deactivated() {
     console.log('被缓存了')
   },
   ```



#### 14.1.3 实现 SearchResult 组件的状态保持

1. 在 `App.vue` 组件中，为 `<keep-alive>` 组件添加要缓存的组件名称：

   ```xml
   <template>
     <div>
       <!-- 路由占位符 -->
       <keep-alive include="Layout,SearchResult">
         <router-view></router-view>
       </keep-alive>
     </div>
   </template>
   ```

2. 在 `SearchResult.vue` 组件的 data 中声明 `preKw` 节点，用来缓存上次的搜索关键词：

   ```js
   data() {
     return {
       // 缓存的搜索关键词
       preKw: ''
     }
   }
   ```

3. 在 `SearchResult.vue` 组件中定义 `activated` 和 `deactivated` 声明周期如下：

   ```js
   // 组件被激活
   activated() {
     // 如果上一次的 kw 不为空，且这次的 kw 和上次缓存的 kw 值不同，则需要重新请求列表数据
     if (this.preKw !== '' && this.kw !== this.preKw) {
       // 1. 重置数据
       this.page = 1
       this.searchResult = []
       this.loading = false
       this.finished = false
   
       // 2. 重新请求列表数据
       this.onLoad()
     }
   },
   
   // 组件被缓存
   deactivated() {
     // 组件被缓存时，将搜索关键词保存到 data 中
     this.preKw = this.kw
   },
   ```

   



### 14.2 详情页代码高亮

> 基于 highlight.js 美化详情页的代码片段

1. 运行如下的命令，在项目中安装 `highlight.js`：

   ```bash
   npm i highlight.js@10.6.0 -S
   ```

2. 在 `index.html` 页面的 `<head>` 标签中引入 `highlight.js` 的样式表：

   ```xml
   <link rel="stylesheet" href="https://cdn.staticfile.org/highlight.js/10.6.0/styles/default.min.css" />
   ```

3. 在 `ArticleDetail.vue` 组件中导入 `highlight.js` 模块：

   ```js
   // 导入 highlight.js 模块
   import hljs from 'highlight.js'
   ```

4. 在 `ArticleDetail.vue` 组件的 `updated` 声明周期函数中，对位置内容进行高亮处理：

   ```js
   // 1. 当组件的 DOM 更新完毕之后
   updated() {
     // 2. 判断是否有文章的内容
     if (this.article.content) {
       // 3. 对文章的内容进行高亮处理
       hljs.highlightAll()
     }
   },
   ```



### 14.3 添加文章加载的 loading 效果

1. 在 `ArticleDetail.vue` 组件中，在**文章信息区域**和**文章评论组件**之外包裹一个 div 元素：

   ```xml
   <template>
     <div>
       <!-- Header 区域 -->
       <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />
   
       <div v-if="article.title">
         <!-- 文章信息区域 -->
         <!-- 文章评论组件 -->
       </div>
   
       <van-loading size="24px" vertical v-else class="loading">文章加载中...</van-loading>
     </div>
   </template>
   ```

2. 添加 `loading` 样式：

   ```less
   .loading {
     margin-top: 50px;
   }
   ```

   

## 15. 打包发布



### 15.1 初步打包发布

1. 在终端下运行如下的打包命令：

   ```bash
   npm run build
   ```

2. 基于 `Node + Express` 手写一个 web 服务器，对外托管 web 项目：

   ```js
   // app.js
   
   // 导入 express 模块
   const express = require('express')
   // 创建 express 的服务器实例
   const app = express()
   
   // 1. 将 dist 目录托管为静态资源服务器
   app.use(express.static('./dist'))
   
   // 调用 app.listen 方法，指定端口号并启动web服务器
   app.listen(3001, function () {
     console.log('Express server running at http://127.0.0.1:3001')
   })
   
   ```



### 15.2 优化网络传输时的文件体积

> 基于 Express 的 express-compression 中间件，可以在服务器端对文件进行压缩。
>
> 压缩后文件网络传输的体积会大幅变小，客户端在接收到压缩的文件后会自动进行解压。

1. 在终端下运行如下的命令：

   ```bash
   npm i express-compression -S
   ```

2. 在 `app.js` 中导入并使用网络传输压缩的中间件：

   ```js
   // 导入 express 模块
   const express = require('express')
   // 创建 express 的服务器实例
   const app = express()
   
   // 2. 安装并配置网络传输压缩的中间件
   //    注意：必须在托管静态资源配置此中间件
   const compression = require('express-compression')
   app.use(compression())
   
   // 1. 将 dist 目录托管为静态资源服务器
   app.use(express.static('./dist'))
   
   // 调用 app.listen 方法，指定端口号并启动web服务器
   app.listen(3001, function () {
     console.log('Express server running at http://127.0.0.1:3001')
   })
   ```

3. 最终的效果截图：

   ![](data:image/png;base64,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)



### 15.3 移除代码中所有的 console

1. 运行如下的命令，安装 Babel 插件：

   ```bash
   npm install babel-plugin-transform-remove-console --save-dev
   ```

2. 在 `babel.config.js` 中新增如下的 `plugins` 数组节点：

   ```js
   module.exports = {
     presets: ['@vue/cli-plugin-babel/preset'],
     // 配置移除 console 的插件
     plugins: ['transform-remove-console']
   }
   ```

3. 重新运行打包的命令：

   ```bash
   npm run build
   ```



### 15.4 生成打包报告

1. 打开 `package.json` 配置文件，为 `scripts` 节点下的 `build` 命令添加 `--report` 参数：

   ```json
   {
     "scripts": {
       "serve": "vue-cli-service serve",
       "build": "vue-cli-service build --report",
       "lint": "vue-cli-service lint"
     }
   }
   ```

2. 重新运行打包的命令：

   ```bash
   npm run build
   ```

3. 打包完成后，发现在 `dist` 目录下多了一个名为 `report.html` 的文件。在浏览器中打开此文件，会看到详细的打包报告。



### 15.5 基于 externals 优化打包的体积

> 未配置 `externals` 之前，项目中使用 `import` 导入的第三方模块，在最终打包时，会被打包合并到一个 js 文件中。最后导致项目体积过大的问题。

> 配置了 `externals` 之后，webpack 在进行打包时，会把 `externals` 节点下声明的第三方包排除在外。因此最终打包生成的 js 文件中，不会包含 `externals` 节点下的包。这样就优化了打包后项目的体积。

1. 在项目根目录下找到 `vue.config.js` 配置文件，在里面新增 `configureWebpack` 节点如下：

   ```js
   module.exports = {
     // 省略其它代码...
   
     // 增强 vue-cli 的 webpack 配置项
     configureWebpack: {
       // 打包优化
       externals: {
         // import 时的包名称: window 全局的成员名称
         'highlight.js': 'hljs'
       }
     }
   }
   ```

2. 打开 `public` 目录下的 `index.html` 文件，在 `body` 结束标签之前，新增如下的资源引用：

   ```html
   <!DOCTYPE html>
   <html lang="">
   
   <head>
     <meta charset="utf-8">
     <meta http-equiv="X-UA-Compatible" content="IE=edge">
     <meta name="viewport"
       content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
     <link rel="icon" href="<%= BASE_URL %>favicon.ico">
     <title>
       <%= htmlWebpackPlugin.options.title %>
     </title>
     <!-- 1. 引用 highlight.js 的样式表 -->
     <link rel="stylesheet" href="https://cdn.staticfile.org/highlight.js/10.6.0/styles/default.min.css" />
   </head>
   
   <body>
     <noscript>
       <strong>We're sorry but <%= htmlWebpackPlugin.options.title %> doesn't work properly without JavaScript enabled.
           Please enable it to continue.</strong>
     </noscript>
     <div id="app"></div>
   
     <!-- 2. 为 window 对象全局挂载 hljs 成员 -->
     <script src="https://cdn.staticfile.org/highlight.js/10.6.0/highlight.min.js"></script>
   </body>
   
   </html>
   ```

3. 重新运行打包发布的命令，对比配置 `externals` 前后文件的体积变化。



### 15.6 完整的 externals 配置项

1. 在 `vue.config.js` 配置文件中，找到 `configureWebpack` 下的 `externals`，添加如下的配置项：

   ```js
   // 增强 vue-cli 的 webpack 配置项
   configureWebpack: {
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
   ```

2. 在 `/public/index.html` 文件的 `<head>` 结束标签之前，添加如下的样式引用：

   ```html
   <!-- heightlight.js 的样式 -->
   <link rel="stylesheet" href="https://cdn.staticfile.org/highlight.js/10.6.0/styles/default.min.css" />
   <!-- vant 的图标样式 -->
   <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vant@2.12.7/lib/icon/local.css" />
   ```

3. 在 `/public/index.html` 文件的 `<body>` 结束标签之前，添加如下的 js 引用：

   ```html
   <script src="https://cdn.staticfile.org/highlight.js/10.6.0/highlight.min.js"></script>
   <script src="https://cdn.staticfile.org/vue/2.6.11/vue.min.js"></script>
   <script src="https://cdn.staticfile.org/vue-router/3.2.0/vue-router.min.js"></script>
   <script src="https://cdn.staticfile.org/vuex/3.6.2/vuex.min.js"></script>
   <script src="https://cdn.staticfile.org/axios/0.21.1/axios.min.js"></script>
   <script src="https://cdn.jsdelivr.net/npm/vant@2.12.7/lib/vant.min.js"></script>
   <script src="https://cdn.staticfile.org/socket.io/4.0.0/socket.io.min.js"></script>
   <script src="https://cdn.staticfile.org/dayjs/1.10.4/dayjs.min.js"></script>
   <script src="https://cdn.staticfile.org/bignumber.js/9.0.1/bignumber.min.js"></script>
   ```

   

### 15.7 只在生产阶段对项目进行打包优化

> 1. 在 development 开发阶段的需求是：急速的打包生成体验、不需要移除 console、也不需要对打包的体积进行优化
>
> 2. 在 production 生产阶段的需求是：移除 console、基于 externals 对打包的体积进行优化
>
>    
>
> 3. 问题：如何判断当前打包期间的运行模式？
>
>    // 获取当前编译的环境 development 或 production
>
>    const env = process.env.NODE_ENV

1. 在 `babel.config.js` 配置文件中，先获取到当前打包的模式，再决定是否使用`移除 console` 的 Babel 插件：

   ```js
   // 1. 获取当前编译的环境 development 或 production
   const env = process.env.NODE_ENV
   // 2. 当前是否处于发布模式
   const isProd = env === 'production' ? true : false
   
   // 3.1 插件的数组
   const plugins = []
   // 3.2 判断是否处于发布模式
   if (isProd) {
     plugins.push('transform-remove-console')
   }
   
   module.exports = {
     presets: ['@vue/cli-plugin-babel/preset'],
     // 4. 动态的向外导出插件的数组
     plugins
   }
   ```

2. 在 `vue.config.js` 配置文件中，先获取到当前打包的模式，再决定是否开启 `externals` 特性：

   ```js
   // 1. 获取当前编译的环境 development 或 production
   const env = process.env.NODE_ENV
   // 2. 当前是否处于发布模式
   const isProd = env === 'production' ? true : false
   
   // 3. 自定义的 webpack 配置项
   const customWebpackConfig = {
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
     // 省略其它配置节点...
     
     // 4. 增强 vue-cli 的 webpack 配置项
     configureWebpack: isProd ? customWebpackConfig : {},
   }
   ```



### 15.8 在 index.html 中按需引入 css 和 js

> 由于 externals 节点是按需生效的。为了与之匹配，index.html 页面中的 css 样式和 js 脚本也要按需进行引入。
>
> 问题：在 index.html 页面中，如何判断当前的打包模式呢？
>
> 答案：可以对 html-webpack-plugin 插件进行自定义配置，从而支持在 index.html 页面中获取到当前的打包模式。

1. 在 `vue.config.js` 中新增 `chainWebpack` 节点，可以**对 webpack 已有的配置进行修改**：

   ```js
   module.exports = {
     // 省略其它配置节点...
     
     // 对 webpack 已有的配置进行修改
     chainWebpack: config => { /* 在这个函数中对 webpack 已有的配置进行修改 */ }
   }
   ```

   具体代码示例如下：

   ```js
   module.exports = {
     // 省略其它配置节点...
     
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
   ```

2. 在 `index.html` 中，根据 `html-webpack-plugin` 插件提供的 `<% %>` 模板语法，按需渲染 link 和 script 标签：

   ```html
   <% if (htmlWebpackPlugin.options.isProd) { %>
     <!-- heightlight.js 的样式 -->
     <link rel="stylesheet" href="https://cdn.staticfile.org/highlight.js/10.6.0/styles/default.min.css" />
     <!-- vant 的图标样式 -->
     <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vant@2.12.7/lib/icon/local.css" />
   <% } %>
   
   <% if (htmlWebpackPlugin.options.isProd) { %>
     <!-- 为 window 对象全局挂载 hljs 成员 -->
     <script src="https://cdn.staticfile.org/highlight.js/10.6.0/highlight.min.js"></script>
     <script src="https://cdn.staticfile.org/vue/2.6.11/vue.min.js"></script>
     <script src="https://cdn.staticfile.org/vue-router/3.2.0/vue-router.min.js"></script>
     <script src="https://cdn.staticfile.org/vuex/3.6.2/vuex.min.js"></script>
     <script src="https://cdn.staticfile.org/axios/0.21.1/axios.min.js"></script>
     <script src="https://cdn.jsdelivr.net/npm/vant@2.12.7/lib/vant.min.js"></script>
     <script src="https://cdn.staticfile.org/socket.io/4.0.0/socket.io.min.js"></script>
     <script src="https://cdn.staticfile.org/dayjs/1.10.4/dayjs.min.js"></script>
     <script src="https://cdn.staticfile.org/bignumber.js/9.0.1/bignumber.min.js"></script>
   <% } %>
   ```

   
