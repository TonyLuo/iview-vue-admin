<template>
  <div id="shadowChart" style="width:100%;height: 100%"></div>
</template>
<script>
  import echarts from 'echarts'

  export default {
    name: 'lineChart',
    props: {
      chartOptions: Object,
      chartData: Object

    },
    methods: {
      init () {
        let  option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            top: 0,
            left: '2%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
          },
          yAxis: {
            type: 'category',
            data: ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
            nameTextStyle: {
              color: '#c3c3c3'
            }
          },
          series: [
            {
              name: '访问量',
              type: 'bar',
              data: [
                {value: 453682, name: 'Mon', itemStyle: {normal: {color: '#2d8cf0'}}},
                {value: 879545, name: 'Tues', itemStyle: {normal: {color: '#2d8cf0'}}},
                {value: 2354678, name: 'Wed', itemStyle: {normal: {color: '#2d8cf0'}}},
                {value: 1598403, name: 'Thur', itemStyle: {normal: {color: '#2d8cf0'}}},
                {value: 543250, name: 'Fri', itemStyle: {normal: {color: '#2d8cf0'}}},
                {value: 1305923, name: 'Sat', itemStyle: {normal: {color: '#2d8cf0'}}},
                {value: 1103456, name: 'Sun', itemStyle: {normal: {color: '#2d8cf0'}}}
              ]
            }
          ]
        };
        const shadowChart = echarts.init(document.getElementById('shadowChart'))
        shadowChart.setOption(option)

        window.addEventListener('resize', function () {
          shadowChart.resize()
        })
      }

    },
    mounted () {
      this.init()
    }
  }
</script>
