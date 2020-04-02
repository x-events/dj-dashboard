<template>
    <div class="el-form-item" v-loading="loading">
        <el-table stripe :data="list" style="width: 100%">
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column label="积分">
                <template slot-scope="scope">
                    <template v-if="disabled">
                        {{scope.row.score}}
                    </template>
                    <template v-else>
                        <el-input v-model="scope.row.score" :disabled="disabled" ></el-input>
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="图片">
                <template slot-scope="scope">
                <upload-image
                    :propvalue="{
                    id: scope.row.image_file_id,
                    url: scope.row.image_url
                    }"
                    onefile
                    :disabled="disabled"
                    @change="scope.row.image_file_id=$event.id || '';scope.row.image_url=$event.url || ''"
                />
                </template>
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
        /*
        [{uid:1,name:1,month:2019-04,score:100,image_file_id:1}]
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
  components: {
    "upload-image": resolve => require(["../upload_image"], resolve)
  },
  data() {
      return {
        loading: false,
        list: [],
        value: []
      }
  },
  watch: {
    propvalue: function(propvalue){
      this.value = this.propvalue
    },
    list: {
      handler: function(){
        this.$emit('change', this.list)
      },
      deep: true
    }
  },
  methods: {
    fetchData: function(){
      
    }
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
