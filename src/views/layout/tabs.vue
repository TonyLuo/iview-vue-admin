<template>

  <Tabs type="card" closable id="tabs-nav"
        @on-tab-remove="handleTabRemove"
        @on-click="linkTo"
        v-model="currentPageName">
    <TabPane :label="item.title" v-for="(item,index)  in itemList"
             :name="item.name"
             :key="item.name">
    </TabPane>
  </Tabs>

</template>
<style>

  /* Hide close button for home page */
  #tabs-nav .ivu-tabs-nav > div:nth-child(2) > i {
    display: none
  }
</style>
<script>
  export default {
    name: 'tabs',
    props: {},
    data () {
      return {
        currentPageName: ''
      }
    },
    computed: {
      itemList () {
        return this.$store.state.layout.pageOpenedList.slice()
      }
    },
    watch: {
      '$route' (to) {
        this.currentPageName = to.name
      },
      currentPageName () {
        let currentPage = this.currentPageName
        //redirect to home when close all tab
        if (this.currentPageName === -1) {
          currentPage = 'home'
        }

        this.$router.push({
          name: currentPage
        })
      }
    },
    methods: {
      init () {
        this.currentPageName = this.$route.name
      },
      handleTabRemove (name) {
        this.$store.dispatch('removeTab', name)
      },
      linkTo (name) {
        this.$router.push({
          name: name
        })
      }
    },
    mounted () {
      this.init()
    }
  }
</script>
