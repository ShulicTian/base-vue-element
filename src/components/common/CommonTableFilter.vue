<template>
    <el-form ref="filterForm" :model="formData" class="demo-ruleForm">
        <el-form-item v-for="temp in templateData"
                      :label="temp.val"
                      :label-width="temp.type=='button'?'15px':'90px'" :prop="temp.key"
                      style="float: left;margin-bottom: 0;margin-bottom: 10px;">
            <!--时间选择器-->
            <el-date-picker v-if="temp.type=='date'" v-model="formData[temp.key]" placeholder="选择日期" type="date" />
            <!--单选下拉框-->
            <el-select v-else-if="temp.type=='select'" v-model="formData[temp.key]" :placeholder="'请选择'+temp.val"
                       :style="{width:(temp.width?temp.width:200)+'px'}"
                       clearable
                       filterable @clear="clearSelect(temp.key)">
                <el-option v-for="opt in temp.data" :label="opt.name"
                           :value="opt.id"></el-option>
            </el-select>
            <el-select v-else-if="temp.type==='dict'" v-model="formData[temp.key]" :placeholder="'请选择'+temp.val"
                       :style="{width:(temp.width?temp.width:200)+'px'}"
                       clearable
                       filterable @clear="clearSelect(temp.key)">
                <el-option v-for="opt in getDictSelectData(temp.dict)" :label="opt.name"
                           :value="opt.id"></el-option>
            </el-select>
            <!--字典单选下拉框-->
            <el-select v-else-if="temp.type==='dict_select'" v-model="formData[temp.key]" :placeholder="'请选择'+temp.val"
                       :style="{width:(temp.width?temp.width:200)+'px'}"
                       clearable
                       filterable @clear="clearSelect(temp.key)">
                <el-option v-for="opt in temp.data" :label="opt.label" :value="opt.value"></el-option>
            </el-select>
            <!--单选下拉树-->
            <el-select v-else-if="temp.type=='selectTree'" v-model="formData[temp.key]" :placeholder="'请选择'+temp.val"
                       clearable
                       filterable @clear="clearSelect(temp.key)">
                <el-tree
                    :data="temp.data"
                    :props="defaultProps"
                    default-expand-all>
                        <span slot-scope="{ node, data }" class="custom-tree-node">
                            <el-option :label="data.name" :value="data.id"></el-option>
                        </span>
                </el-tree>
            </el-select>
            <!--按钮-->
            <div v-else-if="temp.type=='button'">
                <el-button v-for="item in temp.data"
                           v-if="hasPermission(item.permission)"
                           :type="item.type"
                           @click="invokeEvent(item)">
                    {{ item.name }}
                </el-button>
            </div>
            <!--输入框-->
            <el-input v-else v-model="formData[temp.key]" :style="{width:(temp.width?temp.width:200)+'px'}"
                      :type="temp.type" clearable />
        </el-form-item>
    </el-form>
</template>

<script>
export default {
    name: 'CommonTableFilter',
    props: {
        templateData: Array,
        defaultData: Object
    },
    data: function() {
        return {
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            formData: {}
        };
    },
    methods: {
        getDictSelectData(dict) {
            return this.$CommonUtils.dictToSelectorByType(dict);
        },
        clearSelect(key) {
            this.formData[key] = null;
        },
        invokeEvent(temp) {
            this.$emit(temp.eventName, this.formData);
        },
        getRefByKey(key) {
            return this.$refs[key];
        },
        resetForm() {
            this.getRefByKey('filterForm').resetFields();
        },
        hasPermission(perm) {
            return this.$CommonUtils.hasPermissionByMul(perm);
        },
        initData(val) {
            if (val) {
                for (let key in val) {
                    this.formData[key] = val[key];
                }
            }
        }
    },
    created() {
        this.initData(this.defaultData);
    },
    watch: {
        defaultData(val) {
            this.initData(val);
        }
    }
};
</script>