<template>

  <div>

    <search-criteria :search-options="searchOptions" @clear="onRefresh()" @search-btn-click="onSearchBtnClick">
      <div slot="simple-search-btn-append" style="float: left">
        <Button type="ghost" icon="plus" style="margin-left: 5px;float: left" @click="onCreate"></Button>
      </div>
      <div slot="search-btn-append" style="float: left">
        <Button type="warning" icon="close" style="margin-left: 5px;float: left" @click="onDeleteSelection"
                v-if="multipleSelection && multipleSelection.length > 0">删除</Button>
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


  </div>

</template>
<style>

</style>
<script src="./baseView.js"></script>

