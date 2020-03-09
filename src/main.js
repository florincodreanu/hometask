import Vue from 'vue';
import App from './App.vue';
import { VLazyImagePlugin } from "v-lazy-image";
import "typeface-nunito-sans";
import '@/assets/site.css';
import infiniteScroll from 'vue-infinite-scroll';
Vue.config.productionTip = false;
Vue.use(infiniteScroll);
Vue.use(VLazyImagePlugin);
new Vue({
  render: h => h(App),
}).$mount('#app');
