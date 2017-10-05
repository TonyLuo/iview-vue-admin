<template>
  <div>
    <Row>
      <Col span="6" style="padding-right: 5px">
      <info-card
        iconType="android-person-add"
        color="#2d8cf0"
        count="13425"
        message="Total Users"></info-card>
      </Col>
      <Col span="6" style="padding-right: 5px">
      <info-card
        iconType="android-person-add"
        color="#64d572"
        count="765"
        message="Total Members"></info-card>
      </Col>
      <Col span="6" style="padding-right: 5px">
      <info-card
        iconType="android-person-add"
        color="#ffd572"
        count="235"
        message="New Users"></info-card>
      </Col>
      <Col span="6" >
      <info-card
        iconType="android-person-add"
        color="#f25e43"
        count="76"
        message="New Member"></info-card>
      </Col>

    </Row>
    <Row style="padding-top: 10px">
      <Col span="24">
      <Card>
        <p slot="title" class="card-title">
          <Icon type="ios-shuffle-strong"></Icon>
          广告投放分析
        </p>
        <div class="line-chart-con">
          <line-chart></line-chart>
        </div>
      </Card>
      </Col>

    </Row>
    <Row style="padding-top: 10px">
      <Col span="8" style="padding-right: 5px">
      <Card>
        <p slot="title" class="card-title">
          <Icon type="android-wifi"></Icon>
          各类用户服务调用变化统计

        </p>
        <div style="height: 200px">
          <gauge-chart></gauge-chart>
        </div>
      </Card>
      </Col>
      <Col span="8" style="padding-right: 5px">
      <Card>
        <p slot="title" class="card-title">
          <Icon type="android-wifi"></Icon>
          用户访问来源

        </p>
        <div style="height: 200px">
          <pie-chart></pie-chart>
        </div>
      </Card>
      </Col>
      <Col span="8" >
      <Card>
        <p slot="title" class="card-title">
          <Icon type="android-wifi"></Icon>
          上周每日服务调用量

        </p>
        <div style="height: 200px">
          <shadow-chart></shadow-chart>
        </div>
      </Card>
      </Col>

    </Row>

  </div>
</template>

<script>
  import infoCard from '../../components/info-card/infoCard.vue'
  import lineChart from '../../components/echarts/lineChart.vue'
  import gaugeChart from '../../components/echarts/gaugeChart.vue'
  import pieChart from '../../components/echarts/pieChart.vue'
  import shadowChart from '../../components/echarts/shadowChart.vue'
  export default {
    components: {
      infoCard,
      lineChart,
      gaugeChart,
      pieChart,
      shadowChart
    }

  }
</script>

<style>
  .line-chart-con{
    height: 200px;
  }
</style>
