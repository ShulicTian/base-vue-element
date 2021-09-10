<template>
    <div>
        <div style="padding-bottom: 5px;height: 30px;">
            <el-breadcrumb separator-class="el-icon-arrow-right" style="width: 60%;float: left;margin-top: 5px;">
                <el-breadcrumb-item :to="$route.matched[1].path">首页</el-breadcrumb-item>
                <el-breadcrumb-item>{{ $route.matched[1].meta.title }}</el-breadcrumb-item>
                <el-breadcrumb-item :to="$route.path">{{ $route.meta.title }}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <router-view v-if="reloadFlag"></router-view>
    </div>
</template>

<script>

export default {
    name: 'index',
    data: function() {
        return {
            reloadFlag: true
        };
    },
    computed: {},
    methods: {
    },
    created() {
    }
};
</script>

<style scoped>

</style>
