<template>
  <el-drawer
      title="工作指引"
      :visible="visible"
      size="960px"
      direction="rtl"
      @close="handleClose"
      @opened="fetchData"
      >
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" v-loading="loading" style="height:100%" class="scrollbar" >
      <el-form-item label="工作提醒" v-if="currentNode.type==3">
        <el-switch
          v-model="ruleForm.remind"
          active-value="1"
          inactive-value="0">
        </el-switch>

        <dictSelect style="display:inline-block;width:10em;margin-left:1em;"
          params="reminder_interval"
          :value="ruleForm.reminder_interval"
          @input="ruleForm.reminder_interval=$event"
        />

        <el-time-picker style="display:inline-block;width:10em;margin-left:1em;"
          v-model="reminder_time"
          :clearable="false"
          :picker-options="{
            format: 'HH:mm'
          }"
          format="HH:mm"
          value-format="HH:mm"
          >
        </el-time-picker>
      </el-form-item>
      <el-form-item label="工作标准" prop="work_standard">
        <el-input v-model="ruleForm.work_standard" type="textarea" :rows="10"></el-input>
      </el-form-item>
      <el-form-item label="组织力指数" prop="strength_index_list">
        <div class="flex-row toolBar">
          <div class="flex-1">

          </div>
          <el-button type="info" plain size="mini" @click="getIndex('work')">添加</el-button>
          <el-button plain size="mini" @click="ruleForm.strength_index_list=[]">清空</el-button>
        </div>
        <el-table
          :data="ruleForm.strength_index_list"
          size="small"
          style="width: 100%">
          <el-table-column
            prop="title"
            label="相关指标"
            >
          </el-table-column>
          <el-table-column
            prop="score"
            label="满分"
            width="180">
          </el-table-column>
          <el-table-column
            align="right"
            label="操作"
            width="80">
            <template slot-scope="scope">
              <el-button plain size="mini" @click="ruleForm.strength_index_list.splice(scope.$index, 1)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item label="党员活跃度" prop="person_active_list">
        <div class="flex-row toolBar">
          <div class="flex-1">

          </div>
          <el-button type="info" plain size="mini" @click="getIndex('active')">添加</el-button>
          <el-button plain size="mini" @click="ruleForm.person_active_list=[]">清空</el-button>
        </div>
        <el-table
          :data="ruleForm.person_active_list"
          size="mini"
          style="width: 100%">
          <el-table-column
            prop="title"
            label="相关指标"
            >
          </el-table-column>
          <el-table-column
            prop="score"
            label="满分"
            width="180">
          </el-table-column>
          <el-table-column
            align="right"
            label="操作"
            width="80">
            <template slot-scope="scope">
              <el-button plain size="mini" @click="ruleForm.person_active_list.splice(scope.$index, 1)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item label="书记有为值" prop="leader_done_list">
        <div class="flex-row toolBar">
          <div class="flex-1">

          </div>
          <el-button type="info" plain size="mini" @click="getIndex('done')">添加</el-button>
          <el-button plain size="mini" @click="ruleForm.leader_done_list=[]">清空</el-button>
        </div>
        <el-table
          :data="ruleForm.leader_done_list"
          size="mini"
          style="width: 100%">
          <el-table-column
            prop="title"
            label="相关指标"
            >
          </el-table-column>
          <el-table-column
            prop="score"
            label="满分"
            width="180">
          </el-table-column>
          <el-table-column
            align="right"
            label="操作"
            width="80">
            <template slot-scope="scope">
              <el-button plain size="mini" @click="ruleForm.leader_done_list.splice(scope.$index, 1)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      
      <el-form-item label="流程指引" prop="process_text">
        <el-input v-model="ruleForm.process_text" type="textarea" :rows="10"></el-input>
      </el-form-item>

      <el-form-item label="流程图" prop="process_img_url">
        <div style="margin-bottom:5px;">
          <qiniu btn_text="上传" :multiple="false" accept="img" @success="upload_process_img_url" style="display:inline-block;margin-right:5px" />
          <el-button v-if="ruleForm.process_img_url" type="danger" plain @click="$set(ruleForm, 'process_img', '');$set(ruleForm, 'process_img_url', '')">删除</el-button>
        </div>
        
        <el-image
          v-if="ruleForm.process_img_url"
          style="width: 100px; height: 100px"
          :src="ruleForm.process_img_url"
          fit="cover"
          :preview-src-list="[ruleForm.process_img_url]"
        ></el-image>
        
      </el-form-item>

      <el-form-item label="工作依据" prop="working_basis_list">
        <div style="margin-bottom:5px;">
          <qiniu btn_text="上传" :multiple="true" accept="doc" @success="upload_working_basis_list" style="display:inline-block;margin-right:5px" />
          <el-button type="danger" plain @click="$set(ruleForm, 'working_basis_list', []);">清空</el-button>
        </div>
        <el-table
          :data="ruleForm.working_basis_list"
          size="mini"
          style="width: 100%">
          <el-table-column
            prop="title"
            label="名称"
            >
            
          </el-table-column>
          <el-table-column
            align="right"
            label="操作"
            width="80">
            <template slot-scope="scope">
              <el-button plain size="mini" @click="ruleForm.working_basis_list.splice(scope.$index, 1);">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      
      <el-form-item label="文件模板" prop="file_template_list">
        <div style="margin-bottom:5px;">
          <qiniu btn_text="上传" :multiple="true" accept="doc" @success="upload_file_template_list" style="display:inline-block;margin-right:5px" />
          <el-button type="danger" plain @click="$set(ruleForm, 'file_template_list', []);">清空</el-button>
        </div>
        <el-table
          :data="ruleForm.file_template_list"
          size="mini"
          style="width: 100%">
          <el-table-column
            prop="title"
            label="名称"
            >
            
          </el-table-column>
          <el-table-column
            align="right"
            label="操作"
            width="80">
            <template slot-scope="scope">
              <el-button plain size="mini" @click="ruleForm.file_template_list.splice(scope.$index, 1);">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      
      <el-form-item label="视频教程" prop="video_intro">
        <div style="margin-bottom:5px;">
          <qiniu btn_text="上传" :multiple="true" accept="video" @success="upload_video_intro" style="display:inline-block;margin-right:5px" />
          <el-button type="danger" plain @click="$set(ruleForm, 'video_intro_list', []);">清空</el-button>
        </div>
        <el-table
          :data="ruleForm.video_intro_list"
          size="mini"
          style="width: 100%">
          <el-table-column
            label="名称"
            >
            <template slot-scope="scope">
              <el-input v-model="scope.row.title" />
            </template>
          </el-table-column>
          <el-table-column
            label="封面（建议尺寸：370x225）"
            align="center"
            >
            <template slot-scope="scope">
              <template v-if="scope.row.img" >
                <el-image style="width: 100px; height: 100px"
                :src="scope.row.img_url"
                fit="cover"
                :preview-src-list="[scope.row.img_url]"
                ></el-image>
                <div style="text-align:center">
                  <el-button type="text" size="mini" @click="scope.row.img='';scope.row.img_url=''">删除</el-button>
                </div>
              </template>
              
              <qiniu v-else btn_text="上传" :multiple="false" accept="img" @success="scope.row.img=$event.id;scope.row.img_url=$event.domain+$event.file_key" />

            </template>
          </el-table-column>
          <el-table-column
            label="简介"
            >
            <template slot-scope="scope">
              <el-input v-model="scope.row.intro" ></el-input>
            </template>
          </el-table-column>
          <el-table-column
            align="right"
            label="操作"
            width="80"
            >
            <template slot-scope="scope">
              <el-button plain size="mini" @click="ruleForm.video_intro_list.splice(scope.$index, 1);">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>


      <el-form-item label="" >
        <el-button type="primary" @click="submitForm()">提 交</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </el-form-item>
    </el-form>

    <!-- 选择指标 -->
    <index-picker
      :visible="indexDialogVisible"
      :type="indexPickType"
      :picked="indexPicked"
      @pick="handlePick"
      @cancel="indexDialogVisible=false"
    />

  </el-drawer>
