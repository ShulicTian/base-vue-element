<template>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="公告列表" name="list">
            <common-table-filter :template-data="filterTemplateData" @search="search" />
            <common-table :table-data="tableData" :template-data="templateData" style="width: 100%;"
                          @edit="editBulletin" @remove="removeBulletin" />
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
        <el-tab-pane v-if="this.$CommonUtils.hasPermission('system:bulletin:edit')" :label="addLabel" name="add">
            <bulletin-form ref="bulletinForm" :bulletin-data="bulletinData" style="width: 50%;" @saved="saved" />
        </el-tab-pane>
    </el-tabs>
</template>

<script>
import { removeBulletin, bulletinList, updateBulletinStatus, removeUser } from 'api/system';
import CommonTable from 'components/common/CommonTable';
import BulletinForm from 'components/page/sys/bulletin/BulletinForm';
import CommonTableFilter from 'components/common/CommonTableFilter';

export default {
    name: 'BulletinManage',
    components: { BulletinForm, CommonTable, CommonTableFilter },
    data: function() {
        return {
            activeName: 'list',
            addLabel: '创建公告',
            templateData: [
                { key: 'type', val: '类型', type: 'dict', dict: 'bulletin_type' },
                { key: 'title', val: '标题' },
                { key: 'contentType', val: '内容类型', type: 'dict', dict: 'bulletin_content_type' },
                { key: 'content', val: '内容' },
                { key: 'createDate', val: '创建时间', type: 'datetime' },
                { key: 'duration', val: '时长（天）' },
                { key: 'status', val: '状态', type: 'dict', dict: 'bulletin_status' },
                { key: 'actives', val: '操作' }
            ],
            tableData: [],
            bulletinData: {},
            filterTemplateData: [
                { key: 'title', val: '标题', type: 'text' },
                {
                    key: 'type', val: '类型', type: 'select',
                    data: this.$CommonUtils.dictToSelectorByType('bulletin_type')
                },
                {
                    key: 'status', val: '状态', type: 'select',
                    data: this.$CommonUtils.dictToSelectorByType('bulletin_status')
                },
                {
                    key: 'contentType', val: '内容类型', type: 'select',
                    data: this.$CommonUtils.dictToSelectorByType('bulletin_content_type')
                },
                {
                    key: 'actives', val: '', data: [
                        { name: '查询', eventName: 'search', type: 'primary', permission: 'system:bulletin:view' }
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
            this.getBulletinList();
        },
        changePage() {
            this.getBulletinList();
        },
        initBulletinData() {
            this.bulletinData = {
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
            this.addLabel = '创建公告';
            this.initBulletinData();
            this.getBulletinList();
        },
        removeBulletin(id) {
            this.$confirm('删除后数据将无法恢复，确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                removeBulletin({ id: id }).then(ret => {
                    if (ret.code == 1) {
                        this.$message.success('删除公告成功');
                        this.getBulletinList();
                    } else {
                        this.$message.warning('删除公告失败');
                    }
                }).catch(err => {
                    this.$message.warning('请求异常');
                });
            }).catch(() => {
                this.$message.warning('已取消删除');
            });
        },
        editBulletin(id) {
            this.activeName = 'add';
            let bulletinData = this.$CommonUtils.cloneObj(this.tableData.filter(bulletin => bulletin.id == id)[0]);
            if (!bulletinData.roleIdList) {
                bulletinData.roleIdList = [2];
            }
            this.bulletinData = bulletinData;
            this.bulletinData.password = '';
            this.addLabel = '修改公告';
        },
        async getBulletinList() {
            await bulletinList(this.params).then(ret => {
                if (ret.code == 1) {
                    if (ret['result']) {
                        this.tableData = this.handleList(ret.result.content);
                        this.total = ret.result.totalElements;
                    } else {
                        this.$message.warning('公告列表为空');
                    }
                } else {
                    this.$message.warning('获取公告列表失败');
                }
            }).catch(err => {
                this.$message.error('请求异常');
            });
        },
        handleList(list) {
            list.forEach(menu => {
                menu.actives = [
                    { name: '修改', eventName: 'edit', permission: 'system:bulletin:edit' },
                    { name: '删除', eventName: 'remove', permission: 'system:bulletin:edit' }
                ];
            });
            return list;
        },
        handleClick(key) {
            this.addLabel = '创建公告';
            this.initBulletinData();
        },
        resetForm() {
            if (this.$refs['bulletinForm']) {
                this.$refs['bulletinForm'].resetForm();
            }
        },
        updateBulletinStatus() {
            updateBulletinStatus({}).then(ret => {
                this.getBulletinList();
            });
        }
    },
    created() {
        this.initBulletinData();
        this.updateBulletinStatus();
    }
};
</script>

<style scoped>
</style>
