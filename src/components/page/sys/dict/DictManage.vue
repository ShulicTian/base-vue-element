<template>
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="字典列表" name="list">
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
                          @remove="removeDict" @edit="editDict" @addTo="addToDict" />
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
        <el-tab-pane v-if="this.$CommonUtils.hasPermission('sys:dict:edit')" :label="addLabel" name="add">
            <dict-form ref="dictForm" style="width: 50%;" @saved="saved" :dict-data="dictData" />
        </el-tab-pane>
    </el-tabs>
</template>

<script>
import { removeDict, dictList } from 'api/system';
import CommonTable from 'components/common/CommonTable';
import DictForm from 'components/page/sys/dict/DictForm';
import CommonTableFilter from 'components/common/CommonTableFilter';

export default {
    name: 'DictManage',
    components: { DictForm, CommonTable, CommonTableFilter },
    data: function() {
        return {
            activeName: 'list',
            addLabel: '添加字典',
            templateData: [
                { key: 'type', val: '类型' },
                { key: 'value', val: '值' },
                { key: 'label', val: '标签名' },
                { key: 'sort', val: '排序' },
                { key: 'description', val: '描述' },
                { key: 'actives', val: '操作' }
            ],
            tableData: [],
            dictData: {},
            filterTemplateData: [
                { key: 'type', val: '类型', type: 'text' },
                { key: 'label', val: '标签名', type: 'text' },
                {
                    key: 'actives', val: '', data: [
                        { name: '查询', eventName: 'search', type: 'primary', permission: 'sys:dict:view' }
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
            this.params.type = params.type;
            this.params.label = params.label;
            this.getDictList();
        },
        changePage() {
            this.getDictList();
        },
        initDictData() {
            this.dictData = {
                id: -1,
                label: '',
                value: '',
                type: '',
                sort: 0,
                description: ''
            };
        },
        saved() {
            this.activeName = 'list';
            this.addLabel = '添加字典';
            this.initDictData();
            this.getDictList();
        },
        removeDict(id) {
            removeDict({ id: id }).then(ret => {
                if (ret.code == 1) {
                    this.$message.success('删除字典成功');
                    this.$store.commit('system/cleanDict');
                    this.getDictList();
                } else {
                    this.$message.warning('删除字典失败');
                }
            }).catch(err => {
                console.log(err)
                this.$message.warning('请求异常');
            });
        },
        editDict(id) {
            this.activeName = 'add';
            this.dictData = this.$CommonUtils.cloneObj(this.tableData.filter(user => user.id == id)[0]);
            this.addLabel = '修改字典';
            this.resetForm();
        },
        addToDict(id) {
            this.activeName = 'add';
            this.dictData = this.$CommonUtils.cloneObj(this.tableData.filter(user => user.id == id)[0]);
            this.dictData.id = -1;
            this.dictData.sort += 30;
            this.dictData.value = '';
            this.dictData.label = '';
            this.resetForm();
        },
        async getDictList() {
            await dictList(this.params).then(ret => {
                if (ret.code == 1) {
                    if (ret['result']) {
                        this.tableData = this.handleList(ret.result.content);
                        this.total = ret.result.totalElements;
                    } else {
                        this.$message.warning('字典列表为空');
                    }
                } else {
                    this.$message.warning('获取字典列表失败');
                }
            }).catch(err => {
                console.log(err)
                this.$message.error('请求异常');
            });
        },
        handleList(list) {
            list.forEach(menu => {
                menu.actives = [
                    { name: '修改', eventName: 'edit', permission: 'sys:dict:edit' },
                    { name: '删除', eventName: 'remove', permission: 'sys:dict:edit' },
                    { name: '追加', eventName: 'addTo', permission: 'sys:dict:edit' }
                ];
            });
            return list;
        },
        handleClick() {
            this.addLabel = '添加字典';
            this.initDictData();
            if (this.activeName == 'add') {
                this.resetForm();
            }
        },
        resetForm() {
            if (this.$refs['dictForm']) {
                this.$refs.dictForm.resetForm();
            }
        }
    },
    created() {
        this.initDictData();
        this.getDictList();
    }
};
</script>

<style scoped>
</style>
