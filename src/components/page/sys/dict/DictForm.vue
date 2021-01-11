<template>
    <common-form ref="dictForm"
                 :target-data="dictData"
                 :template-data="templateData"
                 :rules="rules"
                 @save="saveDict($event,true)"
                 @keep="saveDict($event,false)" />
</template>

<script>
import { saveDict } from 'api/system';
import CommonForm from 'components/common/CommonForm';

export default {
    name: 'DictForm',
    components: { CommonForm },
    data: function() {
        return {
            templateData: [
                { key: 'type', val: '类型', type: 'text' },
                { key: 'value', val: '值', type: 'text' },
                { key: 'label', val: '标签名', type: 'text' },
                { key: 'sort', val: '排序', type: 'number' },
                { key: 'description', val: '描述', type: 'textarea' },
                {
                    key: 'actives', val: '', data: [
                        { name: '保存', eventName: 'save', type: 'primary' },
                        { name: '保存并继续添加', eventName: 'keep', type: 'primary' }
                    ], type: 'button'
                }
            ],
            rules: {
                type: [
                    { required: true, message: '请输入类型', trigger: 'blur' },
                    { max: 100, message: '长度最多不能超过100', trigger: 'blur' }
                ],
                value: [
                    { required: true, message: '请输入值', trigger: 'blur' },
                    { max: 100, message: '长度最多不能超过100', trigger: 'blur' }
                ],
                label: [
                    { required: true, message: '请输入标签名', trigger: 'blur' },
                    { max: 100, message: '长度最多不能超过100', trigger: 'blur' }
                ],
                sort: [
                    { required: true, message: '请输入排序', trigger: 'blur' }
                ]
            }
        };
    },
    props: {
        dictData: Object
    },
    methods: {
        saveDict(dict, back) {
            saveDict(dict).then(ret => {
                if (ret.code == 1) {
                    this.$message.success('保存字典成功');
                    if (back) {
                        this.$emit('saved');
                    } else {
                        this.dictData.id = -1;
                        this.dictData.sort = parseInt(this.dictData.sort) + 30;
                        this.dictData.value = '';
                        this.dictData.label = '';
                    }
                    this.$store.commit('system/cleanDict');
                } else {
                    this.$message.warning('保存字典失败');
                }
            }).catch(err => {
                console.log(err)
                this.$message.warning('请求异常');
            });
        },
        resetForm() {
            if (this.$refs['dictForm']) {
                this.$refs['dictForm'].resetForm();
            }
        }
    },
    created() {
    }
};
</script>
<style scoped>
</style>
