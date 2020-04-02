<template>
  <el-drawer
    title="用户信息"
    :visible.sync="dvisible"
    direction="rtl"
    size="960px"
    append-to-body
    @open="loading=true"
    @opened="handleOpen"
    @closed="handleClose"
  >
    <div class="flex-col" style="height:100%;" v-loading="loading">
      <div class="demo-drawer__content flex-1" style="overflow:auto">
        <el-form
          class="flex-1 scrollbar"
          :model="editForm"
          :rules="formRule"
          ref="editForm"
          :label-width="formwidth"
          size="medium"
          label-suffix=":"
        >
          <el-row class="form-row">
            <el-row class="upload-row">
              <el-row>
                <el-col :span="10">
                  <el-form-item class="col-name" label="姓名" prop="realname">
                    <el-input v-model="editForm.realname" placeholder="请输入党员姓名" maxlength="10"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="9" class="calc-w-8">
                  <el-form-item class="col-name" label="性别" prop="sex">
                    <el-select v-model="editForm.sex" placeholder="请选择性别" style="width:100%;">
                      <el-option
                        :label="item.value"
                        :value="item.id"
                        :key="index"
                        v-for="(item, index) in sexData"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item class="col-name" label="所在支部" prop="org_id">
                    <el-input
                      v-model="editForm.org_name"
                      readonly
                      placeholder="请选择所在支部"
                      @focus="orgdialogVisible=true"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="9" class="calc-w-8">
                  <el-form-item class="col-name" label="民族" prop="nation">
                    <dictSelect
                      :value="editForm.nation"
                      placeholder="请选择民族"
                      params="4"
                      @input="editForm.nation=$event"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item class="col-name" label="身份证号" prop="card">
                    <el-input v-model="editForm.card" placeholder="请输入身份证号" maxlength="18"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="9" class="calc-w-8">
                  <el-form-item class="col-name" label="出生日期" prop="birth">
                    <el-date-picker
                      type="date"
                      placeholder="请选择出生日期"
                      value-format="yyyy-MM-dd"
                      v-model="editForm.birth"
                      style="width: 100%;"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <uploadIcon
                  :image="editForm.portrait_url"
                  imgText="党员头像"
                  tip="推荐160x160比例的照片"
                  :defaultIcon="require('@/common/assets/img/dc160.png')"
                  tipTop="15px"
                  accept="img"
                  @success="uploadSuccess"
                />
              </el-row>
            </el-row>
            <el-col :span="10">
              <el-form-item label="密码" prop="password">
                <el-input v-model="editForm.password" type="password" autocomplete="new-password" placeholder="默认为身份证后6位" maxlength="20"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item class="col-name" label="发展状态">
                <selectOpt
                  v-model="editForm.develop_status"
                  placeholder="请选择发展状态"
                  :option="developStateData"
                  @input="editForm.develop_status=$event"
                />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item class="col-name" label="是否为流动党员">
                <el-radio-group v-model="editForm.floating">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item class="col-name" label="入党日期" prop="join_time">
                <el-date-picker
                  type="date"
                  placeholder="请选择入党日期"
                  value-format="yyyy-MM-dd"
                  v-model="editForm.join_time"
                  style="width: 100%;"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item class="col-name" label="家庭住址">
                <el-input v-model="editForm.address" placeholder="请输入家庭住址" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item class="col-name" label="联系电话" prop="cellphone">
                <el-input v-model="editForm.cellphone" placeholder="请输入联系电话" maxlength="20"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item class="col-name" label="专业特长">
                <el-select
                  v-model="editForm.majortheyArr"
                  multiple
                  collapse-tags
                  class="dc-mult-select"
                  placeholder="请选择专业特长"
                  @change="theyChange"
                  style="width:100%;"
                >
                  <el-option
                    :label="item.name"
                    :value="item.value"
                    :key="index"
                    v-for="(item, index) in specialData"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item class="col-name" label="党务工作经验(年)">
                <el-input
                  v-model="editForm.experience"
                  placeholder="请输入党务工作经验"
                  type="number"
                  maxlength="5"
                  :oninput="oninput(5,'experience')"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-if="editForm.id">
              <el-form-item class="col-name" label="所在支部党内职务">
                <span class="sblock" :title="editForm.duties_name">{{editForm.duties_name || ""}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item class="col-name" label="工作岗位">
                <el-input
                  v-model="editForm.work_post_name"
                  readonly
                  placeholder="请选择工作岗位"
                  @focus="treepickerDialog=true;treeType='7';treeTitle='工作岗位'"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item class="col-name" label="是否为企业高管">
                <el-radio-group v-model="editForm.high">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col>
              <el-col :span="10">
                <el-form-item class="col-name" label="健康状况">
                  <el-input
                    v-model="editForm.health_name"
                    readonly
                    placeholder="请选择健康状况"
                    @focus="treepickerDialog=true;treeType='5';treeTitle='健康状况'"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="14">
                <el-form-item class="col-name" label="政治面貌">
                  <dictSelect
                    v-model="editForm.politics"
                    placeholder="请选择政治面貌"
                    params="6"
                    @input="editForm.politics=$event"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item class="col-name" label="籍贯">
                  <el-input
                    v-model="editForm.native_place_name"
                    readonly
                    placeholder="请选择籍贯"
                    @focus="treepickerDialog=true;treeType='nativePlace_tree';treeTitle='籍贯'"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="14">
                <el-form-item class="col-name" label="籍贯补充">
                  <el-input v-model="editForm.native_supply" placeholder="请输入籍贯补充" maxlength="50"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item class="col-name" label="参加工作时间">
                  <el-date-picker
                    type="date"
                    placeholder="请选择日期"
                    value-format="yyyy-MM-dd"
                    v-model="editForm.work_time"
                    style="width: 100%;"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="14">
                <el-form-item class="col-name" label="本岗位开始时间">
                  <el-date-picker
                    type="date"
                    placeholder="请选择日期"
                    value-format="yyyy-MM-dd"
                    v-model="editForm.work_post_time"
                    style="width: 100%;"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item class="col-name" label="新社会阶层情况">
                  <el-input
                    v-model="editForm.new_social_name"
                    readonly
                    placeholder="请选择新社会阶层情况"
                    @focus="treepickerDialog=true;treeType='8';treeTitle='新社会阶层情况'"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="14">
                <el-form-item class="col-name" label="婚姻状况">
                  <dictSelect
                    v-model="editForm.marital_status"
                    placeholder="请选择婚姻状况"
                    params="9"
                    @input="editForm.marital_status=$event"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item class="col-name" label="户口性质">
                  <el-input v-model="editForm.household" placeholder="请输入户口性质" maxlength="20"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="14">
                <el-form-item class="col-name" label="户口所在地">
                  <el-input v-model="editForm.house_add" placeholder="请输入户口所在地" maxlength="50"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item class="col-name" label="职称">
                  <el-input
                    v-model="editForm.titles_name"
                    readonly
                    placeholder="请选择职称"
                    @focus="treepickerDialog=true;treeType='10';treeTitle='职称'"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="14">
                <el-form-item class="col-name" label="农民工标识">
                  <el-radio-group v-model="editForm.farm_identify">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col>
              <el-col :span="10">
                <el-form-item class="col-name" label="缴纳党费工资基数">
                  <el-input
                    v-model="editForm.wagebase"
                    placeholder="请输入缴纳党费工资基数"
                    type="text"
                    maxlength="10"
                    oninput="value=value.replace(/[^0-9.]/g,'')"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="14">
                <el-form-item class="col-name" label="每月应缴纳党费">
                  <el-input
                    v-model="editForm.dues"
                    placeholder="请输入每月应缴纳党费"
                    type="text"
                    maxlength="10"
                    oninput="value=value.replace(/[^0-9.]/g,'')"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item class="col-name" label="学历">
                  <dictSelect
                    v-model="editForm.education"
                    placeholder="请选择学历"
                    params="11"
                    @input="editForm.education=$event"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="14">
                <el-form-item class="col-name" label="邮编">
                  <el-input
                    v-model="editForm.zip_code"
                    placeholder="请输入邮编"
                    type="number"
                    maxlength="6"
                    :oninput="oninput(6,'zip_code')"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item class="col-name" label="住宅电话">
                  <el-input v-model="editForm.phone" placeholder="请输入住宅电话" maxlength="20"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="14">
                <el-form-item class="col-name" label="办公电话">
                  <el-input v-model="editForm.office_phone" placeholder="请输入办公电话" maxlength="20"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item class="col-name" label="其他通讯号码">
                  <el-input v-model="editForm.other_phone" placeholder="请输入其他通讯号码" maxlength="20"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="14">
                <el-form-item class="col-name" label="E-MAIL">
                  <el-input v-model="editForm.email" placeholder="请输入邮箱" maxlength="50"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item class="col-name" label="工作在一线情况">
                  <dictSelect
                    v-model="editForm.situation"
                    placeholder="请选择工作在一线情况"
                    params="12"
                    @input="editForm.situation=$event"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="14">
                <el-form-item class="col-name" label="曾用名">
                  <el-input v-model="editForm.nickname" placeholder="请输入曾用名" maxlength="10"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item class="col-name" label="第二党派">
                  <dictSelect
                    v-model="editForm.second_org"
                    placeholder="请选择第二党派"
                    params="13"
                    @input="editForm.second_org=$event"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="14">
                <el-form-item class="col-name" label="加入第二党派日期">
                  <el-date-picker
                    type="date"
                    placeholder="请选择日期"
                    value-format="yyyy-MM-dd"
                    v-model="editForm.second_time"
                    style="width: 100%;"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item class="col-name" label="港澳台属">
                  <dictSelect
                    v-model="editForm.partygats"
                    placeholder="请选择港澳台属"
                    params="14"
                    @input="editForm.partygats=$event"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="14">
                <el-form-item class="col-name" label="参加党员志愿者队伍情况">
                  <el-select
                    v-model="editForm.partyremarkArr"
                    multiple
                    collapse-tags
                    @change="parkChange"
                    class="dc-mult-select"
                    placeholder="请选择参加党员志愿者队伍情况"
                    style="width:100%;"
                  >
                    <el-option
                      :label="item.name"
                      :value="item.value"
                      :key="index"
                      v-for="(item, index) in partyremarkData"
                      :disabled="item.status != '0'"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="demo-drawer__footer btn_footer">
        <div class="el-form-item">
          <div class="el-form-item__label" :style="{width:`${formwidth}`}">&emsp;</div>
          <div class="el-form-item__content">
            <el-button type="primary" @click="submitForm('editForm')">保存</el-button>
            <el-button @click="handleClose">取消</el-button>
          </div>
        </div>
      </div>
      <orgPicker
        :visible="orgdialogVisible"
        @close="orgdialogVisible=false"
        ableOpt="1"
        disableTip="无法选择!"
        @choosen="choosenPicker"
      />
      <treePicker
        :visible="treepickerDialog"
        @close="treepickerDialog=false"
        :typeId="treeType"
        :title="treeTitle"
        @choosen="treechoosenPicker"
      />
    </div>
  </el-drawer>
</template>

<script>
import * as account from "../api/account";
import * as allcommon from "@/common/api/common";

const TEMP = {
  realname: "",
  sex: "",
  org_id: "",
  org_name: "",
  nation: "",
  card: "",
  birth: "",
  password: "",
  repassword: "",
  portrait: "",
  portrait_url: "",
  floating: "",
  join_time: "",
  develop_status: "1",
  address: "",
  cellphone: "",
  majorthey: "",
  majortheyArr: [],
  experience: "",
  duties: "",
  work_post: "",
  work_post_name: "",
  high: "1",
  health: "",
  health_name: "",
  politics: "",
  native_place: "",
  native_place_name: "",
  native_supply: "",
  work_time: "",
  work_post_time: "",
  new_social: "",
  new_social_name: "",
  marital_status: "",
  household: "",
  house_add: "",
  titles: "",
  titles_name: "",
  farm_identify: "1",
  wagebase: "",
  dues: "",
  education: "",
  zip_code: "",
  phone: "",
  office_phone: "",
  other_phone: "",
  email: "",
  situation: "",
  nickname: "",
  second_org: "",
  second_time: "",
  partygats: "",
  partyremark: "",
  partyremarkArr: []
};

export default {
  props: {
    data: {
      type: Object,
      required: false,
      default: function() {
        return {};
      }
    },
    dialogVisible: {
      type: Boolean,
      required: false,
      default: function() {
        return false;
      }
    }
  },
  components: {
    orgPicker: resolve =>
      require(["@/common/components/orgPicker.vue"], resolve),
    treePicker: resolve =>
      require(["@/common/components/treePicker.vue"], resolve),
    dictSelect: resolve =>
      require(["@/common/components/dictSelect.vue"], resolve),
    selectOpt: resolve =>
      require(["@/common/components/selectOpt.vue"], resolve),
    uploadIcon: resolve =>
      require(["@/common/components/uploadIcon.vue"], resolve)
  },
  data() {
    return {
      loading: false,
      queryParam: {
        id: ""
      },
      editForm: Object.assign({}, TEMP),
      formRule: {
        realname: [
          { required: true, message: "请输入党员姓名", trigger: "change" }
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "change" }],
        org_id: [
          { required: true, message: "请选择所在支部", trigger: "change" }
        ],
        nation: [{ required: true, message: "请选择民族", trigger: "change" }],
        card: [
          { required: true, message: "请输入身份证号", trigger: "change" }
        ],
        birth: [
          { required: true, message: "请选择出生日期", trigger: "change" }
        ],
        join_time: [
          { required: true, message: "请选择入党日期", trigger: "change" }
        ],
        password: [
          {
            required: false,
            min: 6,
            max: 20,
            message: "密码长度在 6-20 位",
            trigger: "change"
          }
        ],
        cellphone: [
          { min: 11, max: 11, message: "长度在 11 个字符", trigger: "blur" }
        ]
        // password: [ { required:false, validator: validatePass, trigger: 'change' } ],
        // repassword: [ { validator: validatePass2, trigger: 'change' } ],
      },
      sexData: [
        {
          id: "0",
          value: "男"
        },
        {
          id: "1",
          value: "女"
        }
      ],
      developStateData: [
        {
          id: "1",
          value: "党员"
        },
        {
          id: "2",
          value: "预备党员"
        },
        {
          id: "3",
          value: "积极分子"
        },
        {
          id: "4",
          value: "发展对象"
        }
      ],
      nationData: [],
      specialData: [],
      partyremarkData: [],
      formwidth: "180px",
      treepickerDialog: false, // 树弹窗
      treeType: "", // tree下拉框类型
      treeTitle: "", // tree下拉框title
      orgdialogVisible: false,
      dvisible: this.dialogVisible
    };
  },
  watch: {
    dialogVisible:{
      handler(val) {
        this.dvisible = val;
      },
      immediate:true
    }
  },
  methods: {
    handleOpen() {
      this.getDicData();
      const data = this.data;
      if (data && data.uid) {
        this.queryParam.id = data.uid;
        this.fetchData();
      } else {
          this.loading = false;
      }
    },
    handleClose() {
        this.$emit('cancel');
        
        this.editForm = Object.assign({}, TEMP);
        this.$refs.editForm && this.$refs.editForm.resetFields()
    },
    oninput(len, field) {
      if (this.editForm[field] && this.editForm[field].length > len)
        this.editForm[field] = this.editForm[field].slice(0, len);
    },
    // 树下拉列表
    treechoosenPicker(type, obj) {
      // console.log('obj',obj);
      let field_id = "";
      let field_name = "";
      if (type == "7") {
        // 工作岗位
        field_id = "work_post";
        field_name = "work_post_name";
      } else if (type == "5") {
        // 健康状况
        field_id = "health";
        field_name = "health_name";
      } else if (type == "nativePlace_tree") {
        field_id = "native_place";
        field_name = "native_place_name";
      } else if (type == "8") {
        // 新社会阶层
        field_id = "new_social";
        field_name = "new_social_name";
      } else if (type == "10") {
        // 职称
        field_id = "titles";
        field_name = "titles_name";
      }
      if (Object.keys(obj != null && obj).length == 0) {
        this.editForm[field_id] = "";
        this.editForm[field_name] = "";
        return;
      }
      this.editForm[field_id] = obj.value;
      this.editForm[field_name] = obj.name;
    },
    // 上传成功
    uploadSuccess(res, file, fileList) {
      if (res.id) {
        this.editForm.portrait_url = res.domain + res.file_key;
        this.editForm.portrait = res.id;
      }
    },
    // 党组织库选择 单选
    choosenPicker(obj) {
      // console.log('org',obj);
      this.orgdialogVisible = false;
      if (Object.keys(obj != null && obj).length == 0) {
        this.editForm.org_name = "";
        this.editForm.org_id = "";
        return;
      }
      this.editForm.org_name = obj.name;
      this.editForm.org_id = obj.id;
    },
    // 特长多选
    theyChange(arr) {
      this.editForm.majorthey = arr.join(",");
    },
    // 参加党员志愿者队伍情况 多选
    parkChange(arr) {
      this.editForm.partyremark = arr.join(",");
    },
    submitForm() {
      this.$refs["editForm"].validate(valid => {
        if (valid) {
          account.save.r(this.editForm).then(res => {
            if (res.data.status == "200") {
              if (!this.editForm.uid) {
                this.$message.success("新增成功");
              } else {
                this.$message.success("编辑成功");
              }
              this.$emit("submit");
            }
          });
        }
      });
    },
    getDicData() {
      // 特长
      allcommon.dict_tree.r({ id: 15 }).then(res => {
        this.specialData = res.data.data;
      });
      // 参加党员志愿者队伍情况
      allcommon.dict_tree.r({ id: 16 }).then(res => {
        this.partyremarkData = res.data.data;
      });
    },
    fetchData() {
      // 获取详情
      this.loading = true;
      account.detail.r(this.queryParam).then(res => {
        this.loading = false;
        if (res.data.status == "200") {
          res.data.data.majortheyArr =
            res.data.data.majorthey != ""
              ? res.data.data.majorthey.split(",")
              : [];
          res.data.data.partyremarkArr =
            res.data.data.partyremark != ""
              ? res.data.data.partyremark.split(",")
              : [];
          this.editForm = res.data.data;
          this.set0Val([
            "develop_status",
            "health",
            "native_place",
            "new_social",
            "titles"
          ]);
        }
      }).catch(() => {
          this.loading = false;
      });
    },
    // 清空为0的数据
    set0Val(fieldArr) {
      for (const key in fieldArr) {
        this.editForm[fieldArr[key]] =
          this.editForm[fieldArr[key]] == "0"
            ? ""
            : this.editForm[fieldArr[key]];
      }
    }
  }
};
</script>

<style scoped>
.el-form,
.demo-drawer__footer {
  padding: 0 20px;
}
.upload-div {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 0;
  height: 150px;
}
.upload-div >>> div {
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
  display: flex;
}
.upload-div >>> div img {
  max-height: 100%;
}
.btn_footer .el-form-item {
  margin: 0;
}
.btn_footer .el-form-item__content {
  line-height: 70px;
}
/* .form-row .dc-mult-select > >>> div { height: 60px; overflow: hidden; } */
.demo-drawer__content >>> .el-form-item{min-height: 40px;}
</style>
