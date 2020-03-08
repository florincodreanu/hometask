import Vue from 'vue'
import App from './App.vue'
import "typeface-nunito-sans"
import 'ionicons/dist/css/ionicons.css';
import '@/assets/site.css';
import infiniteScroll from 'vue-infinite-scroll';
Vue.config.productionTip = false
Vue.config.ignoredElements = ['ion-icon'];
Vue.use(infiniteScroll)
new Vue({
  render: h => h(App),
}).$mount('#app')
