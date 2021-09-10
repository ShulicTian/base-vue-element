<template>
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="参数列表" name="list">
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
                          @remove="removeParam" @edit="editParam" />
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
        <el-tab-pane v-if="this.$CommonUtils.hasPermission('sys:param:edit')" :label="addLabel" name="add">
            <sys-param-form ref="paramForm" style="width: 50%;" @saved="saved" :param-data="paramData" />
        </el-tab-pane>
    </el-tabs>
</template>

<script>
import { paramList, removeParam } from 'api/system';
import CommonTable from 'components/common/CommonTable';
import SysParamForm from 'components/page/sys/param/SysParamForm';
import CommonTableFilter from 'components/common/CommonTableFilter';

export default {
    name: 'SysParamManage',
    components: { SysParamForm, CommonTable, CommonTableFilter },
    data: function() {
        return {
            activeName: 'list',
            addLabel: '添加参数',
            templateData: [
                { key: 'type', val: '类型', type: 'dict', dict: 'sys_param_type' },
                { key: 'paramName', val: '参数名称' },
                { key: 'paramValue', val: '参数值' },
                { key: 'paramDesc', val: '描述' },
                { key: 'actives', val: '操作' }
            ],
            tableData: [],
            paramData: {},
            filterTemplateData: [
                {
                    key: 'type',
                    val: '类型',
                    type: 'select',
                    data: this.$CommonUtils.dictToSelectorByType('sys_param_type')
                },
                { key: 'paramName', val: '参数名', type: 'text' },
                {
                    key: 'actives', val: '', data: [
                        { name: '查询', eventName: 'search', type: 'primary', permission: 'sys:param:view' }
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
            this.params.paramName = params.paramName;
            this.params.type = params.type;
            this.getParamList();
        },
        changePage() {
            this.getParamList();
        },
        initParamData() {
            this.paramData = {
                id: -1,
                type: '',
                paramName: '',
                paramValue: '',
                paramDesc: '',
                sort: 0
            };
        },
        saved() {
            this.activeName = 'list';
            this.addLabel = '添加参数';
            this.initParamData();
            this.getParamList();
        },
        removeParam(id) {
            removeParam({ id: id }).then(ret => {
                if (ret.code == 1) {
                    this.$message.success('删除参数成功');
                    this.getParamList();
                } else {
                    this.$message.warning('删除参数失败');
                }
            }).catch(err => {
                this.$message.warning('请求异常');
            });
        },
        editParam(id) {
            this.activeName = 'add';
            this.paramData = this.$CommonUtils.cloneObj(this.tableData.filter(user => user.id == id)[0]);
            this.addLabel = '修改参数';
            this.resetForm();
        },
        async getParamList() {
            await paramList(this.params).then(ret => {
                if (ret.code == 1) {
                    if (ret['result']) {
                        this.tableData = this.handleList(ret.result.content);
                        this.total = ret.result.totalElements;
                    } else {
                        this.$message.warning('参数列表为空');
                    }
                } else {
                    this.$message.warning('获取参数列表失败');
                }
            }).catch(err => {
                this.$message.error('请求异常');
            });
        },
        handleList(list) {
            list.forEach(menu => {
                menu.actives = [
                    { name: '修改', eventName: 'edit', permission: 'sys:param:edit' },
                    { name: '删除', eventName: 'remove', permission: 'sys:param:edit' }
                ];
            });
            return list;
        },
        handleClick() {
            this.addLabel = '添加参数';
            this.initParamData();
            if (this.activeName == 'add') {
                this.resetForm();
            }
        },
        resetForm() {
            if (this.$refs['paramForm']) {
                this.$refs.paramForm.resetForm();
            }
        }
    },
    created() {
        this.initParamData();
        this.getParamList();
    }
};
</script>

<style scoped>
</style>
