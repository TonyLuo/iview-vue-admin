import expandRow from '../../components/table/expandRow.vue'
import operation from '../../components/table/operation.vue'
import editModal from '../../components/edit-modal/editModal.vue'
import searchCriteria from '../../components/table/searchCriteria.vue'
import {checkPermission, warn} from '../../libs/util'

export default {
  name: 'baseView',
  components: {expandRow, operation, editModal, searchCriteria},
  data() {
    return {
      //TODO override api, operations, fields, searchOptions in child page
      api: null,
      fields: null,
      expandColNum: 2,
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
      searchOptions: {
        simpleSearchOptions: [
          {
            name: 'ID',
            meta: {
              value: '',
              type: 'input',
              size: 'small',
              operation: this.searchById
            }
          }
        ],
        advancedSearchOptions: {
          operation: this.advancedSearch,
          onCancel: this.onRefresh,
          list: [
            {
              name: '帐号',
              field: 'id',
              meta: {
                value: '',
                type: 'input',
                size: 'small'
              }
            }
          ]
        }

      },

      //table options
      loading: false,
      tableData: [],
      total: 0,
      page: 1,
      size: 10,

      //query options
      queryOptions: {
        page: 1,
        size: 10,
        sortWay: null,
        queryMethod: null,
        queryValue: null
      },

      //edit modal options
      editModalStatus: '',
      editModalTitleMap: {
        update: '编辑',
        create: '创建'
      },
      editForm: {},
      showEditModal: false


    }
  },
  computed: {
    //dynamic generate the table columns based on the user role
    tableColumns: function () {
      let columns = [
        {
          type: 'expand',
          width: 30,
          render: (h, params) => {
            return h(expandRow, {
              props: {
                row: params.row,
                fields: this.fields,
                colNum:this.expandColNum
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
  },
  methods: {

    checkInitialization() {
      warn(this.api === null, '[baseView] api is not initialized properly')
      warn(this.fields === null, '[baseView] fields is not initialized properly')

    },
    // table operation
    onSelectionChange(val) {
      this.multipleSelection = val
    },

    onPageChange(page) {
      this.queryOptions.page = page
      this.page = page
      this.fetchData()
    },

    onPageSizeChange(size) {
      this.queryOptions.size = size
      this.size = size
      this.fetchData()
    },
    onFilterChange(value, row) {
      return row.activated === value
    },
    onSortChange(sortWay) {
      this.queryOptions.sortWay = {
        prop: sortWay.key,
        order: sortWay.order
      }
      this.fetchData()
    },
    // end table operation

    handleResponseData(responseDataPromise) {

      responseDataPromise.then((res) => {
        this.tableData = []
        this.total = 0
        if (res.data && res.data.content) {
          this.tableData = res.data.content
          this.total = parseInt(res.data.totalElements, 10)
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
        this.tableData = []
        this.total = 0
      })
    },
    onRefresh() {
      this.refresh()
    },
    refresh() {
      this.page = 1
      this.size = 10
      this.queryOptions.queryMethod = null
      this.queryOptions.queryValue = null
      this.queryOptions = {
        page: 1,
        size: 10,
        sortWay: null,
        queryMethod: null,
        queryValue: null

      }
      this.fetchData()
    },

    // search criteria operation end

    // row operation
    onCreate() {
      this.editForm = {}
      this.editModalStatus = 'create'
      this.openEditModal()
    },
    onUpdate(row) {
      this.editForm = Object.assign({}, row)  // 把clone对象付给editForm，避免editForm未提交form时就已经修改了row的值
      this.editModalStatus = 'update'
      this.openEditModal()
    },
    onDelete(row) {
      let msg = row.name || row.id

      this.$Modal.confirm({
        title: '是否删除记录？',
        render: (h) => {
          return h('p', msg)
        },
        onOk: () => {
          this.delete(row)

        }
      })
    },
    //row operation end

    // editModal operation
    onOK() {
      console.log('ok')
      if (this.editModalStatus === 'create') {
        this.create(this.editForm)
      } else {
        this.update(this.editForm)
      }
    },
    onClose() {
      console.log('close')

      this.closeEditModal()
    },
    onViewModelClose() {
      this.showViewModal = false
    },
    openEditModal() {
      this.showEditModal = true
    },
    closeEditModal() {
      // console.log('closeEditModal')
      this.showEditModal = false
    },
    // end editModal operation

    searchById(value) {
      console.log('searchById', value)
    },
    advancedSearch(searchStr) {
      if (this.api) {
        this.queryOptions.queryMethod = this.advancedSearch
        this.queryOptions.queryValue = searchStr
        this.handleResponseData(this.api.advancedSearch(searchStr, this.queryOptions))
      }
    },
    fetchData() {
      if (this.api) {
        this.loading = true
        if (this.queryOptions.queryMethod) {
          this.queryOptions.queryMethod(this.queryOptions.queryValue)
        } else {
          this.handleResponseData(this.api.fetchData(this.queryOptions))
        }
      }

    },
    create(data) {
      if (this.api) {
        this.api.create(data).then((res) => {
          this.editForm.id = res.data.id // 新建操作时没有ID，需要把生成的ID传递到editModal,作为ownerId，用于保存图片列表
          this.fetchData()
          this.closeEditModal()
          this.afterCreate(data, res)
          this.$Message.info('创建成功')

        })
      }
    },
    afterCreate(data, res) {
    },

    update(data) {
      if (this.api) {
        this.api.update(data).then((res) => {
          this.fetchData()
          this.closeEditModal()
          this.afterUpdate(data, res)
          this.$Message.info('编辑成功')

        })
      }
    },
    afterUpdate(data, res) {
    },

    delete(row) {
      if (this.api) {
        this.api.delete(row.id
        ).then((res) => {
          this.fetchData()
          this.afterDelete(row, res)
          this.$Message.info('删除成功')

        })
      }

    },
    afterDelete(id, res) {
    },

  },
  mounted() {
    this.checkInitialization()
    this.fetchData()
  }
}
