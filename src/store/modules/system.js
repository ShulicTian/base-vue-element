import { login, getMenuList, menuList, roleAllList, areaList, getUserNameById, dictAllList } from 'api/system';
import { Message } from 'element-ui';

export default {
    namespaced: true,
    state: {
        token: localStorage.getItem('auth_token') || '',
        user: JSON.parse(localStorage.getItem('user_data')) || null,
        menuList: JSON.parse(localStorage.getItem('menu_list')) || null,
        allMenuList: [],
        allRoleList: [],
        allAreaList: [],
        allDictList: JSON.parse(localStorage.getItem('dict_list')) || null,
        userNameList: [],
        loading: false,
        menuName: ''
    },
    mutations: {
        setMenuName(state, data) {
            state.menuName = data;
        },
        setUserName(state, data) {
            if (!state.userNameList[data.id]) {
                if (data.name) {
                    state.userNameList[data.id] = data.name;
                }
            }
        },
        setLoading(state, data) {
            state.loading = data;
        },
        setUser(state, data) {
            const userDate = data;
            state.user = data;
            if (data) {
                state.token = data.token;
                localStorage.setItem('auth_token', data.token);
            }
            localStorage.setItem('user_data', JSON.stringify(userDate));
        },
        setMenuList(state, data) {
            state.menuList = data;
            localStorage.setItem('menu_list', JSON.stringify(data));
        },
        setAllMenuList(state, data) {
            state.allMenuList = data;
        },
        setAllRoleList(state, data) {
            state.allRoleList = data;
        },
        setAllAreaList(state, data) {
            state.allAreaList = data;
        },
        setAllDictList(state, data) {
            state.allDictList = data;
            localStorage.setItem('dict_list', JSON.stringify(data));
        },
        cleanCache(state) {
            state.token = null;
            state.user = null;
            state.menuList = null;
            state.allDictList = null;
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            localStorage.removeItem('menu_list');
            localStorage.removeItem('dict_list');
        },
        cleanDict(state) {
            state.allDictList = null;
            localStorage.removeItem('dict_list');
        }
    },
    actions: {
        async login(state, data) {
            let flag = false;
            await login(data).then(ret => {
                if (ret.code == 1) {
                    Message({ message: '登录成功', type: 'success' });
                    state.commit('setUser', ret.result);
                    flag = true;
                } else {
                    Message({ message: ret.msg, type: 'error' });
                }
            }).catch(err => {
                console.log(err);
                Message({ message: '登入异常', type: 'error' });
            });
            return flag;
        },
        async loadMenu(state) {
            let menuList = state.state.menuList;
            if (!menuList) {
                await getMenuList().then(ret => {
                    if (ret.code == 1) {
                        menuList = ret.result;
                        let func = function(list) {
                            for (let ind = list.length - 1; ind >= 0; ind--) {
                                if (list[ind].children && list[ind].children.length > 0) {
                                    func(list[ind].children);
                                    if (list[ind].children.length == 0) {
                                        delete list[ind].children;
                                    }
                                }
                                if (list[ind].isShow == '0') {
                                    list.splice(ind, 1);
                                }
                            }
                            return list;
                        };
                        state.commit('setMenuList', func(menuList));
                    } else {
                        Message({ message: ret.msg, type: 'error' });
                    }
                }).catch(err => {
                    console.log(err);
                    Message({ message: '获取菜单异常', type: 'error' });
                });
            }
            await state.dispatch('requestDictList');
            return menuList;
        },
        requestDictList(state) {
            return new Promise((resolve, reject) => {
                let dictList = state.state.allDictList;
                if (dictList && dictList.length > 0) {
                    resolve(dictList);
                } else {
                    dictAllList({}).then(ret => {
                        if (ret.code == 1) {
                            if (ret['result'] && ret.result.length > 0) {
                                state.commit('setAllDictList', ret.result);
                                resolve(ret.result);
                            }
                        }
                    }).catch(err => {
                        Message.error('请求异常');
                        reject(err);
                    });
                }
            });
        },
        requestMenuList({ commit }) {
            return new Promise((resolve, reject) => {
                menuList({}).then(ret => {
                    if (ret.code == 1) {
                        if (ret['result'] && ret.result.length > 0) {
                            commit('setAllMenuList', ret.result);
                            resolve(ret);
                        } else {
                            Message.warning('菜单列表为空');
                        }
                    } else {
                        Message.warning('获取菜单列表失败');
                    }
                }).catch(err => {
                    Message.error('请求异常');
                    reject(err);
                });
            });
        },
        requestRoleList({ commit }) {
            return new Promise((resolve, reject) => {
                roleAllList({}).then(ret => {
                    if (ret.code == 1) {
                        if (ret['result'] && ret.result.length > 0) {
                            commit('setAllRoleList', ret.result);
                            resolve(ret);
                        } else {
                            Message.warning('角色列表为空');
                        }
                    } else {
                        Message.warning('获取角色列表失败');
                    }
                }).catch(err => {
                    Message.error('请求异常');
                    reject(err);
                });
            });
        },
        requestAreaList({ commit }) {
            return new Promise((resolve, reject) => {
                areaList({}).then(ret => {
                    if (ret.code == 1) {
                        if (ret['result'] && ret.result.length > 0) {
                            commit('setAllAreaList', ret.result);
                            resolve(ret);
                        } else {
                            Message.warning('区域列表为空');
                        }
                    } else {
                        Message.warning('获取区域列表失败');
                    }
                }).catch(err => {
                    Message.error('请求异常');
                    reject(err);
                });
            });
        },
        getNameById({ commit, state }, id) {
            if (state.userNameList[id]) {
                return state.userNameList[id];
            }
            return new Promise((resolve, reject) => {
                getUserNameById({ id: id }).then(ret => {
                    if (ret.code == 1) {
                        if (ret['result']) {
                            commit('setUserName', { id: id, name: ret.result });
                            resolve(ret.result);
                        }
                    }
                }).catch(err => {
                    reject(err);
                });
            });
        }
    },
    getters: {
        token(state) {
            return state.token;
        },
        getUser(state) {
            return state.user;
        },
        loading(state) {
            return state.loading;
        }
    }
};
