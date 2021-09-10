<template>
    <div>
        <el-upload
            v-loading="loading"
            :accept="accept"
            :action="action"
            :before-upload="uploadBefore"
            :data="params"
            :disabled="disabled"
            :file-list="fileList"
            :limit="1"
            :list-type="type"
            :name="'file'"
            :on-error="uploadFailed"
            :on-success="uploaded">
            <span>{{ title }}</span>
            <div slot="file" slot-scope="{file}">
                <div class="el-upload-list__item-thumbnail">
                    <el-image
                        v-if="file.raw && file.raw.type.indexOf('image')!==-1"
                        :src="file.url"
                        alt=""
                    />
                    <div v-else style="background-color: rgba(50,50,50,0.8);color: rgb(230,230,230);">
                        <div style="height: 50%;padding: 20% 0 0 0;text-align: center;"><i class="el-icon-document"
                                                                                           style="font-size: 25px;"></i>
                        </div>
                        <div style="text-align: center;padding: 5% 5%;">{{ file.name }}</div>
                    </div>
                </div>
                <span class="el-upload-list__item-actions">
                    <span
                        class="el-upload-list__item-preview"
                        @click="handlePictureCardPreview(file)">
                      <i class="el-icon-zoom-in"></i>
                    </span>
                    <span
                        v-if="!disabled"
                        class="el-upload-list__item-delete"
                        @click="handleDownload(file)">
                      <i class="el-icon-download"></i>
                    </span>
                    <span
                        v-if="!disabled"
                        class="el-upload-list__item-delete"
                        @click="handleRemove(file)">
                      <i class="el-icon-delete"></i>
                    </span>
                </span>
            </div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
            <img :src="dialogImageUrl" alt="" width="100%">
        </el-dialog>
    </div>
</template>

<script>

export default {
    name: 'CommonUpload',
    data: function() {
        return {
            dialogImageUrl: '',
            dialogVisible: false,
            params: {
                bucketName: this.$store.state.file.defaultBucketName
            },
            fileList: [],
            loading: false
        };
    },
    props: {
        action: String,
        title: String,
        accept: String,
        fileDir: String,
        name: String,
        disabled: Boolean,
        type: String,
        defaultList: Array
    },
    methods: {
        handleRemove(file) {
            console.log(file);
            this.fileList = [];
            this.params.path = file.path || this.fileDir;
            this.$store.dispatch('file/fileRemove', this.params).then(ret => {
                if (file.id) {
                    this.$emit('removeFile', file);
                }
                this.fileList = [];
            });
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        handleDownload(file) {
            const link = document.createElement('a');
            link.target = '_blank';
            link.class = 'downloadTags';
            link.download = file.name;
            link.style.display = 'none';
            link.href = file.url;
            document.body.appendChild(link);
            link.click();
            URL.revokeObjectURL(link.href);
            link.remove();
        },
        uploadBefore(file) {
            this.params.fileName = file.name;
            this.params.path = this.fileDir + Date.now() + '_' + file.name;
            this.params.type = file.type;
            this.loading = true;
            return true;
        },
        uploaded(ret) {
            this.loading = false;
            if (ret.code === '1') {
                this.params.name = this.name;
                this.$emit('uploaded', this.params);
                this.$message.success('上传成功');
            } else {
                this.$message.warning('上传失败');
            }
        },
        uploadFailed() {
            this.$message.error('上传异常');
        },
        resetFields() {
            this.fileList = [];
        }
    },
    created() {
        if (this.defaultList) {
            this.fileList = this.defaultList;
        }
    },
    watch: {
        defaultList(val) {
            if (val) {
                this.fileList = val;
            }
        }
    }
};
</script>

<style scoped>
.refClass:hover {
    opacity: 0.6;
    cursor: pointer;
}
</style>
