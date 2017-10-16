<template>

  <div>

    <search-criteria :search-options="searchOptions" @clear="onRefresh()" @search-btn-click="onSearchBtnClick">
      <!--<div slot="simple-search-btn-append" style="float: left">-->
        <!--<Button type="ghost" icon="plus" style="margin-left: 5px;float: left" @click="onCreate"></Button>-->
      <!--</div>-->
      <div slot="search-btn-append" style="float: left">
        <!--<Button type="warning" icon="close" style="margin-left: 5px;float: left" @click="onDeleteSelection"-->
                <!--v-if="multipleSelection && multipleSelection.length > 0">删除-->
        <!--</Button>-->
        <span v-for="btn in buttonList" :key="btn.name" style="margin-left: 5px;float: left">
          <Button
                  :type="btn.meta.type"
                  :icon="btn.meta.iconName"
                  @click="btn.meta.operation"
                  v-show="!checkHideCondition(btn)"
                  v-if="checkPermit(btn)"> {{btn.name}}
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
    <template>


    </template>
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
        <Button type="error" :loading="deleteConfirmModalLoading" @click="del(deleteOperation,deleteData)">删除</Button>
      </div>
    </Modal>

  </div>

</template>
<style>

</style>
<script src="./baseView.js"></script>

