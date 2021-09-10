import { fileBatchUpload, fileDownload, fileRemove, fileSingleUpload, getFileUrl, getFileUrlList } from 'api/file';
import { Message } from 'element-ui';
import CommonUtils from 'utils/CommonUtils';

export default {
    namespaced: true,
    state: {
        defaultBucketName: 'osmp',
        imageList: []
    },
    mutations: {
        PutImageList(state, data) {
            if (data.url) {
                let images = state.imageList.filter(obj => obj.bucketName === data.bucketName && obj.path === data.path);
                if (images && images.length > 0) {
                    images[0].url = data.url;
                } else {
                    state.imageList.push(data);
                }
            }
        },
        PutMulImageList(state, data) {
            if (data && data.length > 0) {
                data.forEach(file => {
                    this.commit('file/PutImageList', file);
                });
            }
        }
    },
    actions: {
        fileSingleUpload({ state }, data) {
            return new Promise((resolve, reject) => {
                data.bucketName = state.defaultBucketName;
                fileSingleUpload(data).then(ret => {
                    if (ret.code === '1') {
                        resolve(ret.result);
                    } else {
                        resolve(false);
                    }
                }).catch(err => {
                    console.log(err);
                    reject(err);
                });
            });
        },
        fileBatchUpload({ commit }, data) {
            return new Promise((resolve, reject) => {
                fileBatchUpload(data).then(ret => {
                    resolve(ret);
                }).catch(err => {
                    console.log(err);
                    reject(err);
                });
            });
        },
        fileRemove({ commit }, data) {
            return new Promise((resolve, reject) => {
                fileRemove(data).then(ret => {
                    resolve(ret);
                }).catch(err => {
                    console.log(err);
                    reject(err);
                });
            });
        },
        getFileUrlList({ commit, state }, data) {
            return new Promise((resolve, reject) => {
                let exists = [];
                let params = [];
                if (state.imageList && state.imageList.length > 0) {
                    data.forEach(obj => {
                        let filters = state.imageList.filter(image => image.bucketName === obj.rootDir && image.path === obj.path);
                        if (filters && filters.length > 0) {
                            exists.push(filters[0]);
                        } else {
                            params.push(obj);
                        }
                    });
                } else {
                    params = data;
                }
                if (params && params.length > 0) {
                    getFileUrlList({ listParam: params }).then(ret => {
                        if (ret.code === '1') {
                            commit('PutMulImageList', ret.result);
                            if (exists.length > 0) {
                                if (ret.result && ret.result.length > 0) {
                                    exists.push.apply(exists, ret.result);
                                }
                                resolve(exists);
                            } else {
                                resolve(ret.result);
                            }
                        }
                    }).catch(err => {
                        console.log(err);
                        reject(err);
                    });
                } else if (exists && exists.length > 0) {
                    resolve(exists);
                } else {
                    resolve([]);
                }
            });
        },
        getFileUrl({ commit, state }, data) {
            return new Promise((resolve, reject) => {
                let images = state.imageList.filter(obj => obj.bucketName === data.rootDir && obj.path === data.path);
                if (images && images.length > 0) {
                    resolve(images[0].url);
                } else {
                    getFileUrl(data).then(ret => {
                        if (ret.code === '1') {
                            commit('PutImageList', { bucketName: data.rootDir, path: data.path, url: ret.result });
                            resolve(ret.result);
                        } else {
                            Message.warning('获取图片地址失败');
                        }
                    }).catch(err => {
                        console.log(err);
                        reject(err);
                    });
                }

            });
        },
        fileDownload({ commit, state }, data) {
            return new Promise(resolve => {
                fileDownload(data).then(ret => {
                    CommonUtils.clickDownload(ret, data.path);
                    resolve(true);
                });
            });
        }
    },
    getters: {}
};
