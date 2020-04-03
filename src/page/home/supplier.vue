<template>
  <div class="w-100 order flex-col">
    <div class="p-15" style="background:rgba(229,246,247,1);">
      <el-row :gutter="10">
        <el-form :inline="true" class="demo-form-inline">
          <el-col>
            <el-form-item label="供应商名称" class="m-b-0">
              <el-input
                v-model="search.supplierName"
                placeholder=""
                style="width:100%;"
              ></el-input>
            </el-form-item>
            <el-button
              type="success"
              icon="el-icon-search"
              @click="init()"
              >查找</el-button>
            <el-button type="success"	icon="el-icon-plus" @click="addDig">添加供应商</el-button>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <div style="width:100%;padding-top:15px;" class="orderTable" id="printBox">
      <el-table :data="tableData" :max-height="maxHeight" style="width: 100%">
        <el-table-column type="index" label="编号">
        </el-table-column>
        <el-table-column prop="supplierName" label="配件商名称">
        </el-table-column>
        <el-table-column prop="type" label="类型">
        </el-table-column>
        <el-table-column prop="address" label="地址">
        </el-table-column>
        <el-table-column prop="phone" label="手机号码">
        </el-table-column>
        <el-table-column prop="scope" label="经营范围">
        </el-table-column>
        <el-table-column prop="employeeName" label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="deleteRow(scope.row)">删除</el-button>
          </template> 
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="添加我的配件商" :visible.sync="addStatus" width="70%" :modal="false" center>
      <div class="orderTable" style="margin-top:10px;">
        <el-table :data="addList">
          <el-table-column property="id" label="编号"></el-table-column>
          <el-table-column property="supplierName" label="配件商名称"></el-table-column>
          <el-table-column property="type" label="类型"></el-table-column>
          <el-table-column property="address" label="地址"></el-table-column>
          <el-table-column property="phone" label="手机号码"></el-table-column>
          <el-table-column property="scope" label="经营范围"></el-table-column>
          <el-table-column prop="employeeName" label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button v-if="scope.row.gid" type="text" style="color:red;">已添加</el-button>
              <el-button v-else type="text" style="color:#0d906e;" @click="addRow(scope.row, scope.$index)">添加</el-button>

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
			<div slot="footer" class="dialog-footer">
        <el-button type="success" @click="addStatus = false">退 出</el-button>
			</div>
		</el-dialog>
  </div>
</template>

<script>

import { addGarageSupplier,deleteGarageSupplier,queryAllSupplierByGid,queryGarageSupplier } from "../../request/api.js"
export default {
  data() {
    return {
      search: {
        supplierName: '',
        gid: localStorage.getItem('gid')
      },
      tableData: [],
      maxHeight: undefined,
      pageLength: null,
      size: 10,
      page: 0,
      addStatus: false,
      addList: [],
    }
  },
  created() {
    this.init()
  },
  mounted() {
    this.maxHeight = $(".tabBox").height() - 235 + "px"
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val - 1
      this.getAllSupplier()
    },
    init() {
      const data = {
        ...this.search
      }
      queryGarageSupplier(data).then(res => {
        this.tableData = res.data.data
      })
    },
    addAllot(row, index){
      this.allotFormList.push(row)
      this.allotList[index].status = 2
    },
    deleteAllot(row, index){
      this.allotFormList.splice(index, 1)
      let indexs = this.allotList.findIndex(v => v.id === row.id)
      this.allotList[indexs].status = 1
    },
    deleteRow(row){
      this.$confirm(`确认删除${row.supplierName}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteGarageSupplier({id: row.id}).then(res => {
          if(res.data.code == 200){
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.init()
          }
        })
      })
    },
    addDig(){
      this.addStatus = true
      this.getAllSupplier()
    },
    getAllSupplier() {
      const data = {
        gid: localStorage.getItem('gid'),
        supplierName: '',
        pageSize: this.page,
        pageNumber: this.size,
      }
      queryAllSupplierByGid(data).then(res => {
        this.addList = res.data.data
        this.pageLength = res.data.pageInfo.total
      })
    },
    addRow(row){
      const data = {
        gid: localStorage.getItem('gid'),
        supplierId: row.supplierId
      }
      addGarageSupplier(data).then(res => {
				if(res.data.code == 200){
					this.$message({
						type: 'success',
						message: '添加成功!'
          })
          this.getAllSupplier()
          this.init()
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
