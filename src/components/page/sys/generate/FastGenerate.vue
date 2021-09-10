<template>
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="生成列表" name="list">
            <common-table style="width: 100%;"
                          :template-data="templateData"
                          :table-data="tableData"
                          @edit="editRow" />
            <div style="text-align: left;padding-top: 15px;clear: both;">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :page-size="params.size"
                    :total="total"
                    :current-page.sync="params.page"
                    @current-change="getFastGenerateList"
                >
                </el-pagination>
            </div>
        </el-tab-pane>
        <el-tab-pane :label="addLabel" name="add">
            <fast-generate-form ref="fastGenerateForm" :form-data="formData" @saved="saved"
                                @cancelSave="activeName = 'list'"
                                style="width: 50%;" />
        </el-tab-pane>
    </el-tabs>
</template>

<script>
import FastGenerateForm from 'components/page/sys/generate/FastGenerateForm';
import CommonTable from 'components/common/CommonTable';
import { fastGenerateList } from 'api/system';

export default {
    name: 'FastGenerate',
    data: function() {
        return {
            templateData: [
                { key: 'entityName', val: '实体名' },
                { key: 'path', val: '模块路径' },
                { key: 'url', val: 'ctrl类路由' },
                { key: 'permissionPrefix', val: '权限前缀' },
                { key: 'description', val: '描述' },
                { key: 'createDate', val: '生成时间' },
                { key: 'actives', val: '操作' }
            ],
            addLabel: '生成代码',
            activeName: 'list',
            formData: {},
            tableData: [],
            total: 0,
            params: {
                page: 1,
                size: 15
            }
        };
    },
    components: { FastGenerateForm, CommonTable },
    methods: {
        saved() {
            this.activeName = 'list';
            this.getFastGenerateList();
            this.resetForm();
        },
        editRow(id) {
            this.activeName = 'add';
            this.formData = this.$CommonUtils.cloneObj(this.tableData.filter(type => type.id == id)[0]);
            this.addLabel = '重新生成';
            this.resetForm();
        },
        async getFastGenerateList() {
            fastGenerateList(this.params).then(ret => {
                this.tableData = this.handleList(ret.result.content);
                this.total = ret.result.totalElements;
            });
        },
        handleList(list) {
            list.forEach(menu => {
                menu.actives = [
                    { name: '重新生成', eventName: 'edit', permission: 'sys:generate:edit' }
                ];
                menu.createDate = this.$CommonUtils.formatDateByPattern(menu.createDate, '-');
            });
            return list;
        },
        initTypeData() {
            this.formData = {
                id: -1,
                entityName: '',
                path: '',
                url: '',
                permissionPrefix: '',
                description: ''
            };
        },
        handleClick() {
            this.addLabel = '生成代码';
            this.initTypeData();
            if (this.activeName == 'add') {
                this.resetForm();
            }
        },
        resetForm() {
            if (this.$refs['fastGenerateForm']) {
                this.$refs.fastGenerateForm.resetForm();
            }
        }

    },
    created() {
        this.getFastGenerateList();
    }
};
</script>

<style scoped>
</style>
