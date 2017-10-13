<template>

  <Modal
    v-model="dialogVisible"
    :title="title"
    @on-ok="ok"
    @on-cancel="cancel">
    <Form :model="editForm" ref="editForm" class="ruleForm" :label-width="labelWidth">
      <span v-for="item in  fields" :key="item.key">
        <!--<edit-form-item :label="item.title"-->
        <!--:prop="item.key"-->
        <!--:value.sync="data[item.key]"-->
        <!--:type="item.meta.type"-->
        <!--v-model="data[item.key]"></edit-form-item>-->
        <edit-form-item :data="data"
                        :item="item"
        ></edit-form-item>
        <!--<FormItem :label="item.title" :prop="item.key">-->
        <!--<Input v-model="data[item.key]"></Input>-->
        <!--</FormItem>-->

        <!--<form-item v-if="item.meta && item.meta.component !== 'custom' "-->
        <!--:item="item"-->
        <!--:visible="visible"-->
        <!--:data="data"-->
        <!--:fields="fields"-->
        <!--:parentSubmitted="submitted"/>-->

        <!--<slot :name="item.field" v-else></slot>-->
      </span>
    </Form>
  </Modal>

  <!--<el-dialog :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false" >-->

  <!--<el-form :model="data" :inline="inline" ref="editForm" :label-width="labelWidth"-->
  <!--class="demo-ruleForm">-->
  <!--<span v-for="item in  fields">-->
  <!--<form-item v-if="item.templateOptions.component !== 'custom' "-->
  <!--:item="item"-->
  <!--:visible="visible"-->
  <!--:data="data"-->
  <!--:fields="fields"-->
  <!--:parentSubmitted="submitted">-->


  <!--</form-item>-->
  <!--<slot :name="item.field" v-else></slot>-->

  <!--</span>-->


  <!--</el-form>-->
  <!--<div slot="footer" class="dialog-footer">-->
  <!--<el-button @click="dialogVisible = false">{{cancelText}}</el-button>-->
  <!--<el-button type="primary" @click="ok()">{{okText}}</el-button>-->
  <!--</div>-->

  <!--</el-dialog>-->
</template>

<script>
  import editFormItem from './editFormItem.vue'

  export default {
    name: 'editModal',
    components: {
      editFormItem

    },

    props: {
      visible: Boolean,
      title: String,
      labelWidth: {type: Number, default: 80},
      onOK: Function,
      onClose: Function,
      okText: {type: String, default: '确定'},
      cancelText: {type: String, default: '取消'},
      fields: Array,
      data: Object
    },

    data() {
      return {
        editForm: {},
        imageList: [],
        imageListChange: false,
        pressOKBtn: false,
        dialogVisible: this.visible
      }
    },
    watch: {
      dialogVisible: function (value) {
        this.$emit('update:visible', value)
      },
      visible: function (value) {
        this.pressOKBtn = false
        this.dialogVisible = value
      }
    },

    mounted() {
    },
    computed: {
      submitted: function () {
        return this.pressOKBtn
      }
    },
    methods: {

      ok() {
        this.pressOKBtn = true
        this.$refs.editForm.validate((valid) => {
          setTimeout(() => {
            if (valid) {
              this.$emit('ok')
            } else {
              this.pressOKBtn = false
            }
          }, 300) //留出时间待子组件完成数据同步到父组件

        })
      },
      cancel() {
        this.pressOKBtn = false
        this.$emit('cancel')
      }
    }
  }
</script>
