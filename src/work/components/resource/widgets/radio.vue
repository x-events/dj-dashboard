<template>
    <div class="el-form-item" :class="{'is-required': requiredvalue}">
        <div class="el-form-item__label" :style="{width: labelwidth+'px'}">{{labelname}}</div>
        <div class="el-form-item__content" :style="{marginLeft: labelwidth+'px'}">
            <template v-if="disabled">
                {{checkValue(value,options)}}
            </template>
            <template v-else>
                <el-radio v-for="(item,index) in options" :key="'radio'+index" v-model="value" :label="item.value" :disabled="disabled">{{item.text}}</el-radio>
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
