import Main from '../views/index.vue'
import Abstract from '../views/layout/abstract.vue'
import Home from '../views/home/home.vue'
import Login from '../views/login.vue'
import Profile from '../views/profile/profile.vue'
import Table from '../views/table/table.vue'

export const loginRouter = {
  path: '/login',
  name: 'login',
  meta: {
    title: '登录'
  },
  component: Login
}

export const profileRouter = {
  title: '个人设置',
  path: '/profile',
  name: 'profile',
  meta: {
    hidden: true,
    auth: ['ROLE_USER']
  },
  component: Profile
}

export const appRouter = [
  {
    title: '首页',
    path: '/home',
    name: 'home',
    icon: 'ios-home',
    component: Home
  },
  {
    title: '个人设置',
    path: '/profile',
    name: 'profile',
    meta: {
      hidden: true, // set it invisible on sidebar
      auth: ['ROLE_USER']
    },
    component: Profile
  },
  {
    title: '内容管理',
    path: '/content',
    name: 'content',
    icon: 'ios-paper',
    component: Abstract,
    meta: {
      auth: ['ROLE_ADMIN']
    },
    children: [
      {
        title: '文章管理',
        name: 'article',
        path: 'article',
        icon: 'ios-paper',
        component: Login
      },
      {
        title: '评论管理',
        name: 'comment',
        path: 'comment',
        icon: 'images',
        component: Table
      },
      {
        title: '举报管理',
        name: 'report',
        path: 'report',
        icon: 'images',
        component: Table
      }
    ]

  },
  {
    title: '用户管理',
    path: '/user',
    name: 'user',
    icon: 'ios-people',
    component: Abstract,
    children: [
      {
        title: '新增用户',
        name: 'usr_new',
        path: 'new',
        icon: 'ios-paper',
        component: Login,
        meta: {
          auth: ['ROLE_USER']
        }
      },
      {
        title: '活跃用户',
        name: 'usr_activated',
        path: 'activated',
        icon: 'images',
        component: Table
      }
    ]
  },
  {
    title: '统计分析',
    path: '/statistics',
    name: 'statistics',
    icon: 'stats-bars',
    component: Abstract,
    children: [
      {
        title: '新增和启动',
        name: 'stats_new',
        path: 'new',
        icon: 'ios-paper',
        component: Login
      },
      {
        title: '活跃分析',
        name: 'stats_activated',
        path: 'activated',
        icon: 'images',
        component: Table
      },
      {
        title: '时段分析',
        name: 'stats_time',
        path: 'time',
        icon: 'images',
        component: Table
      },
      {
        title: '用户留存',
        name: 'retention',
        path: 'retention',
        icon: 'images',
        component: Table
      },
      {
        title: '流失用户',
        name: 'churn',
        path: 'churn',
        icon: 'images',
        component: Table
      }
    ]

  }

]

export const mainRouter = {
  path: '/',
  redirect: '/home',
  name: 'index',
  component: Main,
  children: appRouter
}

export const routers = [
  loginRouter,
  mainRouter,
  // catch all redirect
  {path: '*', redirect: '/home'}

]

