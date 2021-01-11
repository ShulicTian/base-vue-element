import store from '../store';

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

/**
 * 格式化时间
 * @param time
 * @returns {string}
 */
CommonUtils.formatTime = function(time) {
    let date = new Date(time);
    let h = date.getHours();
    let min = date.getMinutes();
    return (h < 10 ? '0' + h : h) + ':' + (min < 10 ? '0' + min : min);
};

/**
 * 格式化日期时间
 * @param time
 * @param pattern
 * @returns {string}
 */
CommonUtils.formatDateByPattern = function(time, pattern) {
    let date = new Date(time);
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
};

/**
 *
 * 根据类型获取字典列表
 * @param type
 * @returns {*}
 */
CommonUtils.getDictByType = type => {
    let distList = [];
    if (type) {
        let list = store.state.system.allDictList;
        if (!list || list.length == 0) {
            store.dispatch('system/requestDictList').then(ret => {
                list = ret;
            });
        }
        distList = list.filter(dict => dict.type === type);
    }
    return distList;
};

/**
 *
 * 根据类型获取字典列表
 * @param type
 * @returns {*}
 */
CommonUtils.dictToSelectorByType = type => {
    let distList = [];
    if (type) {
        let list = store.state.system.allDictList;
        if (!list || list.length == 0) {
            store.dispatch('system/requestDictList').then(r => {
                list = r;
            });
        }
        list.forEach(dict => {
            if (dict.type === type) {
                distList.push({ id: dict.value, name: dict.label });
            }
        });
    }
    return distList;
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
        if (!list || list.length == 0) {
            store.dispatch('system/requestDictList').then(ret => {
                list = ret;
            });
        }
        let distList = list.filter(dict => dict.type === type && dict.value === value);
        if (distList && distList.length > 0) {
            label = distList[0].label;
        }
    }
    return label;
};
export default CommonUtils;
