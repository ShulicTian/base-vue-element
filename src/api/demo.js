import request from 'utils/request';

//获取列表
export const getDemoList = data => {
    return request({
        url: '/osmp/system/demo/list',
        method: 'POST',
        data: data
    });
};

//保存
export const saveDemo = data => {
    return request({
        url: '/osmp/system/demo/save',
        method: 'POST',
        data: data
    });
};

//获取删除
export const removeDemo = data => {
    return request({
        url: '/osmp/system/demo/delete/'+data.id,
        method: 'DELETE',
        data: data
    });
};