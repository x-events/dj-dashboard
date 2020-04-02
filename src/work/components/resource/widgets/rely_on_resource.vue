<template>
  <div class="el-form-item"
    :class="{'is-required': requiredvalue}"
    v-loading="loading">
    <div class="el-form-item__label" :style="{width: labelwidth+'px'}">{{labelname}}</div>
    <div class="el-form-item__content" :style="{marginLeft: labelwidth+'px'}">
      <div class="flex-row">
        <template v-if="disabled">
            <div class="flex-1">
                <span class="dib_bg" :title="checkValue(value,options)">{{checkValue(value,options)}}</span>
                <span class="dib_bg" :title="checkValue(value2,options2)">{{checkValue(value2,options2)}}</span>
            </div>
        </template>
        <template v-else>
            <div class="flex-1" style="margin-right:20px">
                <el-select v-model="value" placeholder="请选择" :disabled="disabled">
                    <el-option v-for="(item,index) in options" :key="'select'+index" :label="item.text" :value="item.value"></el-option>
                </el-select>
            </div>
            <div class="flex-1">
                <el-select v-model="value2" placeholder="请选择" :disabled="disabled">
                    <el-option v-for="(item,index) in options2" :key="'select'+index" :label="item.text" :value="item.value"></el-option>
                </el-select>
            </div>
        </template>
       

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
        loading: false,
        value: '',
        value2: '',
        options: [],
        options2: []
      }
  },
  watch: {
    propvalue: function(propvalue){
      this.value = propvalue[0] || ''
    },
    value: function(value){
      if(!value){
        this.value2 = '0'
        this.options2 = [];
        return this.$emit('change', [])
      }
      
      if(this.value2){
        this.value2 = '0'
      }else{
        this.value2 = this.propvalue[1] || ''
      }
      this.$emit('change', [value, this.value2])
    },
    value2: function(value2){
      this.$emit('change', [this.value, value2])
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
    }
    
  },
  created: function(){
    if(Array.isArray(this.propdata) && this.propdata.length){
      if(this.disabled){
        this.options = this.propdata;
      }else{
        this.options = [{value: '', text: '请选择'}].concat(this.propdata)
      }
    }
    if(this.propvalue){
      this.value = this.propvalue[0] || ''
    }
  }
};
</script>

<style scoped>

</style>
