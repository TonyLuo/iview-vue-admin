<script>
  import baseView from '../../components/base/baseView.vue'

  export default {
    name: 'newUserList',
    extends: baseView,
    data () {
      return {
        operations: {
          width: 80,
          list: [
            {
              name: '编辑',
              meta: {
                iconName: 'edit',
                operation: this.onUpdate
              }
            }]

        },
      }
    }
  }
</script>
