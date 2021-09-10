import store from '../store';
import { downloadJarOuterFile, downloadLocalTemplateFile } from 'api/file';
import { Message, Notification } from 'element-ui';

const CommonUtils = {};
/**
 * 复制对象
 * @param obj
 * @returns {{}}
 */
CommonUtils.cloneObj = obj => {
    let copy = {};
    for (let field in obj) {
        copy[field] = obj[field];
    }
    return copy;
};

CommonUtils.deepClone = obj => {
    return JSON.parse(JSON.stringify(obj));
};

/**
 * 格式化时间
 * @param time
 * @returns {string}
 */
CommonUtils.formatTime = function(time) {
    if (time) {
        let date = '';
        if (time instanceof Date) {
            date = time;
        } else {
            date = new Date(time);
        }
        let h = date.getHours();
        let min = date.getMinutes();
        return (h < 10 ? '0' + h : h) + ':' + (min < 10 ? '0' + min : min);
    }
    return '';
};

/**
 *
 * @param time
 * @returns {Date}
 */
CommonUtils.timeToDate = function(time) {
    if (time) {
        let arr = time.split(':');
        let date = new Date();
        if (arr[0]) {
            date.setHours(arr[0]);
        }
        if (arr[1]) {
            date.setMinutes(arr[1]);
        }
        if (arr[2]) {
            date.setSeconds(arr[2]);
        }
        return date;
    }
    return null;
};

/**
 * 格式化时间
 * @param time
 * @returns {string}
 */
CommonUtils.formatMonDayTime = function(time) {
    if (time) {
        let date = '';
        if (time instanceof Date) {
            date = time;
        } else {
            date = new Date(time);
        }
        let m = date.getMonth() + 1;
        let day = date.getDate();
        let h = date.getHours();
        let min = date.getMinutes();
        return (m < 10 ? '0' + m : m) + '/' + (day < 10 ? '0' + day : day) + ' ' + (h < 10 ? '0' + h : h) + ':' + (min < 10 ? '0' + min : min);
    }
    return '';
};

/**
 * 格式化日期时间
 * @param time
 * @param pattern
 * @returns {string}
 */
CommonUtils.formatDateTimeByPattern = function(time, pattern) {
    if (time) {
        let date = '';
        if (time instanceof Date) {
            date = time;
        } else {
            date = new Date(time);
        }
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        let d = date.getDate();
        let h = date.getHours();
        let min = date.getMinutes();
        let s = date.getSeconds();
        return y + pattern +
            (m < 10 ? '0' + m : m) + pattern +
            (d < 10 ? '0' + d : d) + ' ' +
            (h < 10 ? '0' + h : h) + ':' +
            (min < 10 ? '0' + min : min) + ':' +
            (s < 10 ? '0' + s : s);
    }
    return '';
};

/**
 * 格式化日期时间
 * @param time
 * @param pattern
 * @returns {string}
 */
CommonUtils.formatDateByPattern = function(time, pattern) {
    if (time) {
        let date = '';
        if (time instanceof Date) {
            date = time;
        } else {
            date = new Date(time);
        }
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        let d = date.getDate();
        return y + pattern +
            (m < 10 ? '0' + m : m) + pattern +
            (d < 10 ? '0' + d : d);
    }
    return '';
};

/**
 *
 * 根据类型获取字典列表
 * @param type
 * @returns {*}
 */
CommonUtils.getDictByType = type => {
    let dictList = [];
    if (type) {
        let list = store.state.system.allDictList;
        if (list && list.length > 0) {
            dictList = list.filter(dict => dict.type === type);
        } else {
            store.dispatch('system/requestDictList').then(ret => {
                return CommonUtils.getDictByType(type);
            });
        }

    }
    return dictList;
};

/**
 *
 * 根据类型获取字典列表
 * @param type
 * @returns {*}
 */
CommonUtils.dictToSelectorByType = type => {
    let dictList = [];
    if (type) {
        let list = store.state.system.allDictList;
        if (list && list.length > 0) {
            list.forEach(dict => {
                if (dict.type === type) {
                    dictList.push({ id: dict.value, name: dict.label });
                }
            });
        } else {
            store.dispatch('system/requestDictList').then(r => {
                return CommonUtils.dictToSelectorByType(type);
            });
        }
    }
    return dictList;
};

/**
 * 根据类型和值获取字典标签名
 * @param type
 * @returns {*}
 */
CommonUtils.getDictLabel = (type, value) => {
    let label = '';
    if (type && value) {
        let list = store.state.system.allDictList;
        if (list && list.length > 0) {
            let dictList = list.filter(dict => dict.type === type && dict.value === value);
            if (dictList && dictList.length > 0) {
                label = dictList[0].label;
            }
        } else {
            store.dispatch('system/requestDictList').then(ret => {
                return CommonUtils.getDictLabel(type, value);
            });
        }
    }
    return label;
};

/**
 * 根据类型和值获取字典值
 * @param type
 * @returns {*}
 */
CommonUtils.getDictValue = (type, label) => {
    let value = '';
    if (type && label) {
        let list = store.state.system.allDictList;
        if (list && list.length > 0) {
            let dictList = list.filter(dict => dict.type === type && dict.label === label);
            if (dictList && dictList.length > 0) {
                value = dictList[0].value;
            }
        } else {
            store.dispatch('system/requestDictList').then(ret => {
                return CommonUtils.getDictValue(type, label);
            });
        }
    }
    return value;
};

