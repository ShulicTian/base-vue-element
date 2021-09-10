<template>
    <!--使用指引-->
    <!--
    1.一切都以JSON驱动
        key:字段名
        val:字段中文名
        type:{
                model:'表单模板',
                select:'下拉框',
                selectTree:'下拉树',
                password:'密码框',
                switch:'开关',
                treeCheckbox:'树形复选框',
                checkbox:'复选框',
                radio:'单选框',
                button:'按钮',
                image:'图片',
                selectMultipart:'级联选择框',
                dateArea:'日期范围选择器',
                date:'日期选择器',
                datetime:'日期时间选择器',
                time:'时间选择器',
                其他input基本类型...
        },
        data:[下拉框等选项数据]
    2.示例
        templateData: [
                    {
                        key: 'modelData', val: '模板', type: 'model', data: [模板数据]
                    },
                    //一切选项data都以id、name为基本字段
                    {
                        key: 'type', val: '类型', type: 'select', data: [{id:0,name:'A类'}]
                    },
                    //eventName为按钮事件名称，可自定义@eventName形式调用
                    {
                        key: 'actives', val: '', data: [
                            { name: '保存', eventName: 'save', type: 'primary' },
                            { name: '取消', eventName: 'cancel', type: '' }
                        ], type: 'button'
                    }
                ]
    -->
    <el-form ref="form" :model="formData" :rules="rules" class="demo-ruleForm" label-width="150px">
        <el-form-item v-for="temp in templateData" :label="temp.val" :prop="temp.key">
            <!--密码框-->
            <el-input v-if="temp.type==='password'" v-model="formData[temp.key]"
                      :disabled="temp.disabled?temp.disabled:false"
                      autocomplete="new-password"
                      type="password" />
            <!--开关-->
            <el-switch v-else-if="temp.type==='switch'"
                       v-model="formData[temp.key]"
                       :active-value="temp.activeVal!=undefined?temp.activeVal:true"
                       :disabled="temp.disabled?temp.disabled:false"
                       :inactive-value="temp.inactiveVal!=undefined?temp.inactiveVal:false" />
            <!--下拉框-->
            <el-select v-else-if="temp.type==='select'" v-model="formData[temp.key]"
                       :disabled="temp.disabled?temp.disabled:false"
                       :placeholder="'请选择'+temp.val"
                       clearable
                       filterable @clear="clearSelect(temp.key)">
                <el-option v-for="opt in temp.data" :label="temp.nameKey?opt[temp.nameKey]:opt.name"
                           :value="temp.valKey?opt[temp.valKey]:opt.id"></el-option>
            </el-select>
            <!--表单模板-->
            <el-select v-else-if="temp.type==='model'" v-model="modelVal"
                       :disabled="temp.disabled?temp.disabled:false"
                       :placeholder="'请选择'+temp.val"
                       clearable @change="loadModel($event,temp.data)">
                <el-option v-for="(opt,i) in temp.data" :label="opt.name" :value="i"></el-option>
            </el-select>
            <!--下拉树形菜单-->
            <el-select v-else-if="temp.type==='selectTree'" v-model="formData[temp.key]"
                       :disabled="temp.disabled?temp.disabled:false"
                       :placeholder="'请选择'+temp.val"
                       filterable>
                <el-tree
                    :data="temp.data"
                    :props="defaultProps"
                    default-expand-all>
                        <span slot-scope="{ node, data }" class="custom-tree-node">
                            <el-option :label="data.name" :value="data.id"></el-option>
                        </span>
                </el-tree>
            </el-select>
            <!--树形复选框-->
            <el-tree
                v-else-if="temp.type==='treeCheckbox'"
                :ref="temp.key"
                :data="temp.data"
                :disabled="temp.disabled?temp.disabled:false"
                :props="defaultProps"
                default-expand-all
                node-key="id"
                show-checkbox
                @check="handleCheck(arguments[1],temp.key)">
                        <span slot-scope="{ node, data }" class="custom-tree-node">
                            <i v-if="data.icon" :class="data.icon"></i>
                            <span style="margin-left: 3px;">{{ data.name }}</span>
                        </span>
            </el-tree>
            <!--单选框-->
            <el-radio-group v-else-if="temp.type==='radio'" v-model="formData[temp.key]"
                            :disabled="temp.disabled?temp.disabled:false">
                <el-radio v-for="item in temp.data" :label="item.id">{{ item.name }}</el-radio>
            </el-radio-group>
            <!--复选框-->
            <el-checkbox-group v-else-if="temp.type==='checkbox'" v-model="formData[temp.key]"
                               :disabled="temp.disabled?temp.disabled:false">
                <el-checkbox v-for="item in temp.data" :label="item.id">{{ item.name }}</el-checkbox>
            </el-checkbox-group>
            <!--按钮-->
            <div v-else-if="temp.type==='button'">
                <el-button v-for="item in temp.data" :type="item.type" @click="invokeEvent(item)">{{ item.name }}
                </el-button>
            </div>
            <!--图片-->
            <el-image v-else-if="temp.type==='image'" />
            <!--级联选择框-->
            <el-cascader
                v-else-if="temp.type==='selectMultipart'"
                v-model="formData[temp.key]"
                :disabled="temp.disabled?temp.disabled:false"
                :options="temp.data"
                :props="{ expandTrigger: 'hover',value:'id',label:'name' }"
                :show-all-levels="false" />
            <!--日期范围选择-->
            <el-date-picker
                v-else-if="temp.type==='dateArea'"
                v-model="formData[temp.key]"
                :disabled="temp.disabled?temp.disabled:false"
                end-placeholder="结束日期"
                range-separator="至"
                start-placeholder="开始日期"
                type="daterange" />
            <!--时间范围选择-->
            <el-time-picker
                v-else-if="temp.type==='timeArea'"
                v-model="formData[temp.key]"
                :disabled="temp.disabled?temp.disabled:false"
                :format="'HH:mm'"
                end-placeholder="结束时间"
                is-range
                placeholder="选择时间范围"
                range-separator="至"
                start-placeholder="开始时间">
            </el-time-picker>
            <!--日期时间选择-->
            <el-date-picker
                v-else-if="temp.type==='datetime'"
                v-model="formData[temp.key]"
                :disabled="temp.disabled?temp.disabled:false"
                placeholder="请选择时间"
                type="datetime" />
            <!--省市区级联-->
            <common-area-selector v-else-if="temp.type==='cascader'"
                                  :default-val="formData[temp.key]"
                                  :level="temp.level"
                                  :style="{width:110 * temp.level+'px'}"
                                  @change="changeAreaCas(arguments[0],temp.key)" />
            <!--插槽-->
            <slot v-else-if="temp.type==='slot'" :name="temp.key" />
            <div v-else-if="temp.type==='upload'">
                <common-upload
                    ref="uploadComp"
                    :accept="temp.accept"
                    :action="uploadUrl"
                    :default-list="temp.defaultList"
                    :fileDir="temp.fileDir"
                    :name="temp.fileName"
                    :title="'文件上传'"
                    :type="'picture-card'" @removeFile="removeFile" @uploaded="uploaded"
                />
                <span style="color: red;">一次只能上传一个文件</span>
            </div>
            <!--输入框-->
            <el-input v-else v-model="formData[temp.key]" :disabled="temp.disabled?temp.disabled:false"
                      :placeholder="temp.placeholder?temp.placeholder:'请输入'" :type="temp.type" />
        </el-form-item>
    </el-form>
