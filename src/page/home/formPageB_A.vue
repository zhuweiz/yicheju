<template>
  <div class="w-100 order flex-col">
    <div class="p-15" style="background:rgba(229,246,247,1);">
      <el-form :inline="true" class="demo-form-inline">
        <el-row>
          <el-col>
            <!-- 状态勾选 -->
            <el-form-item label class="m-b-0">
              <div class="radio_ccidz">
                <el-form-item label>
                  <el-radio v-model="expend" label="1" @change="selectchange">支出</el-radio>
                  <el-radio v-model="expend" label="0" @change="selectchange">收入</el-radio>
                </el-form-item>
              </div>
            </el-form-item>
            <el-form-item label="申请人" class="m-b-0">
              <el-input v-model="realName" placeholder="姓名" style="width: 160px;"></el-input>
            </el-form-item>
            <!-- 日期选择器 -->
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
            <!-- 收入记账 -->
            <div class="right botts" style="margin-right: 15px;" @click="dialogVisible = true">收入记账</div>
            <!-- 支出记账 -->

            <!-- 支出收入弹窗 -->
            <el-dialog
              title="添加收入帐"
              :visible.sync="dialogVisible"
              width="30%"
              :modal="false"
              center
            >
              <el-form :model="editPartsFormB" ref="addFormRef">
                <el-form-item label="付款方" label-width="80px" prop="receiveSide">
                  <el-input
                    v-model="editPartsFormB.receiveSide"
                    placeholder="请输入"
                    style="width: 300px"
                  ></el-input>
                </el-form-item>
                <el-form-item label="收入项目" label-width="80px" prop="feeType">
                  <!-- <el-input
                    v-model="editPartsFormB.customerId"
                    placeholder="请输入"
                    style="width: 300px"
                  ></el-input> -->
               <el-select
                    v-model="editPartsFormB.feeType"
                    placeholder="请选择"
                    style="width: 300px"
                  >
                    <el-option
                      v-for="item in options4"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>


                </el-form-item>
                <el-form-item label="金额" label-width="80px" prop="amount">
                  <el-input v-model="editPartsFormB.amount" placeholder="请输入" style="width: 300px"></el-input>
                </el-form-item>
                <el-form-item label="收款方式" label-width="80px" prop="payType">
                  <el-select
                    v-model="editPartsFormB.payType"
                    placeholder="请选择"
                    style="width: 300px"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="经手人" label-width="80px" prop="agentName">
                  <el-input
                    v-model="editPartsFormB.agentName"
                    placeholder="请输入"
                    style="width: 300px"
                  ></el-input>
                </el-form-item>
                <el-form-item label="备注" label-width="80px" prop="remark">
                  <el-input v-model="editPartsFormB.remark" type="textarea" style="width: 300px"></el-input>
                </el-form-item>
                <div>请上传凭证（最多6张）</div>
                <el-form-item label label-width="120px">
                  <el-upload
                    multiple
                    ref="uploadImg"
                    action="/api/vehicle/file/uploadPicture"
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
                <el-button type="danger" @click="dialogVisibleQ">取 消</el-button>
                <el-button type="success" @click="dialogVisibleA">提 交</el-button>
              </span>
            </el-dialog>
            <!-- c查看凭证图片 -->
            <el-dialog
              title="查看照片"
              :visible.sync="visible.photoVisible"
              width="40%"
              center
              :modal="false"
            >
              <el-carousel indicator-position="outside">
                <el-carousel-item v-for="item in photoUrl" :key="item" :autoplay="false">
                  <el-image style="width: 100%;margin:0 auto; " :src="item.picUrl" fit="fill"></el-image>
                </el-carousel-item>
              </el-carousel>

              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="visible.photoVisible = false">确 定</el-button>
              </span>
            </el-dialog>
            <div
              class="right botts"
              style="margin-right: 15px;background: #FFF5EE;"
              @click="dialogVisible2 = true"
            >支出记账</div>
            <!-- 支出记账弹窗 -->
            <el-dialog
              title="添加支出帐"
              :visible.sync="dialogVisible2"
              :modal-append-to-body="false"
              width="30%"
              :modal="false"
              center
            >
              <el-form :model="editPartsForm" ref="addFormRef">
                <el-form-item label="收款方" prop="receiveSide">
                  <el-input
                    v-model="editPartsForm.receiveSide"
                    placeholder="请输入"
                    style="width: 300px"
                  ></el-input>
                </el-form-item>
                <el-form-item label="金额" prop="amount">
                  <el-input v-model="editPartsForm.amount" placeholder="请输入" style="width: 300px"></el-input>
                </el-form-item>
                <el-form-item label="支出方式" prop="payType">
                  <el-select v-model="editPartsForm.payType" placeholder="请选择" style="width: 300px">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="类型" prop="feeType">
                  <el-select
                    v-model="editPartsForm.groupName"
                    placeholder="请选择"
                    style="width: 300px"
                  >
                    <el-option
                      v-for="item in options2"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="事由" prop="reason">
                  <el-select v-model="editPartsForm.reason" placeholder="请选择" style="width: 300px">
                    <el-option
                      v-for="item in options3"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="经手人" prop="agentName">
                  <el-input
                    v-model="editPartsForm.agentName"
                    placeholder="请输入"
                    style="width: 300px"
                  ></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                  <el-input v-model="editPartsForm.remark" type="textarea" style="width: 300px"></el-input>
                </el-form-item>
                <div>请上传凭证（最多6张）</div>
                <el-form-item label label-width="120px">
                  <el-upload
                    multiple
                    ref="uploadImg"
                    action="/api/vehicle/file/uploadPicture"
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
                <el-button type="danger" @click="dialogVisibleQ">取 消</el-button>
                <el-button type="success" @click="dialogVisibleT">提 交</el-button>
              </span>
            </el-dialog>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div style="width:100%;padding-top:15px;" class="orderTable" id="printBox">
      <el-table :data="tableData" :max-height="500" style="width: 100%">
        <!-- <el-table-column type="index" width="60">
          <template slot-scope="scope">{{scope.row.index}}</template>
        </el-table-column>-->
        <el-table-column label="凭证号" prop="createdBy"></el-table-column>
        <el-table-column prop="createdDate" label="日期" width="180"></el-table-column>
        <el-table-column prop="type" label="收/支" :formatter="formatSex"></el-table-column>
        <el-table-column prop="receiveSide" label="付（收）款方"></el-table-column>
        <el-table-column prop="feeType" label="事由" :formatter="formatSex3"></el-table-column>
        <el-table-column prop="amount" label="金额"></el-table-column>
        <el-table-column prop="payType" label="付（收）款方式" :formatter="formatSex2"></el-table-column>
        <el-table-column prop="agentName" label="经手人"></el-table-column>
        <el-table-column prop="realName" label="操作员"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column prop="pictureList" label="凭证照片">
          <template slot-scope="scope">
            <el-button size="mini" @click="viewPhoto(scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="payTime" label="回款日期"></el-table-column> -->
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
import {
  enterprisefList,
  excel,
  newlysave,
  uplodeURL
} from "../../request/api.js";
import moment from "moment";
export default {
  name: "formPageB_A",
  data() {
    return {
      expend: null, //支出收入
      realName: null, //姓名筛选
      //表单验证支出
      editPartsForm: {
        bizDate: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        type: 1,
        gid: localStorage.getItem("gid"),
        sourceBillType:1,
        //图片的数组
        pictureList: []
      }, //表单验证收入
      editPartsFormB: {
        bizDate: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        type: 0,
        sourceBillType:1,
        gid: localStorage.getItem("gid"),
        //图片的数组
        pictureList: []
      }, //表单验证2
      search: {
        time: [
          // moment(new Date()).format("YYYY-MM-01"),
          // moment(new Date()).format("YYYY-MM-DD")
        ]
      },
      cities: [
        {
          id: 0,
          name: "支出"
        },
        {
          id: 1,
          name: "收入"
        }
      ],
      options: [
        { value: "0", label: "现金" },
        { value: "1", label: "支付宝" },
        { value: "2", label: "微信" },
        { value: "3", label: "银行卡" },
        { value: "4", label: "支票" },
        { value: "5", label: "挂账" }
      ],
      options2: [
        { value: "201", label: "电器 " },
        { value: "202", label: "机修" },
        { value: "203", label: "钣金" },
        { value: "204", label: "美容" },
        { value: "205", label: "喷漆" },
        { value: "206", label: "其它" }
      ],
      options3: [
        { value: "201", label: "通信费 " },
        { value: "202", label: "餐费" },
        { value: "203", label: "加油费" },
        { value: "204", label: "差旅费" },
        { value: "205", label: "水电费" },
        { value: "206", label: "工资" },
        { value: "207", label: "房租费" },
        { value: "208", label: "配件费" },
        { value: "209", label: "其他" }
      ],
      options4: [
        { value: "101", label: "服务项目 " },
        { value: "102", label: "套餐" },
        { value: "103", label: "保险" },
        { value: "104", label: "挂账" },
        { value: "105", label: "定金" },
        { value: "106", label: "减免" },
        { value: "107", label: "其它" },
      ],
      visible: {
        photoVisible: false //查看照片
      },
      photoUrl: "",
      dialogImageUrl: "", //查看上传图片
      index: "全部",
      dialogVisible: false, //弹出支出记账
      dialogVisible2: false, //弹出收入记账
      dialogImage: false, //查看图片

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
      tableData: [],
      result: [],
      content: [],
      maxHeight: undefined,
      pageLength: null,
      size: 10,
      page: 0
    };
  },
  created() {
    let nowTime = moment(new Date()).format("YYYY-MM-DD");
    const data = {
      // endTime: nowTime,
      // startTime: nowTime,
      page: this.page,
      size: this.size
    };
    this.getList(data);
  },
  mounted() {
    this.maxHeight = $(".tabBox").height() - 240 + "px";
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val - 1;
      if (this.search.time) {
        this.search.time.forEach((i, index) => {
          this.search.time[index] = moment(i).format("YYYY-MM-DD");
        });
        const data = {
          realName: this.realName,
          type: this.expend,
          endTime: this.search.time[1],
          startTime: this.search.time[0],
          page: this.page,
          size: this.size
        };
        this.getList(data);
      } else {
        const data = {
          realName: this.realName,
          type: this.expend,
          // endTime: this.search.time[1],
          // startTime: this.search.time[0],
          page: this.page,
          size: this.size
        };
        this.getList(data);
      }
    },
    //点击查看凭证
    viewPhoto(url) {
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
      this.editPartsForm.pictureList.push(picUrl);
      this.editPartsFormB.pictureList.push(picUrl);
      // console.log(this.editPartsForm);
    },
    //删除上传图片
    handleRemove(file, fileList) {
      const filepath = file.response.data;
      //从pictureList数组中找到对应得索引值
      const i = this.editPartsForm.pictureList.findIndex(
        x => x.picUrl === filepath
      );
      const C = this.editPartsFormB.pictureList.findIndex(
        x => x.picUrl === filepath
      );
      //调用solice方法删除
      this.editPartsForm.pictureList.splice(i, 1);
      this.editPartsForm.pictureListB.splice(C, 1);
      // console.log(this.editPartsForm);
    },
    handlePictureCardPreview(file) {
      // console.log(file);
      this.dialogImageUrl = file.url;
      this.dialogImage = true;
    },
    formatSex: function(row, column, cellValue) {
      if (cellValue == 0) {
        return "收入";
      } else if (cellValue == 1) {
        return "支出";
      }
    },
    formatSex2: function(row, column, cellValue) {
      if (cellValue == 0) {
        return "现金";
      } else if (cellValue == 1) {
        return "支付宝";
      } else if (cellValue == 2) {
        return "微信";
      } else if (cellValue == 3) {
        return "银行卡";
      } else if (cellValue == 4) {
        return "支票";
      } else if (cellValue == 5) {
        return "挂账";
      }
    },
    formatSex3: function(row, column, cellValue) {
      if (cellValue == 101) {
        return "服务项目";
      } else if (cellValue == 102) {
        return "套餐";
      } else if (cellValue == 103) {
        return "保险";
      } else if (cellValue == 104) {
        return "挂帐";
      } else if (cellValue == 105) {
        return "定金";
      } else if (cellValue == 106) {
        return "减免";
      } else if (cellValue == 107) {
        return "其他";
      } else if (cellValue == 201) {
        return "通信费";
      } else if (cellValue == 202) {
        return "餐费";
      } else if (cellValue == 203) {
        return "加油费";
      } else if (cellValue == 204) {
        return "差旅费";
      } else if (cellValue == 205) {
        return "水电费";
      } else if (cellValue == 206) {
        return "工资";
      } else if (cellValue == 207) {
        return "房租费";
      } else if (cellValue == 208) {
        return "配件费";
      } else if (cellValue == 209) {
        return "其他";
      } else if (cellValue == 99) {
        return "事由";
      }
    },
    dialogVisibleQ() {
      this.$refs.addFormRef.resetFields();
      this.$refs.uploadImg.clearFiles();
      this.editPartsForm.pictureList = [];
      this.editPartsFormB.pictureList = [];
      this.dialogVisible = false;
      this.dialogVisible2 = false;
    },
    // 添加收入记账
    dialogVisibleA() {
      // console.log(this.editPartsFormB);
      newlysave(this.editPartsFormB).then(res => {
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: "添加成功!"
          });
          this.getList();
          this.dialogVisible = false;
          this.$refs.addFormRef.resetFields();
          this.$refs.uploadImg.clearFiles();
          this.editPartsFormB.pictureList = [];
        }
      });
    },
    //添加支出记账
    dialogVisibleT() {
      newlysave(this.editPartsForm).then(res => {
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: "添加成功!"
          });
          this.getList();
          this.dialogVisible2 = false;
          this.$refs.addFormRef.resetFields();
          this.$refs.uploadImg.clearFiles();
          this.editPartsForm.pictureList = [];
        }
      });
    },
    getList(data) {
      enterprisefList(data).then(res => {
        var content = res.data.data;
        // console.log(content);
        // this.pageLength = res.data.data.totalElements;
        this.pageLength = res.data.pageInfo.total;
        // console.log(res.data.pageInfo.total);
        if (res.data.data.length > 0) {
          this.tableData = res.data.data;
          this.tableData.forEach((item, index) => {
            item.index = index + 1 + this.page * 10;
            if (item.payTime) {
              item.payTime = moment(item.payTime).format("YYYY/MM/DD");
            }
            if (item.weekOfDay) {
              item.weekOfDay = moment(item.weekOfDay).format("YYYY/MM/DD");
            }
          });
          this.tableData[this.tableData.length - 1].index = "合计:";
        } else {
          this.tableData = [];
        }
      });
    },
    weeks(dayNum) {
      if (dayNum == 1) {
        return "星期一";
      }
      if (dayNum == 2) {
        return "星期二";
      }
      if (dayNum == 3) {
        return "星期三";
      }
      if (dayNum == 4) {
        return "星期四";
      }
      if (dayNum == 5) {
        return "星期五";
      }
      if (dayNum == 6) {
        return "星期六";
      }
      if (dayNum == 7) {
        return "星期日";
      }
    },
    searchList() {
      if (this.search.time) {
        this.search.time.forEach((i, index) => {
          this.search.time[index] = moment(i).format("YYYY-MM-DD");
        });
        const data = {
          realName: this.realName,
          type: this.expend,
          endTime: this.search.time[1],
          startTime: this.search.time[0],
          page: this.page,
          size: this.size
        };
        this.getList(data);
      } else {
        const data = {
          realName: this.realName,
          type: this.expend,
          // endTime: this.search.time[1],
          // startTime: this.search.time[0],
          page: this.page,
          size: this.size
        };
        this.getList(data);
      }
    },
    // 选择已结未结
    selectchange(e) {
      this.expend = e;
      if (this.search.time) {
        this.search.time.forEach((i, index) => {
          this.search.time[index] = moment(i).format("YYYY-MM-DD");
        });
        const data = {
          realName: this.realName,
          type: this.expend,
          endTime: this.search.time[1],
          startTime: this.search.time[0],
          page: this.page,
          size: this.size
        };
        this.getList(data);
      } else {
        const data = {
          realName: this.realName,
          type: this.expend,
          // endTime: this.search.time[1],
          // startTime: this.search.time[0],
          page: this.page,
          size: this.size
        };
        this.getList(data);
      }
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
      if (this.search.time[1] == undefined) {
        this.$message({
          message: "请先选择导出日期",
          type: "warning"
        });
        return;
      }
      if (this.search.time[0] == undefined) {
        this.$message({
          message: "请先选择导出日期",
          type: "warning"
        });
        return;
      }
      console.log(this.expend);
      var type = "";
      var name = "";
      if (this.expend == 0) {
        type = 15;
        name = "手工记账企业日常收入";
      } else if (this.expend == 1) {
        type = 16;
        name = "手工记账企业日常支出";
      } else if (this.expend == null) {
        type = 17;
        name = "手工记账企业日常全部";
      }
      const data = {
        endTime: this.search.time[1],
        startTime: this.search.time[0],
        type: type //挂账报表
      };
      excel(data, name).then(() => {});
    }
  }
};
</script>
<style scoped>
.navActive em:hover {
  color: #3ac29f;
  transition: 0.5s;
}
.el-textarea /deep/ .el-textarea__inner {
  height: 60px;
}
.navActive em.active {
  color: #3ac29f;
}
.el-radio {
  margin-right: 12px;
}
.el-dialog {
  z-index: 99;
}
.botts {
  background: #f0fff0;
  height: 36px;
  line-height: 36px;
  border: 1px solid #dcdfe6;
  padding: 0 20px;
  border-radius: 5px;
  margin-top: 2px;
  cursor: pointer;
  /* color: #999; */
}
.el-dialog--center .el-dialog__body {
  padding: 0px 0px 25px !important;
}
.el-form-item {
  margin-bottom: 10px;
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
.el-form /deep/ .el-form-item__label {
  width: 80px;
}
.el-form-item /deep/ .el-form-item__content {
  margin-left: 0px !important;
}
</style>