<template>
  <el-dialog
      title="选择指数"
      :visible="visible"
      width="960px"
      append-to-body
      @close="handleClose"
      @opened="fetchData"
      >
    <div class="flex-row" style="height: 68vh;" v-loading="loading">
      <div class="side blockLayout">
        <el-table
          :data="cats"
          style="width: 100%"
          highlight-current-row
          @row-click="handleClick"
          >
          <el-table-column
            prop="title"
            label="名称"
            >
          </el-table-column>
          
        </el-table>
      </div>
      <div class="blockLayout flex-1 scrollbar">
        <el-table
          :data="checkList"
          style="width: 100%"
          @selection-change="checked=$event"
          >
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="title"
            label="指标名称"
            >
          </el-table-column>
          <el-table-column
            prop="max_score"
            label="分值"
            >
          </el-table-column>
        </el-table>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('cancel')">取 消</el-button>
      <el-button type="primary" @click="$emit('pick', checked)">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import * as exponent from '@/work/api/exponent';
import * as exponentItem from '@/work/api/exponent-item';

export default {
  props: {
    visible: {
      type: Boolean,
      required: false,
      default: false
    },
    type: {
      type: String,
      required: false,
      default: ''
    },
    picked: {
      type: Array,
      required: false,
      default: function(){
        return []
      }
    }
  },
  data () {
    return {
      loading: true,
      dialogVisible: false,
      cats: [],
      list: [],
      queryParam: {
        exponent_id: ''
      },
      editForm: {},
      checked: []
    }
  },
  computed: {
    checkList: function(){
      return this.list.filter(e => {
        return this.picked.indexOf(e.id)===-1
      })
    }
  },
  watch: {
    queryParam: {
      handler: function(queryParam){
        if(queryParam.exponent_id){
          this.fetchList()
        }
        
      },
      deep: true
    }
  },
  methods: {
    handleClose() {
      this.$emit('cancel');
      this.cats=[];
      this.list=[];
      this.queryParam.exponent_id='';
    },
    handleClick(row, col) {
      this.queryParam.exponent_id = row.id;
    },
    fetchList() {
      this.loading = true;
      exponentItem.itemList.r(this.queryParam).then(res => {
        this.loading = false;
        this.list = res.data.data.filter(e => {
          return e.model_id=='0'
        })
      })
    },
    fetchData() {
      this.loading = true;
      exponent.list.r().then(res => {
        this.loading = false;
        this.cats = res.data.data.filter(e => {
          return e.type == this.type
        });
      })
    }
  }
}
</script>

<style scoped>
.side{width: 300px;overflow-x:auto;}
</style>
