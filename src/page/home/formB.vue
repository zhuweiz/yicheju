<template>
  <div class="w-100 order flex-col">
     <div class="p-15" style="background:rgba(229,246,247,1);">
				<el-form :inline="true" class="demo-form-inline">
          <el-row>
					<el-col>
						<el-form-item label="日期" class="m-b-0">
							<el-date-picker
              v-model="search.time"
              type="monthrange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              unlink-panels> 
            </el-date-picker>
						</el-form-item>
            <el-form-item label="项目" class="m-b-0">
              <el-select v-model="search.groupId" placeholder="请选择">
                <el-option
                  v-for="item in workType"
                  :key="item.id"
                  :label="item.groupName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-button type="success" icon="el-icon-search" @click="getList()">查找</el-button>
            <el-form-item label="" class="m-b-0 right m-r-20">
            <!-- <div class="left c-p c-9" @click="getExcel" style="width: 139px; height: 42px;line-height: 42px;background: url(../../../static/img/but1.png) no-repeat;background-size: 100% 100%;text-indent: 45px;">导出EXCEL</div> -->
            <!-- <div class="left c-p c-9" @click="printDeal" style="width: 106px; height: 42px;line-height: 42px;background: url(../../../static/img/but2.png) no-repeat;background-size: 100% 100%;text-indent: 50px;">打印</div> -->
        </el-form-item>
					</el-col>
          </el-row>
				</el-form>
		</div>

    <div style="width:100%;" id="printBox">
			<el-row :gutter="0">
				<el-col :xs="24" :md="12" class="tableLeft">
					<div class="c-white" style="background:#FF6757;height:41px;line-height:41px;text-indent:20px;">总收入：{{totalIncomeAmount}}元</div>
					<el-table :data="tableData" border :height="maxHeight" style="width: 100%">
						<el-table-column type="index" width="60"></el-table-column>
            <el-table-column label="日期" prop="bizDate"> </el-table-column>
            <el-table-column prop="orderCount" label="台次"> </el-table-column>
            <el-table-column prop="remark" label="备注"> </el-table-column>
            <el-table-column prop="totalAmount" label="金额"> </el-table-column>
            <el-table-column prop="standard" label="明细">
              <template slot-scope="scope">
                <font @click="viewInfo(scope.row, 1)" color="#0d906e">查看</font>
              </template>
            </el-table-column>
					</el-table>
				</el-col>
				<el-col :xs="24" :md="12" class="tableRight">
					<div class="c-white" style="background:#0D906E;height:41px;line-height:41px;text-indent:20px;">总支出：{{totalOutAmount}}元</div>
					<el-table :data="tableData" border :height="maxHeight" style="width: 100%">
            <el-table-column prop="outTotalAmount" label="日支出合计"> </el-table-column>
						<el-table-column prop="partTotalAmount" label="配件支出总金额"> </el-table-column>
            <el-table-column prop="standard" label="明细">
              <template slot-scope="scope">
                <font @click="viewInfo(scope.row, 2)" color="#0d906e">查看</font>
              </template>
            </el-table-column>
            <el-table-column prop="percentageTotalAmount" label="提成支出总金额
    "> </el-table-column>
            <el-table-column prop="standard" label="明细">
              <template slot-scope="scope">
                <font @click="viewInfo(scope.row, 4)" color="#0d906e">查看</font>
              </template>
            </el-table-column>
            <el-table-column prop="otherTotalAmount" label="其它支出总金额"> </el-table-column>
            <el-table-column prop="standard" label="明细">
              <template slot-scope="scope">
                <font @click="viewInfo(scope.row, 3)" color="#0d906e">查看</font>
              </template>
            </el-table-column>
					</el-table>
				</el-col>
			</el-row>

		</div>

    <el-dialog :title="info1.title" :visible.sync="info1.status" width="70%" :modal="false" center>
      <div class="orderTable" style="margin-top:10px;">
        <el-table :data="info1.data">
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column property="bizDate" label="日期"></el-table-column>
          <el-table-column property="billNumber" label="工单号"></el-table-column>
          <el-table-column property="carNo" label="车牌号"></el-table-column>
          <el-table-column property="userName" label="收款人"></el-table-column>
          <el-table-column property="totalAmount" label="金额"></el-table-column>
          <el-table-column property="payType" label="收款方式"></el-table-column>
        </el-table>
      </div>
			<div slot="footer" class="dialog-footer">
        <el-button type="success" @click="info1.status = false">退 出</el-button>
			</div>
		</el-dialog>

    <el-dialog :title="info2.title" :visible.sync="info2.status" width="70%" :modal="false" center>
      <div class="orderTable" style="margin-top:10px;">
        <el-table :data="info2.data">
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column property="bizDate" label="日期"></el-table-column>
          <el-table-column property="billNumber" label="工单号"></el-table-column>
          <el-table-column property="carNo" label="车牌号"></el-table-column>
          <el-table-column property="partName" label="配件名称"></el-table-column>
          <el-table-column property="source" label="配件来源">
            <template slot-scope="scope">
              <span>{{source[scope.row.source]}}</span>
            </template>
          </el-table-column>
          <el-table-column property="supplierName" label="供应商"></el-table-column>
          <el-table-column property="userName" label="经手人"></el-table-column>
          <el-table-column property="unit" label="单位"></el-table-column>
          <el-table-column property="partCount" label="数量"></el-table-column>
          <el-table-column property="price" label="单价"></el-table-column>
          <el-table-column property="totalAmount" label="金额"></el-table-column>
          <el-table-column property="paymentType" label="结账方式"></el-table-column>
        </el-table>
      </div>
			<div slot="footer" class="dialog-footer">
        <el-button type="success" @click="info2.status = false">退 出</el-button>
			</div>
		</el-dialog>

    <el-dialog :title="info3.title" :visible.sync="info3.status" width="70%" :modal="false" center>
      <div class="orderTable" style="margin-top:10px;">
        <el-table :data="info3.data" :max-height="maxHeight">
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column property="bizDate" label="日期"></el-table-column>
          <el-table-column property="billNumber" label="工单号"></el-table-column>
          <el-table-column property="carNo" label="车牌号"></el-table-column>
          <el-table-column property="userName" label="收款人"></el-table-column>
          <el-table-column property="totalAmount" label="金额"></el-table-column>
          <el-table-column property="payType" label="收款方式"></el-table-column>
        </el-table>
      </div>
			<div slot="footer" class="dialog-footer">
        <el-button type="success" @click="info3.status = false">退 出</el-button>
			</div>
		</el-dialog>

    <el-dialog :title="info4.title" :visible.sync="info4.status" width="70%" :modal="false" center>
      <div class="orderTable" style="margin-top:10px;">
        <el-table :data="info4.data" :max-height="maxHeight">
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column property="bizDate" label="日期"></el-table-column>
          <el-table-column property="billNumber" label="工单号"></el-table-column>
          <el-table-column property="carNo" label="车牌号"></el-table-column>
          <el-table-column property="employeeName" label="员工姓名"></el-table-column>
          <el-table-column property="itemName" label="项目名称"></el-table-column>
          <el-table-column property="payType" label="结账方式"></el-table-column>
          <el-table-column property="percentageAmount" label="金额"></el-table-column>
          <el-table-column property="sourceType" label="提成类别"></el-table-column>
        </el-table>
      </div>
			<div slot="footer" class="dialog-footer">
        <el-button type="success" @click="info4.status = false">退 出</el-button>
			</div>
		</el-dialog>
  </div>
