<style rel="stylesheet/less" type="text/css" lang="less">
  @import "../../styles/common.less";

  .operation-icon {
    color: @primary-color;
    padding: 5px
  }

  .operation-icon:hover {
    color: @warning-color;
  }
</style>
<template>
  <span>
    <Icon type="edit" class="operation-icon" @click.native="operation" size="16"></Icon>
    <Icon type="trash-b" class="operation-icon" @click.native="operation" size="16"></Icon>
  </span>
</template>
<script>
  export default {
    props: {
      row: Object,
      operation: Function
    },
    methods: {

    }
  }
</script>
