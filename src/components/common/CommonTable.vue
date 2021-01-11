<template>
    <div>
        <el-table
            :data="tableData"
            style="width: 100%"
            row-key="id"
            border>
            <el-table-column
                :prop="obj.key"
                :label="obj.val"
                v-for="obj in templateData" :width="obj.key == 'number'?'60':'auto'" show-overflow-tooltip>
                <!--序号-->
                <template v-if="obj.key == 'number'" v-slot="rowData">
                    {{ rowData.$index + 1 }}
                </template>
                <!--操作栏-->
                <template v-else-if="obj.key == 'actives'" v-slot="rowData">
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
                <!--日期格式化-->
                <template v-else-if="obj.type=='date'" v-slot="rowData">
                    {{ $CommonUtils.formatDateByPattern(rowData.row[obj.key], '-') }}
                </template>
                <!--对象展示-->
                <template v-else-if="obj.type=='object'" v-slot="rowData">
                    {{ rowData.row[obj.key][obj.colunmName] }}
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>

export default {
    name: 'CommonTable',
    props: {
        templateData: Array,
        tableData: Array,
        paging: Object
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
