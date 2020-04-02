<template>
  <div class="mainCont flex-row align-center justify-center">
    <el-form
      ref="validForm"
      :model="queryParam"
      :rules="rules"
      class="login-form"
      @submit.native.prevent="login">
      <p class="des"><img src="@/common/assets/img/icon_dang.png"><span>{{state.siteTitle}}</span></p>
      <div class="form-div">
        <h3 class="main-title">登录</h3>
        <el-form-item prop="username">
          <el-input :autofocus="true" v-model="queryParam.username"
            prefix-icon="el-icon-user-solid" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="queryParam.password"
            prefix-icon="el-icon-lock" placeholder="请输入密码" type="password"></el-input>
        </el-form-item>
        <el-form-item class="submit-item">
          <el-button
            native-type="submit"
            class="submit-button"
            type="primary"
            :loading="loading"
          >登录</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import * as user from "../api/user";
import {test} from '@/common/assets/util';
import {store} from "@/store";

export default {
  data() {
    return {
      state: store.state,
      loading: false,
      queryParam: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入账号", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 30, message: "长度在 6 到 30 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    login() {
      test()
      this.$refs.validForm.validate(valid => {
        if (valid) {
          this.loading = true;
          user
            .login(this.queryParam)
            .then(res => {
              this.loading = false;
             
              this.$emit("login", {
                from: this.$router.currentRoute.query.from,
                data: res.data.data
              });
            })
            .catch(err => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.mainCont { background:url(../assets/img/login_bg.png) center no-repeat;background-size: cover; }
.main-title { position: relative; margin-bottom: 10px; }
.main-title:before { content: ''; border-bottom: 3px solid #1A8FF7; width: 15px; height: 2px; position: absolute; bottom: -3px; }
.des {
  text-align: center;
  color: #fff;
  margin-bottom: 2em;
}
.des img,.des span { vertical-align: middle; }
.des span { font-size: 20px; margin-left: 10px; }

.login-form {
  width: 320px;
}
.submit-item {
  margin-top: 30px; margin-bottom: 0;
}
.submit-button{
   width: 100%;
}
.submit-button{width:100%; background: linear-gradient(to right, #1784f6 0%,#31bafc 100%);height: 46px; border: 0;}
.submit-button:active{opacity: .9;}
.form-div { background: #fff; border-radius: 15px; padding: 30px; }
</style>