</template>

<script>
import * as util from "@/common/assets/util";
import * as form from "@/work/api/form";

const TEMP = {
      "remind": "0",
      "reminder_interval": "0",
      "reminder_hour": "0",
      "reminder_minute": "0",
      "reminder_time": "",
      "process_text": "",
      "work_standard": "",
      "process_img_url": "",
      "working_basis": "",
      "working_basis_list": [],
      "file_template": '',
      "file_template_list": [],
      "video_intro": [],
      "video_intro_list": [],
      "strength_index_list": [],
      "person_active_list": [],
      "leader_done_list": []
    }

export default {
  props: {
    visible: {
      type: Boolean,
      required: false,
      default: false
    },
    currentNode: {
      type: Object,
      required: false,
      default: function(){
        return {}
      }
    }
  },
   components: {
    "index-picker": (resolve) => require(['@/work/components/index-picker.vue'], resolve),
    dictSelect: (resolve) => require(['@/common/components/dictSelect.vue'], resolve)
  },
  data() {
    return {
      loading: false,
      indexDialogVisible: false,
      ruleForm: Object.assign({}, TEMP),
      rules: {
          
      },
      objs: [],
      indexPickType: '',
      reminder_time: ''
    }
  },
  computed: {
    indexPicked: function(){
      let result = [];
      switch(this.indexPickType){
        case 'work':
          result = result.concat(this.ruleForm.strength_index_list.map(e => e.id))
          break;
        case 'active':
          result = result.concat(this.ruleForm.person_active_list.map(e => e.id))
          break;
        case 'done':
          result = result.concat(this.ruleForm.leader_done_list.map(e => e.id))
          break;
        default: 
          console.warn(this.indexPickType) 
      }

      return result;
    }
  },
  watch: {
    currentNode: {
      handler: function(currentNode){
        if(currentNode.id){
          this.ruleForm.form_category_id = currentNode.id
        }else{
          
        }
      },
      deep: true,
      immediate: true
    },
    ruleForm: {
      handler: function(ruleForm){
        if(this.ruleForm.reminder_hour && this.ruleForm.reminder_minute){
          this.reminder_time = [this.ruleForm.reminder_hour, this.ruleForm.reminder_minute].join(':')
        }
        
      },
      deep: true,
      immediate: true
    },
    "ruleForm.video_intro_list": {
      handler: function(){
        const video_intro = this.ruleForm.video_intro_list.map(e => {
          return {
            "file_id": e.file_id,
            "title": e.title,
            "img": e.img,
            "img_url": e.img_url,
            "intro": e.intro
          }
        })
        this.$set(this.ruleForm, 'video_intro', video_intro)
      },
      deep: true,
      immediate: true
    },
    "ruleForm.working_basis_list": {
      handler: function(working_basis_list){
        
        this.$set(this.ruleForm, 'working_basis', working_basis_list.map(e => e.id).join(','))
      },
      deep: true,
      immediate: true
    },
    "ruleForm.file_template_list": {
      handler: function(file_template_list){
        
        this.$set(this.ruleForm, 'file_template', file_template_list.map(e => e.id).join(','))
      },
      deep: true,
      immediate: true
    },
    reminder_time: function(reminder_time){
      if(reminder_time){
        const arr = reminder_time.split(':');
        if(arr.length){
          this.ruleForm.reminder_hour = arr[0];
          this.ruleForm.reminder_minute = arr[1];
        }
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('cancel');
      this.$nextTick(() =>{
        this.ruleForm = Object.assign({}, TEMP)
      })
    },
    upload_process_img_url(data) {
      console.log(data)
      if(data && data.id){
        this.$set(this.ruleForm, 'process_img', data.id)
        this.$set(this.ruleForm, 'process_img_url', `${data.domain}${data.file_key}`)
      }else{
        console.wran(data)
      }

    },
    upload_working_basis_list(data){
      const d = [].concat(this.ruleForm.working_basis_list || []);
      d.push(data)
      console.log(d)
      this.$set(this.ruleForm, 'working_basis_list', d)
    },
    upload_file_template_list(data) {
      const d = [].concat(this.ruleForm.file_template_list || []);
      d.push(data)
      console.log(d)
      this.$set(this.ruleForm, 'file_template_list', d)
    },
    upload_video_intro(data) {
      const d = [].concat(this.ruleForm.video_intro_list || []);
      d.push({
        "file_id": data.id,
        "title": data.title,
        "img": "",
        "img_url": "",
        "intro": ""
      })
      console.log(d)
      this.$set(this.ruleForm, 'video_intro_list', d)
    },
    handlePick(list) {
      const submitList = list.map(e => {
        return {
          title: e.title,
          score: e.max_score,
          id: e.id
        }
      })
      // console.log(submitList)
      let newData = []
      switch(this.indexPickType){
        case 'work':
          newData = newData.concat(this.ruleForm.strength_index_list).concat(submitList);
          this.$set(this.ruleForm, 'strength_index_list', newData)
          break;
        case 'active':
          newData = newData.concat(this.ruleForm.person_active_list).concat(submitList);
          this.$set(this.ruleForm, 'person_active_list', newData)
          break;
        case 'done':
          newData = newData.concat(this.ruleForm.leader_done_list).concat(submitList);
          this.$set(this.ruleForm, 'leader_done_list', newData)
          break;
        default: 
          console.warn(this.indexPickType)
      }

      
      this.indexDialogVisible = false;
      this.indexPickType = '';
    },
    getIndex(type) {
      if(!type){
        return console.warn(type)
      }
      
      this.indexPickType = type;
      this.indexDialogVisible = true;
    },
    submitForm() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          //必填验证
          let video_list_valid = true;
          this.ruleForm.video_intro.forEach(e => {
            //数据过滤
            delete e.img_url;

            if(!e.img || !e.intro){
              video_list_valid = false
            }
          })

          if(!video_list_valid){
            return this.$message({
              message: '视频封面和简介必填！',
              type: 'warning'
            });
          }

          this.loading = true;
          form.guideUpdate.r(this.ruleForm).then(res => {
            this.loading = false;
            this.$emit('submit')
          }).catch(() => {
            this.loading = false;
          })
          
        } 
      });
    },
    fetchData() {
      this.loading = true;
      form.guide.r({
        form_category_id: this.currentNode.id
      }).then(res => {
        this.loading = false;
        const mydata = res.data.data;
        
        this.ruleForm = Object.assign({}, this.ruleForm, TEMP, mydata)
      })
    }
  }
}
</script>

<style scoped>

</style>
