import Vue from 'vue';
import Vuex from 'vuex';
import system from './modules/system';
import file from './modules/file';

Vue.use(Vuex);

const modules = {
    system,
    file
};

export default new Vuex.Store({
    plugins: [],
    state: {
        direction: 'slide-fade', // 页面切换方向
        sysName: '考试运营管理服务平台'
    },
    getters: {
        userData(state, getters) {
            return state.system.user;
            // return getters['user/user']
        },
        getSysName(state) {
            return state.sysName;
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
    actions: {},
    modules
});
