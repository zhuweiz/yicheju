<template>
  <div class="w-100 order flex-col">
    <div class="p-15" style="background:rgba(229,246,247,1);">
      <el-form :inline="true" class="demo-form-inline">
        <el-row>
          <el-col>
            <el-form-item label="员工姓名" class="m-b-0">
              <el-input v-model="employeeName" placeholder="姓名" style="width: 160px;"></el-input>
            </el-form-item>
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
            <div
              class="right botts"
              style="margin-right: 15px;background: #FFF5EE;"
              @click="dialogVisible = true"
            >支出记账</div>
            <!-- 支出记账弹窗 -->
            <el-dialog
              title="添加薪资记账"
              :visible.sync="dialogVisible"
              width="30%"
              :modal="false"
              center
            >
              <el-form :model="editPartsForm" ref="editPartsForm">
                <el-form-item label="员工姓名" label-width="80px" prop="employeeName">
                  <el-select
                    v-model="editPartsForm.employeeName"
                    placeholder="请选择"
                    style="width: 300px"
                  >
                    <el-option
                      v-for="item in staffallList"
                      :key="item.value"
                      :label="item.realName"
                      :value="item.realName"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="类型">
                  <el-radio v-model="editPartsForm.type" label="1">扣薪</el-radio>
                  <el-radio v-model="editPartsForm.type" label="2">加薪</el-radio>
                </el-form-item>
                <el-form-item label="金额" prop="amount">
                  <el-input placeholder="请输入" style="width: 300px" v-model="editPartsForm.amount"></el-input>
                </el-form-item>
                <el-form-item label="事由" prop="reason">
                  <el-input placeholder="请输入" style="width: 300px" v-model="editPartsForm.reason"></el-input>
                </el-form-item>
                <div class>请上传凭证（最多6张）</div>
                <el-form-item label label-width="120px">
                  <el-upload
                    ref="uploadImg"
                    :action="uplodeURL"
                    :headers="headersObj"
                    list-type="picture-card"
                    :limit="6"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                    :on-success="handleSuccess"
                  >
                    <i class="el-icon-plus"></i>
                  </el-upload>
                  <el-dialog :visible.sync="dialogImage" size="tiny" :modal="false">
                    <img width="100%" :src="dialogImageUrl" alt />
                  </el-dialog>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button type="danger" @click="countermand">取 消</el-button>
                <el-button type="success" @click="storeFormSubmit">提 交</el-button>
              </span>
            </el-dialog>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- c查看凭证图片 -->
    <el-dialog title="查看照片" :visible.sync="visible.photoVisible" width="40%" center :modal="false">
      <el-carousel indicator-position="outside" :autoplay="false">
        <el-carousel-item v-for="item in photoUrl" :key="item">
          <el-image style="width: 100%;margin:0 auto; " :src="item.picUrl" fit="fill"></el-image>
        </el-carousel-item>
      </el-carousel>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="visible.photoVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <div style="width:100%;padding-top:15px;" class="orderTable" id="printBox">
      <el-table :data="tableData" :max-height="500" style="width: 100%">
        <el-table-column label="凭证编号" prop="id"></el-table-column>
        <el-table-column prop="createdDate" label="日期"></el-table-column>
        <el-table-column prop="type" label="扣/加薪" :formatter="formatSex"></el-table-column>
        <el-table-column prop="employeeName" label="员工姓名"></el-table-column>
        <el-table-column prop="reason" label="事由"></el-table-column>
        <el-table-column prop="amount" label="金额"></el-table-column>
        <el-table-column prop="auditor" label="凭证照片">
          <template slot-scope="scope">
            <el-button size="mini" @click="viewPhoto(scope.row)">查看</el-button>
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
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { staffpay, excel, staffList, staffall,uplodeURL } from "../../request/api.js";
import moment from "moment";
export default {
  name: "formPageB_B",
  data() {
    return {
      uplodeURL: uplodeURL,
      //图片上传请求头对象
      headersObj: { authorization: window.sessionStorage.getItem("token") },
      search: {
        time: [
          // moment(new Date()).format("YYYY-MM-DD"),
          // moment(new Date()).format("YYYY-MM-DD")
        ]
      },
      radio: "1",
      dialogVisible: false, //弹出支出记账
      dialogImageUrl: "", //上传照片
      dialogImage: false, //查看图片
      visible: {
        photoVisible: false //查看照片
      },
      editPartsForm: {
        garageId: localStorage.getItem("gid"),
        pictureDOList: [],
        type: "1"
      }, //传值列表
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
      // rules: {
      //   amount: [{ required: true, message: "请输入金额", trigger: "blur" }]
      // },
      photoUrl: [], //凭证图片
      tableData: [],
      staffallList: [],
      id: "",
      // maxHeight: undefined,
      pageLength: null,
      employeeName: "", //查询姓名
      size: 10,
      page: 0
    };
  },
  created() {
        // this.uplodeURL = uplodeURL;
    let nowTime = moment(new Date()).format("YYYY-MM-DD");
    const data = {
      // endTime: nowTime,
      // startTime: nowTime,
      page: this.page,
      size: this.size
    };
    this.getList(data);
    this.shigongList();
  },
  mounted() {
    // this.maxHeight = $(".tabBox").height() - 235 + "px";
  },
  methods: {
    // 提交表单
    storeFormSubmit() {
      // console.log(this.editPartsForm);
      staffpay(this.editPartsForm).then(res => {
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: "添加成功!"
          });
          this.getList();
          this.dialogVisible = false;
        }
        this.$refs.editPartsForm.resetFields();
        this.$refs.uploadImg.clearFiles();
        this.editPartsForm.pictureDOList = [];
      });

      // this.$refs.addFormRef.resetFields();
    },
    countermand() {
      // console.log(this.$refs.editPartsForm);
      this.dialogVisible = false;
      this.$refs.editPartsForm.resetFields();
      this.$refs.uploadImg.clearFiles();
      this.editPartsForm.pictureDOList = [];
      // console.log(this.editPartsForm);
    },
    viewPhoto(url) {
      // console.log(url);
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
    //监听图片上传成功
    handleSuccess(e) {
      // console.log(e.data);
      const picUrl = { picUrl: e.data };
      this.editPartsForm.pictureDOList.push(picUrl);
      console.log(this.editPartsForm);
    },
    //删除上传图片
    handleRemove(file, fileList) {
      // console.log(file);
      const filepath = file.response.data;
      //从pictureDOList数组中找到对应得索引值
      const i = this.editPartsForm.pictureDOList.findIndex(
        x => x.picUrl === filepath
      );
      //调用solice方法删除
      this.editPartsForm.pictureDOList.splice(i, 1);
      // console.log(this.editPartsForm);
    },
    //点击查看图片大图
    handlePictureCardPreview(file) {
      // console.log(file);
      this.dialogImageUrl = file.url;
      this.dialogImage = true;
    },
    formatSex: function(row, column, cellValue) {
      if (cellValue == 1) {
        return "扣";
      } else if (cellValue == 2) {
        return "加";
      }
    },
    handleCurrentChange(val) {
      this.page = val - 1;
        if (this.search.time) {
        this.search.time.forEach((i, index) => {
          this.search.time[index] = moment(i).format("YYYY-MM-DD");
        });
        const data = {
          employeeName: this.employeeName,
          endTime: this.search.time[1],
          startTime: this.search.time[0],
          page: this.page,
          size: this.size
        };
        this.getList(data);
      } else {
        const data = {
          employeeName: this.employeeName,
          page: this.page,
          size: this.size
        };
        this.getList(data);
      }
      // } else {
      //   this.$message({
      //     message: "请先选择查询日期！",
      //     type: "warning"
      //   });
      // }
    },
    searchList() {
      // console.log(this.search.time);
      if (this.search.time) {
        this.search.time.forEach((i, index) => {
          this.search.time[index] = moment(i).format("YYYY-MM-DD");
        });
        const data = {
          employeeName: this.employeeName,
          endTime: this.search.time[1],
          startTime: this.search.time[0],
          page: this.page,
          size: this.size
        };
        this.getList(data);
      } else {
        const data = {
          employeeName: this.employeeName,
          page: this.page,
          size: this.size
        };
        this.getList(data);
      }
    },
    getList(data) {
      staffList(data).then(res => {
        // this.pageLength = res.data.data.totalElements;
        this.pageLength = res.data.pageInfo.total;
        this.tableData = res.data.data;
        // console.log(res.data.data);
        // console.log(res.data.data.pictureList);
        if (res.data.data.length > 0) {
          this.tableData.forEach(item => {
            // console.log(item.createdDate);
            if (item.createdDate) {
              item.createdDate = moment(item.createdDate).format("YYYY/MM/DD");
            }
          });
          this.tableData[this.tableData.length - 1].voucherNumber = "本月合计:";
        }
      });
    },
    shigongList() {
      const data = {
        gid: localStorage.getItem("gid")
      };
      staffall(data).then(res => {
        this.staffallList = res.data.data;
        // console.log(res.data.data);
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
      excel(data, "员工薪资").then(() => {});
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
.botts {
  /* color: #999; */
  background: #e6d9d8;
  height: 36px;
  line-height: 36px;
  border: 1px solid #dcdfe6;
  padding: 0 20px;
  border-radius: 5px;
  margin-top: 2px;
  cursor: pointer;
}
.bord {
  width: 100%;
  height: 5px;
  background: #dcdfe6;
}
.el-form /deep/ .el-form-item__label {
  width: 80px;
}
.avatar-uploader {
  margin-top: 10px;
}
.el-dialog--center .el-dialog__body {
  padding: 0px 0px 25px !important;
}

.el-form-item /deep/ .el-upload--picture-card {
  margin-top: 15px;
  width: 100px;
  height: 100px;
}
.el-form-item /deep/ .el-upload {
  width: 100px;
  height: 100px;
  line-height: 100px;
}
.el-form-item /deep/ .el-form-item__content {
  margin-left: 0px !important;
}
.el-form-item /deep/ .avatar {
  width: 100px;
  height: 100px;
  display: block;
}
.el-form-item /deep/ .el-upload-list__item-thumbnail {
  width: 100px;
  height: 100px;
}
.el-form-item /deep/ .el-upload-list__item-actions {
  width: 100px;
  height: 100px;
}
.el-form-item /deep/ .el-upload-list__item {
  margin-top: 15px;
  width: 100px;
  height: 100px;
}
</style>