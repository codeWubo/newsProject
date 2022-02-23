import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index'

// 导入组件
// import Login from '@/views/Login/Login.vue'
const Login = () => import('@/views/Login/Login.vue')
// import Layout from '@/views/Layout/Layout.vue'
const Layout = () => import('@/views/Layout/Layout.vue')

// import Home from '@/views/Home/Home.vue'
const Home = () => import('@/views/Home/Home.vue')
// import User from '@/views/User/User.vue'
const User = () => import('@/views/User/User.vue')

// 搜索相关的组件
// import Search from '@/views/Search/Search.vue'
const Search = () => import('@/views/Search/Search.vue')
// import SearchResult from '@/views/Search/SearchResult.vue'
const SearchResult = () => import('@/views/Search/SearchResult.vue')

// 导入文章详情页
// import ArticleDetail from '@/views/ArticleDetail/ArticleDetail.vue'
const ArticleDetail = () => import('@/views/ArticleDetail/ArticleDetail.vue')

// 导入编辑用户信息的组件
// import UserEdit from '@/views/User/UserEdit.vue'
const UserEdit = () => import('@/views/User/UserEdit.vue')

// 导入小思同学的组件页面
// import Chat from '@/views/Chat/Chat.vue'
const Chat = () => import('@/views/Chat/Chat.vue')

Vue.use(VueRouter)

const routes = [
  // 登录组件的路由规则
  { path: '/login', component: Login, name: 'login' },
  {
    path: '/',
    component: Layout,
    children: [
      // 默认子路由
      { path: '', component: Home, name: 'home' },
      { path: '/user', component: User, name: 'user' }
    ]
  },
  // 搜索组件的路由规则
  { path: '/search', component: Search, name: 'search' },
  // 搜索结果组件的路由规则
  {
    path: '/search/:kw',
    component: SearchResult,
    name: 'search-result',
    props: true
  },
  // 文章详情页的路由规则
  {
    path: '/article/:artId',
    component: ArticleDetail,
    name: 'article-detail',
    props: true
  },
  // 编辑用户信息的路由规则
  {
    path: '/user/edit',
    component: UserEdit,
    name: 'user-edit'
  },
  // 小思聊天的路由规则
  {
    path: '/chat',
    component: Chat,
    name: 'chat'
  }
]

const router = new VueRouter({
  routes
})

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
  } else if (to.path === '/login') {
    if (!tokenInfo.token) {
      next()
    } else {
      next(false)
    }
  } else {
    // 访问的是普通页面
    next()
  }
})

export default router
