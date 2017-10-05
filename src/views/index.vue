<template>
  <span>
    <div class="left col" :style="{width: hideSidebarText?'60px':'200px'}">
      <div class="header row " style="text-align: center">
        <a v-if="!hideSidebarText" href="https://github.com/TonyLuo/iview-vue-admin" style="color: white">
          <Icon type="social-github" size="24"></Icon>
        </a>
        <span :class="[hideSidebarText ? 'text-alight-center' : 'floating-right']" @click="toggleClick">
            <Icon type="navicon" size="30" color="white"></Icon>
        </span>
      </div>

      <div class="body row scroll-y" style="top:40px">
        <sidebar :hide-sidebar-text="hideSidebarText" theme="dark"></sidebar>
      </div>
      <!--<div class="footer row">-->
      <!--&lt;!&ndash;<img style="height: 40px"  src="static/assets/img/logo.png">&ndash;&gt;-->
      <!--</div>-->
    </div>
    <div class="right col" :style="{left: hideSidebarText?'60px':'200px'}">
      <ceiling></ceiling>
      <tabs class="layout-tabs"></tabs>
      <breadcrumb class="layout-breadcrumb"></breadcrumb>

      <div class="body row scroll-y" style="padding: 1em">
        <router-view></router-view>
      </div>
      <!--<div class="footer row">-->
      <!--Some status text here-->
      <!--</div>-->
    </div>
    <BackTop></BackTop>

  </span>

</template>
<style>
  @import "../styles/dark.theme.css";
  @import "./layout/css/layout.css";
</style>

<script>
  import ceiling from './layout/ceiling.vue'
  import sidebar from './layout/sidebar.vue'
  import breadcrumb from './layout/breadcrumb.vue'
  import tabs from './layout/tabs.vue'

  export default {
    components: {
      ceiling,
      sidebar,
      breadcrumb,
      tabs
    },
    data () {
      return {
        hideSidebarText: false
      }
    },
    methods: {
      init () {
        this.$store.dispatch('initial', {})

      },
      toggleClick () {
        this.hideSidebarText = !this.hideSidebarText
      }
    },
    watch: {},
    mounted () {
      this.init()
    }
  }
</script>
