<template>
  <div class="flex-row" v-loading="loading">
    <div class="sideBar blockLayout">
      <!-- <tree :data="orgs" :fieldObj="treeField" @click="handleNodeClick" @onCreated="handleCreated" /> -->
      <orgtree ref="tree" @nodeClick="handleNodeClick" />
    </div>
    <div class="flex-1 blockLayout scrollbar">
      <div class="flex-row align-center toolBar">
        <div class="flex-1">
          <el-select v-model="queryParams.exponent_id" placeholder="请选择">
            <el-option
              v-for="item in exponents"
              :key="'exponents'+item.id"
              :label="item.title"
              :value="item.id">
            </el-option>
          </el-select>
          
        </div>
        
        <el-button v-has="correct.reset" @click="reset" :disabled="!currentOrg.id">清空修正值</el-button>
        <el-button v-has="correct.edit" type="primary" @click="submit" :disabled="!currentOrg.id">保存</el-button>
      </div>
      <!-- list -->
      <el-table
        :data="list"
        style="width: 100%;"
        row-key="id"
        border
        default-expand-all
        :tree-props="{children: 'children'}">
        <el-table-column
          prop="title"
          label="指数名"
          width="300"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          prop="max_score"
          label="满分"
          align="center"
          >
        </el-table-column>
        <!-- 2019-9-3测试要求去掉 -->
        <!-- <el-table-column
          prop="percent"
          label="权重"
          align="center"
          >
        </el-table-column> -->
        <el-table-column
          prop="before_result"
          label="实际值"
          align="center"
          >
        </el-table-column>
        <el-table-column
          label="修正值"
          >
          <template slot-scope="scope">
            <el-input type="number" v-model.number="scope.row.correct" :disabled="scope.row.is_correct==0" @change="correctHandle(scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="result"
          label="修正后"
          align="center"
          >
        </el-table-column>

      </el-table>

    </div>
  </div>
</template>

<script>
import * as correct from '../../api/correct';
import * as allcommon from "@/common/api/common";

import * as util from '@/common/assets/util';

export default {
  components: {
    tree: (resolve) => require(['@/common/components/ztree.vue'], resolve)
  },
  data () {
    return {
      correct,
      loading: false,
      // orgs: [],
      queryParams: {
        org_id: "",
        exponent_id: ""
      },
      exponents: [],
      list: [],
      currentOrg: {},
      /* treeField: {
        name: 'short_name',
        id: 'value',
        pid: 'pid'
      }, */
      correctPost: {}
    }
  },
  watch: {
    exponents: {
      handler: function(exponents){
        this.queryParams = {
          org_id: this.currentOrg.id,
          exponent_id: exponents[0].id
        }
      },
      deep: true
    },
    queryParams: {
      handler: function(){
        this.fetchData()
      },
      deep: true
    }
  },
  methods: {
    correctHandle(item) {
      if(item.id){
        // 修正值限制
        const val = parseFloat(item.correct);
        if(val<0){
          item.correct = 0;
          this.$message({
            message: '修正值不能小于0！',
            type: 'warning'
          });
        }
        if(item.is_infinite!='1' && item.max_score){
          const max_score = parseFloat(item.max_score);
          if(val>item.max_score){
            item.correct = max_score;
            this.$message({
              message: '修正值不能大于最大值！',
              type: 'warning'
            });
          }
          
        }

        this.$set(this.correctPost, 'correct_'+item.id, item.correct)
      }
    },
    reset() {
      this.$confirm('是否继续?').then(() => {
        this.loading = true;
        correct.reset.r(this.queryParams).then(() => {
          this.loading = false;
          this.fetchData();
        })
      })
      
    },
    submit() {
      const correctKeys = Object.keys(this.correctPost);
      if(correctKeys.length){
        this.loading = true;
        correct.edit.r(Object.assign({}, this.queryParams, {
          post: this.correctPost
        })).then(() => {
          this.loading = false;
          this.fetchData()
        }).catch(() => {
          this.loading = false;
        })
      }
    },
    handleNodeClick(item) {
      this.currentOrg = item;
      this.fetchExt()
    },
    /* handleCreated(ztreeObj) {
      ztreeObj.expandNode(ztreeObj.getNodes()[0], true);
    }, */
    fetchExt() {
      console.log('fetchExt')
      this.loading = true;
      correct.exponent.r({
        org_id: this.currentOrg.id
      }).then(res => {
        this.loading = false;
        this.exponents = res.data.data;
      })
    },
    fetchData() {
      this.loading = true;
      correct.list.r(this.queryParams).then(res => {
        this.loading = false;
        this.list = util.buildMenu(res.data.data, 'parent_id');
        this.correctPost = {}
      })
    },
    /* fetchOrg() {
      this.loading = true;
      allcommon.orgtree.r().then(res => {
        this.loading = false;
        this.orgs = util.buildMenu(res.data.data, "pid");

      });
    } */
  },
  created: function(){
    // this.fetchOrg()
  }
}
</script>

<style scoped>
.custom-tree-item{flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; }
.extendLable span{margin-right:4px;}
.extendLable .source{color:#999;font-size:14px;}
.custom-tree >>> .el-tree-node__content{height: 32px;line-height: 32px;}

.sideBar{overflow-x:auto;}
</style>
