<template>
  <div class="el-form-item longTable" v-loading="loading">
    <el-table
      :data="list"
      style="width: 100%">
      <el-table-column
        prop="realname"
        label="党员姓名"
       >
      </el-table-column>
      <el-table-column label="自评" align="center">
        <el-table-column align="center"
          prop="self_score"
          label="自评结果"
        >
        </el-table-column>
        <el-table-column
          prop="self_content"
          label="评语"
        >
        </el-table-column>
      </el-table-column>
      <el-table-column label="互评结果" align="center">
        <el-table-column label="优秀" align="center">
          <template slot-scope="scope">
            {{scope.row.other_score_percent['4']}}%
          </template>
        </el-table-column>
        <el-table-column label="合格" align="center">
          <template slot-scope="scope">
            {{scope.row.other_score_percent['3']}}%
          </template>
        </el-table-column>
        <el-table-column label="基本合格" align="center">
          <template slot-scope="scope">
            {{scope.row.other_score_percent['2']}}%
          </template>
        </el-table-column>
        <el-table-column label="不合格" align="center">
        <template slot-scope="scope">
            {{scope.row.other_score_percent['1']}}%
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column label="民主测评" align="center">
        <el-table-column label="测评结果优秀率" align="center" width="150">
          <template slot-scope="scope">
            <template v-if="disabled">
                <span v-if="cache[scope.$index]">{{cache[scope.$index]}}%</span>
            </template>
            <template v-else>
                <el-input type="number" v-model.number="cache[scope.$index]" :disabled="disabled" @change="$set(cache, scope.$index, inputScore($event))">
                    <template slot="append">%</template>
                </el-input>
            </template>
          </template>
        </el-table-column>
      </el-table-column>

    </el-table>
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
      required: false
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
        cache: []
      }
  },
  watch: {
    propvalue: function(propvalue){
      this.value = this.propvalue
    },
    list: {
      handler: function(){
        this.$emit('change', this.list.map((e, i) => {
          return {
            uid: e.uid,
            content: e.content
          }
        }))
      },
      deep: true,
      immediate: true
    },
    cache: {
      handler: function(){
        const list = this.cache.map((cache, i) => {
          return Object.assign({}, this.list[i], {
            content: cache
          })
        })
        this.list = list
      },
      deep: true
    }
  },
  methods: {
    inputScore: function(value){
      if(value===''){
        return ''
      }
      
      let result = parseInt(value*10) / 10
      
      result = isNaN(result) ? 0 : result
      result = (result<0) ? 0 : result
      result = (result>100) ? 100 : result;
      console.log(result)
      return result
    },
    
  },
  created: function(){
    if(this.propvalue.length){
      this.value = this.propvalue
    }
  }
};
</script>

<style scoped>

</style>
