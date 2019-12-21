import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            redirect: '/homepage'
        },
        {
            path: '/homepage',
            component: resolve => require(['../components/page/Homepage.vue'], resolve)
        }
    ]
})
