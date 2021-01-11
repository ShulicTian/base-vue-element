<template>
    <el-form ref="form" :model="formData" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="temp.val" :prop="temp.key" v-for="temp in templateData">
            <!--密码框-->
            <el-input type="password" autocomplete="new-password" v-model="formData[temp.key]"
                      v-if="temp.type=='password'" />
            <!--开关-->
            <el-switch v-model="formData[temp.key]" v-else-if="temp.type=='switch'" />
            <!--下拉框-->
            <el-select @clear="clearSelect(temp.key)" clearable v-model="formData[temp.key]"
                       :placeholder="'请选择'+temp.val" v-else-if="temp.type=='select'">
                <el-option :label="opt.name" :value="opt.id" v-for="opt in temp.data"></el-option>
            </el-select>
            <!--下拉菜单-->
            <el-select filterable v-model="formData[temp.key]" :placeholder="'请选择'+temp.val"
                       v-else-if="temp.type=='selectTree'">
                <el-tree
                    :data="temp.data"
                    default-expand-all
                    :props="defaultProps">
                        <span class="custom-tree-node" slot-scope="{ node, data }">
                            <el-option :label="data.name" :value="data.id"></el-option>
                        </span>
                </el-tree>
            </el-select>
            <!--树形复选框-->
            <el-tree
                v-else-if="temp.type=='treeCheckout'"
                :ref="temp.key"
                :data="temp.data"
                node-key="id"
                :props="defaultProps"
                @check="handleCheck(arguments[1],temp.key)"
                show-checkbox
                default-expand-all>
                        <span class="custom-tree-node" slot-scope="{ node, data }">
                            <i :class="data.icon" v-if="data.icon"></i>
                            <span style="margin-left: 3px;">{{ data.name }}</span>
                        </span>
            </el-tree>
            <!--单选框-->
            <el-radio-group v-model="formData[temp.key]" v-else-if="temp.type=='radio'">
                <el-radio :label="item.id" v-for="item in temp.data">{{ item.name }}</el-radio>
            </el-radio-group>
            <!--复选框-->
            <el-checkbox-group v-model="formData[temp.key]" v-else-if="temp.type=='checkbox'">
                <el-checkbox :label="item.id" v-for="item in temp.data">{{ item.name }}</el-checkbox>
            </el-checkbox-group>
            <!--按钮-->
            <div v-else-if="temp.type=='button'">
                <el-button :type="item.type" @click="invokeEvent(item)" v-for="item in temp.data">{{ item.name }}
                </el-button>
            </div>
            <!--图片-->
            <el-image v-else-if="temp.type=='image'" />
            <!--输入框-->
            <el-input :type="temp.type" v-model="formData[temp.key]" v-else />
        </el-form-item>
    </el-form>
</template>

<script>

export default {
    name: 'CommonForm',
    props: {
        templateData: Array,
        targetData: Object,
        rules: Object
    },
    data: function() {
        return {
            fileList: [],
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
            if (temp.eventName == 'save') {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.$emit(temp.eventName, this.formData);
                    } else {
                        this.$message.warning('请输入必填信息');
                    }
                });
            } else {
                this.$emit(temp.eventName, this.formData);
            }
        },
        handleCheck(nodes, key) {
            this.formData[key] = nodes.checkedNodes.map(node => node.id).concat(nodes.halfCheckedNodes.map(node => node.id));
        },
        getRefByKey(key) {
            return this.$refs[key];
        },
        resetForm() {
            this.getRefByKey('form').resetFields();
        }
    },
    created() {
        if (this.targetData) {
            this.formData = this.targetData;
        }
    },
    watch: {
        targetData(val) {
            this.formData = val;
        }
    }
};
</script>

<style scoped>
.el-upload {
    display: inline-block;
    width: 0;
    height: 0;
    border: none;
}

.el-upload--text {
    width: 0;
    height: 0;
    border: none;
}
</style>
