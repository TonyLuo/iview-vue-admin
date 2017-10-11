<template>
  <div class="content has-text-centered">

    <Form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="100px" class="ruleForm">
      <!--<FormItem label="年龄" prop="age">-->
      <!--<el-input v-model.number="ruleForm2.age"></el-input>-->
      <!--</FormItem>-->
      <FormItem label="姓氏" prop="firstName">
        <el-input v-model="ruleForm2.firstName"></el-input>
      </FormItem>
      <FormItem label="名字" prop="lastName">
        <el-input v-model="ruleForm2.lastName"></el-input>
      </FormItem>
      <FormItem label="密码" prop="password">
        <el-input type="password" v-model="ruleForm2.password" auto-complete="off" ></el-input>
      </FormItem>
      <FormItem label="确认密码" prop="checkPass">
        <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" ></el-input>
      </FormItem>

      <FormItem>
        <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
      </FormItem>
    </Form>


  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import userApi from '../../api/user'

  export default {
    data () {
      var checkAge = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('年龄不能为空'))
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('请输入数字值'))
          } else {
            if (value < 18) {
              callback(new Error('必须年满18岁'))
            } else {
              callback()
            }
          }
        }, 1000)
      };
      var validatePass = (rule, value, callback) => {
//        if (value === '') {
//          callback(new Error('请输入密码'));
//        } else {
//          if (this.ruleForm2.checkPass !== '') {
//            this.$refs.ruleForm2.validateField('checkPass');
//          }
//          callback();
//        }

        this.$refs.ruleForm2.validateField('checkPass');

        callback()
      };
      var validatePass2 = (rule, value, callback) => {
        if (!value || value === '') {
          if (!this.ruleForm2.password || this.ruleForm2.password === '') {
            callback()
          } else {
            callback(new Error('两次输入密码不一致!'))
          }
        } else if (value !== this.ruleForm2.password) {
          callback(new Error('两次输入密码不一致!'))
        } else if (value.length < 4) {
          callback(new Error('密码长度至少4位'))
        } else {
          callback()
        }

      };
      return {
        ruleForm2:
          {
            firstName: '',
            lastName: '',
            password: null,
            checkPass: null,
            age: ''
          },
        rules2: {
          password: [
            {validator: validatePass, trigger: 'blur'}
          ],
          checkPass: [
            {validator: validatePass2, trigger: 'blur'}
          ],
          age: [
            {validator: checkAge, trigger: 'blur'}
          ]
        }
      }
    },

    mounted () {
//      console.log(this.userInfo)
      this.ruleForm2.id = this.userInfo.id;
      this.ruleForm2.login = this.userInfo.login;
      this.ruleForm2.authorities = this.userInfo.authorities;
      this.ruleForm2.firstName = this.userInfo.firstName;
      this.ruleForm2.lastName = this.userInfo.lastName;
      this.ruleForm2.activted = this.userInfo.activated
//      this.ruleForm2 = Object.assign({}, this.userInfo)
//      this.ruleForm2 = Object.assign({}, this.userInfo)

    },
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    methods: {
      update (data) {
        userApi.update(data).then((res) => {
          this.$notify({
            message: '编辑成功',
            type: 'success'
          })
        })
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.update(this.ruleForm2)
          } else {
            console.log('error submit!!');
            return false
          }
        })
      }
//      resetForm(formName) {
//        this.$refs[formName].resetFields();
//      }
    }
  }

</script>

<style>
  .ruleForm {
    width: 464px;
  }
</style>
