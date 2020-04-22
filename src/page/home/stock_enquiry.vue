<template>
  <div class="w-100 order flex-col">
    <!-- <div>niasdasd</div> -->
    <div class="p-15" style="background:rgba(229,246,247,1);">
      <el-row :gutter="10">
        <el-form :inline="true" class="demo-form-inline">
          <el-col>
            <el-form-item label="日期" class="m-b-0">
              <el-date-picker
                v-model="search.time"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                unlink-panels
                :picker-options="pickerOptions"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="车牌" class="m-b-0">
              <el-input v-model="search.text1" placeholder="车牌号" style="width: 160px;"></el-input>
            </el-form-item>
            <el-form-item label="订单号" class="m-b-0">
              <el-input v-model="search.text2" placeholder="订单号" style="width: 160px;"></el-input>
            </el-form-item>
            <el-button type="success" icon="el-icon-search" @click="init()">查找</el-button>
           
            <el-form-item label class="m-b-0 right m-r-20">
              <div class="left c-p c-9">
                <el-button type="success" icon="el-icon-refresh-right" @click="init()">刷新</el-button>
              </div>
            </el-form-item>
 <!-- <el-form-item label class="m-b-0 right" style="cursor: pointer;margin-right: 40px; ">
              <img class="mis" src="../../assets/tuihuo.png" alt />
              <span class="mis2" @click="tuihuanhuo">退货暂缓区</span>
            </el-form-item> -->

          </el-col>
        </el-form>
      </el-row>
    </div>

    <!-- 内层供应商弹窗 -->
    <!-- <el-dialog width="35%" center title="选择发车配件" :visible.sync="centerDialogVisible" append-to-body>
      <div class="outbox">
        <div class="lines2" v-for="(items,idx) in supplierlist" :key="'supp'+idx">
          <div class="outlis">
            <div class="chengde2">{{items.partName}}</div>
            <div class="shushu">x{{items.quantity}}</div>
            <div class="phin">
              <el-checkbox-group
                class="right"
                style="margin-left: 5px;"
                :min="1"
                :max="3"
                v-model="items.checked"
              >
                <el-checkbox @change="check(items)"></el-checkbox>
              </el-checkbox-group>
              <span class="right">{{items.type == 1?"退货":"换货"}}</span>
            </div>
          </div>
          <div class="outlis_a">
            <div class="chengde">车牌：{{items.carNo}}</div>
            <div class="wode" style="margin-bottom: 0px">供应商：{{items.supplierName}}</div>
          </div>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button type="success" style="width:200px" @click="Clickinquiry">发 车</el-button>
      </div>
      <el-dialog width="30%" title="请填写备注信息" :visible.sync="innerVisible" append-to-body>
        <el-input type="textarea" v-model="beizhu" style="height:50px"></el-input>
        <div slot="footer" class="dialog-footer">
          <el-button type="success" style="width:200px" @click="Clickinquiry2">发 车</el-button>
        </div>
      </el-dialog>
    </el-dialog> -->

    <div style="width:100%;padding-top:15px;" class="orderTable" id="printBox">
      <el-table :data="tableData" :height="500" style="width: 100%">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="billNumber" label="单号" width="160"></el-table-column>
        <el-table-column prop="carNo" label="车牌号"></el-table-column>
        <el-table-column prop="carModel" label="车型"></el-table-column>
        <el-table-column prop="partCount" label="配件数量"></el-table-column>
        <el-table-column prop="totalAmount" label="金额"></el-table-column>
        <el-table-column prop="supplierName" label="供应商名称" width="120">
          <!-- <template slot-scope="scope">
            <div
              v-if="scope.row.promoterType != null"
            >{{scope.row.promoterType === 1 ? scope.row.garageName : scope.row.supplierName}}</div>
          </template>-->
        </el-table-column>
        <el-table-column prop="supplierPhone" label="电话" width="110"></el-table-column>
        <el-table-column prop="createdDate" label="下单时间" width="110"></el-table-column>
        <el-table-column prop="paymentStatus" label="状态">
          <template slot-scope="scope">
            <font v-if="scope.row.status == 0">未发货</font>
            <font v-if="scope.row.status == 4" color="red">{{status_name[scope.row.status - 1]}}</font>
            <font v-else>{{status_name[scope.row.status - 1]}}</font>
          </template>
          <!-- <template slot-scope="scope">
            <div
              v-if="scope.row.updaterType != null"
            >{{scope.row.updaterType === 1 ? scope.row.garageName : scope.row.supplierName}}</div>
          </template>-->
        </el-table-column>
        <el-table-column prop="sendTime" label="发货时间">
          <!-- <template slot-scope="scope">
            <div v-if="scope.row.status == 2">{{scope.row.garageName}}</div>
          </template>-->
        </el-table-column>
        <el-table-column prop="logisticsName" label="承运商" width="110"></el-table-column>
        <el-table-column prop="logisticsNumber" label="运单号" width="160"></el-table-column>
        <el-table-column prop="employeeName" label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              v-if="scope.row.status == 3"
              @click="editRow(scope.row)"
            >退换货</el-button>
            <el-button
              v-if="scope.row.status == 2"
              size="mini"
              type="success"
              @click="confirmRow(scope.row)"
            >确认收货</el-button>
            <el-button
              size="mini"
              v-if="scope.row.status == 0"
              type="danger"
              @click="cancelRow(scope.row)"
            >取消订单</el-button>
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
    <el-dialog :title="title" :visible.sync="editFormStatus" width="70%" center :modal="false">
      <el-form :inline="true" class="demo-form-inline">
        <el-row>
          <el-col>
            <ul class="left orderUl" style="width:80%;">
              <li
                :class="index==orderNavActive?'active':''"
                v-for="(item,index) in dispose"
                :key="index"
                @click="orderTab(index)"
              >{{item}}</li>
            </ul>
          </el-col>
        </el-row>
      </el-form>
      <div style="width:100%;padding-top:15px;" class="orderTable" id="printBox">
        <el-table :data="editForm" style="width: 100%">
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column property="partName" label="配件名称"></el-table-column>
          <el-table-column property="modal" label="规格型号"></el-table-column>
          <el-table-column property="partCount" label="购入数量"></el-table-column>
          <el-table-column property="returnQuantity" label="申请数量">
            <template scope="scope">
              <!-- <div class="btn" @click="btnMinute(scope.row)" >-</div>  
                <div class="btn">{{count}}</div>
              <div class="btn" @click="btnAdd(scope.row)">+</div>-->
              <span
                v-if="scope.row.statusDesc == '在厂'"
                style="color:red;font-size:16px"
                @click.prevent="delRow(scope.row,scope.$index)"
              >
                <i class="el-icon-minus"></i>
              </span>
              <span class="number">{{scope.row.returnCount?scope.row.returnCount:scope.row.number}}</span>
              <span
                v-if="scope.row.statusDesc == '在厂'"
                style="color:#409EFF;font-size:16px"
                @click.prevent="addRow(scope.row,scope.$index)"
              >
                <i class="el-icon-plus"></i>
              </span>
            </template>
          </el-table-column>
          <el-table-column property="statusDesc" label="状态"></el-table-column>
          <el-table-column property="remark" label="备注"></el-table-column>
          <el-table-column prop="remark" label="操作" width="180" align="center">
            <template slot-scope="scope">
              <!-- <el-button size="mini" @click="editPartDig(scope.row)">编辑</el-button> -->
              <el-button
                v-if="scope.row.status == -1"
                size="mini"
                @click="editPartDig(scope.row,1)"
              >待退货</el-button>
              <el-button
                v-if="scope.row.status == -1"
                size="mini"
                @click="editPartDig(scope.row,2)"
              >待换货</el-button>
              <el-button
                v-if="scope.row.status == 0 || scope.row.status == 1"
                size="mini"
                @click="cancellation(scope.row)"
              >取消</el-button>
              <el-button
                v-if="scope.row.status == 3 || scope.row.status == 5"
                size="mini"
                @click="confirmReceipt(scope.row)"
              >确认收货</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  purOrderList,
  receiveGoods,
  cancelAccessories,
  afterSaleReceive,
  afterSalePartList,
  afterSaleCancel,
  afterSaleRequest,
  afterSaleList,
  afterSaleDeliver
} from "../../request/api.js";
import moment from "moment";
export default {
  name: "formG",
  data() {
    return {
      status_name: ["部分发货", "已发货", "已收货", "已取消"],
      dispose: ["预处理", "处理中"],
      orderNavActive: 0,
      centerDialogVisible: false,
      gid: localStorage.getItem("gid"),
      type: 1, //退换货状态1
      askPriceId: "", //退换货id
      title: "",
      search: {
        time: [
          // moment().subtract(29, 'days'), moment()
          moment()
            .subtract(30, "days")
            .format("YYYY-MM-DD"),
          moment(new Date()).format("YYYY-MM-DD")
        ]
      },
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.selectDate = minDate.getTime();
          if (maxDate) {
            this.selectDate = "";
          }
        },
        disabledDate: time => {
          if (this.selectDate !== "") {
            const one = 30 * 24 * 3600 * 1000;
            const minTime = this.selectDate - one;
            const maxTime = this.selectDate + one;
            return time.getTime() < minTime || time.getTime() > maxTime;
          }
        },
        shortcuts: [
          {
            text: "今日",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "本月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(
                start.getTime() -
                  3600 *
                    1000 *
                    24 *
                    (Number(moment(new Date()).format("D")) - 1)
              );
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      tableData: [],

      maxHeight: undefined,
      pageLength: null,
      size: 10,
      page: 0,
      orderList: [],
      busPartList: [],
      statisticStatus: false,
      editFormStatus: false,
      editForm: [],
      supplierlist: [],
      storeStatus: false,
      storeList: [],
      partStatus: false,
      innerVisible: false,
      beizhu: ""
    };
  },
  created() {
    this.init();
  },
  mounted() {
    this.maxHeight = $(".tabBox").height() - 235 + "px";
  },
  methods: {
    //发车
    // Clickinquiry() {
     
    //   var data = []
    //   for (var i in this.supplierlist) {
    //     if (this.supplierlist[i].checked == true) {
    //       data.push(this.supplierlist[i].id);
    //     }
    //   }
    //   if(data.length<1){
    //       this.$message.error('请选择发车配件'); return;
    //   }
    //    this.innerVisible = true;
    // },
    // Clickinquiry2() {
    //   let data = {
    //     afterSaleIds: [],
    //     gid: this.gid,
    //     remark:this.beizhu
    //   };
    //   for (var i in this.supplierlist) {
    //     if (this.supplierlist[i].checked == true) {
    //       data.afterSaleIds.push(this.supplierlist[i].id);
    //     }
    //   }
    //   console.log(data);

    //     afterSaleDeliver(data).then(res => {
    //       if (res.data.code == 200) {
    //         this.$message({
    //           type: "success",
    //           message: "发车成功!"
    //         });
    //         this.beizhu = '';
    //         this.centerDialogVisible= false;
    //           this.innerVisible = false;
    //       }
    //     });

    // },
    //退换货
    // tuihuanhuo() {
    //   afterSaleList({ status: 1 }).then(res => {
    //     this.supplierlist = res.data.data;
    //     this.supplierlist.map((c, i) => {
    //       this.$set(c, "checked", false);
    //     });
    //     console.log(res.data.data);
    //   });
    //   this.centerDialogVisible = true;
    // },
    //点击切换退还货
    orderTab(i) {
      this.type = i + 1;
      this.orderNavActive = i;
      console.log(this.type);
      afterSalePartList({ askPriceId: this.askPriceId, type: this.type }).then(
        res => {
          console.log(res.data.data);
          this.editForm = res.data.data;
          this.editForm.map((v, i) => {
            this.$set(v, "number", 1);
          });
        }
      );
    },
    init2() {
      afterSalePartList({ askPriceId: this.askPriceId, type: this.type }).then(
        res => {
          console.log(res.data.data);
          this.editForm = res.data.data;
          this.editForm.map((v, i) => {
            this.$set(v, "number", 1);
          });
        }
      );
    },
    // 加数量
    addRow(row) {
      console.log(row);
      if (row.number >= row.partCount) {
      } else {
        row.number = row.number + 1;
      }
    },
    //减数量
    delRow(row) {
      console.log(row);
      if (row.number != 1) {
        row.number = row.number - 1;
      }
    },
    //确认收货配件
    confirmReceipt(row) {
      // console.log(row)
      let tishi = "订单" + row.partName + "确认收货？";
      this.$confirm(tishi, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        afterSaleReceive({ afterSaleId: row.afterSaleId }).then(res => {
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: "确认收货成功!"
            });
            this.init2();
          }
        });
      });
    },
    //取消待换货 待退货
    cancellation(row) {
      console.log(row);
      let data = {
        afterSaleId: row.afterSaleId,
        status: row.status
      };
      let tishi = "确认取消订单配件 " + row.partName + " 吗？";
      this.$confirm(tishi, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        afterSaleCancel(data).then(res => {
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: "取消成功!"
            });
            this.init2();
          }
        });
      });
    },
    handleCurrentChange(val) {
      this.page = val - 1;
      this.init();
    },
    init() {
      if (this.search.time) {
        this.search.time.forEach((i, index) => {
          this.search.time[index] = moment(i).format("YYYY-MM-DD");
        });
      } else {
        this.$message({
          message: "请选择查询日期！",
          type: "warning"
        });
        return false;
      }
      const data = {
        pageNumber: this.page,
        pageSize: this.size,
        carNo: this.search.text1, //车牌号
        billNumber: this.search.text2, //订单号
        endTime: this.search.time[1],
        starTime: this.search.time[0]
        // oid: localStorage.getItem("oid"),
        // type: 1
      };
      purOrderList(data).then(res => {
        console.log(res.data.data);
        this.tableData = res.data.data.content;
        this.pageLength = res.data.data.numberOfElements;
      });
    },
    //退换货
    editRow(row) {
      this.title = row.carNo + " 退换/售后";
      this.askPriceId = row.askPriceId;
      afterSalePartList({ askPriceId: this.askPriceId, type: this.type }).then(
        res => {
          console.log(res.data.data);
          this.editForm = res.data.data;
          this.editForm.map((v, i) => {
            this.$set(v, "number", 1);
          });
        }
      );

      this.editFormStatus = true;
    },
    //确认收货
    confirmRow(row) {
      // console.log(row)
      let tishi = "订单" + row.billNumber + "确认收货？";
      this.$confirm(tishi, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        receiveGoods({ askPricePartId: row.askPriceId }).then(res => {
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: "确认收货成功!"
            });
            this.init();
          }
        });
      });
    },
    cancelRow(row) {
      let tishi = "确认取消订单" + row.billNumber + "吗？";
      this.$confirm(tishi, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        cancelAccessories({ id: row.askPriceId }).then(res => {
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: "取消成功!"
            });
            this.init();
          }
        });
      });
    },
    //退换货
    editPartDig(row, type) {
      console.log(row);
      let data = {
        askPricePartId: row.askPricePartId,
        partId: row.partId,
        quantity: row.number,
        type: type
      };
      console.log(data);
      let tishi = "订单" + row.partName + "确认退/换货？";
      this.$confirm(tishi, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        afterSaleRequest(data).then(res => {
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: "退/换货成功!"
            });
            this.init2();
          }
        });
      });
    }
  }
};
</script>
<style scoped>
.btn {
  display: inline-block;
}
.number {
  padding: 0 5px;
}

