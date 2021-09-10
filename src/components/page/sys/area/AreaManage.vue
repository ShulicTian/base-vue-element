<template>
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="区域列表" name="list">
            <common-lazy-tree-table :template-data="templateData"
                                    :table-data="tableData"
                                    :expand-list="expandList"
                                    @loadChildren="loadChildren"
                                    @add="addChild"
                                    @edit="editArea"
                                    @remove="removeArea" />
        </el-tab-pane>
        <el-tab-pane v-if="this.$CommonUtils.hasPermission('sys:area:edit')" label="添加区域" name="add">
            <area-form ref="areaForm" :area-data="areaData" @saveArea="saveArea" @cancelSave="activeName = 'list'"
                       style="width: 50%;" :tree-data="tableData" />
        </el-tab-pane>
        <el-dialog :title="dialogTitle" :visible.sync="showForm" style="padding: 10px;">
            <area-form ref="areaFormDialog" @saveArea="saveArea"
                       @cancelSave="showForm = false"
                       :area-data="areaData"
                       :tree-data="tableData" />
        </el-dialog>
    </el-tabs>
</template>

<script>
import { removeArea } from 'api/system';
import AreaForm from 'components/page/sys/area/AreaForm';
import CommonLazyTreeTable from 'components/common/CommonLazyTreeTable';

export default {
    name: 'AreaManage',
    components: {
        CommonLazyTreeTable,
        AreaForm
    },
    data: function() {
        return {
            templateData: [
                { key: 'name', val: '区域名称' },
                { key: 'code', val: '区域编码' },
                { key: 'sort', val: '排序' },
                { key: 'type', val: '区域类型', type: 'dict', dict: 'area_type' },
                { key: 'actives', val: '操作' }
            ],
            tableData: [],
            expandList: [],
            activeName: 'list',
            showForm: false,
            areaData: {
                id: -1,
                name: '',
                href: '',
                icon: '',
                isShow: true,
                sort: 0,
                permission: '',
                parentId: 0
            },
            dialogTitle: '修改区域'

        };
    },
    methods: {
        removeArea(id) {
            this.$confirm('确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                removeArea({ id: id }).then(ret => {
                    if (ret.code == 1) {
                        this.getAreaList();
                        this.$message.success('删除成功');
                    } else {
                        this.$message.warning('删除失败');
                    }
                }).catch(err => {
                    this.$message.error('删除异常');
                });
            }).catch(() => {
                this.$message.warning('已取消删除');
            });
        },
        saveArea() {
            this.activeName = 'list';
            this.showForm = false;
            this.resetForm();
            this.getAreaList();
        },
        addChild(id) {
            this.areaData = {
                id: -1,
                name: '',
                href: '',
                icon: '',
                isShow: true,
                sort: 0,
                permission: '',
                parentId: id
            };
            this.showForm = true;
            this.dialogTitle = '添加下级区域';
            this.resetForm();
        },
        editArea(id) {
            this.showForm = true;
            let area = this.$CommonUtils.cloneObj(this.$CommonUtils.getById(this.tableData, id));
            area.isShow = area.isShow == 1 ? true : false;
            this.areaData = area;
            this.dialogTitle = '修改区域';
            this.resetForm();
        },
        async getAreaList() {
            await this.$store.dispatch('system/requestAreaList').then(ret => {
                ret.result.filter(area => area.type < 1).map(area => area.id).forEach(id => {
                    this.expandList.push(id + '');
                });
                this.tableData = this.handleTree(ret.result, 2);
            });
        },
        loadChildren(area, callback) {
            this.handleTreeChildren(this.$store.state.system.allAreaList, area, -1);
            callback(area.children);
        },
        handleTree(list, level) {
            if (list.length > 0) {
                list.forEach(area => {
                    area.actives = [
                        { name: '修改', eventName: 'edit', permission: 'sys:area:edit' },
                        { name: '删除', eventName: 'remove', permission: 'sys:area:edit' },
                        { name: '添加下级区域', eventName: 'add', permission: 'sys:area:edit' }
                    ];
                });
                let root = list.filter(area => area.id == 0)[0];
                this.handleTreeChildren(list, root, level);
                return root.children;
            }
            return [];
        },
        handleTreeChildren(list, area, level) {
            let children = list.filter(obj => obj.parentId == area.id && obj.id != 0);
            if (children && children.length > 0) {
                area.children = children;
                if (level == -1 || level > 0) {
                    if (level != -1) {
                        level--;
                    }
                    area.children.forEach(obj => {
                        this.handleTreeChildren(list, obj, level);
                    });
                } else {
                    area.children.forEach(obj => {
                        if (list.filter(obj2 => obj2.parentId == obj.id).length > 0) {
                            obj.hasChildren = true;
                        }
                    });
                }
            }
        },
        handleClick(key) {
            if (key.name == 'add') {
                if (this.$refs['areaForm']) {
                    this.$refs.areaForm.handleTreeData();
                }
                this.areaData = {
                    id: '',
                    name: '',
                    href: '',
                    icon: '',
                    isShow: true,
                    sort: 0,
                    permission: '',
                    parentId: 0
                };
                this.resetForm();
            }
        },
        resetForm() {
            if (this.$refs['areaForm']) {
                this.$refs['areaForm'].resetForm();
            }
            if (this.$refs['areaFormDialog']) {
                this.$refs['areaFormDialog'].resetForm();
            }
        }
    },
    created() {
        this.getAreaList();
    }
};
</script>

<style scoped>
</style>
