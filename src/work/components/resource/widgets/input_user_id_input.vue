<template>
  <div class="el-form-item"
    :class="{'is-required': requiredvalue}">
    <div class="el-form-item__label" :style="{width: labelwidth+'px'}">{{labelname}}</div>
    <div class="el-form-item__content" :style="{marginLeft: labelwidth+'px'}">
      <template v-if="disabled">
        {{user.name}}
      </template>
      <template v-else>
        <div class="flex-row">
            <div class="flex-1" style="margin-right:10px">
                <el-input v-model="user.name"  :placeholder="placeholder || ('请输入'+labelname)" @change="user.id=0" :maxlength="127" :readonly="disabled"></el-input>
            </div>
            <el-button :disabled="disabled" @click.prevent="pickerDialog=true" v-if="!disabled">选择</el-button>
        </div>
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
        }
      },
      deep: true
    },
    user: {
      handler: function(user){
        this.$emit('change', {
          id: user.uid || user.id,
          name: user.name
        })
      },
      deep: true
    }
  },
  methods: {
    
  },
  created: function(){
    if(this.propvalue && this.propvalue.name){
      this.user = Object.assign({}, this.propvalue)
    }
    
  }
};
</script>

<style scoped>

</style>
