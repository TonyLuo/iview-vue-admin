<style scoped>
  .expand-row {
    margin-bottom: 5px;
  }
</style>
<template>
  <div>
    <Row class="expand-row">
      <Col span="8">
      <span class="expand-key">帐号：</span>
      <span class="expand-value">{{ row.login }}</span>
      </Col>
      <Col span="8">
      <span class="expand-key">姓氏：</span>
      <span class="expand-value">{{ row.firstName  }}</span>
      </Col>
      <Col span="8">
      <span class="expand-key">名字：</span>
      <span class="expand-value">{{ row.lastName }}</span>
      </Col>

    </Row>
    <Row class="expand-row">
      <Col span="8">
      <span class="expand-key">权限：</span>
      <span class="expand-value">{{ row.authorities }}</span>
      </Col>

      <Col span="8">
      <span class="expand-key">创建时间	：</span>
      <span class="expand-value">{{ row.createdDate }}</span>
      </Col>
      <Col span="8">
      <span class="expand-key">更新时间：</span>
      <span class="expand-value">{{ row.lastModifiedDate }}</span>
      </Col>


    </Row>
  </div>
</template>
<script>
  export default {
    name: 'expandRow',
    props: {
      row: {
        type: Object, default: function () {
          return {}
        }
      }
    }
  }
</script>
