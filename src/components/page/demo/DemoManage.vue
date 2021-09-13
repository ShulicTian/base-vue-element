<template>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="系统演示列表" name="list">
            <common-table-filter :template-data="filterTemplateData" @search="search" />
            <common-table :table-data="tableData"
                          :template-data="templateData"
                          style="width: 100%;"
                          @edit="edit"
                          @remove="remove" />
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
        <el-tab-pane v-if="this.$CommonUtils.hasPermission('system:demo:edit')" :label="addLabel" name="add">
            <demo-form ref="demoForm"
                             :form-data="demoData"
                             style="width: 100%;"
                             @saved="saved" />
        </el-tab-pane>
    </el-tabs>
</template>

<script>
import DemoForm from './DemoForm';
import CommonTable from 'components/common/CommonTable';
import CommonTableFilter from 'components/common/CommonTableFilter';
import {getDemoList} from "api/demo";

export default {
    name: 'DemoManage',
    components: { CommonTable, CommonTableFilter, DemoForm },
    data: function() {
        return {
            activeName: 'list',
            addLabel: '创建系统演示',
            templateData: [
              {key:'name',val:'姓名'},
              {key:'age',val:'年龄'},
            ],
            tableData: [],
            demoData: {},
            filterTemplateData: [
                {
                    key: 'actives', val: '', data: [
                        { name: '查询', eventName: 'search', type: 'primary', permission: 'system:demo:view' }
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
        //初始化form数据
        initData() {
            this.demoData = {};
        },
        //保存后操作
        saved() {
            this.activeName = 'list';
            this.addLabel = '创建系统演示';
            this.initData();
            this.resetForm();
            this.getList();
        },
        //删除任务
        remove(id) {
            this.$confirm('删除后数据将无法恢复，确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                removeDemo({ id: id }).then(ret => {
                    if (ret.code === '1') {
                        this.$message.success('删除系统演示成功');
                        this.getList();
                    } else {
                        this.$message.warning('删除系统演示失败');
                    }
                });
            }).catch(() => {
                this.$message.warning('已取消删除');
            });
        },
        //编辑任务
        edit(id) {
            this.activeName = 'add';
            let obj = this.$CommonUtils.cloneObj(this.tableData.filter(obj => obj.id == id)[0]);
            this.demoData = obj;
            this.addLabel = '修改系统演示';
            this.resetForm();
        },
        search(params) {
            this.getList();
        },
        changePage() {
            this.getList();
        },
        getList() {
          getDemoList(this.params).then(ret => {
                if (ret.code === '1') {
                    if (ret['result']) {
                        this.tableData = this.handleList(ret.result.content);
                        this.total = ret.result.totalElements;
                    } else {
                        this.tableData = [];
                        this.$message.warning('系统演示列表为空');
                    }
                } else {
                    this.$message.warning('获取系统演示列表失败');
                }
            });
        },
        handleList(list) {
            list.forEach(obj => {
                obj.actives = [
                    { name: '修改', eventName: 'edit', permission: 'system:demo:edit' },
                    { name: '删除', eventName: 'remove', permission: 'system:demo:edit' }
                ];
            });
            return list;
        },
        //点击tab事件
        handleClick(key) {
            this.addLabel = '创建系统演示';
            this.initData();
            if (this.activeName == 'add') {
                this.resetForm();
            }
        },
        //重置表单
        resetForm() {
            if (this.$refs['demoForm']) {
                this.$refs['demoForm'].resetForm();
            }
        }
    },
    created() {
        this.getList();
    }
};
</script>

<style scoped>
</style>
