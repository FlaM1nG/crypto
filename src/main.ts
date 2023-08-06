import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import './index.css';
import router from './router'
import filters from './utils/filter';
import Chartkick from 'vue-chartkick';
import Chart from 'chart.js';
import { createStore } from 'vuex';
import assets, { setRouter } from './store/assets';
import asset from './store/asset';

const store = createStore({
    modules: {
      assets,
      asset,
    },
  });

const app = createApp(App).use(router).use(Chartkick.use(Chart)).use(store)
app.config.globalProperties.$filters = filters

// Pass the instance from the router to the store
setRouter(router);

app.mount('#app');