.mis {
  height: 35px;
  width: 35px;
  vertical-align: middle;
}
.mis2 {
  vertical-align: middle;
  margin-left: 3px;
}
.miaa {
  margin-right: 50px;
  cursor: pointer;
  font-size: 16px;
}
.orderUl li {
  float: left;
  padding: 1px 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
  transition: 0.5s;
  font-size: 16px;
}
.orderUl li:hover {
  background: rgba(0, 0, 0, 0.1);
  transition: 0.5s;
}

.orderUl li.active {
  background: #3ac29f;
  color: #fff;
}
.navActive em:hover {
  color: #3ac29f;
  transition: 0.5s;
}

.navActive em.active {
  color: #3ac29f;
}
.lines2 {
  border-bottom: 1px solid #ebeef5;
  height: 60px;
  line-height: 50px;
}
.outlis {
  overflow: hidden;
  height: 34px;
  line-height: 34px;
  padding-top: 3px;
}
.outlis div {
  display: inline-block;
  line-height: 30px;
  overflow: hidden;
  
}
.outlis_a {
  height: 20px;
  line-height: 20px;
  color: #999;
}
.chengde {
  height: 20px;
  float: left;
  font-size: 12px;
  padding-left: 10px;
}
.wode {
  float: right;
  font-size: 12px;
}
.chengde2 {
  width: 32%;
  border-left: 5px solid #74a496;
  padding-left: 5px;
}
.shushu {
  width: 32%;
  text-align: center;
}
.phin {
  width: 32%;
  float: right;
}
</style>
