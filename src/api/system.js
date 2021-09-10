import request from '../utils/request';

//登录
export const login = data => {
    return request({
        url: '/osmp/sys/system/login',
        method: 'post',
        data: data
    });
};

//登出
export const logout = query => {
    return request({
        url: '/osmp/sys/system/logout',
        method: 'get',
        data: {},
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
        data: data

    });
};

//获取用户菜单
export const getMenuList = data => {
    return request({
        url: '/osmp/sys/menu/getMenuList',
        method: 'POST',
        data: data,
        params: { examId: data.examId || null }
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

//获取用户列表
export const findListBySelector = data => {
    return request({
        url: '/osmp/sys/user/findListBySelector',
        method: 'post',
        data: data
    });
};

//获取用户列表
export const userListByColumn = data => {
    return request({
        url: '/osmp/sys/user/findList',
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

//获取角色列表-分页
export const roleListBy = data => {
    return request({
        url: '/osmp/sys/role/list',
        method: 'post',
        data: data
    });
};

//获取角色列表
export const findRoleList = data => {
    return request({
        url: '/osmp/sys/role/findList',
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

//保存系统参数
export const getParam = data => {
    return request({
        url: '/osmp/sys/param/get',
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

//获取实体列表
export const entityList = data => {
    return request({
        url: '/osmp/sys/generate/entityList',
        method: 'post',
        data: data
    });
};

//获取代码生成记录列表
export const fastGenerateList = data => {
    return request({
        url: '/osmp/sys/generate/list',
        method: 'post',
        data: data
    });
};

//保存并生成代码
export const saveFastGenerate = data => {
    return request({
        url: '/osmp/sys/generate/save',
        method: 'post',
        data: data
    });
};

//保存公告
export const saveBulletin = data => {
    return request({
        url: '/osmp/system/bulletin/save',
        method: 'post',
        data: data
    });
};

//更新公告状态
export const updateBulletinStatus = data => {
    return request({
        url: '/osmp/system/bulletin/updateBulletinStatus',
        method: 'post',
        data: data
    });
};

//获取公告列表-分页
export const bulletinList = data => {
    return request({
        url: '/osmp/system/bulletin/list',
        method: 'post',
        data: data
    });
};

//删除公告
export const removeBulletin = data => {
    return request({
        url: '/osmp/system/bulletin/delete/' + data.id,
        method: 'DELETE'
    });
};

//通用Post请求
export const commonPostRequest = (url, data) => {
    return request({
        url: url,
        method: 'POST',
        data: data
    });
};

//同步人员
export const saveDeptPersonnel = data => {
    return request({
        url: '/osmp/wechat/addressBook/saveDeptPersonnel',
        method: 'post',
        data: data,
        timeout: 1000000
    });
};

//批量添加人员人员
export const savePersonnelBatch = data => {
    return request({
        url: '/osmp/wechat/addressBook/savePersonnelBatch',
        method: 'post',
        data: data,
        timeout: 1000000
    });
};

//获取企业通讯录部门列表
export const getDeptList = data => {
    return request({
        url: '/osmp/wechat/addressBook/getDeptList',
        method: 'post',
        data: data
    });
};

//获取企业通讯录部门下人员
export const getPersonnelListByDeptId = data => {
    return request({
        url: '/osmp/wechat/addressBook/getPersonnelListByDeptId',
        method: 'post',
        data: data
    });
};

//从部门移除人员
export const removePersonnel = data => {
    return request({
        url: '/osmp/wechat/addressBook/removePersonnel',
        method: 'post',
        data: data
    });
};

//彻底删除人员
export const deletePersonnel = data => {
    return request({
        url: '/osmp/wechat/addressBook/deletePersonnel',
        method: 'post',
        data: data
    });
};

//删除部门 子部门 并移除人员
export const deleteDept = data => {
    return request({
        url: '/osmp/wechat/addressBook/deleteDept',
        method: 'post',
        data: data,
        timeout: 100000
    });
};

//发送消息
export const sendMessage = data => {
    return request({
        url: '/osmp/wechat/message/sendMessage',
        method: 'post',
        data: data
    });
};

//获取企业二维码
export const getQrcodeUrl = data => {
    return request({
        url: '/osmp/wechat/addressBook/getQrcodeUrl',
        method: 'post',
        params: data
    });
};