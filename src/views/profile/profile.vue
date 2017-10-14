<template>

  <Form :model="profileForm" :rules="profileRules" ref="profileForm" class="ruleForm" :label-width="80">
    <FormItem label="头像">
      <image-item v-model="profileForm.imageUrl" :isSingleFile="true"></image-item>
    </FormItem>
    <FormItem label="姓氏" prop="firstName">
      <Input v-model="profileForm.firstName"></Input>
    </FormItem>
    <FormItem label="名字" prop="lastName">
      <Input v-model="profileForm.lastName"></Input>
    </FormItem>
    <FormItem label="密码" prop="password">
      <Input type="password" v-model="profileForm.password"></Input>
    </FormItem>
    <FormItem label="确认密码" prop="checkPass">
      <Input type="password" v-model="profileForm.checkPass"></Input>
    </FormItem>

    <FormItem>
      <Button type="primary" @click="submitForm('profileForm')">提交</Button>
      <Button type="ghost" @click="handleReset('profileForm')" style="margin-left: 8px">重置</Button>
    </FormItem>

  </Form>


</template>

<script>
  import {mapGetters} from 'vuex'
  import userApi from '../../api/user.api'
  import imageItem from '../../components/form-type/image.vue'

  export default {
    components: {imageItem},
    data() {
      let validatePass = (rule, value, callback) => {

        this.$refs.profileForm.validateField('checkPass')

        callback()
      }
      let validatePass2 = (rule, value, callback) => {
        if (!value || value === '') {
          if (!this.profileForm.password || this.profileForm.password === '') {
            callback()
          } else {
            callback(new Error('两次输入密码不一致!'))
          }
        } else if (value !== this.profileForm.password) {
          callback(new Error('两次输入密码不一致!'))
        } else if (value.length < 4) {
          callback(new Error('密码长度至少4位'))
        } else {
          callback()
        }

      }
      return {
        profileForm:
          {
            firstName: '',
            lastName: '',
            password: null,
            checkPass: null
          },
        profileRules: {
          password: [
            {validator: validatePass, trigger: 'blur'}
          ],
          checkPass: [
            {validator: validatePass2, trigger: 'blur'}
          ]
        }
      }
    },
    watch: {
      userInfo() {
//        console.log(this.userInfo)

//        this.$set(this.profileForm, 'id', this.userInfo.id)
//        this.$set(this.profileForm, 'login', this.userInfo.login)
//        this.$set(this.profileForm, 'authorities', this.userInfo.authorities)
//        this.$set(this.profileForm, 'firstName', this.userInfo.firstName)
//        this.$set(this.profileForm, 'lastName', this.userInfo.lastName)
//        this.$set(this.profileForm, 'activated', this.userInfo.activated)
//        this.$set(this.profileForm, 'imageUrl', this.userInfo.imageUrl)
        this.profileForm = Object.assign({}, this.userInfo)
      }
    },
    mounted() {
      this.init()
    },
    computed: {
      ...mapGetters({
        userInfo: 'userDetail'
      }),
      imageUrl() {
        return [{url: this.userInfo.imageUrl}]
      }
    },
    methods: {
      init() {
        console.log(this.userInfo)
        this.profileForm = Object.assign({}, this.userInfo)
      },
      update(data) {
        userApi.update(data).then((res) => {
          this.$store.commit('SET_USER', res.data)
          this.$Message.success('更新成功!')
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.update(this.profileForm)

          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      handleReset(name) {
        this.$refs[name].resetFields()
      }
    }
  }

</script>

<style>
  .ruleForm {
    width: 464px;
  }
</style>
