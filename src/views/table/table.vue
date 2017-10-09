<template>

  <Table :data="tableData1" :columns="tableColumns1" stripe>
    <div  slot="footer" style="padding-left:5px">
      <Page :total="100" :current="1"
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
  export default {
    data () {
      return {
        page: 1,
        pageSize: 10,
        tableData1: this.mockTableData1(),
        tableColumns1: [
          {
            title: '名称',
            key: 'name'
          },
          {
            title: '状态',
            key: 'status',
            render: (h, params) => {
              const row = params.row
              const color = row.status === 1 ? 'blue' : row.status === 2 ? 'green' : 'red'
              const text = row.status === 1 ? '构建中' : row.status === 2 ? '构建完成' : '构建失败'

              return h('Tag', {
                props: {
                  type: 'dot',
                  color: color
                }
              }, text)
            }
          },
          {
            title: '画像内容',
            key: 'portrayal',
            render: (h, params) => {
              return h('Poptip', {
                props: {
                  trigger: 'hover',
                  title: params.row.portrayal.length + '个画像',
                  placement: 'bottom'
                }
              }, [
                h('Tag', params.row.portrayal.length),
                h('div', {
                  slot: 'content'
                }, [
                  h('ul', this.tableData1[params.index].portrayal.map(item => {
                    return h('li', {
                      style: {
                        textAlign: 'center',
                        padding: '4px'
                      }
                    }, item)
                  }))
                ])
              ])
            }
          },
          {
            title: '选定人群数',
            key: 'people',
            render: (h, params) => {
              return h('Poptip', {
                props: {
                  trigger: 'hover',
                  title: params.row.people.length + '个客群',
                  placement: 'bottom'
                }
              }, [
                h('Tag', params.row.people.length),
                h('div', {
                  slot: 'content'
                }, [
                  h('ul', this.tableData1[params.index].people.map(item => {
                    return h('li', {
                      style: {
                        textAlign: 'center',
                        padding: '4px'
                      }
                    }, item.n + '：' + item.c + '人')
                  }))
                ])
              ])
            }
          },
          {
            title: '取样时段',
            key: 'time',
            render: (h, params) => {
              return h('div', '近' + params.row.time + '天')
            }
          },
          {
            title: '更新时间',
            key: 'update',
            render: (h, params) => {
              return h('div', this.formatDate(this.tableData1[params.index].update))
            }
          }
        ]
      }
    },
    methods: {
      mockTableData1 () {
        console.log('mockTableData ', this.pageSize, this.page)
        let data = []
        for (let i = 0; i < this.pageSize; i++) {
          data.push({
            name: '商圈' + Math.floor(Math.random() * 100 + 1),
            status: Math.floor(Math.random() * 3 + 1),
            portrayal: ['城市渗透', '人群迁移', '消费指数', '生活指数', '娱乐指数'],
            people: [
              {
                n: '客群' + Math.floor(Math.random() * 100 + 1),
                c: Math.floor(Math.random() * 1000000 + 100000)
              },
              {
                n: '客群' + Math.floor(Math.random() * 100 + 1),
                c: Math.floor(Math.random() * 1000000 + 100000)
              },
              {
                n: '客群' + Math.floor(Math.random() * 100 + 1),
                c: Math.floor(Math.random() * 1000000 + 100000)
              }
            ],
            time: Math.floor(Math.random() * 7 + 1),
            update: new Date()
          })
        }
        return data
      },
      formatDate (date) {
        const y = date.getFullYear()
        let m = date.getMonth() + 1
        m = m < 10 ? '0' + m : m
        let d = date.getDate()
        d = d < 10 ? ('0' + d) : d
        return y + '-' + m + '-' + d
      },
      changePage (page) {
        console.log('changePage', page)
        this.page = page
        // 这里直接更改了模拟的数据，真实使用场景应该从服务端获取数据
        this.tableData1 = this.mockTableData1()
      },
      changePageSize (size) {
        console.log('changePageSize', size)
        this.pageSize = size
        this.tableData1 = this.mockTableData1()

      }
    },
    mounted () {
      this.tableData1 = this.mockTableData1()

    }
  }
</script>
