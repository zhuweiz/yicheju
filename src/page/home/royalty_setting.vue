<template>
  <div class="w-100 order flex-col">
    <div class="p-15" style="background:rgba(229,246,247,1);">
      <el-row :gutter="10">
        <el-form :inline="true" class="demo-form-inline">
          <el-col>
            <el-form-item label="" class="m-b-0 right m-r-20">
                <div class="left c-p c-9">
                    <el-button size="small" type="success" @click="addDig">添加目录</el-button>
                </div>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <div style="width:100%;padding-top:15px;" class="orderTable" id="printBox">
      <el-table :data="tableData" :max-height="maxHeight" style="width: 100%" row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column label="序号">
          <template slot-scope="scope">
            <span>{{scope.row.indexId}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="className" label="分类名称"></el-table-column>
        <el-table-column prop="percentageWay" label="提成方式">
          <template slot-scope="scope">
            <span v-if="scope.row.type == 2">{{scope.row.percentageWay == 1 ? '提成点' : '固定'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="isByPosition" label="是否按职务提成">
          <template slot-scope="scope">
            <span v-if="scope.row.type == 2">{{scope.row.isByPosition == true ? '是' : '否'}}</span>
            <span v-if="scope.row.type == 2 && scope.row.isByPosition == false && scope.row.percentageMethod"><font color="red">({{scope.row.percentageMethod == 1 ? '总额均分' : '等额提成'}})</font></span>
          </template>
        </el-table-column>
        <el-table-column prop="unit" label="所有人">
          <template slot-scope="scope">
            <span v-if="scope.row.percentagePoint || scope.row.percentageAmout">{{scope.row.percentageWay == 1 ? scope.row.percentagePoint + '%' : scope.row.percentageAmout + '元'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="unit" label="接待员">
          <template slot-scope="scope">
            <span v-if="scope.row.percentagePointJD || scope.row.percentageAmoutJD">{{scope.row.percentageWay == 1 ? scope.row.percentagePointJD + '%' : scope.row.percentageAmoutJD + '元'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="unit" label="施工员">
          <template slot-scope="scope">
            <span v-if="scope.row.percentagePointCW || scope.row.percentageAmoutCW">{{scope.row.percentageWay == 1 ? scope.row.percentagePointCW + '%' : scope.row.percentageAmoutCW + '元'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="unit" label="业务员">
          <template slot-scope="scope">
            <span v-if="scope.row.percentagePointYW || scope.row.percentageAmoutYW">{{scope.row.percentageWay == 1 ? scope.row.percentagePointYW + '%' : scope.row.percentageAmoutYW + '元'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="unit" label="主管">
          <template slot-scope="scope">
            <span v-if="scope.row.percentagePointSG || scope.row.percentageAmoutSG">{{scope.row.percentageWay == 1 ? scope.row.percentagePointSG + '%' : scope.row.percentageAmoutSG + '元'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="employeeName" label="操作" align="center" width="350">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="addDig(scope.row)" v-if="scope.row.type == 1">添加下级分类</el-button>
            <el-button size="mini" @click="editRow(scope.row)" v-if="scope.row.type == 2">修改</el-button>
            <el-button size="mini" type="danger" @click="deleteRow(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="添加目录" :visible.sync="addStatus" center width="30%" :modal="false">
      <el-form :model="addForm">
        <el-form-item label="名称" label-width="120px">
          <el-input v-model="addForm.className"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="addStatus = false">取 消</el-button>
        <el-button type="success" @click="addFormSubmit">提 交</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改分类" :visible.sync="editStatus" center width="30%" :modal="false">
      <el-form :model="editForm">
        <el-form-item label="名称" label-width="120px">
          <el-input v-model="editForm.className"></el-input>
        </el-form-item>
        <el-form-item label="提成方式" label-width="120px">
          <el-radio-group v-model="editForm.percentageWay">
            <el-radio :label="1">百分比</el-radio>
            <el-radio :label="2">固定额</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否按职务提成" label-width="120px">
          <el-radio-group v-model="editForm.isByPosition">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="所有人" label-width="120px" v-show="editForm.isByPosition === false && editForm.percentageWay === 2">
          <el-input v-model="editForm.percentageAmout">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="所有人" label-width="120px" v-show="editForm.isByPosition === false && editForm.percentageWay === 1">
          <el-input v-model="editForm.percentagePoint">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="接待员" label-width="120px" v-show="editForm.isByPosition === true && editForm.percentageWay === 2">
          <el-input v-model="editForm.percentageAmoutJD">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="接待员" label-width="120px" v-show="editForm.isByPosition === true && editForm.percentageWay === 1">
          <el-input v-model="editForm.percentagePointJD">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="财务" label-width="120px" v-show="editForm.isByPosition === true && editForm.percentageWay === 2">
          <el-input v-model="editForm.percentageAmoutCW">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="财务" label-width="120px" v-show="editForm.isByPosition === true && editForm.percentageWay === 1">
          <el-input v-model="editForm.percentagePointCW">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="业务员" label-width="120px" v-show="editForm.isByPosition === true && editForm.percentageWay === 2">
          <el-input v-model="editForm.percentageAmoutYW">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="业务员" label-width="120px" v-show="editForm.isByPosition === true && editForm.percentageWay === 1">
          <el-input v-model="editForm.percentagePointYW">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="主管" label-width="120px" v-show="editForm.isByPosition === true && editForm.percentageWay === 2">
          <el-input v-model="editForm.percentageAmoutSG">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="主管" label-width="120px" v-show="editForm.isByPosition === true && editForm.percentageWay === 1">
          <el-input v-model="editForm.percentagePointSG">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="方式" label-width="120px" v-show="editForm.isByPosition === false">
          <el-radio-group v-model="editForm.percentageMethod">
            <el-radio :label="1">总额等分</el-radio>
            <el-radio :label="2">等额提成</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="editStatus = false">取 消</el-button>
        <el-button type="success" @click="editFormSubmit">提 交</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { queryPercentageClass, addPercentageClass, updatePercentageClass, deletePercentageClass } from "../../request/api.js"
import moment from 'moment'
export default {
  data() {
    return {
      search: {
        garageId: localStorage.getItem('gid'),
        search: "",
      },
      tableData: [],
      maxHeight: undefined,
      pageLength: null,
      size: 1000,
      page: 0,
      addStatus: false,
      addForm: {
        classType: 0,
        superClassId: 0
      },
      editStatus: false,
      editForm: {},
    }
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
      queryPercentageClass(data).then(res => {
        let index = 1
        this.tableData = res.data.data.map(v => {
          v.indexId = index++
          v.type = 1
          if(v.children) v.children.forEach(k => {
            k.type = 2
          }) 
          return v
        })
      })
    },
    editFormSubmit() {
      updatePercentageClass(this.editForm).then(res => {
        if(res.data.code == 200){
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          this.getList()
          this.editStatus = false
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
                    partNo: v['服务项目'],
                    partName: v['销售价格'],
                    model: v['所属分类'],
                    fitCars: v['创建时间'],
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
    editRow(row) {
      this.editForm = row
      this.editStatus = true
    },
    addDig(row) {
      if(row.id) {
        this.addForm.superClassId = row.id
        this.addForm.classType = 1
      }
      this.addStatus = true
    },
    addFormSubmit() {
      addPercentageClass(this.addForm).then(res => {
        if(res.data.code == 200){
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
          this.getList()
          this.addStatus = false
          this.editRow(res.data.data)
        }
      })
    },
    deleteRow(row) {
      if(row.children && row.children.length > 0) return this.$message({type: 'error',message: '该目录存在下级分类，不允许删除！'})
      this.$confirm(`确认删除${row.className}吗?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					deletePercentageClass({id: row.id}).then(res => {
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
