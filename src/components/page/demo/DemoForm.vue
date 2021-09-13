<template>
    <common-form ref="demoForm"
                 :rules="rules"
                 :target-data="formData"
                 :template-data="templateData"
                 @save="save" />
</template>

<script>
import CommonForm from 'components/common/CommonForm';
import {saveDemo} from "api/demo";

export default {
    name: 'DemoForm',
    data: function() {
        return {
            templateData: [
                { key: 'name', val: '姓名', type: 'text' },
                { key: 'age', val: '年龄', type: 'number' },
                {
                    key: 'actives', val: '', data: [
                        { name: '保存', eventName: 'save', type: 'primary' }
                    ], type: 'button'
                }
            ],
            rules: {
                /*name: [
                    { required: true, message: '请输入名称', trigger: 'blur' },
                    { max: 100, message: '长度最多不能超过100', trigger: 'blur' }
                ],
                parentId: [
                    { required: true, message: '请选上级菜单', trigger: 'change' }
                ]*/
            }
        };
    },
    props: {
        formData: Object
    },
    components: { CommonForm },
    methods: {
        save(obj) {
            saveDemo(obj).then(ret => {
                if (ret.code === '1') {
                    this.$message.success('保存系统演示成功');
                    this.$emit('saved');
                } else {
                    this.$message.warning('保存系统演示失败');
                }
            });
        },
        resetForm() {
            if (this.$refs['demoForm']) {
                this.$refs['demoForm'].resetForm();
            }
        }
    },
    created() {
    },
    watch: {}
};
</script>
<style scoped>
</style>
