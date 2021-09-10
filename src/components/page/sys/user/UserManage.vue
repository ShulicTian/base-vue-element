<template>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="用户列表" name="list">
            <common-table-filter :template-data="filterTemplateData" @search="search" />
            <div style="text-align: right;padding-bottom: 10px;float: right;">
                <el-pagination
                    :current-page.sync="params.page"
                    :page-size="params.size"
                    :total="total"
                    background
                    layout="total, prev, pager, next"
                    @current-change="changePage"
                >
                </el-pagination>
            </div>
            <common-table :table-data="tableData" :template-data="templateData" style="width: 100%;"
                          @edit="editUser" @remove="removeUser" />
            <div style="text-align: left;padding-top: 15px;">
                <el-pagination
                    :current-page.sync="params.page"
                    :page-size="params.size"
                    :total="total"
                    background
                    layout="total, prev, pager, next"
                    @current-change="changePage"
                >
                </el-pagination>
            </div>
        </el-tab-pane>
        <el-tab-pane v-if="this.$CommonUtils.hasPermission('sys:user:edit')" :label="addLabel" name="add">
            <user-form ref="userForm" :user-data="userData" style="width: 50%;" @saved="saved" />
        </el-tab-pane>
    </el-tabs>
</template>

<script>
import { removeUser, userList } from 'api/system';
import CommonTable from 'components/common/CommonTable';
import UserForm from 'components/page/sys/user/UserForm';
import CommonTableFilter from 'components/common/CommonTableFilter';

export default {
    name: 'UserManage',
    components: { UserForm, CommonTable, CommonTableFilter },
    data: function() {
        return {
            activeName: 'list',
            addLabel: '添加用户',
            templateData: [
                { key: 'name', val: '姓名' },
                { key: 'username', val: '用户名' },
                { key: 'idCard', val: '身份证' },
                { key: 'mobile', val: '手机号' },
                { key: 'actives', val: '操作' }
            ],
            tableData: [],
            userData: {},
            filterTemplateData: [
                { key: 'name', val: '姓名', type: 'text' },
                { key: 'username', val: '用户名', type: 'text' },
                { key: 'idCard', val: '身份证', type: 'text' },
                { key: 'mobile', val: '手机号', type: 'number' },
                {
                    key: 'actives', val: '', data: [
                        { name: '查询', eventName: 'search', type: 'primary', permission: 'sys:user:view' }
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
            this.params.username = params.username;
            this.params.idCard = params.idCard;
            this.params.mobile = params.mobile;
            this.getUserList();
        },
        changePage() {
            this.getUserList();
        },
        initUserData() {
            this.userData = {
                id: -1,
                nikeName: '',
                username: '',
                password: '',
                rePassword: '',
                name: '',
                idCard: '',
                mobile: '',
                roleIdList: [2]
            };
            this.resetForm();
        },
        saved() {
            this.activeName = 'list';
            this.addLabel = '添加用户';
            this.initUserData();
            this.getUserList();
        },
        removeUser(id) {
            this.$confirm('删除后数据将无法恢复，确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                removeUser({ id: id }).then(ret => {
                    if (ret.code == 1) {
                        this.$message.success('删除用户成功');
                        this.getUserList();
                    } else {
                        this.$message.warning('删除用户失败');
                    }
                }).catch(err => {
                    this.$message.warning('请求异常');
                });
            }).catch(() => {
                this.$message.warning('已取消删除');
            });
        },
        editUser(id) {
            this.activeName = 'add';
            let userData = this.$CommonUtils.cloneObj(this.tableData.filter(user => user.id == id)[0]);
            if (!userData.roleIdList) {
                userData.roleIdList = [2];
            }
            this.userData = userData;
            this.userData.password = '';
            this.addLabel = '修改用户';
        },
        async getUserList() {
            await userList(this.params).then(ret => {
                if (ret.code == 1) {
                    if (ret['result']) {
                        this.tableData = this.handleList(ret.result.content);
                        this.total = ret.result.totalElements;
                    } else {
                        this.$message.warning('用户列表为空');
                    }
                } else {
                    this.$message.warning('获取用户列表失败');
                }
            });
        },
        handleList(list) {
            list.forEach(menu => {
                menu.actives = [
                    { name: '修改', eventName: 'edit', permission: 'sys:user:edit' },
                    { name: '删除', eventName: 'remove', permission: 'sys:user:edit' }
                ];
            });
            return list;
        },
        handleClick(key) {
            this.addLabel = '添加用户';
            this.initUserData();
        },
        resetForm() {
            if (this.$refs['userForm']) {
                this.$refs['userForm'].resetForm();
            }
        }
    },
    created() {
        this.initUserData();
        this.getUserList();
    }
};
</script>

<style scoped>
</style>
