import Vue from 'vue';
import Router from 'vue-router';
import system from '@/router/modules/system';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/',
            component: () => import('components/common/Home.vue'),
            meta: { title: '首页' },
            children: [
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ 'components/page/sys/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ 'components/page/sys/403.vue'),
                    meta: { title: '403' }
                },
                {
                    path: '/302',
                    component: () => import(/* webpackChunkName: "403" */ 'components/page/sys/302.vue'),
                    meta: { title: '302' }
                },
                ...system
            ]
        },
        {
            path: '/login',
            component: () => import('components/page/sys/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '/register',
            component: () => import('components/page/sys/Register.vue'),
            meta: { title: '注册' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
