<template>
  <div class="el-form-item"
    :class="{'is-required': requiredvalue}">
    <div class="el-form-item__label" :style="{width: labelwidth+'px'}">{{labelname}}</div>
    <div class="el-form-item__content" :style="{marginLeft: labelwidth+'px'}">
      <el-select v-model="value" :placeholder="setPlaceholder()" :disabled="disabled" :class="{'textOnly':disabled == true}">
        <el-option v-for="(item,index) in options" :key="'select'+index" :label="item.text" :value="item.value"></el-option>
      </el-select>
    </div>
  </div>
</template>

<script>

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
        value: "",
        options: []
      }
  },
  watch: {
    propvalue: function(propvalue){
      this.value = propvalue
    },
    value: function(value){
      this.$emit('change', value)
    }
  },
  methods: {
      setPlaceholder(){
          if(this.disabled){
              return ''
          }else{
              return this.placeholder || ('请选择'+this.labelname)
          }
      }
  },
  created: function(){
    if(Array.isArray(this.propdata) && this.propdata.length){
      this.options = this.propdata
    }
    if(this.propvalue){
      this.value = this.propvalue
    }
  }
};
</script>

<style scoped>

</style>
