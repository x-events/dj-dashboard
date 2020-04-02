<template>
  <div v-loading="loading">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="书籍名称" prop="title">
        <el-input v-model.trim="ruleForm.title"></el-input>
      </el-form-item>
      <el-form-item label="书籍分类" prop="category_id">
        <el-select v-model="ruleForm.category_id" placeholder="请选择书籍分类" class="w100" @change="$refs.ruleForm.validateField('category_id');">
          <el-option v-for="item in category_list" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="出版社" prop="press">
        <el-input v-model.trim="ruleForm.press"></el-input>
      </el-form-item>
      <el-form-item label="作者" prop="author">
        <el-input v-model.trim="ruleForm.author"></el-input>
      </el-form-item>
      <el-form-item label="出版时间" prop="publish_time">
        <el-input v-model="ruleForm.publish_time" type="hidden" class="hide"></el-input>
        <el-date-picker v-model="publish_time" type="date" value-format="timestamp" placeholder="选择日期" class="w100i">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="书籍封面" prop="cover_id">
        <el-col :span="10" v-if="ruleForm.cover_url.url" class="mb10">
          <div class="img"><img :src="ruleForm.cover_url.url"></div>
        </el-col>
        <el-col :span="24">
          <el-input v-model="ruleForm.cover_id" type="hidden" class="hide"></el-input>
          <qiniu btn_text="上传封面" :multiple="false" accept="img" @success="uploadCoverSuccess" />
        </el-col>
      </el-form-item>
      <el-form-item label="电子书" prop="content_id">
        <ul class="video_list" v-if="ruleForm.video_url.title">
          <li class="flex-row">
            <div class="flex-1 el mr10" :title="ruleForm.video_url.title">{{ruleForm.video_url.title}}</div>
            <el-button type="text" @click="videoDel()">删除</el-button>
          </li>
        </ul>
        <el-col :span="24">
          <el-input v-model="ruleForm.content_id" type="hidden" class="hide"></el-input>
          <qiniu btn_text="上传" :multiple="false" accept="doc" @success="uploadBookSuccess" />
        </el-col>
        
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm()">保存</el-button>
        <el-button @click="$emit('cancel')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import * as book from "@/learn/api/book";

const TEMP = {
  id:"",
  title:"",
  category_id:"",
  press:"",
  author:"",
  publish_time:"",
  cover_id:"",
  cover_url:{
    id:"",
    title:"",
    url:""
  },
  content_id:"",
  video_url:{
    id:"",
    title:"",
    url:""
  }
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
      queryParam:{
        id:""
      },
      ruleForm: Object.assign({}, TEMP),
      rules: {
          title: [
            { required: true, message: '请输入书籍名称', trigger: 'blur' }
          ],
          category_id: [
            { required: true, message: '请选择书籍名称', trigger: 'blur' }
          ],
          press: [
            { required: true, message: '请输入出版社', trigger: 'blur' }
          ],
          author: [
            { required: true, message: '请输入作者', trigger: 'blur' }
          ],
          publish_time: [
            { required: true, message: '请选择出版时间', trigger: 'blur' }
          ],
          cover_id: [
            { required: true, message: '请上传书籍封面', trigger: 'blur' }
          ],
          content_id: [
            { required: true, message: '请上传电子书', trigger: 'blur' }
          ]
      },
      category_list:[],
      publish_time:""
    }
  },
  watch: {
    publish_time(new_val){
      //console.log(new_val,'publish_time');
      this.ruleForm.publish_time = new_val/1000;
    },
    data: {
      handler: function(data){
        if(data && data.id){
          this.queryParam.id = data.id;
          this.$nextTick(()=>{
            this.fetchData()
          })
        }else{
          this.ruleForm = Object.assign({}, TEMP)
          this.$nextTick(()=>{
            this.$refs['ruleForm'].clearValidate()
            this.publish_time = ""
            this.ruleForm.cover_url = {
              id:"",
              title:"",
              url:""
            }
            this.ruleForm.video_url = {
              id:"",
              title:"",
              url:""
            }
          })
        }
        this.fetchCategory();
      },
      deep: true, 
      immediate: true
    }
  },
  methods: {
    uploadCoverSuccess(data){
      //console.log(data,'data');
      if(data.id){
        this.ruleForm.cover_id = data.id
        this.ruleForm.cover_url.url = data.domain+data.file_key
        this.$refs.ruleForm.validateField('cover_id');
      }
    },
    uploadBookSuccess(data){
      //console.log(data,'data');
      if(data.id){
        this.ruleForm.content_id = data.id
        this.ruleForm.video_url.title = data.title
        this.$refs.ruleForm.validateField('content_id');
      }
    },
    videoDel(){
      this.ruleForm.content_id = ""
      this.ruleForm.video_url = {
        id:"",
        title:"",
        url:""
      }
    },
    submitForm() {
      //console.log(this.ruleForm,'this.ruleForm');
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          book.bookSave.r(this.ruleForm).then(res => {
            this.$message.success(res.data.message);
            this.$emit('submit')
          })
        } 
      });
    },
    fetchCategory(){
      //获取书籍分类
      this.loading = true;
      book.bookCategoryTree.r().then(res => {
        this.loading = false;
        let result = res.data;
        this.category_list = result.data;
      });
    },
    fetchData() {
      //获取书籍详情
      this.loading = true;
      book.bookDetail.r(this.queryParam).then(res => {
        this.loading = false;
        let result = res.data;
        this.ruleForm = Object.assign({}, TEMP, result.data)
        this.publish_time = this.ruleForm.publish_time*1000
      });
    }
  }
}
</script>

<style scoped>
</style>