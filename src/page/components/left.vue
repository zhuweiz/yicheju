<template>
    <div class="w-100 h-100">
    	<ul>
    	<li :class="orderNavActive == index?'active':''" v-for="(item,index) in navList" :key="index" @click="toPages(index,item.link)">
    		<div>
    		<i :class="['iconfont',item.icon]"></i>
    		<p>{{item.name}}</p>
    		</div>
    	</li>
    	</ul>
    </div>
</template>

<script>
export default {
  name: "left",
  data() {
    return {
		orderNavActive:0,
		navList:[
			{name:"首页",icon:"icon-shouye1",link:"/"},
			{name:"工单",icon:"icon-2wodezhangdan18x20",link:"../home/order"},
			{name:"财务",icon:"icon-caiwuguanli",link:"../home/formPage"},
			{name:"配件",icon:"icon-2wodezhangdan18x20",link:"../home/parts"},
			{name:"设置",icon:"icon-caiwuguanli",link:"../home/setting"},
		]
	};
  },
  mounted() {
	  if(this.$route.path == "/"){this.orderNavActive = 0}
		else if(this.$route.path == "/home/order"|| this.$route.path == "/home/orderX"){this.orderNavActive = 1}	
		else if(this.$route.path == "/home/formPage" ||this.$route.path == "/home/formPageB" ||this.$route.path == "/home/formPageB_B"|| this.$route.path == "/home/formB" || this.$route.path == "/home/formC" || this.$route.path == "/home/formD" || this.$route.path == "/home/formE" || this.$route.path == "/home/formF"||this.$route.path == "/home/formK" || this.$route.path == "/home/formJ" ||this.$route.path == "/home/formL" || this.$route.path == "/home/formG" || this.$route.path == "/home/formH" || this.$route.path == "/home/formI"){
			this.orderNavActive = 2
			}
		else if(this.$route.path == "/home/parts"|| this.$route.path == "/home/stock"|| this.$route.path == "/home/out_stock"|| this.$route.path == "/home/in_stock"|| this.$route.path == "/home/stock_order"|| this.$route.path == "/home/stock_enquiry"|| this.$route.path == "/home/supplier"){this.orderNavActive = 3}	
		else if(this.$route.path == "/home/setting"|| this.$route.path == "/home/role"|| this.$route.path == "/home/qrcode"|| this.$route.path == "/home/project_setting"|| this.$route.path == "/home/parts_setting"|| this.$route.path == "/home/royalty_setting"){this.orderNavActive = 4}	
  },
   watch:{
    $route( to , from ){   
        if(to.path == "/"){
			this.orderNavActive = 0
		}
     }
	},
  methods: {
	toPages(i,link){
				console.log(link)
		this.orderNavActive = i
		this.$router.push({path:link});

	},
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>
<style scoped>
	ul li{width: 100%;height: 120px; text-align: center;display: flex;align-items: center;justify-content: center;color: #74A496;cursor: pointer;}
	ul li:hover{background:rgba(255,255,255,.1);color: #3AC29F;}
	ul li.active{background:rgba(255,255,255,1);color: #3AC29F;position: relative;}
	ul li.active::after{content: "";position: absolute;top: 0;left: 0;width: 0;height: 0;border-style: solid;border-width: 20px 20px 0 0;border-color: #3AC29F transparent transparent transparent;}
	ul li i{font-size: 26px;}
</style>
