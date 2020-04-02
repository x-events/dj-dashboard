<template>
    <div class="el-form-item" :class="{'is-required': requiredvalue}">
        <div class="el-form-item__label" :style="{width: labelwidth+'px'}">{{labelname}}</div>
        <div class="el-form-item__content" :style="{marginLeft: labelwidth+'px'}">
            <template v-if="disabled">
                {{choosen.name}}
            </template>
            <template v-else>
                <el-input :value="choosen.name" :placeholder="placeholder || ('请选择'+labelname)" :clearable="!disabled" @focus="!disabled && (pickerDialog=true)" @clear="choosen={}"></el-input>
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
      type: Object,
      required: false,
      default: function(){
        /*
        {name: "组织名", id:""}
        */
        return {}
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
        choosen: {}
      }
  },
  watch: {
    propvalue: {
      handler: function() {
        if(this.propvalue){
          this.choosen = Object.assign({}, this.propvalue)
        }
      },
      deep: true
    },
    choosen: {
      handler: function(choosen){
        this.$emit('change', choosen.id || '')
      },
      deep: true
    }
  },
  methods: {
    
  },
  created: function(){
    if(this.propvalue){
      this.choosen = Object.assign({}, this.propvalue)
    }
    
  }
};
</script>

<style scoped>

</style>
