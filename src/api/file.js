import request from 'utils/request';

//下载本地模板文件
export const downloadLocalTemplateFile = data => {
    return request({
        url: '/osmp/file/access/downloadLocalTemplateFile',
        method: 'GET',
        params: data,
        responseType: 'blob'
    });
};

//下载本地文件
export const downloadLocalFile = data => {
    return request({
        url: '/osmp/file/access/downloadLocalFile',
        method: 'GET',
        params: data,
        responseType: 'blob'
    });
};

//下载本地文件
export const downloadJarOuterFile = data => {
    return request({
        url: '/osmp/file/access/downloadJarOuterFile',
        method: 'GET',
        params: data,
        responseType: 'blob'
    });
};

//文件下载
export const fileDownload = data => {
    return request({
        url: '/osmp/file/access/downloadFile',
        method: 'post',
        data: data,
        responseType: 'blob'
    });
};

//文件下载
export const downloadFileStream = data => {
    return request({
        url: '/osmp/file/access/downloadFileStream',
        method: 'post',
        data: data,
        responseType: 'blob'
    });
};

//文件批量上传
export const fileBatchUpload = data => {
    return request({
        url: '/osmp/file/access/uploadBatch',
        method: 'post',
        data: data,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
};

export const fileSingleUploadPath = '/osmp/file/access/uploadFile';

//文件单个上传
export const fileSingleUpload = data => {
    return request({
        url: '/osmp/file/access/uploadFile',
        method: 'post',
        data: data
    });
};

//删除文件
export const fileRemove = data => {
    return request({
        url: '/osmp/file/access/removeFile',
        method: 'post',
        data: data
    });
};

//获取文件地址
export const getFileUrl = data => {
    return request({
        url: '/osmp/file/access/getFileUrl',
        method: 'post',
        data: data
    });
};

//获取文件地址列表
export const getFileUrlList = data => {
    return request({
        url: '/osmp/file/access/getFileUrlList',
        method: 'post',
        data: data
    });
};
