<template>
  <div v-loading="loading" class="el-form-item" :class="{'is-required': requiredvalue}">
    <div class="el-form-item__label" :style="{width: labelwidth+'px'}">{{labelname}}</div>
    <div class="el-form-item__content" :style="{marginLeft: labelwidth+'px'}">

        <template v-if="disabled">
            <span v-for="(file, i) in files" :key="i"><a class="dib_file" :title="file.name" @click="weboffice(file)">{{file.name}}</a></span>
        </template>
        <template v-else>
        <el-upload
            :action="upload"
            :headers="{Authorization: $root.user && $root.user.access_token}"
            :file-list="files"
            :show-file-list="false"
            :on-success="handleSuccess"
            :on-error="handleError"
            :before-upload="beforeUpload"
            :accept="accept"
            v-if="!disabled"
        >
            <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
        <div>
            <el-tag
            v-for="file in files"
            :key="'file'+file.id"
            :closable="!disabled"
            type="primary"
            @close="handleRemove(file, files)"
            >
            <a @click="weboffice(file)">{{file.name}}</a>
            </el-tag>
        </div>
        </template>

    </div>
  </div>
</template>

<script>
import * as util from "@/common/assets/util";

export default {
  props: {
    labelname: {
      type: String,
      required: true,
      default: "请输入"
    },
    labelwidth: {
      type: Number,
      required: false,
      default: 80
    },
    propvalue: {
      type: Array,
      required: false,
      default: function() {
        /*
        [{name: "food.jpeg", url:"..."}]
        */
        return [];
      }
    },
    propdata: {
      type: Array,
      required: false,
      default: function() {
        return [];
      }
    },
    requiredvalue: {
      type: Boolean,
      required: false,
      default: false
    },
    accept:{
        type: String,
        default:function(){
            return '*'
        }
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      upload: "",
      files: []
    };
  },
  watch: {
    propvalue: {
      handler: function(propvalue) {
        if (Array.isArray(this.propvalue)) {
          this.files = [].concat(this.propvalue);
          this.$emit("change", this.files.map(e => e.id));
        }
      },
      deep: true
    }
  },
  methods: {
    weboffice: util.weboffice,
    handleSuccess: function(res, file, filelist) {
      this.loading = false;
      this.files.push(res.data);
      this.$emit("change", this.files.map(e => e.id));
    },
    handleRemove: function(file, filelist) {
      if (file.url) {
        this.files = filelist.filter(f => {
          return f.url !== file.url;
        });
        this.$emit("change", this.files.map(e => e.id));
      }
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
    if (Array.isArray(this.propvalue)) {
      this.files = [].concat(this.propvalue);
      this.$emit("change", this.files.map(e => e.id));
    }
  }
};
</script>

<style scoped>
.el-tag { margin:0 5px 5px 0;}
</style>
