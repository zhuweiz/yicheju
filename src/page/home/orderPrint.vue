<template>
  <div class="w-100" style="padding-left: 30px;">
    <div style="width: 860px;margin: 50px auto;">
      <el-card class="box-card">
        <h1 class="text-center f-22 p-tb-15">{{data.garageName}}派工单</h1>
        <div class="head">
          <div style="float:left"></div>
        </div>
        <el-row :gutter="20">
          <el-col :span="12">接待：{{data.serviceMan}} 业务：{{data.sellsMan}} 交车时间：{{data.completeTime}}</el-col>
          <el-col :span="12" style="text-align:right;">制单：{{data.creator}} 日期：{{data.bizDate}}</el-col>
        </el-row>
        <div class="mains" style="border-bottom: none;">
          <div class="fl">
            <div class="ware">
              <li style="width:22%;">车牌</li>
              <li
                style="width: 55%;border-left: 1px solid #000;border-right: 1px solid #000;"
              >{{data.carNo}}</li>
              <li style="width:22%;">车型</li>
            </div>
            <div class="list" style="  width: 330px;">
              <li class="bold" style="height: 39px;line-height: 39px;">维修项目</li>
              <!-- <div v-for="(item, index) in list" :key="index">
                <li class="bold" style="text-align:left;text-indent: 10px;">{{item.groupName}}</li>
                <li
                  v-for="v in item.itemDataVOList"
                  :key="v.itemId"
                >{{v.itemName}} {{v.quantity ? '*'+v.quantity : ''}}</li>
              </div>-->
            </div>
          </div>
          <div class="fr">
            <div class="wares">
              <li style="width: 49%;">{{data.standard}}</li>
              <li style="width: 15%;border-left: 1px solid #000;border-right: 1px solid #000;">日期</li>
              <li style="width: 36%;">{{data.bizDate}}</li>
            </div>
            <div class="list fr_list">
              <li class="bold" style="height: 39px;line-height: 39px;">更换零件</li>
            </div>
            <!--  -->
            <!-- <div class="fr_list">
              <div v-for="(item, index) in list" :key="index">
                <li class="bold ddd" style="text-align:left;text-indent: 10px;" >{{''}}</li>
                <li v-for="v in item.itemDataVOList" :key="v.itemId" ref="box">
                  <span v-for="j in v.partDataVOList" :key="j">
                    {{j.partName}} {{j.quantity ? '*'+j.quantity : ''}}<em>/</em>
                   
                  </span>
                </li>
              </div>
            </div>-->
          </div>
        </div>
        <div class="mains2" style>
          <div class="pejlist" v-for="(item, index) in datalist" :key="index">
            <div class="dt">
              <div class="lst_A">{{item.groupName}}</div>
              <div class="rstd"></div>
            </div>
            <div class="dt" v-for="(items, index) in item.itemDataVOList" :key="index">
              <div class="lst">{{items.itemName}}</div>
              <div class="rst">
                <span class="sdsd" v-for="(itemd, index) in items.partDataVOList" :key="index">
                  {{itemd.partName}}
                  <span>/</span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="autograph">
          <p style="font-weight:bold;float:left;">接待：{{data.serviceMan}}</p>
          <p style="font-weight:bold;float:left;padding-left:20px;">业务：{{data.sellsMan}}</p>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getDispatchByOId } from "../../request/api.js";
