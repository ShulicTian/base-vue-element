<template>
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="菜单列表" name="list">
            <common-tree-table :templateData="templateData"
                               :tableData="tableData"
                               @add="addChild"
                               @edit="editMenu"
                               @remove="removeMenu" />
        </el-tab-pane>
        <el-tab-pane label="添加菜单" name="add">
            <menu-form ref="menuForm" :menu-data="menuData" @saveMenu="saveMenu" @cancelSave="activeName = 'list'"
                       style="width: 50%;" :tree-data="tableData" />
        </el-tab-pane>
        <el-dialog :title="dialogTitle" :visible.sync="showForm" style="padding: 10px;">
            <menu-form ref="menuFormDialog" @saveMenu="saveMenu"
                       @cancelSave="showForm = false"
                       :menu-data="menuData"
                       :tree-data="tableData" />
        </el-dialog>
    </el-tabs>
</template>

<script>
import CommonTreeTable from 'components/common/CommonTreeTable';
import MenuForm from 'components/page/sys/menu/MenuForm';
import { removeMenu } from 'api/system';

export default {
    name: 'MenuManager',
    data: function() {
        return {
            templateData: [
                { key: 'name', val: '名称' },
                { key: 'href', val: '链接' },
                { key: 'sort', val: '排序' },
                { key: 'icon', val: '图标' },
                {
                    key: 'isShow',
                    val: '可见',
                    dict: 'menu_show'
                },
                { key: 'permission', val: '权限标识' },
                { key: 'actives', val: '操作' }
            ],
            tableData: [],
            activeName: 'list',
            showForm: false,
            menuData: {
                id: '',
                name: '',
                href: '',
                icon: '',
                isShow: true,
                sort: 0,
                permission: '',
                parentId: 0
            },
            dialogTitle: '修改菜单'
        };
    },
    components: {
        MenuForm,
        CommonTreeTable
    },
    computed: {},
    methods: {
        removeMenu(id) {
            this.$confirm('确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                removeMenu({ id: id }).then(ret => {
                    if (ret.code == 1) {
                        this.getMenuList();
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
        saveMenu() {
            this.activeName = 'list';
            this.showForm = false;
            this.resetForm();
            this.getMenuList();
        },
        addChild(id) {
            this.menuData = {
                id: '',
                name: '',
                href: '',
                icon: '',
                isShow: true,
                sort: 0,
                permission: '',
                parentId: id
            };
            this.showForm = true;
            this.dialogTitle = '添加下级菜单';
            this.resetForm();
        },
        editMenu(id) {
            this.showForm = true;
            let menu = this.$CommonUtils.cloneObj(this.getById(this.tableData, id));
            menu.isShow = menu.isShow == 1 ? true : false;
            this.menuData = menu;
            this.dialogTitle = '修改菜单';
            this.resetForm();
        },
        getById(list, id) {
            let menuObj = {};
            for (let i = 0; i < list.length; i++) {
                if (list[i].id == id) {
                    menuObj = list[i];
                    break;
                }
                if (list[i].children && list[i].children.length > 0) {
                    menuObj = this.getById(list[i].children, id);
                    if (menuObj.id) {
                        break;
                    }
                }
            }
            return menuObj;
        },
        async getMenuList() {
            await this.$store.dispatch('system/requestMenuList').then(ret => {
                this.tableData = this.handleTree(ret.result);
            });
        },
        handleTree(list) {
            list.forEach(menu => {
                menu.actives = [
                    { name: '修改', eventName: 'edit' },
                    { name: '删除', eventName: 'remove' },
                    { name: '添加下级菜单', eventName: 'add' }
                ];
                if (menu.children && menu.children.length > 0) {
                    this.handleTree(menu.children);
                }
            });
            return list;
        },
        handleClick(key) {
            if (key.name == 'add') {
                if (this.$refs['menuForm']) {
                    this.$refs.menuForm.handleTreeData();
                }
                this.menuData = {
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
            if (this.$refs['menuForm']) {
                this.$refs['menuForm'].resetForm();
            }
            if (this.$refs['menuFormDialog']) {
                this.$refs['menuFormDialog'].resetForm();
            }
        }
    },
    created() {
        this.getMenuList();
    }
};
</script>

<style scoped>
.el-tabs {
    background-color: white;
}

.el-tabs__content {
    padding: 0;
}
</style>
