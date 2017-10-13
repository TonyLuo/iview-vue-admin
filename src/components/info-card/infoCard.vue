<template>

  <Card :padding="0">
    <div class="info-card-con">
      <Col class="info-card-icon-con" :style="{backgroundColor: color, color: 'white'}" span="8">
      <div class="align-middle">
        <Icon :type="iconType" :size="iconSize"></Icon>
      </div>
      </Col>
      <Col span="16" class="height-100">
      <div class="align-middle">
        <p :style="{color: color}" class="info-num">{{count}}</p>
        <p class="info-intro-text">{{ message }}</p>
      </div>
      </Col>
    </div>
  </Card>
</template>
<style lang="less">


  .info-num {
    text-align: center;
    font-size: 30px;
    font-weight: 700;
  }

  .info-card-icon-con {
    height: 100%;
  }

  .height-100 {
    height: 100%;
  }

  .info-card-con {
    height: 100px;
  }

  .info-intro-text {
    font-size: 12px;
    font-weight: 500;
    color: #C8C8C8;
  }
</style>
<script>
  export default {
    name: 'infoCard',
    props: {
      color: String,
      iconType: String,
      count: String,
      message: String,
      iconSize: {
        type: Number,
        default: 40
      }
    }
  }
</script>
