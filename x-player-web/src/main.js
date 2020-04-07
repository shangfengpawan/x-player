// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';
import '@/assets/iconfont.css';
import 'muse-ui-loading/dist/muse-ui-loading.css'; // load css
import Loading from 'muse-ui-loading';

import 'muse-ui-message/dist/muse-ui-message.css';
import Message from 'muse-ui-message';

import App from './App'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
axios.defaults.withCredentials=true;
Vue.use(MuseUI);
Vue.use(Loading);
Vue.use(Message);
Vue.use(VueAxios,axios);
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
