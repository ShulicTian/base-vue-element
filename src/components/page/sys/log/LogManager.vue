<template>
    <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="日志列表" name="list">
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
            <common-table style="width: 100%;"
                          :template-data="templateData"
                          :table-data="tableData" />
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
    </el-tabs>
</template>

<script>
import { logList, getUserNameById } from 'api/system';
import CommonTable from 'components/common/CommonTable';
import CommonTableFilter from 'components/common/CommonTableFilter';

export default {
    name: 'LogManager',
    components: { CommonTable, CommonTableFilter },
    data: function() {
        return {
            activeName: 'list',
            templateData: [
                { key: 'number', val: '序号' },
                { key: 'title', val: '操作菜单' },
                { key: 'createBy', val: '操作用户' },
                { key: 'requestUri', val: 'URI' },
                { key: 'method', val: '提交方式' },
                { key: 'remoteAddr', val: 'IP' },
                { key: 'createDate', val: '操作时间', type: 'date' }
            ],
            filterTemplateData: [
                { key: 'createDate', val: '日期', type: 'date' },
                { key: 'createBy', val: '用户ID', type: 'text' },
                {
                    key: 'actives', val: '', data: [
                        { name: '查询', eventName: 'search', type: 'primary' }
                    ], type: 'button'
                }
            ],
            tableData: [],
            total: 0,
            params: {
                page: 1,
                size: 15
            }

        };
    },
    methods: {
        search(params) {
            this.params.createDate = params.createDate;
            this.params.createBy = params.createBy;
            this.getLogList();
        },
        changePage() {
            this.getLogList();
        },
        async getLogList() {
            await logList(this.params).then(ret => {
                if (ret.code == 1) {
                    if (!ret['result'].empty) {
                        this.handleData(ret.result.content);
                        this.tableData = ret.result.content;
                        this.total = ret.result.totalElements;
                    } else {
                        this.tableData = [];
                        this.$message.warning('日志列表为空');
                    }
                } else {
                    this.$message.warning('获取日志列表失败');
                }
            }).catch(err => {
                this.$message.error('请求异常');
            });
        },
        handleData(list) {
            list.forEach(async log => {
                log.createBy = await this.$store.dispatch('system/getNameById', log.createBy);
            });
        }
    },
    created() {
        this.getLogList();
    }
};
</script>

<style scoped>
</style>
