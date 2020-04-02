<template>
    <div class="el-form-item" :class="{'is-required': requiredvalue}">
        <div class="el-form-item__label" :style="{width: labelwidth+'px'}">{{labelname}}</div>
        <div class="el-form-item__content" :style="{marginLeft: labelwidth+'px'}">
            <el-checkbox-group v-model="value" :disabled="disabled" :class="{'textOnly':disabled}">
                <el-checkbox v-for="(item,index) in options" :key="'ckb'+index" :label="item.value" @change="checkboxChange(item, $event)">{{item.text}}
                <template v-if="item.children">
                    <i class="el-icon-more" @click.prevent="showPopForm(item)"></i>
                </template>
                </el-checkbox>
            </el-checkbox-group>
        </div>
        <!-- 弹窗 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="800px" class="comDialog">
            <el-form label-width="80px" v-if="dialogVisible">
                <dynamic-component :components="popFormComponents" @change="handleChange($event.ci, $event.value)" />
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
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
      type: Array,
      required: false,
      default: function() {
        /*
        ""
        */
        return [];
      }
    },
    propdata: {
      type: Array,
      required: false,
      default: function(){
        return []
      }
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
    }
  },
  data() {
      return {
        dialogVisible: false,
        dialogTitle: "提示",
        popFormComponents: [],
        options: [],
        value: [],
        subValue: {},
        submitValue: []
      }
  },
  watch: {
    propvalue: function(propvalue){
      this.analysisValue(this.propvalue)
    },
    submitValue: function(){
      this.$emit('change', this.submitValue)
    },
    value: function(){
      this.submitValue = this.submitValueFunc(this.subValue)
    },
    subValue: {
      handler: function(subValue){
        this.submitValue = this.submitValueFunc(subValue)
      },
      deep: true
    }
  },
  methods: {
    submitValueFunc: function(subValue){
      let subVals = []
      this.value.forEach(v1 => {
        const hasSub = this.options.filter(opt => opt.value===v1 && opt.children);
        if(hasSub.length && subValue[v1]){
          subVals.push(subValue[v1])
        }
      })
      
      return this.value.concat(subVals)
    },
    handleChange: function(compIndex, val) {
      
      const targetIndex = this.popFormComponents[compIndex].parentValue;
      // 主动勾选父级
      if(this.value.indexOf(targetIndex)===-1){
        this.value.push(targetIndex)
      }

      if(targetIndex){
        this.$set(this.subValue, targetIndex, val)
        //this.subValue[targetIndex] = val
      }else{
        console.warn('组件赋值失败')
      }
      
    },
    checkboxChange: function(item, checked){
      if(checked && item.children){
        this.showPopForm(item)
      }
    },
    showPopForm: function(item){
      
      // 拼装组件
      this.popFormComponents = [{
        column: 2,
        data: item.children,
        name: '',//item.text,
        type: 'radio',
        value: this.subValue[item.value],
        parentValue: item.value
      }]
      this.dialogTitle = item.text
      this.dialogVisible = true;
    },
    analysisValue: function(value){
      const subItems = this.options.filter(opt => opt.children);
      //过滤一级value
      const filterVal = value.filter(v => {
        return this.options.findIndex(o => o.value==v)!==-1
      })
      //查找并映射二级value
      value.forEach(v1 => {
        
        subItems.forEach(item => {
          const subItem = item.children.filter(c => c.value===v1);
          if(subItem.length){
            //同步subValue
            this.$set(this.subValue, item.value, v1)
          }
        })
      })
      this.value = filterVal
    }
  },
  created: function(){
    if(this.propdata.length){
      this.options = this.propdata
    }
    if(this.propvalue){
      this.analysisValue(this.propvalue)
    }
  }
};
</script>

<style scoped>

</style>
