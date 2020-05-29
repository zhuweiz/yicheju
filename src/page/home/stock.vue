<template>
  <div class="w-100 order flex-col">
    <div class="p-15" style="background:rgba(229,246,247,1);">
      <el-row :gutter="10">
        <el-form :inline="true" class="demo-form-inline">
          <el-col>
            <el-form-item label="名称" class="m-b-0">
              <el-input
                v-model="search.search"
                placeholder=""
                style="width:100%;"
              ></el-input>
            </el-form-item>
            <el-form-item label="规格型号" class="m-b-0">
              <el-input
                v-model="search.model"
                placeholder=""
                style="width:100%;"
              ></el-input>
            </el-form-item>
            <el-form-item label="编码" class="m-b-0">
              <el-input
                v-model="search.partNo"
                placeholder=""
                style="width:100%;"
              ></el-input>
            </el-form-item>
            <el-button
              type="success"
              icon="el-icon-search"
              @click="getList()"
              >查找</el-button>
            <el-button type="success"	icon="el-icon-plus" @click="addDig">配件</el-button>

            <el-form-item label="" class="m-b-0 right m-r-20">
                <div class="left c-p c-9">
                  <el-upload
                    class="upload-demo"
                    action=""
                    :on-change="upload"
                    :show-file-list="false"
                    :auto-upload="false"
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel">
                    <el-button size="small" type="success">从excel导入</el-button>
                  </el-upload>
                </div>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <div style="width:100%;padding-top:15px;" class="orderTable" id="printBox">
      <el-table :data="tableData" :max-height="maxHeight" :height="500" style="width: 100%">
        <el-table-column type="index" label="序号"> </el-table-column>
        <el-table-column prop="partName" label="名称" width="150"></el-table-column>
        <el-table-column prop="model" label="规格型号" width="150"> </el-table-column>
        <el-table-column prop="unit" label="单位"> </el-table-column>
        <el-table-column prop="exceeds" label="进价"> </el-table-column>
        <el-table-column prop="sellPrice" label="售价"> </el-table-column>
        <el-table-column prop="total" label="库存"></el-table-column>
        <el-table-column prop="upperLimit" label="上限量"></el-table-column>
        <el-table-column prop="lowerLimit" label="下限量"> </el-table-column>
        <el-table-column prop="partNo" label="编码"> </el-table-column>
        <el-table-column prop="employeeName" label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-dropdown @command="handleCommand" trigger="click">
              <span class="el-dropdown-link">
                操作<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="beforeHandleCommand('a',scope.row)">修改</el-dropdown-item>
                <el-dropdown-item :command="beforeHandleCommand('b',scope.row)">删除</el-dropdown-item>
                <el-dropdown-item :command="beforeHandleCommand('c',scope.row)">出库</el-dropdown-item>
                <el-dropdown-item :command="beforeHandleCommand('d',scope.row)">入库</el-dropdown-item>
                <el-dropdown-item :command="beforeHandleCommand('e',scope.row)">出入库记录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
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
        >
        </el-pagination>
      </div>
    </div>

    <el-dialog :title="title" :visible.sync="editStatus" center width="30%" :modal="false">
      <el-form :model="editPartsForm">
        <el-form-item label="名称" label-width="100px">
          <el-input v-model="editPartsForm.partName" :disabled="title === '修改配件'"></el-input>
        </el-form-item>
        <el-form-item label="规格型号" label-width="100px">
          <el-input v-model="editPartsForm.model"  :disabled="title === '修改配件'"></el-input>
        </el-form-item>
        <el-form-item label="适用车型" label-width="100px">
          <el-input v-model="editPartsForm.fitCars"  :disabled="title === '修改配件'"></el-input>
        </el-form-item>
        <el-form-item label="单位" label-width="100px">
          <el-input v-model="editPartsForm.unit"  :disabled="title === '修改配件'"></el-input>
        </el-form-item>
        <el-form-item label="进价" label-width="100px">
          <el-input v-model="editPartsForm.exceeds"  :disabled="title === '修改配件'"></el-input>
        </el-form-item>
        <el-form-item label="售价" label-width="100px">
          <el-input v-model="editPartsForm.sellPrice"></el-input>
        </el-form-item>
        <el-form-item label="上限" label-width="100px">
          <el-input v-model="editPartsForm.upperLimit"></el-input>
        </el-form-item>
        <el-form-item label="下限" label-width="100px">
          <el-input v-model="editPartsForm.lowerLimit"></el-input>
        </el-form-item>
        <el-form-item label="编码" label-width="100px">
          <el-input v-model="editPartsForm.partNo"  :disabled="title === '修改配件'"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="editStatus = false">取 消</el-button>
        <el-button type="success" @click="editFormSubmit">提 交</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title1" :visible.sync="storeStatus" center width="30%" :modal="false">
      <el-form :model="storeForm">
        <el-form-item label="名称" label-width="100px">
          {{storeForm.partName}}
        </el-form-item>
        <el-form-item label="规格型号" label-width="100px">
          {{storeForm.model}}
        </el-form-item>
        <el-form-item label="出库数量" label-width="100px" v-if="title1 === '配件出库'">
          <el-input v-model="storeForm.count"></el-input>
        </el-form-item>
          <el-form-item label="入库数量" label-width="100px" v-if="title1 === '配件入库'">
          <el-input v-model="storeForm.count"></el-input>
        </el-form-item>
        <el-form-item label="备注" label-width="100px">
          <el-input v-model="storeForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="storeStatus = false">取 消</el-button>
        <el-button type="success" @click="storeFormSubmit">提 交</el-button>
      </div>
    </el-dialog>

    <el-dialog title="出入库记录" :visible.sync="historyStatus" width="60%" center :modal="false">
      <el-form
          :inline="true"
          class="demo-form-inline"
        >
        <el-row>
          <el-col>
            <el-form-item label="配件名称：" class="m-b-0">
              {{historyInfo.partName}}
            </el-form-item>
            <el-form-item label="型号：" class="m-b-0">
              {{historyInfo.model}}
            </el-form-item>
            <el-form-item label="供应商：" class="m-b-0">
              {{historyInfo.supplierName}}
            </el-form-item>
            <el-form-item label="编号：" class="m-b-0">
              {{historyInfo.partNo}}
            </el-form-item> 
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="日期" class="m-b-0">
              <el-date-picker
                v-model="searchTime"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                unlink-panels
                :picker-options="pickerOptions"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item
              label=""
              class="m-b-0"
            >
              <el-checkbox-group v-model="searchType">
                <el-checkbox label="0">入库记录</el-checkbox>
                <el-checkbox label="1">出库记录</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-button
              type="success"
              icon="el-icon-search"
              @click="getHistory"
            >查找</el-button>
            <el-form-item
              label=""
              class="m-b-0 right m-r-20"
            >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="history">
        <el-table-column prop="createdDate" label="日期"></el-table-column>
        <el-table-column prop="model" label="类型">
          <template slot-scope="scope">
            {{scope.row.type == 0 ? '入库' : '出库'}}
          </template>
        </el-table-column>
        <el-table-column prop="count" label="数量"> </el-table-column>
        <el-table-column prop="carNo" label="车牌"> </el-table-column>
        <el-table-column prop="billNumber" label="工单号"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="historyStatus = false">退 出</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPart, addPart, updatePart, saveRecord, deletePart, pageRecords } from "../../request/api.js"
