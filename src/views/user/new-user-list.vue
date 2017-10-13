<script>
  import baseView from '../../components/base/baseView.vue'
  import userApi from '../../api/user.api'
  import { formatDate } from '../../libs/util'
  const statusList = [{value: 1, label: '有效'}, {value: 0, label: '失效'}]

  export default {
    name: 'newUserList',
    extends: baseView,
    data () {
      return {
        api: userApi,
        operations: {
          width: 80,
          list: [
            {
              name: '编辑',
              meta: {
                iconName: 'edit',
                operation: this.onUpdate
              }
            },
            {
              name: '删除',
              meta: {
                auth: ['ROLE_ADMIN'],
                iconName: 'trash-b',
                operation: this.onDelete
              }
            }]

        },

//        statusList: [{value: 1, label: '有效'}, {value: 0, label: '失效'}],

        fields: [

          {
            width: 150,
            title: '帐号',
            key: 'login',
            meta: {
              'hidden': true
            }
          },
          {
            width: 150,
            title: '姓氏',
            key: 'firstName'
          },
          {
            width: 150,
            title: '名字',
            key: 'lastName'
          },
          {
            width: 300,
            title: '权限',
            key: 'authorities',
            meta: {
              auth: ['ROLE_ADMIN']
            },
            render: (h, params) => {
              const row = params.row
              const authorities = row.authorities

              return h('span',
                [
                  authorities.map(item => {
                    const color = item === 'ROLE_ADMIN' ? 'blue' : item === 'ROLE_USER' ? 'green' : 'red'
                    const text = item === 'ROLE_ADMIN' ? '管理员' : item === 'ROLE_USER' ? '用户' : '其他'
                    return h('Tag', {
                      props: {
                        type: 'dot',
                        color: color
                      }
                    }, text)
                  })
                ]
              )

            }
          },
          {
            width: 150,

            title: '创建时间',
            key: 'createdDate',
            render: (h, params) => {
              return h('div', formatDate(params.row.createdDate))
            }
          },
          {
            width: 150,

            title: '更新时间',
            key: 'lastModifiedDate',
            render: (h, params) => {
              return h('div', formatDate(params.row.lastModifiedDate))
            }
          }
        ],
        searchOptions: {
          simpleSearchOptions: [{
            name: '状态',
            meta: {
              value: '',
              type: 'select',
              selectOptions: statusList,
              operation: this.searchByStatus,
              width: 100
            }
          },
            {
              name: '帐号',
              meta: {
                value: '',
                type: 'input',
                size: 'small',
                operation: this.searchByLogin
              }
            },
            {
              name: '更新时间',
              meta: {
                value: '',
                type: 'dateRange',
                size: 'small',
                operation: this.searchByLogin
              }
            }
          ],
          advancedSearchOptions: {
            operation: this.advancedSearch,
            onCancel: this.onRefresh,
            list: [{
              name: '状态',
              field: 'activated',
              meta: {
                value: '',
                type: 'select',
                selectOptions: statusList,
                operation: this.searchByStatus,
                width: 100
              }
            },
              {
                name: '帐号',
                field: 'login',
                meta: {
                  value: '',
                  type: 'input',
                  size: 'small',
                  operation: this.searchByLogin
                }
              },
              {
                name: '更新时间',
                field: 'lastModifiedDate',
                meta: {
                  value: '',
                  type: 'dateRange',
                  size: 'small',
                  operation: this.searchByLogin
                }
              }
            ]
          }

        }

      }
    },
    computed: {
//      searchOptions: function () {
//        return {
//          simpleSearchOptions: [{
//            name: '状态',
//            meta: {
//              value: '',
//              type: 'select',
//              selectOptions: this.statusList,
//              operation: this.searchByStatus,
//              width: 100
//            }
//          },
//            {
//              name: '帐号',
//              meta: {
//                value: '',
//                type: 'input',
//                size: 'small',
//                operation: this.searchByLogin
//              }
//            },
//            {
//              name: '更新时间',
//              meta: {
//                value: '',
//                type: 'dateRange',
//                size: 'small',
//                operation: this.searchByLogin
//              }
//            }
//          ],
//          advancedSearchOptions: {
//            operation: this.advancedSearch,
//            onCancel: this.onRefresh,
//            list: [{
//              name: '状态',
//              field: 'activated',
//              meta: {
//                value: '',
//                type: 'select',
//                selectOptions: this.statusList,
//                operation: this.searchByStatus,
//                width: 100
//              }
//            },
//              {
//                name: '帐号',
//                field: 'login',
//                meta: {
//                  value: '',
//                  type: 'input',
//                  size: 'small',
//                  operation: this.searchByLogin
//                }
//              },
//              {
//                name: '更新时间',
//                field: 'lastModifiedDate',
//                meta: {
//                  value: '',
//                  type: 'dateRange',
//                  size: 'small',
//                  operation: this.searchByLogin
//                }
//              }
//            ]
//          }
//
//        }
//      }
    },
    methods: {
      searchByStatus (value) {
        console.log(`searchByStatus ${value}`)
      },
      searchByLogin (value) {
        console.log(`searchByLogin ${value}`)

      },
      advancedSearch (searchStr) {
        console.log('advancedSearch', searchStr)
      },
    }
  }
</script>
