<template>
  <div v-loading="loading" id="formEditerWrap">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item v-if="!preview" label="工作行为" prop="name">
        <el-input v-model="ruleForm.name">
          <el-button v-if="!picker" slot="append" type="primary" icon="el-icon-plus" @click="openPicker">添加控件</el-button>
        </el-input>
      </el-form-item>
      
      <dynamic-component
        :components="ruleForm.component"
        :preview="preview"
        @edit="handleChange"
      />

      <el-form-item v-if="!preview">
        <el-button type="primary" @click="submitForm()">保存</el-button>
        <el-button v-if="picker" type="danger" @click="removeForm">删除</el-button>
        <el-button @click="$emit('cancel')">取消</el-button>
      </el-form-item>
    </el-form>

    <!-- 选择组件 -->
    <el-dialog
      title="可选组件"
      :visible.sync="widgetVisible"
      width="960px"
      append-to-body
      >
      <dynamic-component
        :components="catComponents"
        :picker="true"
        @pick="widgetPicked = $event"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="closePicker">取 消</el-button>
        <el-button type="primary" @click="handlePick">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as util from "@/common/assets/util";
import * as form from "@/work/api/form";
import dynamicComponent from "./resource/dynamicComponent";


export default {
  props: {
    currentNodeId: {
      type: [Number, String],
      required: true
    },
    data: {
      type: Object,
      required: false,
      default: function(){
        return {}
      }
    },
    picker: {
      type: Boolean,
      required: false,
      default: false
    },
    preview: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  components: {
    dynamicComponent
  },
  data() {
    return {
      loading: false,
      drawerVisible: false,
      widgetVisible: false,
      ruleForm: {
        "name": "",
        "component": []
      },
      rules: {
          name: [
            { required: true, message: '请输入工作行为名称', trigger: 'blur' }
          ]
      },
      catComponents: [],
      widgetPicked: []
    }
  },
  watch: {
    data: {
      handler: function(data){
        this.ruleForm = Object.assign({component: []}, data);
        if(Array.isArray(data.component)){
          // 流程管理直接传入组件数据
          this.$forceUpdate();
        }else if(data.id){
          // 工作行为通过id取得组件
          this.formComponents(data.id)
        }else{
          this.ruleForm = {
            "name": "",
            "component": []
          };
          this.$refs['ruleForm'] && this.$refs['ruleForm'].resetFields();
        }
      },
      deep: true, 
      immediate: true
    }
  },
  methods: {
    removeForm: function(){
      this.$emit('remove', this.data)
    },
    handlePick: function(){
      const widgets = util.deepcopy(this.widgetPicked);
      widgets.forEach(widget => {
        widget.form_component_id = widget.id;
        
      })
      //console.log(widgets)
      this.$set(this.ruleForm, 'component', this.ruleForm.component.concat(widgets));
      
      this.closePicker()
    },
    openPicker: function(){
      this.loading = true;
      form.catComponents.r({
        form_category_id: this.currentNodeId
      }).then(res => {
        this.loading = false;
        const canuse = res.data.data.filter(widget => {
          const targetIndex = this.ruleForm.component.findIndex(c => {
            return c.id == widget.id
          })
          return targetIndex === -1;
        });

        this.catComponents = canuse;
        this.widgetVisible=true;
      })
    },
    closePicker: function(){
      this.widgetVisible = false;
      this.catComponents = []
    },
    handleChange: function(comps) {
      if (Array.isArray(comps)) {
        this.$set(this.ruleForm, 'component', [])
        this.$nextTick(() => {
          this.$set(this.ruleForm, 'component', comps)
        })
        
      } else {
        console.warn("组件赋值失败");
      }
    },
    submitForm() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.ruleForm.component.forEach(widget => {
            if(!widget.name){
              widget.name = widget.label
            }
          })
          this.$emit('submit', this.ruleForm)
        } else {
          // 滚动条置顶
          const formdiv = document.getElementById('formEditerWrap');
          if(formdiv){
            const wrap = formdiv.parentNode;
            if(wrap){
              wrap.scrollTop = 0
            }
          }
        }
      });
    },
    formComponents(form_nearest_id) {
      this.loading = true;
      form.formComponents.r({
        form_nearest_id
      }).then(res => {
        this.loading = false;
        // set 
        this.$set(this.ruleForm, 'component', res.data.data.map(e => {
          e.form_component_id = e.id;
          return e
        }))
      })
    }
  }
}
</script>

<style scoped>

</style>
