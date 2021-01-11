<template>
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="用户列表" name="list">
            <common-table-filter :template-data="filterTemplateData" @search="search" />
            <div style="text-align: right;padding-bottom: 10px;float: right;">
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
                          @remove="removeUser" @edit="editUser" />
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
        <el-tab-pane :label="addLabel" name="add">
            <user-form ref="userForm" style="width: 50%;" @saved="saved" :user-data="userData" />
        </el-tab-pane>
    </el-tabs>
</template>

<script>
import { removeUser, userList } from 'api/system';
import CommonTable from 'components/common/CommonTable';
import UserForm from 'components/page/sys/user/UserForm';
import CommonTableFilter from 'components/common/CommonTableFilter';

export default {
    name: 'UserManager',
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
                        { name: '查询', eventName: 'search', type: 'primary' }
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
        },
        editUser(id) {
            this.activeName = 'add';
            this.userData = this.$CommonUtils.cloneObj(this.tableData.filter(user => user.id == id)[0]);
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
            }).catch(err => {
                this.$message.error('请求异常');
            });
        },
        handleList(list) {
            list.forEach(menu => {
                menu.actives = [
                    { name: '修改', eventName: 'edit' },
                    { name: '删除', eventName: 'remove' }
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
