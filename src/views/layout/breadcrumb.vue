<template>
  <Breadcrumb>
    <BreadcrumbItem
      v-for="item in $store.state.layout.currentPath"
      :href="item.path"
      :key="item.name">
      {{item.title}}
    </BreadcrumbItem>
  </Breadcrumb>

</template>
<style scoped>


</style>
<script>
  export default {
    name: 'breadcrumb',
    props: {},
    data () {
      return {}
    }

  }
</script>
