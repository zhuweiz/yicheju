<template>
 <div class="w-100 order flex-col h-100 over-y-auto" style="padding-left: 30px;">
		<div class="p-tb-30">
			<h2 class="left f-18" style="width: 150px;color: #0D906E;padding-top:12px;font-weight: normal;">| 配件</h2>
			<ul class="left orderUl" style="width:70%;padding-top: 5px;">
				<li :class="index==orderNavActive?'active':''" v-for="(item,index) in orderList" :key="index" @click="orderTab(index,item.link)">{{item.name}}</li>
			</ul>
					<div class="right miaa" v-if="orderNavActive == 4" @click="tuihuanhuo"><img class="mis"  src="../../assets/tuihuo.png" alt=""><span class="mis2">退货暂缓区</span></div> 
			<div class="clear"></div>
    <!-- 内层供应商弹窗 -->
    <el-dialog width="35%" center title="选择发车配件" :visible.sync="centerDialogVisible" append-to-body>
      <div class="outbox">
        <div class="lines2" v-for="(items,idx) in supplierlist" :key="'supp'+idx">
          <div class="outlis">
            <div class="chengde2">{{items.partName}}</div>
            <div class="shushu">x{{items.quantity}}</div>
            <div class="phin">
              <el-checkbox-group
                class="right"
                style="margin-left: 5px;"
                :min="1"
                :max="3"
                v-model="items.checked"
              >
                <el-checkbox></el-checkbox>
              </el-checkbox-group>
              <span class="right">{{items.type == 1?"退货":"换货"}}</span>
            </div>
          </div>
          <div class="outlis_a">
            <div class="chengde">车牌：{{items.carNo}}</div>
            <div class="wode" style="margin-bottom: 0px">供应商：{{items.supplierName}}</div>
          </div>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button type="success" style="width:200px" @click="Clickinquiry">发 车</el-button>
      </div>
      <el-dialog width="30%" title="请填写备注信息" :visible.sync="innerVisible" append-to-body>
        <el-input type="textarea" v-model="beizhu" style="height:50px"></el-input>
        <div slot="footer" class="dialog-footer">
          <el-button type="success" style="width:200px" @click="Clickinquiry2">发 车</el-button>
        </div>
      </el-dialog>
    </el-dialog>
		</div>
			 <router-view/>
    </div>
</template>

<script>
import {
  afterSaleList,
  afterSaleDeliver
} from "../../request/api.js";
export default {
  name: "formPage",
  data() {
    return {
	  orderList:[
		  {name:"库存",link:"/home/stock"},
			{name:"调出",link:"/home/out_stock"},
      {name:"调入",link:"/home/in_stock"},
	  {name:"库存订单",link:"/home/stock_order"},
	  {name:"询价订单",link:"/home/stock_enquiry"},
      {name:"供应商",link:"/home/supplier"},
	  ],
	  supplierlist:[],
	  beizhu:'',
	   gid: localStorage.getItem("gid"),
	  orderNavActive: null,
	  innerVisible:false,
	  centerDialogVisible:false,
        maxHeight:undefined
    };
  },
  created() {
      this.orderTab(0, "../home/stock")
  },
  mounted() {
		if(this.$route.path == "/home/stock"){this.orderNavActive = 0}
		else if(this.$route.path == "/home/out_stock"){this.orderNavActive = 1}
    else if(this.$route.path == "/home/in_stock"){this.orderNavActive = 2}
    else if(this.$route.path == "/home/stock_order"){this.orderNavActive = 3}
	else if(this.$route.path == "/home/supplier"){this.orderNavActive = 4}
	else if(this.$route.path == "/home/stock_enquiry"){this.orderNavActive = 5}
  },
  methods: {
    orderTab(i,link) {
		
		this.orderNavActive = i
		this.$router.push({path:link});
	},
	   tuihuanhuo() {
      afterSaleList({ status: 1 }).then(res => {
        this.supplierlist = res.data.data;
        this.supplierlist.map((c, i) => {
          this.$set(c, "checked", false);
        });
        console.log(res.data.data);
      });
      this.centerDialogVisible = true;
    },
	// 发车
    Clickinquiry() {
     
      var data = []
      for (var i in this.supplierlist) {
        if (this.supplierlist[i].checked == true) {
          data.push(this.supplierlist[i].id);
        }
      }
      if(data.length<1){
          this.$message.error('请选择发车配件'); return;
      }
       this.innerVisible = true;
    },
    Clickinquiry2() {
      let data = {
        afterSaleIds: [],
        gid: this.gid,
        remark:this.beizhu
      };
      for (var i in this.supplierlist) {
        if (this.supplierlist[i].checked == true) {
          data.afterSaleIds.push(this.supplierlist[i].id);
        }
      }
      console.log(data);

        afterSaleDeliver(data).then(res => {
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: "发车成功!"
            });
            this.beizhu = '';
            this.centerDialogVisible= false;
              this.innerVisible = false;
          }
        });

    },

  }
};
</script>
<style scoped>
	.orderUl li {
		float: left;
		padding: 4px 10px;
		border-radius: 5px;
		cursor: pointer;
		margin-left: 10px;
		transition: .5s;
		font-size: 16px;
	}
	
	.orderUl li:hover {
		background: rgba(0, 0, 0, 0.1);
		transition: .5s;
	}
	
	.orderUl li.active {
		background: #3AC29F;
		color: #fff;
	}

.mis{
	height: 35px;
	width: 35px;
	   vertical-align:middle;
}
.mis2{
	  vertical-align:middle;
	  margin-left: 3px;

}
.miaa{
	margin-right: 50px;
	cursor: pointer;
	    font-size: 16px;
}
.lines2 {
  border-bottom: 1px solid #ebeef5;
  height: 60px;
  line-height: 50px;
}
.outlis {
  overflow: hidden;
  height: 34px;
  line-height: 34px;
  padding-top: 3px;
}
.outlis div {
  display: inline-block;
  line-height: 30px;
  overflow: hidden;
  
}
.outlis_a {
  height: 20px;
  line-height: 20px;
  color: #999;
}
.chengde {
  height: 20px;
  float: left;
  font-size: 12px;
  padding-left: 10px;
}
.wode {
  float: right;
  font-size: 12px;
}
.chengde2 {
  width: 32%;
  border-left: 5px solid #74a496;
  padding-left: 5px;
}
.shushu {
  width: 32%;
  text-align: center;
}
.phin {
  width: 32%;
  float: right;
}

</style>


