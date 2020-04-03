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
            <el-button
              type="success"
              icon="el-icon-search"
              @click="searchList()"
              >查找</el-button>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <el-row>
      <el-col :span="12">
        <div style="width:100%;padding-top:15px;" class="orderTable" id="printBox">
          <el-table :data="tableData" :max-height="maxHeight" highlight-current-row @current-change="handleCurrentChange" style="width: 100%">
            <el-table-column type="index" width="60"></el-table-column>
            <el-table-column prop="billNumber" label="单号"> </el-table-column>
            <el-table-column prop="carNo" label="车牌号"></el-table-column>
            <el-table-column prop="createdDate" label="收款时间"> </el-table-column>
            <el-table-column prop="amountReceivable" label="应收"> </el-table-column>
            <el-table-column prop="amountActual" label="实收"> </el-table-column>
						<el-table-column prop="employeeName" label="操作"> 
							<template slot-scope="scope">
								<span style="color:#0d906e;cursor:pointer;" v-if="scope.row.percentageStatus == 1" @click.stop="settingRow(scope.row, 0)">已设置</span>
								<span style="color:red;cursor:pointer;" v-else @click.stop="settingRow(scope.row, 1)">未设置</span>
							</template>
            </el-table-column>
          </el-table>
          <!-- <div class="p-tb-10 text-center">
            <el-pagination
              :hide-on-single-page="pageLength === 0"
              background
              layout="prev, pager, next"
              :page-size="size"
              @current-change="handleCurrentChange"
              :total="pageLength"
            >
            </el-pagination>
          </div> -->
        </div>
      </el-col>
      <el-col :span="12">
        <div style="width:100%;padding-top:15px;" class="orderTable">
          <el-table :data="tableData1" :max-height="maxHeight" style="width: 100%">
            <el-table-column type="index" width="60"></el-table-column>
            <el-table-column prop="percentageName" label="提成项"> </el-table-column>
            <el-table-column prop="percentageType" label="提成类别"></el-table-column>
            <el-table-column prop="percentageAmout" label="提成金额"> </el-table-column>
            <el-table-column prop="percentagePoint" label="提成占比">
							<template slot-scope="scope">
								{{scope.row.percentagePoint*100 + '%'}}
							</template>
						</el-table-column>
						<el-table-column prop="percentageClassName" label="提成分类"></el-table-column>
            <el-table-column prop="nameArr" label="员工姓名"> </el-table-column>
            <el-table-column prop="employeeName" label="操作"> 
              <template slot-scope="scope">
                <el-button type="success" size="mini" :disabled="selectOrder.percentageStatus == 1" @click="royaltyConfim(scope.row.sourceType, scope.row)">设置</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- <div class="p-tb-10 text-center">
            <el-pagination
              :hide-on-single-page="pageLength === 0"
              background
              layout="prev, pager, next"
              :page-size="size"
              @current-change="handleCurrentChange"
              :total="pageLength"
            >
            </el-pagination>
          </div> -->
        </div>
      </el-col>
    </el-row>

    <el-dialog :title="royaltyInfo.royaltyName + '提成设置'" :visible.sync="royaltyVisible" center width="35%" :modal="false">
				<div class="royalty">
					<el-row :gutter="20">
						<el-col :span="5">{{royaltyInfo.name}}</el-col>
						<el-col :span="5" style="text-align:center;"><font color="red">￥{{royaltyInfo.price}}</font></el-col>
						<el-col :span="9"><el-cascader v-model="royaltyInfo.percentageClassId" @change="treeChange" :options="treeData" :show-all-levels="false"></el-cascader></el-col>
						<el-col :span="5" style="text-align:right; cursor: pointer;" ><div style="color:#0d906e" @click="addPercentage">添加员工</div></el-col>
					</el-row>
				</div>
				<div class="royalty" style="padding:10px 0;" v-if="royaltyInfo.percentage && royaltyInfo.percentage.percentageWay">
					<el-row :gutter="20">
						<el-col :span="4">模板信息</el-col>
						<el-col :span="19">
							<span>提成方式：<font color="#0d906e">{{royaltyInfo.percentage.percentageWay == 1 ? '提成点' : '固定'}}</font></span>
							<span style="padding-left: 20px;">是否按职务提成：<font color="#0d906e">{{royaltyInfo.percentage.isByPosition == true ? '是' : '否'}}</font></span>
							<span style="padding-left: 20px;" v-if="royaltyInfo.percentage.isByPosition != true && royaltyInfo.percentage.percentageMethod">分成方式：<font color="#0d906e">{{royaltyInfo.percentage.percentageMethod == 1 ? '总额均分' : '等额提成'}}</font></span><br>
							<span style="padding-top: 20px;" v-if="royaltyInfo.percentage.percentagePoint || royaltyInfo.percentage.percentageAmout">
								所有人：<font color="#0d906e">{{royaltyInfo.percentage.percentageWay == 1 ? royaltyInfo.percentage.percentagePoint + '%' : royaltyInfo.percentage.percentageAmout + '元'}}</font>
							</span>
							<span style="padding-top: 20px;" v-if="royaltyInfo.percentage.percentagePointYW || royaltyInfo.percentage.percentageAmoutYW">
								业务员：<font color="#0d906e">{{royaltyInfo.percentage.percentageWay == 1 ? royaltyInfo.percentage.percentagePointYW + '%' : royaltyInfo.percentage.percentageAmoutYW + '元'}}</font>
							</span>
							<span style="padding-left: 20px;" v-if="royaltyInfo.percentage.percentagePointJD || royaltyInfo.percentage.percentageAmoutJD">
								接待员：<font color="#0d906e">{{royaltyInfo.percentage.percentageWay == 1 ? royaltyInfo.percentage.percentagePointJD + '%' : royaltyInfo.percentage.percentageAmoutJD + '元'}}</font>
							</span>
							<span style="padding-left: 20px;" v-if="royaltyInfo.percentage.percentagePointCW || royaltyInfo.percentage.percentageAmoutCW">
								施工员：<font color="#0d906e">{{royaltyInfo.percentage.percentageWay == 1 ? royaltyInfo.percentage.percentagePointCW + '%' : royaltyInfo.percentage.percentageAmoutCW + '元'}}</font>
							</span>
							<span style="padding-left: 20px;" v-if="royaltyInfo.percentage.percentagePointSG || royaltyInfo.percentage.percentageAmoutSG">
								主管:<font color="#0d906e">{{royaltyInfo.percentage.percentageWay == 1 ? royaltyInfo.percentage.percentagePointSG + '%' : royaltyInfo.percentage.percentageAmoutSG + '元'}}</font>
							</span>
						</el-col>
					</el-row>
				</div>
				<div class="royalty" v-for="(item, index) in royaltyForm.percentages" :key="index">
					<el-row :gutter="20">
						<el-col :span="12">{{item.employeeName}}<span v-if="royaltyInfo.percentage && royaltyInfo.percentage.isByPosition == true">（{{item.roleName}}）</span></el-col>
						<el-col :span="12" style="text-align:right;cursor: pointer;" ><div @click="deletePercentage(index)"><font color="red">删除</font></div></el-col>
					</el-row>
					<el-row :gutter="20" type="flex" justify="space-around" align="middle">
						<el-col :span="4">{{royaltyInfo.royaltyName}}提成</el-col>
						<el-col :span="10">
							<el-row type="flex" align="middle">
								<el-col :span="10"><el-radio v-model="item.percentageWay" :label="1">百分比</el-radio></el-col>
								<el-col :span="14">
									<el-input v-model="item.percentagePoint">
										<template slot="append">%</template>
									</el-input>
								</el-col>
							</el-row>
						</el-col>
						<el-col :span="10">
							<el-row type="flex" align="middle">
								<el-col :span="10"><el-radio v-model="item.percentageWay" :label="2">固定</el-radio></el-col>
								<el-col :span="14"><el-input v-model="item.percentageAmout"></el-input></el-col>
							</el-row>
						</el-col>
					</el-row>
				</div>
				<div slot="footer" class="dialog-footer">
					<el-button type="danger" @click="royaltyVisible = false">取 消</el-button>
					<el-button type="success" @click="royaltySubmit">提 交</el-button>
				</div>
			</el-dialog>

			<el-dialog title="选择员工" :visible.sync="userVisible" center :modal="false">
				<el-table :data="userData" @selection-change="selectUser">
					<el-table-column label="序号">
						<template slot-scope="scope">{{ scope.row.id }}</template>
					</el-table-column>
					<el-table-column label="姓名">
						<template slot-scope="scope">{{ scope.row.realName }}</template>
					</el-table-column>
					<el-table-column label="部门">
						<template slot-scope="scope">
							{{ scope.row.groupDutyList ?  scope.row.groupDutyList.groupName + scope.row.groupDutyList.dutyName : '' }}
						</template>
					</el-table-column>
					<el-table-column label="手机">
						<template slot-scope="scope">{{ scope.row.phone }}</template>
					</el-table-column>
					<el-table-column type="selection" width="55"></el-table-column>
				</el-table>
				<div slot="footer" class="dialog-footer">
					<el-button type="danger" @click="userVisible = false">取 消</el-button>
					<el-button type="success" @click="userSubmit">提 交</el-button>
				</div>
			</el-dialog>
  </div>
