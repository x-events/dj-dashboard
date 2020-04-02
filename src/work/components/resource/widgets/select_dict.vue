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
          :props="{label:'label'}"
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
const getFullArray = function(val, array) {
    if (val && Array.isArray(array) && array.length) {

        let targetData = [].concat(array);
        let result = [];
        const returnFather = function(node) {
            const targetIndex = targetData.findIndex(e => (e.id == node.pid) || (e.id == node.pId))
            if (targetIndex !== -1) {
                return targetData[targetIndex]
            }
        }

        const nodeIndex = targetData.findIndex(e => (e.value == val) || (e.id == val))
        if (nodeIndex !== -1) {
            result.push(targetData[nodeIndex])
            const found = function() {
                const lastNode = result[result.length - 1];
                let father = returnFather(lastNode)
                if (father) {
                    result.push(father)
                    found()
                }
            }
            //start!
            found()
        }

        return result.reverse()
    }else{
        console.warn('getFullArray()参数异常', val, array)
    }
}

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
      type: [String, Number],
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
        nodes: [],
        options: [],
        displayText: ''
      }
  },
  watch: {
    propvalue: {
      handler: function(propvalue){
        const fullval = getFullArray(propvalue, this.propdata)
        if(fullval){
          this.nodes = fullval;
          this.displayText = this.nodes.map(e => e.label).join('/')

          this.value = fullval.map(e => e.value)
        }
        
      },
      immediate: true
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
    
  }
};
</script>

<style scoped>

</style>
