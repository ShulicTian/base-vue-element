<template>
    <el-table
        style="width: 100%"
        :row-key="rowKey"
        :expand-row-keys="expandList"
        :default-expand-all="defaultExpandAll?defaultExpandAll:false"
        :data="tableData"
        :load="loadNode"
        lazy
        border
        :tree-props="{children: 'children',hasChildren:'hasChildren'}">
        <el-table-column
            :prop="obj.key"
            :label="obj.val"
            :width="obj.width?obj.width:'auto'"
            v-for="obj in templateData" show-overflow-tooltip>
            <!--操作栏-->
            <template v-if="obj.key == 'actives'" v-slot="rowData">
                <el-link type="primary" v-for="active in rowData.row.actives"
                         v-if="hasPermission(active.permission)"
                         @click="invokeEvent(active.eventName,rowData.row.id,rowData.row)"
                         style="margin-right: 10px;">
                    {{ active.name }}
                </el-link>
            </template>
            <!--字典展示-->
            <template v-else-if="obj.type=='dict'" v-slot="rowData">
                {{ $CommonUtils.getDictLabel(obj.dict, rowData.row[obj.key]) }}
            </template>
            <!--日期格式化 yyyy-MM-dd -->
            <template v-else-if="obj.type=='date'" v-slot="rowData">
                {{ $CommonUtils.formatDateByPattern(rowData.row[obj.key], '-') }}
            </template>
            <!--日期格式化 yyyy-MM-dd HH:mm:ss -->
            <template v-else-if="obj.type=='datetime'" v-slot="rowData">
                {{ $CommonUtils.formatDateTimeByPattern(rowData.row[obj.key], '-') }}
            </template>
            <!--数组对象展示-->
            <template v-else-if="obj.type=='array_object'" v-slot="rowData">
                <span v-if="rowData.row[obj.key] && rowData.row[obj.key].length>0">
                    {{ rowData.row[obj.key][0][obj.columnName] }}
                </span>
            </template>
            <!--数组对象中的对象展示-->
            <template v-else-if="obj.type=='array_object_object'" v-slot="rowData">
                <span
                    v-if="rowData.row[obj.key] && rowData.row[obj.key].length>0 && rowData.row[obj.key][0][obj.objectName]">
                    {{ rowData.row[obj.key][0][obj.objectName][obj.columnName] }}
                </span>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>

export default {
    name: 'CommonLazyTreeTable',
    props: {
        templateData: Array,
        tableData: Array,
        expandList: Array,
        defaultExpandAll: Boolean
    },
    data: function() {
        return {};
    },
    methods: {
        rowKey(row) {
            return row.id;
        },
        loadNode(tree, treeNode, resolve) {
            this.$emit('loadChildren', tree, function(result) {
                resolve(result);
            });
        },
        invokeEvent(eventName, data, row) {
            this.$emit(eventName, data, row);
        },
        hasPermission(perm) {
            return this.$CommonUtils.hasPermission(perm);
        }
    },
    created() {
    }
};
</script>

<style scoped>
</style>
