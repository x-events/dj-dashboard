<template>
  <el-row :gutter="20" class="workDetail">
    <draggable 
      :list="dynamicComponent" 
      @unchoose="handleWidgetClick" 
      @start="handleStart"
      @sort="handleMoved"
      >
    <template v-for="(comp,ci) in dynamicComponent">
        <!-- 整行 -->
        <el-col v-if="comp.is_row==1" :key="'comp'+ci" :span="24" class="staticWidget" :class="{'_checked': comp.checked}">
          <!-- checked -->
          <i v-if="picker" class="el-icon-success checked-icon"></i>
          <el-row :gutter="0">
            <el-col :span="comp.column">
              <component
                :is="'widget_'+comp.type"
                :labelname="comp.name || comp.label"
                :labelwidth="200"
                :propvalue="applyValue(comp)"
                :propdata="comp.data"
                :requiredvalue="comp.required==='1'"
                :placeholder="comp.placeholder || ''"
                :disabled="disabled"
                :ext_props="ext_props"
                @change="widgetChange(comp,ci,$event)"
              ></component>
            </el-col>
        </el-row>
        </el-col>
        <!-- 栅格 -->
        <el-col v-else :key="'comp'+ci" :span="picker ? 24 : comp.column" style="min-height:63px" class="staticWidget" :class="{'_checked': comp.checked}">
          <!-- checked -->
          <i v-if="picker" class="el-icon-success checked-icon"></i>
          <component
            :is="'widget_'+comp.type"
            :labelname="comp.name || comp.label"
            :labelwidth="200"
            :propvalue="applyValue(comp)"
            :propdata="comp.data"
            :requiredvalue="comp.required==='1'"
            :disabled="disabled"
            :ext_props="ext_props"
            @change="widgetChange(comp,ci,$event)"
          ></component>
        </el-col>
    </template>
    </draggable>
    <template v-if="!dynamicComponent.length">
      <nodata mode="" />
    </template>

    <!-- 编辑弹窗 -->
    <el-dialog
      title="组件信息"
      :visible="dialogVisible"
      width="960px"
      append-to-body
      @close="closeDialog"
      >
      
      <widget-editer 
        :data="currentWidget"
        @submit="handleWidgetEdit"
        @remove="handleWidgetRemove"
       />

    </el-dialog>
  </el-row>
</template>

<script>
import * as util from "@/common/assets/util";

import * as componentsRepository from "./widgets/componentsMap";
import draggable from "vuedraggable";

let widgetMoved = false;

