<template>
  <div class="el-form-item"
    :class="{'is-required': requiredvalue}">
    <div class="el-form-item__label" :style="{width: labelwidth+'px'}">{{labelname}}</div>
    <div class="el-form-item__content" :style="{marginLeft: labelwidth+'px'}">
      <el-button size="small" @click="dialogVisible=true">
          <template v-if="disabled">查看分流</template>
          <template v-else>设置分流</template>
      </el-button>
      未分流党员数：{{todoLength}}
    </div>
    <!-- 弹窗 -->
    <el-dialog
      v-loading="loading"
      class="comDialog"
      title="党员分流"
      :visible.sync="dialogVisible"
      width="800px"
      >
      <div class="actbar">
        <el-button type="text" 
          :disabled="!selection.length"
          @click="targetUid=selection;orgPickerVisible=true">批量选择党组织（已选{{selection.length}}个）</el-button>
      </div>
      <el-table
        ref="table"
        :data="list"
        style="width: 100%"
        @selection-change="tableChange">
        <el-table-column
          v-if="!disabled"
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="name"
          label="党员名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="organization_name"
          label="转入党组织"
          >
        </el-table-column>
        <el-table-column
          label="操作"
          width="180">
          <template slot-scope="scope">
            <el-button type="text" :disabled="disabled" @click="targetUid=[scope.row.uid];orgPickerVisible=true">选择党组织</el-button>
          </template>
        </el-table-column>
      </el-table>
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
      default: function(){
        return []
      }
    },
    propdata: {
      type: String,
      required: true
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
    },
    ext_props: {
      type: Object,
      required: false,
      default: function(){
        return {}
      }
    }
  },
  data() {
      return {
        dialogVisible: false,
        orgPickerVisible: false,
        loading: false,
        list: [],
        targetUid: [],
        selection: []
      }
  },
  watch: {
    propvalue: {
      handler: function(){
        this.propvalue.forEach(e => {
          const targetIndex = this.list.findIndex(item => item.uid===e.uid);
          
          if(targetIndex!==-1){
            this.$set(this.list, targetIndex, Object.assign(this.list[targetIndex], {
              organization_id: e.organization_id,
              organization_name: e.organization_name
            }))
          }
        })
      }
    },
    ext_props: {
      handler: function(){
        if(this.disabled){
          this.list = this.propvalue
        }
      },
      immediate: true,
      deep: true
    },
    result: {
      handler: function(result){
        this.$emit('change', result)
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    result: function(){
      let listCopy = [].concat(this.list);
      listCopy = listCopy.filter(e => {
        return e.organization_id
      })
      return listCopy.map(e => {let {uid, organization_id} = e;return {uid, organization_id} })
    },
    todoLength: function(){
      return this.list.length - this.result.length;
    }
  },
  methods: {
    applyOrg: function(org){
      if(!org){
        return console.log(org)
      }
      
      let listCopy = [].concat(this.list);
      listCopy.forEach((e, i) => {
        if(this.targetUid.indexOf(e.uid)!==-1){
          this.$set(this.list, i, Object.assign(e, {
            organization_name: org.name,
            organization_id: org.id
          }))
        }
      })
      
      this.$refs.table.clearSelection()
    },
    tableChange: function(selection){
      this.selection = selection.map(e => e.uid);
    },
    
  },
  created: function(){
    
  }
};
</script>

<style scoped>
.actbar{text-align: right;}
</style>
