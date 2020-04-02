<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-divider>参数配置</el-divider>
      <el-form-item label="周期" prop="period">
        <el-select v-model="ruleForm.period" >
          <el-option
            label="请选择"
            value="0">
          </el-option>
          <el-option
            label="年"
            value="1">
          </el-option>
          <el-option
            label="半年"
            value="2">
          </el-option>
          <el-option
            label="季度"
            value="3">
          </el-option>
          <el-option
            label="月"
            value="4">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分值" prop="item_score">
        <el-input type="number" v-model.number="ruleForm.item_score" placeholder="(每次得分)"></el-input>
      </el-form-item>
      
      <el-form-item label="权限" prop="roles">
        <el-checkbox-group v-model="ruleForm.roles">
          <el-checkbox label="1">一般党员</el-checkbox>
          <el-checkbox label="2">管理员</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      
      <el-form-item label="职务" prop="duties">
        <dictSelect 
          params="duties"
          :value="ruleForm.duties"
          type="checkbox"
          @input="ruleForm.duties=$event"
        />
      </el-form-item>
      
      <el-form-item label="结果集" size="mini" v-if="!resultLoading && ruleForm.id">
        <div class="flex-row" v-for="(result,index) in cascaderValue" :key="'result'+index" style="margin-bottom:6px;">
          <el-cascader :props="cascaderProps" v-model="result.value" style="margin-right:6px;width:28em"></el-cascader>
          
          <el-button type="danger" plain @click="cascaderValue.splice(index,1);resultLoading=true;$nextTick(() => resultLoading=false)">删除</el-button>
        </div>
        <el-button plain  @click="cascaderValue.push({value: []})">添加</el-button>
      </el-form-item>

      <el-divider>模式</el-divider>

      <el-tabs v-model="ruleForm.model_type" type="card">
        <el-tab-pane label="定量" name="0">
          <el-form-item label="评选方式" prop="count_type">
            <el-select v-model="ruleForm.count_type" >
              <el-option
                label="请选择"
                value="0">
              </el-option>
              <el-option
                label="统计值*满分"
                value="1">
              </el-option>
              <el-option
                label="统计值分段得分"
                value="2">
              </el-option>
              <el-option
                label="按最大满分计算"
                value="3">
              </el-option>
            </el-select>
          </el-form-item>
          <template v-if="ruleForm.count_type=='2'">
            <el-form-item label="" size="mini">
              <div v-for="(item,index) in ruleForm.data_num" :key="'data_num'+index" style="margin-bottom:6px;">
                当 统计值
                <el-select v-model="item.compute_type" style="width:5em">
                  <el-option
                    v-for="item in operators"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                  
                </el-select>

                <el-input type="number" v-model.number="item.compute_num" style="width: 6em;margin-left:4px;"></el-input>
                时

                得分=满分 * 
                <el-input type="number" v-model.number="item.equal_num" style="width: 10em;margin-right:1em;">
                  <template slot="append">%</template>
                </el-input>

                <el-button plain v-if="index===0" @click="ruleForm.data_num.push(Object.assign({}, data_num_temp))">添加</el-button>
                <el-button type="danger" plain v-else @click="ruleForm.data_num.splice(index,1)">删除</el-button>
              </div>
            </el-form-item>
          </template>
          <template v-if="ruleForm.count_type=='3'" size="mini">
            <el-form-item label="" >
              	
              <div>统计值 >= <el-input type="number" v-model.number="ruleForm.compute_num" style="width: 6em"></el-input> = 满分;</div>
              <div>
                否则 得分=统计值/最大值*满分;
              </div>

            </el-form-item>
          </template>
          
        </el-tab-pane>
        <!-- <el-tab-pane label="定性" name="1">
          <el-form-item label="满分" prop="total">
            <el-input type="number" v-model.number="ruleForm.total" ></el-input>
          </el-form-item>
          <el-form-item label="等级">
            <div style="margin-bottom:10px">
              <el-input type="number" v-model.number="ruleForm.rules[0]" style="width:10em">
                <template slot="append">%</template>
              </el-input>
              优秀
            </div>
            <div style="margin-bottom:10px">
              <el-input type="number" v-model.number="ruleForm.rules[1]" style="width:10em">
                <template slot="append">%</template>
              </el-input>
              称职
            </div>
            <div style="margin-bottom:10px">
              <el-input type="number" v-model.number="ruleForm.rules[2]" style="width:10em">
                <template slot="append">%</template>
              </el-input>
              基本称职
            </div>
            <div style="margin-bottom:10px">
              <el-input type="number" v-model.number="ruleForm.rules[3]" style="width:10em">
                <template slot="append">%</template>
              </el-input>
              不称职
            </div>
          </el-form-item>
          
        </el-tab-pane> -->
      </el-tabs>

      <el-form-item label="考核标准" prop="standard">
        <el-input v-model="ruleForm.standard" type="textarea"></el-input>
      </el-form-item>

      <el-form-item label="计算方法" prop="method">
        <el-input v-model="ruleForm.method" type="textarea"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" size="small" @click="submitForm()">提交</el-button>
        <el-button size="small" @click="$emit('cancel')">取消</el-button>
      </el-form-item>
    </el-form>
    
  </div>
