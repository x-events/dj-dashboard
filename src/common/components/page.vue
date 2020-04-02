<template>
  <el-pagination
    v-if="p_length"
    class="pagination"
    background
    :layout="layout"
    :page-size="p_pagesize"
    :current-page="p_p"
    :total="p_total"
    @current-change="handleCurrentChange"
  ></el-pagination>
</template>

<script>
export default {
  props: {
    length: {
      type: [String,Number],
      default: function() {
        return 0;
      }
    },
    p:{
      type: [String,Number],
      default: function() {
        return 1;
      }
    },
    pagesize:{
      type: [String,Number],
      required:true,
      default: function() {
        return 10;
      }
    },
    total:{
      type: [String,Number],
      required:true,
      default: function() {
        return 0;
      }
    },
    layout:{
      type: String,
      default: function() {
        return "total, prev, pager, next";
      }
    }
  },
  computed: {
    p_length(){
      return parseInt(this.length);
    },
    p_p(){
      return parseInt(this.p);
    },
    p_pagesize(){
      return parseInt(this.pagesize);
    },
    p_total(){
      return parseInt(this.total);
    },
  },
  data() {
    return {};
  },
  watch: {
    p_length(new_val){
      if(new_val == 0 && this.p_p !=1){
        this.$emit('current-change',1)
      }
    }
  },
  methods: {
    handleCurrentChange(p){
      this.$emit('current-change',p)
    }
  }
}
</script>

<style scoped>
</style>
