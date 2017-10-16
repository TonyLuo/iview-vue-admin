<script>
  import baseView from '../../components/base/baseView.vue'
  import userApi from '../../api/user.api'
  import {formatDate} from '../../libs/util'

  const statusList = [{label: '有效', value: 1, color: 'blue'}, {label: '失效', value: 0, color: 'yellow'}]
  const authorityList = [
    {
      label: '管理员',
      value: 'ROLE_ADMIN',
      color: 'blue'
    },
    {
      label: '普通用户',
      value: 'ROLE_USER',
      color: 'green'
    }]

  export default {
    name: 'userList',
    extends: baseView,
    data() {
      let self = this
      return {
        showSelection: true,
        showExpand: true,
        showOperation: true,
        expandColNum: 3,
        api: userApi,
        operations: {
          width: 80,
          list: [
//            {
//              name: 'link',
//              meta: {
//                iconName: 'edit',
//                link: function (row){
//                  return `http://baidu.com/s?wd=${row.id}`
//                },
//                target:"_blank"
//              }
//            },
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
            title: '头像',
            key: 'imageUrl',
            meta: {
              hidden: false,
              multiple: false,
              type: 'image',
            },
            render: (h, params) => {
              const row = params.row
              return h('image-item', {
                props: {
                  value: row.imageUrl,
                  multiple: false,
                  disabled: true,
                  size: 40
                }
              })

            }
          },
          {
            width: 150,
            title: '帐号',
            key: 'login',
            meta: {
              type: 'input',
              disabled: function (item, data) {
//                console.log(item,data)
                return self.editModalStatus === 'update'
              },
              rules: [{required: true, message: '帐号不能为空', trigger: 'blur'}]
            }
          },


          {
            width: 150,
            title: '姓氏',
            key: 'firstName',
            sortable: 'custom',
            meta: {
              hidden: true,
              type: 'input',
            }
          },
          {
            width: 150,
            title: '名字',
            key: 'lastName',
            sortable: 'custom',
            meta: {
              type: 'input',
            }
          },
          {
            width: 150,
            title: '状态',
            key: 'activated',
            filters: [
              {
                label: '有效',
                value: 1
              },
              {
                label: '失效',
                value: 0
              }
            ],
            filterMultiple: false,
            filterRemote(value, row) {
              this.$set(this.queryOptions, "page", 1) // ****important***  reset the page to first page when click filter button
              this.searchByStatus(value[0])
            },
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
                  color: row.activated ? 'blue' : 'yellow'
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
              disabled: false,
              optionList: authorityList
            },
            render: (h, params) => {
              const row = params.row
              const authorities = row.authorities
              return h('span',
                [
                  authorities.map(item => {
                    let auth = authorityList.filter(authority => {
                      return authority.value === item
                    })[0]
                    if (auth) {
                      return h('Tag', {
                        props: {
                          type: 'dot',
                          color: auth.color
                        }
                      }, auth.label)
                    } else {
                      return h('span')
                    }

                  })
                ]
              )

            }
          },
          {
            width: 150,

            title: '创建时间',
            key: 'createdDate',
            sortable: 'custom',
            render: (h, params) => {
              return h('span', formatDate(params.row.createdDate))
            },
            meta: {
              disabled: true,
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
              hidden: true,
              disabled: true,
              type: 'date',
            }
          }
        ],
        buttonList: [
          {
            name: '创建',
            meta: {
              auth: ['ROLE_USER'],
              type: 'ghost',
              iconName: 'plus',
              operation: this.onCreate
            }
          },
          {
            name: '删除',
            meta: {
              auth: ['ROLE_ADMIN'],
              type: 'warning',
              iconName: 'close',
              hideCondition: function () {
                return !self.multipleSelection || self.multipleSelection.length === 0
              },
              operation: this.onDeleteSelection
            }
          },
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
      deleteSelection(selection) {
        let promiseList = []
        selection.forEach(item => {
          promiseList.push(userApi.delete(item.id))
        })
        return Promise.all(promiseList)
      },
      searchByStatus(value) {
        if (value === null || value === undefined || value === '') {
          this.refresh()
          return
        }
        this.advancedSearch(`activated:${Boolean(value)}`)
      },
      searchByLogin(value) {
        if (!value || value.trim() === '') {
          this.refresh()
          return
        }
        this.advancedSearch(`login~${value}`)

      },
      searchByCreatedDate(value) {
        if (!value[0] || !value[1] || value[0] === '' || value[1] === '') {
          this.refresh()
          return
        }
        let startDate = value[0]
        let endDate = value[1]
//        startDate.setTime(startDate.setHours(startDate.getHours() - 24))
//        endDate.setTime(endDate.setHours(endDate.getHours() + 24))

        let searchStr = `createdDate@"${formatDate(startDate)}T${formatDate(endDate)}`
        this.advancedSearch(searchStr)

      }
    }
  }
</script>
