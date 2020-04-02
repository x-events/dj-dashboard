<template>
    <div class="flex-row" style="margin-bottom:22px">
        <el-alert style="margin:0 20%" title="提示" type="warning" :description="text" :closable="false" center show-icon></el-alert>
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
      required: false
    },
    propdata: {
      type: String,
      required: true
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
        text: ""
      }
  },
  watch: {
    propdata: function(){
      this.text = this.propdata
    }
  },
  methods: {

  },
  created: function(){
    if(this.propdata){
      this.text = this.propdata
    }
    
  }
};
</script>

<style scoped>
.alert {}
</style>
