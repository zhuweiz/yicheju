<template>
  <div class="w-100 orderTable" style="padding-left: 30px;">
    <div class="p-tb-30">
      <h2
        class="left f-18"
        style="width: 150px;color: #0D906E;padding-top: 3px;font-weight: normal;"
      >| 服务记录列表</h2>
      <ul class="left orderUl" style="width: 550px;padding-top: 5px;">
        <li
          :class="index==orderNavActive?'active':''"
          v-for="(item,index) in orderList"
          :key="index"
          @click="orderTab(index)"
        >{{item}}</li>
      </ul>
      <div class="right m-r-20">
        <div
          class="left c-p c-9"
          @click="getExcel"
          style="width: 139px; height: 42px;line-height: 42px;background: url(../../../static/img/but1.png) no-repeat;background-size: 100% 100%;text-indent: 45px;"
        >导出EXCEL</div>
        <!-- <div class="left c-p c-9" @click="printDeal" style="width: 106px; height: 42px;line-height: 42px;background: url(../../../static/img/but2.png) no-repeat;background-size: 100% 100%;text-indent: 50px;">打印</div> -->
      </div>
      <div class="clear"></div>
    </div>
    <div class="p-20" style="background:rgba(229,246,247,1);">
      <el-row :gutter="10">
        <el-form :inline="true" class="demo-form-inline">
          <el-col>
            <el-form-item label="车牌" class="m-b-0">
              <el-input v-model="search.text1" placeholder="车牌/品牌" style="width: 160px;"></el-input>
            </el-form-item>
            <el-form-item label="姓名" class="m-b-0">
              <el-input v-model="search.text2" placeholder="姓名/单位" style="width: 160px;"></el-input>
            </el-form-item>
            <el-form-item label="手机" class="m-b-0">
              <el-input v-model="search.text3" placeholder="手机号/客户来源" style="width: 160px;"></el-input>
            </el-form-item>
            <el-form-item label="进店日期" class="m-b-0" v-if="orderNavActive == 5">
              <el-date-picker
                v-model="search.time"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                unlink-panels
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="结算日期" class="m-b-0" v-if="orderNavActive == 5">
              <el-date-picker
                v-model="search.times"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                unlink-panels
              ></el-date-picker>
            </el-form-item>
            <el-button type="success" icon="el-icon-search" @click="searchList()">查找</el-button>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <el-table
      :data="tableData"
      :max-height="maxHeight"
      style="width: 100%"
      ref="lists"
      id="printBox"
    >
      <el-table-column prop="date" label="编号" width="180">
        <template slot-scope="scope">{{scope.row.billNumber}}</template>
      </el-table-column>
      <el-table-column prop="name" label="车牌" width="180">
        <template slot-scope="scope">{{scope.row.carNo}}</template>
      </el-table-column>
      <el-table-column label="车型">
        <template slot-scope="scope">{{scope.row.carBrand}}</template>
      </el-table-column>
      <el-table-column label="车主">
        <template slot-scope="scope">{{scope.row.ownerName}}</template>
      </el-table-column>
      <el-table-column width="120px" label="电话">
        <template slot-scope="scope">{{scope.row.phone}}</template>
      </el-table-column>
      <el-table-column label="接车时间" width="110px">
        <template slot-scope="scope">{{scope.row.createdDate}}</template>
      </el-table-column>
      <el-table-column label="服务项目">
        <template slot-scope="scope">
          <span
            v-if="scope.row.orderItemList && scope.row.orderItemList.length >= 2 && scope.row.shows == 0"
            @click="showMore(scope.$index)"
          >{{scope.row.orderItemList[0].itemName}}...</span>
          <span
            v-if="scope.row.orderItemList && scope.row.orderItemList.length < 2 && scope.row.shows == 0"
            @click="showMore(scope.$index)"
          >{{scope.row.orderItemList[0].itemName}}</span>
          <!-- {{scope.row.orderItemList}} -->
          <div v-if="scope.row.shows == 1">
            <p v-for="(item,indexs) in scope.row.orderItemList" :key="indexs">{{item.itemName}}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="接车员">
        <template slot-scope="scope">{{scope.row.clerkOrder}}</template>
      </el-table-column>
      <el-table-column label="应收金额">
        <template slot-scope="scope">{{scope.row.amountReceivable}}</template>
      </el-table-column>
      <el-table-column label="实收金额">
        <template slot-scope="scope">
          <font
            color="red"
            v-if="scope.row.amountActual && scope.row.amountActual < scope.row.amountReceivable"
          >{{scope.row.amountActual}}</font>
          <font v-else>{{scope.row.amountActual}}</font>
        </template>
      </el-table-column>
      <el-table-column label="目前状态">
        <template slot-scope="scope">
          <em v-if="scope.row.status === 1">报价</em>
          <em v-if="scope.row.status === 2">施工</em>
          <em v-if="scope.row.status === 3">施工完成</em>
          <em v-if="scope.row.status === 4">质检</em>
          <em v-if="scope.row.status === 5">质检完成</em>
          <em v-if="scope.row.status === 6">出厂</em>
        </template>
      </el-table-column>
      <el-table-column label="业务员">
        <template slot-scope="scope">{{scope.row.sellsMan}}</template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button size="mini" plain @click="toOrderX(scope.row)">查看</el-button>
          <el-button
            v-if="scope.row.settlementStatus == 1"
            type="success"
            size="mini"
            @click="rollbackSettlement(scope.row)"
          >反结算</el-button>
          <el-button
            v-if="scope.row.settlementStatus != 1"
            type="danger"
            size="mini"
            @click="pay(scope.row)"
          >结算</el-button>
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

    <el-dialog :title="payForm.carNo" :visible.sync="payVisible" center width="40%" :modal="false">
      <el-form :model="payForm">
        <el-row :gutter="20" style="border-bottom:1px solid #ccc;padding:10px 0px;">
          <el-col :span="7">客户名称：{{detailForm.ownerName}}</el-col>
          <el-col :span="7">电话：{{detailForm.phone}}</el-col>
          <el-col :span="7">
            <div style="float:left;">会员等级：</div>
            <el-rate v-model="detailForm.star" disabled></el-rate>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="border-bottom:1px solid #ccc;padding:10px 0px;">
          <el-col :span="3">备注：{{detailForm.remark}}</el-col>
          <el-col :span="21"></el-col>
        </el-row>
        <el-row
          :gutter="20"
          style="border-bottom:1px solid #ccc;padding:10px 0px;border-left:5px solid #0d906e;margin-top:10px;"
        >
          <el-col :span="24">
            项目：折扣（{{payForm.discountItemRate}}） ￥{{payForm.actualItemAmount}}
            <del>￥{{payForm.receivableItemAmount}}</del>
          </el-col>
        </el-row>
        <el-row
          :gutter="20"
          style="border-bottom:1px solid #ccc;padding:10px 0px;border-left:5px solid #0d906e;margin-top:10px;"
        >
          <el-col :span="22">
            配件：折扣（{{payForm.discountPartRate}}） ￥{{payForm.actualPartAmount}}
            <del>￥{{payForm.receivablePartAmount}}</del>
          </el-col>
          <el-col :span="2">
            <el-button type="success" size="mini" @click="discountDialog">减免</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="border-bottom:1px solid #ccc;padding:10px 0px;">
          <el-col :span="7">应收：￥{{payForm.amountReceivable}}</el-col>
          <el-col :span="7">
            优惠：
            <font color="red">￥{{payForm.discountPrice}}</font>
          </el-col>
          <el-col :span="7">
            实收：
            <font color="red">￥{{payForm.amountActual}}</font>
          </el-col>
        </el-row>
        <el-row
          :gutter="20"
          style="border-bottom:1px solid #ccc;padding:10px 0px;border-left:5px solid #0d906e;margin-top:20px;"
        >
          <el-col :span="7">支付方式</el-col>
          <el-col :span="7">差额：￥{{payForm.difference}}</el-col>
          <el-col :span="7">
            <el-button type="info" size="mini" plain @click="paymentDialog">请选择 ></el-button>
          </el-col>
        </el-row>
        <el-row
          :gutter="20"
          style="border-bottom:1px solid #ccc;padding:10px 0px;"
          v-for="item in payForm.payTypeList"
          :key="item.type"
        >
          <el-col :span="12">{{item.name}}</el-col>
          <el-col :span="12">
            <el-input v-model="item.amount" @change="changeAmount">
              <template slot="append">元</template>
            </el-input>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="payVisible = false">取 消</el-button>
        <el-button type="danger" @click="paySubmit">结 算</el-button>
      </div>
    </el-dialog>

    <el-dialog title="折扣设置" :visible.sync="discountVisible" center width="30%" :modal="false">
      <el-form :model="payForm">
        <el-form-item label="工时折扣" label-width="100px">
          <el-input
            v-model="payForm.discountItemRate"
            placeholder="如：9折请输入0.9"
            @change="discountCalc"
          >
            <template slot="append">折</template>
          </el-input>
        </el-form-item>
        <el-form-item label="配件折扣" label-width="100px">
          <el-input
            v-model="payForm.discountPartRate"
            placeholder="如：9折请输入0.9"
            @change="discountCalc"
          >
            <template slot="append">折</template>
          </el-input>
        </el-form-item>
        <el-form-item label="实收" label-width="100px">
          <el-input v-model="payForm.amountActual" @change="allCalc(1)">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="减免" label-width="100px">
          <el-input v-model="payForm.discountPrice" @change="allCalc(2)">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="理由" label-width="100px">
          <el-input v-model="payForm.discountReason" @change="discountCalc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="discountVisible = false">取 消</el-button>
        <el-button type="success" @click="discountVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="请选择" :visible.sync="paymentVisible" center width="30%" :modal="false">
      <el-table
        ref="multipleTable"
        :data="paymentData"
        tooltip-effect="dark"
        :show-header="false"
        style="width: 100%"
        @selection-change="selectPayment"
      >
        <el-table-column prop="name" label></el-table-column>
        <el-table-column type="selection" width="50"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="paymentVisible = false">取 消</el-button>
        <el-button type="success" @click="paymentVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getOrderList,
  getOrderList2,
  excel,
  getOrderListX,
  settlement,
  rollbackSettlement,
  getGrade
} from "../../request/api.js";
import moment from "moment";
export default {
  name: "order",
  data() {
    return {
      tableData: [],
      orderList: ["在厂全部", "报价", "施工", "质检", "出厂", "历史"],
      orderNavActive: 0,
      value1: "",
      maxHeight: undefined,
      search: {
        time: [],
        times: [],
        text1: "",
        text2: "",
        text3: ""
      },
      pageLength: null,
      size: 10,
      page: 0,
      title: "蒙B99999",
      payVisible: false,
      payForm: {},
      discountVisible: false,
      discountForm: {},
      paymentVisible: false,
      paymentData: [
        { type: 0, name: "现金" },
        { type: 1, name: "支付宝" },
        { type: 2, name: "微信" },
        { type: 3, name: "银行卡" },
        { type: 4, name: "支票" },
        { type: 5, name: "挂帐" }
      ],
      detailForm: {}
    };
  },
  created() {
    this.getOrderListInit();
  },
  mounted() {
    this.maxHeight = $(".tabBox").height() - 230;
  },
  methods: {
    getOrderListInit() {
      let nowTime = moment(new Date()).format("YYYY-MM-DD");
      const data = {
        endDate: this.search.time ? this.search.time[1] : '',
				startDate: this.search.time ? this.search.time[0] : '',
				leaveStartDate: this.search.times ? this.search.times[0] : '',
				leaveEndDate: this.search.times ? this.search.times[1] : '',
        carNo: this.search.text1,
        ownerName: this.search.text2,
        phone: this.search.text3,
        page: this.page,
        size: this.size,
        status: this.orderNavActive
      };
      this.getOrderList2(data);
    },
    handleCurrentChange(val) {
      this.page = val - 1;
      const data = {
        endDate: this.search.time ? this.search.time[1] : '',
				startDate: this.search.time ? this.search.time[0] : '',
				leaveStartDate: this.search.times ? this.search.times[0] : '',
				leaveEndDate: this.search.times ? this.search.times[1] : '',
        carNo: this.search.text1,
        ownerName: this.search.text2,
        phone: this.search.text3,
        page: this.page,
        size: this.size,
        status: this.orderNavActive
      };
      if (data.status === 4) {
        data.status = 6;
      }
      if (data.status === 3) {
        data.status = 4;
      }
      if (data.status === 5) {
        data.status = -1;
      }
      this.getOrderList2(data);
    },
    orderTab(i) {
      let nowTime = moment(new Date()).format("YYYY-MM-DD");
      this.orderNavActive = i;

      if (this.search.time) {
        this.search.time.forEach((i, index) => {
          this.search.time[index] = moment(i).format("YYYY-MM-DD");
				});
			}
			if (this.search.times) {
				this.search.times.forEach((i, index) => {
          this.search.times[index] = moment(i).format("YYYY-MM-DD");
				});
			}

        const data = {
          endDate: this.search.time ? this.search.time[1] : '',
					startDate: this.search.time ? this.search.time[0] : '',
					leaveStartDate: this.search.times ? this.search.times[0] : '',
					leaveEndDate: this.search.times ? this.search.times[1] : '',
          carNo: this.search.text1,
          ownerName: this.search.text2,
          phone: this.search.text3,
          page: this.page,
          size: this.size,
          status: this.orderNavActive
        };
        if (data.status === 4) {
          data.status = 6;
        }
        if (data.status === 3) {
          data.status = 4;
        }
        if (data.status === 5) {
          data.status = -1;
        }
        this.getOrderList2(data);
    
    },
    toOrderX(item) {
      localStorage.setItem("oid", item.oid);
      this.$router.push({
        path: "../home/orderX"
      });
    },
    getOrderList2(data) {
      getOrderList2(data).then(res => {
        this.pageLength = res.data.data.totalElements;
        this.tableData = res.data.data.content.map(v => {
          v.createdDate = moment(v.createdDate).format("YYYY-MM-DD");
          v.shows = 0;
          return v;
        });
      });
    },
    searchList() {
      if (this.search.time) {
        this.search.time.forEach((i, index) => {
          this.search.time[index] = moment(i).format("YYYY-MM-DD");
				});
			}
			if (this.search.times) {
				this.search.times.forEach((i, index) => {
          this.search.times[index] = moment(i).format("YYYY-MM-DD");
        });
      }

      const data = {
        endDate: this.search.time ? this.search.time[1] : '',
				startDate: this.search.time ? this.search.time[0] : '',
				leaveStartDate: this.search.times ? this.search.times[0] : '',
				leaveEndDate: this.search.times ? this.search.times[1] : '',
        carNo: this.search.text1,
        ownerName: this.search.text2,
        phone: this.search.text3,
        page: this.page,
        size: this.size,
        status: this.orderNavActive
      };
      if (data.status === 4) {
        data.status = 6;
      }
      if (data.status === 3) {
        data.status = 4;
      }
      if (data.status === 5) {
        data.status = -1;
      }
      this.getOrderList2(data);
    },

    printDeal() {
      var printBox = document.getElementById("printBox");
      var newContent = printBox.innerHTML;
      var oldContent = document.body.innerHTML;
      document.body.innerHTML = newContent;
      window.print();
      window.location.reload();
      document.body.innerHTML = oldContent;
    },
    getExcel() {
      if (this.tableData.length < 1) {
        this.$message({
          message: "暂无可导出的数据！",
          type: "warning"
        });
        return;
      }
      const data = {
        endTime: this.search.time[1],
        startTime: this.search.time[0],
        type: 9 //工单列表
      };
      excel(data, "工单报表").then(() => {});
    },
    pay(row) {
      getOrderListX({ oid: row.oid }).then(res => {
        if (res.data.code == 200) {
          this.detailForm = res.data.data;
          this.detailForm.carNo = row.carNo;

          let receivableItemAmount = 0;
          let receivablePartAmount = 0;
          this.detailForm.orderItemList.forEach(v => {
            receivableItemAmount += v.standPrice;
            v.orderPartList.forEach(k => {
              receivablePartAmount += k.price;
            });
          });

          this.payForm = {
            oid: row.oid,
            gid: row.gid,
            carNo: row.carNo,
            customerId: this.detailForm.customerId,
            customerName: this.detailForm.ownerName,
            phone: this.detailForm.phone,
            receivableItemAmount: receivableItemAmount,
            receivablePartAmount: receivablePartAmount,
            discountItemRate: 1,
            discountPartRate: 1,
            actualItemAmount: this.detailForm.receivableItemAmount || 0,
            actualPartAmount: this.detailForm.receivablePartAmount || 0,
            discountReason: "",
            amountDiscount: 0,
            amountReceivable: Math.floor(this.detailForm.amountReceivable) || 0,
            amountActual:
              Math.floor(this.detailForm.amountActual) ||
              Math.floor(this.detailForm.amountReceivable) ||
              0,
            payTypeList: [],
            difference: 0,
            discountPrice: 0
          };
          //获取会员星级，折扣计算
          getGrade({ customerId: this.detailForm.customerId }).then(res => {
            if (res.data.code == 200) {
              const data = res.data.data;
              this.detailForm.star = data.star;
              if (data.gradeTypeDO) {
                this.payForm.discountItemRate = data.gradeTypeDO.workDiscount;
                this.payForm.discountPartRate = data.gradeTypeDO.partDiscount;
                this.discountCalc();
              }
            }
          });
          this.payVisible = true;
        }
      });
    },
    //折扣计算
    discountCalc() {
      this.payForm.actualItemAmount = (
        parseFloat(this.payForm.receivableItemAmount) *
        parseFloat(this.payForm.discountItemRate / 10)
      ).toFixed(2);
      this.payForm.actualPartAmount = (
        parseFloat(this.payForm.receivablePartAmount) *
        parseFloat(this.payForm.discountPartRate / 10)
      ).toFixed(2);
      const projectDiscount =
        parseFloat(this.payForm.receivableItemAmount) -
        parseFloat(this.payForm.actualItemAmount);
      const partDiscount =
        parseFloat(this.payForm.receivablePartAmount) -
        parseFloat(this.payForm.actualPartAmount);

      //总优惠价格
      this.payForm.amountDiscount = Math.floor(
        parseFloat(projectDiscount) + parseFloat(partDiscount)
      );
      this.payForm.discountPrice = this.payForm.amountDiscount;
      this.payForm.amountActual = Math.floor(
        parseFloat(this.payForm.amountReceivable) -
          parseFloat(this.payForm.amountDiscount)
      );
    },
    allCalc(type) {
      if (type == 1) {
        this.payForm.discountPrice = Math.floor(
          parseFloat(this.payForm.amountReceivable) -
            parseFloat(this.payForm.amountActual)
        );
      } else {
        this.payForm.amountActual = Math.floor(
          parseFloat(this.payForm.amountReceivable) -
            parseFloat(this.payForm.discountPrice)
        );
      }
    },
    selectPayment(event) {
      this.payForm.difference = 0;
      this.payForm.payTypeList = event.map(v => {
        this.$set(v, "amount", 0);
        return v;
      });
    },
    changeAmount() {
      const sumPrice = this.payForm.payTypeList.reduce(function(
        accumulator,
        currentValue
      ) {
        return accumulator + parseFloat(currentValue.amount);
      },
      0);

      this.payForm.difference =
        parseFloat(this.payForm.amountActual) - sumPrice;
    },
    paySubmit() {
      if (this.payForm.amountActual != 0) {
        if (this.payForm.payTypeList.length < 1) {
          return this.$message({ message: "请先选择支付方式", type: "error" });
        }

        const sumPrice = this.payForm.payTypeList.reduce(function(
          accumulator,
          currentValue
        ) {
          return accumulator + parseFloat(currentValue.amount);
        },
        0);
        if (sumPrice != this.payForm.amountActual) {
          return this.$message({
            message: "结算金额不等于实收金额，请修改",
            type: "error"
          });
        }
      }

      const data = {
        ...this.payForm,
        discountItemRate: parseFloat(this.payForm.discountItemRate) / 10,
        discountPartRate: parseFloat(this.payForm.discountPartRate) / 10
      };
      settlement(data).then(res => {
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: "结算成功!"
          });
          this.payVisible = false;
          this.searchList();
        }
      });
    },
    rollbackSettlement(row) {
      this.$confirm(`确认车牌为${row.carNo}的工单反结算?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          rollbackSettlement({ oid: row.oid }).then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: "success",
                message: "反结算成功!"
              });
              this.searchList();
            }
          });
        })
        .catch(() => console.log("已取消"));
    },
    discountDialog() {
      this.discountVisible = true;
    },
    paymentDialog() {
      this.paymentVisible = true;
    },
    showMore(index) {
      this.$set(this.tableData[index], "shows", 1);
    }
  }
};
</script>
<style scoped>
.orderUl li {
  float: left;
  padding: 4px 18px;
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
</style>


