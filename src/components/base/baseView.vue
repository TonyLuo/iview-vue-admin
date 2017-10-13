<template>

  <div>

    <search-criteria :search-options="searchOptions" @clear="onRefresh()">
      <div slot="simple-search-btn-append">
        <Button type="ghost" icon="plus" style="margin-left: 5px;float: left" @click="onCreate"></Button>
      </div>
    </search-criteria>
    <div>
      <Table :data="tableData" :loading="loading" :columns="tableColumns" stripe>

        <div slot="footer" style="padding-left:5px">
          <Page :total="total"
                :current.sync="page"
                size="small"
                placement="top"
                @on-change="onPageChange"
                @on-page-size-change="onPageSizeChange"
                show-elevator show-total show-sizer></Page>
        </div>
      </Table>
    </div>
    <!--<Modal-->
    <!--v-model="showEditModal"-->
    <!--title="普通的Modal对话框标题"-->
    <!--@on-ok="onOK"-->
    <!--@on-cancel="onClose">-->
    <!--<p>对话框内容</p>-->
    <!--<p>对话框内容</p>-->
    <!--<p>对话框内容</p>-->
    <!--</Modal>-->
    <edit-modal :visible.sync="showEditModal"
                title="普通的Modal对话框标题dd"
                :data="editForm"
                :fields="fields"
                @ok="onOK"
                @calcel="onClose">

    </edit-modal>

  </div>

</template>
<style>

</style>
<script src="./baseView.js"></script>

