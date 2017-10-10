<template>
  <div class="log-form">
    <Card :bordered="false">
      <p slot="title" style="text-align: center;">请登录</p>
      <Form ref="loginForm" :model="loginForm" :rules="loginFormRule">
        <FormItem prop="user">
          <Input type="text" v-model="loginForm.user" placeholder="用户名">
          <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem prop="password">
          <Input type="password" v-model="loginForm.password" placeholder="密码">
          <Icon type="ios-locked-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>

        <div style="text-align: center">
          <Button type="primary" @click="handleSubmit('loginForm')">登录</Button>
          <Button type="ghost" style="margin-left: 8px">取消</Button>
        </div>
        <div style="padding: 20px">
          <span style="float: left">
            <Switch v-model="loginForm.rememberMe" @on-change="changeRememberMe"> </Switch>  记住我
          </span>
          <a class="forgot" href="#">忘记密码?</a>
        </div>
      </Form>
    </Card>


  </div><!--end log form -->

</template>

<style rel="stylesheet/less" type="text/css" lang="less">

  @blue :#3399ff;
  .log-form {
    width: 350%;
    min-width: 320px;
    max-width: 450px;
    background: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);

    box-shadow: 0px 2px 5px rgba(0, 0, 0, .25);

  .forgot, .remember {
    color: lighten(@blue, 10%);
    float: right;

  &
  :hover {
    color: darken(@blue, 5%);
  }

  }
  }


</style>
<script>
  export default {
    data () {
      return {
        loginForm: {
          user: '',
          password: '',
          rememberMe: false
        },
        loginFormRule: {
          user: [
            {required: true, message: '请填写用户名', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请填写密码', trigger: 'blur'},
            {type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur'}
          ]
        }
      }
    },
    mounted () {
      if (localStorage.getItem('rememberMe') === 'true') {
        this.$set(this.loginForm, 'rememberMe', true)
      }
    },
    methods: {
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$Message.success('提交成功')
          } else {
//            this.$Message.error('表单验证失败!')
          }
        })
      },
      changeRememberMe (rememberMe) {
        this.$store.dispatch('changeStorage', this.loginForm.rememberMe)
      }
    }
  }
</script>
