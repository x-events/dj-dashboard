<template>
  <div v-loading="loading" class="el-form-item" :class="{'is-required': requiredvalue}">
    <div class="el-form-item__label" :style="{width: labelwidth+'px'}">{{labelname}}</div>
    <div class="el-form-item__content" :style="{marginLeft: labelwidth+'px'}">
        <template v-if="disabled">
            <span v-if="files.length">{{files[0].name}}</span>
        </template>
        <template v-else>
            <template v-if="files.length">
                <a @click="weboffice(files[0])" style="margin-right:20px;">
                    <el-button type="text">{{files[0].name}}</el-button>
                </a>
            </template>
            <el-upload style="display:inline-block" :action="upload" :headers="{Authorization: $root.user && $root.user.access_token}" :file-list="files" :show-file-list="false" :on-success="handleSuccess" :on-error="handleError" :before-upload="beforeUpload" :accept="accept" v-if="!disabled">
                    <el-button size="small" type="primary">点击上传文件</el-button>
            </el-upload>
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
      type: Object,
      required: false,
      default: function() {
        /*
        [{name: "food.jpeg", url:"..."}]
        */
        return {};
      }
    },
    propdata: {
      type: Object,
      required: false
    },
    requiredvalue: {
      type: Boolean,
      required: false,
      default: false
    },
    accept: {
      type: String,
      default: function() {
        return "*";
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
      handler: function() {
        if (this.propvalue) {
          this.files = [this.propvalue];
          this.$emit("change", this.files[0] ? this.files[0].id : '');
        }
      },
      deep: true
    }
  },
  methods: {
    weboffice: util.weboffice,
    handleSuccess: function(res, file, filelist) {
      this.loading = false;
      this.files = [res.data];
      this.$emit("change", this.files[0] ? this.files[0].id : '');
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
    if (this.propvalue) {
      this.files = [this.propvalue];
      this.$emit("change", this.files[0] ? this.files[0].id : '');
    }
  }
};
</script>

<style scoped>
.el-tag {
  margin: 0 5px 5px 0;
}
</style>
