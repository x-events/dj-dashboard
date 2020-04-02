<template>
  <div>
    <div class="el-form-item">
      <div class="el-form-item__label" :style="{width: labelwidth+'px'}">{{labelname}}</div>
      <div class="el-form-item__content" :style="{marginLeft: labelwidth+'px'}">
        <el-switch v-model="radio_input"></el-switch>
      </div>
    </div>

    <div class="el-form-item" v-show="radio_input">
      <div class="el-form-item__label" :style="{width: labelwidth+'px'}"> </div>
      <div class="el-form-item__content" :style="{marginLeft: labelwidth+'px'}">
        <el-input 
          :value="user.name" 
          :placeholder="placeholder || ('请输入'+labelname)"
          readonly 
          suffix-icon="el-icon-circle-plus"
          :maxlength="127"
          @focus="!disabled && (pickerDialog=true)"></el-input>
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
        radio_input: false,
        user: {
          id: 0,
          name: ''
        }
      }
  },
  watch: {
    propvalue: {
      handler: function(){
        if(this.propvalue){
          this.user = Object.assign({}, this.propvalue)
          this.radio_input = !!this.propvalue.name
        }
      },
      deep: true
    },
    radio_input: function(radio_input){
      if(!radio_input){
        this.user = {
          id: 0,
          name: ''
        }
      }
    },
    user: function(user){
      this.$emit('change', user.uid || user.id)
    }
  },
  methods: {
    
  },
  created: function(){
    if(this.propvalue && this.propvalue.name){
      this.user = Object.assign({}, this.propvalue)
      this.radio_input = true
    }
    
  }
};
</script>

<style scoped>

</style>
