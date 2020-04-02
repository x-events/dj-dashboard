<template>
  <div class="el-form-item"
    :class="{'is-required': requiredvalue}">
    <div class="el-form-item__label" :style="{width: labelwidth+'px'}">{{labelname}}</div>
    <div class="el-form-item__content" :style="{marginLeft: labelwidth+'px'}">
      <template v-if="disabled">
        {{user.name}}
      </template>
      <template v-else>
        <el-input 
        :value="user.name" 
        :placeholder="placeholder || ('请输入'+labelname)"
        readonly 
        suffix-icon="el-icon-circle-plus"
        @focus="!disabled && (pickerDialog=true)"></el-input>
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
      default: '请输入'
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
        {
          id: 1,
          name: "name1"
        }
        */
        return {};
      }
    },
    propdata: {
      type: Array,
      required: false,
      default: function(){
        return []
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
        user: {
          uid: 0,
          name: ''
        }
      }
  },
  watch: {
    propvalue: {
      handler: function(){
        if(this.propvalue){
          this.user = Object.assign({}, this.propvalue)
          this.$nextTick(() => {
            this.$emit('change', this.user.uid || 0)
          })
        }
      },
      deep: true
    },
    user: {
      handler: function(user){
        this.$emit('change', user.uid || 0)
      },
      deep: true
    }
  },
  methods: {
    
  },
  created: function(){
    if(this.propvalue && this.propvalue.name){
      this.user = Object.assign({}, this.propvalue)
      this.$nextTick(() => {
        this.$emit('change', this.user.uid || 0)
      })
    }
    // 重置事件
    util.on('resetWidgets', () => {
      this.user = {
          uid: 0,
          name: ''
        }
    })
  }
};
</script>

<style scoped>

</style>
