<template>
    <div class="scrollbar blockLayout" v-loading="loading">
        <el-tabs type="card" v-model="groupId" class="headTab flex-1 flex-col" @tab-click="handleClick">
            <el-tab-pane label="基本配置" name="1">
                <div class="pane-content flex-1 scrollbar" v-if="groupId == '1'">
                    <model-deploy :modelData="listData" @modelSave="modelSave"/>
                </div>
            </el-tab-pane>
            <el-tab-pane label="内容配置" name="2">
                <div class="pane-content flex-1 scrollbar" v-if="groupId == '2'">
                    <model-deploy :modelData="listData" @modelSave="modelSave"/>
                </div>
            </el-tab-pane>
            <el-tab-pane label="用户配置" name="3">
                <div class="pane-content flex-1 scrollbar" v-if="groupId == '3'">
                    <model-deploy :modelData="listData" @modelSave="modelSave"/>
                </div>
            </el-tab-pane>
            <el-tab-pane label="系统配置" name="4">
                <div class="pane-content flex-1 scrollbar" v-if="groupId == '4'">
                    <model-deploy :modelData="listData" @modelSave="modelSave"/>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import * as util from "@/common/assets/util";
    import * as port from "../../api/systemsetting";
    import modelDeploy from "../../components/model_deploy"
    export default {
        components: {
            modelDeploy
        },
        data() {
            return {
                port,
                loading:false,
                groupId: "1",
                groupData:[],
                listData:[],
            }
        },
        watch: {
        },
        methods: {
            handleClick(value) {
                this.fetchData();
            },
            modelSave(modelForm){
                this.loading = true;
                port.update.r(modelForm).then(res => {
                    this.loading = false;
                    this.$message.success(res.data.message);
                });
            },
            contentSave(contentForm){
                this.loading = true;
                port.update.r(contentForm).then(res => {
                    this.loading = false;
                    this.$message.success(res.data.message);
                });
            },
            fetchData() {
                this.loading = true;
                port.show.r({id:this.groupId}).then(res => {
                    this.loading = false;
                    this.listData = [];
                    let arr = res.data.data;
                    arr.forEach((item,index,arr) => {
                        this.$set(item,'selectData',[])
                        if(typeof (item.extra) != 'string'){
                            for(let i in item.extra){
                                arr[index].selectData.push({key:i,value:i,label:item.extra[i]})
                            }
                        }
                    });
                    this.$nextTick(() => {
                        this.listData = arr;
                    })
                });
            },
            getGroupData(){
                this.loading = true;
                port.select.r({name:'CONFIG_GROUP_LIST'}).then(res => {
                    this.loading = false;
                    if(res.data.data.value){
                        let obj = res.data.data.value;
                        this.groupData = [];
                        for(let i in obj){
                            this.groupData.push({id:i,value:obj[i]})
                        }
                    }
                });
            },
        },
        created: function () {
            this.fetchData();
            this.getGroupData();
        }
    }
</script>

<style scoped>

</style>
