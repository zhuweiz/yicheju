<template>
  <div class="w-100 order flex-col">
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
          </el-col>
        </el-form>
      </el-row>
    </div>
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
          <el-table-column property label="规格型号"></el-table-column>
          <el-table-column property="partCount" label="购入数量"></el-table-column>
          <el-table-column property="fitCar" label="申请数量">
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
              <span class="number">{{scope.row.number}}</span>
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
          <el-table-column property="price" label="备注"></el-table-column>
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
  afterSaleRequest
} from "../../request/api.js";
import moment from "moment";
export default {
  name: "formG",
  data() {
    return {
      status_name: ["部分发货", "已发货", "已收货", "已取消"],
      dispose: ["预处理", "处理中"],
      orderNavActive: 0,
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
      storeStatus: false,
      storeList: [],
      partStatus: false
    };
  },
  created() {
    this.init();
  },
  mounted() {
    this.maxHeight = $(".tabBox").height() - 235 + "px";
  },
  methods: {
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

    editPartDig(row, type) {
      console.log(type);
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
</style>