</template>

<script>
import * as exponent from "@/work/api/exponent-item";

const operators = ['>=','>','<=','<','==','!=']

const data_num_temp = {
      compute_num: 0,
      equal_num: 0,
      compute_type: operators[0]
    }
const params_temp = {
    table: 0,
    child: 0,
    type: 0
  }

const TEMP = {
  "period": "1",
  "item_score": 0,
  "roles": [],
  "duties": [],
  "params": [
  ],
  "data_num": [
    Object.assign({}, data_num_temp)
  ],
  "compute_num": 0,
  "model_type": "0",
  "total": 0,
  "rules": [0,0,0,0],
  "standard": '',
  "method": ''
}

export default {
  props: {
    data: {
      type: Object,
      required: true,
      default: function(){
        return {}
      }
    }
  },
  components: {
    dictSelect: (resolve) => require(['@/common/components/dictSelect.vue'], resolve)
  },
  data() {
    return {
      loading: false,
      resultLoading: false,
      ruleForm: Object.assign({}, TEMP),
      rules: {
          title: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ]
      },
      moudels: [],
      cascaderValue: [],
      data_num_temp,
      operators,
      cascaderProps: {
        label: 'text',
        checkStrictly: true,
        lazy: true,
        lazyLoad: (node, resolve) => {
          const {level, value} = node;
          let api;
          switch(level){
            case 0:
              api = exponent.resultL1;
              break;
            case 1:
              api = exponent.resultL2;
              break;
            case 2:
              api = exponent.resultL3;
              break;
            default:
              console.warn(level)
          }
          api.r({
            "id": value || 0,
            "model": this.ruleForm.model_type
          }).then(res => {
            let arr = res.data.data;
            arr.forEach(e => {
              if(level===2 || (e.value==0)){
                e.leaf = true;
              }
              
            })
            resolve(arr);
            this.$nextTick(() => {
              this.$forceUpdate()
            })
          })
        }
      }
    }
  },
  watch: {
    data: {
      handler: function(data){
        if(data.id && !data.parentId){
          //容错
          if(!Array.isArray(data.params)){
            data.params = [
            ]
          }

          // 编辑
          this.ruleForm = Object.assign({}, TEMP, data, {
            has_moudel: data.model_id!='0'
          })
          // 同步 cascaderValue
          this.cascaderValue = this.ruleForm.params.map(e => {
            let r = []
            if(e.table!==0){
              r.push(e.table)
            }
            if(e.child!==0){
              r.push(e.child)
            }
            if(e.type!==0){
              r.push(e.type)
            }
            return {
              value: r
            }
          })
          
        }else if(data.id && data.parentId){
          // 添加子节点
          this.ruleForm = Object.assign({}, TEMP, {
            id: data.parentId,
            exponent_id: data.exponent_id
          })
        }else{
          // 新建
          this.ruleForm = Object.assign({}, TEMP, data)
          this.$nextTick(() => {
            this.$refs['ruleForm'].clearValidate()
          })
        }
      },
      deep: true, 
      immediate: true
    },
    cascaderValue: {
      handler: function(cascaderValue){
        let params = cascaderValue.map(e => {
          const arr = e.value;
          return {
            table: arr[0] || 0,
            child: arr[1] || 0,
            type: arr[2] || 0
          }
        })
        
        this.$set(this.ruleForm, 'params', params);
      },
      deep: true
    }
  },
  methods: {
    toggleMoudel(status) {
      if(status){
        this.ruleForm.model_id = '-1';
      } else {
        this.ruleForm.model_id = '0';
      }
    },
    submitForm(callback) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          const api = (this.ruleForm.id && !this.data.parentId) ? exponent.itemEdit : exponent.itemAdd;

          api.r(this.ruleForm).then(res => {
            
            this.$emit('submit')
          })
          
        } 
      });
    },
    fetchMoudels() {
      this.loading = true;
      exponent.moudels.r().then(res => {
        this.loading = false;
        this.moudels = res.data.data;
      })
    }
  },
  created: function(){
    this.fetchMoudels()
  }
}
</script>

<style scoped>

</style>
