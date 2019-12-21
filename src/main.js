import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.min.css';
import "babel-polyfill";

Vue.use(ElementUI, { size: 'small' });
Vue.prototype.$axios = axios;

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
