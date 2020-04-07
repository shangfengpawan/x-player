import Vue from 'vue'
import Router from 'vue-router'
import WebSite from '@/components/WebSite'
import PlayVideo from '@/components/PlayVideo'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'WebSite',
      component: WebSite
    },
      {
          path: '/play',
          name: 'PlayVideo',
          component: PlayVideo
      }
  ]
})
