
<template>
  <div style="padding:5px;background-color: #f9fafc">

    <span v-if="!showAdvancedSearch">
      <Select style="width: 80px;float: left">
        <Option value="day">日活</Option>
        <Option value="month">月活</Option>
      </Select>
      <Select style="width: 180px;float: left">
        <Option value="day">日活</Option>
        <Option value="month">月活xxxxxxx</Option>
      </Select>
      <div><Input style="width: 180px;height:10px;float: left"></Input></div>
      <DatePicker format="yyyy/MM/dd" type="daterange" placement="bottom-end"
                  placeholder="选择日期" style="width: 200px;float: left"></DatePicker>
      <Button icon="ios-search" style="float: left"></Button>
      <Button type="ghost" icon="plus" style="float: left"></Button>
    </span>
    <span style="float:right;padding: 6px" class="advanced-search-control"
          @click="showAdvancedSearch = !showAdvancedSearch">
      高级搜索
      <Icon type="chevron-right" :class="{ active: showAdvancedSearch}"></Icon>
    </span>
    <br/>
    <br/>
    <Form :model="formItem" :label-width="80" style="width: 380px;" v-if="showAdvancedSearch">
      <FormItem label="输入框">
        <Input v-model="formItem.input" placeholder="请输入"></Input>
      </FormItem>
      <FormItem label="选择器">
        <Select v-model="formItem.select" placeholder="请选择">
          <Option value="beijing">北京市</Option>
          <Option value="shanghai">上海市</Option>
          <Option value="shenzhen">深圳市</Option>
        </Select>
      </FormItem>
      <FormItem label="日期控件">
        <Row>
          <Col span="11">
          <DatePicker type="date" placeholder="选择日期" v-model="formItem.date"></DatePicker>
          </Col>
          <Col span="2" style="text-align: center">
          -</Col>
          <Col span="11">
          <TimePicker type="time" placeholder="选择时间" v-model="formItem.time"></TimePicker>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="单选框">
        <RadioGroup v-model="formItem.radio">
          <Radio label="male">男</Radio>
          <Radio label="female">女</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="多选框">
        <CheckboxGroup v-model="formItem.checkbox">
          <Checkbox label="吃饭"></Checkbox>
          <Checkbox label="睡觉"></Checkbox>
          <Checkbox label="跑步"></Checkbox>
          <Checkbox label="看电影"></Checkbox>
        </CheckboxGroup>
      </FormItem>
      <FormItem label="开关">
        <i-switch v-model="formItem.switch" size="large">
          <span slot="open">开启</span>
          <span slot="close">关闭</span>
        </i-switch>
      </FormItem>
      <FormItem label="滑块">
        <Slider v-model="formItem.slider" range></Slider>
      </FormItem>
      <FormItem label="文本域">
        <Input v-model="formItem.textarea" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
               placeholder="请输入..."></Input>
      </FormItem>
      <FormItem>
        <Button type="primary">提交</Button>
        <Button type="ghost" style="margin-left: 8px">取消</Button>
      </FormItem>
    </Form>
  </div>
</template>
<style rel="stylesheet/less" type="text/css" lang="less" scoped>
  .advanced-search-control:hover {
    cursor: pointer;
    color: #20a0ff;
  }

  .search-form {
    width: 464px;
  }

  .right-arrow {
    margin-right: 8px;
    transition: transform .3s;
  }

  .active {
    transform: rotate(90deg);
  }
</style>
<script>
  import { checkPermission } from '../../libs/util'

  export default {
    name: 'searchCriteria',
    props: {
      searchOptions: {
        type: Object, default: function () {
          return {}
        }
      }
    },
    data () {
      return {
        showAdvancedSearch: false,
        formItem: {
          input: '',
          select: '',
          radio: 'male',
          checkbox: [],
          switch: true,
          date: '',
          time: '',
          slider: [20, 50],
          textarea: ''
        }
      }
    },
    methods: {
      checkPermit (item) {
        return checkPermission(item)
      }
    }
  }
</script>
