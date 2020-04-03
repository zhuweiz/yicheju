<template>
  <div class="w-100 order flex-col">
    <div class="p-15" style="background:rgba(229,246,247,1);">
      <el-form :inline="true" class="demo-form-inline">
        <el-row>
          <el-col>
            <!-- 客户选择 -->
            <el-form-item label="客户名称" class="m-b-0">
              <el-select v-model="index" placeholder="全部" @change="ChangeCustomerName">
                <el-option :key="全部" label="全部" :value="全部"></el-option>
                <el-option
                  v-for="item in result"
                  v-if="item.customerName"
                  :key="item.index"
                  :label="item.customerName"
                  :value="item.customerName"
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
                <el-checkbox-group
                  v-model="checkedCities1"
                  :min="1"
                  :max="2"
                  @change="selectchange"
                >
                  <el-checkbox :disabled="false" v-for="city in cities" :label="city.name" :key="city">{{city.name}}</el-checkbox>
                </el-checkbox-group>
                
                <!-- <el-radio
                    v-for="(item, index) in radio2"
                    :key="item.id"
                    @click.native.prevent="clickitem(index)"
                    :label="item.id"
                  >{{item.name}}</el-radio>
                </el-radio-group>-->
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
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div style="width:100%;padding-top:15px;" class="orderTable" id="printBox">
      <el-table :data="tableData" :max-height="500" style="width: 100%">
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
  </div>
</template>

<script>
import { form3, excel } from "../../request/api.js";
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
          name: "未结"
        },
        {
          id: 1,
          name: "已结"
        }
      ],
      index: "全部",

      radio: "", //选中的未结算已结算
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
      maxHeight: undefined,
      pageLength: null,
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
  },
  mounted() {
    this.maxHeight = $(".tabBox").height() - 240 + "px";
  },
  methods: {
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
        if (this.result == "") {
          var result = [];
          var obj = {};
          for (var i = 0; i < content.length; i++) {
            if (!obj[content[i].customerName]) {
              result.push(content[i]);
              obj[content[i].customerName] = true;
            }
          }
          this.result = result;
        }

        this.pageLength = res.data.data.totalElements;
   
        if (res.data.data.content.length > 0) {
          this.tableData = res.data.data.content;
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
    ChangeCustomerName(e) {
      this.customerName = e;
      const data = {
        customerName: e,
        payment: this.radio,
        endTime: this.search.time[1],
        startTime: this.search.time[0],
        page: this.page,
        size: this.size
      };
      this.getList(data);
    },
    // 选择已结未结
    selectchange(e) {
      if (e.length == 2) {
        this.radio = null;
      } else {
        for (var i in e) {
          if (e[i] == "未结") {
            this.radio = 0;
          } else if (e[i] == "已结") {
            this.radio = 1;
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

.navActive em.active {
  color: #3ac29f;
}
.el-radio {
  margin-right: 12px;
}
</style>
