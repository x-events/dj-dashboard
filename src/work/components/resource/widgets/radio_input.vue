<template>
  <div>
    <div class="el-form-item" v-if="!disabled">
      <div class="el-form-item__label" :style="{width: labelwidth+'px'}">{{labelname}}</div>
      <div class="el-form-item__content" :style="{marginLeft: labelwidth+'px'}">
        <el-switch v-model="radio_input"></el-switch>
      </div>
    </div>

    <div class="el-form-item" v-show="radio_input">
      <div class="el-form-item__label" :style="{width: labelwidth+'px'}"> </div>
      <div class="el-form-item__content" :style="{marginLeft: labelwidth+'px'}">
        <el-input 
          v-model="input" 
          :placeholder="placeholder || ('请输入'+labelname)"
          @change="$emit('change', input)" 
          :maxlength="127"
          :readonly="disabled"></el-input>
      </div>
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
        return []
      }
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
        radio_input: false,
        input: ""
      }
  },
  watch: {
    propvalue: {
      handler: function(){
        this.input = this.propvalue
        this.radio_input = !!this.input
      },
      deep: true
    },
    radio_input: function(radio_input){
      if(!radio_input){
        this.input = ''
        this.$emit('change', '')
      }
    }
  },
  methods: {
    
  },
  created: function(){
    if(this.propvalue){
      this.input = this.propvalue
      this.radio_input = true
    }
    
  }
};
</script>

<style scoped>

</style>
