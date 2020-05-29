<template>
  <div class="w-100 order flex-col">
    <div class="p-15" style="background:rgba(229,246,247,1);">
      <el-form :inline="true" class="demo-form-inline">
        <el-row>
          <el-col>
            <!-- 客户选择 -->
            <el-form-item label="客户名称" class="m-b-0">
              <el-select v-model="index" placeholder="全部" @change="ChangeCustomerName">
                <!-- <el-option :key="全部" label="全部" :value="全部"></el-option> -->
                <el-option
                  v-for="(item,idx) in result"
                  v-if="item.name"
                  :key="idx"
                  :label="item.name"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- 状态勾选 -->
            <el-form-item label="状态" class="m-b-0">
              <div class="radio_ccid">
                <!-- <el-radio-group v-model="radio" fill="#ffffff"> -->
                <!-- <el-radio
                  v-model="radio"
                    label="0"
                    :size="small"
                    @change="selectchange"
                  >未结</el-radio>
                  <el-radio
                  v-model="radio"
                    label="1"
                    :size="small"
                    @change="selectchange"
                >已结</el-radio>-->
                <!-- :max="2"
                  :min="1" -->
                <el-checkbox-group
                  v-model="checkedCities1"
                  @change="selectchange"
                  
                >
                  <el-checkbox
                    :disabled="false"
                    @change="selectchange2"
                    v-for="(city,ide) in cities"
                    :label="city.name"
                    :key="ide"
                  >{{city.name}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </el-form-item>
            <!-- 日期选择器 -->
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
            <el-button type="success" icon="el-icon-search" @click="searchList()">查找</el-button>

            <el-form-item label class="m-b-0 right m-r-20">
              <div
                class="left c-p c-9"
                @click="getExcel"
                style="width: 139px; height: 42px;line-height: 42px;background: url(../../../static/img/but1.png) no-repeat;background-size: 100% 100%;text-indent: 45px;"
              >导出EXCEL</div>
              <!-- <div class="left c-p c-9" @click="printDeal" style="width: 106px; height: 42px;line-height: 42px;background: url(../../../static/img/but2.png) no-repeat;background-size: 100% 100%;text-indent: 50px;">打印</div> -->
            </el-form-item>
            <el-button
              type="danger"
              class="right"
              style="margin-right: 10px;"
              v-if="index !='全部'"
              @click="GZSKclick"
            >挂账收款</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div style="width:100%;padding-top:15px;" class="orderTable" id="printBox">
      <el-table
        :data="tableData"
        :max-height="500"
        style="width: 100%"
        @selection-change="selectPayment"
        @select="onTableSelect"
      >
        <el-table-column type="index" width="60">
          <template slot-scope="scope">{{scope.row.index}}</template>
        </el-table-column>
        <el-table-column label="日期" prop="weekOfDay"></el-table-column>
        <el-table-column prop="garageName" label="店名" width="180"></el-table-column>
        <el-table-column prop="billNumber" label="工单号"></el-table-column>
        <el-table-column prop="carNo" label="车牌"></el-table-column>
        <el-table-column prop="standard" label="车型"></el-table-column>
        <el-table-column prop="itemName" label="项目"></el-table-column>
        <el-table-column prop="amount" label="金额"></el-table-column>
        <el-table-column prop="customerName" label="客户名称"></el-table-column>
        <el-table-column prop="phone" label="电话"></el-table-column>
        <el-table-column prop="bondsman" label="担保人"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column prop="payTime" label="回款日期"></el-table-column>
        <el-table-column type="selection" width="50">
          <template slot-scope="scope">
            <el-checkbox-group
              v-model="scope.row.checked"
              v-if="scope.row.payMent == 0 && scope.row.weekOfDay"
            >
              <el-checkbox @change="check(scope.row)"></el-checkbox>
            </el-checkbox-group>
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
    <el-dialog title="请选择" :visible.sync="paymentVisible" center width="30%" :modal="false">
      <el-table
        ref="multipleTable"
        :data="paymentData"
        tooltip-effect="dark"
        :show-header="false"
        style="width: 100%"
        @selection-change="selectPayment"
        @select="onTableSelect"
      >
        <el-table-column prop="name" label></el-table-column>
        <el-table-column type="selection" width="50"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="paymentVisible = false">取 消</el-button>
        <el-button type="success" @click="zhifuQD">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="挂账收款" :visible.sync="payVisible" center width="40%" :modal="false">
      <el-form :model="payForm">
        <el-row :gutter="20" style="border-bottom:1px solid #ccc;padding:10px 0px;">
          <el-col :span="8">客户名称：{{index}}</el-col>
          <el-col :span="8">电话：{{phone?phone:''}}</el-col>
          <el-col :span="8">
            <div style="float:right;">
              <el-button type="success" size="mini" @click="discountVisible =true">减免</el-button>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20" style="border-bottom:1px solid #ccc;padding:10px 0px;">
          <el-col :span="6">应收：￥{{zonger}}</el-col>
          <el-col :span="6">
            优惠：
            <font color="red">￥{{youhui}}</font>
          </el-col>
          <el-col :span="6">
            实收：
            <font color="red">￥{{shishou}}</font>
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
          v-for="(item,index) in payForm.payTypeList"
          :key="index"
        >
          <el-col :span="12">
            <span style>{{item.name}}</span>
            <span style="color: #ff0000; margin-left: 40px;">{{item.billname}}</span>
          </el-col>
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
      <el-dialog title="折扣设置" :visible.sync="discountVisible" center width="30%" :modal="false">
        <el-form :model="payForm">
          <el-form-item label="实收" label-width="100px">
            <el-input v-model="shishou">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="减免" label-width="100px">
            <el-input v-model="youhui">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="理由" label-width="100px">
            <el-input v-model="payForm.discountReason"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="danger" @click="discountVisible = false">取 消</el-button>
          <el-button type="success" @click="QDyouhui">确 定</el-button>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import { form3, excel, queryBillerCustomer,debtPay } from "../../request/api.js";
import moment from "moment";
const cityOptions = ["未结", "已结"];
export default {
  name: "formC",
  data() {
    return {
      search: {
        time: [
          // moment(new Date()).format("YYYY-MM-01"),
          // moment(new Date()).format("YYYY-MM-DD")
        ]
      },
      checkedCities1: ["未结", "已结"],
      cities: [
        {
          id: 0,
          chk: true,
          name: "未结"
        },
        {
          id: 1,
          chk: true,
          name: "已结"
        }
      ],
      index: "全部",
      payVisible: false,
      discountVisible: false,
      shishou: "",
      payForm: {
        payTypeList: [],
        difference: 0
      },
      radio: "", //选中的未结算已结算
      radio2: 0, //选中的未结算已结算
      customerName: "", //选中的名字
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
      result: [],
      content: [],
      JSlist: [],
      JZlist: [],
      debtorId: "", //挂账id
      paymentData: [
        { type: 0, name: "现金" },
        { type: 1, name: "支付宝" },
        { type: 2, name: "微信" },
        { type: 3, name: "银行卡" },
        { type: 4, name: "直赔到店" }
      ],
      maxHeight: undefined,
      pageLength: null,
      zonger: null,
      phone: null,
      debtPayDTOList: [],
      paymentVisible: false,
      youhui: 0,
      size: 10,
      page: 0
    };
  },
  created() {
    let nowTime = moment(new Date()).format("YYYY-MM-DD");
    const data = {
      // endTime: nowTime,
      // startTime: nowTime,
      page: this.page,
      size: this.size
    };
    this.getList(data);
    queryBillerCustomer().then(res => {
      this.result = res.data.data;
    });
  },
  mounted() {
    this.maxHeight = $(".tabBox").height() - 240 + "px";
  },
  methods: {
    check(e) {
      console.log(e);
    },
    paySubmit() {
      let _this = this;
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

      if (sumPrice != Math.abs(this.shishou)) {
        return this.$message({
          message: "结算金额不等于实收金额，请修改",
          type: "error"
        });
      }

      // console.log(_this.debtorId);
      //         console.log(this.debtPayDTOList);
      const data = {
        customerName: this.name,
        payment: this.radio,
        endTime: this.search.time[1],
        startTime: this.search.time[0],
        page: this.page,
        size: this.size
      };

      let tesd = {
        debtPayDTOList: this.debtPayDTOList,
        amountDiscount: this.youhui,
        debtorId: this.debtorId,
        discountReason: this.payForm.discountReason,
        phone: this.phone,
        payTypeList: this.payForm.payTypeList
      };
      // console.log(tesd);
      debtPay(tesd).then(res => {
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: "结算成功"
          });
          this.getList(data);
          this.payVisible = false;
        }
      });
    },
    //选择勾选
    onTableSelect(rows, row) {
      console.log(rows);
      this.JSlist = rows;
      console.log(row);
      let selected = rows.length && rows.indexOf(row) !== -1;
      console.log(selected); // true就是选中，0或者false是取消选中
    },
    //计算差额
    changeAmount() {
      const sumPrice = this.payForm.payTypeList.reduce(function(
        accumulator,
        currentValue
      ) {
        return accumulator + parseFloat(currentValue.amount);
      },
      0);

      this.payForm.difference = parseFloat(this.shishou) - sumPrice;
    },
    //结账
    GZSKclick() {
      this.JSlist = [];
      this.zonger = null;
      for (var i in this.tableData) {
        if (this.tableData[i].checked == true) {
          this.JSlist.push(this.tableData[i]);
        }
      }
      console.log(this.JSlist);

      if (this.JSlist.length < 1) {
        this.$message.error("请先选择收款用户");
        return;
      }
      this.JSlist.forEach((item, index) => {
        this.zonger += parseFloat(item.amount);
        let data = {
          carNo: item.carNo,
          debtAmount: item.amount,
          id: item.id
        };
        this.debtPayDTOList.push(data);
      });

      this.shishou = this.zonger - this.youhui;
      console.log(this.zonger);
      this.payVisible = true;
    },
    paymentDialog() {
      this.paymentVisible = true;
    },
    selectPayment(event) {
      this.payForm.difference = 0;
      this.JZlist = event;
    },
    zhifuQD() {
      this.payForm.payTypeList = this.JZlist.map(v => {
        this.$set(v, "amount", 0);
        this.$set(v, "billerCustomerId", this.debtorId);
        return v;
      });
      this.paymentVisible = false;
    },
    QDyouhui() {
      this.shishou = this.shishou - this.youhui;
      this.discountVisible = false;
    },
    handleCurrentChange(val) {
      this.page = val - 1;
      // if (
      //   this.search.time !== undefined &&
      //   this.search.time !== null &&
      //   this.search.time.length > 0
      // ) {
      //   const data = {
      //     endTime: this.search.time[1],
      //     startTime: this.search.time[0],
      //     page: this.page,
      //     size: this.size
      //   };
      //   this.getList(data);
      // } else {
      //   this.$message({
      //     message: "请先选择查询日期！",
      //     type: "warning"
      //   });
      // }
      const data = {
        payment: this.radio,
        endTime: this.search.time[1],
        startTime: this.search.time[0],
        page: this.page,
        size: this.size
      };
      this.getList(data);
    },
    getList(data) {
      form3(data).then(res => {
        var content = res.data.data.content;
        // if (this.result == "") {
        //   var result = [];
        //   var obj = {};
        //   for (var i = 0; i < content.length; i++) {
        //     if (!obj[content[i].customerName]) {
        //       result.push(content[i]);
        //       obj[content[i].customerName] = true;
        //     }
        //   }
        //   this.result = result;
        // }

        this.pageLength = res.data.data.totalElements;

        if (res.data.data.content.length > 0) {
          this.tableData = res.data.data.content;
          this.tableData.map((c, i) => {
            this.$set(c, "checked", false);
          });
          this.tableData.forEach((item, index) => {
            item.index = index + 1 + this.page * 10;
            if (item.payTime) {
              item.payTime = moment(item.payTime).format("YYYY/MM/DD");
            }
            if (item.weekOfDay) {
              item.weekOfDay = moment(item.weekOfDay).format("YYYY/MM/DD");
            }
          });
          this.tableData[this.tableData.length - 1].index = "合计:";
        } else {
          this.tableData = [];
        }
      });
    },
    weeks(dayNum) {
      if (dayNum == 1) {
        return "星期一";
      }
      if (dayNum == 2) {
        return "星期二";
      }
      if (dayNum == 3) {
        return "星期三";
      }
      if (dayNum == 4) {
        return "星期四";
      }
      if (dayNum == 5) {
        return "星期五";
      }
      if (dayNum == 6) {
        return "星期六";
      }
      if (dayNum == 7) {
        return "星期日";
      }
    },
    searchList() {
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
      if (this.customerName) {
        const data = {
          customerName: this.customerName,
          payment: this.radio,
          endTime: this.search.time[1],
          startTime: this.search.time[0],
          page: this.page,
          size: this.size
        };
        this.getList(data);
      } else {
        const data = {
          // customerName: this.customerName,
          payment: this.radio,
          endTime: this.search.time[1],
          startTime: this.search.time[0],
          page: this.page,
          size: this.size
        };
        this.getList(data);
      }
    },
    // clickitem(e) {
    //   e === this.radio ? (this.radio = '') : (this.radio = e);
    // },
    //选择名字
    ChangeCustomerName(selVal) {
      console.log(selVal);
      // this.customerName = e;
      this.customerName = selVal.name;
      this.index = selVal.name;
      this.debtorId = selVal.id;
      this.phone = selVal.phone;
      const data = {
        customerName: selVal.name,
        payment: this.radio,
        endTime: this.search.time[1],
        startTime: this.search.time[0],
        page: this.page,
        size: this.size
      };
      this.getList(data);
    },
    selectchange2(e) {
      console.log(e);

      for (var i in e) {
        console.log(e[i].chk == false);
        // if(e[i].chk )
      }
    },
    // 选择已结未结
    selectchange(e) {
      console.log(e.length);
      if(e.length ==0){
        this.radio = null;
      }
      if (e.length == 2) {
        this.radio = null;
      } else {
        for (var i in e) {
          if (e[i] == "未结") {
            this.radio = 0;
            this.radio2 = 0;
          } else if (e[i] == "已结") {
            this.radio = 1;
            this.radio2 = 1;
          }
        }
      }

      const data = {
        payment: this.radio,
        endTime: this.search.time[1],
        startTime: this.search.time[0],
        page: this.page,
        size: this.size
      };
      this.getList(data);
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
        type: 6 //挂账报表
      };
      excel(data, "挂账报表").then(() => {});
    }
  }
};
</script>
<style scoped>
.navActive em:hover {
  color: #3ac29f;
  transition: 0.5s;
}
.el-select-dropdown__item.selected {
  color: #606266;
  font-weight: 500;
}
.navActive em.active {
  color: #3ac29f;
}
.el-radio {
  margin-right: 12px;
}
</style>
<style >
.el-table__header-wrapper .el-checkbox {
  display: none;
}
</style>
