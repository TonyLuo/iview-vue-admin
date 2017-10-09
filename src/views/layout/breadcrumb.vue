<template>
  <Breadcrumb>
    <BreadcrumbItem href="/">
      首页
    </BreadcrumbItem>
    <BreadcrumbItem
      v-for="item in currentPath"
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
    },
    computed: {
      currentPath () {
        return this.$store.state.layout.currentPath.slice()
      }
    },

  }
</script>
