import expandRow from '../../components/table/expandRow.vue'
import operation from '../../components/table/operation.vue'
import editModal from '../../components/table/editModal.vue'
import searchCriteria from '../../components/table/searchCriteria.vue'
import { checkPermission } from '../../libs/util'

import userApi from '../../api/user'

export default {
  name:'baseView',
  components: {expandRow, operation, editModal, searchCriteria},
  data () {
    return {
      showEditModal: false,
      total: 0,
      loading: false,
      queryOptions: {
        page: 1,
        size: 10,
        sortWay: null,
        queryMethod: null,
        queryValue: null
      },
      tableData: [],
      statusList: [{value: 1, label: '有效'}, {value: 0, label: '失效'}],

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
            return h('div', this.formatDate(params.row.createdDate))
          }
        },
        {
          width: 150,

          title: '更新时间',
          key: 'lastModifiedDate',
          render: (h, params) => {
            return h('div', this.formatDate(params.row.lastModifiedDate))
          }
        }
      ],

    }
  },
  computed: {
    tableColumns: function () {
      let columns = [
        {
          type: 'expand',
          width: 30,
          render: (h, params) => {
            return h(expandRow, {
              props: {
                row: params.row
              }
            })
          }
        },
        {
          title: '操作',
          key: 'action',
          width: this.operations.width,
          align: 'center',
          render: (h, params) => {
            return h(operation, {
              props: {
                row: params.row,
                options: this.operations
              }
            })
          }
        },
        ...this.fields.filter(item => {
          return !(item.meta && item.meta.hidden) && checkPermission(item)
        })
      ]
      return columns
    },
    searchOptions: function () {
      return {
        simpleSearchOptions: [{
          name: '状态',
          meta: {
            value: '',
            type: 'select',
            selectOptions: this.statusList,
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
              selectOptions: this.statusList,
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
  methods: {
    fetchData () {
      userApi.list(this.queryOptions).then(res => {
        this.total = res.data.content.length
        this.tableData = res.data.content
      })
    },
    formatDate (strDate) {
      const date = new Date(strDate)
      const y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      return y + '-' + m + '-' + d
    },
    ok () {
      this.$Message.info('点击了确定')
    },
    cancel () {
      this.$Message.info('点击了取消')
    },
    create (row) {
      console.log('create', row)
    },
    update (row) {
      console.log('update', row)
    },
    delete (row) {
      console.log('delete', row)
    },
    onCreate () {
      console.log('oncreate')
      this.showEditModal = true
    },
    onUpdate (row) {
      this.showEditModal = true
//        this.$Modal.confirm({
//          title: '用户信息',
//          closable: true,
//          scrollable: true,
//          onOk: () => {
//            this.update(row)
//          },
//          render: (h) => {
//            return h(editModal, {
//              props: {
//                row: row
//              }
//            })
//          }
//        })
    },
    onDelete (row) {
      this.$Modal.confirm({
        title: '确认要删除吗？',
        render: (h) => {
          return h('p', [h('span', '帐号: '), h('span', row.login)])
        },
        onOk: () => {
          this.delete(row)

        },
        onCancel: () => {
        }
      })

    },
    searchByStatus (value) {
      console.log(`searchByStatus ${value}`)
    },
    searchByLogin (value) {
      console.log(`searchByLogin ${value}`)

    },
    advancedSearch(searchStr) {
      console.log('advancedSearch',searchStr)
    },
    onRefresh(){

    },
    onPageChange (page) {
      this.queryOptions.page = page
      this.fetchData()
    },

    onPageSizeChange (size) {
      this.queryOptions.size = size
      this.fetchData()
    },
    onSortChange (sortWay) {
      this.queryOptions.sortWay = {
        prop: sortWay.prop,
        order: sortWay.order
      }
      this.fetchData()
    }
  },
  mounted () {
    this.tableData = this.fetchData()

  }
}
