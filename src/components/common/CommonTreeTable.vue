<template>
    <el-table
        :data="tableData"
        style="width: 100%"
        row-key="id"
        default-expand-all
        border
        :tree-props="{children: 'children',hasChildren:'hasChildren'}">
        <el-table-column
            :prop="obj.key"
            :label="obj.val"
            v-for="obj in templateData" show-overflow-tooltip>
            <!--操作栏-->
            <template v-if="obj.key == 'actives'" v-slot="rowData">
                <el-link type="primary" v-for="active in rowData.row.actives"
                         @click="invokeEvent(active.eventName,rowData.row.id)"
                         style="margin-right: 10px;">
                    {{ active.name }}
                </el-link>
            </template>
            <!--字典展示-->
            <template v-else-if="obj.dict" v-slot="rowData">
                {{ $CommonUtils.getDictLabel(obj.dict, rowData.row[obj.key]) }}
            </template>
        </el-table-column>
    </el-table>
</template>

<script>

export default {
    name: 'CommonTreeTable',
    props: {
        templateData: Array,
        tableData: Array
    },
    data: function() {
        return {};
    },
    methods: {
        invokeEvent(eventName, data) {
            this.$emit(eventName, data);
        }
    },
    created() {
    }
};
</script>

<style scoped>
</style>
