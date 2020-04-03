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
              :picker-options="pickerOptions">
            </el-date-picker>
						</el-form-item>
            <el-button type="success" icon="el-icon-search" @click="searchList()">查找</el-button>
            
            <el-form-item label="" class="m-b-0 right m-r-20">
								<div class="left c-p c-9" @click="getExcel" style="width: 139px; height: 42px;line-height: 42px;background: url(../../../static/img/but1.png) no-repeat;background-size: 100% 100%;text-indent: 45px;">导出EXCEL</div>
								<!-- <div class="left c-p c-9" @click="printDeal" style="width: 106px; height: 42px;line-height: 42px;background: url(../../../static/img/but2.png) no-repeat;background-size: 100% 100%;text-indent: 50px;">打印</div> -->
						</el-form-item>
					</el-col>
          </el-row>
				</el-form>
		</div>
    <div style="width:100%;padding-top:15px;" class="orderTable" id="printBox">
      <el-table :data="tableData" :max-height="maxHeight" style="width: 100%">
        <el-table-column type="index" width="60">
          <template slot-scope="scope">
	            {{scope.row.index}}
	          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="customerName"> </el-table-column>
        <el-table-column prop="phone" label="联系方式" width="120"> </el-table-column>
        <el-table-column prop="carNo" label="车牌号" width="110"> </el-table-column>
        <el-table-column prop="vip" label="是否会员"> </el-table-column>
        <el-table-column prop="carBrand" label="车型"> </el-table-column>
        <el-table-column prop="accountDate" label="日期" width="110"> </el-table-column>
        <el-table-column prop="billNumber" label="单号" width="150"> </el-table-column>
        <el-table-column prop="serviceMan" label="接待员"> </el-table-column>
        <el-table-column prop="seller" label="业务员"> </el-table-column>
        <el-table-column prop="worker" label="施工人"> </el-table-column>
        <el-table-column prop="settleMan" label="收款人"> </el-table-column>
        <el-table-column prop="settleDate" label="收款时间"> </el-table-column>
        <el-table-column prop="item" label="消费项目" width="150"> </el-table-column>
        <el-table-column prop="payableAmount" label="应收"> </el-table-column>
        <el-table-column prop="deductAmount" label="减免"> </el-table-column>
        <el-table-column prop="actualAmount" label="实收"> </el-table-column>
        <el-table-column prop="costAmount" label="成本"> </el-table-column>
        <el-table-column prop="profitAmount" label="利润"> </el-table-column>
        <el-table-column prop="payType" label="付款方式"> </el-table-column>
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
import { form5,excel } from "../../request/api.js";
import moment from "moment";
export default {
  name: "formE",
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
    getList(data) {
      form5(data).then(res => {
        this.pageLength = res.data.data.totalElements;
        this.tableData = res.data.data.content;

        if (res.data.data.content.length > 0) {
          this.tableData.forEach((item,index) => {
            item.index = (index + 1) + (this.page) * 10
            if(item.accountDate){item.accountDate = moment(item.accountDate).format("YYYY/MM/DD");}
            //if(item.vip===null){item.vip = "否"}
          });
          this.tableData[this.tableData.length-1].index = "总计:"
        }

      });
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
    		type:2 //收入流水
      }
    	excel(data,"收入流水报表").then(()=>{})
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