import moment from 'moment'
export default {
  data() {
    return {
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
      search: {
        garageId: localStorage.getItem('gid'),
        search: "",
        model: '',
        partNo: ''
      },
      tableData: [],
      maxHeight: undefined,
      pageLength: null,
      size: 10,
      page: 0,
      title: '添加配件',
      editStatus: false,
      editPartsForm: {},
      title1: '配件出库',
      storeStatus: false,
      storeForm: {},
      supplier: [],
      historyStatus: false,
      history: [],
      searchTime: [
        moment(new Date()).format("YYYY-MM-DD"),
        moment(new Date()).format("YYYY-MM-DD")
      ],
      searchType: [],
      historySearch: {},
      historyInfo: {}
    };
  },
  created() {
    this.getList()
  },
  mounted() {
    this.maxHeight = $(".tabBox").height() - 235 + "px";
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val - 1;
      this.getList()
    },
    getList() {
      const data = {
        page: this.page,
        size: this.size,
        ...this.search
      }
      getPart(data).then(res => {
        this.pageLength = res.data.pageInfo.total
        this.tableData = res.data.data
      })
    },
    editFormSubmit() {
              console.log(this.editPartsForm)
      if(this.title === '添加配件'){
        addPart(this.editPartsForm).then(res => {
          if(res.data.code == 200){
            this.$message({
              type: 'success',
              message: '添加成功!'
            })
            this.getList()
            this.editStatus = false
          }
        })
      }else{
        console.log(this.editPartsForm)
        updatePart(this.editPartsForm).then(res => {
          if(res.data.code == 200){
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.getList()
            this.editStatus = false
          }
        })
      }
    },
    storeFormSubmit() {
      let type = ''
      if(this.title1 === '配件出库'){
        type = 1
      }else{
        type = 0
      }
      
      this.storeForm.type = type

      saveRecord(this.storeForm).then(res => {
        if(res.data.code == 200){
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.getList()
          this.storeStatus = false
        }
      })
    },
    upload(file,fileList){
        let files = {0:file.raw}
        this.readExcel1(files);
    },
    async readExcel1(files) {//表格导入
        var that = this;
        if(files.length<=0){//如果没有文件名
            return false;
        }else if(!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())){
            this.$Message.error('上传格式不正确，请上传xls或者xlsx格式');
            return false;
        }

        const fileReader = new FileReader();
        fileReader.onload = async (ev) => {
            try {
                const data = ev.target.result;
                const workbook = XLSX.read(data, {
                    type: 'binary'
                });
                const wsname = workbook.SheetNames[0];//取第一张表
                const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]);//生成json表格内容
                console.log(ws, 1);
                let addList = ws.map(v => {
                  return {
                    IsFactioryPartName: 0,
                    gid: localStorage.getItem('gid'),
                    partNo: v['零件编码'],
                    partName: v['零件名'],
                    unit: v['单位'],
                    model: v['规格型号'],
                    fitCars: v['车型'],
                    total: v['数量'],
                    exceeds: v['进价'],
                    sellPrice: v['售价'],
                    upperLimit: v['上限数'],
                    lowerLimit: v['下限数'],
                  }
                })
                const loading = this.$loading({
                  lock: true,
                  text: '导入中',
                  spinner: 'el-icon-loading',
                  background: 'rgba(0, 0, 0, 0.7)'
                });
                for (const i in addList) {
                  await addPart(addList[i])
                }
                loading.close()
                this.getList()
                this.$message({
                  type: 'success',
                  message: '导入成功'
                })
                try{
                    
                }catch(err){
                    console.log(err)
                }
                
                this.$refs.upload.value = '';
    
            } catch (e) {
    
                return false;
            }
        };
        fileReader.readAsBinaryString(files[0]);
    },
    addDig() {
      this.editPartsForm = {
        IsFactioryPartName: 0,
        gid: localStorage.getItem('gid')
      }
      this.title = '添加配件'
      this.editStatus = true
    },
    editDig(row) {
      this.editPartsForm = {
        IsFactioryPartName: 0,
        gid: localStorage.getItem('gid'),
        ...row
      }
      this.title = '修改配件'
      this.editStatus = true
    },
    storeDig(row, title) {
      this.storeForm = row
      this.title1 = title
      this.storeStatus = true
    },
    deleteStock(row) {
      if(row.total > 0) return this.$message({type: 'error',message: '库存大于0的配件不允许删除，请先出库后删除！'})
      this.$confirm(`确认删除${row.partName}吗?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					deletePart({id: row.id}).then(res => {
						const result = res.data
						if(result.code == 200){
							this.$message({
								type: 'success',
								message: '删除成功'
							})
							this.getList()
						}
					})
				}).catch(() => {})
    },
    handleCommand(command){
      switch (command.command) {
        case "a":
        　　this.editDig(command.row)
        　　break;
        case "b":
        　　this.deleteStock(command.row);
        　　break;
        case "c":
        　　this.storeDig(command.row, '配件出库');
          　　break;
        case "d":
        　　this.storeDig(command.row, '配件入库');
          　　break;
        case "e":
        　　this.historyDig(command.row);
          　　break;
      }
    },
    beforeHandleCommand(item,row){
      return {
        'command': item,
        'row': row
      }
    },
    historyDig(row){
      this.historyStatus = true
      this.historyInfo = row
      this.history = []
      this.getHistory()
    },
    getHistory(){
      const data = {
        partId: this.historyInfo.id,
        endDate: moment(this.searchTime[1]).format("YYYY-MM-DD"),
        beginDate: moment(this.searchTime[0]).format("YYYY-MM-DD"),
        page: 0,
        size: 1000
      }
      if(this.searchType.length > 0) data.type = this.searchType.join(',')
      pageRecords(data).then(res => {
        this.history = res.data.data
      })
    }
  }
}
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
<style>
.el-loading-spinner .el-loading-text {
  text-align: center;
}
</style>
