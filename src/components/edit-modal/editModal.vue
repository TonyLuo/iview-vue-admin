<template>

  <Modal
    v-model="dialogVisible"
    :scrollable="true"
    :title="title"
    @on-ok="ok"
    @on-cancel="cancel">
    <Form :model="data" ref="editForm" class="ruleForm" :label-width="labelWidth">
      <span v-for="item in  fields" :key="item.key">
        <edit-form-item v-if="item.meta && item.meta.type && item.meta.type !== 'custom' "
                        :data="data"
                        :item="item">
        </edit-form-item>
        <!-- custom the display format-->
        <slot :name="item.key" v-else></slot>

      </span>

    </Form>
    <div slot="footer">
      <Button @click="dialogVisible = false">{{cancelText}}</Button>
      <Button type="primary" @click="ok()">{{okText}}</Button>
    </div>
  </Modal>

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
