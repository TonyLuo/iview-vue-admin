<style rel="stylesheet/less" type="text/css" lang="less">
  @import "../../styles/common.less";

  .operation-icon {
    color: @primary-color;
    padding: 5px;
    text-align: center;
    cursor: pointer;
  }

  .operation-icon:hover {
    color: @warning-color;
  }
</style>
<template>
  <span>
    <Icon v-for="item in options.list" v-if="checkPermit(item)"
          :type="item.meta.iconName"
          :color="item.meta.color"
          class="operation-icon"
          @click.native="item.meta.operation(row)"
          :key="item.name"
          size="16"></Icon>
  </span>
</template>
<script>
  import { checkPermission } from '../../libs/util'

  export default {
    name: 'operation',
    props: {
      row: {
        type: Object, default: function () {
          return {}
        }
      },
      options: {
        type: Object, default: function () {
          return {}
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
