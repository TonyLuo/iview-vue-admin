<template>
  <div>


    <FormItem :label="item.title" :prop="item.key">

      <Input v-model="data[item.key]" v-if="item.meta.type === 'input'" :disabled="item.meta.disabled"></Input>
      <Switch  size="large" v-model="data[item.key]" v-else-if="item.meta.type === 'switch'" :disabled="item.meta.disabled">
        <span slot="open">{{item.meta.option.openText}}</span>
        <span slot="close">{{item.meta.option.closeText}}</span>
      </Switch>
      <CheckboxGroup v-model="data[item.key]" v-else-if="item.meta.type === 'checkbox'" >
        <Checkbox v-for="opt in item.meta.optionList" :disabled="item.meta.disabled"
                  :label="opt.value"
                  :key="opt.value">{{opt.label}}
        </Checkbox>
      </CheckboxGroup>
      <DatePicker  v-else-if="item.meta.type === 'date'" :disabled="item.meta.disabled"
                   v-model="data[item.key]"
                   :value.sync="data[item.key]" format="yyyy年MM月dd日" type="date" placeholder="选择日期"
                  style="width: 200px"></DatePicker>
    </FormItem>
    <!--<FormItem :label="label" :prop="prop">-->

    <!--<Input v-model="value" v-if="type === 'input'"></Input>-->

    <!--</FormItem>-->

  </div>

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

    computed: {},
    methods: {
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
