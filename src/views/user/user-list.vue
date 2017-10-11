<template>

  <span>

    <Table :data="tableData1" :loading="loading" :columns="tableColumns" stripe>
      <div slot="header" style="padding:5px">
        <Select style="width: 80px;float: left">
          <Option value="day">日活</Option>
          <Option value="month">月活</Option>
        </Select>
        <Select style="width: 180px;float: left">
          <Option value="day">日活</Option>
          <Option value="month">月活xxxxxxx</Option>
        </Select>
        <div><Input style="width: 180px;height:10px;top: -8px;float: left"></Input></div>
        <DatePicker :value="value2" format="yyyy/MM/dd" type="daterange" placement="bottom-end"
                    placeholder="选择日期" style="width: 200px;float: left"></DatePicker>
        <Button icon="ios-search" style="float: left"></Button>
      </div>
      <div slot="footer" style="padding-left:5px">
        <Page :total="total" :current="1"
              size="small"
              placement="top"
              @on-change="onPageChange"
              @on-page-size-change="onPageSizeChange"
              show-elevator show-total show-sizer></Page>
      </div>
    </Table>

  </span>

</template>
<style>

</style>
<script>
  import expandRow from '../../components/table/expand-row.vue'
  import operation from '../../components/table/operation.vue'
  import userApi from '../../api/user'

  export default {
    components: {expandRow},
    data () {
      return {
        total: 0,
        loading: false,
        queryOptions: {
          page: 1,
          size: 10,
          sortWay: null,
          queryMethod: null,
          queryValue: null
        },
        tableData1: [],
        tableColumns: [
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
            width: 100,
            align: 'center',
            render: (h, params) => {
              return h(operation, {
                props: {
                  row: params.row,
                  operation: () => {
                    this.show(params.row)
                  }
                }
              })
            }
          },

          {
            width: 150,

            title: '帐号',
            key: 'login'
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
        ]
      }
    },
    methods: {
      fetchData () {
        userApi.list(this.queryOptions).then(res => {
          this.total = res.data.content.length
          this.tableData1 = res.data.content
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
      show (row) {
        this.$Modal.info({
          title: '用户信息',
          content: `帐号：${row.login}<br>`
        })
      },
      remove (index) {
        this.data6.splice(index, 1)
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
      this.tableData1 = this.fetchData()

    }
  }
</script>
