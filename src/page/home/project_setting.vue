<template>
  <div class="w-100 order flex-col">
    <div class="p-15" style="background:rgba(229,246,247,1);">
      <el-row :gutter="10">
        <el-form :inline="true" class="demo-form-inline">
          <el-col>
            <el-form-item label="名称" class="m-b-0">
              <el-input
                v-model="search.name"
                placeholder=""
                style="width:100%;"
              ></el-input>
            </el-form-item>
            <el-button
              type="success"
              icon="el-icon-search"
              @click="getList()"
              >查找</el-button>

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
      <el-table :data="tableData" :max-height="maxHeight" style="width: 100%">
        <el-table-column type="index" label="序号"> </el-table-column>
        <el-table-column prop="itemName" label="服务项目"></el-table-column>
        <el-table-column prop="itemPrice" label="销售价格"> </el-table-column>
        <el-table-column prop="className" label="所属分类">
					<template slot-scope="scope">
						<span>{{scope.row.parentClassName ? scope.row.parentClassName+'/'+scope.row.className : scope.row.className}}</span>
					</template>
				</el-table-column>
        <el-table-column prop="createdDate" label="创建时间"> </el-table-column>
        <el-table-column prop="employeeName" label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="editRow(scope.row)">修改</el-button>
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

    <el-dialog title="修改项目" :visible.sync="editStatus" center width="30%" :modal="false">
      <el-form :model="editPartsForm">
        <el-form-item label="名称" label-width="100px">
          <el-input v-model="editPartsForm.itemName"></el-input>
        </el-form-item>
        <el-form-item label="售价" label-width="100px">
          <el-input v-model="editPartsForm.itemPrice"></el-input>
        </el-form-item>
        <el-form-item label="提成分类" label-width="100px">
          <el-cascader v-model="editPartsForm.classId" :options="treeData" :show-all-levels="false"></el-cascader>
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
import { getItemPercentage, queryItemPercentageList, setItemPercentage, queryPercentageClass } from "../../request/api.js"
import moment from 'moment'
export default {
  data() {
    return {
      search: {
        name: "",
      },
      tableData: [],
      maxHeight: undefined,
      pageLength: null,
      size: 1000,
      page: 0,
      editStatus: false,
      editPartsForm: {},
      treeData: [],
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
      queryItemPercentageList(data).then(res => {
        this.tableData = res.data.data
      })
    },
    editFormSubmit() {
			this.editPartsForm.percentClassId = this.editPartsForm.classId.slice(-1)[0]
			const data = {
				itemId: this.editPartsForm.itemId,
				name: this.editPartsForm.itemName,
				percentClassId: this.editPartsForm.classId.slice(-1)[0],
				price: this.editPartsForm.itemPrice
			}
      setItemPercentage(data).then(res => {
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
      this.editPartsForm = row
      this.editStatus = true
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
