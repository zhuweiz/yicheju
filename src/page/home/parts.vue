<template>
 <div class="w-100 order flex-col h-100 over-y-auto" style="padding-left: 30px;">
		<div class="p-tb-30">
			<h2 class="left f-18" style="width: 150px;color: #0D906E;padding-top:12px;font-weight: normal;">| 配件</h2>
			<ul class="left orderUl" style="width:80%;padding-top: 5px;">
				<li :class="index==orderNavActive?'active':''" v-for="(item,index) in orderList" :key="index" @click="orderTab(index,item.link)">{{item.name}}</li>
			</ul>
			<div class="clear"></div>
		</div>
			<router-view/>
    </div>
</template>

<script>
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
      orderNavActive: null,
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





</style>


