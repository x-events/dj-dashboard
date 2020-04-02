<template>
  <header class="flex-row align-center myheader">
    <h1 class="logo" @click="$router.push('/')"><img src="@/common/assets/img/icon_dang.png"><span v-if="!state.isCollapse">{{state.siteTitle}}</span></h1>
    <div class="menuToggle" :class="state.isCollapse ? 'menu_hide':''" @click="toggle">
      <i class="ion">&#xe62b;</i>
    </div>
    <div class="flex-1">
        
    </div>
    <el-dropdown v-if="state.user.realname"
      class="userAvat"
      @command="handleCommand">
      <span class="el-dropdown-link">
        <el-avatar :src="state.user.portrait_url" :icon="`${!state.user.portrait_url?'el-icon-user-solid':''}`" fit="cover" class="myavatar"></el-avatar>
        <span class="username">{{state.user.realname}}</span>
        <i class="el-icon-caret-bottom"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="changepw">修改密码</el-dropdown-item>
        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    
  </header>
</template>

<script>
import {store} from "@/store"

export default {
  data() {
    return {
      state: store.state
    }
  },
  methods: {
    toggle: function(){
      store.set('isCollapse', !this.state.isCollapse)
    },
    handleCommand: function(command){
      switch (command) {
        case 'logout':
          this.logout()
          break;
        case 'changepw':
          this.$router.push({name: '修改密码'})
          break;
        default:
          break;
      }
    },
    logout: function() {
      this.$confirm("确认退出?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$emit("logout");
      });
    }
  }
};
</script>

<style scoped>
.myheader {
  padding: 0 20px;
  height: 60px;
  background:url(../assets/img/bg.png) center no-repeat;
  background-size:cover;
  color:#fff;
}

.logo{cursor:pointer;margin-right: 25px; font-size: 20px; font-weight: normal; height: 35px;}
.logo img, .logo span, .menuToggle, .logo { vertical-align: middle; }
.logo span { margin-left: 15px; }

.menuToggle{cursor:pointer; margin-left:35px;}
.menu_hide { margin-left:15px;;}
.menuToggle:hover{opacity: .8;}
.menuToggle .ion{font-size:1.5em;}

.userAvat .el-dropdown-link{
  color:#fff;
  cursor:pointer
}
.userAvat .el-avatar{vertical-align:middle;}
.userAvat .username{display:inline-block;vertical-align:middle;margin:0 5px 0 10px;}
.myavatar >>> img{width:100%;}
</style>
