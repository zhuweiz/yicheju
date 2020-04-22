<template>
	<div class="w-100" style="padding-left: 30px;">
		<div class="p-tb-10 int">
			<h2 class="left f-18" style="width: 250px;color: #0D906E;padding-top: 15px;font-weight: normal;">| {{data.carNo}}</h2>
			<p class="left" style="width: 300px;padding-top: 15px;">工单号：<em style="color: #0D906E;">{{data.billNumber}}</em></p>
			<div class="right m-r-20">
				<div v-if="data.status === 1" class="left c-p" style="width: 334px; height: 58px;background: url(../../../static/img/state01.png) no-repeat;background-size: 100% 100%;"></div>
				<div v-if="data.status === 2 || data.status === 3" class="left c-p" style="width: 334px; height: 58px;background: url(../../../static/img/state02.png) no-repeat;background-size: 100% 100%;"></div>
				<div v-if="data.status === 4 || data.status === 5" class="left c-p" style="width: 334px; height: 58px;background: url(../../../static/img/state03.png) no-repeat;background-size: 100% 100%;"></div>
				<div v-if="data.status === 6" class="left c-p" style="width: 334px; height: 58px;background: url(../../../static/img/state04.png) no-repeat;background-size: 100% 100%;"></div>
			</div>
			<div class="clear"></div>
			</div>
				<div style="background:rgba(229,246,247,1);padding:0 20px;">
				<el-row>
						  <el-col :xs="24"  :md="data.insuranceInfoDO?3:4" style="padding:20px 0;">
						  	<p>车      型：{{data.standard}}</p>
						  	<p>客户全称：{{data.ownerName}}</p>
						  	<p>VIN：{{data.vin}}</p>
						  	<p>手机号：{{data.phone}}</p>
						  </el-col>
						  <el-col :xs="24" :md="data.insuranceInfoDO?3:4"  style="padding:20px 0;">
						  	<p>接 车 员：{{data.sellsMan}}</p>
						  	<p>客户来源：{{data.source}}</p>
						  	<p>业 务 员：{{data.sellsMan}}</p>
						  	<p>初定提车：{{data.completeTime}}</p>
							<p><el-button size="small" @click="royaltyConfim(1, {price: data.amountReceivable})">业务提成</el-button></p>
						  </el-col>
					<el-col :xs="24" :md="4" style="border-left:1px solid #dedede;border-right:1px solid #dedede;padding-left: 20px;;margin-top: 20px;" v-if="data.insuranceInfoDO">
				  	<p>保单号：{{data.insuranceInfoDO.insureBillNumber}}</p>
				  	<p>类 型：<em v-if="data.insuranceInfoDO.type === 0">标的车</em><em v-if="data.insuranceInfoDO.type === 1">三者车</em></p>
				  	<p>保险公司：{{data.insuranceInfoDO.insureCompanyName}}</p>
				  </el-col>
				 
				  <el-col :xs="24" :md="6" class=" rel taocanTable" style="font-size: 22px;color: #74A496;padding-left: 20px;">
				  	
				  	 <el-table
				  	 	v-if="this.taocanLength"
					      :data="tableData3"
					      max-height="120px"
					      style="width: 100%">
					      <el-table-column
					        :label="'套餐（'+ taocanLength +')'">
					        <template slot-scope="scope">
					        	{{scope.row.comboName}}
					         </template>
					      </el-table-column>
					      <el-table-column
					        label="购买日期">
					        <template slot-scope="scope">
					        {{scope.row.startDate}}
					         </template>
					      </el-table-column>
					      <el-table-column
					        label="有效期至">
					        <template slot-scope="scope">
					        {{scope.row.endDate}}
					         </template>
					      </el-table-column>
					    </el-table>
					    
					    <span v-else class="abs" style="top:20px;left: 20px; font-size: 16px;width: 100%;">套餐：<em class="radius" style="background: #0D906E;color: #fff;padding: 0 15px;">0</em><em class="abs" style="top:40px;width:100px;font-size: 16px !important;">暂无套餐</em></span>
					    
				  </el-col>
					<el-col :xs="24" :md="8" class="text-center rel taocanTable" style="font-size: 22px;color: #74A496;float:right;margin-top:15px;">
					    <span class="abs" style="top:5px;left: 20px; font-size: 16px;">外观留图</span>
						<span class="abs" style="top:25px;left: 20px; font-size: 13px;color:#666;">（共{{srcList.length}}张）</span>
					    <!-- <el-image 
								style="width: 100px; height: 100px"
								:src="url" 
								:preview-src-list="srcList">
								<div slot="error" class="image-slot">
									<i class="el-icon-picture-outline"></i>
								</div>
							</el-image> -->
						<el-carousel arrow="always" :autoplay="false" :loop="false" :initial-index="1" type="card" height="100px" style="width:80%;float:right;">
							<el-carousel-item v-for="item in srcList" :key="item">
							<el-image @click="viewPhoto(item)"
								style="width: 100px; height: 100px"
								:src="item"
								fit="fit"></el-image>
							</el-carousel-item>
						</el-carousel>
				  </el-col>
				</el-row>
			</div>
			
			<div class="p-10" style="border-bottom: 1px solid #EEEEEE;">
				<ul class="left orderUl" style="width: 400px;padding-top: 5px;">
				<li :class="index==orderNavActive?'active':''" v-for="(item,index) in orderList" :key="index" @click="orderTab(index)">{{item}}</li>
				<div class="clear"></div>
			</ul>
			
			<div class="right m-r-20" v-if="orderNavActive == 0">
				<div class="left c-p c-9" style="width: 106px; height: 42px;line-height: 42px;background: url(../../../static/img/but2.png) no-repeat;background-size: 100% 100%;text-indent: 50px;" @click="toPrint()">打印</div>
			</div>
			<div class="right m-r-20" v-if="orderNavActive == 1">
				<div class="left c-p c-9" style="width: 120px; height: 42px;line-height: 42px;background: url(../../../static/img/but2.png) no-repeat;background-size: 100% 100%;text-indent: 50px;" @click="toFilePrint()">打印附件</div>
			</div>
			<div class="right m-r-20" v-if="orderNavActive == 2">
				<div class="left c-p c-9" style="width: 106px; height: 42px;line-height: 42px;background: url(../../../static/img/but2.png) no-repeat;background-size: 100% 100%;text-indent: 50px;" @click="toDamagePrint()">打印</div>
			</div>
			<div class="right m-r-20">
				<div class="left c-p c-9" style="width: 146px; height: 42px;line-height: 42px;background: url(../../../static/img/but2.png) no-repeat;background-size: 100% 100%;text-indent: 60px;" @click="toOrderPrint()">打印派工单</div>
			</div>
			<div class="right m-r-20" style="padding-top:3px;" v-if="orderNavActive == 0 && data.settlementStatus != 1">
				<div class="left c-p c-9 info_btn" @click="saveWorkInfo">保存</div>
			</div>
			<div class="right m-r-20" style="padding-top:3px;" v-if="orderNavActive == 2 && data.settlementStatus != 1">
				<div class="left c-p c-9 info_btn" @click="saveDamageInfo">保存</div>
			</div>
			<div class="right m-r-20" style="padding-top:3px;" v-if="orderNavActive == 2 && data.settlementStatus != 1">
				<div class="left c-p c-9 info_btn" @click="copyInfo">复制到主单</div>
			</div>
			<div class="clear"></div>
			</div>
			
			
			<el-row :gutter="10" class="orderTable" v-if="orderNavActive == 0">
			  <el-col :xs="24" :md="8">
			  	<h2 class="f-18 p-tb-10" style="width: 130px;color: #0D906E;font-weight: normal;float:left;">| 项目工时清单</h2>
				  <div class=" su" style="display: inline-block">{{tableData1.length}}</div>
					<el-button type="text" icon="el-icon-plus" style="float:right;color:#000;" @click="addProjectDialog" v-if="data.settlementStatus != 1">新增项目</el-button>
			  	<el-table
			      :data="tableData1"
			      :height="400+'px'"
			      style="width: 100%">
			      <el-table-column
			        prop="date"
			        label="序号"
			        type="index"
			        width="50">
			      </el-table-column>
				  <el-table-column
			        label=""
					width="60"
					>
			        <template slot-scope="scope" v-if="scope.row.ciId">
						<el-tag type="danger" effect="dark">套餐</el-tag>
			         </template>
			      </el-table-column>
			      <el-table-column
			        prop="name"
					width="170"
			        label="项目名称">
			        <template slot-scope="scope">
			        	{{scope.row.itemName}}
			         </template>
			      </el-table-column>
			      <el-table-column
			        prop="standPrice"
			        label="单价">
			        <template slot-scope="scope">
			        {{scope.row.standPrice}}
			         </template>
			      </el-table-column>
				  <el-table-column
			        prop="counts"
			        label="数量">
			        <template slot-scope="scope">
			        {{scope.row.counts}}
			         </template>
			      </el-table-column>
				  <el-table-column
			        prop="percentage"
			        label="提成">
			        <template slot-scope="scope">
			        {{scope.row.percentage}}
			         </template>
			      </el-table-column>
					<el-table-column label="" width="100">
			        <template slot-scope="scope">
						<el-dropdown trigger="click" @command="handleCommand" v-if="data.settlementStatus != 1">
							<el-button plain  size="small">
								操作<i class="el-icon-arrow-down el-icon--right"></i>
							</el-button>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item :command="{type: 'send_work', params: scope.row}">派工</el-dropdown-item>
								<el-dropdown-item :command="{type: 'add_parts', params: scope.row, index: scope.$index}">新增配件</el-dropdown-item>
								<el-dropdown-item :command="{type: 'edit_project', params: scope.row}">编辑项目</el-dropdown-item>
								<el-dropdown-item :command="{type: 'delete_project', params: scope.row, index: scope.$index}">删除项目</el-dropdown-item>
								<el-dropdown-item :command="{type: 'royalty', params: scope.row, index: scope.$index}">提成设置</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>	
			        </template>
			      </el-table-column>
			    </el-table> 
			  </el-col>
			  <el-col :xs="24" :md="16">
			  	<h2 class="f-18 p-tb-10" style="width: 100px;color: #0D906E;font-weight: normal;float:left;">| 配件清单</h2>
				    <div class=" su" style="display: inline-block">{{tableData2.length}}</div>
			  	<el-table
			      :data="tableData2"
			      :height="400+'px'"
			      style="width: 100%">
			      <el-table-column
			        prop="date"
			        label="序号"
			        type="index"
			        width="80">
			      </el-table-column>
			      <el-table-column
			        prop="name"
					width="170"
			        label="配件名称"
			        >
			        <template slot-scope="scope">
			        {{scope.row.partName}}
			         </template>
			      </el-table-column>
						<el-table-column
			        prop="name"
			        label="照片"
			        >
			        <template slot-scope="scope">
								<el-button type="text" style="color:#0d906e;" @click="viewPhoto(scope.row.imageUrl)">查看</el-button>
			        </template>
			      </el-table-column>
						<el-table-column
			        prop="name"
			        label="来源"
			        >
			        <template slot-scope="scope">
								<el-tag v-if="scope.row.source == 0" type="danger">库存</el-tag>
								<el-tag v-if="scope.row.source == 1">询价</el-tag>
								<el-tag v-if="scope.row.source == 2" type="info">外购</el-tag>
			         </template>
			      </el-table-column>
			      <el-table-column
			        prop="address"
			        label="规格型号">
			        <template slot-scope="scope">
			        {{scope.row.unit}}
			         </template>
			      </el-table-column>
			      <el-table-column
			        prop="address"
			        label="数量">
			        <template slot-scope="scope">
			        {{scope.row.counts}}
			         </template>
			      </el-table-column>
			      <el-table-column
			        prop="address"
			        label="进价">
			        <template slot-scope="scope">
			        {{scope.row.inPrice}}
			         </template>
			      </el-table-column>
			      <el-table-column
			        prop="address"
			        label="售价">
			        <template slot-scope="scope">
			        {{scope.row.price}}
			         </template>
			      </el-table-column>
			      <el-table-column
			        prop="address"
			        label="金额">
			        <template slot-scope="scope">
			        {{scope.row.price * scope.row.counts}}
			         </template>
			      </el-table-column>
			      <el-table-column
			        prop="itemName"
			        label="项目名称">
			      </el-table-column>
				  <el-table-column
			        prop="percentage"
			        label="提成">
			      </el-table-column>
						<el-table-column
							align="center"
							label="操作"
							width="220">
							<template slot-scope="scope">
								<el-button size="small" plain @click="royaltyConfim(3,scope.row)" v-if="data.settlementStatus != 1">提成</el-button>
								<el-button size="small" plain @click="editParts(scope.row)" v-if="data.settlementStatus != 1">编辑</el-button>
								<el-button type="danger" size="small" @click="deleteParts(scope.row, scope.$index)" v-if="data.settlementStatus != 1">删除</el-button>
							</template>
						</el-table-column>
			    </el-table> 
			  </el-col>
			</el-row>
			
			<el-row :gutter="10" class="orderTable" v-if="orderNavActive == 1">
			  <el-col :xs="24" :md="8">
			  	<h2 class="f-18 p-tb-10" style="width: 150px;color: #0D906E;font-weight: normal;float:left;">| 项目工时清单</h2>
			  	<el-table
			      :data="tableData4"
			      :max-height="maxHeight"
			      style="width: 100%">
			      <el-table-column
			        prop="date"
			        label="序号"
			        type="index"
			        width="80">
			      </el-table-column>
			      <el-table-column
			        prop="name"
			        label="项目名称">
			        <template slot-scope="scope">
			        {{scope.row.item}}
			         </template>
			      </el-table-column>
			      <el-table-column
			        prop="address"
			        label="金额">
			        <template slot-scope="scope">
			        {{scope.row.standPrice}}
			         </template>
			      </el-table-column>
			    </el-table> 
			  </el-col>
			  <el-col :xs="24" :md="16">
			  	<h2 class="f-18 p-tb-10" style="width: 150px;color: #0D906E;font-weight: normal;float:left;">| 配件清单</h2>
			  	<el-table
			      :data="tableData5"
			      :max-height="maxHeight"
			      style="width: 100%">
			      <el-table-column
			        prop="date"
			        label="序号"
			        type="index"
			        width="80">
			      </el-table-column>
			      <el-table-column
			        prop="name"
			        label="配件名称"
			        >
			        <template slot-scope="scope">
			        {{scope.row.partName}}
			         </template>
			      </el-table-column>
						
			      <el-table-column
			        prop="address"
			        label="数量">
			        <template slot-scope="scope">
			        {{scope.row.total}}
			         </template>
			      </el-table-column>
			      <el-table-column
			        prop="address"
			        label="单价">
			        <template slot-scope="scope">
			        {{scope.row.sellPrice}}
			         </template>
			      </el-table-column>
			      <el-table-column
			        prop="address"
			        label="金额">
			        <template slot-scope="scope">
			        {{scope.row.sellPrice * scope.row.total}}
			         </template>
			      </el-table-column>
			    </el-table> 
			  </el-col>
			</el-row>

			<el-row :gutter="10" class="orderTable" v-if="orderNavActive == 2">
			  <el-col :xs="24" :md="8">
			  	<h2 class="f-18 p-tb-10" style="width: 150px;color: #0D906E;font-weight: normal;float:left;">| 项目清单</h2>
					<el-button type="text" icon="el-icon-plus" style="float:right;color:#000;" @click="addLossProjectDialog" v-if="data.settlementStatus != 1">新增项目</el-button>
			  	<el-table
			      :data="projectList1"
			      :max-height="maxHeight"
			      style="width: 100%">
			      <el-table-column
			        prop="date"
			        label="序号"
			        type="index"
			        width="80">
			      </el-table-column>
			      <el-table-column
			        prop="name"
			        label="拆装">
			        <template slot-scope="scope">
			        {{scope.row.itemName}}
			        </template>
			      </el-table-column>
			    </el-table> 
				<el-table
			      :data="projectList2"
			      :max-height="maxHeight"
			      style="width: 100%">
			      <el-table-column
			        prop="date"
			        label="序号"
			        type="index"
			        width="80">
			      </el-table-column>
			      <el-table-column
			        prop="name"
			        label="钣金">
			        <template slot-scope="scope">
			        {{scope.row.itemName}}
			        </template>
			      </el-table-column>
			    </el-table> 
				<el-table
			      :data="projectList3"
			      :max-height="maxHeight"
			      style="width: 100%">
			      <el-table-column
			        prop="date"
			        label="序号"
			        type="index"
			        width="80">
			      </el-table-column>
			      <el-table-column
			        prop="name"
			        label="喷漆">
			        <template slot-scope="scope">
			        {{scope.row.itemName}}
			        </template>
			      </el-table-column>
			    </el-table> 
				<el-table
			      :data="projectList4"
			      :max-height="maxHeight"
			      style="width: 100%">
			      <el-table-column
			        prop="date"
			        label="序号"
			        type="index"
			        width="80">
			      </el-table-column>
			      <el-table-column
			        prop="name"
			        label="机修">
			        <template slot-scope="scope">
			        {{scope.row.itemName}}
			        </template>
			      </el-table-column>
			    </el-table> 
			  </el-col>
			  <el-col :xs="24" :md="16">
			  	<h2 class="f-18 p-tb-10" style="width: 150px;color: #0D906E;font-weight: normal;float:left;">| 配件清单</h2>
					<el-button type="text" icon="el-icon-plus" style="float:right;color:#000;" @click="addLossPartsDialog" v-if="data.settlementStatus != 1">新增配件</el-button>
			  	<el-table
			      :data="partsList"
			      :max-height="maxHeight"
			      style="width: 100%">
			      <el-table-column
			        prop="date"
			        label="序号"
			        type="index"
			        width="80">
			      </el-table-column>
			      <el-table-column
			        prop="name"
			        label="配件名称"
			        >
			        <template slot-scope="scope">
			        {{scope.row.itemName}}
			         </template>
			      </el-table-column>
			      <el-table-column
			        prop="address"
			        label="数量">
			        <template slot-scope="scope">
			        {{scope.row.counts}}
			         </template>
			      </el-table-column>
			      <el-table-column
			        prop="address"
			        label="单价">
			        <template slot-scope="scope">
			        {{scope.row.price}}
			         </template>
			      </el-table-column>
			      <el-table-column
			        prop="address"
			        label="金额">
			        <template slot-scope="scope">
			        {{scope.row.price * scope.row.counts}}
			         </template>
			      </el-table-column>
			      <!--<el-table-column
			        prop="address"
			        type="index"
			        label="项目序号">
			      </el-table-column>-->
			    </el-table> 
			  </el-col>
			</el-row>

			<p class="p-tb-20 orderXHeji">
				<em>项目：{{data.receivableItemAmount}}</em><i>|</i>
				<em>配件：{{data.receivablePartAmount}}</em><i>|</i>
				<em>工单合计：{{data.amountReceivable}}</em><i>|</i>
				<em>折让：{{data.amountActual ? (data.amountReceivable - data.amountActual).toFixed(2) : 0}}</em><i>|</i>
				<em>利润：{{lirun}}</em><i>|</i>
				<em>提成：{{data.totalPercentage}}（业务：{{data.orderPercentage}} 工时：{{data.itemPercentage}} 配件：{{data.partPercentage}}）</em>
			</p>

			<el-dialog
				title="查看照片"
				:visible.sync="visible.photoVisible"
				width="30%"
				center
				:modal="false"
				>
				<span><el-image
					style="width: 100%;margin:0 auto; "
					:src="photoUrl"
					fit="fill"
					></el-image></span>
				<span slot="footer" class="dialog-footer">
					<el-button type="primary" @click="visible.photoVisible = false">确 定</el-button>
				</span>
			</el-dialog>
			
			<div class="addProject">
				<el-dialog
					title="添加项目"
					:visible.sync="visible.addProjectVisible"
					width="30%"
					center
					:modal="false"
					:show-close="false"
					>
					<span style="position:relative;top:-60px;right:-80%;">
						<el-button plain style="color:0d906e;" @click="selectMeal">套餐选择</el-button>
					</span>
					<div style="width:100%;position:relative;top:-44px;">
						<div class="lines">
							<el-input v-model="projectSearch" prefix-icon="el-icon-search" placeholder="请输入项目" style="width:78%;"></el-input>
							<el-button type="danger" style="margin-left:10px;" @click="createProject">创建项目</el-button>
						</div>
						<div class="lines">
						<el-table
							ref="productTable"
							:data="projectList"
							tooltip-effect="dark"
							:show-header="false"
							style="width: 100%"
							max-height="250"
							@selection-change="selectProject"
							>
							<el-table-column
								prop="item"
								label="">
							</el-table-column>
							<el-table-column
								prop="standPrice"
								label="">
							</el-table-column>
							<el-table-column
								type="selection"
								width="50">
							</el-table-column>
						</el-table>
						</div>

						<div class="lines">
							<h2>已选项目：{{selectProjectList.length}}个</h2>
							<el-table
								:data="selectProjectList"
								tooltip-effect="dark"
								:show-header="false"
								style="width: 100%"
								max-height="250"
								>
								<el-table-column
									prop="item"
									label="">
								</el-table-column>
								<el-table-column
									label="操作"
									width="50">
									<template slot-scope="scope">
										<el-button
											@click.native.prevent="deleteRow(scope.$index, scope.row)"
											type="text"
											size="small">
											删除
										</el-button>
									</template>
								</el-table-column>
							</el-table>
						</div>

					</div>
					<span slot="footer" class="dialog-footer">
						<el-button type="danger" @click="visible.addProjectVisible = false">取 消</el-button>
						<el-button type="success" @click="addProjectSubmit">确 定</el-button>
					</span>
				</el-dialog>
			</div>

			<el-dialog title="选择套餐项目" :visible.sync="visible.mealVisible" center :modal="false">
				<el-table :data="tableData3[0] ? tableData3[0].comboItemList : []" @selection-change="selectMealProject">
					<el-table-column label="名称">
						<template slot-scope="scope">{{ tableData3[0].comboName}}</template>
					</el-table-column>
					<el-table-column label="日期">
						<template slot-scope="scope">{{ tableData3[0].startDate}}</template>
					</el-table-column>
					<el-table-column label="有效期">
						<template slot-scope="scope">{{ tableData3[0].endDate}}</template>
					</el-table-column>
					<el-table-column property="itemName" label="项目名称"></el-table-column>
					<el-table-column property="totalTimes" label="包含次数"></el-table-column>
					<el-table-column property="surplusTimes" label="剩余次数"></el-table-column>
					<el-table-column
						type="selection"
						width="50">
					</el-table-column>
				</el-table>
				<div slot="footer" class="dialog-footer">
					<el-button type="danger" @click="visible.mealVisible = false">取 消</el-button>
					<el-button type="success" @click="mealSubmit">提 交</el-button>
				</div>
			</el-dialog>

			<el-dialog title="创建新项目" :visible.sync="visible.createProjectVisible" center width="30%" :modal="false">
				<el-form :model="createProjectForm">
					<el-form-item label="项目名称" label-width="100px">
						<el-input v-model="createProjectForm.item"></el-input>
					</el-form-item>
					<el-form-item label="项目价格" label-width="100px">
						<el-input v-model.number="createProjectForm.standPrice"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button type="danger" @click="visible.createProjectVisible = false">取 消</el-button>
					<el-button type="success" @click="createProjectSubmit">提 交</el-button>
				</div>
			</el-dialog>

			<el-dialog title="派工" :visible.sync="visible.deliverVisible" center :modal="false" width="40%">
				<el-checkbox-group v-model="deliverCheck">
					<el-card class="box-card" style="margin-top:10px;" v-for="item in workList" :key="item.groupId">
						<div slot="header" class="clearfix">
							<span>{{item.groupName}}</span>
						</div>
						<el-row :gutter="20">
							<el-col :span="6" v-for="v in item.data" :key="v.workerId"><el-checkbox :label="v">{{v.workerName+'   '+v.taskCount+'个任务'}}</el-checkbox></el-col>
						</el-row>
					</el-card>
				 </el-checkbox-group>
				<div slot="footer" class="dialog-footer">
					<el-button type="danger" @click="visible.deliverVisible = false">取 消</el-button>
					<el-button type="success" @click="deliverSubmit">提 交</el-button>
				</div>
			</el-dialog>

			<div class="addProject">
				<el-dialog
					title="添加配件"
					:visible.sync="visible.addPartsVisible"
					width="35%"
					center
					:modal="false"
					:show-close="false"
					>
					<div style="width:100%;">
						<div class="lines">
							<el-input v-model="partSearch"  prefix-icon="el-icon-search" placeholder="请输入配件" style="width:78%;"></el-input>
							<el-button type="danger" style="margin-left:10px;" @click="createParts">创建配件</el-button>
						</div>
						<div class="lines">
						<el-table
							ref="partTable"
							:data="partList"
							tooltip-effect="dark"
							:show-header="false"
							style="width: 100%"
							max-height="250"
							@selection-change="selectPart"
							>
							<el-table-column
								label="">
								<template slot-scope="scope">{{ scope.row.partName }}</template>
							</el-table-column>
							<el-table-column
								label="">
								<template slot-scope="scope">{{ scope.row.model }}</template>
							</el-table-column>
							<el-table-column
								prop="sellPrice"
								label="">
								<template slot-scope="scope">
									<el-tag type="danger" effect="dark" v-if="scope.row.isFactioryPartName == 0">库</el-tag>
									<el-tag type="success"  v-if="scope.row.isFactioryPartName == 1">询</el-tag>
								</template>
							</el-table-column>
							<el-table-column
								prop="sellPrice"
								label="">
							</el-table-column>
							<el-table-column
								type="selection"
								width="50">
							</el-table-column>
						</el-table>
						</div>

						<div class="lines">
							<h2 @click="ccd">已选配件：{{selectPartList.length}}个</h2>
							<el-table
								:data="selectPartList"
								tooltip-effect="dark"
								:show-header="false"
								style="width: 100%"
								max-height="250"
								>
								<el-table-column
									label="">
									<template slot-scope="scope">{{ scope.row.partName }}</template>
								</el-table-column>
								<el-table-column
									label="操作"
									width="50">
									<template slot-scope="scope">
										<el-button
											@click.native.prevent="deleteRows(scope.$index, scope.row)"
											type="text"
											size="small">
											删除
										</el-button>
									</template>
								</el-table-column>
							</el-table>
						</div>

					</div>
					<span slot="footer" class="dialog-footer">
						<el-button type="danger" @click="visible.addPartsVisible = false">取 消</el-button>
						<el-button type="success" @click="addPartsSubmit">确 定</el-button>
					</span>
				</el-dialog>
			</div>

			<el-dialog title="创建新配件" :visible.sync="visible.createPartsVisible" center width="30%" :modal="false">
				<el-form :model="createPartsForm">
					<el-form-item label="配件名称" label-width="100px">
						<el-input v-model="createPartsForm.partName"></el-input>
					</el-form-item>
					<el-form-item label="配件价格" label-width="100px">
						<el-input v-model.number="createPartsForm.sellPrice"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button type="danger" @click="visible.createPartsVisible = false">取 消</el-button>
					<el-button type="success" @click="createPartsSubmit">提 交</el-button>
				</div>
			</el-dialog>

			<el-dialog title="编辑项目" :visible.sync="visible.editProjectVisible" center width="30%" :modal="false">
				<el-form :model="editProjectForm">
					<el-form-item label="项目" label-width="100px">
						{{editProjectForm.itemName}}
					</el-form-item>
					<el-form-item label="工时费" label-width="100px">
						<el-input v-model="editProjectForm.standPrice"></el-input>
					</el-form-item>
					<el-form-item label="项目数量" label-width="100px">
						<el-input v-model.number="editProjectForm.counts"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button type="danger" @click="visible.editProjectVisible = false">取 消</el-button>
					<el-button type="success" @click="editProjectSubmit">提 交</el-button>
				</div>
			</el-dialog>

			<el-dialog title="编辑配件" :visible.sync="visible.editPartsVisible" center width="30%" :modal="false">
				<el-form :model="editPartsForm">
					<el-form-item label="配件" label-width="100px">
						{{editPartsForm.partName}}
					</el-form-item>
					<el-form-item label="单价" label-width="100px">
						<el-input v-model="editPartsForm.price"></el-input>
					</el-form-item>
					<el-form-item label="数量" label-width="100px">
						<el-input v-model="editPartsForm.counts"></el-input>
					</el-form-item>
					<el-form-item label="工时费" label-width="100px">
						<el-input v-model="editPartsForm.timePrice"></el-input>
					</el-form-item>
					<el-form-item label="进价" label-width="100px">
						<el-input v-model="editPartsForm.inPrice"></el-input>
					</el-form-item>
					<el-form-item label="询价" label-width="100px">
						<el-radio-group v-model="editPartsForm.source" :disabled="editPartsForm.source == 0">
							<el-radio label="1">是</el-radio>
							<el-radio label="2">否</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button type="danger" @click="visible.editPartsVisible = false">取 消</el-button>
					<el-button type="success" @click="editPartsSubmit">提 交</el-button>
				</div>
			</el-dialog>

			<div class="addProject">
				<el-dialog
					title="添加项目"
					:visible.sync="visible.addLossProjectVisible"
					width="30%"
					center
					:modal="false"
					:show-close="false"
					>
					<div style="width:100%;">
						<div class="lines">
							<el-input v-model="lossProjectSearch" prefix-icon="el-icon-search" placeholder="请输入项目" style="width:78%;"></el-input>
							<el-button type="danger" style="margin-left:10px;" @click="createProject">创建项目</el-button>
						</div>
						<div class="lines">
						<el-table
							ref="lossProductTable"
							:data="projectList"
							tooltip-effect="dark"
							:show-header="false"
							style="width: 100%"
							max-height="250"
							@selection-change="selectLossProject"
							>
							<el-table-column
								prop="item"
								label="">
							</el-table-column>
							<el-table-column
								prop="standPrice"
								label="">
							</el-table-column>
							<el-table-column
								type="selection"
								width="50">
							</el-table-column>
						</el-table>
						</div>

						<div class="lines">
							<h2>已选项目：{{selectLossProjectList.length}}个</h2>
							<el-table
								:data="selectLossProjectList"
								tooltip-effect="dark"
								:show-header="false"
								style="width: 100%"
								max-height="250"
								>
								<el-table-column
									prop="item"
									label="">
								</el-table-column>
								<el-table-column>
									<template slot-scope="scope">
										<el-checkbox-group size="small" v-model="scope.row.itemType">
											<el-checkbox-button v-for="item in prefixItem" :key="item.itemType" :label="item">{{item.prefixItemName}}</el-checkbox-button>
										</el-checkbox-group>
									</template>
								</el-table-column>
								<el-table-column
									label="操作"
									width="50">
									<template slot-scope="scope">
										<el-button
											@click.native.prevent="deleteLossProjectRow(scope.$index, scope.row)"
											type="text"
											size="small">
											删除
										</el-button>
									</template>
								</el-table-column>
							</el-table>
						</div>

					</div>
					<span slot="footer" class="dialog-footer">
						<el-button type="danger" @click="visible.addLossProjectVisible = false">取 消</el-button>
						<el-button type="success" @click="addLossProjectSubmit">确 定</el-button>
					</span>
				</el-dialog>
			</div>

			<div class="addProject">
				<el-dialog
					title="添加配件"
					:visible.sync="visible.addLossPartsVisible"
					width="30%"
					center
					:modal="false"
					:show-close="false"
					>
					<div style="width:100%;">
						<div class="lines">
							<el-input v-model="lossPartSearch" prefix-icon="el-icon-search" placeholder="请输入配件" style="width:78%;"></el-input>
							<el-button type="danger" style="margin-left:10px;" @click="createParts">创建配件</el-button>
						</div>
						<div class="lines">
						<el-table
							ref="lossPartTable"
							:data="partList"
							tooltip-effect="dark"
							:show-header="false"
							style="width: 100%"
							max-height="250"
							@selection-change="selectLossPart"
							>
							<el-table-column
								label="">
								<template slot-scope="scope">{{ scope.row.partName }}</template>
							</el-table-column>
							<el-table-column
								prop="sellPrice"
								label="">
							</el-table-column>
							<el-table-column
								type="selection"
								width="50">
							</el-table-column>
						</el-table>
						</div>

						<div class="lines">
							<h2>已选配件：{{selectLossPartList.length}}个</h2>
							<el-table
								:data="selectLossPartList"
								tooltip-effect="dark"
								:show-header="false"
								style="width: 100%"
								max-height="250"
								>
								<el-table-column
									label="">
									<template slot-scope="scope">{{ scope.row.partName }}</template>
								</el-table-column>
								<el-table-column
									label="操作"
									width="50">
									<template slot-scope="scope">
										<el-button
											@click.native.prevent="deleteLossPartRows(scope.$index, scope.row)"
											type="text"
											size="small">
											删除
										</el-button>
									</template>
								</el-table-column>
							</el-table>
						</div>

					</div>
					<span slot="footer" class="dialog-footer">
						<el-button type="danger" @click="visible.addLossPartsVisible = false">取 消</el-button>
						<el-button type="success" @click="addLossPartsSubmit">确 定</el-button>
					</span>
				</el-dialog>
			</div>

			<el-dialog :title="data.carNo+royaltyInfo.royaltyName + '提成设置'" :visible.sync="visible.royaltyVisible" center width="30%" :modal="false">
				<div class="royalty">
					<el-row :gutter="20">
						<el-col :span="5">{{royaltyInfo.name}}</el-col>
						<el-col :span="5" style="text-align:center;"><font color="red">￥{{royaltyInfo.price}}</font></el-col>
						<el-col :span="9"><el-cascader v-model="royaltyInfo.percentageClassId" @change="treeChange" :options="treeData" :show-all-levels="false"></el-cascader></el-col>
						<el-col :span="5" style="text-align:right; cursor: pointer;" ><div style="color:#0d906e" @click="addPercentage">添加员工</div></el-col>
					</el-row>
				</div>
				<div class="royalty" v-for="(item, index) in royaltyForm.percentages" :key="index">
					<el-row :gutter="20">
						<el-col :span="12">{{item.employeeName}}</el-col>
						<el-col :span="12" style="text-align:right;cursor: pointer;" ><div @click="deletePercentage(index)"><font color="red">删除</font></div></el-col>
					</el-row>
					<el-row :gutter="20" type="flex" justify="space-around" align="middle">
						<el-col :span="4">{{royaltyInfo.royaltyName}}提成</el-col>
						<el-col :span="10">
							<el-row type="flex" align="middle">
								<el-col :span="10"><el-radio v-model="item.percentageWay" :label="1">百分比</el-radio></el-col>
								<el-col :span="14">
									<el-input v-model="item.percentagePoint">
										<template slot="append">%</template>
									</el-input>
								</el-col>
							</el-row>
						</el-col>
						<el-col :span="10">
							<el-row type="flex" align="middle">
								<el-col :span="10"><el-radio v-model="item.percentageWay" :label="2">固定</el-radio></el-col>
								<el-col :span="14"><el-input v-model="item.percentageAmout"></el-input></el-col>
							</el-row>
						</el-col>
					</el-row>
				</div>
				<div slot="footer" class="dialog-footer">
					<el-button type="danger" @click="visible.royaltyVisible = false">取 消</el-button>
					<el-button type="success" @click="royaltySubmit">提 交</el-button>
				</div>
			</el-dialog>

			<el-dialog title="选择员工" :visible.sync="visible.userVisible" center :modal="false">
				<el-table :data="userData" @selection-change="selectUser">
					<el-table-column label="序号">
						<template slot-scope="scope">{{ scope.row.id }}</template>
					</el-table-column>
					<el-table-column label="姓名">
						<template slot-scope="scope">{{ scope.row.realName }}</template>
					</el-table-column>
					<el-table-column label="部门">
						<template slot-scope="scope">
							{{ scope.row.groupDutyList ?  scope.row.groupDutyList.groupName + scope.row.groupDutyList.dutyName : '' }}
						</template>
					</el-table-column>
					<el-table-column label="手机">
						<template slot-scope="scope">{{ scope.row.phone }}</template>
					</el-table-column>
					<el-table-column type="selection" width="55"></el-table-column>
				</el-table>
				<div slot="footer" class="dialog-footer">
					<el-button type="danger" @click="visible.userVisible = false">取 消</el-button>
					<el-button type="success" @click="userSubmit">提 交</el-button>
				</div>
			</el-dialog>

	</div>
				 
