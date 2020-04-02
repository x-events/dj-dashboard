<template>
  <div class="el-form-item"
    :class="{'is-required': requiredvalue}">
    <div class="el-form-item__label" :style="{width: labelwidth+'px'}">{{labelname}}</div>
    <div class="el-form-item__content" :style="{marginLeft: labelwidth+'px'}">

        <template v-if="disabled">
            {{input}}
        </template>
        <template v-else>
            <el-input :placeholder="input" 
            :maxlength="127"
            v-model.number="input" 
            type="number"
            :readonly="disabled"
            @change="$emit('change', input)" 
            ></el-input>
        </template>
        
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
      type: Number,
      required: false,
      default: 0
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
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
      return {
        input: 0
      }
  },
  watch: {
    propvalue: function(propvalue){
      this.input = this.propvalue
    },
    input: function(input){
      let result = parseInt(input);
      if(isNaN(result)){
        result = ''
      }else{
        if(result>99999){
          result = 99999
        }
        if(result<0){
          result = 0
        }
      }
      
      this.input = result;
      this.$emit('change', result)
    }
  },
  methods: {

  },
  created: function(){
    if(this.propvalue){
      this.input = this.propvalue
    }
  }
};
</script>

<style scoped>

</style>
