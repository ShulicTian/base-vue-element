<template>
    <common-form ref="menuForm" :target-data="menuData" :template-data="templateData" :rules="rules" @save="saveMenu"
                 @cancel="cancelSave" />
</template>

<script>
import { saveMenu } from 'api/system';
import CommonForm from 'components/common/CommonForm';

export default {
    name: 'MenuForm',
    data: function() {
        return {
            templateData: [
                { key: 'parentId', val: '上级菜单', type: 'selectTree', data: [] },
                { key: 'name', val: '名称', type: 'text' },
                { key: 'href', val: '链接', type: 'text' },
                { key: 'icon', val: '图标', type: 'text' },
                { key: 'sort', val: '排序', type: 'number' },
                { key: 'isShow', val: '可见', type: 'switch' },
                { key: 'permission', val: '权限', type: 'text' },
                {
                    key: 'actives', val: '', data: [
                        { name: '保存', eventName: 'save', type: 'primary' },
                        { name: '取消', eventName: 'cancel', type: '' }
                    ], type: 'button'
                }
            ],
            rules: {
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' },
                    { max: 100, message: '长度最多不能超过100', trigger: 'blur' }
                ],
                sort: [
                    { required: true, message: '请输入排序', trigger: 'blur' }
                ]
            }
        };
    },
    components: {
        CommonForm
    },
    props: {
        menuData: Object,
        treeData: Array
    },
    methods: {
        cancelSave() {
            this.$emit('cancelSave');
        },
        saveMenu(menu) {
            let param = {};
            param.id = menu.id;
            param.parentId = menu.parentId;
            param.name = menu.name;
            param.href = menu.href;
            param.icon = menu.icon;
            param.sort = menu.sort;
            param.isShow = menu.isShow ? 1 : 0;
            param.permission = menu.permission;
            param.parentIds = this.getParentIds(this.treeData, param.parentId);
            saveMenu(param).then(ret => {
                if (ret.code == 1) {
                    this.$message.success('保存成功');
                    this.$emit('saveMenu');
                } else {
                    this.$message.warning('保存失败');
                }
            }).catch(err => {
                this.$message.warning('保存异常');
            });
        },
        getParentIds(list, id) {
            if (id == 0) {
                return '0,';
            }
            for (let ind in list) {
                if (list[ind].id == id) {
                    return list[ind].parentIds + id + ',';
                }
                if (list[ind].children && list[ind].children.length > 0) {
                    let parentIds = this.getParentIds(list[ind].children, id);
                    if (parentIds) {
                        return parentIds;
                    }
                }
            }
            return '';
        },
        handleTreeData() {
            let root = {
                id: 0,
                name: '功能菜单',
                href: '',
                icon: '',
                isShow: false,
                sort: 0,
                permission: '',
                parentId: 0,
                children: []
            };
            root.children = this.treeData;
            this.templateData[0].data = [];
            this.templateData[0].data.push(root);
        },
        resetForm() {
            if (this.$refs['menuForm']) {
                this.$refs['menuForm'].resetForm();
            }
        }
    },
    created() {
        this.handleTreeData();
    }
};
</script>

<style scoped>
</style>
