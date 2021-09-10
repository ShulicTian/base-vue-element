<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
        >
            <template v-for="item in menuList">
                <template v-if="item.children">
                    <el-submenu :index="item.id+item.href" :key="item.id+item.href">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.name }}</span>
                        </template>
                        <template v-for="subItem in item.children">
                            <el-submenu
                                v-if="subItem.children"
                                :index="subItem.id+subItem.href"
                                :key="subItem.id+subItem.href">
                                <template slot="title">
                                    <i :class="subItem.icon"></i>
                                    <span slot="title">{{ subItem.name }}</span>
                                </template>
                                <el-menu-item
                                    v-for="(threeItem,i) in subItem.children"
                                    :key="threeItem.href"
                                    :index="threeItem.href">
                                    <template slot="title">
                                        <i :class="threeItem.icon"></i>
                                        <span slot="title">{{ threeItem.name }}</span>
                                    </template>
                                </el-menu-item>
                            </el-submenu>
                            <template v-else>
                                <el-menu-item :index="subItem.href" :key="subItem.href">
                                    <i :class="subItem.icon"></i>
                                    <span slot="title">{{ subItem.name }}</span>
                                </el-menu-item>
                            </template>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.href" :key="item.href">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.name }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from '../common/bus';
import { mapState } from 'vuex';

export default {
    data() {
        return {
            collapse: false
        };
    },
    computed: {
        onRoutes() {
            this.$store.commit('system/setMenuName', this.$route.meta.title || null);
            return '/' + this.$route.path.replace('/', '');
        },
        ...mapState({
            menuList: state => state.system.menuList
        })
    },
    methods: {},
    created() {
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on('collapse', msg => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);
        });
    }
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}

.sidebar::-webkit-scrollbar {
    width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}

.sidebar > ul {
    height: 100%;
}
</style>
