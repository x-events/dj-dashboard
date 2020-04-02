<template>
    <div class="el-form-item evalute_all" :class="{'is-required': requiredvalue}">
        <!-- <div class="el-form-item__label" :style="{width: labelwidth+'px'}">{{labelname}}</div> -->
        <div class="el-form-item__content" :style="{marginLeft:labelwidth-90+'px'}">

            <div class="el-form-item" v-loading="loading">
                <el-table stripe :data="list" style="width: 100%">
                    <el-table-column prop="realname" label="党员姓名"></el-table-column>
                    <el-table-column label="自评" align="center">
                        <el-table-column align="center" prop="self_score" label="自评结果"></el-table-column>
                        <el-table-column prop="self_content" label="评语"></el-table-column>
                    </el-table-column>
                    <el-table-column label="互评结果" align="center">
                        <el-table-column label="优秀" align="center">
                            <template slot-scope="scope">
                                {{scope.row.other_score_percent['1']}}%
                            </template>
                        </el-table-column>
                        <el-table-column label="合格" align="center">
                            <template slot-scope="scope">
                                {{scope.row.other_score_percent['2']}}%
                            </template>
                        </el-table-column>
                        <el-table-column label="基本合格" align="center">
                            <template slot-scope="scope">
                                {{scope.row.other_score_percent['3']}}%
                            </template>
                        </el-table-column>
                        <el-table-column label="不合格" align="center">
                            <template slot-scope="scope">
                                {{scope.row.other_score_percent['4']}}%
                            </template>
                        </el-table-column>
                    </el-table-column>

                    <el-table-column label="民主测评" align="center">
                        <el-table-column label="测评结果优秀率" align="center">
                            <template slot-scope="scope">
                                <span v-if="scope.row.democratic !== ''">{{scope.row.democratic}}%</span>
                            </template>
                        </el-table-column>
                    </el-table-column>

                    <el-table-column label="综合评价" align="center" width="320">
                        <template slot-scope="scope">
                            <template v-if="disabled">
                                {{checkValue(scope.row.score,options)}}
                            </template>
                            <template v-else>
                                <el-radio-group v-model="scope.row.score" :disabled="disabled">
                                    <el-radio :label="e.value" v-for="(e,i) in options" :key="i">{{e.text}}</el-radio>
                                </el-radio-group>
                            </template>
                        </template>
                    </el-table-column>
                    
                    <el-table-column label="表彰" align="center">
                        <template slot-scope="scope">
                            <template v-if="disabled">
                                <div class="tc" v-if="scope.row.has_honour"><i class="ion">&#xe69c;</i></div>
                            </template>
                            <template v-else>
                                <el-checkbox v-model="scope.row.has_honour" :disabled="disabled" true-label="1" false-label="0"></el-checkbox>
                            </template>
                        </template>
                    </el-table-column>

                </el-table>
            </div>
            
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
      type: String,
      required: false,
      default: ""
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
  components: {
    "upload-image": resolve => require(["../upload_image"], resolve)
  },
  data() {
      return {
        loading: false,
        list: [],
        value: [],
        options:[
            {
                value:'4',
                text:'优秀'
            },
            {
                value:'3',
                text:'合格'
            },
            {
                value:'2',
                text:'基本合格'
            },
            {
                value:'1',
                text:'不合格'
            }
        ]
      }
  },
  watch: {
    propvalue: function(propvalue){
      this.value = this.propvalue
    },
    value: {
      handler: function(value){
        const newlist = this.list.map(e => {
          let __clone = Object.assign({}, e)
          const targetIndex = value.findIndex(v => v.uid==__clone.uid);
          if(targetIndex!==-1){
            __clone.has_honour = value[targetIndex].has_honour
          }else{
            __clone.has_honour = 0
          }
          return __clone
        })
        this.list = newlist;
      },
      deep: true
    },
    list: {
      handler: function(){
        this.$emit('change', this.list.map(e => {
          return {
            uid: e.uid,
            score: e.score,
            has_honour: e.has_honour,
            percent: e.democratic
          }
        }))
      },
      deep: true
    }
  },
  methods: {
    checkValue(value,data){
        let text = '';
        data.forEach(e => {
            if(value == e.value){
                text = e.text
            }
        });
        return text
    },
    
  },
  created: function(){
    
  }
};
</script>

<style scoped>
.evalute_all >>> .el-radio{margin-right:10px;}
</style>