/**
 * 根据ID获取List或TreeList的对象
 * @param list
 * @param id
 * @returns {{}}
 */
CommonUtils.getById = (list, id) => {
    let obj = {};
    for (let i = 0; i < list.length; i++) {
        if (list[i].id == id) {
            obj = list[i];
            break;
        }
        if (list[i].children && list[i].children.length > 0) {
            obj = CommonUtils.getById(list[i].children, id);
            if (obj.id) {
                break;
            }
        }
    }
    return obj;
};

/**
 * 重置表单
 * @param formName
 * @param refs
 */
CommonUtils.resetForm = (formName, refs) => {
    if (refs[formName]) {
        refs[formName].resetForm();
    }
};

/**
 * 是否有权限
 * @param permission 权限标识符
 */
CommonUtils.hasPermission = (permission) => {
    let permissionList = store.state.system.permissionList;
    if ((permissionList && permissionList.length > 0) && permission) {
        return permissionList.indexOf(permission) !== -1;
    }
    return false;
};

/**
 * 是否有权限
 * @param permissions 权限标识符
 */
CommonUtils.hasPermissionByMul = (permissions) => {
    let permissionList = store.state.system.permissionList;
    if ((permissionList && permissionList.length > 0) && permissions) {
        let perms = permissions.split(',');
        if (perms.length > 0) {
            for (let ind in perms) {
                if (permissionList.indexOf(perms[ind]) !== -1) {
                    return true;
                }
            }
        }
    }
    return false;
};

/**
 * 下载本地文件
 * @param path 路径
 */
CommonUtils.downloadJarOuterFile = (path) => {
    downloadJarOuterFile({ path: path }).then(ret => {
        CommonUtils.clickDownload(ret, path);
    });
};

/**
 * 下载本地模板文件
 * @param fileName 文件名
 * @param alias 下载后名称
 */
CommonUtils.downloadLocalTemplateFile = (fileName, alias) => {
    if (!alias) {
        alias = fileName;
    }
    downloadLocalTemplateFile({ fileName: fileName, alias: encodeURIComponent(alias) }).then(ret => {
        CommonUtils.clickDownload(ret, alias);
    });
};

CommonUtils.clickDownload = (ret, path) => {
    const blob = new Blob([ret]);
    const link = document.createElement('a');
    link.className = 'downloadTags';
    link.download = path.substring(path.lastIndexOf('/') + 1);
    link.style.display = 'none';
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(link.href);
    link.remove();
};

CommonUtils.clickDownloadForUrl = (path, fileName) => {
    Notification({
        title: '提示',
        message: '正在下载，请勿离开页面，且不要重复点击下载。。。',
        duration: 0
    });
    const link = document.createElement('a');
    link.target = '_blank';
    link.class = 'downloadTags';
    link.download = fileName;
    link.style.display = 'none';
    link.href = path;
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(link.href);
    link.remove();
};


function genTree(data, rootId) {
    if (!rootId) {
        rootId = 0;
    } else if (rootId === -1) {
        let level = Math.min.apply(null, data.map(d => d.type));
        rootId = data.filter(obj => obj.type === level).map(d => d.id);
    }
    // 位置映射
    const idMapping = data.reduce((acc, el, i) => {
        acc[el.id] = i;
        return acc;
    }, {});
    let root = [];
    data.forEach(el => {
        // 判断根节点
        if (rootId instanceof Array && rootId.indexOf(el.id) !== -1) {
            root.push(el);
            return;
        } else if (rootId === el.id) {
            root.push(el);
            return;
        }
        // 用映射表找到父元素
        const parentEl = data[idMapping[el.parentId]];
        // 把当前元素添加到父元素的`children`数组中
        if (parentEl) {
            parentEl.children = [...(parentEl.children || []), el];
        }
    });
    return root;
}

/**
 * 扁平数据构建树状数据
 * 需要有id，parentId字段
 */
CommonUtils.genTreeObject = (data, rootId) => {
    return genTree(data, rootId);
};

/**
 * 扁平数据构建树状数据
 * 需要有id，parentId字段
 */
CommonUtils.genTreeArr = (data, rootId) => {
    let arr = genTree(data, rootId);
    return arr;
};

CommonUtils.handleObject = (obj, columnsStr) => {
    let res = obj;
    columnsStr.split('.').forEach(ret => {
        if (res) {
            res = res[ret];
        }
    });
    return res;
};

CommonUtils.getFirstPath = (menuList) => {
    for (let ind in menuList) {
        if (menuList[ind].href) {
            return menuList[ind].href;
        } else {
            if (menuList[ind].children && menuList[ind].children.length > 0) {
                return CommonUtils.getFirstPath(menuList[ind].children);
            }
        }
    }
    return null;
};

CommonUtils.dateDiffDays = (startDate, endDate) => {
    if (startDate && endDate) {
        let startTimestamp = new Date(startDate).getTime();
        let endTimestamp = new Date(endDate).getTime();
        return (endTimestamp - startTimestamp) / 1000 / 60 / 60 / 24 + 1;
    }
    return 0;
};

CommonUtils.handleRequestResult = (result, successMsg, errorMsg) => {
    let data = null;
    if (result.code === '1') {
        if (successMsg) {
            Message.success(successMsg);
        }
        data = result.result;
    } else {
        if (errorMsg) {
            Message.warning(errorMsg);
        }
    }
    return data;
};
export default CommonUtils;
