<template>
  <div class="login">
    <el-form :model="ruleLogin" :rules="rules" ref="ruleLogin" label-position="left" label-width="0px" class="demo-ruleForm login-container">
      <h3 class="title">liuying's Blog Admin</h3>
      <el-form-item prop="account">
        <el-input type="text" v-model="ruleLogin.account" auto-complete="off" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="checkPass">
        <el-input type="password" v-model="ruleLogin.checkPass" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
      <el-checkbox v-model="checked" checked class="remember">Remember password</el-checkbox>
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit" :loading="logining">Login</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      logining: false,
      ruleLogin: {
        account: 'admin',
        checkPass: '123456'
      },
      rules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        checkPass: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      checked: true
    }
  },
  methods: {
    handleSubmit (ev) {
      this.$refs.ruleLogin.validate((valid) => {
        if (valid) {
          this.logining = true
          let loginParams = { username: this.ruleLogin.account, password: this.ruleLogin.checkPass }
          sessionStorage.setItem('user', JSON.stringify(loginParams))
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}

</script>

<style lang="stylus" scoped>
  .login
    box-sizing border-box
    height 100%vh
    padding-top 25%vh
    width 100%
    background #1f2d3d
    .login-container
      border-radius 5px
      background-clip padding-box
      margin 0 auto
      width 350px
      padding 35px 35px 15px 35px
      background #ffffff
      border 1px solid #eaeaea
      box-shadow 0 0 5px #cac6c6
      .title
        margin 0px auto 40px auto
        text-align center
        color #505458
      .remember
        margin 0px 0px 35px 0px
</style>
