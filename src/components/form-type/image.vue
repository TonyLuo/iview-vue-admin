<template>
  <span>
    <div class="demo-upload-list" v-for="(item, index) in uploadList" :key="index"
         :style="{width: (size -2) + 'px', height:(size -2) + 'px','line-height': (size -2) + 'px'}">
      <template v-if="item.status === 'finished'">
        <img :src="item.url">
        <div class="demo-upload-list-cover" @click="handleView(item)">
          <Icon type="ios-close" @click.native="handleRemove(item,$event)" class="remove-btn" v-if="!disabled"></Icon>
        </div>
      </template>
      <template v-else>
        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
      </template>
    </div>

    <Upload v-if="!disabled"
            ref="upload"
            :show-upload-list="false"
            :on-success="handleSuccess"
            :format="['jpg','jpeg','png']"
            :max-size="2048"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :before-upload="handleBeforeUpload"
            :on-progress="onProgress"
            :multiple="multiple"
            type="drag"
            :action="action"
            :data="uploadParams"
            v-bind:style="{ display: 'inline-block', width:(size -2) + 'px;' }">
      <div :style="{width: (size -2) + 'px', height:(size -2) + 'px','line-height': (size -2) + 'px'}">
        <Icon type="camera" size="20"></Icon>
      </div>
    </Upload>
    <Modal v-model="visible" id="image-preview-modal">
      <img :src="fileUrl" v-if="visible" style="width: 100%;height: 100%">
      <span slot="footer"></span>
      <span slot="close">
        <Icon type="ios-close" size="30" color="white"></Icon>
      </span>
    </Modal>
  </span>
</template>
<script>
  import qiniu from '../../libs/qiniu'

  export default {
    name: 'imageItem',
    props: {
      value: {
        type: [Array, String]
      },
      multiple: {type: Boolean, default: false},
      disabled: {type: Boolean, default: false},
      size: {type: Number, default: 60}
    },
    data() {
      return {
//        action:"//jsonplaceholder.typicode.com/posts/"
        action: 'https://upload-z2.qbox.me',
        uploadParams: {token: ''},
        uploadDomainName: 'http://ov8e12r3a.bkt.clouddn.com/',
        fileUrl: '',
        visible: false,
        uploadList: [],
      }
    },
    computed: {},
    methods: {
      init() {
        this.uploadList = []
        if (!this.multiple) {
          if (this.value && this.value !== '') {
            let file = {status: 'finished', 'url': this.value}
            this.uploadList = [file]
          }

        } else {
          if (this.value && (typeof this.value === 'Array')) {
            this.uploadList = this.value.map(item => {
              item.status = 'finished';
              return item
            })
          }
        }
      },
      handleFileChange(file) {
        this.uploadList = this.$refs.upload.fileList

        if (!this.multiple) {
          if (this.$refs.upload.fileList && this.$refs.upload.fileList.length > 0) {
            this.$emit('input', file.url)

          } else {
            this.$emit('input', null)

          }

        } else {
          this.$emit('input', this.$refs.upload.fileList)

        }

      },
      handleView(file) {
        this.fileUrl = file.url
        this.visible = true;
      },
      onProgress(event, file, fileList) {
        this.uploadList = fileList

      },
      handleRemove(file, $event) {
        $event.stopPropagation()
        // 从 upload 实例删除数据
        const fileList = this.$refs.upload.fileList;
        this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
        this.handleFileChange(file)
      },
      handleSuccess(res, file) {
        const url = this.uploadDomainName + res.key
        file.url = url
        file.key = res.key
        file.name = res.key
        this.handleFileChange(file)

      },
      handleFormatError(file) {
        this.$Notice.warning({
          title: '文件格式不正确',
          desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
        });
      },
      handleMaxSize(file) {
        this.$Notice.warning({
          title: '超出文件大小限制',
          desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
        });
      },
      handleBeforeUpload() {
        const check = this.uploadList.length < 5;
        if (!check) {
          this.$Notice.warning({
            title: '最多只能上传 5 张图片。'
          });
        } else {
          return new Promise((resolve, reject) => {
            qiniu.getUploadToken().then(uploadToken => {
              const token = uploadToken.token
              this.uploadDomainName = uploadToken.domain_name
              this.uploadParams.token = token

//              let fileExtension = '.' + file.name.split('.').pop()
//              this.uploadParams.key = this.user.id + fileExtension;
              resolve(true)
            }).catch(err => {
              /* eslint-disable prefer-promise-reject-errors */
              reject(false)
            })
          })
        }

        return check;
      }
    },
    watch: {
      value() {
        this.init()
      }
    },

    mounted() {
      this.init()
    }
  }
</script>

<style rel="stylesheet/less" type="text/css" lang="less">
  #image-preview-modal {

  .ivu-modal-body {
    height: 520px;
    padding: 0px !important;
  }

  .ivu-modal-footer {
    display: none;
  }

  .ivu-modal-close {
    top: -22px !important;
    right: -22px !important;
    position: absolute;
    opacity: 0.6;

  }

  }

  .demo-upload-list {
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    margin-right: 4px;
  }

  .demo-upload-list img {
    width: 100%;
    height: 100%;
  }

  .demo-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .6);
  }

  .demo-upload-list:hover .demo-upload-list-cover {
    display: block;
    cursor: pointer;

  }

  .demo-upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }

  .demo-upload-list-cover .remove-btn {
    left: 0px;
    top: 0px;
    opacity: 0.7;
    position: absolute;
  }
</style>
