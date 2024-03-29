<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <div class="collapse-btn" @click="collapseChage">
      <i v-if="!collapse" class="el-icon-s-fold"></i>
      <i v-else class="el-icon-s-unfold"></i>
    </div>
    <div :style="{width:getWidth()}" class="logo">{{ sysName }}</div>
    <el-menu :default-active="activeIndex" active-text-color="#409EFF" background-color="#242f42" class="menus"
             mode="horizontal"
             text-color="#fff"
             @select="handleSelect">
      <el-menu-item v-for="menu in tabMenuList"
                    :index="menu.index" class="items" @click="showIndex(menu)">
        {{ menu.name }}
      </el-menu-item>
    </el-menu>
    <div class="header-right">
      <div class="header-user-con">
        <!-- 全屏显示 -->
        <div class="btn-fullscreen" @click="handleFullScreen">
          <el-tooltip :content="fullscreen?`取消全屏`:`全屏`" effect="dark" placement="bottom">
            <i class="el-icon-rank"></i>
          </el-tooltip>
        </div>
        <!-- 用户头像 -->
        <div class="user-avator">
          <img src="../../assets/img/img.jpg"/>
        </div>
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{ username }}
                        <i class="el-icon-caret-bottom"></i>
                    </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="index">首页</el-dropdown-item>
            <el-dropdown-item command="loginout" divided>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
import bus from '../common/bus';
import {logout} from 'api/system';
import {mapGetters} from 'vuex';

export default {
  data() {
    return {
      activeIndex: '1',
      collapse: false,
      fullscreen: false,
      name: '',
      message: 2,
      tabMenuList: [
        // {name: '系统管理', index: '1', href: '/', type: 0, permission: 'system:manage:view'}
      ]
    };
  },
  computed: {
    ...mapGetters({
      getUser: 'system/getUser',
      sysName: 'getSysName'
    }),
    username() {
      if (this.getUser) {
        return this.getUser.name;
      }
      return '';
    }
  },
  methods: {
    hasPermission(permission) {
      return this.$CommonUtils.hasPermission(permission);
    },
    handleSelect(key) {
      this.$store.commit('system/setHeaderIndex', key);
    },
    // 用户名下拉菜单选择事件
    handleCommand(command) {
      if (command === 'loginout') {
        logout().then(res => {
          this.$store.commit('system/cleanUser');
          this.$router.push('/login').then(() => {
            this.$store.commit('system/cleanCache');
          });
        }).catch(err => {
          this.$store.commit('system/cleanUser');
          this.$router.push('/login').then(() => {
            this.$store.commit('system/cleanCache');
          });
        });
      } else if (command === 'index') {
        this.$store.dispatch('system/loadMenu').then(ret => {
          let path = this.$CommonUtils.getFirstPath(ret);
          if (path && path.indexOf(this.$route.path) === -1) {
            this.$router.push(path);
          }
        });
      } else {
        this.$router.push('/' + command);
      }
    },
    // 侧边栏折叠
    collapseChage() {
      this.collapse = !this.collapse;
      bus.$emit('collapse', this.collapse);
    },
    // 全屏事件
    handleFullScreen() {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    },
    showIndex(menu) {
      if (menu.index === '1') {
        this.$store.state.sysName = '考试运营管理服务平台';
        this.$store.dispatch('system/loadMenu', {type: menu.type}).then(ret => {
          let path = this.$CommonUtils.getFirstPath(ret);
          if (path && path.indexOf(this.$route.path) === -1) {
            this.$router.replace(path);
          }
        });
      } else {
        this.$router.push(menu.href);
      }
    },
    getWidth() {
      let l = this.sysName.length;
      let size = 22;
      return l * size + 10 + 'px';
    },
    initHeader() {
      this.activeIndex = this.$store.state.system.headerIndex;
      this.$store.state.sysName = '考试运营管理服务平台';
    }
  },
  created() {
    this.initHeader();
  },
  mounted() {
    if (document.body.clientWidth < 1500) {
      this.collapseChage();
    }
  }
};
</script>
<style scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: #fff;
}

.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 70px;
}

.header .logo {
  float: left;
  width: 250px;
  line-height: 70px;
}

.header-right {
  float: right;
  padding-right: 50px;
}

.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;
}

.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}

.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}

.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}

.btn-bell .el-icon-bell {
  color: #fff;
}

.user-name {
  margin-left: 10px;
}

.user-avator {
  margin-left: 20px;
}

.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}

.el-dropdown-menu__item {
  text-align: center;
}

.menus {
  width: 35%;
  float: left;
  height: 70px;
}

.items {
  height: 70px;
  line-height: 70px;
}
</style>
