import Vue from 'vue'
import Router from 'vue-router'
const home = resolve => require(['@/components/Main'], resolve)//主体
const HelloWorld = resolve => require(['@/components/HelloWorld'], resolve)//主页
Vue.use(Router)

export default new Router({
  mode: 'history',//（使用history模式）
  routes: [
    {
      path: '/',
      redirect: '/HelloWorld',
      // component: index,
    },
    {
      path: '/home',
      name: 'home',
      component: home,
      children: [
        {
          path: '/HelloWorld',
          name: 'HelloWorld',
          component: HelloWorld,
          meta: {
              title: '欢迎',
              keepAlive: false // false不需要被缓存，true 需要被缓存，开启缓存需要注意keep-alive的周期函数
          }
        },
      ]
    }
  ]
})
