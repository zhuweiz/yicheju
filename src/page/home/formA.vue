<template>
	<div class="w-100 order flex-col">
		<div class="p-15" style="background:rgba(229,246,247,1);">
			<el-form :inline="true" class="demo-form-inline">
				<el-row>
					<el-col>
						<el-form-item label="日期" class="m-b-0">
							<el-date-picker v-model="search.time" type="monthrange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" unlink-panels>
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
		<div style="width:100%;" id="printBox">
			<el-row :gutter="0">
				<el-col :xs="24" :md="12" class="tableLeft">
					<div class="c-white" style="background:#FF6757;height:41px;line-height:41px;text-indent:20px;">总收入：{{sumIncome}}元</div>
					<el-table :data="tableData" border :max-height="maxHeight" :summary-method="getSummariesIn" style="width: 100%">
						<el-table-column label="项目" prop="groupName">
						</el-table-column>
						<el-table-column prop="totalIncomeAmount" label="金额">
						</el-table-column>
						<el-table-column prop="remark" label="备注">
						</el-table-column>
					</el-table>
				</el-col>
				<el-col :xs="24" :md="12" class="tableRight">
					<div class="c-white" style="background:#0D906E;height:41px;line-height:41px;text-indent:20px;">总支出：{{sumPay}}元</div>
					<el-table :data="tableData" border :summary-method="getSummariesOut" show-summary :max-height="maxHeight" style="width: 100%">
						<el-table-column label="项目" prop="groupName">
						</el-table-column>
						<el-table-column prop="totalSpendAmount" label="金额">
						</el-table-column>
						<el-table-column prop="remark" label="备注">
						</el-table-column>
					</el-table>
				</el-col>
			</el-row>

		</div>
	</div>
</template>

<script>
	import { form1,excel } from "../../request/api.js";
	import moment from 'moment';
	export default {
		name: "formA",
		data() {
			return {
				search: {
					time: [
						moment(new Date()).format("YYYY-MM-01"),
            moment(new Date()).endOf("month").format("YYYY-MM-DD")
					]
				},
				
				tableData: [],
				maxHeight: undefined,
				sumIncome: 0,
				sumPay: 0,
			};
		},
		created() {
			let nowTime = moment(new Date()).format("YYYY-MM-DD")
			const data = {
				endTime: moment(new Date()).format("YYYY-MM-30"),
				starTime: moment(new Date()).format("YYYY-MM-01")
			}
			form1(data).then((res) => {
				this.tableData = res.data.data
			})
		},
		mounted() {
			this.maxHeight = $(".tabBox").height() - 240 + "px"
		},
		methods: {
			getSummariesIn(param) {
				const {
					columns,
					data
				} = param;
				const sums = [];
				columns.forEach((column, index) => {
					if(index === 0) {
						sums[index] = '总数';
						return;
					}
					if(index === 2) {
						sums[index] = '';
						return;
					}
					const values = data.map(item => Number(item[column.property]));
					if(!values.every(value => isNaN(value))) {
						sums[index] = values.reduce((prev, curr) => {
							const value = Number(curr);
							if(!isNaN(value)) {
								return prev + curr;
							} else {
								return prev;
							}
						}, 0);
						sums[index];
						this.sumIncome = sums[index]
					} else {
						sums[index] = 'N/A';
					}
				});
				return sums;
			},
			getSummariesOut(param) {
				const {
					columns,
					data
				} = param;
				const sums = [];
				columns.forEach((column, index) => {
					if(index === 0) {
						sums[index] = '';
						return;
					}
					if(index === 2) {
						sums[index] = '';
						return;
					}
					const values = data.map(item => Number(item[column.property]));
					if(!values.every(value => isNaN(value))) {
						sums[index] = values.reduce((prev, curr) => {
							const value = Number(curr);
							if(!isNaN(value)) {
								return prev + curr;
							} else {
								return prev;
							}
						}, 0);
						sums[index];
						this.sumPay = sums[index]
					} else {
						sums[index] = 'N/A';
					}
				});
				return;
			},
			searchList() {
				if(this.search.time) {
					this.search.time.forEach((i, index) => {
						this.search.time[index] = moment(i).format("YYYY-MM-DD")
					})
				} else {
					this.$message({
						message: '请选择查询日期！',
						type: 'warning'
					});
					return false
				}
				const data = {
					endTime: this.search.time[1],
					starTime: this.search.time[0]
				}
				form1(data).then((res) => {
					this.tableData = res.data.data
				})
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
    		type:8 //月报总表
      }
    	excel(data,"月报总表").then(()=>{})
    }
		}
	};
</script>
<style scoped>

</style>
<style>
	.tableLeft {
		padding-top: 10px;
		padding-right: 5px;
	}
	
	.tableLeft table tr th {
		background: #F7E8E5;
		color: #FF6757;
	}
	
	.tableRight {
		padding-top: 10px;
		padding-left: 5px;
	}
	
	.tableRight table tr th {
		background: #E5F6F7;
		color: #0D906E;
	}
</style>

