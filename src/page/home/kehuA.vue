<template>
  <div class="w-100 order flex-col">
    <div class="p-15" style="background:rgba(229,246,247,1);">
      <el-form :inline="true" class="demo-form-inline">
        <el-row>
          <el-col>
            <el-form-item label class="m-b-0">
              <el-input v-model="search.name" placeholder="请输入关键字" style="width:100%;"></el-input>
            </el-form-item>
            <el-button type="success" icon="el-icon-search" @click="getList()">查找</el-button>
            <el-radio-group v-model="radio" @change="ClickHY">
              <el-radio :label="0">全部</el-radio>
              <el-radio :label="1">会员</el-radio>
              <el-radio :label="2">非会员</el-radio>
            </el-radio-group>
            <!-- <el-checkbox v-model="checked">有效套餐</el-checkbox> -->
            <el-form-item label class="m-b-0 right m-r-20">
              <div
                class="left c-p c-9"
                @click="getExcel"
                style="width: 139px; height: 42px;line-height: 42px;background: url(../../../static/img/but1.png) no-repeat;background-size: 100% 100%;text-indent: 45px;"
              >导出EXCEL</div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div style="width:100%;padding-top:15px;" class="orderTable" id="printBox">
      <el-table :data="tableData" :max-height="500" style="width: 100%">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column prop="customerName" label="客户姓名"></el-table-column>
        <el-table-column prop="phone" label="手机号码"></el-table-column>
        <el-table-column prop label="会员等级" width>
          <template slot-scope="scope">
            <el-rate v-model="scope.row.grade" disabled></el-rate>
          </template>
        </el-table-column>
        <el-table-column prop="comboCount" label="已购套餐"></el-table-column>
        <el-table-column prop="balanceAmount" label="储值卡余额"></el-table-column>
        <el-table-column prop="carNos" label="绑定车辆"></el-table-column>
        <el-table-column prop label="操作">
          <template slot-scope="scope">
            <!-- <div @click.stop style="display: inline-block;"> -->
            <el-dropdown trigger="click" @command="handleCommand">
              <el-button plain size="mini">
                操作
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="send_work(scope.row)">修改客户信息</el-dropdown-item>
                <el-dropdown-item @click.native="add_parts(scope.row)">查看套餐</el-dropdown-item>
                <el-dropdown-item @click.native="edit_project(scope.row)">查看车辆信息</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <!-- </div> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="p-tb-10 text-center">
        <el-pagination
          :hide-on-single-page="pageLength === 0"
          background
          layout="prev, pager, next"
          :page-size="size"
          @current-change="handleCurrentChange"
          :total="pageLength"
        ></el-pagination>
      </div>
    </div>
    <el-dialog width="25%" title="资料变更" :visible.sync="innerVisible" center append-to-body>
      <el-form :model="ziliao">
        <el-form-item label="车主姓名" label-width="80px">
          <el-input v-model="ziliao.customerName"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" label-width="80px">
          <el-input v-model="ziliao.phone"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="ZLbiangen">变 更</el-button>
        <el-button type="danger" @click="innerVisible = false ">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog width="30%" title="已购套餐" :visible.sync="payStatus2" center append-to-body>
      <span class="shu">
        共
        <span style="color: #3AC29F;">{{ZLlist.comboList?ZLlist.comboList.length:'0'}}</span> 可用
      </span>
      <el-row class="boo">
        <el-col :span="12">车主姓名：{{ZLlist.customerName}}</el-col>
        <el-col :span="12">手机号码：{{ZLlist.phone}}</el-col>
      </el-row>
      <el-row class="boo" v-for="(item,idx) in ZLlist.comboList" :key="idx">
        <el-col :span="20">{{item.comboName}}</el-col>
        <el-col :span="4" class="dsj">
          <span @click="TCxianqin(item)" style="cursor: pointer;">详情</span>
          <i class="el-icon-arrow-right"></i>
        </el-col>
      </el-row>
      <!-- <img class="mis" src="../../assets/tuihuo.png" alt /> -->
      <el-dialog
        width="30%"
        title="资料变更"
        :visible.sync="innerVisible2"
        center
        append-to-body
        class="ddw"
      >
        <span class="shu" style="cursor: pointer;" @click="XQxiaofei">
          消费详情
          <i class="el-icon-d-arrow-right"></i>
        </span>
        <el-row class="boo">
          <el-col :span="12">
            <img class="mis" src="../../assets/taocan.png" alt />
            <span style="vertical-align:middle">{{TClist.comboName}}</span>
          </el-col>
          <el-col :span="12" style="color: #FF6757;text-align: right;">限 {{TClist.carNo}} 使用</el-col>
        </el-row>
        <el-row class="boo">
          <el-col :span="8">
            <i class="el-icon-user"></i>
            {{TClist.customerName}}
          </el-col>
          <el-col :span="16">
            <i class="el-icon-phone-outline"></i>
            {{TClist.phone}}
          </el-col>
        </el-row>
        <el-row class="boo">
          <el-col :span="12">开卡门店：</el-col>
          <el-col :span="12" style="text-align: right;">{{TClist.garageName}}</el-col>
        </el-row>
        <el-row class="boo">
          <el-col :span="12">购买日期：{{TClist.startDate?TClist.startDate.substring(0,10):''}}</el-col>
          <el-col :span="12" style="text-align: right;">到期还有：{{day}}天</el-col>
        </el-row>
        <el-row class="boo" v-for="(items,idxd) in SClist.itemList" :key="idxd">
          <el-col :span="12">{{items.itemName}}</el-col>
          <el-col :span="6" style="text-align: right;">{{items.totalTimes}}次</el-col>
          <el-col :span="6" style="text-align: right;">剩余{{items.surplusTimes}}次</el-col>
        </el-row>
        <el-dialog width="30%" title="套餐消费详情" :visible.sync="payStatusXQ" center append-to-body>
          <el-row class="boocv">
            <el-col :span="12" class="hh1">套餐名称</el-col>
            <el-col :span="12" style="text-align: right;">{{XFlist.comboName}}</el-col>
          </el-row>
          <el-row class="boo" v-for="(item,index) in XFlist.recordVOList" :key="index">
            <el-col :span="12">{{item.createdDate?item.createdDate.substring(0,10):''}}</el-col>
            <el-col :span="12" style="text-align: right;">{{item.itemName}}</el-col>
          </el-row>
        </el-dialog>
      </el-dialog>
    </el-dialog>
    <el-dialog width="30%" title="绑定车辆" :visible.sync="payStatus4" center append-to-body>
      <el-row class="boo" v-for="(item,ides) in CarLIST.carList" :key="ides">
        <el-col :span="12" class="hh1">{{item.carNo}}</el-col>
        <el-col :span="6" style="text-align: right;">
          <div class="weixiu" @click="WXclick(item)">维修记录</div>
        </el-col>
        <el-col :span="6" style="text-align: right;">
          <div class="chelian" @click="Carziliao(item)">车辆信息</div>
        </el-col>
      </el-row>

        <!-- //维修记录 -->
    <el-dialog title="车辆维修记录" :visible.sync="payStatusZL" center width="45%" :modal="false">
      <el-table :data="WXlist" :height="300" style="width: 100%">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column prop="carNo" label="车牌号" width="120"></el-table-column>
        <el-table-column prop label="结算时间" width="120">
          <template
            slot-scope="scope"
            v-if="scope.row.orderCreateTime"
          >{{scope.row.orderCreateTime.substring(0,10)}}</template>
        </el-table-column>
        <el-table-column prop="amountReceivable" label="结算金额" width="80"></el-table-column>
        <el-table-column prop label="项目">
          <template slot-scope="scope">
              <span v-for="item in scope.row.orderItemList" :key="item.id">
                    {{item.itemName}}
              </span>
              </template>
        </el-table-column>
      </el-table>
