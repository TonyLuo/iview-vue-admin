<template>

  <Table :data="tableData1" :columns="tableColumns" stripe>
    <div slot="footer" style="padding-left:5px">
      <Page :total="total" :current="1"
            size="small"
            placement="top"
            @on-change="changePage"
            @on-page-size-change="changePageSize"
            show-elevator show-total show-sizer></Page>
    </div>
  </Table>


</template>
<style>

</style>
<script>
  import userApi from '../../api/user'

  export default {
    data () {
      return {
        page: 1,
        pageSize: 10,
        total: 0,
        tableData1: [],
        tableColumns: [
          {
            title: '帐号',
            key: 'login'
          },
          {
            title: '姓氏',
            key: 'firstName'
          },
          {
            title: '名字',
            key: 'lastName'
          },
          {
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
            title: '创建时间',
            key: 'createdDate',
            render: (h, params) => {
              return h('div', this.formatDate(params.row.createdDate))
            }
          },
          {
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

        userApi.list().then(res => {
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
      changePage (page) {
        this.page = page
        // 这里直接更改了模拟的数据，真实使用场景应该从服务端获取数据
        this.tableData1 = this.mockTableData1()
      },
      changePageSize (size) {
        this.pageSize = size
        this.tableData1 = this.fetchData()

      }
    },
    mounted () {
      this.tableData1 = this.fetchData()

    }
  }
</script>
