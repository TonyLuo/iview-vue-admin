<template>

  <div>

    <search-criteria :search-options="searchOptions" @clear="onRefresh()" @search-btn-click="onSearchBtnClick">
      <div slot="simple-search-btn-append" style="float: left">
        <Button type="ghost" icon="plus" style="margin-left: 5px;float: left" @click="onCreate"></Button>
      </div>
      <div slot="search-btn-append" style="float: left">

        <Button type="warning" icon="close" style="margin-left: 5px;float: left" @click="onDeleteSelection"
                v-if="multipleSelection && multipleSelection.length > 0">删除
        </Button>

        <span v-for="btn in searchOptions.buttonList" :key="btn.name">
          <Button style="margin-left: 5px;float: left"
                  :type="btn.type" :icon="btn.meta.iconName" @click="btn.meta.operation"
                  v-if="checkPermission(btn)" > {{btn.name}}
        </Button>
        </span>

      </div>
    </search-criteria>
    <div>
      <Table :data="tableData"
             :loading="loading"
             :columns="tableColumns"
             @on-sort-change="onSortChange"
             @on-select-all="onSelectAll"
             @on-selection-change="onSelectionChange"
             stripe>


        <div slot="footer" style="padding-left:5px">
          <Page :total="total"
                :current.sync="queryOptions.page"
                size="small"
                placement="top"
                @on-change="onPageChange"
                @on-page-size-change="onPageSizeChange"
                show-elevator show-total show-sizer></Page>
        </div>
      </Table>
    </div>
    <edit-modal :visible.sync="showEditModal"
                :title="editModalTitleMap[editModalStatus]"
                :data="editForm"
                :fields="fields"
                @ok="onOK"
                @calcel="onClose">

    </edit-modal>

    <Modal v-model="deleteConfirmModal" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
        <p>删除后将无法恢复</p>
        <p>是否继续删除？</p>
      </div>
      <div slot="footer">
        <Button type="ghost" @click="deleteConfirmModal = !deleteConfirmModal">取消</Button>
        <Button type="error" :loading="deleteConfirmModalLoading" @click="del">删除</Button>
      </div>
    </Modal>

  </div>

</template>
<script>
  import baseView from '../../components/base/baseView.js'
  import userApi from '../../api/user.api'
  import {checkPermission, formatDate} from '../../libs/util'

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
      return {
        deleteConfirmModalLoading: false,
        deleteConfirmModal: false,
        showSelection: true,
        showExpand: true,
        showOperation: false,
        expandColNum: 2,
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
        searchOptions: {
          buttonList: [
            {
              name: '创建',
              meta: {
                auth: ['ROLE_ADMIN'],
                type: 'ghost',
                iconName: 'plus',
                operation: this.onCreate
              }
            },
            {
              name: '删除',
              meta: {
                auth: ['ROLE_ADMIN'],
                type: 'ghost',
                iconName: 'close',
                operation: this.onDeleteSelection
              }
            },
          ],
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
      checkPermission(item){
        return checkPermission(item)
      },
      onDeleteSelection() {
        this.deleteConfirmModal = true
        console.log(this.multipleSelection)
      },
      del() {
        this.deleteConfirmModalLoading = true;
        setTimeout(() => {
          this.deleteConfirmModalLoading = false;
          this.deleteConfirmModal = false;
          this.$Message.success('删除成功');
        }, 2000);
      },
      onSelectAll(selection) {
        console.log('onSelectAll ====')

        console.log(selection)
      },
      onSelectionChange(selection) {
        console.log('onSelectionChange ====')
        console.log(selection)

        this.multipleSelection = selection
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
