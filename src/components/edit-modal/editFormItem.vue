<template>

  <FormItem :label="item.title" :prop="item.key" :rules="item.meta.rules">

    <Input v-model="data[item.key]" v-if="item.meta.type === 'input'" :disabled="checkDisabled(item)"></Input>
    <Switch size="large" v-model="data[item.key]" v-else-if="item.meta.type === 'switch'"
            :disabled="checkDisabled(item)">
      <span slot="open">{{item.meta.option.openText}}</span>
      <span slot="close">{{item.meta.option.closeText}}</span>
    </Switch>
    <CheckboxGroup v-model="data[item.key]" v-else-if="item.meta.type === 'checkbox'">
      <Checkbox v-for="opt in item.meta.optionList" :disabled="checkDisabled(item)"
                :label="opt.value"
                :key="opt.value">{{opt.label}}
      </Checkbox>
    </CheckboxGroup>
    <DatePicker v-else-if="item.meta.type === 'date'" :disabled="checkDisabled(item)"
                v-model="data[item.key]"
                :value.sync="data[item.key]" format="yyyy年MM月dd日" type="date" placeholder="选择日期"
                style="width: 200px"></DatePicker>
    <image-item v-else-if="item.meta.type === 'image'"
                v-model="data[item.key]"
                :disabled="checkDisabled(item)"
                :multiple="item.meta.multiple"></image-item>

  </FormItem>


</template>

<script>

  export default {
    name: 'editFormItem',
    components: {},
    props: {
      data: Object,
      item: Object,
      type: String,
      label: String,
      prop: String,
      value: [String, Number, Array, Object],


    },

    data() {
      return {}
    },
    mounted() {

    },

    computed: {

    },
    methods: {
      checkDisabled(item){
        if(typeof item.meta.disabled === 'function'){
          return item.meta.disabled.call()
        }else{
          return item.meta.disabled
        }
      },
      showMessage(item) {
        let showMsg = item.meta.showMessage;
        if (showMsg === undefined || showMsg === null) return true; //默认显示校验消息
        return showMsg;
      },
      onUpdateValidateRules(meta, value) {
        meta.childValidator = value
      },
      appendRules(item) {
        if (item.meta.childValidator) {
          let rules = [{
            validator: item.meta.childValidator
          }]
          if (item.meta.rules) {
            return rules.concat(item.meta.rules)
          } else {
            return rules
          }
        } else {
          return item.meta.rules
        }

      }
    }
  };
</script>
