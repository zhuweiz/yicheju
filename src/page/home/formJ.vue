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
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="员工姓名" class="m-b-0">
              <el-input
                v-model="search.employeeName"
                placeholder=""
                style="width:100%;"
              ></el-input>
            </el-form-item>
            <el-form-item label="提成类别" class="m-b-0">
                <el-select v-model="search.sourceType" placeholder="请选择">
                  <el-option label="全部" value="">全部</el-option>
                  <el-option label="整单" :value="1">整单</el-option>
                  <el-option label="工时" :value="2">工时</el-option>
                  <el-option label="配件" :value="3">配件</el-option>
                </el-select>
            </el-form-item>
            <el-button
              type="success"
              icon="el-icon-search"
              @click="searchList()"
              >查找</el-button>
              <el-form-item label="" class="m-b-0 right m-r-20">
                <div class="left c-p c-9" @click="getExcel" style="width: 139px; height: 42px;line-height: 42px;background: url(../../../static/img/but1.png) no-repeat;background-size: 100% 100%;text-indent: 45px;">导出EXCEL</div>
                <!-- <div class="left c-p c-9" @click="printDeal" style="width: 106px; height: 42px;line-height: 42px;background: url(../../../static/img/but2.png) no-repeat;background-size: 100% 100%;text-indent: 50px;">打印</div> -->
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <div style="width:100%;padding-top:15px;" class="orderTable" id="printBox">
      <el-table :data="tableData" :max-height="maxHeight" style="width: 100%">
        <el-table-column type="index" width="60">
          <template slot-scope="scope">
	            {{scope.row.index}}
	          </template>
        </el-table-column>
        <el-table-column prop="billNumber" label="单号"> </el-table-column>
        <el-table-column prop="carNo" label="车牌号"></el-table-column>
        <el-table-column prop="bizDate" label="收款时间"> </el-table-column>
        <el-table-column prop="sourceAmount" label="实收"> </el-table-column>
        <el-table-column prop="sourceName" label="提成项"> </el-table-column>
        <el-table-column prop="sourceType" label="提成类别"> 
            <template slot-scope="scope">
                {{typeName[scope.row.sourceType - 1]}}
            </template>
        </el-table-column>
        <el-table-column prop="percentageAmount" label="提成金额"> </el-table-column>
        <el-table-column prop="percentagePoint" label="提成占比">
            <template slot-scope="scope">
                {{scope.row.percentageWay == 1 ? scope.row.percentagePoint+'%' : '固定'}}
            </template>
        </el-table-column>
        <el-table-column prop="employeeName" label="员工姓名"> </el-table-column>
      </el-table>
      <div class="p-tb-10 text-center">
        <el-pagination
          :hide-on-single-page="pageLength === 0"
          background
          layout="prev, pager, next"
          :page-size="size"
          @current-change="handleCurrentChange"
          :total="pageLength"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getPercentageReport,excel } from "../../request/api.js";
import moment from "moment";
export default {
  name: "formG",
  data() {
    return {
      typeName: ['业务', '工时', '配件'],
      search: {
        time: [
          moment(new Date()).format("YYYY-MM-DD"),
          moment(new Date()).format("YYYY-MM-DD")
        ],
        name: "",
        sourceType: ''
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
        shortcuts: [{
            text: '今日',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '本月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * (Number(moment(new Date()).format("D")) - 1));
              picker.$emit('pick', [start, end]);
            }
          }]
      },
      tableData: [],
      maxHeight: undefined,
      pageLength: null,
      size: 10,
      page: 0
    };
  },
  created() {
    let nowTime = moment(new Date()).format("YYYY-MM-DD");
    const data = {
      endDate: nowTime,
      startDate: nowTime,
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
          endDate: this.search.time[1],
          startDate: this.search.time[0],
          sourceType: this.search.sourceType,
          employeeName: this.search.employeeName,
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
    getList(data) {
      getPercentageReport(data).then(res => {
        this.pageLength = res.data.pageInfo.total
        this.tableData = res.data.data
      })
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
        endDate: this.search.time[1],
        startDate: this.search.time[0],
        sourceType: this.search.sourceType,
        employeeName: this.search.employeeName,
        page: this.page,
        size: this.size
      };
      this.getList(data);
    },
    printDeal(){
    	var printBox = document.getElementById('printBox');
            var newContent =printBox.innerHTML;
            var oldContent = document.body.innerHTML;
            document.body.innerHTML = newContent;
            window.print();
            window.location.reload();
            document.body.innerHTML = oldContent;
    },
    getExcel(){
	  if(this.tableData.length < 1){
	          this.$message({
	            message: "暂无可导出的数据！",
	            type: "warning"
	          });
	          return
	        }
    	const data = {
    		endTime:this.search.time[1],
        startTime:this.search.time[0],
    		type:10 //配件采购明细
      }
    	excel(data,"提成报表").then(()=>{})
    }
  }
};
</script>
<style scoped>
.navActive em:hover {
		color: #3AC29F;
		transition: .5s;
	}
	
	.navActive em.active {
		color: #3AC29F;
	}

</style>
