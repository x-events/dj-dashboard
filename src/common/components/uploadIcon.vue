<template>
    <el-col :span="4" class="upload-div">
        <el-upload v-if="!lookTag"
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :before-upload="beforeUpload"
            :accept="acceptType"
            v-loading.fullscreen.lock="uploading"
            :element-loading-text="uploadProgress+'%'"
            element-loading-spinner="el-icon-loading">
            <img v-if="imgUrl" :src="imgUrl" class="avatar">
            <!-- <i class="el-icon-plus avatar-uploader-icon" v-if="!imgUrl && !lookTag"></i> -->
            <img class="default-icon" :src="defaultIcon" v-if="!imgUrl && !lookTag">
            <!-- <div slot="tip" class="el-upload__tip" :style="{top: tipTop}" v-if="!imgUrl && !lookTag">{{ tip }}</div> -->
            <!-- <div class="upload-text">{{imgText}}</div> -->
        </el-upload>
        <div class="avatar-uploader look" v-else>
            <img v-if="imgUrl" :src="imgUrl" class="avatar">
            <div class="upload-text" v-if="introShow">{{imgText}}</div>
        </div>
    </el-col>
</template>

<script>
import * as qiniuApi from "@/common/api/qiniu";
import * as qiniu from 'qiniu-js'

export default {
    props: {
        // action: {
        //     type: String,
        //     default: common.upload
        // },
        image: {
            type: String,
            default: ''
        },
        imgText: {
            type: String,
            required: true,
            default: ''
        },
        lookTag: {
            type: Boolean,
            default: false
        },
        tip: {
            type: String,
            default: '推荐240x320比例的照片'
        },
        defaultIcon: {
            type: String,
            default: require('@/common/assets/img/dc160.png')
        },
        isIntro: {
            type: Boolean,
            default: true
        },
        tipTop: {
            type: String,
            default: ''
        },
        accept: {
          type: String,
          default: function() {
            return "all";
          }
        },
    },
    data() {
        return {
            imgUrl: this.image,
            introShow: this.isIntro,
            uploading:false,
            uploadProgress:0,
            extension_size:{
              img: 20 * 1024 * 1024,          //20M
              video: 2 * 1024 * 1024 * 1024,  //2G
              doc: 10 * 1024 * 1024,          //10M
              zip: 200 * 1024 * 1024          //200M
            },
        };
    },
    watch: {
        image() {
            this.imgUrl = this.image
        },
        isIntro(val) {
            this.introShow = val
        }
    },
    computed: {
      acceptType(){
        switch (this.accept) {
          case 'img':
            return '.jpg,.png,.jpeg,.gif'
          case 'video':
            return '.avi,.rm,.rmvb,.wmv,.flv,.mpg,.mpeg,.mp4,.mov,.3gp,.mkv,.mp3,.wma'
          case 'doc':
            return '.doc,.docx,.ppt,.pptx,.pdf'
          case 'zip':
            return '.zip,.rar'
          default:
            return '*'
        }
      }
    },
    methods: {
      setFileKey(filename){
        var date = new Date();
        var month = "0"+parseInt(date.getMonth()+1);
        month = month.substr(-2);
        var day = "0"+date.getDate();
        day = day.substr(-2);
        var newtime = date.getFullYear()+''+month+''+day;
        var guid = "";
        for (var i = 1; i <= 8; i++){
          var n = Math.floor(Math.random()*16.0).toString(16);
          guid +=   n;
          if((i==4)||(i==12)||(i==16)||(i==20))
            guid += "-";
        }
        var ext = filename.split(".").pop();
        return newtime+'_'+date.getTime()+guid+'.'+ext;
      },
      checkFile(file_size,file_ext,file_name){
        //文件类型验证
        if(this.acceptType.indexOf(file_ext) == -1){ 
          return '该文件类型不允许上传'
        }
        //文件大小验证
        let file_size_M = file_size /(1024 * 1024);
        if(file_size <= 0){return '文件大小为0M不能上传'}
        let max_size = this.extension_size[this.accept] || 0;
        if(max_size && file_size > max_size){
            max_size = max_size / (1024 * 1024);
            return '文件大小超过' + max_size + 'M不能上传'
        }
        //文件名称长度验证
        if(file_name.length > 40){
          return '您上传的文件名称超过40个字符不能上传'
        }
        return false
      },
      beforeUpload(file){
        const file_size = file.size;  //文件大小
        const file_ext = file.name.split(".").pop();  //文件扩展名
        const file_name = file.name.substring(0, file.name.lastIndexOf('.'));   //文件名称
        const key = this.setFileKey(file.name);   //上传到七牛服务器的文件名
        
        if(this.checkFile(file_size,file_ext,file_name)){
          //验证不通过进行拦截
          this.$message.error(this.checkFile(file_size,file_ext,file_name));
          return
        }
        //console.log('验证通过');

        this.uploading = true;
        //获取七牛token
        qiniuApi.qiniuToken.r({ext: file_ext}).then(res => {
          let result = res.data.data
          this.upToken = result.up_token;
          this.domain = result.domain;

          const config = {
            useCdnDomain: true,
            region: qiniu.region.z0
          };
          
          let putExtra = {
            fname: file.name,
            params: {},
            mimeType: null
          };

          const observer = {
            next: response => {
              if(response.total.percent < 100){
                this.uploading = true;
              }else{
                this.uploading = false;
              }
              this.uploadProgress = Math.floor(response.total.percent)// 上传进度
            },
            error: err => {
              this.$message.error('上传失败' + err.message)
            },
            complete: response => {
              //console.log(response,'上传成功');
              let params = {
                title:file_name,
                file_key:key,
                ext:file_ext,
                source_size:file_size,
                domain:this.domain,
              }
              if(response.persistentId){
                params.file_code = response.persistentId
              }
              //将七牛文件信息提交到服务器
              qiniuApi.fileCreate.r(params).then(res=> {
                let result = res.data.data;
                //console.log(result);
                this.$message.success('文件上传成功')
                this.$emit('success',result)
                
              }).catch((e)=>{
                this.uploading = false;
                this.$message.error(e.message)
              })
            }
          }

          const observable  = qiniu.upload(file,key,this.upToken,putExtra, config);
          observable.subscribe(observer) // 上传开始
        }).catch((e)=>{
          this.$message.error(e.message)
        })

        return false
      },
        // 上传成功
        uploadSuccess(res, file, fileList) {
            this.imgUrl = res.data.url
            this.$emit('on-Success', res);
        },
        /* beforeUpload(file) {
            const isLt2M = file.size / 1024 / 1024 < 10;
            if(!isLt2M) {
                this.$message({
                    message: '上传文件大小不能超过 10MB!',
                    type: 'warning'
                });
            }
            return isLt2M
        } */
    }
};
</script>

<style scoped>
.upload-div { width: 160px; }
.default-icon { width: 100%; }
</style>
