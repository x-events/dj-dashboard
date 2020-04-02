<template>
  <div v-loading="loading">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="课程名称" prop="title">
        <el-input v-model.trim="ruleForm.title"></el-input>
      </el-form-item>
      <el-form-item label="课程分类" prop="category_id">
        <el-select v-model="ruleForm.category_id" placeholder="请选择课程分类" class="w100" @change="$refs.ruleForm.validateField('category_id');">
          <el-option v-for="item in category_list" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="课程时长" required>
        <el-col :span="7">
          <el-form-item prop="minute">
            <el-input v-model.trim="ruleForm.minute" maxlength="3"><template slot="append">分</template></el-input>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="1">&nbsp;</el-col>
        <el-col :span="7">
          <el-form-item prop="second">
            <el-input v-model.trim="ruleForm.second" maxlength="3"><template slot="append">秒</template></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="课程学时" prop="credit">
        <el-input v-model.trim="ruleForm.credit" maxlength="3"></el-input>
      </el-form-item>
      <el-form-item label="课程封面" prop="cover_id">
        <el-col :span="10" v-if="ruleForm.cover_url.url" class="mb10">
          <div class="img"><img :src="ruleForm.cover_url.url"></div>
        </el-col>
        <el-col :span="24">
          <el-input v-model="ruleForm.cover_id" type="hidden" class="hide"></el-input>
          <qiniu btn_text="上传封面" :multiple="false" accept="img" @success="uploadCoverSuccess" />
        </el-col>
      </el-form-item>
      <el-form-item label="课程视频" prop="content_id">
        <ul class="video_list" v-if="ruleForm.video_url.title">
          <li class="flex-row">
            <div class="flex-1 el mr10" :title="ruleForm.video_url.title">{{ruleForm.video_url.title}}</div>
            <el-button type="text" @click="videoDel()">删除</el-button>
          </li>
        </ul>
        <el-col :span="24">
          <el-input v-model="ruleForm.content_id" type="hidden" class="hide"></el-input>
          <qiniu btn_text="上传视频" :multiple="false" accept="video" @success="uploadVideoSuccess" />
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
import * as course from "@/learn/api/course";

const TEMP = {
  id:"",
  title:"",
  category_id:"",
  minute:"",
  second:"",
  credit:"",
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
    var checkTime = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入课程时长'));
      } else {
        if(value.length>3){
          callback(new Error('长度在1-3个字符'));
        }
        callback();
      }
    };
    return {
      loading:true,
      queryParam:{
        id:""
      },
      ruleForm: Object.assign({}, TEMP),
      rules: {
          title: [
            { required: true, message: '请输入课程名称', trigger: 'blur' }
          ],
          category_id: [
            { required: true, message: '请选择课程分类', trigger: 'blur' }
          ],
          minute: [
            { required: true, validator: checkTime, trigger: 'blur' }
          ],
          second: [
            { required: true, validator: checkTime, trigger: 'blur' }
          ],
          credit: [
            { required: true, message: '请输入课程学时', trigger: 'blur' }
          ],
          cover_id: [
            { required: true, message: '请上传课程封面', trigger: 'blur' }
          ],
          content_id: [
            { required: true, message: '请上传课程视频', trigger: 'blur' }
          ]
      },
      category_list:[],
    }
  },
  watch: {
    data: {
      handler: function(data){
        if(data && data.id){
          this.queryParam.id = data.id;
          this.$nextTick(()=>{
            this.fetchData()
          })
        }else{
          this.ruleForm = Object.assign({}, TEMP)
          this.$nextTick(() => {
            this.$refs['ruleForm'].clearValidate()
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
    uploadVideoSuccess(data){
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
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          course.courseSave.r(this.ruleForm).then(res => {
            this.$message.success(res.data.message);
            this.$emit('submit')
          })
        } 
      });
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
    fetchData() {
      //获取课程详情
      this.loading = true;
      course.courseDetail.r(this.queryParam).then(res => {
        this.loading = false;
        let result = res.data;
        this.ruleForm = Object.assign({}, TEMP, result.data)
      });
    }
  }
}
</script>

<style scoped>
</style>