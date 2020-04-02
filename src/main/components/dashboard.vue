<template>
  <div class="welcomePage flex-col">
    <div class="flex-1 main align-center justify-center flex-row">
      <div class="box flex-row">
        <img src="@/main/assets/img/img1.png" class="mr10">
        <div class="info align-center justify-center flex-row">
          <div>
            {{state.user.realname}}，您好！
            <div class="welcome">欢迎来到{{state.siteTitle}}后台管理系统</div>
          </div>
        </div>
      </div>
    </div>
    <div class="copyRight tc">Copyright &copy; 2018-2019 山东瘦课网教育科技股份有限公司</div>
  </div>
</template>

<script>
import {store} from "@/store"

export default {
  data() {
    return {
      state: store.state
    }
  }
}
</script>

<style scoped>
.welcomePage { background:url(../assets/img/welcome_bg.png) 0 0 / auto 100% repeat-x; margin-left:-20px; color:#ffffff;}
.info { font-size:16px;}
.welcome { font-size:24px;}
.copyRight { padding:20px 10px; background:rgba(255, 255, 255, .15);}
</style>