</el-dialog>

      <!-- 车辆资料 -->
      <el-dialog
        :title="CLzl_list.carNo + '车辆资料'"
        :visible.sync="CLVisible"
        center
        width="45%"
        :modal="false"
      >
        <el-row class="bodv hbz" style="width: 48%;">
          <el-col :span="24">
            门店名称：
            <span style="color: rgb(13, 144, 110);">{{CLzl_list.garageName}}</span>
          </el-col>
        </el-row>
        <el-form :inline="true" class="demo-form-inline dsds" ref="xinzen">
          <div class="CLzl left">
            <el-row class="bodv bodvg" style="  width: 100%;">
              <el-form-item label="车架号:" class="m-b-0" style="width: 70%;">
                <el-input
                  v-model="CLzl_list.vin"
                  placeholder="请输入"
                  style="width: 100%;text-align: right;"
                ></el-input>
              </el-form-item>
              <span class="zzll">照片</span>
              <el-upload
                multiple
                class="avatar-uploader"
                action="/api/vehicle/file/uploadPicture"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
              >
                <img v-if="CLzl_list.vinPic" :src="CLzl_list.vinPic" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-row>
            <el-row class="bodv">
              <el-form-item label="发动机号:" class="m-b-0" style="width: 100%;">
                <el-input
                  v-model="CLzl_list.engineNo"
                  placeholder="请输入"
                  style="width: 160px; text-align:right; "
                ></el-input>
              </el-form-item>
            </el-row>
            <el-row class="bodv">
              <el-form-item label="车型:" class="m-b-0 cas" style="width: 100%;">
                <!-- <el-input v-model="CLzl_list.standard" placeholder="请输入" style="width: 160px;"></el-input> -->
                <el-cascader
                  ref="cascaderAddr"
                  clearable
                  filterable
                  v-model="CLzl_list.carSeriesId"
                  @change="treeChan"
                  :options="car_listname"
                  :show-all-levels="false"
                ></el-cascader>
              </el-form-item>
            </el-row>
            <el-row class="bodv">
              <el-form-item label="行驶里程:" class="m-b-0" style="width: 100%;">
                <el-input v-model="CLzl_list.driveMiles" placeholder="请输入" style="width: 160px;"></el-input>
              </el-form-item>
            </el-row>
            <el-row class="bodv">
              <el-form-item label="建议保养时间:" class="m-b-0" style="width: 100%;">
                <el-date-picker
                  style="width: 100%;"
                  v-model="CLzl_list.suggestMaintenanceDate"
                  type="date"
                  placeholder="选择日期"
                ></el-date-picker>
              </el-form-item>
            </el-row>
            <el-row class="bodv">
              <el-form-item label="建议保养里程:" class="m-b-0" style="width: 100%;">
                <el-input
                  v-model="CLzl_list.suggestMaintenanceMiles"
                  placeholder="请输入"
                  style="width: 160px;"
                ></el-input>
              </el-form-item>
            </el-row>
          </div>

          <div class="CLzl right">
            <el-row class="bodv">
              <el-form-item label="投保公司:" class="m-b-0" style="width: 100%;">
                <el-input v-model="CLzl_list.insurance" placeholder="请输入" style="width: 160px;"></el-input>
              </el-form-item>
            </el-row>
            <el-row class="bodv">
              <el-form-item label="保险到期:" class="m-b-0" style="width: 100%;">
                <el-date-picker
                  style="width: 100%;"
                  v-model="CLzl_list.insuranceExpire"
                  type="date"
                  placeholder="选择日期"
                ></el-date-picker>
              </el-form-item>
            </el-row>
            <el-row class="bodv">
              <el-form-item label="年审到期:" class="m-b-0" style="width: 100%;">
                <el-date-picker
                  style="width: 100%;"
                  v-model="CLzl_list.yearExpire"
                  type="date"
                  placeholder="选择日期"
                ></el-date-picker>
              </el-form-item>
            </el-row>
            <el-row class="bodv" style="border: none;">
              <el-form-item label="备注:" class="m-b-0" style="width: 100%;">
                <!-- <el-input v-model="CLzl_list.remark" placeholder="请输入" style="width: 160px;"></el-input> -->
              </el-form-item>
              <textarea class="beizhu" v-model="CLzl_list.remark" placeholder="请输入备注" />
            </el-row>
          </div>
        </el-form>
        <el-row class="bodv liutu" style="border:none">
          <el-col :span="24">
            <div class="yinye">外观留图（最多40张）</div>
            <div class="imggg" v-for="(item,index) in CLzl_list.picturesList" :key="index">
              <el-image class="img_lis" :src="item.picUrl" @click="viewPhoto(item.picUrl)"></el-image>
              <i class="el-icon-circle-close icode" @click="imgDLT2(index)"></i>
            </div>
            <el-upload
              multiple
              show-file-list
              class="sadd"
              ref="uploadImg"
              action="/api/vehicle/file/uploadPicture"
              list-type="picture-card"
              :limit="40"
              :on-remove="handleRemove2"
              :on-success="handleSuccess2"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button type="success" @click="Carbaocun(CLzl_list)">保 存</el-button>
        </div>
        <el-dialog
          title="查看照片"
          :visible.sync="visible.photoVisible"
          width="30%"
          center
          :modal="false"
        >
          <span>
            <el-image style="width: 100%;margin:0 auto; " :src="photoUrl" fit="fill"></el-image>
          </span>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="visible.photoVisible = false">确 定</el-button>
          </span>
        </el-dialog>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import {
  kehulist,
  updateCustomerInfo,
  getDetailByCarNo,
  findItemByComboCustomerId,
  findRecordByComboCustomerId,
  TCgetDetailByCarNo,
  findCarDataList,
  getDetails,
  Carupdate,
  listRepairHistory
} from "../../request/api.js";
import moment from "moment";
export default {
  name: "kehuA",
  data() {
    return {
      search: {
        month: moment(new Date()).format("YYYY-MM")
      },
      tableData: [],
      car_listname: [],
      ziliao: {
        customerName: "",
        phone: ""
      },
      editForm: {
        percentagePartRate: "",
        percentageTimeRate: ""
      },
      maxHeight: undefined,
      pageLength: null,

      size: 10,
      page: 0,
      gid: "",
      shenhe: {
        status: null
      },
      peijian: {
        name: ""
      },
      tuoke: {
        carNo: "",
        name: "",
        phone: ""
      },
      listPJ: [],
      radio: 0,
      checked: false,
      tuokeSLlist: [],
      WXlist: [],
      CLzl_list: [],
      datalist: {},
      tokerPercentageDTO: {},
      orderItemList: [],
      tableData2: [],
      id: "",
      visible: {
        photoVisible: false
      },
      photoUrl: "",
      CLVisible: false,
      payStatus: false,
      payStatus2: false,
      payStatus3: false,
      payStatus4: false,
      payStatusZL:false,
      payStatusXQ: false,
      innerVisible: false,
      innerVisible2: false,
      innerVisible3: false,
      ZLlist: {},
      day: "", //到期时间
      TClist: {},
      SClist: {}, //套餐详情次数
      XFlist: {}, //套餐详情次数
      CarLIST: {}
    };
  },
  created() {
    this.getList();
  },
  mounted() {
    this.maxHeight = $(".tabBox").height() - 260 + "px";
  },
  methods: {
    getList() {
      let data = {
        phoneOrCarNo: this.search.name,
        status: this.radio,
        page: this.page,
        size: this.size
      };
      kehulist(data).then(res => {
        
        this.tableData = res.data.data.content;
        this.pageLength = res.data.data.totalElements;
      });
    },
    //维修记录
    WXclick(row) {
      listRepairHistory({carNo:row.carNo}).then(res => {
        if (res.data.code == 200) {
            console.log(res.data.data);
            this.WXlist = res.data.data
          };
   
      });
      this.payStatusZL = true
    },
    //车辆资料
    Carziliao(row) {
      findCarDataList().then(res => {
        this.car_listname = res.data.data.map(v => {
          v.value = v.brandId;
          v.label = v.brandName;

          v.children = v.carSeriesInfoList;
          // if (v.carSeriesInfoList)
          v.children.forEach(k => {
            k.label = k.seriesName;
            k.value = k.seriesId;
          });
          return v;
        });
      });
      getDetails({ carNo: row.carNo }).then(res => {
        this.CLzl_list = res.data.data;
        this.CLzl_list.url = JSON.parse(
          JSON.stringify(this.CLzl_list.picturesList)
        );
      });
      this.CLVisible = true;
    },
    //选择图片
    handleAvatarSuccess(e) {
      this.CLzl_list.vinPic = e.data;
    },
    //选择车型
    treeChan(event) {
      this.CLzl_list.carSeriesId = event.slice(-1)[0];
      this.$nextTick(() => {
        this.CLzl_list.carBrand = this.$refs[
          "cascaderAddr"
        ].getCheckedNodes()[0].pathLabels[0];
        this.CLzl_list.carSeriesName = this.$refs[
          "cascaderAddr"
        ].getCheckedNodes()[0].pathLabels[1];
        this.CLzl_list.standard = this.$refs[
          "cascaderAddr"
        ].getCheckedNodes()[0].pathLabels[1];
        console.log(this.$refs["cascaderAddr"].getCheckedNodes()[0].pathLabels);
      });
    },
    viewPhoto(url) {
      this.photoUrl = url;
      this.visible.photoVisible = true;
    },
    //点击删除渲染的图片
    imgDLT2(idx) {
      this.CLzl_list.picturesList.splice(idx, 1);
      this.CLzl_list.url.splice(idx, 1);
    },
    //删除上传图片
    handleRemove2(file, fileList) {
      const filepath = file.response.data;
      //从pictureList数组中找到对应得索引值
      const i = this.CLzl_list.url.findIndex(x => x.picUrl === filepath);
      //调用solice方法删除
      this.CLzl_list.url.splice(i, 1);
    },
    //监听图片上传成功
    handleSuccess2(e) {
      // console.log(e.data);
      const picUrl = {
        picUrl: e.data,
        carNo: this.CLzl_list.carNo
      };
      this.CLzl_list.url.push(picUrl);
    },
    //保存车辆资料
    Carbaocun(row) {
      row.picturesList = row.url;
      console.log(row);
      Carupdate(row).then(res => {
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: "保存成功"
          });
          // this.ccd();
          this.CLVisible = false;
        }
        this.$refs.uploadImg.clearFiles();
      });
    },
    //

    //查看车辆信息
    edit_project(row) {
      console.log(row);
      TCgetDetailByCarNo({
        customerId: row.customerId
      }).then(res => {
        if (res.data.code == 200) {
          this.CarLIST = res.data.data;
          console.log(res.data.data); //day 457
        }
      });
      this.payStatus4 = true;
    },
    //消费详情弹窗
    XQxiaofei() {
      findRecordByComboCustomerId({
        comboCustomerId: this.TClist.comboCustomerId
      }).then(res => {
        if (res.data.code == 200) {
          this.XFlist = res.data.data;
          console.log(res.data.data); //day 457
        }
      });
      this.payStatusXQ = true;
    },
    ClickHY(e) {
      // console.log(e)
      this.getList();
    },
    //套餐详情
    TCxianqin(row) {
      console.log(row);
      this.TClist = row;

      var begindate = row.endDate;
      begindate = new Date(Date.parse(begindate.replace(/-/g, "/")));
      //将开始时间由字符串格式转换为日期格式
      var myDate = new Date(); //此处将服务器当前日期作为结束日期，也可为其他任意时间
      var startDate = begindate.getTime(); //将开始日期转换成毫秒
      var endDate = myDate.getTime(); //将结束日期转换成毫秒
      var day = parseInt((startDate - endDate) / 1000 / 3600 / 24); //结束日期减去开始日期后转换成天数

      this.day = day;
      findItemByComboCustomerId({ comboCustomerId: row.comboCustomerId }).then(
        res => {
          if (res.data.code == 200) {
            this.SClist = res.data.data;
            console.log(res.data.data); //day 457
          }
        }
      );
      this.innerVisible2 = true;
    },
    //查看套餐
    add_parts(row) {
      getDetailByCarNo({ customerId: row.customerId }).then(res => {
        if (res.data.code == 200) {
          this.ZLlist = res.data.data;
          console.log(res.data.data);
        }
      });
      this.payStatus2 = true;
    },
    //资料变更弹窗
    send_work(row) {
      this.ziliao.customerName = "";
      this.ziliao.phone = "";
      //   console.log(row);
      this.ziliao.customerId = row.customerId;
      this.innerVisible = true;
    },
    //资料变更
    ZLbiangen() {
      if (this.ziliao.customerName == "") {
        this.$message.error("请先输入车主姓名");
        return;
      } else if (this.ziliao.phone == "") {
        this.$message.error("请先输入手机号码");
        return;
      }
      console.log(this.ziliao);
      updateCustomerInfo(this.ziliao).then(res => {
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: "变更成功!"
          });
        }
        this.innerVisible = false;
        this.getList();
      });
    },
    handleCommand(command) {
      // console.log(command);
    },
    handleCurrentChange(val) {
      this.page = val - 1;
      this.getList();
    },
    getExcel() {}
  }
};
</script>
<style scoped>
.boo {
  border-bottom: 1px solid #dcdfe6;
  /* height: 50px; */
  line-height: 50px;
}
.ddw {
  /* position: relative;
    overflow: hidden; */
}
.boocv {
  border-bottom: 6px solid #dcdfe6;
  /* height: 50px; */
  line-height: 50px;
}
.booc {
  overflow: hidden;
  border-bottom: 1px solid #dcdfe6;
  line-height: 50px;
}
.dsj {
  text-align: right;
}
.hh1 {
  font-weight: 600;
}
.shu {
  position: absolute;
  right: 0;
  top: 0;
  margin-right: 30px;
  margin-top: 50px;
}
.el-radio-group {
  margin-left: 30px;
}
.el-radio {
  margin-right: 10px;
}
.el-checkbox {
  margin-left: 30px;
}
.mis {
  width: 30px;
  height: 20px;
  vertical-align: middle;
}
.weixiu {
  display: inline-block;
  font-size: 13px;
  height: 25px;
  margin-top: 12px;
  line-height: 25px;
  width: 70px;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #f56c6c;
  color: #f56c6c;
  cursor: pointer;
}
.chelian {
  display: inline-block;
  font-size: 13px;
  height: 25px;
  margin-top: 12px;
  line-height: 25px;
  width: 70px;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #409eff;
  color: #409eff;
  cursor: pointer;
}
.beizhu {
  height: 60px;
  border: none;
  width: 100%;
  color: #606266;
  font-size: 14px;
}
.bodv {
  /* margin-bottom: 5px; */
  border-bottom: 1px solid #dcdfe6;
}
.zzll {
  line-height: 40px;
}
.bodv /deep/ .el-input__inner {
  text-align: right;
  border: none;
  padding: 0px;
}
.bodv .cas /deep/ .el-input__inner {
  padding: 0px 30px;
}
.bodv /deep/ .el-input__prefix {
  display: none;
}
.bodv /deep/ .el-form-item__content {
  float: right;
}
.bodvg /deep/ .el-form-item__content {
  width: 70%;
}
.avatar-uploader {
  float: right;
  line-height: 40px;
  width: 40px;
  height: 40px;
  background: #f2f2f2;
  text-align: center;
}
.avatar-uploader img {
  width: 40px;
  height: 40px;
}
.dsds {
  overflow: hidden;
}
.CLzl {
  width: 48%;
  /* height: 500px; */
}
.imggg {
  position: relative;
  float: left;
}
.img_lis {
  width: 80px;
  height: 80px;
}
.imggg:nth-child(n + 1) {
  margin-left: 5px;
}
.icode {
  position: absolute;
  top: 0;
  right: 0;
  color: #fff;
  cursor: pointer;
}
.CLzl /deep/ .el-form--inline .el-form-item {
  width: 100%;
}
</style>