</template>

<script>
import { getOrderListX, getDamageByOId, getProject, addProject, groupWorksInfo, getPart, addPart, saveWorkInfo, saveDamageInfo, getAttachmentSettlementedDetailByOId, findAllGroupByRole, addOrderPercentage, getOrderPercentages, pageListPC, queryPercentageClass, getItemPercentage, getPartPercentage, queryPercentageClassOne } from "../../request/api.js";
import moment from 'moment';

const unique = function(arr, name) {
  let hash = {}
  return arr.reduce( function ( item, next ) {
    hash[next[name]] ? '' : hash[next[name]] = true && item.push( next )
    return item
  }, [] )
}
export default {
  name: "order",
    inject:['reload'], 
  data() {
    return {
			pjprice:[],
			treeData: [],
			tableData1: [],
			tableData2: [],
			tableData3: [
				{
					comboItemList: []
				}
			],
			taocanLength:null,
			tableData4: [],
			tableData5: [],
			data: "",
			projectList1: [],
			projectList2: [],
			projectList3: [],
			projectList4: [],
			partsList: [],
			orderList: ["主单", "附件", "定损单"],
			orderNavActive: 0,
			prefixItem: [
				{
					itemType: '1',
					prefixItemName: '拆装'
				},
				{
					itemType: '2',
					prefixItemName: '钣金'
				},
				{
					itemType: '3',
					prefixItemName: '喷漆'
				},
				{
					itemType: '4',
					prefixItemName: '机修'
				}
			],
			value1: "",
			maxHeight: undefined,
			form: {
				name: ""
			},
			zonghe: null,
			lirun: "--",
			url: '',
			srcList: [],
			workList: [],
			visible: {
				photoVisible: false,
				addProjectVisible: false,
				mealVisible: false,
				createProjectVisible:false,
				deliverVisible:false,
				addPartsVisible: false,
				createPartsVisible: false,
				editProjectVisible: false,
				editPartsVisible: false,
				addLossProjectVisible: false,
				addLossPartsVisible: false,
				royaltyVisible: false,
				userVisible: false
			},
			photoUrl: '',
			projectSearch: '',
			selectPartName: '',
			projectList: [],
			projectLists: [],
			selectProjectList: [],
			selected: [],

			partSearch: '',
			partList: [],
			partLists: [],
			selectPartList: [],
			selected1: [],

			mealProjectList: {
				comboName: '',
				startDate: '',
				endDate: '',
				list: []
			},
			selectMealProjectList: [],
			createProjectForm: {},
			createPartsForm: {},
			editProjectForm: {},
			editPartsForm: {},
			deliverCheck: [],
			itemDispatchId: '',
			itemDispatch: [],
			selectPartItemId: '',
			selectLossProjectList: [],
			selected2: [],
			lossProjectSearch: '',
			selectLossPartList: [],
			selected3: [],
			lossPartSearch: '',
			userData: [],
			selectedUser: [],
			royaltyForm: {
				oid: localStorage.getItem("oid"),
				sourceType: 1,
				sourceId: '',
				percentages: []
			},
			royaltyInfo: {
				royaltyName: '业务',
				percentage: {}
			}

    };
  },
  watch: {
	  'projectSearch': function(){
		this.projectList = this.projectLists.filter(data => !this.projectSearch || data.item.toLowerCase().includes(this.projectSearch.toLowerCase()))
		this.autoSelect(this.selectProjectList)
	  },
		'lossProjectSearch': function(){
		this.projectList = this.projectLists.filter(data => !this.lossProjectSearch || data.item.toLowerCase().includes(this.lossProjectSearch.toLowerCase()))
		this.autoLossSelect(this.selectLossProjectList)
	  },
		'partSearch': function(){
			this.partList = this.partLists.filter(data => !this.partSearch || data.partName.toLowerCase().includes(this.partSearch.toLowerCase()))
		this.autoSelects(this.selectPartList)
		},
		'lossPartSearch': function(){
			this.partList = this.partLists.filter(data => !this.lossPartSearch || data.partName.toLowerCase().includes(this.lossPartSearch.toLowerCase()))
		this.autoLossPartSelect(this.selectLossPartList)
		}
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
this.ccd()
  },
  mounted() {
    this.maxHeight = $(".tabBox").height() - 102 - 86 - 37 - 80 - 60 + "px";
  },
  methods: {
	  ccd(){
		    const data = {
      oid: localStorage.getItem("oid")
    };
    getOrderListX(data).then(res => {
		
	  this.data = res.data.data;
	  console.log(res.data.data)
	  this.tableData1 = res.data.data.orderItemList;
	//   console.log( this.tableData1)
	
	  if(this.tableData1){
		  this.tableData1.forEach((item, index) => {
        	item.orderPartList.forEach((items, indexs) => {
				this.zonghe += parseInt(items.inPrice * items.counts);
				items.itemName = item.itemName
			
				this.tableData2.push(items);
				this.pjprice =items
			});
		});
      this.lirun =
        this.data.amountActual -
        (this.data.amountActual - this.data.amountReceivable) -
		this.zonghe;

	  }
		this.tableData3 = res.data.data.comboCustomerList
		console.log(this.tableData3)
		this.tableData3.forEach((i)=>{
			i.startDate = moment(i.startDate).format("YYYY-MM-DD")
			i.endDate = moment(i.startDate).format("YYYY-MM-DD")
		})
		this.taocanLength = this.tableData3.length

		const imgList = this.data.orderPictureList
		if(imgList.length > 0){
			this.url = imgList[0].picUrl
		}
		this.srcList = imgList.map(v => v.picUrl)
	});
		console.log(this.tableData2.length)
	  },
		getProject(){
			getProject().then(res => {
				this.projectList = this.projectLists = res.data.data
			})
		},
		getPart(){
			pageListPC({garageId: localStorage.getItem('gid')}).then(res => {
				this.partList = this.partLists = res.data.data
			})
		},
		getAttachmentSettlementedDetailByOId(){
			getAttachmentSettlementedDetailByOId({oid: localStorage.getItem("oid")}).then(res => {
				const data = res.data.data
				this.tableData4 = data.itemList
				if(this.tableData4){
					this.tableData4.forEach(v => {
						v.attachmentPartStoreDTOList.forEach(k => {
							this.tableData5.push(k)
						})
					})
				}
			})
		},
		getDamageByOId(){
			getDamageByOId({oid: localStorage.getItem("oid")}).then(res => {
				const projectList = res.data.data.orderDamageList
				if(projectList){
					this.projectList1 = projectList.filter(v => v.itemType == '1')
					this.projectList2 = projectList.filter(v => v.itemType == '2')
					this.projectList3 = projectList.filter(v => v.itemType == '3')
					this.projectList4 = projectList.filter(v => v.itemType == '4')
					this.partsList = projectList.filter(v => v.itemType == '5')
				}
			})
		},
    orderTab(i) {
			if(i == 1){
				this.getAttachmentSettlementedDetailByOId()
			}else if(i == 2){
				this.getDamageByOId()
			}
      this.orderNavActive = i;
    },
    toPrint() {
//    if (this.data.status != 6) {
//      this.$message({
//        message: "请先结算订单！",
//        type: "error"
//      });
//      return;
//    }

      let routeData = this.$router.resolve({
        path: "../home/print"
      });
      window.open(routeData.href, "_blank");
		},
		toDamagePrint() {
			let routeData = this.$router.resolve({
					path: "../home/damagePrint"
				});
				window.open(routeData.href, "_blank");
		},
		toFilePrint() {
			let routeData = this.$router.resolve({
					path: "../home/filePrint"
				});
				window.open(routeData.href, "_blank");
		},
		toOrderPrint() {
			let routeData = this.$router.resolve({
					path: "../home/orderPrint"
				});
				window.open(routeData.href, "_blank");
		},
		addProjectDialog(){
			if(this.selectProjectList.length == 0) this.getProject()
			this.visible.addProjectVisible = true
		},
		addPartsDialog(){
			this.visible.addPartsVisible = true
		},
		handleCommand(command){
			if(command.type === 'royalty') this.royaltyConfim(2, command.params)
			else this[command.type](command.params, command.index)
		},
		send_work(row){
			if(this.workList.length == 0){
				groupWorksInfo({gid: this.data.gid}).then(res => {
					const arr = res.data.data
					var map = {},
						dest = [];
					for(var i = 0; i < arr.length; i++){
						var ai = arr[i];
						if(ai.groupId != null){
							if(!map[ai.groupName]){
								dest.push({
									groupId: ai.groupId,
									groupName: ai.groupName,
									data: [ai]
								});
								map[ai.groupName] = ai;
							}else{
								for(var j = 0; j < dest.length; j++){
									var dj = dest[j];
									if(dj.groupName == ai.groupName){
										dj.data.push(ai);
										break;
									}
								}
							}
						}
					}
					
					this.itemDispatchId = row.id
					this.workList = dest
				})
			}else{
				this.itemDispatchId = row.id
				this.deliverCheck = this.itemDispatch.filter(v => v.itemId == this.itemDispatchId)
			}
			
			this.visible.deliverVisible = true
		},
		add_parts(params, index){
			// console.log(params)
			if(this.selectPartList.length == 0)  this.getPart()
			this.selectPartItemId = params.id
			this.selectPartName = params.itemName
			this.visible.addPartsVisible = true
		},
		edit_project(row){
			this.editProjectForm = row
			this.visible.editProjectVisible = true
		},
		editProjectSubmit(){
			this.editProjectForm.item = this.editProjectForm.itemName
			this.visible.editProjectVisible = false
			this.$message({
				message: "编辑成功",
				type: "success"
			})
		},
		delete_project(row, index){
			this.$confirm(`确认删除项目${row.itemName}?`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.tableData2 = this.tableData2.filter(v => v.itemId != row.id)

				this.tableData1.splice(index, 1)
				this.$message({
					type: 'success',
					message: '删除成功!'
				})
			}).catch(() => console.log('已取消'))
		},
		deliverSubmit(){
			if(this.deliverCheck.length == 0){
				return this.$message({message: "请先选择派工人员", type: "error"})
			}
			this.deliverCheck.map(v => {
				const row = this.itemDispatch.find(s => s.itemId == this.itemDispatchId && s.groupId == v.groupId && s.workerId == v.workerId)
				if(!row){
					v.itemId = this.itemDispatchId
					v.gid = this.data.gid
					v.oid = parseInt(localStorage.getItem("oid"))
					this.itemDispatch.push(v)
				}
			})

			this.deliverCheck = []
			this.visible.deliverVisible = false
		},
		viewPhoto(url){
			this.photoUrl = url
			this.visible.photoVisible = true
		},
		selectProject(event){
			this.selected = event
			this.selectProjectList = unique(this.selectProjectList.concat(this.selected), 'id')
		},
		autoSelect(arr) {
			this.$nextTick( () => {
				if ( this.projectList !== undefined && arr !== undefined ) {
					this.projectList.forEach( ( v, i ) => {
						arr.forEach(( _v, _i ) => {
							if ( v.id === _v.id ) {
								this.$refs.productTable.toggleRowSelection(v, true )
							}
						})
					})
				}
			})
		},
		autoSelects(arr) {
			this.$nextTick( () => {
				if ( this.partList !== undefined && arr !== undefined ) {
					this.partList.forEach( ( v, i ) => {
						arr.forEach(( _v, _i ) => {
							if ( v.id === _v.id ) {
								this.$refs.partTable.toggleRowSelection(v, true )
							}
						})
					})
				}
			})
		},
		autoLossSelect(arr) {
			this.$nextTick( () => {
				if ( this.projectList !== undefined && arr !== undefined ) {
					this.projectList.forEach( ( v, i ) => {
						arr.forEach(( _v, _i ) => {
							if ( v.id === _v.id ) {
								this.$refs.lossProductTable.toggleRowSelection(v, true )
							}
						})
					})
				}
			})
		},
		autoLossPartSelect(arr){
			this.$nextTick( () => {
				if ( this.partList !== undefined && arr !== undefined ) {
					this.partList.forEach( ( v, i ) => {
						arr.forEach(( _v, _i ) => {
							if ( v.id === _v.id ) {
								this.$refs.lossPartTable.toggleRowSelection(v, true )
							}
						})
					})
				}
			})
		},
		deleteRow(index, row) {
			this.selectProjectList.splice(index, 1)
			this.$refs.productTable.toggleRowSelection(row, false)
		},
		deleteRows(index, row) {
			this.selectPartList.splice(index, 1)
			this.$refs.partTable.toggleRowSelection(row, false)
		},
		createProjectSubmit(){
			const dto = {
				oid: localStorage.getItem("oid"),
				...this.createProjectForm
			}
			addProject(dto).then(e => {
				if(e.data.code == 200){
					this.visible.createProjectVisible = false
					this.$message({
			          message: "创建成功",
			          type: "success"
					})
					this.getProject()
				} 
			})
		},
		//确定选择
		addProjectSubmit(){
			if(this.selectProjectList.length == 0){
				return this.$message({message: "请先选择项目", type: "error"})
			}
			// console.log(this.selectProjectList)
			this.selectProjectList.forEach(v => { 
				if(this.tableData1 && this.tableData1.length > 0){
					let row = this.tableData1.find(k => k.id == v.id)
					if(row){
						return this.$message({message: `项目${row.itemName}已存在`, type: "error"})
					}
				}
				v.itemName = v.item
				if(!this.tableData1) this.tableData1 = []
				this.tableData1.push(v)
				// const index = this.projectList.findIndex(s => s.id = v.id)
				// this.projectList.splice(index, 1)
			})
			this.selectProjectList = this.selected = []
			this.projectSearch = ''
			this.visible.addProjectVisible = false
		},
		//确定添加配件
		addPartsSubmit(){
			if(this.selectPartList.length == 0){
				return this.$message({message: "请先选择配件", type: "error"})
			}
			// console.log(this.selectPartList)
			this.selectPartList.forEach(v => {
				// console.log(v)
				let row = this.tableData2.find(k => k.id == v.id && k.itemId == this.selectPartItemId)
				if(row){
					return this.$message({message: `配件${row.partName}已存在`, type: "error"})
				}
				v.counts = v.total
				v.inPrice = v.exceeds
				v.price = v.sellPrice
				v.itemId = this.selectPartItemId
				v.source = v.gid == -99 ? 1 : 0
				v.partId = v.id
				v.itemName = this.selectPartName
				this.tableData2.push(v)
			})
			this.selectPartList = this.selected1 = []
			this.partSearch = ''
			this.saveWorkInfo()
	
			this.visible.addPartsVisible = false
			this.reload();
		},
		selectMealProject(event){
			this.selectMealProjectList = event
		},
		selectMeal(){
			this.visible.mealVisible = true
			this.visible.addProjectVisible = false
		},
		//创建新配件
		createPartsSubmit(){
			const dto = {
				gid: this.data.gid,
				isFactioryPartName:1,
				...this.createPartsForm
			}
			// console.log(dto)
			addPart(dto).then(e => {
				if(e.data.code == 200){
					this.visible.createPartsVisible = false
					this.$message({
			          message: "创建成功",
			          type: "success"
					})
					this.getPart()
				} 
			})
		},
		mealSubmit(){
			if(this.selectMealProjectList.length == 0){
				return this.$message({message: "请先选择套餐", type: "error"})
			}
			this.selectMealProjectList.forEach(v => {
				v.standPrice = v.perPrice
				this.tableData1.push(v)
			})
			this.visible.mealVisible = false
		},
		createProject(){
			this.visible.createProjectVisible = true
		},
		createParts() {
			this.visible.createPartsVisible = true
		},
		//编辑配件
		editParts(row){
			console.log(row)
			this.editPartsForm = row
			this.visible.editPartsVisible = true
		},
		editPartsSubmit(){
			this.editPartsForm.exceeds = this.editPartsForm.inPrice
			this.editPartsForm.sellPrice = this.editPartsForm.price
			this.editPartsForm.total = this.editPartsForm.counts
			this.$message({
				type: 'success',
				message: '编辑成功!'
			});
			this.visible.editPartsVisible = false
		},
		deleteParts(row, index){
			this.$confirm(`确认删除配件${row.partName}?`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.tableData2.splice(index, 1)
				this.$message({
					type: 'success',
					message: '删除成功!'
				})
			}).catch(() => console.log('已取消'));
		},
		selectPart(event){
			this.selected1 = event
			this.selectPartList = unique(this.selectPartList.concat(this.selected1), 'id')
		},
		addLossProjectDialog(){
			if(this.selectLossProjectList.length == 0) this.getProject()
			this.visible.addLossProjectVisible = true
		},
		addLossPartsDialog(){
			if(this.selectLossPartList.length == 0)  this.getPart()
			this.visible.addLossPartsVisible = true
		},
		//保存主单
		saveWorkInfo(){
			this.data.receivableItemAmount = this.tableData1.reduce(function (accumulator, currentValue) {
					return accumulator + parseFloat(currentValue.standPrice)
				}, 0)
	console.log(this.tableData2)
			this.data.receivablePartAmount = this.tableData2.reduce(function (accumulator, currentValue) {
				
				// console.log(accumulator)
				// console.log(currentValue)
				// console.log(currentValue.counts)
						return accumulator + (parseFloat(currentValue.price) * currentValue.counts)
					// return (accumulator + parseFloat(currentValue.price)) * currentValue.counts
						
				}, 0)
			console.log(this.data.receivableItemAmount)
			
			this.data.amountReceivable = parseFloat(this.data.receivableItemAmount) + parseFloat(this.data.receivablePartAmount)
			let data = {
				oid: localStorage.getItem("oid"),
				gid: this.data.gid,
				receivableItemAmount: this.data.receivableItemAmount,
				receivablePartAmount: this.data.receivablePartAmount,
				amountReceivable: this.data.amountReceivable,
				orderItems: []
			}
				// console.log(this.tableData1)
			data.orderItems = this.tableData1.map(v => {
				
				v.isCombo = v.ciId ? 0 : 1
				v.itemDispatch = this.itemDispatch.filter(item => item.itemId == v.id)
				v.orderPartList = this.tableData2.filter(item => item.itemId == v.id)
				return v
			})
		console.log(data)
			saveWorkInfo(data).then(res => {
				if(res.data.code == 200){
					this.$message({
						type: 'success',
						message: '保存成功!'
					})
				}
			})
			      this.lirun =
        this.data.amountActual -
        (this.data.amountActual - this.data.amountReceivable) -
		this.zonghe;
		},
		selectLossProject(event){
			event.forEach(v => {
				this.$set(v, 'itemType', [])
			})
			this.selected2 = event
			this.selectLossProjectList = unique(this.selectLossProjectList.concat(this.selected2), 'id')
		},
		deleteLossProjectRow(index, row){
			this.selectLossProjectList.splice(index, 1)
			this.$refs.lossProductTable.toggleRowSelection(row, false)
		},
		addLossProjectSubmit(){
			let arr = this.selectLossProjectList.map(v => {
				return v.itemType.map(k => {
					let is = {
						id: v.id,
						gid: v.gid,
						itemName: v.item,
						standPrice: v.standPrice,
					}
					is.itemType = k.itemType
					is.prefixItemName = k.prefixItemName
					return is
				})
			})
			arr = [].concat.apply([], arr)
			arr.forEach(v => {
				switch (v.itemType) {
					case '1':
						this.proJectPush('projectList1', v)
						break;
					case '2':
						this.proJectPush('projectList2', v)
						break;
					case '3':
						this.proJectPush('projectList3', v)
						break;
					case '4':
						this.proJectPush('projectList4', v)
						break;
				}
			})

			this.selectLossProjectList = this.selected2 = []
			this.visible.addLossProjectVisible = false
		},
		proJectPush(name, arr){
			const row = this[name].find(v => v.itemType == arr.itemType && v.itemName == arr.itemName)
			if(row){
				return this.$message({message: `${arr.prefixItemName}已包含项目${arr.itemName}`, type: "error"})
			}
			this[name].push(arr)
		},
		selectLossPart(event){
			this.selected3 = event
			this.selectLossPartList = unique(this.selectLossPartList.concat(this.selected3), 'id')
		},
		deleteLossPartRows(index, row){
			this.selectLossPartList.splice(index, 1)
			this.$refs.lossPartTable.toggleRowSelection(row, false)
		},
		addLossPartsSubmit(){
			const arr = this.selectLossPartList.map(v => {
				let is = {
					id: v.id,
					gid: v.gid,
					itemName: v.partName,
					price: v.sellPrice,
					inPrice: v.exceeds,
					counts: v.total,
				}
				is.itemType = 5
				is.prefixItemName = '更换配件'
				return is
			})
			
			arr.forEach(k => {
					const row = this.partsList.find(v => v.itemType == k.itemType && v.itemName == k.itemName)
				if(row){
					return this.$message({message: `配件${k.itemName}已存在`, type: "error"})
				}
				this.partsList.push(k)
			})

			this.selectLossPartList = this.selected3 = []
			this.visible.addLossPartsVisible = false
		},
		saveDamageInfo(){
			let data = {
				oid: localStorage.getItem("oid"),
				gid: this.data.gid,
				orderDamageDTOList: []
			}
			data.orderDamageDTOList = data.orderDamageDTOList.concat(this.projectList1,this.projectList2,this.projectList3,this.projectList4,this.partsList)

			saveDamageInfo(data).then(res => {
				if(res.data.code == 200){
					this.$message({
						type: 'success',
						message: '保存成功!'
					})
				}
			})
		},
		copyInfo(){
			this.tableData1 = unique(this.tableData1.concat(this.projectList1, this.projectList2,this.projectList3,this.projectList4),'itemName')
			
			this.partsList.forEach(v => {
				v.partName = v.itemName
				v.source = v.gid == -99 ? 1 : 0
			})
			this.tableData2 = unique(this.tableData2.concat(this.partsList), 'partName')

			this.$message({
				type: 'success',
				message: '复制成功!'
			})
		},
		royaltyConfim(type, info){
			this.royaltyForm.sourceType = type
			this.royaltyForm.sourceId = info.id
			this.royaltyForm.percentages = []

			getOrderPercentages({sourceType: type, sourceId: info.id || localStorage.getItem("oid")}).then(res => {
				this.royaltyForm.percentages = res.data.data
			
				const typeName = ['业务', '工时', '配件']
				const name = ['整单金额', 'itemName', 'partName']

				const percentageClassId = info.percentageClassId ? info.percentageClassId : this.royaltyForm.percentages.length > 0 ? this.royaltyForm.percentages[0].percentageClassId : ''
				this.royaltyInfo = {
					name: type == 1 ? name[0] : info[name[type - 1]],
					royaltyName: typeName[type - 1],
					price: type == 2 ? info.standPrice : info.price,
					percentageClassId: percentageClassId
				}
				if(info.percentageClassId){
					queryPercentageClassOne({id: percentageClassId}).then(res => {
						this.royaltyInfo.percentage = res.data.data
					})
				}
				this.visible.royaltyVisible = true
			})
		},
		royaltySubmit() {
			this.royaltyForm.percentages.forEach(v => {
				if(v.percentageWay == 1) {
					v.percentageAmout = (parseInt(v.percentagePoint) * this.royaltyInfo.price) / 100
				}
			})
			this.royaltyForm.percentageClassId = this.royaltyInfo.percentage.id
			addOrderPercentage(this.royaltyForm).then(res => {
				if(res.data.code == 200){
					this.$message({
						type: 'success',
						message: '保存成功!'
					})
					this.visible.royaltyVisible = false
				}
			})
		},
		deletePercentage(index) {
			this.royaltyForm.percentages.splice(index, 1)
		},
		addPercentage(){
			findAllGroupByRole().then(res => {
				const data = res.data.data.find(v => v.onJob == 1)
				this.userData = data.orgEmployeeDTOList
				this.visible.userVisible = true
			})
		},
		selectUser(event){
			this.selectedUser = event.map(v => {
				return {
					employeeName: v.realName,
					employeeId: v.id,
					percentageWay: 1,
					...v
				}
			})
		},
		userSubmit() {
			this.selectedUser.forEach(v => {
				const role = v.role.split(',').slice(-1)[0]
				const check = this.royaltyForm.percentages.find(k => k.employeeId == v.id)
				const percentage = this.royaltyInfo.percentage
				if(percentage && percentage.percentageWay){
					v.percentageWay = percentage.percentageWay
					if(percentage.isByPosition == true){
						switch (role) {
							case '4':
								v.percentagePoint = percentage.percentagePointYW
								v.percentageAmout = percentage.percentageAmoutYW
								break;
							case '3':
								v.percentagePoint = percentage.percentagePointSG
								v.percentageAmout = percentage.percentageAmoutSG
								break;
							case '2':
								v.percentagePoint = percentage.percentagePointCW
								v.percentageAmout = percentage.percentageAmoutCW
								break;
							case '1':
								v.percentagePoint = percentage.percentagePointJD
								v.percentageAmout = percentage.percentageAmoutJD
								break;
						}
					}
				}
				const info = JSON.parse(JSON.stringify(v))
				if(!check) this.royaltyForm.percentages.push(info)
			})
			this.visible.userVisible = false
		},
		treeChange(event){
			let id = event.slice(-1)[0]
			queryPercentageClassOne({id: id}).then(res => {
				this.royaltyInfo.percentage = res.data.data
			})
		}
  }
};
</script>
<style scoped>
	.orderUl li{float: left;padding: 4px 18px;border-radius: 5px;cursor: pointer;margin-right: 10px;transition: .5s;font-size: 16px;}
	.orderUl li:hover{background: rgba(0,0,0,0.1);transition: .5s;}
	.orderUl li.active{background: #3AC29F;color: #fff;}
	
	.orderTable{
		padding-bottom: 60px
	}
	.orderXHeji{
		color: #067E5F;
		position: fixed;
		bottom: 0;
		margin-bottom: 20px;
		background: #fff;
		width: 100%;
	}
	.su{
		margin-top: 12px;
		border-radius: 7px 7px 7px 7px;
		color: #fff;
		width: 35px;
		font-size: 16px;
		line-height: 20px;
		height: 20px;
		background: #3AC29F;
		text-align: center;
	}
	.orderXHeji em{margin: 0 15px;}
	.orderXHeji i{color: #A8CEC3;}

	.el-button.is-active, .el-button.is-plain:active, {
		color: #0D906E;
		border-color: #0D906E;
	}
	.el-button.is-plain:focus, .el-button.is-plain:hover{
		color: #0D906E;
		border-color: #0D906E;
	}
	.el-dropdown-menu__item:focus, .el-dropdown-menu__item:not(.is-disabled):hover{
		color: #0D906E;
		background-color: #e5f6f7;
	}
	.lines{border-bottom: 1px solid #ccc;padding: 10px 0px;}
	.lines span{float:left;display: block;}
	.lines .el-checkbox-group{font-size: 13px;}
	.lines h2{color:red;border-bottom: 1px solid #ccc;text-indent: 10px;}
	.addProject /deep/ .el-dialog__header{
		padding-bottom: 20px;
		border-bottom: 1px solid #ccc;
	}
	.addProject /deep/ .el-dialog__body{
		padding: 5px;
	}
	.el-checkbox-group {
		font-size: 13px;
	}
	.royalty {
		border-bottom:1px solid #ccc;padding: 10px;
	}
	.royalty /deep/ .el-input-group__append {
		padding: 0 10px;
	}
</style>


<style>
	.taocanTable .el-table tr td{background: #E5F6F7;}
	.taocanTable .el-table tr th{background: #E5F6F7;}
	.taocanTable .el-table div.el-table__empty-block{background: #E5F6F7;}
	.main /deep/ .el-carousel__arrow{background-color: #909399;}
	.main /deep/ .el-carousel__arrow:hover {background-color: #606266;}
</style>