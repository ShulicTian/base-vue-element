<template>
    <div>
        <el-table
            :data="tableData"
            :height="height"
            :show-summary="summary"
            border
            row-key="id"
            @selection-change="handleSelectionChange">
            <el-table-column
                v-for="obj in templateData"
                :label="obj.val"
                :prop="obj.key"
                :show-overflow-tooltip="obj.key != 'actives'?true:false"
                :type="obj.columnType"
                :width="obj.key == 'number'?'60':obj.width?obj.width:'auto'">
                <template v-slot:header>
                    <el-tooltip v-if="obj.title" :content="obj.title" class="item" effect="dark" placement="top-start">
                        <div>{{ obj.val }}&nbsp;<el-icon class="el-icon-question" style="font-size: 15px;" />
                        </div>
                    </el-tooltip>
                    <div v-else>{{ obj.val }}</div>
                </template>
                <!--序号-->
                <template v-if="obj.key == 'number'" v-slot="rowData">
                    {{ rowData.$index + 1 }}
                </template>
                <!--操作栏-->
                <template v-else-if="obj.key == 'actives'" v-slot="rowData">
                    <el-link v-for="active in rowData.row.actives" v-if="hasPermission(active.permission)"
                             :disabled="active.disabled?true:false"
                             style="margin-right: 10px;"
                             type="primary"
                             @click="invokeEvent(active.eventName,rowData.row.id,rowData.row)">
                        {{ active.name }}
                    </el-link>
                </template>
                <!--字典展示-->
                <template v-else-if="obj.type=='dict'" v-slot="rowData">
                    {{ $CommonUtils.getDictLabel(obj.dict, handleObject(rowData.row, obj.key)) }}
                </template>
                <!--日期格式化-->
                <template v-else-if="obj.type=='date'" v-slot="rowData">
                    {{ $CommonUtils.formatDateByPattern(handleObject(rowData.row, obj.key), '-') }}
                </template>
                <!--日期格式化-->
                <template v-else-if="obj.type=='datetime'" v-slot="rowData">
                    {{ $CommonUtils.formatDateTimeByPattern(handleObject(rowData.row, obj.key), '-') }}
                </template>
                <!--时间格式化-->
                <template v-else-if="obj.type=='time'" v-slot="rowData">
                    {{ $CommonUtils.formatTime(handleObject(rowData.row, obj.key)) }}
                </template>
                <!--对象展示-->
                <template v-else-if="obj.type=='object'" v-slot="rowData">
                    {{ rowData.row[obj.key] ? rowData.row[obj.key][obj.columnName] : '' }}
                </template>
                <!--对象加字典展示-->
                <template v-else-if="obj.type=='object_dict'" v-slot="rowData">
                    {{ $CommonUtils.getDictLabel(obj.dict, rowData.row[obj.key] ? rowData.row[obj.key][obj.columnName] : '')
                    }}
                </template>
                <!--开关展示-->
                <template v-else-if="obj.type=='switch'" v-slot="rowData">
                    <el-switch
                        v-model="rowData.row[obj.key]"
                        active-text="开启"
                        inactive-text="关闭"
                        @change="invokeEvent('switchChange',rowData.row.id)" />
                </template>
                <!--布尔值展示-->
                <template v-else-if="obj.type=='boolean'" v-slot="rowData">
                    {{ rowData.row[obj.key] ? obj.data[1] : obj.data[0] }}
                </template>
                <!--链接展示-->
                <template v-else-if="obj.type=='link'" v-slot="rowData">
                    <el-link type="primary" @click="invokeEvent('link',rowData.row)">
                        {{ rowData.row[obj.key] }}
                    </el-link>
                </template>
                <!--计算-->
                <template v-else-if="obj.type==='computed'" v-slot="rowData">
                    {{ obj.func(rowData.row) }}
                </template>
                <!--v-html-->
                <template v-else-if="obj.type==='html'" v-slot="rowData">
                    <div v-html="obj.func(rowData.row)"></div>
                </template>
                <!--计算-->
                <template v-else-if="obj.type==='formatter'" v-slot="rowData">
                    {{ obj.func(rowData.row, $CommonUtils) }}
                </template>
                <!--图片-->
                <template v-else-if="obj.type==='image_object'" v-slot="rowData">
                    <el-link type="primary" @click="showImage(handleObject(rowData.row,obj.key))">查看图片</el-link>
                </template>
                <!--下载-->
                <template v-else-if="obj.type==='download'" v-slot="rowData">
                    <el-link v-loading="loading" type="primary"
                             @click="downloadFile(handleObject(rowData.row,obj.key))">点击下载
                    </el-link>
                </template>
                <!--异步请求数据-->
                <template v-else-if="obj.type==='async'" v-slot="rowData">
                    <el-image
                        :src="reload"
                        style="width: 0px; height: 0px"
                        @error="getAsyncResult(obj,rowData.row)"></el-image>
                    {{ obj.result }}
                </template>
                <!--自定义下载-->
                <template v-else-if="obj.type==='download_diy'" v-slot="rowData">
                    <el-link type="primary"
                             @click="obj.func(rowData.row)">{{ obj.val }}
                    </el-link>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :visible.sync="showFlag" title="图片">
            <el-image
                :fit="'fill'"
                :src="imagePath"></el-image>
        </el-dialog>
    </div>
</template>

<script>

export default {
    name: 'CommonTable',
    props: {
        templateData: Array,
        tableData: Array,
        paging: Object,
        type: String,
        height: String,
        summary: Boolean
    },
    data: function() {
        return {
            showFlag: false,
            imagePath: '',
            loading: false,
            reload: ''
        };
    },
    methods: {
        getAsyncResult(obj, rowData) {
            obj.result = '加载中...';
            obj.func(rowData, obj).then(ret => {
                obj.result = ret;
            });
        },
        downloadFile(file) {
            file.bucketName = file.rootDir;
            this.loading = true;
            this.$store.dispatch('file/fileDownload', file).then(ret => {
                this.loading = false;
                if (ret) {
                    this.$message.success('下载成功');
                } else {
                    this.$message.warning('下载失败');
                }
            });
        },
        showImage(image) {
            this.$store.dispatch('file/getFileUrl', { bucketName: image.rootDir, path: image.path }).then(ret => {
                if (ret) {
                    this.imagePath = ret;
                    this.showFlag = true;
                }
            });
        },
        handleObject(row, columns) {
            let res = row;
            columns.split('.').forEach(ret => {
                res = res[ret];
            });
            return res;
        },
        invokeEvent(eventName, data, row) {
            this.$emit(eventName, data, row);
        },
        hasPermission(perm) {
            if (perm.indexOf(',') !== -1) {
                return this.$CommonUtils.hasPermissionByMul(perm);
            }
            return this.$CommonUtils.hasPermission(perm);
        },
        handleSelectionChange(rows) {
            this.$emit('selection-change', rows);
        }
    },
    created() {
    }
};
</script>

<style scoped>
</style>
