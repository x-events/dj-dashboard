<template>
  <div v-loading="loading">
    <template v-if="disabled">
      <div class="previewlist">
        <el-image v-for="(item,index) in list" :key="'img'+index"
          class="_item"
          :src="item.url"
          fit="cover"
          @click.native="handlePictureCardPreview(item)"
        ></el-image>
      </div>
    </template>
    <template v-else>
      <el-upload
        :class="{
          'avatar-uploader': !!onefile,
          'hidePicker': !onefile && !(list.length<limit)
        }"
        :action="upload"
        :headers="{Authorization: $root.user && $root.user.access_token}"
        accept="image/*"
        :file-list="list"
        :show-file-list="!onefile"
        :list-type="onefile ? 'text' : 'picture-card'"
        :on-success="handleSuccess"
        :on-remove="handleRemove"
        :on-preview="handlePictureCardPreview"
        :on-error="handleError"
        :before-upload="beforeUpload"
        :disabled="disabled"
        :limit="limit"
      >
        <template v-if="onefile">
          <el-image
            v-if="list[0]"
            class="avatar"
            :src="list[0].url"
            fit="cover"
          ></el-image>
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </template>
        <template v-else>
          <template v-if="list.length<limit">
            <i class="el-icon-plus" ></i>
          </template>
          <template v-else>
            达到上传上限
          </template>
        </template>
      </el-upload>
    </template>
    
    <!-- 图片预览 -->
    <el-dialog :visible.sync="previewVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import * as util from "@/common/assets/util";

export default {
  props: {
    propvalue: {
      type: [Object, Array],
      required: true,
      default: function(){
        return []
      }
    },
    onefile: {
      type: Boolean,
      required: false,
      default: false
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    limit: {
        type: Number,
        default: 9
    }
  },
  data() {
    return {
      loading: false,
      previewVisible: false,
      dialogImageUrl: '',
      upload: "",
      list: []
    };
  },
  watch: {
    propvalue: {
      handler: function(propvalue) {
          if (this.onefile) {
            if(propvalue.id){
              this.list = [propvalue];
            }else{
              this.list = [];
            }
          } else {
            this.list = propvalue;
          }
      },
      deep: true,
      immediate: true
    },
    list: {
      handler: function(list) {
        const result = this.onefile
            ? (list[0] || {})
            : list;
            //console.log(result)
        this.$emit( "change",result);
      },
      deep: true
    }
  },
  methods: {
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.previewVisible = true;
    },
    handleSuccess: function(res, file, filelist) {
      this.loading = false;
      if (this.onefile) {
        this.list = [res.data];
      } else {
        this.list.push(res.data);
      }
    },
    handleRemove(file, fileList) {
      this.list = this.list.filter(e => {
        return e.id != file.id
      })
    },
    handleError: function(err) {
      this.loading = false;
      return util.catchError(err);
    },
    beforeUpload: function() {
      this.loading = true;
      return true;
    }
  },
  created: function() {
    
  }
};
</script>

<style scoped>
.hidePicker >>> .el-upload--picture-card{display: none;}
.avatar-uploader >>> .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader >>> .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .previewlist{overflow: hidden;}
  .previewlist ._item{overflow: hidden;
    cursor: pointer;
    background-color: #fff;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    box-sizing: border-box;
    width: 145px;
    height: 145px;
    margin: 0 8px 8px 0;
    display: inline-block;}
</style>

