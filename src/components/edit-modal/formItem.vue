<template>
  <div>

    <FormItem :key="item.field"
                  :prop="item.field"
                  :label="item.name"
                  :show-message="showMessage(item)"
                  :rules="appendRules(item)" v-if="!item.meta.editHide ">
      <!--<image-type ref="imageType"-->
                  <!--:class="item.meta.class"-->
                  <!--:image-list.sync="imageList"-->
                  <!--:owner-id="data.id"-->
                  <!--:image-list-change.sync="imageListChange"-->
                  <!--v-if="item.meta.component === 'image'">-->
      <!--</image-type>-->
      <!--<select-type v-else-if="item.meta.component === 'select'"-->
                   <!--:disabled="item.meta.disabled"-->
                   <!--:selected.sync="data[item.field]"-->
                   <!--:options="item.meta.selectOptions"-->
                   <!--:meta="item.meta">-->
      <!--</select-type>-->
      <!--<time-range v-else-if="item.meta.component === 'timeRange'"-->
                  <!--:startTime.sync="data[item.meta.startTimeField]"-->
                  <!--:endTime.sync="data[item.meta.endTimeField]"-->
                  <!--:disabled="item.meta.disabled">-->
      <!--</time-range>-->

      <!--<Date-picker v-else-if="item.meta.component === 'date'"-->
                      <!--v-model="data[item.field]"-->
                      <!--:disabled="item.meta.disabled"-->
                      <!--type="date"-->
                      <!--placeholder="选择日期">-->
      <!--</Date-picker>-->
      <!--<Switch v-else-if="item.meta.component === 'switch'"-->
                 <!--:disabled="item.meta.disabled"-->
                 <!--v-model="data[item.field]"-->
                 <!--on-text="是"-->
                 <!--off-text="否"-->
                 <!--on-color="#13ce66"-->
                 <!--off-color="#ff4949">-->
      <!--</Switch>-->

      <!--&lt;!&ndash;<input-type v-if="item.meta.component === 'input'"&ndash;&gt;-->
      <!--&lt;!&ndash;v-model="data[item.field]"&ndash;&gt;-->
      <!--&lt;!&ndash;:inputValue.sync="data[item.field]"&ndash;&gt;-->
      <!--&lt;!&ndash;:meta="item.meta"></input-type>&ndash;&gt;-->
      <!--<CheckboxGroup v-model="data[item.field]"-->
                         <!--:disabled="item.meta.disabled"-->
                         <!--v-else-if="item.meta.component === 'checkbox'">-->
        <!--<Checkbox v-for="checkItem in item.meta.list" :label="checkItem.value"-->
                     <!--:key="checkItem.value">{{checkItem.name}}-->
        <!--</Checkbox>-->
      <!--</CheckboxGroup>-->
      <!--<div v-else-if="item.meta.component === 'input'">-->
        <!--<Input v-model.number="data[item.field]" :disabled="item.meta.disabled"-->
                  <!--v-if="item.meta.type === 'number'" />-->

        <!--<Input v-if="item.meta.type === 'textarea'"-->
                  <!--v-model="data[item.field]"-->
                  <!--type="textarea"-->
                  <!--:rows="2"-->
                  <!--placeholder="请输入内容" :disabled="item.meta.disabled"/>-->
        <!--<Input v-if="!item.meta.type" v-model="data[item.field]"-->
                  <!--:disabled="item.meta.disabled"/>-->
      <!--</div>-->

      <component v-if="item.meta && item.meta.component" v-bind:is="item.meta.component"
                 :meta="item.meta"
                 :disabled="item.meta.disabled"
                 :value.sync="data[item.field]"
                 :dependValue="data[item.dependField]"
                 :ownerId="data.id"
                 @updateValidateRules="onUpdateValidateRules"
                 :parentSubmitted="parentSubmitted"
                 :parentVisible="visible"
                 v-model="data[item.field]">
      </component>

    </FormItem>
  </div>

</template>

<script>
//  import ImageType from './ImageType'
//  import SelectType from './SelectType'
//  import DateType from './DateType'
//  import TimeRange from './TimeRange'
//  import InputType from './InputType'
//  import organization from './organizationType'
//  import bank from './bankType.vue'
  export default {
    name: 'FormItem',
    components: {
//      ImageType,
//      SelectType,
//      DateType,
//      TimeRange,
//      InputType,
//      organization,
//      bank

    },
    props: {
      item: Object,
      visible: {type: Boolean, default: true},
      fields: Array,
      data: Object,
      parentSubmitted: {type: Boolean, default: false}

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
