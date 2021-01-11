import request from '../utils/request';

//登录
export const login = data => {
    return request({
        url: '/osmp/sys/system/login?sys_cookie=true',
        method: 'post',
        data: data
    });
};

//登出
export const logout = query => {
    return request({
        url: '/osmp/sys/system/logout',
        method: 'get',
        params: query
    });
};

//注册
export const register = data => {
    return request({
        url: '/osmp/sys/system/registerUser',
        method: 'post',
        data: data
    });
};

//手机号/身份证是否存在
export const isExist = data => {
    return request({
        url: '/osmp/sys/user/isExist',
        method: 'post',
        data: data,

    });
};

//获取用户菜单
export const getMenuList = data => {
    return request({
        url: '/osmp/sys/menu/getMenuList',
        method: 'post',
        data: data
    });
};

//获取菜单列表-分页
export const menuList = data => {
    return request({
        url: '/osmp/sys/menu/list',
        method: 'post',
        data: data
    });
};

//保存菜单
export const saveMenu = data => {
    return request({
        url: '/osmp/sys/menu/save',
        method: 'post',
        data: data
    });
};

//删除菜单
export const removeMenu = data => {
    return request({
        url: '/osmp/sys/menu/delete/' + data.id,
        method: 'DELETE'
    });
};

//根据ID获取用户
export const getUserNameById = data => {
    return request({
        url: '/osmp/sys/user/getUserName/' + data.id,
        method: 'post'
    });
};

//获取用户列表-分页
export const userList = data => {
    return request({
        url: '/osmp/sys/user/list',
        method: 'post',
        data: data
    });
};

//保存用户
export const saveUser = data => {
    return request({
        url: '/osmp/sys/user/save',
        method: 'post',
        data: data
    });
};

//修改用户资料
export const updateUserInfo = data => {
    return request({
        url: '/osmp/sys/user/updateUserInfo',
        method: 'post',
        data: data
    });
};

//修改密码
export const updatePassword = data => {
    return request({
        url: '/osmp/sys/user/updatePassword',
        method: 'post',
        data: data
    });
};

//删除用户
export const removeUser = data => {
    return request({
        url: '/osmp/sys/user/delete/' + data.id,
        method: 'DELETE'
    });
};

//获取角色列表-分页
export const roleList = data => {
    return request({
        url: '/osmp/sys/role/list',
        method: 'post',
        data: data
    });
};

//获取所有角色列表
export const roleAllList = data => {
    return request({
        url: '/osmp/sys/role/allList',
        method: 'post',
        data: data
    });
};

//删除角色
export const removeRole = data => {
    return request({
        url: '/osmp/sys/role/delete/' + data.id,
        method: 'DELETE'
    });
};

//保存角色
export const saveRole = data => {
    return request({
        url: '/osmp/sys/role/save',
        method: 'post',
        data: data
    });
};

//获取区域列表-分页
export const areaList = data => {
    return request({
        url: '/osmp/sys/area/list',
        method: 'post',
        data: data
    });
};

//删除区域
export const removeArea = data => {
    return request({
        url: '/osmp/sys/area/delete/' + data.id,
        method: 'DELETE'
    });
};

//保存区域
export const saveArea = data => {
    return request({
        url: '/osmp/sys/area/save',
        method: 'post',
        data: data
    });
};

//获取字典列表-分页
export const dictList = data => {
    return request({
        url: '/osmp/sys/dict/list',
        method: 'post',
        data: data
    });
};

//获取字典列表
export const dictAllList = data => {
    return request({
        url: '/osmp/sys/dict/allList',
        method: 'post',
        data: data
    });
};

//删除字典
export const removeDict = data => {
    return request({
        url: '/osmp/sys/dict/delete/' + data.id,
        method: 'DELETE'
    });
};

//保存字典
export const saveDict = data => {
    return request({
        url: '/osmp/sys/dict/save',
        method: 'post',
        data: data
    });
};

//获取系统参数列表-分页
export const paramList = data => {
    return request({
        url: '/osmp/sys/param/list',
        method: 'post',
        data: data
    });
};

//删除系统参数
export const removeParam = data => {
    return request({
        url: '/osmp/sys/param/delete/' + data.id,
        method: 'DELETE'
    });
};

//保存系统参数
export const saveParam = data => {
    return request({
        url: '/osmp/sys/param/save',
        method: 'post',
        data: data
    });
};

//获取日志列表-分页
export const logList = data => {
    return request({
        url: '/osmp/sys/log/list',
        method: 'post',
        data: data
    });
};
