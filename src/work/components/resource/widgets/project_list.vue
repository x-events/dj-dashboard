<template>
<div>
  <div v-for="(item, index) in list"
    :key="'pl'+index"
    class="flex-row project_list">
    
    <div class="flex-1" style="padding-right:20px" >
      <el-divider>项目{{index+1}}</el-divider>
      <div class="el-form-item">
        <div
          class="el-form-item__label"
          :style="{width: labelwidth+'px'}"
        > 项目名称</div>
        <div class="el-form-item__content" :style="{marginLeft: labelwidth+'px'}">
          <el-input 
          v-model="item.name" 
          :maxlength="255"
          :disabled="disabled"></el-input>
        </div>
      </div>
      <div class="flex-row">
        <div class="flex-1">
          <div class="el-form-item">
            <div
              class="el-form-item__label"
              :style="{width: labelwidth+'px'}"
            > 金额（元）</div>
            <div class="el-form-item__content" :style="{marginLeft: labelwidth+'px'}">
              <el-input 
              v-model.number="item.money" 
              type="number"
              :disabled="disabled"></el-input>
            </div>
          </div>
        </div>
        <div class="flex-1">
          <div class="el-form-item">
            <div
              class="el-form-item__label"
              :style="{width: labelwidth+'px'}"
            > 预计完成时间</div>
            <div class="el-form-item__content" :style="{marginLeft: labelwidth+'px'}">
              <el-date-picker
                v-model="item.end_time"
                type="date"
                value-format="timestamp"
                :disabled="disabled">
              </el-date-picker>
            </div>
          </div>
        </div>
      </div>
      <div class="el-form-item" style="margin-bottom:0">
        <div
          class="el-form-item__label"
          :style="{width: labelwidth+'px'}"
        > 项目内容</div>
        <div class="el-form-item__content" :style="{marginLeft: labelwidth+'px'}">
          <el-input 
          v-model.number="item.content" 
          type="textarea"
          :disabled="disabled"></el-input>

        </div>
      </div>
    </div>
    <template v-if="!disabled">
      <template v-if="index===0">
        <el-button @click.prevent="list.push({name: '', money: 0, content: '', end_time: ''})">添加</el-button>
      </template>
      <template v-else>
        <el-button @click.prevent="list.splice(index, 1)">删除</el-button>
      </template>
    </template>
  </div>
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
      list: [
        {
          name: '', 
          money: 0, 
          content: '', 
          end_time: ''
        }
      ]
    };
  },
  watch: {
    propvalue: {
      handler: function() {
        if (Array.isArray(this.propvalue)) {
          if (this.propvalue.length) {
            this.list = this.propvalue;
          } else {
            this.list = [
              {
                name: '', 
                money: 0, 
                content: '', 
                end_time: ''
              }
            ];
          }
        }
      },
      deep: true,
      immediate: true
    },
    list: {
      handler: function(list) {
        this.$emit("change", list);
      },
      deep: true
    }
  },
  methods: {},
  created: function() {
    
  }
};
</script>

<style scoped>
.project_list{
  margin-bottom: 40px;
  padding-top: 40px;

}
</style>