</template>

<script>
import { queryPercentageClass, queryPercentageClassOne, queryOrderPercentageList, getOrderPercentageDetail, getOrderPercentages, addOrderPercentage, findAllGroupByRole, setPercentageStatus} from "../../request/api.js";
import moment from "moment";
export default {
  name: "formG",
  data() {
    return {
      treeData: [],
      royaltyVisible: false,
      royaltyForm: {
				sourceType: 1,
				sourceId: '',
				percentages: []
			},
			royaltyInfo: {
				name: '',
				royaltyName: '业务',
				price: 0,
				percentageClassId: '',
				percentage: {}
			},
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
			tableData1: [],
      maxHeight: undefined,
      pageLength: null,
      size: 10,
			page: 0,
			selectOrder: {},
			userData: [],
			userVisible: false,
			selectedUser: []
    };
  },
  created() {
		queryPercentageClass().then(res => {
			this.treeData = res.data.data.map(v => {
				v.value = v.id
				v.label = v.className
				if(v.children) v.children.forEach(k => {
					k.label = k.className
					k.value = k.id
				}) 
				return v
			})
		})
    let nowTime = moment(new Date()).format("YYYY-MM-DD");
    const data = {
      endDate: nowTime,
      beginDate: nowTime,
      page: this.page,
      size: this.size
    };
    this.getList(data);
  },
  mounted() {
    this.maxHeight = $(".tabBox").height() - 235 + "px";
  },
  methods: {
    handleCurrentChanges(val) {
      this.page = val - 1;
      if (
        this.search.time !== undefined &&
        this.search.time !== null &&
        this.search.time.length > 0
      ) {
        const data = {
          endDate: this.search.time[1],
          beginDate: this.search.time[0],
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
      queryOrderPercentageList(data).then(res => {
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
        beginDate: this.search.time[0],
        page: this.page,
        size: this.size
      };
      this.getList(data);
    },
    royaltyConfim(type, info){
			this.royaltyForm.oid = this.selectOrder.oid
			this.royaltyForm.sourceType = type
			this.royaltyForm.sourceId = info.sourceId
			this.royaltyForm.percentages = []
			
			getOrderPercentages({sourceType: type, sourceId: info.sourceId}).then(res => {
				const data = res.data.data
				if(data.length > 0){
					this.royaltyForm.percentages = data
					const typeName = ['业务', '工时', '配件']
					const name = ['整单金额', 'itemName', 'partName']

					const percentageClassId = info.percentageClassId ? info.percentageClassId : this.royaltyForm.percentages.length > 0 ? this.royaltyForm.percentages[0].percentageClassId : ''
					this.royaltyInfo = {
						name: info.percentageName,
						royaltyName: typeName[type - 1],
						price: info.sourceAmount, 
						percentageClassId: percentageClassId
					}

					queryPercentageClassOne({id: percentageClassId}).then(res => {
						this.royaltyInfo.percentage = res.data.data
						this.royaltyInfo.percentageClassId = percentageClassId
					})
				}else{
					this.royaltyForm.percentages = info.employeeVOList
				}
				this.royaltyVisible = true
			})
		},
    royaltySubmit() {
			this.royaltyForm.percentages.forEach(v => {
				if(v.percentageWay == 1) {
					v.percentageAmout = (parseInt(v.percentagePoint) * this.royaltyInfo.price) / 100
				}
			})
			this.royaltyForm.percentageClassId = this.royaltyInfo.percentage.id
			addOrderPercentage(this.royaltyForm).then(res => {
				if(res.data.code == 200){
					this.$message({
						type: 'success',
						message: '保存成功!'
					})
					this.royaltyVisible = false
				}
			})
		},
		settingRow(row, type) {
			const data = {
				oid: row.oid,
				percentageStatus: parseInt(type)
			}
			setPercentageStatus(data).then(res => {
				if(res.data.code == 200){
					this.$message({
						type: 'success',
						message: '操作成功!'
					})
					const datas = {
						endDate: this.search.time[1],
						beginDate: this.search.time[0],
						page: this.page,
						size: this.size
					}
					this.getList(datas)
				}
			})
		},
    handleCurrentChange(event) {
			this.selectOrder = event
			getOrderPercentageDetail({oid: event.oid}).then(res => {
				this.tableData1 = res.data.data.map(v => {
					if(v.employeeVOList) {
						v.nameArr = v.employeeVOList.map(k => k.employeeName).join('、')
					}
					return v
				})
			})
		},
		deletePercentage(index) {
			this.royaltyForm.percentages.splice(index, 1)
		},
		addPercentage(){
			findAllGroupByRole().then(res => {
				const data = res.data.data.find(v => v.onJob == 1)
				this.userData = data.orgEmployeeDTOList
				this.userVisible = true
			})
		},
		selectUser(event){
			this.selectedUser = event.map(v => {
				return {
					employeeName: v.realName,
					employeeId: v.id,
					percentageWay: 1,
					...v
				}
			})
		},
		userSubmit() {
			this.selectedUser.forEach(v => {
				const role = v.role.split(',').slice(-1)[0]
				v.role = role
				const check = this.royaltyForm.percentages.find(k => k.employeeId == v.id)
				const percentage = this.royaltyInfo.percentage
				if(percentage && percentage.percentageWay){
					v.percentageWay = percentage.percentageWay
					if(percentage.isByPosition == true){ //按职务提成
						switch (role) {
							case '4':
								v.roleName = '业务员'
								v.percentagePoint = percentage.percentagePointYW
								v.percentageAmout = percentage.percentageAmoutYW
								break;
							case '3':
								v.roleName = '施工员'
								v.percentagePoint = percentage.percentagePointSG
								v.percentageAmout = percentage.percentageAmoutSG
								break;
							case '2':
								v.roleName = '财务员'
								v.percentagePoint = percentage.percentagePointCW
								v.percentageAmout = percentage.percentageAmoutCW
								break;
							case '1':
								v.roleName = '接单员'
								v.percentagePoint = percentage.percentagePointJD
								v.percentageAmout = percentage.percentageAmoutJD
								break;
						}
					}else{
						if(percentage.percentageWay == 2){ //固定
							if(percentage.percentageMethod == 1){ //总额均分
								const price = (percentage.percentageAmout / this.selectedUser.length).toFixed(2)
								v.percentageAmout = price
							}else{
								v.percentageAmout = percentage.percentageAmout.toFixed(2)
							}
						}else{
							//const itemPrice = this.royaltyInfo.price
							if(percentage.percentageMethod == 1){
								//const price = ((itemPrice * (percentage.percentagePoint / 100)) / this.selectedUser.length).toFixed(2)
								v.percentagePoint = (percentage.percentagePoint / this.selectedUser.length).toFixed(2)
							}else{
								//v.percentagePoint = (itemPrice * (percentage.percentagePoint / 100)).toFixed(2)
								v.percentagePoint = (percentage.percentagePoint).toFixed(2)
							}
						}
					}
				}
				const info = JSON.parse(JSON.stringify(v))
				if(!check) this.royaltyForm.percentages.push(info)
			})
			this.userVisible = false
		},
		treeChange(event){
			let id = event.slice(-1)[0]
			queryPercentageClassOne({id: id}).then(res => {
				this.royaltyInfo.percentage = JSON.parse(JSON.stringify(res.data.data))
				this.royaltyInfo.percentageClassId = id
				this.arrChange()
			})
		},
		arrChange(){
			this.royaltyForm.percentages.forEach(v => {
				const role = v.role
				const percentage = this.royaltyInfo.percentage
				if(percentage && percentage.percentageWay){
					v.percentageWay = percentage.percentageWay
					if(percentage.isByPosition == true){ //按职务提成
						switch (role) {
							case '4':
								v.roleName = '业务员'
								v.percentagePoint = percentage.percentagePointYW
								v.percentageAmout = percentage.percentageAmoutYW
								break;
							case '3':
								v.roleName = '施工员'
								v.percentagePoint = percentage.percentagePointSG
								v.percentageAmout = percentage.percentageAmoutSG
								break;
							case '2':
								v.roleName = '财务员'
								v.percentagePoint = percentage.percentagePointCW
								v.percentageAmout = percentage.percentageAmoutCW
								break;
							case '1':
								v.roleName = '接单员'
								v.percentagePoint = percentage.percentagePointJD
								v.percentageAmout = percentage.percentageAmoutJD
								break;
						}
					}else{
						if(percentage.percentageWay == 2){ //固定
							if(percentage.percentageMethod == 1){ //总额均分
								const price = (percentage.percentageAmout / this.royaltyForm.percentages.length).toFixed(2)
								v.percentageAmout = price
							}else{
								v.percentageAmout = percentage.percentageAmout.toFixed(2)
							}
							v.percentagePoint = ''
						}else{
							//const itemPrice = this.royaltyInfo.price
							if(percentage.percentageMethod == 1){
								//const price = ((itemPrice * (percentage.percentagePoint / 100)) / this.selectedUser.length).toFixed(2)
								v.percentagePoint = (percentage.percentagePoint / this.royaltyForm.percentages.length).toFixed(2)
							}else{
								//v.percentagePoint = (itemPrice * (percentage.percentagePoint / 100)).toFixed(2)
								v.percentagePoint = (percentage.percentagePoint).toFixed(2)
							}
							v.percentageAmout = ''
						}
					}
				}
			})
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
