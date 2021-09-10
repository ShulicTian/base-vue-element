<template>
    <common-form ref="bulletinForm" :rules="rules" :target-data="bulletinData" :template-data="templateData"
                 @save="saveBulletin" />
</template>

<script>
import { saveBulletin } from 'api/system';
import CommonForm from 'components/common/CommonForm';

export default {
    name: 'BulletinForm',
    components: { CommonForm },
    data: function() {
        return {
            templateData: [
                {
                    key: 'type',
                    val: '类型',
                    type: 'select',
                    data: this.$CommonUtils.dictToSelectorByType('bulletin_type')
                },
                { key: 'duration', val: '时长（天）', type: 'number' },
                { key: 'title', val: '公告标题', type: 'text' },
                {
                    key: 'contentType',
                    val: '内容类型',
                    type: 'select',
                    data: this.$CommonUtils.dictToSelectorByType('bulletin_content_type')
                },
                { key: 'content', val: '内容', type: 'textarea' },
                {
                    key: 'actives', val: '', data: [
                        { name: '保存', eventName: 'save', type: 'primary' }
                    ], type: 'button'
                }
            ],
            rules: {
                type: [
                    { required: true, message: '请选择公告类型', trigger: 'change' }
                ],
                contentType: [
                    { required: true, message: '请选择内容类型', trigger: 'change' }
                ],
                duration: [
                    { required: true, message: '请输入时长', trigger: 'blur' }
                ],
                title: [
                    { required: true, message: '请输入标题', trigger: 'blur' }
                ],
                content: [
                    { required: true, message: '请输入内容', trigger: 'blur' }
                ]
            }
        };
    },
    props: {
        bulletinData: Object
    },
    methods: {
        saveBulletin(bulletin) {
            saveBulletin(bulletin).then(ret => {
                if (ret.code == 1) {
                    this.$message.success('保存公告成功');
                    this.$emit('saved');
                } else {
                    this.$message.warning('保存公告失败');
                }
            }).catch(err => {
                this.$message.warning('请求异常');
            });
        },
        resetForm() {
            if (this.$refs['bulletinForm']) {
                this.$refs['bulletinForm'].resetForm();
            }
        }
    },
    created() {
    }
};
</script>
<style scoped>
</style>
