<style scoped>
  .expand-row {
    margin-bottom: 5px;
  }
</style>
<template>
  <div style="width: 960px">


    <Col :span="24/colNum" v-for="column in fields" :key="column.key" style="float: left;padding: 4px">
    <span class="expand-key" style="float: left;">{{column.title}}：</span>
    <Cell style="float: left;"
          :row="row"
          :column="column"
          :key="column.key"
          >

    </Cell>


    </Col>


  </div>
</template>
<script>
  import Cell from 'iview/src/components/table/cell.vue';
  import imageItem from '../../components/form-type/image.vue'

  export default {
    name: 'expandRow',
    components: {Cell,imageItem},

    props: {
      fields: Array,
      row: Object,
      colNum:{type:Number,default:2}
    }
  }
</script>
