import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import store from './store';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import 'babel-polyfill';
import CommonUtils from 'utils/CommonUtils';

Vue.config.productionTip = false;
Vue.use(ElementUI, {
    size: 'small'
});
Vue.prototype.$CommonUtils = CommonUtils;

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    document.title = `考试运营管理服务平台 | ${to.meta.title}`;
    const user = store.state.system.user;
    if (!user && to.path !== '/login') {
        if (to.path == '/register') {
            next();
        } else {
            next('/login');
        }
    } else if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        next();
    } else {
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        } else {
            next();
        }
    }
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
