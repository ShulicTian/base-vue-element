<template>
    <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="部门列表" name="list">
            <el-container>
                <el-aside width="300px">
                    <el-input v-model="filterText" clearable placeholder="输入节点过滤" />
                    <el-tree ref="tree"
                             :data="areaTree"
                             :default-expanded-keys="expandList"
                             :expand-on-click-node="false"
                             :filter-node-method="filterNode"
                             :highlight-current="true"
                             node-key="id"
                             style="border: 1px solid #d8d8d8;margin-top: 5px;padding:5px;border-radius: 5px;"
                             @node-click="handleNodeClick">
                        <span slot-scope="{ node, data }" class="custom-tree-node">
                            <span>{{ data.name }}</span>
                        </span>
                    </el-tree>
                </el-aside>
                <el-main style="padding:0 15px">
                    <common-table-filter :template-data="filterTemplateData"
                                         @import="importUser"
                                         @removeAll="removeAllPeople"
                                         @search="search" />
                    <common-table :table-data="pageList" :template-data="templateData" style="width: 100%;"
                                  @delete="deletePeople" @edit="edit" @remove="remove" />
                    <common-pagination ref="pagination" :list="tableData" @changePage="changePage" />
                </el-main>
            </el-container>
        </el-tab-pane>
        <el-dialog :visible.sync="showDialog" title="导入系统人员" width="65%">
            <common-transfer v-loading="loading"
                             :filter-template="importFilterTemplateData"
                             :table-data="userList"
                             :template-data="importTemplateData"
                             :total="total"
                             @search="searchUser"
                             @submit="savePersonnelList"
                             @change-page="changeUserListPage" />
        </el-dialog>
    </el-tabs>
</template>

<script>
import {
    deleteDept,
    deletePersonnel,
    getDeptList,
    getPersonnelListByDeptId,
    removePersonnel,
    savePersonnelBatch,
    userList
} from 'api/system';
import CommonTable from 'components/common/CommonTable';
import CommonTableFilter from 'components/common/CommonTableFilter';
import SysParamForm from 'components/page/sys/param/SysParamForm';
import CommonPagination from 'components/common/CommonPagination';
import CommonTransfer from 'components/common/CommonTransfer';

