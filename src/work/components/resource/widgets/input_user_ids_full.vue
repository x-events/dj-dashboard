<template>
  <div class="el-form-item"
    :class="{'is-required': requiredvalue}">
    <div class="el-form-item__label" :style="{width: labelwidth+'px'}">{{labelname}}</div>
    <div class="el-form-item__content" :style="{marginLeft: labelwidth+'px'}">
        <template v-if="disabled">
            {{user_name_list}}
        </template>
        <template>
            <el-input :value="user_name_list" :placeholder="placeholder || ('请输入'+labelname)" readonly suffix-icon="el-icon-circle-plus" @focus="!disabled && (pickerDialog=true)"></el-input>
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
        [{
          id: 1,
          name: "name1"
        }]
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
    placeholder: {
      type: String,
      required: false
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      pickerDialog: false,
      user_list: [],
      user_name_list: ""
    };
  },
  watch: {
    propvalue: {
      handler: function(){
        if (Array.isArray(this.propvalue)) {
          if(this.propvalue.length && this.propvalue[0].name){
            this.user_list = [].concat(this.propvalue);
          }else{
            this.user_list = []
          }
        }
      },
      deep: true
    },
    user_list: {
      handler: function(user_list) {
        this.user_name_list = user_list.map(e => e.name).join(",");
        this.$emit("change", user_list.map(e => e.uid));
      },
      deep: true
    }
  },
  methods: {},
  created: function() {
    if (Array.isArray(this.propvalue)) {
      if(this.propvalue.length && this.propvalue[0].name){
        this.user_list = [].concat(this.propvalue);
      }else{
        this.user_list = []
      }
    }
    // 重置事件
    util.on('resetWidgets', () => {
      this.user_list = []
    })
  }
};
</script>

<style scoped>
</style>