export default {
  props: {
    components: {
      type: Array,
      required: true
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    iscreated: {
      type: Boolean,
      required: false,
      default: false
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
    draggable,
    ...componentsRepository,
    "widget-editer": (resolve) => require(['../widget-editer.vue'], resolve)
  },
  data() {
    return {
      dynamicComponent: [],
      party_member_should_number: 0,
      party_member_real_number: 0,
      ext_props: {},
      forceRow: [
        // 'party_member_real_user_ids',
        // 'input_user_ids_input',
        // 'input_user_ids'
      ],
      dialogVisible: false,
      currentWidgetIndex: null
    }
  },
  computed: {
    memberPercent: function(){
      const percent = (this.party_member_should_number && this.party_member_real_number) ? parseInt(this.party_member_real_number / this.party_member_should_number * 100) : 0;
      if(percent >= 80){
        this.$emit('validSuccess', 'memberPercent')
      }else{
        this.$emit('validFail', 'memberPercent')
      }
      return percent;
    },
    currentWidget: function(){
      if(this.currentWidgetIndex!==null && this.dynamicComponent[this.currentWidgetIndex]){
        return this.dynamicComponent[this.currentWidgetIndex];
      }else{
        return {}
      }
    },
    checkList: function(){
      const result = util.deepcopy(this.dynamicComponent.filter(e => {
        return e.checked
      }))
      result.forEach(e => {
        delete e.checked
      })
      return result
    }
  },
  watch: {
    components: {
      handler: function(components){
        const filterData = components.map(e => {
          e.column = this.getColumn(e);
          return e;
        })
        this.dynamicComponent = filterData
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    closeDialog: function(){
      this.dialogVisible = false;
      this.currentWidgetIndex = null;
    },
    handleMoved: function(){
      if(this.preview){
        return null
      }
      this.$emit('edit', this.dynamicComponent)
    },
    handleWidgetRemove: function(){
      if(this.preview){
        return null
      }
      this.dynamicComponent.splice(this.currentWidgetIndex, 1)
      this.closeDialog();

      this.$emit('edit', this.dynamicComponent)
    },
    handleWidgetEdit: function(data){
      if(this.preview){
        return null
      }
      this.$set(this.dynamicComponent, this.currentWidgetIndex, data);
      this.closeDialog();
      
      this.$emit('edit', this.dynamicComponent)
    },
    handleWidgetClick: function(evt){
      if(this.preview){
        return null
      }
      if(!widgetMoved){
        this.currentWidgetIndex = evt.oldIndex;

        if(this.picker){
          const node = this.dynamicComponent[this.currentWidgetIndex];
          node.checked = !node.checked;
          this.$set(this.dynamicComponent, this.currentWidgetIndex, node)
          this.$emit('pick', this.checkList)
        }else{
          this.dialogVisible = true;
        }
        
      }else{
        widgetMoved = false;
      }
    },
    handleStart: function(){
      widgetMoved = true;
    },
    getColumn: function(item){
      let col = parseInt(item.column);

      if(isNaN(col) || col < 1){
        col = 12
      } else if(this.forceRow.indexOf(item.type) !== -1){
        col = 24
      } 
      return col;
    },
    applyValue: function(comp){
      switch(comp.type){
        //实到党员
        case "party_member_real_number":
          return this.party_member_real_number || comp.value
        break;
        //实到党员
        case "party_member_real_number_input":
          return this.party_member_real_number || comp.value
        break;

        default:
          return comp.value
      }
    },
    widgetChange: function(comp,ci,$event){
      switch(comp.type){
        case "party_member_real_user_ids":
        //同步实到党员人数
          if(this.iscreated){
            this.party_member_real_number = $event.length
          }
        break;
        case "party_member_real_user_ids_no_input":
        //同步实到党员人数
          if(this.iscreated){
            this.party_member_real_number = $event.length
          }
        break;
        //输入实到党员列表
        case "party_member_real_number_input":
          this.party_member_real_number = $event
        break;

        //应到党员列表
        case "party_member_should_number":
          this.party_member_should_number = $event
        break;
        //应到党员列表
        case "party_member_should_number_input":
          this.party_member_should_number = $event
        break;
        // 撤销党组织(用于党员/党组织分流控件)
        case "input_organization_id_children":
          this.$set(this.ext_props, 'organization_id', $event)
          break;
        // 月份选择(用于缴纳党费人员列表)
        case "input_month":
          this.$set(this.ext_props, 'input_month', $event)
          break;
        // 单位名称校验
        case "input_unit":
          if(comp.required==='1'){
            if(!$event.short_name){
              return this.$emit('validFail', 'unitNameEmpty')
            }
            this.$emit('validSuccess', 'unitNameEmpty')
          }
          
          break;
        default:
         
      }
      this.$emit('change', {
        ci,
        value: $event
      })
    }
  }
}
</script>

<style scoped>
.workDetail {
  padding: 10px 0;
  border:1px dotted #ccc;
  border-radius: 6px; 
  margin-bottom: 10px;
}
.workDetail >>> .el-date-editor.el-input, 
.workDetail >>> .el-date-editor.el-input__inner,
.workDetail >>> .el-select,
.workDetail >>> .el-cascader{width:100%;}
.workDetail >>> .el-select{width:100%;}

.staticWidget{position:relative;}
.staticWidget:before{
  content: "";
  position: absolute;
  left: 0;
  top: 0; 
  right: 0;
  bottom: 0; 
  z-index:9; 
}
.checked-icon{position: absolute;left: 1em;top:50%;margin-top:-20px;color:#ddd;font-size: 18px;}
.staticWidget._checked .checked-icon{color:#3a8ee6;}
</style>
