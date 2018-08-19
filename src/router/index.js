import Vue from 'vue'
import Router from 'vue-router'
import Login from 'views/Login'
import Home from 'views/Home'
import PostList from 'views/PostList'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
      hidden: true
    },
    {
      path: '/',
      component: Home,
      name: '用户管理',
      iconCls: 'iconfont icon-user', // 图标样式class
      children: [
        {path: '/add_user', component: PostList, name: '添加用户'},
        {path: '/edit_user/:id', component: PostList, hidden: true},
        {path: '/users', component: PostList, name: '用户列表'}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '文章管理',
      iconCls: 'iconfont icon-book', // 图标样式class
      children: [
        {path: '/add_post', component: PostList, name: '添加文章'},
        {path: '/edit_post/:id', component: PostList, hidden: true},
        {path: '/post', component: PostList, name: '文章列表'}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '分类管理',
      iconCls: 'iconfont icon-daohangfenlei', // 图标样式class
      children: [
        {path: '/add_cate', component: PostList, name: '添加分类'},
        {path: '/edit_cate/:id', component: PostList, hidden: true},
        {path: '/cates', component: PostList, name: '分类列表'}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '标签管理',
      iconCls: 'iconfont icon-tag', // 图标样式class
      children: [
        {path: '/add_tag', component: PostList, name: '添加标签'},
        {path: '/edit_tag/:id', component: PostList, hidden: true},
        {path: '/tags', component: PostList, name: '标签列表'}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '图片管理',
      iconCls: 'iconfont icon-image', // 图标样式class
      children: [
        {path: '/upload', component: PostList, name: '上传图片'},
        {path: '/edit_image/:id', component: PostList, hidden: true},
        {path: '/images', component: PostList, name: '图片列表'}
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    sessionStorage.removeItem('user')
  }
  let user = JSON.parse(sessionStorage.getItem('user'))
  if (!user && to.path !== '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
})

export default router
