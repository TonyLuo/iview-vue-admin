<script>
  import baseView from '../../components/base/baseView.vue'
  import userApi from '../../api/user.api'
  import {formatDate} from '../../libs/util'

  const statusList = [{value: 1, label: '有效'}, {value: 0, label: '失效'}]
  const authorityList = [{label: '管理员', value: 'ROLE_ADMIN'}, {label: '普通用户', value: 'ROLE_USER'}]

  export default {
    name: 'newUserList',
    extends: baseView,
    data() {
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
        fields: [

          {
            width: 150,
            title: '帐号',
            key: 'login',
            meta: {
              'hidden': true,
              type: 'input',
              disabled: true,
              rules: [{required: true, message: '帐号不能为空', trigger: 'blur'}]
            }
          },
          {
            width: 150,
            title: '姓氏',
            key: 'firstName',
            meta: {
              type: 'input',
            }
          },
          {
            width: 150,
            title: '名字',
            key: 'lastName',
            meta: {
              type: 'input',
            }
          },
          {
            width: 150,
            title: '状态',
            key: 'activated',
            meta: {
              type: 'switch',
              option: {
                openText: '有效',
                closeText: '失效'
              }
            },
            render: (h, params) => {
              const row = params.row

              return h('Tag', {
                props: {
                  color: row.activated ? 'blue' : 'red'
                }
              }, row.activated ? '有效' : '失效')

            }
          },
          {
            width: 300,
            title: '权限',
            key: 'authorities',
            meta: {
              auth: ['ROLE_ADMIN'],
              type: 'checkbox',
              disabled: true,
              optionList: authorityList
            },
            render: (h, params) => {
              const row = params.row
              const authorities = row.authorities

              return h('span',
                [
                  authorities.map(item => {
                    const color = item === 'ROLE_ADMIN' ? 'blue' : item === 'ROLE_USER' ? 'green' : 'red'
                    const text = item === 'ROLE_ADMIN' ? '管理员' : item === 'ROLE_USER' ? '普通用户' : '其他'
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
            },
            meta: {
              type: 'date',
            }
          },
          {
            width: 150,

            title: '更新时间',
            key: 'lastModifiedDate',
            render: (h, params) => {
              return h('div', formatDate(params.row.lastModifiedDate))
            },
            meta: {
              type: 'date',
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
              name: '创建时间',
              meta: {
                value: '',
                type: 'dateRange',
                operation: this.searchByCreatedDate
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
                valueType: 'Boolean',
                type: 'select',
                selectOptions: statusList,
                width: 100
              }
            },
              {
                name: '帐号',
                field: 'login',
                meta: {
                  value: '',
                  type: 'input',
                }
              },
              {
                name: '创建时间',
                field: 'createdDate',
                meta: {
                  value: '',
                  type: 'dateRange'
                }
              }
            ]
          }

        }

      }
    },
    computed: {},
    methods: {
      searchByStatus(value) {
        if (!value || value === '') {
          this.refresh()
        }
        this.advancedSearch(`activated:${Boolean(value)}`)
      },
      searchByLogin(value) {
        if (!value || value.trim() === '') {
          this.refresh()
        }
        this.advancedSearch(`login~${value}`)

      },
      searchByCreatedDate(value) {
        if (!value[0] || !value[1] || value[0] === '' || value[1] === '') {
          this.refresh()
        }
        let startDate = value[0]
        let endDate = value[1]
        startDate.setTime(startDate.setHours(startDate.getHours() - 24))
        endDate.setTime(endDate.setHours(endDate.getHours() + 24))

        let searchStr = `createdDate@"${formatDate(startDate)}T${formatDate(endDate)}`
        this.advancedSearch(searchStr)

      }
    }
  }
</script>
