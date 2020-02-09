import Vue from 'vue'
import Router from 'vue-router'
import WebSite from '@/components/WebSite'
import video from '@/components/video'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'WebSite',
      component: WebSite
    }
  ]
})
