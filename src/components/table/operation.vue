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

    <span v-for="item in options.list" v-if="checkPermit(item)" :key="item.name" class="operation-icon">
      <a v-if="item.meta.link"
         :href="item.meta.link(row)"
         :target="item.meta.target">
        <Icon :type="item.meta.iconName"
              :color="item.meta.color"
              class="operation-icon"
              size="16"></Icon>
      </a>
      <Icon v-else
            :type="item.meta.iconName"
            :color="item.meta.color"
            @click.native="item.meta.operation(row)"
            size="16"></Icon>
    </span>

  </span>
</template>
<script>
  import {checkPermission} from '../../libs/util'

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
      checkPermit(item) {
        return checkPermission(item)
      }
    }
  }
</script>
