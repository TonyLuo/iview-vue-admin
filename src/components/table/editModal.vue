<style scoped>
  .expand-row {
    margin-bottom: 5px;
  }
</style>
<template>
  <div>
    edit modal
    {{row}}
  </div>
</template>
<script>
  export default {
    name: 'editModal',

    props: {
      row: {
        type: Object, default: function () {
          return {}
        }
      },
      columns: {
        type: Object, default: function () {
          return {}
        }
      }
    }
  }
</script>
