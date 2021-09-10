<template>
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="角色列表" name="list">
            <common-table-filter :template-data="filterTemplateData" @search="search" />
            <div style="text-align: right;padding-bottom: 10px;">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :page-size="params.size"
                    :total="total"
                    :current-page.sync="params.page"
                    @current-change="changePage"
                >
                </el-pagination>
            </div>
            <common-table style="width: 100%;" :template-data="templateData" :table-data="tableData"
                          @remove="removeRole" @edit="editRole" />
            <div style="text-align: left;padding-top: 15px;">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :page-size="params.size"
                    :total="total"
                    :current-page.sync="params.page"
                    @current-change="changePage"
                >
                </el-pagination>
            </div>
        </el-tab-pane>
        <el-tab-pane v-if="this.$CommonUtils.hasPermission('sys:role:edit')" :label="addLabel" name="add">
            <role-form ref="roleForm" style="width: 50%;" @saved="saved" :role-data="roleData" />
        </el-tab-pane>
    </el-tabs>
</template>

<script>
import { removeRole, roleList } from 'api/system';
import CommonTable from 'components/common/CommonTable';
import RoleForm from 'components/page/sys/role/RoleForm';
import CommonTableFilter from 'components/common/CommonTableFilter';

export default {
    name: 'RoleManage',
    components: { RoleForm, CommonTable, CommonTableFilter },
    data: function() {
        return {
            activeName: 'list',
            addLabel: '添加角色',
            templateData: [
                { key: 'number', val: '序号' },
                { key: 'name', val: '角色名称' },
                { key: 'enName', val: '英文名称' },
                {
                    key: 'roleType',
                    val: '类型',
                    type: 'dict',
                    dict: 'role_type'
                },
                {
                    key: 'usable',
                    val: '是否可用',
                    type: 'dict',
                    dict: 'role_usable'
                },
                { key: 'actives', val: '操作' }
            ],
            tableData: [],
            roleData: {},
            filterTemplateData: [
                { key: 'name', val: '角色名称', type: 'text' },
                { key: 'enName', val: '英文名', type: 'text' },
                {
                    key: 'actives', val: '', data: [
                        { name: '查询', eventName: 'search', type: 'primary', permission: 'sys:role:view' }
                    ], type: 'button'
                }
            ],
            total: 0,
            params: {
                page: 1,
                size: 15
            }
        };
    },
    methods: {
        search(params) {
            this.params.name = params.name;
            this.params.enName = params.enName;
            this.getRoleList();
        },
        changePage() {
            this.getRoleList();
        },
        initRoleData() {
            this.roleData = {
                id: -1,
                name: '',
                enName: '',
                usable: '0',
                roleType: '0',
                menuIdList: []
            };
        },
        saved() {
            this.activeName = 'list';
            this.addLabel = '添加角色';
            this.initRoleData();
            this.getRoleList();
        },
        removeRole(id) {
            removeRole({ id: id }).then(ret => {
                if (ret.code == 1) {
                    this.$message.success('删除角色成功');
                    this.getRoleList();
                } else {
                    this.$message.warning('删除角色失败');
                }
            }).catch(err => {
                this.$message.warning('请求异常');
            });
        },
        editRole(id) {
            this.activeName = 'add';
            this.roleData = this.$CommonUtils.cloneObj(this.tableData.filter(user => user.id == id)[0]);
            this.addLabel = '修改角色';
            this.handleChecked();
        },
        async getRoleList() {
            await roleList(this.params).then(ret => {
                if (ret.code == 1) {
                    if (ret['result']) {
                        this.tableData = this.handleList(ret.result.content);
                        this.total = ret.result.totalElements;
                    } else {
                        this.$message.warning('角色列表为空');
                    }
                } else {
                    this.$message.warning('获取角色列表失败');
                }
            }).catch(err => {
                this.$message.error('请求异常');
            });
        },
        handleList(list) {
            list.forEach(menu => {
                menu.actives = [
                    { name: '修改', eventName: 'edit', permission: 'sys:role:edit' },
                    { name: '删除', eventName: 'remove', permission: 'sys:role:edit' }
                ];
            });
            return list;
        },
        handleClick() {
            this.addLabel = '添加角色';
            this.initRoleData();
            if (this.activeName == 'add') {
                this.handleChecked();
            }
        },
        handleChecked() {
            if (this.$refs['roleForm']) {
                this.$refs.roleForm.handleChecked(this.roleData);
                this.$refs.roleForm.resetForm();
            }
        }
    },
    created() {
        this.initRoleData();
        this.getRoleList();
    }
};
</script>

<style scoped>
</style>
