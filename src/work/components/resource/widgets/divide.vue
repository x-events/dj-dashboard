<template>
  <div class="divide">
    <h3>{{text}}</h3>
    <el-divider></el-divider>
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
      type: [String, Array],
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
    },
    ext_props: {
      type: Object,
      required: false,
      default: function(){
        return {}
      }
    }
  },
  data() {
      return {
        text: ""
      }
  },
  watch: {
    labelname: {
      handler: function(){
        this.text = this.labelname
      },
      immediate: true
    }
  },
  methods: {

  },
  created: function(){
    
  }
};
</script>

<style scoped>
.divide{
  margin-bottom:22px;
  margin-left:90px;
}
/* .readOnly .divide { margin-left:100px;} */
</style>
