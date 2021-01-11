<template>
    <el-form ref="filterForm" :model="formData" class="demo-ruleForm">
        <el-form-item style="float: left;margin-bottom: 0;margin-bottom: 10px;"
                      :label-width="temp.type=='button'?'15px':'80px'"
                      :label="temp.val" :prop="temp.key" v-for="temp in templateData">
            <!--时间选择器-->
            <el-date-picker type="date" placeholder="选择日期" v-model="formData[temp.key]" v-if="temp.type=='date'" />
            <!--单选下拉框-->
            <el-select @clear="clearSelect(temp.key)" clearable filterable v-model="formData[temp.key]"
                       :placeholder="'请选择'+temp.val" v-else-if="temp.type=='select'">
                <el-option :label="opt.name" :value="opt.id" v-for="opt in temp.data"></el-option>
            </el-select>
            <!--单选下拉树-->
            <el-select @clear="clearSelect(temp.key)" clearable filterable v-model="formData[temp.key]"
                       :placeholder="'请选择'+temp.val" v-else-if="temp.type=='selectTree'">
                <el-tree
                    :data="temp.data"
                    default-expand-all
                    :props="defaultProps">
                        <span class="custom-tree-node" slot-scope="{ node, data }">
                            <el-option :label="data.name" :value="data.id"></el-option>
                        </span>
                </el-tree>
            </el-select>
            <!--按钮-->
            <div v-else-if="temp.type=='button'">
                <el-button :type="item.type" @click="invokeEvent(item)" v-for="item in temp.data">{{ item.name }}
                </el-button>
            </div>
            <!--输入框-->
            <el-input :type="temp.type" v-model="formData[temp.key]" v-else />
        </el-form-item>
    </el-form>
</template>

<script>
export default {
    name: 'CommonTableFilter',
    props: {
        templateData: Array
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
        }
    },
    created() {
    }
};
</script>

<style scoped>
</style>
