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
      showSelection: false,
      showExpand: true,
      showOperation: true,
      expandColNum: 2,

      api: null,
      fields: null,
      buttonList: [
        {
          name: '创建',
          meta: {
            type: 'ghost',
            iconName: 'plus',
            operation: this.onCreate
          }
        },
        {
          name: '删除',
          meta: {
            type: 'warning',
            iconName: 'close',
            operation: this.onDeleteSelection
          }
        },
      ],
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
      multipleSelection: null,

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
      showEditModal: false,

      deleteOperation: null,
      deleteData: null,
      deleteConfirmModal: false,
      deleteConfirmModalLoading: false,

    }
  },
  computed: {
    //dynamic generate the table columns based on the user role
    tableColumns: function () {

      let preColumns = []
      if (this.showSelection) {
        preColumns.push({
          type: 'selection',
          width: 60,
          align: 'center'
        })
      }
      if (this.showExpand) {
        preColumns.push({
          type: 'expand',
          width: 30,
          render: (h, params) => {
            return h(expandRow, {
              props: {
                row: params.row,
                fields: this.fields,
                colNum: this.expandColNum
              }
            })
          }
        })
      }
      if (this.showOperation) {
        preColumns.push(
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
          }
        )
      }

      this.fields = this.fields.filter(item => {
        return checkPermission(item)
      })
      let columns = [
        ...preColumns,
        ...this.fields.filter(item => {
          return !(item.meta && item.meta.hidden)
        })
      ]
      return columns
    },
  },
  methods: {

    checkHideCondition(btn){
      if(typeof btn.meta.hideCondition === 'function'){

        return btn.meta.hideCondition.call()
      }else{
        return btn.meta.hideCondition
      }
    },
    checkPermit(btn) {
      return checkPermission(btn)
    },
    checkInitialization() {
      warn(this.api === null, '[baseView] api is not initialized properly')
      warn(this.fields === null, '[baseView] fields is not initialized properly')

    },
    // table operation


    onPageChange(page) {
      this.queryOptions.page = page
      this.fetchData()
    },

    onPageSizeChange(size) {
      this.queryOptions.page = 1
      this.queryOptions.size = size
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
    onSelectAll(selection) {

    },
    onSelectionChange(selection) {
      this.multipleSelection = selection
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
      this.deleteConfirmModal = true
      this.deleteOperation = this.delete
      this.deleteData = row

    },
    onDeleteSelection() {
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        this.deleteConfirmModal = true
        this.deleteOperation = this.deleteSelection
        this.deleteData = this.multipleSelection
      }


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
    onSearchBtnClick() {
      this.$set(this.queryOptions, "page", 1) // reset the page to first page which click search button
    },
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

    del(deleteOperation, deleteData) {
      if (deleteOperation) {
        this.deleteConfirmModalLoading = true;

        deleteOperation(deleteData).then((res) => {

          this.deleteConfirmModalLoading = false;
          this.deleteConfirmModal = false;
          this.fetchData()
          this.afterDelete(deleteData, res)
          this.$Message.info('删除成功')


        }).catch(error => {
          this.deleteConfirmModalLoading = false;
          this.deleteConfirmModal = false;
          this.$Message.error('删除失败')

        })
      }
      else {
        this.deleteConfirmModalLoading = false;
        this.deleteConfirmModal = false;
      }

    },
    delete(row) {
      if (this.api && this.api.delete) {
        return this.api.delete(row.id)
      } else {
        return new Promise((resolve, reject) => {
          resolve(true)
        })
      }


    },
    deleteSelection(selection) {
      if (this.api && this.api.deleteRecordList) {
        return this.api.deleteRecordList(selection)

      } else {
        return new Promise((resolve, reject) => {
          resolve(true)
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
