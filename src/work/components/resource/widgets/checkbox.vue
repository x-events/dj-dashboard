<template>
  <div class="el-form-item"
    :class="{'is-required': requiredvalue}">
    <div class="el-form-item__label" :style="{width: labelwidth+'px'}">{{labelname}}</div>
    <div class="el-form-item__content" :style="{marginLeft: labelwidth+'px'}">
      <el-checkbox-group v-model="value" :disabled="disabled" @change="$emit('change', value)" :class="{'textOnly':disabled}">
        <el-checkbox v-for="(item,index) in options" :key="'ckb'+index" :label="item.value" :class="{'noText':!item.text}">{{item.text}}</el-checkbox>
      </el-checkbox-group>
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
      type: Array,
      required: false,
      default: function() {
        /*
        ""
        */
        return [];
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
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
      return {
        options: [],
        value: []
      }
  },
  watch: {
    propvalue: function(propvalue){
      this.value = this.propvalue
    }
  },
  methods: {
    checkValue(value,data){
        let text = '';
        data.forEach(e => {
            if(value == e.value){
                text = e.text
            }
        });
        return text
    },
  },
  created: function(){
    if(this.propdata.length){
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
