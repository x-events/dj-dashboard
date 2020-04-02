<template>
    <div class="el-form-item" :class="{'is-required': requiredvalue}">
        <div class="el-form-item__label" :style="{width: labelwidth+'px'}">{{labelname}}</div>
        <div class="el-form-item__content" :style="{marginLeft: labelwidth+'px'}">
            <template v-if="disabled">
                {{input}}
            </template>
            <template v-else>
                <el-input type="textarea" rows="6" :placeholder="placeholder || ('请输入'+labelname)" v-model="input" :maxlength="255" @change="$emit('change', input)" :readonly="disabled"></el-input>
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
  watch: {
    propvalue: function(propvalue){
      this.input = this.propvalue
    }
  },
  data() {
      return {
        input: ""
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
