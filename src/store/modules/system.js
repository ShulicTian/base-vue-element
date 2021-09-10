import { areaList, dictAllList, getMenuList, getUserNameById, login, menuList, roleAllList } from 'api/system';
import { Message } from 'element-ui';
import CommonUtils from 'utils/CommonUtils';
import router from '../../router';

export default {
    namespaced: true,
    state: {
        token: localStorage.getItem('auth_token') || '',
        user: JSON.parse(localStorage.getItem('user_data')) || null,
        permissionList: JSON.parse(localStorage.getItem('permission_list')) || null,
        menuList: JSON.parse(localStorage.getItem('menu_list')) || null,
        allMenuList: [],
        allRoleList: [],
        allAreaList: [],
        allDictList: JSON.parse(localStorage.getItem('dict_list')) || null,
        userNameList: [],
        loading: false,
        menuName: '',
        headerIndex: localStorage.getItem('header_index') || '1',
        baseDeptIds: { rootId: '1', deptParentId: '4294967295' }
    },
    mutations: {
        setHeaderIndex(state, data) {
            state.headerIndex = data;
            localStorage.setItem('header_index', data);
        },
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
        setPermissionList(state, data) {
            state.user.roleList.forEach(role => {
                data.push.apply(data, role.menuList.map(menu => menu.permission));
            });
            state.permissionList = data;
            localStorage.setItem('permission_list', JSON.stringify(data));
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
        cleanUser(state) {
            state.token = null;
            state.user = null;
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
        },
        cleanCache(state) {
            state.token = null;
            state.user = null;
            state.menuList = null;
            state.permissionList = null;
            state.allDictList = null;
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            localStorage.removeItem('menu_list');
            localStorage.removeItem('permission_list');
            localStorage.removeItem('current_exam_id');
            localStorage.removeItem('current_exam');
            localStorage.removeItem('dict_list');
            state.headerIndex = '1';
        },
        cleanDict(state) {
            state.allDictList = null;
            localStorage.removeItem('dict_list');
        }
    },
    actions: {
        toIndex({ state }, data) {
            router.replace(CommonUtils.getFirstPath(state.menuList)).then(r => {
            });
        },
        login(state, data) {
            return new Promise((resolve, reject) => {
                login(data).then(ret => {
                    state.commit('cleanCache');
                    if (ret.code == 1) {
                        state.commit('setUser', ret.result);
                        state.dispatch('loadMenu').then(_ => {
                            Message({ message: '登录成功', type: 'success' });
                            resolve(true);
                            router.replace(CommonUtils.getFirstPath(_)).then(r => {
                            });
                        });
                    } else {
                        Message({ message: ret.msg, type: 'error' });
                        resolve(false);
                    }
                }).catch(err => {
                    console.log(err);
                    Message({ message: '登入异常', type: 'error' });
                    reject(err);
                });
            });
        },
        async loadMenu(state, data) {
            let menuList = [];
            await getMenuList(data || {}).then(ret => {
                if (ret.code === '1') {
                    if (ret.result) {
                        menuList = ret.result;
                        let permissionList = [];
                        let func = function(list) {
                            if (list && list.length > 0) {
                                for (let ind = list.length - 1; ind >= 0; ind--) {
                                    if (list[ind].children && list[ind].children.length > 0) {
                                        func(list[ind].children);
                                        if (list[ind].children.length == 0) {
                                            delete list[ind].children;
                                        }
                                    }
                                    if (list[ind].permission) {
                                        permissionList.push(list[ind].permission);
                                    }
                                    if (list[ind].isShow == '0') {
                                        list.splice(ind, 1);
                                    }
                                }
                            }
                            return list;
                        };
                        state.commit('setMenuList', func(menuList));
                        state.commit('setPermissionList', permissionList);
                        state.dispatch('requestDictList');
                    } else {
                        Message.warning('您暂无权限进入');
                    }
                } else {
                    Message({ message: ret.msg, type: 'error' });
                }
            }).catch(err => {
                console.log(err);
                Message({ message: '获取菜单异常', type: 'error' });
            });
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
        requestMenuList({ commit }, data) {
            return new Promise((resolve, reject) => {
                menuList(data).then(ret => {
                    if (ret.code == 1) {
                        if (ret['result'] && ret.result.length > 0) {
                            commit('setAllMenuList', ret.result);
                            resolve(ret);
                        } else {
                            Message.warning('菜单列表为空');
                            resolve({ result: [] });
                        }
                    } else {
                        resolve({ result: [] });
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