</template>

<script>
import { 
  getDayRecordByMonthAndItem,
  getIncomeDetailByDayAndItem,
  getOtherOutDetailByDayAndItem,
  getOutDetailByDayAndItem,
  getPercentageDetailByDayAndItem,
  getWorkTypeList 
} from "../../request/api.js";
import moment from "moment";
export default {
  name: "formC",
  data() {
    return {
      source: ['库存', '询价', '外购'],
      workType: [],
      search: {
        time: [
          moment(new Date()).format("YYYY-MM-01"),
          moment(new Date()).endOf("month").format("YYYY-MM-DD")
        ],
        groupId: null,
        gid: localStorage.getItem('gid')
      },
      tableData: [],
      maxHeight: undefined,
      pageLength: null,
      size: 10,
      page: 0,
      info1: {
        title: '',
        status: false,
        data: []
      },
      info2: {
        title: '',
        status: false,
        data: []
      },
      info3: {
        title: '',
        status: false,
        data: []
      },
      info4: {
        title: '',
        status: false,
        data: []
      },
      totalIncomeAmount: 0,
      totalOutAmount: 0
    };
  },
  created() {
    getWorkTypeList().then(res => {
      this.workType = res.data.data
      this.search.groupId = this.workType[0].id
    })
    this.getList()
  },
  mounted() {
    this.maxHeight = $(".tabBox").height() - 240 + "px";
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val - 1;
      this.getList()
    },
    getList() {
      if (this.search.time) {
        this.search.time.forEach((i, index) => {
          this.search.time[index] = moment(i).format("YYYY-MM-DD");
        });
      }
      
      const data = {
        endDate: this.search.time ? moment(this.search.time[1]).endOf("month").format("YYYY-MM-DD") : '',
        beginDate: this.search.time ? moment(this.search.time[0]).format("YYYY-MM-01") : '',
        groupId: this.search.groupId,
        gid: localStorage.getItem('gid')
      }
      getDayRecordByMonthAndItem(data).then(res => {
        this.tableData = res.data.data.incomeSumList
        this.totalIncomeAmount = res.data.data.totalIncomeAmount
        this.totalOutAmount = res.data.data.totalOutAmount
      });
    },
    viewInfo(row, type) {
      const data = {
        bizDate: row.bizDate,
        gid: localStorage.getItem('gid'),
        groupId: this.search.groupId
      }

      if(type == 1) { //营业收入明细
        getIncomeDetailByDayAndItem(data).then(res => {
          this.info1.title = `${row.bizDate} 营业收入明细表`
          this.info1.data = res.data.data
          this.info1.status = true
        })
      }else if(type == 2) { //配件支出
        getOutDetailByDayAndItem(data).then(res => {
          this.info2.title = `${row.bizDate} 配件支出明细表`
          this.info2.data = res.data.data
          this.info2.status = true
        })
      }else if(type == 3) { //其他支出
        getOtherOutDetailByDayAndItem(data).then(res => {
          this.info3.title = `${row.bizDate} 其他支出明细表`
          this.info3.data = res.data.data
          this.info3.status = true
        })
      }else if(type == 4) { //提成支出
        getPercentageDetailByDayAndItem(data).then(res => {
          this.info4.title = `${row.bizDate} 提成支出明细表`
          this.info4.data = res.data.data
          this.info4.status = true
        })
      }
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
    		type:6 //挂账报表
      }
    	excel(data,"挂账报表").then(()=>{})
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
  .orderTables >>> table tr th {
		background: #E5F6F7;
    color: #0D906E;
	}
  .orderTables >>> font {
    cursor: pointer;
  }
  #printBox >>> .el-table td, .el-table th {
    padding: 10px 0;
  }
</style>
