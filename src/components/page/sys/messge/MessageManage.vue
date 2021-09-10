<template>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="消息列表" name="list">
            <common-table-filter :template-data="filterTemplateData" @search="search" />
            <common-table :table-data="tableData" :template-data="templateData" style="width: 100%;"
                          @edit="editMessage" @remove="removeMessage" />
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
        <el-tab-pane v-if="this.$CommonUtils.hasPermission('exam:message:edit')" :label="addLabel" name="add">
            <room-log-form ref="messageForm" :room-log-data="messageData" style="width: 50%;" @saved="saved" />
        </el-tab-pane>
    </el-tabs>
</template>

<script>
import { removeMessage } from 'api/exam/message';
import CommonTable from 'components/common/CommonTable';
import MessageForm from 'components/page/exam/message/MessageForm';
import CommonTableFilter from 'components/common/CommonTableFilter';

export default {
    name: 'MessageManage',
    components: { MessageForm, CommonTable, CommonTableFilter },
    data: function() {
        return {
            activeName: 'list',
            addLabel: '创建消息',
            templateData: [
                { key: 'type', val: '类型', type: 'dict', dict: 'message_type' },
                { key: 'title', val: '标题' },
                { key: 'contentType', val: '内容类型', type: 'dict', dict: 'message_content_type' },
                { key: 'content', val: '内容' },
                { key: 'createDate', val: '创建时间', type: 'datetime' },
                { key: 'duration', val: '时长（天）' },
                { key: 'status', val: '状态', type: 'dict', dict: 'message_status' },
                { key: 'actives', val: '操作' }
            ],
            tableData: [],
            messageData: {},
            filterTemplateData: [
                { key: 'title', val: '标题', type: 'text' },
                {
                    key: 'type', val: '类型', type: 'select',
                    data: this.$CommonUtils.dictToSelectorByType('message_type')
                },
                {
                    key: 'status', val: '状态', type: 'select',
                    data: this.$CommonUtils.dictToSelectorByType('message_status')
                },
                {
                    key: 'contentType', val: '内容类型', type: 'select',
                    data: this.$CommonUtils.dictToSelectorByType('message_content_type')
                },
                {
                    key: 'actives', val: '', data: [
                        { name: '查询', eventName: 'search', type: 'primary', permission: 'system:message:view' }
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
            this.params.title = params.title || null;
            this.params.type = params.type || null;
            this.params.status = params.status || null;
            this.params.contentType = params.contentType || null;
            this.getMessageList();
        },
        changePage() {
            this.getMessageList();
        },
        initMessageData() {
            this.messageData = {
                id: '',
                title: '',
                type: '0',
                contentType: '0',
                content: '',
                duration: '',
                status: '1'
            };
            this.resetForm();
        },
        saved() {
            this.activeName = 'list';
            this.addLabel = '创建消息';
            this.initMessageData();
            this.getMessageList();
        },
        removeMessage(id) {
            this.$confirm('删除后数据将无法恢复，确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                removeMessage({ id: id }).then(ret => {
                    if (ret.code == 1) {
                        this.$message.success('删除消息成功');
                        this.getMessageList();
                    } else {
                        this.$message.warning('删除消息失败');
                    }
                }).catch(err => {
                    this.$message.warning('请求异常');
                });
            }).catch(() => {
                this.$message.warning('已取消删除');
            });
        },
        editMessage(id) {
            this.activeName = 'add';
            let messageData = this.$CommonUtils.cloneObj(this.tableData.filter(message => message.id == id)[0]);
            if (!messageData.roleIdList) {
                messageData.roleIdList = [2];
            }
            this.messageData = messageData;
            this.messageData.password = '';
            this.addLabel = '修改消息';
        },
        async getMessageList() {
            await messageList(this.params).then(ret => {
                if (ret.code == 1) {
                    if (ret['result']) {
                        this.tableData = this.handleList(ret.result.content);
                        this.total = ret.result.totalElements;
                    } else {
                        this.$message.warning('消息列表为空');
                    }
                } else {
                    this.$message.warning('获取消息列表失败');
                }
            }).catch(err => {
                this.$message.error('请求异常');
            });
        },
        handleList(list) {
            list.forEach(menu => {
                menu.actives = [
                    { name: '修改', eventName: 'edit', permission: 'system:message:edit' },
                    { name: '删除', eventName: 'remove', permission: 'system:message:edit' }
                ];
            });
            return list;
        },
        handleClick(key) {
            this.addLabel = '创建消息';
            this.initMessageData();
        },
        resetForm() {
            if (this.$refs['messageForm']) {
                this.$refs['messageForm'].resetForm();
            }
        },
        updateMessageStatus() {
            updateMessageStatus({}).then(ret => {
                this.getMessageList();
            });
        }
    },
    created() {
        this.initMessageData();
        this.updateMessageStatus();
    }
};
</script>

<style scoped>
</style>
