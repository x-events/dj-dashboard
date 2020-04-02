<template>
  <div class="flex-col">
    <quill-editor v-model="content" ref="myQuillEditor" :options="editorOption" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @change="onEditorChange($event)" v-loading.fullscreen.lock="uploading" :element-loading-text="uploadProgress+'%'" element-loading-spinner="el-icon-loading" class="myEditor flex-col flex-1">
    </quill-editor>
    <div class="limit hide">当前已输入 <span>{{nowLength}}</span> 个字符，您还可以输入 <span>{{SurplusLength}}</span> 个字符。</div>
    <!-- 文件上传input 将它隐藏-->
    <el-upload
      action=""
      :before-upload="beforeUpload"
      :multiple="multiple"
      :accept="acceptType"
      ref="upload"
      class="hide">
      <el-button type="primary" plain :id="uploadButton">点击上传</el-button>
    </el-upload>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
import Quill from 'quill'

const Font = Quill.import('formats/font')
Font.whitelist = ['Arial', 'serif', 'sans-serif', '宋体', '黑体', '微软雅黑']
Quill.register(Font, true)

import * as qiniuApi from "@/common/api/qiniu";
import * as qiniu from 'qiniu-js'

const toolbarOptions = [
  [{ size: ["small", false, "large", "huge"] }], // 字体大小
  [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
  [{ 'font': ['Arial', 'serif', 'sans-serif', '宋体', '黑体', '微软雅黑'] }], // 字体种类
  [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
  [{ align: [] }], // 对齐方式
  ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线
  ["blockquote", "code-block"], // 引用  代码块
  [{ header: 1 }, { header: 2 }], // 1、2 级标题
  [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表
  // [{ indent: "-1" }, { indent: "+1" }], // 缩进
  // [{'direction': 'rtl'}],                         // 文本方向
  [{ script: "sub" }, { script: "super" }], // 上标/下标
  ["clean"], // 清除文本格式
  ["link", "image"] // 链接、图片、视频
];

const toolbarOptions_short = [
  [{ align: [] }], // 对齐方式
  ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线
  ["clean"], // 清除文本格式
  ["image"] // 链接、图片、视频
];

export default {
  components: {
    quillEditor
  },
  props: {
    propvalue:{
      type: String,
      default: function() {
        return '';
      }
    },
    multiple:{
      type: Boolean,
      default: function() {
        return false;
      }
    },
    //精简工具条
    toolBar_short:{
      type: Boolean,
      default: function() {
        return false;
      }
    }
  },
  data() {
    return {
      uploadButton:"imgInput" + Math.random() * 1000000,
      content:"",
      editorOption:{
        theme: "snow",
        placeholder: '请输入内容',
        modules: {
          toolbar: {
            container: this.toolBar_short ? toolbarOptions_short : toolbarOptions,
          }
        }
      },
      addRange:[],

      uploadType:"",
      accept:"all",
      uploading:false,
      upToken:'', //七牛上传token
      domain:'',
      uploadProgress:0,
      extension_size:{
        img: 20 * 1024 * 1024,          //20M
        video: 2 * 1024 * 1024 * 1024,  //2G
        doc: 10 * 1024 * 1024,          //10M
        zip: 200 * 1024 * 1024          //200M
      },
    }
  },
  computed: {
    nowLength(){
      return this.content.length
    },
    SurplusLength() {
      // 计算属性 获得当前输入字符长度
      let num = 10000 - Number(this.content.length)
      if (num > 0) {
        return num
      } else {
        return 0
      }
    },
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
  watch: {
    propvalue: {
      handler: function(html) {
        this.content = html
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 编辑器光标离开 将编辑器内容发射给父组件
    onEditorBlur(editor) {
      this.$emit('editorChange', this.content)
    },
    // 编辑器获得光标
    onEditorFocus(editor) {
      editor.enable(true)   // 实现达到上限字符可删除
    },
    // 编辑器文本发生变化
    onEditorChange({ editor, html, text }) {
      let textLength = text.length
      if (textLength > 10000) {
        this.$message.error('最多输入10000个字符')
        editor.enable(false)
      }
      this.$emit('editorChange', this.content)
    },
    // 点击图片ICON触发事件
    imgHandler(state) {
      this.accept = "img";
      this.addRange = this.$refs.myQuillEditor.quill.getSelection()
      if (state) {
        let fileInput = document.getElementById(this.uploadButton)
        setTimeout(() => {
          fileInput.click() // 加一个触发事件
        }, 50);
      }
      this.uploadType = 'image'
    },
    // 点击视频ICON触发事件
    videoHandler(state) {
      this.accept = "video";
      this.addRange = this.$refs.myQuillEditor.quill.getSelection()
      if (state) {
        let fileInput = document.getElementById(this.uploadButton)
        setTimeout(() => {
          fileInput.click() // 加一个触发事件
        }, 50);
      }
      this.uploadType = 'video'
    },

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
      if(this.acceptType != "*" && this.acceptType.indexOf(file_ext) == -1){ 
        return '该文件类型不允许上传'
      }
      
      //文件大小验证
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

              let url = result.domain + result.file_key

              if (url != null && url.length > 0) {
                let value = url
                this.addRange = this.$refs.myQuillEditor.quill.getSelection()
                value = value.indexOf('http') !== -1 ? value : 'http:' + value
                this.$refs.myQuillEditor.quill.insertEmbed(this.addRange !== null ? this.addRange.index : 0, this.uploadType, value, Quill.sources.USER)   // 调用编辑器的 insertEmbed 方法，插入URL
              }else{
                this.$message.error(`${this.uploadType}插入失败`)
              }

              this.$refs['upload'].clearFiles()    // 插入成功后清除input的内容
              
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

      return
    },
  },
  mounted() {
    // 为图片ICON绑定事件  getModule 为编辑器的内部属性
    this.$refs.myQuillEditor.quill.getModule('toolbar').addHandler('image', this.imgHandler)
    this.$refs.myQuillEditor.quill.getModule('toolbar').addHandler('video', this.videoHandler)  // 为视频ICON绑定事件
  }
}
</script>

<style scoped>
.myEditor { line-height:1.5;}
.myEditor >>> .ql-container { flex:1; height:auto; overflow-x:auto;}
.myEditor >>> .limit { height:30px; border:1px solid #ccc; line-height:30px; text-align:right;}
.myEditor >>> .limit span { color:#ee2a7b;}
.myEditor >>> .ql-snow .ql-editor img { max-width:50%;}
.myEditor >>> .ql-editor .ql-video { max-width:50%;}
</style>

<style>
.ql-snow .ql-tooltip[data-mode=link]::before {
  content: "请输入链接地址:";
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
    border-right: 0px;
    content: '保存';
    padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode=video]::before {
    content: "请输入视频地址:";
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: '14px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=small]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]::before {
  content: '10px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=large]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]::before {
  content: '18px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=huge]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {
  content: '32px';
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: '默认';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: '标题1';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: '标题2';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: '标题3';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  content: '标题4';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  content: '标题5';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
  content: '标题6';
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: '标准字体';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=Arial]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=Arial]::before {
  content: 'Arial';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=serif]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {
  content: 'serif';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='sans-serif']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='sans-serif']::before {
  content: 'sans-serif';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=宋体]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=宋体]::before {
  content: '宋体';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=黑体]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=黑体]::before {
  content: '黑体';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=微软雅黑]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=微软雅黑]::before {
  content: '微软雅黑';
}
</style>