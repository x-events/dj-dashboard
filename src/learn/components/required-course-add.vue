<template>
<div>
  <div class="flex-row addCourse">
    <div class="sideBar blockLayout scrollbar">
      <ul class="comlist">
        <li v-for="(item, index) in category_list" :key="index" :class="{'active':current_category == item.id}" @click="changeCategory(item)">{{item.name}}</li>
      </ul>
    </div>
    <div class="flex-1 blockLayout flex-col">
      <el-table stripe :data="course_list" style="width: 100%" @selection-change="handleSelectionChange" height="100%" class="flex-1">
        <el-table-column type="selection" width="70" align="center"></el-table-column>
        <el-table-column prop="title" label="课程名" show-overflow-tooltip></el-table-column>
      </el-table>

      <!-- page -->
      <page :length="course_list.length" :p="queryParam.p" :pagesize="queryParam.pagesize" :total="totalRows" @current-change="handleCurrentChange" />
    </div>
  </div>
  <div class="tc">
    <el-button type="primary" @click="submitForm()" :disabled="!addForm.id.length">保存</el-button>
    <el-button @click="$emit('cancel')">取消</el-button>
  </div>
</div>
</template>

<script>
import * as course from "@/learn/api/course";

const TEMP = {
  category_id: "",
  p: 1,
  pagesize: 10,
  type: "1",
  org_id: ""
}

export default {
  props: {
    data: {
      type: Object,
      required: false,
      default: function(){
        return {}
      }
    }
  },
  data() {
    return {
      loading:true,
      queryParam: Object.assign({}, TEMP),
      current_category:"",
      category_list:[],
      course_list:[],
      totalRows:0,
      multipleSelection:[],
      addForm:{
        id:[],
        org_id:""
      }
    }
  },
  watch: {
    data: {
      handler: function(data){
        if(data && data.org_id){
          this.queryParam = Object.assign({}, TEMP, data)
          this.fetchCategory();
          this.fetchData();
        }else{
          this.queryParam = Object.assign({}, TEMP);
          this.current_category = ""
        }
      },
      deep: true, 
      immediate: true
    },
    multipleSelection(new_val){
      //console.log(new_val,'multipleSelection');
      this.addForm.id = [];
      new_val.map(e=>{
        this.addForm.id.push(e.id)
      })
    }
  },
  methods: {
    handleSelectionChange(val){
      this.multipleSelection = val;
    },
    changeCategory(item){
      this.current_category = item.id;
      this.queryParam.category_id = item.id;
      this.queryParam.p = 1
      this.fetchData()
    },
    handleCurrentChange(currentPage){
      this.queryParam.p = currentPage;
      this.fetchData();
    },
    submitForm() {
      this.addForm.org_id = this.data.org_id;
      course.govCourseSave.r(this.addForm).then(res => {
        this.$message.success(res.data.message);
        this.$emit('submit')
      })
    },
    fetchCategory(){
      //获取课程分类
      this.loading = true;
      course.courseCategoryTree.r().then(res => {
        this.loading = false;
        let result = res.data;
        this.category_list = result.data;
      });
    },
    fetchData(){
      this.loading = true;
      course.courseTree.r(this.queryParam).then(res => {
        this.loading = false;
        let result = res.data;
        this.course_list = result.data;
        this.totalRows = result.totalRows;
      });
    }
  }
}
</script>

<style scoped>
.addCourse { height:500px;}
.blockLayout { border:#ddd 1px solid; margin-right:0;}
.sideBar { margin-right:20px; width:200px;}
.comlist li { padding:5px 10px; cursor:pointer; margin-bottom:2px;}
.comlist li:hover,.comlist li.active { background-color:#eee;}
</style>