export default {
  name: "orderPrint",
  data() {
    return {
      data: "",
      list: [],
      partList: [],
      datalist: [],
      arrList: []
    };
  },
  created() {
    const data = {
      oid: localStorage.getItem("oid")
    };
    getDispatchByOId(data).then(res => {
      this.data = res.data.data;
      this.datalist = res.data.data.dispatchItemList;
      console.log(res.data.data);
      this.list = this.data.dispatchItemList;
      //   for (var i = 0; i < this.list.length; i++) {
      //     console.log(this.list[i]);
      //     for (var j = 0; j < this.list[i].itemDataVOList.length; i++) {
      //          console.log(this.list[i].itemDataVOList);
      //       this.list[i].itemDataVOList.push({})
      //     }
      //   }
      this.partList = this.data.partList || [];
      let leng = this.list.length;
      this.list.forEach(v => {
        leng += v.itemDataVOList.length;
      });

      let arrList = [];

      let partLength = this.partList ? this.partList.length : 0;
      if (leng != 0) {
        arrList = new Array();
      } else {
        arrList = new Array(2 - partLength);
      }

      if (this.partList) {
        this.partList.forEach(v => {
          arrList.unshift(v);
        });
      }
      this.arrList = arrList;
      setTimeout(function() {
        window.print();
      }, 500);
    });
    console.log(this.$refs["box"].text.offsetHeight);
  },
  mounted() {},
  methods: {}
};
</script>
<style scoped>
#table {
  width: 100%;
  border-collapse: collapse;
}
#table tr {
  border-left: 1px solid #000;
  border-bottom: 1px solid #000;
}
#table td {
  padding: 5px;
  text-align: center;
  border-color: #000;
  height: 33px;
  border-top: 1px solid #000;
  border-right: 1px solid #000;
}
#table .fl {
  text-align: left;
  border: none;
  font-weight: bold;
}
#table .noborder {
  border: none;
}
.title_bold {
  font-weight: bold;
}
.lists {
  display: flex;
  flex-wrap: wrap;
}
.lists div {
  display: flex;
  float: left;
  align-items: center;
  border-right: 1px solid #000;
}
.lists div:nth-of-type(odd) {
  width: 50.2%;
}
.lists div:nth-of-type(even) {
  width: 49.8%;
}
.lists div p {
  float: left;
  text-align: center;
  height: 100%;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.mains {
  width: 820px;
  overflow: hidden;
  border: 1px solid #000;
  margin-top: 20px;
}
.mains2 {
  width: 820px;
  overflow: hidden;
  border: 1px solid #000;
  border-top: none;
  border-bottom: none;
}
.fl {
  width: 330px;
  border-right: 1px solid #000;
  display: table-cell;
}
.fr {
  display: table-cell;
  width: 489px;
  vertical-align: top;
}
li {
  list-style: none;
}
.ware,
.wares {
  overflow: hidden;
}
.ware li,
.wares li {
  float: left;
  text-align: center;
  height: 39px;
  line-height: 39px;
}
.list li {
  border-top: 1px solid #000;
  text-align: center;
  height: 49px;
  line-height: 49px;
}
.list li.bold {
  font-weight: bold;
}
.ddd {
  min-height: 49px;
}
.dt {
  overflow: hidden;
  min-height: 49px;
  text-align: left;
  text-indent: 10px;
  /* line-height: 49px; */
}
.pejlist {
  overflow: hidden;
}
.list {
}
.lst_A {
  font-weight: 700;
  min-height: 49px;
  line-height: 49px;
  float: left;
  width: 331px;
  border-right: 1px solid #000;
  border-top: 1px solid #000;
}
.lst {
  float: left;
  border-top: 1px solid #000;
  line-height: 49px;
  text-align: center;
  min-height: 49px;
  width: 330px;
}
.sdsd {
  line-height: 18px;
}
.rst {
  border-left: 1px solid #000;
  border-top: 1px solid #000;
  /* float: right; */
  display: inline-block;
  display: inline;
  zoom: 1;
  clear: both;
  height: 49px;
  display: table-cell;
  width: 489px;
  vertical-align: top;
}
.rstd {
  border-top: 1px solid #000;
  /* float: right; */
  min-height: 49px;
  display: table-cell;
  width: 489px;
  vertical-align: top;
}
/* .rstd:nth-child(1){
  border-top: none
}
.lst_A:nth-child(1){
  border-top: none
} */
.autograph {
  border-top: 1px solid #000;
  padding-left: 10px;
}
.autograph p {
  text-align: left;
  padding: 10px 0px;
}
.bd p {
  margin: 0;
  height: 30px;
  line-height: 30px;
  text-align: left;
  padding-left: 10px;
}
.fr_list {
  overflow: hidden;
}
.fr_list li {
  padding-left: 10px;

  /* float: left; */
  /* text-align: center; */
  height: 49px;
  /* line-height: 49px; */
  border-top: 1px solid #000;
}
.fr_list li span:last-child em {
  display: none;
}
.sdsd:last-child span {
  display: none;
}
.fr_list li:nth-of-type(even) {
  border-right: none !important;
}
</style>