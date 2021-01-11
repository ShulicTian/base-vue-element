import Vue from 'vue';
import Vuex from 'vuex';
import system from './modules/system';

Vue.use(Vuex);

const modules = { system };

export default new Vuex.Store({
    plugins: [],
    state: {
        direction: 'slide-fade', // 页面切换方向
        sysName: '运营支撑管理平台2.0'
    },
    getters: {
        userData(state, getters) {
            return state.system.user;
            // return getters['user/user']
        }
        // vuex 全局getters引入局部
        // token () {
        //   return this.$store.getters['interview/token']
        // }
    },
    mutations: {
        // 更新页面切换方向
        updateDirection(state, direction) {
            state.direction = direction;
        }
    },
    actions: {
    },
    modules
});
