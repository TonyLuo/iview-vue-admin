<template>
  <div style="padding:10px;background-color: #f9fafc">

    <span v-if="!showAdvancedSearch">

      <Select v-model="searchOption"
              @on-change="onChangeSearchCriteria"
              clearable
              style="width: 150px;float: left"
              placeholder="请选择搜索条件">
        <Option
          v-for="item in searchOptions.simpleSearchOptions"
          :label="item.name"
          :key="item.name"
          :value="item.name">
        </Option>

      </Select>
      <span v-for="(option, index) in searchOptions.simpleSearchOptions"
            v-if="option.name === searchOption"
            :key="index"
            style="float: left">
        <Select style="width: 180px;float: left"
                clearable
                v-model="searchValue"
                v-if="option.meta.type === 'select'">
          <Option v-for="(item, index) in option.meta.selectOptions"
                  :value="item.value"
                  :key="item.value">
            {{item.label}}
          </Option>
        </Select>
        <Input style="width: 180px;height:10px;float: left" v-model="searchValue"
               v-if="option.meta.type === 'input'"></Input>
        <DatePicker v-model="searchValue" format="yyyy/MM/dd" type="daterange" placement="right-start"
                    v-if="option.meta.type === 'dateRange'"
                    placeholder="选择日期" style="width: 200px;float: left"></DatePicker>
       <Button icon="ios-search" style="margin-left:-4px;float: left"
               @click="onSearchBtnClick();option.meta.operation(searchValue)"></Button>

      </span>

      <slot name="simple-search-btn-append" style="float: left">
      </slot>
    </span>
    <slot name="search-btn-append" style="float: left">
    </slot>
    <span style="float:right;padding: 6px"
          class="advanced-search-control"
          @click="showAdvancedSearch = !showAdvancedSearch">
      高级搜索
      <Icon type="chevron-right" :class="{ active: showAdvancedSearch}"></Icon>
    </span>
    <br/>
    <br/>
    <Form :model="form" :label-width="80" style="width: 380px;" v-if="showAdvancedSearch">
      <FormItem :label="option.name" v-for="option in searchOptions.advancedSearchOptions.list" :key="option.name">
        <Input v-if="option.meta.type ==='input'"
               :placeholder="`请输入${option.name}`"
               v-model="form[option.field]">
        </Input>
        <Select style="width: 180px;float: left"
                clearable
                v-model="form[option.field]"
                v-if="option.meta.type === 'select'">
          <Option v-for="(item, index) in option.meta.selectOptions"
                  :value="item.value"
                  :key="item.value">
            {{item.label}}
          </Option>
        </Select>
        <DatePicker v-model="form[option.field]"
                    format="yyyy/MM/dd" type="daterange" placement="right-start" v-if="option.meta.type === 'dateRange'"
                    placeholder="选择日期" style="width: 200px;float: left">

        </DatePicker>
      </FormItem>

      <FormItem>
        <Button type="primary" @click="onSearchBtnClick();onSearchSubmit(searchOptions.advancedSearchOptions)">搜索</Button>
        <Button type="ghost" style="margin-left: 8px" @click="onCancel(searchOptions.advancedSearchOptions)">取消</Button>
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
  import { checkPermission, formatDate } from '../../libs/util'

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
        searchOption: null,
        searchValue: null,
        form: {}
      }
    },
    methods: {
      checkPermit (item) {
        return checkPermission(item)
      },
      onChangeSearchCriteria (value) {

        if (!value || value === '') {
          this.$emit('clear')
        }

        this.searchValue = null
      },
      onSearchBtnClick(){
        this.$emit('search-btn-click')
      },
      onSearchSubmit (advancedSearchOptions) {

        let searchStr = ''
        advancedSearchOptions.list.forEach(item => {
          let value = this.form[item.field]
          let operator = item.operator
          let valueType = item.meta.valueType
          if ((value !== null && value !== undefined && value !== '')) {
            if (valueType === 'Boolean') {
              value = Boolean(value)
            }
            else if ((typeof value === 'string')) {
              value = value.trim()
              if (value === '') {
                return
              }
            }

            let op = ':'
            if (item.meta.type === 'dateRange') {
              if (!value[0] || !value[1] || value[0] === '' || value[1] === '') return
              op = '@'

              let startDate = value[0]
              let endDate = value[1]
//              startDate.setTime(startDate.setHours(startDate.getHours() - 24))
//              endDate.setTime(endDate.setHours(endDate.getHours() + 24))

              value = `"${formatDate(startDate)}T${formatDate(endDate)}`

            }
            if (item.meta.type === 'input') {
              value = '*' + value + '*'
            }
            if (operator === 'like') {
              value = '*' + value + '*'
            }
            searchStr += item.field + op + value + ' and '
          }
        })
        advancedSearchOptions.operation(searchStr.substring(0, searchStr.length - 5))
      },
      onCancel (advancedSearchOptions) {
        this.showAdvancedSearch = false
        if (advancedSearchOptions.onCancel) {
          advancedSearchOptions.onCancel()
        }
      }
    }
  }
</script>
