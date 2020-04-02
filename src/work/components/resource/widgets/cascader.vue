<template>
  <div class="el-form-item"
    :class="{'is-required': requiredvalue}">
    <div class="el-form-item__label" :style="{width: labelwidth+'px'}">{{labelname}}</div>
    <div class="el-form-item__content" :style="{marginLeft: labelwidth+'px'}">
      <template v-if="disabled">
        {{displayText}}
      </template>
      <template v-else>
        <el-cascader
          :options="options"
          v-model="value"
          :show-all-levels="false"
          :disabled="disabled">
        </el-cascader>
      </template>
    </div>
  </div>
</template>

<script>
import * as util from "@/common/assets/util"

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
      type: String,
      required: false,
      default: function() {
        /*
        ""
        */
        return "";
      }
    },
    propdata: {
      type: Array,
      required: false,
      default: function(){
        /*
        [{text: "", value: ""}]
        */
        return []
      }
    },
    requiredvalue: {
      type: Boolean,
      required: false,
      default: false
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
      return {
        value: [],
        options: [],
        displayText: ''
      }
  },
  watch: {
    propvalue: function(propvalue){
      this.value = propvalue.split(',')
    },
    value: function(value){
      this.$emit('change', value[value.length-1])
    }
  },
  methods: {

  },
  created: function(){
    if(Array.isArray(this.propdata) && this.propdata.length){
      this.options = util.buildMenu(this.propdata, 'pid')
    }
    if(this.propvalue){
      this.value = this.propvalue.split(',')
    }
    //只读状态
    if(this.options.length && this.value.length){
      let targetData = [].concat(this.options);
      let result = [];
      this.value.forEach(v => {
        const targetIndex = targetData.findIndex(e => e.value==v)
        if(targetIndex!==-1){
          result.push(targetData[targetIndex].label || targetData[targetIndex].text)
          if(targetData[targetIndex].children){
            targetData = targetData[targetIndex].children
          }
        }
        
      })
      
      this.displayText = result.join('/')
    }
  }
};
</script>

<style scoped>

</style>
