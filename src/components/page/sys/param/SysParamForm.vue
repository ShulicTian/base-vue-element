<template>
    <common-form ref="paramForm"
                 :target-data="paramData"
                 :template-data="templateData"
                 :rules="rules"
                 @save="saveParam" />
</template>

<script>
import { saveParam } from 'api/system';
import CommonForm from 'components/common/CommonForm';

export default {
    name: 'ParamForm',
    components: { CommonForm },
    data: function() {
        return {
            templateData: [
                {
                    key: 'type',
                    val: '类型',
                    type: 'select',
                    data: this.$CommonUtils.dictToSelectorByType('sys_param_type')
                },
                { key: 'paramName', val: '参数名称', type: 'text' },
                { key: 'paramValue', val: '参数值', type: 'text' },
                { key: 'paramDesc', val: '描述', type: 'textarea' },
                {
                    key: 'actives', val: '', data: [
                        { name: '保存', eventName: 'save', type: 'primary' }
                    ], type: 'button'
                }
            ],
            rules: {
                type: [
                    { required: true, message: '请选择参数类型', trigger: 'blur' }
                ],
                paramName: [
                    { required: true, message: '请输入参数名', trigger: 'blur' },
                    { max: 100, message: '长度最多不能超过100', trigger: 'blur' }
                ],
                paramValue: [
                    { required: true, message: '请输入参数值', trigger: 'blur' },
                    { max: 100, message: '长度最多不能超过100', trigger: 'blur' }
                ],
                paramDesc: [
                    { max: 200, message: '长度最多不能超过200', trigger: 'blur' }
                ],
                sort: [
                    { required: true, message: '请输入排序', trigger: 'blur' }
                ]
            }
        };
    },
    props: {
        paramData: Object
    },
    methods: {
        saveParam(param) {
            saveParam(param).then(ret => {
                if (ret.code == 1) {
                    this.$message.success('保存参数成功');
                    this.$emit('saved');
                } else {
                    this.$message.warning('保存参数失败');
                }
            }).catch(err => {
                this.$message.warning('请求异常');
            });
        },
        resetForm() {
            if (this.$refs['paramForm']) {
                this.$refs['paramForm'].resetForm();
            }
        }
    },
    created() {
    }
};
</script>
<style scoped>
</style>
