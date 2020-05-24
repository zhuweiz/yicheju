<template>
  <div class="w-100 order flex-col">
    <div class="p-15" style="background:rgba(229,246,247,1);">
      <el-form :inline="true" class="demo-form-inline">
        <el-row>
          <el-col>
            <el-form-item label="客户姓名" class="m-b-0">
              <el-input v-model="search.name" placeholder="客户姓名" style="width:100%;"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" class="m-b-0">
              <el-input v-model="search.phone" placeholder="手机号码" style="width:100%;"></el-input>
            </el-form-item>
            <el-button type="success" icon="el-icon-search" @click="getList()">查找</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div style="width:100%;padding-top:15px;" class="orderTable" id="printBox">
      <el-table :data="tableData" :max-height="maxHeight" style="width: 100%">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column prop="name" label="客户姓名" width="80"></el-table-column>
        <el-table-column prop="phone" label="手机号码"></el-table-column>
        <el-table-column prop="createdDate" label="拓客申请时间"></el-table-column>
        <el-table-column prop label="拓客状态" width="80">
          <template slot-scope="scope">
            <span
              v-if="scope.row.status == 0"
              style="color: #ee0a24;cursor:pointer"
              @click.stop="editRow(scope.row)"
            >待审核</span>
            <span
              v-if="scope.row.status == 1"
              style="cursor:pointer"
              @click.stop="editRow(scope.row)"
            >已审核</span>
            <span
              v-if="scope.row.status == 2"
              style="color: #3ac29f;cursor:pointer"
              @click.stop="editRow(scope.row)"
            >已取消</span>
          </template>
        </el-table-column>
        <el-table-column prop label="拓客车牌" width="380">
          <template slot-scope="scope">
            <div class="yic">{{scope.row.carNos}}</div>
            <div class="xiu" @click="tuokeSL(scope.row)">修改</div>
          </template>
        </el-table-column>
        <el-table-column prop label="拓客车辆维修记录">
          <template slot-scope="scope">
            <span>
              <el-button size="mini" @click="Tuokewx(scope.row)">查看</el-button>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop label="提成设置">
          <template slot-scope="scope">
            <span>
              <el-button size="mini" @click="Xiugai(scope.row)">修改</el-button>
            </span>
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
    <el-dialog title="拓客车辆维修记录" :visible.sync="payStatus4" center width="45%" :modal="false">
      <el-table :data="WXlist" :height="300" style="width: 100%">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column prop="carNo" label="车牌号"></el-table-column>
        <el-table-column prop label="结算时间">
          <template
            slot-scope="scope"
            v-if="scope.row.settlementDate"
          >{{scope.row.settlementDate.substring(0,10)}}</template>
        </el-table-column>
        <el-table-column prop="totalActiveAmount" label="结算金额" width="80"></el-table-column>
        <el-table-column prop label="提成金额">
          <template slot-scope="scope">{{scope.row.zong}}</template>
        </el-table-column>
        <el-table-column prop label="操作" width="80">
          <template slot-scope="scope">
            <span>
              <div style="text-decoration: underline;cursor:pointer" @click="TuokeJl(scope.row)">查看</div>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        width="60%"
        :title="datalist.carNo+' 维修拓客收入详情'"
        :visible.sync="innerVisible3"
        center
        append-to-body
      >
        <el-row>
          <el-col :span="6">
            厂名:
            <div class="weixiu">{{datalist.garageName}}</div>
          </el-col>
          <el-col :span="7">
            日期:
            <div class="weixiu">{{datalist.settlementDate}}</div>
          </el-col>
          <el-col :span="5">
            送修人:
            <div class="weixiu">{{datalist.woreName}}</div>
          </el-col>
          <el-col :span="6">
            手机号:
            <div class="weixiu">{{datalist.phone}}</div>
          </el-col>
        </el-row>
        <div class="feng">
          <div style="width: 48%;float: left;">
            <el-row class="xianmu">
              <el-col :span="12">
                <div class="shu"></div>
                <div class="name">项目清单</div>
              </el-col>
              <el-col :span="4">结算金额</el-col>
              <el-col :span="4">提成比例</el-col>
              <el-col :span="4">提成金额</el-col>
            </el-row>
            <el-row class="xianmu" v-for="(item,index) in orderItemList" :key="index">
              <el-col :span="12">{{item.itemName}}</el-col>
              <el-col :span="4" v-if="item.itemName">
                <!-- {{zhekou.discountItemRate}} -->
                <span
                  v-if="zhekou.discountItemRate"
                >￥{{(item.standPrice*item.counts)*(zhekou.discountItemRate/10)}}</span>
                <span v-else>￥{{(item.standPrice*item.counts)}}</span>
              </el-col>
              <el-col :span="4" v-if="item.itemName" >{{tokerPercentageDTO.percentageTimeRate}}%</el-col>
              <el-col
              v-if="item.itemName"
                :span="4"
              >
              <span v-if="zhekou.discountItemRate">￥{{((item.standPrice*item.counts)*(zhekou.discountItemRate/10))*(tokerPercentageDTO.percentageTimeRate/100)}}</span>
              <span v-else>￥{{((item.standPrice*item.counts)*(tokerPercentageDTO.percentageTimeRate/100))}}</span>
              </el-col>
            </el-row>

            <el-row class="xianmu" style="border:none">
              <el-col :span="12">小计</el-col>
              <el-col :span="8" v-if="datalist.activeItemAmount">￥{{datalist.activeItemAmount}}</el-col>
              <!-- <el-col :span="4"></el-col> -->
              <el-col :span="4" v-if="heji">￥{{heji}}</el-col>
            </el-row>
          </div>

          <div style="width: 48%;float: right;">
            <el-row class="xianmu">
              <el-col :span="12">
                <div class="shu"></div>
                <div class="name">配件清单</div>
              </el-col>
              <el-col :span="4">结算金额</el-col>
              <el-col :span="4">提成比例</el-col>
              <el-col :span="4">提成金额</el-col>
            </el-row>
            <el-row class="xianmu" v-for="(item,idx) in tableData2" :key="idx">
              <el-col :span="12">{{item.partName}}</el-col>
              <el-col :span="4" v-if="item.partName">
                <span v-if="zhekou.discountPartRate">￥{{(item.price*item.counts)*(zhekou.discountPartRate/10)}}</span>
                <span v-else>￥{{item.price*item.counts}}</span>              
                </el-col>
              <el-col :span="4" v-if="item.partName">{{item.ticheng}}%</el-col>
              <el-col :span="4" v-if="item.partName">
                <span  v-if="zhekou.discountPartRate">￥{{(item.price*item.counts)*(zhekou.discountPartRate/10)*(item.ticheng/100)}}</span>
                <span v-else>￥{{(item.price*item.counts)*(item.ticheng/100)}}</span>
              </el-col>
            </el-row>

            <el-row class="xianmu" style="border:none">
              <el-col :span="12">小计</el-col>
              <el-col :span="8" v-if="datalist.activePartAmount">￥{{datalist.activePartAmount}}</el-col>
              <!-- <el-col :span="4"></el-col> -->
              <el-col :span="4" v-if="heji2">￥{{heji2}}</el-col>
            </el-row>
          </div>
        </div>
        <div class="feng2">
          <div style="width: 48%;float: left;">
            <el-row class="xianmu" style="border:none">
              <el-col :span="20">消费合计</el-col>
              <el-col :span="4">￥{{datalist.totalActiveAmount}}</el-col>
            </el-row>
          </div>
          <div style="width: 48%;float: right;">
            <el-row class="xianmu" style="border:none">
              <el-col :span="20">提成合计</el-col>
              <el-col :span="4">￥{{zong}}</el-col>
            </el-row>
          </div>
        </div>
      </el-dialog>
    </el-dialog>

    <el-dialog title="拓客收入" :visible.sync="payStatus3" center width="35%" :modal="false">
      <el-table :data="tuokeSLlist" :height="300" style="width: 100%">
        <el-table-column prop="carNo" label="车牌"></el-table-column>
        <el-table-column prop="name" label="客户姓名" width="80"></el-table-column>
        <el-table-column prop="phone" label="手机号码"></el-table-column>
        <el-table-column prop label="操作" width="80">
          <template slot-scope="scope">
            <span>
              <div style="color: #ee0a24;cursor:pointer" @click="SLshanchu(scope.row)">删除</div>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="tuokeXZ">新 增</el-button>
        <el-button type="danger" @click="payStatus3 = false">退 出</el-button>
      </div>

      <el-dialog width="25%" title="新增拓客车辆" :visible.sync="innerVisible2" center append-to-body>
        <el-form :model="tuoke">
          <el-form-item label="车牌" label-width="70px">
            <el-input v-model="tuoke.carNo"></el-input>
          </el-form-item>
          <el-form-item label="车主姓名" label-width="70px">
            <el-input v-model="tuoke.name"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" label-width="70px">
            <el-input v-model="tuoke.phone"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="success" @click="tuokexinzen">添 加</el-button>
          <el-button type="danger" @click="innerVisible2 = false">退 出</el-button>
        </div>
      </el-dialog>
    </el-dialog>

    <el-dialog title="更换状态" :visible.sync="payStatus" center width="25%" :modal="false">
      <el-radio-group v-model="shenhe.status" style="width: 100%;">
        <el-radio :label="0" class="shenhe">待审核</el-radio>
        <el-radio :label="1" class="shenhe">已审核</el-radio>
        <el-radio :label="2" class="shenhe">取&nbsp&nbsp&nbsp消</el-radio>
      </el-radio-group>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="payStatus = false">取 消</el-button>
        <el-button type="success" @click="TjStatus">提 交</el-button>
      </div>
    </el-dialog>
    <el-dialog title="拓客提成设置" :visible.sync="payStatus2" center width="25%" :modal="false">
      <el-form :model="editForm">
        <el-form-item label="工时提成" label-width="100px">
          <el-input v-model="editForm.percentageTimeRate">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="一般配件提成" label-width="100px">
          <el-input v-model="editForm.percentagePartRate">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="特殊配件提成" label-width="100px">
          <div class="tianjia" @click="innerVisible = true">添加</div>
        </el-form-item>
        <!-- <div > -->
        <el-form-item
          :label="item.partName"
          label-width="100px"
          v-for="(item,idx) in listPJ"
          :key="idx"
        >
          <el-input v-model="item.percentage">
            <template slot="append">%</template>
          </el-input>
          <div class="shanchu" @click="PJshanchu(idx)">删除</div>
        </el-form-item>
        <!-- </div> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="payStatus2 = false">取 消</el-button>
        <el-button type="success" @click="TJxiugai">提 交</el-button>
      </div>

      <el-dialog width="25%" title="添加特殊配件提成" :visible.sync="innerVisible" center append-to-body>
        <el-form :model="peijian">
          <el-form-item label="配件名" label-width="100px">
            <el-input v-model="peijian.name"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="success" @click="TJpeijian">添 加</el-button>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import {
  tuokepage,
  tuokestatus,
  tuokeupdatePercentage,
  tuokegetResult,
  tuokecarList,
  tuokedelete,
  tuokerecommended,
  tuokeinCome
} from "../../request/api.js";
import moment from "moment";
export default {
  name: "tuokeA",
  data() {
    return {
      search: {
        month: moment(new Date()).format("YYYY-MM")
      },
      tableData: [],
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
      tuokeSLlist: [],
      WXlist: [],
      datalist: {},
      tokerPercentageDTO: {},
      orderItemList: [],
      tableData2: [],
      id: "",
      garageName: "",
      customerId: "",
      payStatus: false,
      payStatus2: false,
      payStatus3: false,
      payStatus4: false,
      innerVisible: false,
      innerVisible2: false,
      innerVisible3: false,
      zonger: null,
      zonger2: null,
      heji: null,
      heji2: null,
      zong: null,
      zhekou: {}
    };
  },
  created() {
    this.getList();
  },
  mounted() {
    this.maxHeight = $(".tabBox").height() - 260 + "px";
  },
  methods: {
    //拓客收入

    tuokeSL(e) {
      this.customerId = e.customerId;
      this.garageName = e.garageName;
      this.gid = e.gid;
      this.tuokeSL2();
      this.payStatus3 = true;
    },
    tuokeSL2() {
      tuokecarList({ customerId: this.customerId }).then(res => {
        if (res.data.code == 200) {
          console.log(res.data);
          this.tuokeSLlist = res.data.data;
        }
      });
    },
    //删除拓客用户推荐用户
    SLshanchu(e) {
      console.log(e);
      let data = {
        carNo: e.carNo,
        customerId: e.customerId,
        garageName: this.garageName,
        gid: e.gid,
        name: e.name,
        phone: e.phone
      };
      console.log(data);
      let tishi = "确认删除该车辆？";
      this.$confirm(tishi, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        tuokedelete(data).then(res => {
          // console.log(res.data);
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.tuokeSL2();
            this.getList();
          } else {
            // this.$message.error(res.data.message);
          }
        });
      });
    },
    tuokexinzen() {
      let res = /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/;

      if (this.tuoke.carNo == "") {
        return this.$message.error("请输入车牌号");
      } else if (this.tuoke.name == "") {
        return this.$message.error("请输入姓名");
      } else if (this.tuoke.phone == "") {
        return this.$message.error("请输入手机号码");
      }
      var input = this.tuoke.carNo.toUpperCase(); //转大写
      if (res.test(input)) {
        let data = {
          carNo: this.tuoke.carNo,
          customerId: this.customerId,
          garageName: this.garageName,
          gid: this.gid,
          name: this.tuoke.name,
          phone: this.tuoke.phone
        };
        console.log(data);
        tuokerecommended(data).then(res => {
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: "新增成功!"
            });
          }
          this.tuokeSL2();
          this.getList();
          this.innerVisible2 = false;
        });
      } else {
        return this.$message.error("车牌格式有误");
      }
    },
    //新增拓客车辆
    tuokeXZ() {
      this.tuoke.carNo = "";
      this.tuoke.name == "";
      this.tuoke.phone == "";
      this.innerVisible2 = true;
    },
    //拓客车辆维修记录
    Tuokewx(e) {
      tuokeinCome({ customerId: e.customerId }).then(res => {
        if (res.data.code == 200) {
          console.log(res.data);
          this.WXlist = res.data.data;

          this.WXlist.forEach((itemd, index) => {
            var zonger = null;
            var zonger2 = null;
            var heji = null;
            var heji2 = null;
            console.log(itemd);
            var TCpeijian = itemd.tokerPercentageDTO;
            //工时提成
            var percentageTimeRate =
              itemd.tokerPercentageDTO.percentageTimeRate;
            //配件提成
            var percentagePartRate =
              itemd.tokerPercentageDTO.percentagePartRate;
            itemd.orderSettlementedDetailsVOS.orderItemList.forEach(
              (item, index) => {
                zonger += parseFloat(item.standPrice * item.counts);
                heji += parseFloat(
                  item.standPrice * item.counts * (percentageTimeRate / 100)
                );

                item.orderPartList.forEach((items, indexs) => {
                  TCpeijian.tokerPartPercentageDOS.forEach((i, indexs) => {
                    if (i.partName == items.partName) {
                      items.ticheng = i.percentage;
                    } else {
                      items.ticheng = TCpeijian.percentagePartRate;
                    }
                  });
                  zonger2 += parseFloat(items.price * items.counts);
                  heji2 += parseFloat(
                    items.price * items.counts * (items.ticheng / 100)
                  );
                });
              }
            );
            itemd.zong = heji2 * 1 + heji * 1;
          });
        }
        console.log(this.WXlist);
      });
      this.payStatus4 = true;
    },
    //维修拓客收入详情
    TuokeJl(row) {
      this.tableData2 = [];
      this.zonger = null;
      this.zonger2 = null;
      this.heji = null;
      this.heji2 = null;
      this.datalist = row;
      this.zhekou = row.orderSettlementedDetailsVOS;
      this.orderItemList = row.orderSettlementedDetailsVOS.orderItemList;
      this.tokerPercentageDTO = row.tokerPercentageDTO;
      var TCpeijian = row.tokerPercentageDTO;
      //工时提成
      var percentageTimeRate = row.tokerPercentageDTO.percentageTimeRate;
      //配件提成
      var percentagePartRate = row.tokerPercentageDTO.percentagePartRate;

      this.orderItemList.forEach((item, index) => {
        // this.zongshou += parseInt(item.standPrice);
        this.zonger += parseFloat(item.standPrice * item.counts);
        this.heji += parseFloat(
          item.standPrice * item.counts * (percentageTimeRate / 100)
        );
        item.orderPartList.forEach((items, indexs) => {
          TCpeijian.tokerPartPercentageDOS.forEach((i, indexs) => {
            if (i.partName == items.partName) {
              items.ticheng = i.percentage;
            } else {
              items.ticheng = TCpeijian.percentagePartRate;
            }
          });
          this.tableData2.push(items);
          this.zonger2 += parseFloat(items.price * items.counts);
          this.heji2 += parseFloat(
            items.price * items.counts * (items.ticheng / 100)
          );
        });
      });
      this.zong = this.heji2 * 1 + this.heji * 1;

        if (this.orderItemList.length > this.tableData2.length) {
          var num2 = this.orderItemList.length - this.tableData2.length;
          for (var i = 0; i < num2; i++) {
            var c = {
              price: "zz"
            };
            this.tableData2.push(c);
          }
          console.log(this.tableData2);
        } else {
          var num = this.tableData2.length - this.orderItemList.length;
          for (var i = 0; i < num; i++) {
            var c = {
              standPrice: "zz",
            };
            this.orderItemList.push(c);
          }
        }


      console.log(this.tableData2);
      this.innerVisible3 = true;
    },
    Xiugai(e) {
      console.log(e);
      this.editForm.percentagePartRate = "";
      this.editForm.percentageTimeRate = "";
      this.listPJ = [];
      this.editForm.customerId = e.customerId;
      this.gid = e.gid;
      this.id = e.id;

      tuokegetResult({ gid: e.gid, tokerId: e.id }).then(res => {
        if (res.data.code == 200) {
          var data = res.data.data;
          this.editForm = {
            customerId: data.customerId,
            percentagePartRate: data.percentagePartRate,
            percentageTimeRate: data.percentageTimeRate
          };
          this.listPJ = data.tokerPartPercentageDOS;
          // console.log(res.data.data);
          // this.$message({
          //   type: "success",
          //   message: "提交成功!"
          // });
        }
      });

      this.payStatus2 = true;
    },
    editRow(e) {
      console.log(e);
      this.shenhe = {
        id: e.id,
        status: e.status
      };
      this.payStatus = true;
    },
    // 提交配件提成
    TJxiugai() {
      let data = {
        customerId: this.editForm.customerId,
        percentagePartRate: this.editForm.percentagePartRate,
        percentageTimeRate: this.editForm.percentageTimeRate,
        tokerPartPercentageDOS: this.listPJ
      };
      tuokeupdatePercentage(data).then(res => {
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: "提交成功!"
          });
        }
        this.payStatus2 = false;
      });
      console.log(data);
    },
    // 提交审核状态
    TjStatus() {
      // let data = {
      //   id: this.id,
      //   status: this.radio
      // };
      console.log(this.shenhe);
      tuokestatus(this.shenhe).then(res => {
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: "提交成功!"
          });
        }
        this.getList();
        this.payStatus = false;
      });
    },
    //添加配件
    TJpeijian() {
      console.log(this.peijian.name);
      if (this.peijian.name == "") {
        this.$message.error("请输入配件名称");
        return;
      }
      let data = {
        partName: this.peijian.name,
        percentage: "",
        gid: this.gid,
        tokerId: this.id
      };
      this.listPJ.push(data);
      this.innerVisible = false;
      this.peijian.name = "";
    },
    //删除配件
    PJshanchu(idx) {
      this.listPJ.splice(idx, 1);
    },
    handleCurrentChange(val) {
      this.page = val - 1;
      this.getList();
    },
    getList() {
      let data = {
        phone: this.search.phone,
        name: this.search.name,
        page: this.page,
        size: this.size
      };
      tuokepage(data).then(res => {
        console.log(res.data.data);
        this.tableData = res.data.data;
        this.pageLength = res.data.pageInfo.total;
      });
    }
  }
};
</script>
<style scoped>
.navActive em:hover {
  color: #3ac29f;
  transition: 0.5s;
}
.el-input-group {
  width: 60%;
}
.el-form-item {
  margin-bottom: 10px;
}
.navActive em.active {
  color: #3ac29f;
}
.shenhe {
  width: 100%;
  display: block;
  text-align: center;
  margin: auto;
  padding: 8px;
}
.tianjia {
  float: right;
  border: 1px solid #dcdfe6;
  width: 40px;
  height: 25px;
  line-height: 25px;
  margin-top: 7px;
  text-align: center;
  font-size: 13px;
  cursor: pointer;
}
.xiu {
  display: inline-block;
  text-decoration: underline;
  margin-left: 10px;
  cursor: pointer;
  overflow: hidden;
}
.yic {
  /* width: 300px; */
  display: inline-block;
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.weixiu {
  display: inline-block;
}
.el-col {
  max-height: 50px;
}
.feng {
  overflow: hidden;
  width: 100%;
  margin-top: 20px;
  border-bottom: 5px solid #ebeef5;
}
.feng2 {
  overflow: hidden;
  width: 100%;
}
.xianmu {
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #ebeef5;
}
.shanchu {
  float: right;
  cursor: pointer;
  color: #ff6757;
  /* display: inline-block; */
}
.shu {
  float: left;
  height: 30px;
  margin-top: 10px;
  width: 5px;
  background: #4fc08d;
}
.name {
  margin-left: 10px;
  float: left;
}
</style>