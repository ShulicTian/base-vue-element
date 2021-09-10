<template>
    <common-form ref="roleForm" :target-data="roleData" :template-data="templateData" :rules="rules" @save="saveRole" />
</template>

<script>
import { saveRole } from 'api/system';
import CommonForm from 'components/common/CommonForm';

export default {
    name: 'RoleForm',
    components: { CommonForm },
    data: function() {
        return {
            templateData: [
                { key: 'name', val: '角色名称', type: 'text' },
                { key: 'enName', val: '英文名', type: 'text' },
                {
                    key: 'roleType',
                    val: '角色类型',
                    type: 'radio',
                    data: this.$CommonUtils.dictToSelectorByType('role_type')
                },
                {
                    key: 'usable',
                    val: '是否可用',
                    type: 'radio',
                    data: this.$CommonUtils.dictToSelectorByType('role_usable')
                },
                { key: 'menuIdList', val: '角色权限', type: 'treeCheckbox', data: [] },
                {
                    key: 'actives', val: '', data: [
                        { name: '保存', eventName: 'save', type: 'primary' }
                    ], type: 'button'
                }
            ],
            rules: {
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                    { max: 100, message: '长度最多不能超过100', trigger: 'blur' }
                ],
                enName: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                    { max: 100, message: '长度最多不能超过100', trigger: 'blur' }
                ],
                roleType: [
                    { required: true, message: '请选择角色类型', trigger: 'change' }
                ]
            }
        };
    },
    props: {
        roleData: Object
    },
    methods: {
        saveRole(role) {
            let nodes = role.menuIdList;
            let otherTypeMenuIds = role.menuList ? role.menuList.filter(menu => menu.type != '0').map(menu => menu.id) : [];
            if (nodes && nodes['checkedKeys']) {
                role.menuIdList = nodes.checkedKeys.concat(nodes.halfCheckedKeys).concat(otherTypeMenuIds);
            }
            saveRole(role).then(ret => {
                if (ret.code == 1) {
                    this.$message.success('保存角色成功');
                    this.$emit('saved');
                } else {
                    this.$message.warning('保存角色失败');
                }
            }).catch(err => {
                this.$message.warning('请求异常');
            });
        },
        async requestMenuList() {
            await this.$store.dispatch('system/requestMenuList', {}).then(ret => {
                this.templateData.filter(temp => temp.key == 'menuIdList')[0].data = ret.result;
            });
        },
        handleChecked(data) {
            if (this.$refs['roleForm']) {
                let ref = this.$refs.roleForm.getRefByKey('menuIdList');
                if (data['menuList'] && data.menuList.length > 0) {
                    let parentIds = data.menuList.map(obj => obj.parentId);
                    let ids = data.menuIdList.filter(id => parentIds.indexOf(id) == -1);
                    ref[0].setCheckedKeys(ids, true);
                } else {
                    ref[0].setCheckedKeys([]);
                }
            }
        },
        resetForm() {
            if (this.$refs['roleForm']) {
                this.$refs['roleForm'].resetForm();
            }
        }
    },
    created() {
        this.requestMenuList();
    }
};
</script>
<style scoped>
</style>