export default {
    name: 'WechatDeptList',
    components: { CommonTransfer, CommonPagination, SysParamForm, CommonTable, CommonTableFilter },
    data: function() {
        return {
            activeName: 'list',
            filterText: '',
            areaTree: [],
            expandList: [],
            templateData: [
                { key: 'name', val: '姓名' },
                { key: 'userId', val: '帐号' },
                { key: 'actives', val: '操作' }
            ],
            tableData: [],
            requestData: [],
            pageList: [],
            filterTemplateData: [
                { key: 'name', val: '姓名', type: 'text' },
                { key: 'userId', val: '帐号', type: 'text' },
                {
                    key: 'actives', val: '', data: [
                        { name: '查询', eventName: 'search', type: 'primary', permission: 'wechat:addressBook:view' },
                        {
                            name: '导入系统人员',
                            eventName: 'import',
                            type: 'primary',
                            permission: 'wechat:addressBook:edit'
                        },
                        {
                            name: '删除部门及子部门',
                            eventName: 'removeAll',
                            type: 'primary',
                            permission: 'wechat:addressBook:edit'
                        }
                    ], type: 'button'
                }
            ],
            params: {
                id: this.$store.state.system.baseDeptIds.rootId
            },
            deptId: '',
            showDialog: false,
            importFilterTemplateData: [
                { key: 'name', val: '姓名' },
                { key: 'mobile', val: '手机号' },
                {
                    key: 'actives', val: '', data: [
                        { name: '查询', eventName: 'search', type: 'primary', permission: 'wechat:addressBook:view' }
                    ], type: 'button'
                }
            ],
            importTemplateData: [
                { key: 'name', val: '姓名', type: 'link' },
                { key: 'mobile', val: '手机号' }
            ],
            userList: [],
            userParams: {
                page: 1,
                size: 10
            },
            total: 0,
            loading: false
        };
    },
    methods: {
        changeUserListPage(params) {
            this.userParams.page = params.page;
            this.userParams.size = params.size;
            this.getUserList();
        },
        searchUser(params) {
            this.userParams.name = params.name || null;
            this.userParams.mobile = params.mobile || null;
            this.getUserList();
        },
        savePersonnelList(list) {
            this.loading = true;
            let personList = [];
            list.forEach(obj => {
                let person = {};
                person.userId = obj.mobile;
                person.name = obj.name;
                person.mobile = obj.mobile;
                person.department = [this.deptId];
                personList.push(person);
            });
            savePersonnelBatch({ list: personList }).then(ret => {
                this.loading = false;
                if (ret.code === '1') {
                    this.showDialog = false;
                    if (ret.result && ret.result.length > 0) {
                        this.$alert(ret.result.map(obj => obj.name).join(','), '存在失败条目');
                    } else {
                        this.$message.success('保存成功');
                    }
                } else {
                    this.$message.warning('保存失败');
                }
            });
        },
        getUserList() {
            if (this.deptId !== '') {
                this.loading = true;
                userList(this.userParams).then(ret => {
                    this.loading = false;
                    if (ret.code === '1') {
                        if (ret['result']) {
                            this.userList = ret.result.content;
                            this.total = ret.result.totalElements;
                            this.showDialog = true;
                        }
                    } else {
                        this.$message.warning('查询人员失败');
                    }
                });
            } else {
                this.$message.warning('请选择左侧部门');
            }
        },
        importUser() {
            this.getUserList();
        },
        changePage(list) {
            this.pageList = list;
        },
        filterNode(val, data) {
            if (!val) return true;
            return data.name.indexOf(val) !== -1;
        },
        handleNodeClick(obj, node, data) {
            this.deptId = obj.id;
            this.getPersonnelList();
        },
        getPersonnelList() {
            getPersonnelListByDeptId({ id: this.deptId }).then(ret => {
                if (ret.code === '1') {
                    ret.result.forEach(obj => {
                        obj.actives = [
                            { name: '移除', eventName: 'remove', permission: 'wechat:addressBook:edit' },
                            { name: '彻底删除', eventName: 'delete', permission: 'wechat:addressBook:edit' }
                        ];
                    });
                    this.requestData = this.$CommonUtils.deepClone(ret.result);
                    this.tableData = ret.result;
                    this.pageList = this.$refs.pagination.changePage();
                }
            });
        },
        search(params) {
            let userId = params.userId;
            let name = params.name;
            if (userId || name) {
                this.pageList = this.requestData.filter(obj => (name ? obj.name.indexOf(name) !== -1 : true) && (userId ? obj.userId.indexOf(userId) !== -1 : true));
            } else {
                this.$refs.pagination.changePage();
            }
        },
        removeAllPeople() {
            this.$confirm('删除后数据将无法恢复，确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
            }).then(() => {
                if (this.deptId !== '' && this.deptId != '1' && this.deptId != '4294967285' && this.deptId != '4294967290') {
                    deleteDept({ id: this.deptId }).then(ret => {
                        if (ret.code === '1') {
                            if (ret.result) {
                                this.$message.success('删除成功');
                                this.getList();
                            } else {
                                this.$message.warning('删除失败');
                            }
                        } else {
                            this.$message.warning('删除失败');
                        }
                    });
                } else {
                    this.$message.warning('请选择左侧部门，根部门不可删除');
                }
            }).catch(() => {
                this.$message.warning('已取消');
            });
        },
        remove(id, row) {
            this.$confirm('将从该部门移除，确认移除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                removePersonnel({ userId: row.userId, department: [this.deptId] }).then(ret => {
                    if (ret.code === '1') {
                        if (ret.result) {
                            this.$message.success('移除成功');
                            this.getPersonnelList();
                        } else {
                            this.$message.warning('移除失败');
                        }
                    } else {
                        this.$message.warning('移除失败');
                    }
                });
            }).catch(() => {
                this.$message.warning('已取消');
            });
        },
        deletePeople(id, row) {
            this.$confirm('删除后数据将无法恢复，确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
            }).then(() => {
                deletePersonnel({ userId: row.userId }).then(ret => {
                    if (ret.code === '1') {
                        if (ret.result) {
                            this.$message.success('删除成功');
                            this.getPersonnelList();
                        } else {
                            this.$message.warning('删除失败');
                        }
                    } else {
                        this.$message.warning('删除失败');
                    }
                });
            }).catch(() => {
                this.$message.warning('已取消');
            });
        },
        edit(id) {
        },
        getList() {
            getDeptList(this.params).then(ret => {
                if (ret.code == 1) {
                    if (ret['result']) {
                        let root = ret.result.filter(obj => obj.id === this.params.id);
                        this.handleList(root, ret.result);
                        this.areaTree = root;
                        if (root && root.length > 0 && root[0].children && root[0].children.length > 0) {
                            this.expandList.push(root[0].children[0].id);
                        }
                    } else {
                        this.$message.warning('部门列表为空');
                    }
                } else {
                    this.$message.warning('获取部门列表失败');
                }
            }).catch(err => {
                this.$message.error('请求异常');
            });
        },
        handleList(root, list) {
            if (root && root.length > 0) {
                root.forEach(root => {
                    let children = list.filter(obj => obj.parentId === root.id);
                    children.sort(function(a, b) {
                        return b.order - a.order;
                    });
                    if (children && children.length > 0) {
                        this.handleList(children, list);
                        root.children = children;
                    }
                });
            }
        }
    },
    created() {
        this.getList();
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    }
};
</script>

<style scoped>
</style>