</template>

<script>
import CommonAreaSelector from 'components/common/CommonAreaSelector';
import { fileSingleUploadPath } from 'api/file';
import CommonUpload from 'components/common/CommonUpload';

export default {
    name: 'CommonForm',
    props: {
        templateData: Array,
        targetData: Object,
        rules: Object
    },
    components: { CommonUpload, CommonAreaSelector },
    data: function() {
        return {
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            formData: {},
            modelVal: '',
            uploadUrl: fileSingleUploadPath
        };
    },
    methods: {
        removeFile(file) {
            this.$emit('removeFile', file);
        },
        uploaded(data) {
            this.formData.file = data;
        },
        changeAreaCas(val, key) {
            this.formData[key] = val;
        },
        loadModel(val, data) {
            if (val !== '') {
                for (let field in data[val]) {
                    this.formData[field] = data[val][field];
                }
            }
        },
        clearSelect(key) {
            this.formData[key] = null;
        },
        invokeEvent(temp) {
            if (temp.eventName === 'save') {
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
            this.formData[key] = nodes;
        },
        getRefByKey(key) {
            return this.$refs[key];
        },
        resetForm() {
            if (this.getRefByKey('form')) {
                this.getRefByKey('form').resetFields();
            }
            if (this.getRefByKey('uploadComp')) {
                this.getRefByKey('uploadComp')[0].resetFields();
            }
        }
    },
    created() {
        if (this.targetData) {
            this.formData = this.targetData;
        }
    },
    watch: {
        targetData(val) {
            this.modelVal = '';
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
