<template>
  <div class="page p-15">
    <div
      class="p-25 auto r-5 rel"
      style="max-width: 400px;margin-top: 100px;height: 400px;background: #e0f9f3;"
    >
      <div class="abs l-50" style="margin-left: -75px;top: -50px;">
        <img src="../../../static/img/loginlogo.png" />
      </div>
      <h1
        class="f-26 normal text-center"
        style="margin-top: 120px;margin-bottom: 20px; color: #0d906d;"
      >易车驹门店管理平台</h1>
      <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" class="demo-ruleForm">
        <el-form-item prop="username">
          <el-input
            v-model="ruleForm2.username"
            placeholder="用户名/登录号"
            prefix-icon="iconfont iconuser1e"
          ></el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <el-input
            type="password"
            v-model="ruleForm2.pass"
            auto-complete="off"
            prefix-icon="iconfont iconmima"
            placeholder="密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" class="w-100" @click="submitForm(ruleForm2)">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login } from "../../request/api.js";
import qs from "qs";
export default {
  name: "login",
  data() {
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("用户名不能为空"));
      }
      setTimeout(() => {
        callback();
      }, 1000);
    };
    var validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error("密码不能为空"));
      } else {
        callback();
      }
    };

    return {
      ruleForm2: {
        // 15989450892
        username: "",
        pass: ""
      },
      rules2: {
        pass: [
          {
            validator: validatePass,
            trigger: "blur"
          }
        ],
        username: [
          {
            validator: checkAge,
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {},
  mounted() {},
  methods: {
    submitForm(formName) {
      if (!formName.username || !formName.pass) {
        this.$message({
          message: "请填写用户名和密码！",
          type: "warning"
        });
        return false;
      }

      const data = {
        username: formName.username,
        password: formName.pass
      };

      login(data).then(res => {
		//   console.log(res.data.data.sort)
        if (res.data.data.sort == 1) {
          this.$message.error("不是修理厂用户无法登录");
          return;
        }
        if (res.data.code === 200) {
          // console.log(res.data.data)
          sessionStorage.setItem("token", res.data.data.token);
          localStorage.setItem("phone", formName.username);

          this.$message({
            message: "欢迎您！",
            type: "success"
          });
          this.$router.push({
            path: "/"
          });
        }
      });
    }
  }
};
</script>
<style scoped>
.page {
  width: 100%;
  height: 100%;
  background: #ffffff url(../../../static/img/login_bg.jpg) bottom no-repeat;
}
</style>