import axios from 'axios';
import store from '../store';
import router from '../router';
import { Message, Loading } from 'element-ui';

const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    // easy-mock服务挂了，暂时不使用了
    // baseURL: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
    timeout: 60000
});
let loadingObj = '';
const closeLoading = () => {
    if (loadingObj) {
        loadingObj.close();
    }
};
service.interceptors.request.use(
    config => {
        if (store.state.system.token) {
            config.headers.authToken = store.state.system.token;
        }
        if (config.params == undefined) {
            config.params = {};
        }
        config.params.menuName = store.state.system.menuName;
        if (config.data && !config.data['unloading']) {
            closeLoading();
            loadingObj = Loading.service({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.5)',
                target: store.state.system.loading
            });
        }
        return config;
    },
    error => {
        closeLoading();
        return Promise.reject();
    }
);

service.interceptors.response.use(
    response => {
        closeLoading();
        if (response.status && response.status === 200) {
            return response.data;
        } else {
            Promise.reject();
        }
    },
    error => {
        console.log(error);
        closeLoading();
        if (error.response.status == 401) {
            store.commit('system/cleanCache');
            if (router.currentRoute.fullPath != '/login') {
                router.push('/login').then(() => {
                    Message({
                        message: '登录失效',
                        type: 'error'
                    });
                });
            }
        } else if (error.response.status == 302) {
            router.push({ path: '/302', query: { message: error.response.data.msg } });
        }
        return Promise.reject();
    }
);

export default service;
