<template>
  <div class="w-100 order flex-col">
    <div class="p-15" style="background:rgba(229,246,247,1);">
      <el-form :inline="true" class="demo-form-inline">
        <el-row>
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
      <el-table :data="tableData" :max-height="maxHeight" style="width: 100%">
        <el-table-column label="凭证编号" prop="voucherNumber"></el-table-column>
        <el-table-column prop="spendDate" label="日期"></el-table-column>
        <el-table-column prop="groupName" label="类型" :formatter="formatSex2"></el-table-column>
        <el-table-column prop="feeType" label="事由" :formatter="formatSex3"></el-table-column>
        <el-table-column prop="woreName" label="收款方"></el-table-column>
        <el-table-column prop="spendAmount" label="金额"></el-table-column>
        <el-table-column prop="handler" label="经手人"></el-table-column>
        <el-table-column prop="auditor" label="审核人"></el-table-column>
        <el-table-column prop="remark" label="摘要"></el-table-column>
        <el-table-column prop="pictureList" label="凭证照片" >
          <template slot-scope="scope" >
            <el-button size="mini" @click="viewPhoto(scope.row)" v-if="scope.row.spendDate">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- c查看凭证图片 -->
      <el-dialog
        title="查看照片"
        :visible.sync="visible.photoVisible"
        width="40%"
        center
        :modal="false"
      >
        <el-carousel indicator-position="outside">
          <el-carousel-item v-for="item in photoUrl" :key="item" :autoplay="false">
            <el-image style="width: 100%;margin:0 auto; " :src="item.picUrl" fit="fill"></el-image>
          </el-carousel-item>
        </el-carousel>

        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="visible.photoVisible = false">确 定</el-button>
        </span>
      </el-dialog>
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
import { form6, excel } from "../../request/api.js";
import moment from "moment";
export default {
  name: "formF",
  data() {
    return {
      search: {
        time: [
          moment(new Date()).format("YYYY-MM-DD"),
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
      photoUrl: "",
       visible: {
        photoVisible: false //查看照片
      },
    };
  },
  created() {
    let nowTime = moment(new Date()).format("YYYY-MM-DD");
    const data = {
      endTime: nowTime,
      startTime: nowTime,
      page: this.page,
      size: this.size
    };
    this.getList(data);
  },
  mounted() {
    this.maxHeight = $(".tabBox").height() - 235 + "px";
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val - 1;
      if (
        this.search.time !== undefined &&
        this.search.time !== null &&
        this.search.time.length > 0
      ) {
        const data = {
          endTime: this.search.time[1],
          startTime: this.search.time[0],
          page: this.page,
          size: this.size
        };
        this.getList(data);
      } else {
        this.$message({
          message: "请先选择查询日期！",
          type: "warning"
        });
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
      const data = {
        endTime: this.search.time[1],
        startTime: this.search.time[0],
        page: this.page,
        size: this.size
      };
      this.getList(data);
    },
    getList(data) {
      form6(data).then(res => {
        this.pageLength = res.data.data.totalElements;
        this.tableData = res.data.data.content;
        if (res.data.data.content.length > 0) {
          this.tableData.forEach(item => {
            if (item.spendDate) {
              item.spendDate = moment(item.spendDate).format("YYYY/MM/DD");
            }
          });
          this.tableData[this.tableData.length - 1].voucherNumber = "本月合计:";
        }
      });
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
        type: 1 //支出流水
      };
      excel(data, "支出流水报表").then(() => {});
    },
    //点击查看凭证
    viewPhoto(url) {
      console.log(url)
      if (url.pictureList[0] != undefined) {
        this.photoUrl = url.pictureList;
        this.visible.photoVisible = true;
      } else {
        this.$message({
          showClose: true,
          message: "暂无该凭证照片",
          type: "warning"
        });
      }
    },

    formatSex3: function(row, column, cellValue) {
      if (cellValue == 101) {
        return "服务项目";
      } else if (cellValue == 102) {
        return "套餐";
      } else if (cellValue == 103) {
        return "保险";
      } else if (cellValue == 104) {
        return "挂帐";
      } else if (cellValue == 105) {
        return "定金";
      } else if (cellValue == 106) {
        return "减免";
      } else if (cellValue == 107) {
        return "其他";
      } else if (cellValue == 201) {
        return "通信费";
      } else if (cellValue == 202) {
        return "餐费";
      } else if (cellValue == 203) {
        return "加油费";
      } else if (cellValue == 204) {
        return "差旅费";
      } else if (cellValue == 205) {
        return "水电费";
      } else if (cellValue == 206) {
        return "工资";
      } else if (cellValue == 207) {
        return "房租费";
      } else if (cellValue == 208) {
        return "配件费";
      } else if (cellValue == 209) {
        return "其他";
      }else if (cellValue == 99) {
        return "预付款";
      }
    },
    formatSex2: function(row, column, cellValue) {
      if (cellValue == 201) {
        return "电器";
      } else if (cellValue == 202) {
        return "机修";
      } else if (cellValue == 203) {
        return "钣金";
      } else if (cellValue == 204) {
        return "美容";
      } else if (cellValue == 205) {
        return "喷漆";
      } else if (cellValue == 206) {
        return "其它";
      }
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
</style>
