import {
  get,
  post,
  posts,
  open,
  put,
  deletes
} from './http'
const uplodeURL = 'http://47.96.248.209:8888/vehicle/file/uploadPicture';//测试
// const uplodeURL = 'http://47.99.212.29:8888/vehicle/file/uploadPicture';//正式

//登出
const login = function (parmas) {
  return post("/vehicle/login", parmas)
}


//查询订单
const getOrderList = function (parmas) {
  return get("/vehicle/order/list", parmas)
}

//查询订单(分页)
const getOrderList2 = function (parmas) {
  return get("/vehicle/order/pageList", parmas)
}


//查询订单详情
const getOrderListX = function (parmas) {
  return get("/vehicle/order/getDetailByOId", parmas)
}

//查询打印
const print = function (parmas) {
  return get("/vehicle/order/getSettlementedDetailByOId", parmas)
}

//查询维修厂
const getWxc = function (parmas) {
  return get("/vehicle/org/employee/findByPhone", parmas)
}

//切换维修厂
const tabUser = function (parmas,headers) {
  return post("/vehicle/org/employee/changeGarage", parmas,headers)
}

//查询定损详情
const getDamageByOId = function (parmas) {
  return get("/vehicle/order/getDamageByOId", parmas)
}

//查询派工详情
const getDispatchByOId = function (parmas) {
  return get("/vehicle/order/getDispatchByOId", parmas)
}

//查询所有项目
const getProject = function (parmas) {
  return get("/vehicle/item/page", parmas)
}
//新增项目
const addProject = function (parmas) {
  return posts("/vehicle/item/save", parmas)
}
//查询客户名下所有套餐
const findByCustomerId = function (parmas) {
  return get("/vehicle/customer/combo/findByCustomerId", parmas)
}
// 查询所有施工组及组成员列表
const groupWorksInfo = function (parmas) {
  return get("/vehicle/group/workers/groupWorksInfo", parmas)
}

//查询所有配件
const getPart = function (parmas) {
  return get("/vehicle/part/page", parmas)
}
//新增配件
const addPart = function (parmas) {
  return posts("/vehicle/part/save", parmas)
}
//修改配件
const updatePart = function (parmas) {
  return put(`/vehicle/part/update/${parmas.id}`, parmas)
}
//新增配件出入库记录
const saveRecord = function (parmas) {
  return posts("/vehicle/part/saveRecord", parmas)
}
//删除配件
const deletePart = function (parmas) {
  return deletes(`/vehicle/part/delete`, parmas)
}
//保存订单(工单)施工信息
const saveWorkInfo = function (parmas) {
  return posts("/vehicle/order/saveWorkInfo", parmas)
}
//保存订单(工单)定损项目信息
const saveDamageInfo = function (parmas) {
  return posts("/vehicle/order/saveDamageInfo", parmas)
}
//查询工单附件详情
const getAttachmentSettlementedDetailByOId = function (parmas) {
  return get("/vehicle/order/getAttachmentSettlementedDetailByOId", parmas)
}
//订单(工单)结算
const settlement = function (parmas) {
  return posts("/vehicle/order/settlement", parmas)
}
//订单(工单)反结算
const rollbackSettlement = function (parmas) {
  return post("/vehicle/order/rollbackSettlement", parmas)
}
//查询会员等级
const getGrade = function (parmas) {
  return get("/vehicle/customer/member/getGrade", parmas)
}
//获取角色权限
const getRoleAuth = function (parmas) {
  return get("/vehicle/roleAuth/getRoleAuth", parmas)
}
//月报总表
const saveAuth = function (parmas) {
  return posts("/vehicle/roleAuth/saveAuth", parmas)
}
//查询所有用户(按在职状态分类)
const findAllGroupByRole = function (parmas) {
  return get("/vehicle/org/employee/findAllGroupByRole", parmas)
}
//添加工单提成
const addOrderPercentage = function (parmas) {
  return posts("/vehicle/order/addOrderPercentage", parmas)
}
//查询工单提成
const getOrderPercentages = function (parmas) {
  return get("/vehicle/order/getOrderPercentage", parmas)
}

//==================报表=================
//月报总表
const form1 = function (parmas) {
  return get("/vehicle/fi/report/getSummaryReport", parmas)
}

//业绩分析报表
const form2 = function (parmas) {
  return get("/vehicle/fi/report/getPerformanceItemPageList", parmas)
}

//挂账报表报表
const form3 = function (parmas) {
  return get("/vehicle/fi/report/getOrderBillerPageList", parmas)
}

//收入支出方式报表
const form4 = function (parmas) {
  return get("/vehicle/fi/report/getIncomeAndSpendPageList", parmas)
}

//收入流水报表
const form5 = function (parmas) {
  return get("/vehicle/fi/report/getIncomePageList", parmas)
}

//支出流水报表
const form6 = function (parmas) {
  return get("/vehicle/fi/report/getSpendPageList", parmas)
}

//配件采购明细报表
const form7 = function (parmas) {
  return get("/vehicle/fi/report/getPartPurOrderDetailReport", parmas)
}

//配件采购供应商汇总
const form8 = function (parmas) {
  return get("/vehicle/fi/report/getSupplierPageList", parmas)
}

//固定资产明细
const form9 = function (parmas) {
  return get("/vehicle/fi/report/getFixedAssetsPageList", parmas)
}

//查询服务提成报表
const getPercentageReport = function (parmas) {
  return posts("/vehicle/order/getPercentageReport", parmas)
}

//添加维修厂供应商
const addGarageSupplier = function (parmas) {
  return posts("/vehicle/garage/addGarageSupplier", parmas)
}
//删除维修厂供应商
const deleteGarageSupplier = function (parmas) {
  return deletes("/vehicle/garage/deleteGarageSupplier", parmas)
}
//查询所有供应商By维修厂
const queryAllSupplierByGid = function (parmas) {
  return get("/vehicle/garage/queryAllSupplierByGid", parmas)
}
//查询维修厂供应商
const queryGarageSupplier = function (parmas) {
  return get("/vehicle/garage/queryGarageSupplier", parmas)
}
//导出接口
const excel = function (parmas,title) {
  return open("/vehicle/export/exportExcel", parmas,title)
}

//导出日报表
const excelDay = function (parmas,title) {
  return open("/vehicle/export/exportDayReport", parmas,title)
}

//获取维修厂二维码
const getQrCode = function (parmas) {
  return get("/vehicle/garage/getQrCode", parmas)
}

//查询调拨单
const queryAllotList = function (parmas) {
  return posts("/vehicle/garage/queryAllotList", parmas)
}

//创建调拨单
const createAllotOrder = function (parmas) {
  return posts("/vehicle/garage/createAllotOrder", parmas)
}

//接收调拨单
const acceptAllot = function (parmas) {
  return post("/vehicle/garage/acceptAllot", parmas)
}

//取消调拨单
const cancelAllot = function (parmas) {
  return post("/vehicle/garage/cancelAllot", parmas)
}

//查询调拨单
const queryAllotPartList = function (parmas) {
  return get("/vehicle/garage/queryAllotPartList", parmas)
}

//查询同级维修连锁店
const querySameGarageList = function (parmas) {
  return get("/vehicle/garage/querySameGarageList", parmas)
}

//查询配件订单/厂家
const queryGaragePurOrder = function (parmas) {
  return get("/vehicle/purOrder/queryGaragePurOrder", parmas)
}

//新增配件订单
const createPurOrder = function (parmas) {
  return posts("/vehicle/purOrder/createPurOrder", parmas)
}

//修改配件订单
const updatePurOrder = function (parmas) {
  return put("/vehicle/purOrder/updatePurOrder", parmas)
}

//查询配件订单详情
const getPurOrder = function (parmas) {
  return get("/vehicle/purOrder/getPurOrder", parmas)
}

//查询配件商客户-维修厂列表
const getGarageListBySupplier = function (parmas) {
  return get("/vehicle/purOrder/getGarageListBySupplier", parmas)
}

//新增配件订单
const garageAddPart = function (parmas) {
  return posts("/vehicle/purOrder/addPart", parmas)
}

//取消配件订单
const cancelPurOrder = function (parmas) {
  return post("/vehicle/purOrder/cancelPurOrder", parmas)
}

//查询供应商配件
const querySupplierPart = function (parmas) {
  return get("/vehicle/system/supplier/querySupplierPart", parmas)
}

//供应商配件新增
const addSupplierPart = function (parmas) {
  return posts("/vehicle/system/supplier/addSupplierPart", parmas)
}

//查询配件统计(订货单模块)
const sumForPartOrder = function (parmas) {
  return get("/vehicle/part/sumForPartOrder", parmas)
}

//分页查询配件出入库记录
const pageRecords = function (parmas) {
  return get("/vehicle/part/pageRecords", parmas)
}

//分页查询所有配件(PC工单)
const pageListPC = function (parmas) {
  return get("/vehicle/part/pageListPC", parmas)
}

//接收配件
const acceptPurOrderPart = function (parmas) {
  return post("/vehicle/purOrder/acceptPurOrderPart", parmas)
}

//查询提成类目列表
const queryPercentageClass = function (parmas) {
  return get("/vehicle/percentage/queryPercentageClass", parmas)
}

//查询提成类目详情
const queryPercentageClassOne = function (parmas) {
  return get("/vehicle/percentage/queryPercentageClassOne", parmas)
}

//新增提成类目
const addPercentageClass = function (parmas) {
  return posts("/vehicle/percentage/addPercentageClass", parmas)
}

//删除提成类目
const deletePercentageClass = function (parmas) {
  return deletes("/vehicle/percentage/deletePercentageClass", parmas)
}

//更新提成类目
const updatePercentageClass = function (parmas) {
  return posts("/vehicle/percentage/updatePercentageClass", parmas)
}

//查询项目提成类目
const getItemPercentage = function (parmas) {
  return get("/vehicle/percentage/getItemPercentage", parmas)
}
//查询项目提成列表
const queryItemPercentageList = function (parmas) {
  return get("/vehicle/percentage/queryItemPercentageList", parmas)
}
//设置项目提成类目
const setItemPercentage = function (parmas) {
  return posts("/vehicle/percentage/setItemPercentage", parmas)
}
//查询配件提成类目
const getPartPercentage = function (parmas) {
  return get("/vehicle/percentage/getPartPercentage", parmas)
}
//查询配件提成列表
const queryPartPercentageList = function (parmas) {
  return get("/vehicle/percentage/queryPartPercentageList", parmas)
}
//设置配件提成类目
const setPartPercentage = function (parmas) {
  return posts("/vehicle/percentage/setPartPercentage", parmas)
}
//提成设置工单列表
const queryOrderPercentageList = function (parmas) {
  return get("/vehicle/percentage/queryOrderPercentageList", parmas)
}
//获取工单提成详情
const getOrderPercentageDetail = function (parmas) {
  return get("/vehicle/percentage/getOrderPercentageDetail", parmas)
}
//库存配件采购报表
const getPurOrderSumReport = function (parmas) {
  return get("/vehicle/fi/report/getPurOrderSumReport", parmas)
}
//库存配件采购报表-明细
const getPurOrderDetailReport = function (parmas) {
  return get("/vehicle/fi/report/getPurOrderDetailReport", parmas)
}
//询价配件采购报表
const getAskPriceSumReport = function (parmas) {
  return get("/vehicle/fi/report/getAskPriceSumReport", parmas)
}
//询价配件采购报表-明细
const getAskPriceDetailReport = function (parmas) {
  return get("/vehicle/fi/report/getAskPriceDetailReport", parmas)
}
//查询其它订单列表
const getThirdPurOrder = function (parmas) {
  return get("/vehicle/order/getThirdPurOrder", parmas)
}
//库存订单/询价单记账
const paymentAccount = function (parmas) {
  return posts("/vehicle/account/paymentAccount", parmas)
}
//库存订单/询价单批量记账
const batchPaymentAccount = function (parmas) {
  return posts("/vehicle/account/batchPaymentAccount", parmas)
}
//库存订单/询价单反记账
const cancelPaymentAccount = function (parmas) {
  return posts("/vehicle/account/cancelPaymentAccount", parmas)
}
//询价采购订单详情
const getPartPurOrderDetail = function (parmas) {
  return get("/vehicle/garageAskPrice/getPartPurOrderDetail", parmas)
}
//设置工单提成状态，0:未提成，1已提成
const setPercentageStatus = function (parmas) {
  return post("/vehicle/order/setPercentageStatus", parmas, {})
}
//(新)月业绩分项日报表
const getDayRecordByMonthAndItem = function (parmas) {
  return get("/vehicle/fi/report/getDayRecordByMonthAndItem", parmas)
}
//营业收入明细报表(业绩分项日报表收入明细)
const getIncomeDetailByDayAndItem = function (parmas) {
  return get("/vehicle/fi/report/getIncomeDetailByDayAndItem", parmas)
}
//其它支出明细报表(业绩分项日报表其它支出明细)
const getOtherOutDetailByDayAndItem = function (parmas) {
  return get("/vehicle/fi/report/getOtherOutDetailByDayAndItem", parmas)
}
//配件支出明细报表(业绩分项日报表配件明细)
const getOutDetailByDayAndItem = function (parmas) {
  return get("/vehicle/fi/report/getOutDetailByDayAndItem", parmas)
}
//提成支出明细报表(业绩分项日报表提成指出明细)
const getPercentageDetailByDayAndItem = function (parmas) {
  return get("/vehicle/fi/report/getPercentageDetailByDayAndItem", parmas)
}
//查询所有工位
const getWorkTypeList = function (parmas) {
  return get("/vehicle/system/workType/list", parmas)
}
//员工记账列表
const staffList = function (parmas) {
  return get("/vehicle/account/getEmployeeAccountList", parmas)
}
//查询所有员工
const staffall = function (parmas) {
  return get("/vehicle/org/employee/list", parmas)
}
//员工新增薪资记账
const staffpay = function (parmas) {
  return posts("/vehicle/account/addEmployeeAccount", parmas)
}
//企业记账列表
const enterprisefList = function (parmas) {
  return get("/vehicle/account/page", parmas)
}

//新增企业记账
const newlysave = function (parmas) {
  return posts("/vehicle/account/save", parmas)
}
//询价订单列表
const purOrderList = function (parmas) {
  return get("/vehicle/garageAskPrice/pcpurOrderList", parmas)
}
//确认收货订单配件
const receiveGoods = function (parmas) {
  return post("/vehicle/garageAskPrice/receiveGoods", parmas)
}
//取消收货订单配件
const cancelAccessories = function (parmas) {
  return post("/vehicle/garageAskPrice/cancelPurOrder", parmas)
}
//查询退换货订单
const afterSalePartList = function (parmas) {
  return get("/vehicle/afterSale/afterSalePartList", parmas)
}

//确认收货订单零配件
const afterSaleReceive = function (parmas) {
  return posts("/vehicle/afterSale/afterSaleReceive", parmas)
}

//确认取消订单零配件退/换货
const afterSaleCancel = function (parmas) {
  return posts("/vehicle/afterSale/afterSaleCancel", parmas)
}
//配件申请退换货
const afterSaleRequest = function (parmas) {
  return posts("/vehicle/afterSale/afterSaleRequest", parmas)
}

//查询配件商报价列表
const pcaskPriceList = function (parmas) {
  return get("/vehicle/garageAskPrice/pcaskPriceList", parmas)
}
//查询配件商报价列表
const askPriceList = function (parmas) {
  return get("/vehicle/garageAskPrice/askPriceList", parmas)
}
//采购订单（下单）
const pcpurOrder = function (parmas) {
  return posts("/vehicle/garageAskPrice/purOrder", parmas)
}

//查询配件商系统推荐
const systemReco = function (parmas) {
  return get("/vehicle/garageAskPrice/systemReco", parmas)
}

//查询所有汽配城
const getAllPartTown = function (parmas) {
  return get("/vehicle/garageAskPrice/getAllPartTown", parmas)
}

//查询所有询价供应商
const querySupplierByGid = function (parmas) {
  return get("/vehicle/garage/querySupplierByGid", parmas)
}

//发起配件询价
const askPricePull = function (parmas) {
  return posts("/vehicle/garageAskPrice/askPrice", parmas)
}
//查询未报价配件商列表
const unAskPriceList = function (parmas) {
  return get("/vehicle/garageAskPrice/unAskPriceList", parmas)
}

//退换货暂缓区
const afterSaleList = function (parmas) {
  return get("/vehicle/afterSale/afterSaleList", parmas)
}

//发起配件询价
const afterSaleDeliver = function (parmas) {
  return posts("/vehicle/afterSale/afterSaleDeliver", parmas)
}

export {
  login,
  logout,
  tabUser,
  getWxc,
  getOrderList,
  getOrderList2,
  getOrderListX,
  print,
  getDamageByOId,
  getDispatchByOId,
  getProject,
  addProject,
  findByCustomerId,
  groupWorksInfo,
  getPart,
  addPart,
  updatePart,
  saveRecord,
  deletePart,
  saveWorkInfo,
  saveDamageInfo,
  settlement,
  getAttachmentSettlementedDetailByOId,
  rollbackSettlement,
  getGrade,
  getRoleAuth,
  saveAuth,
  findAllGroupByRole,
  addOrderPercentage,
  getOrderPercentages,
  getQrCode,
  addGarageSupplier,
  deleteGarageSupplier,
  queryAllSupplierByGid,
  queryGarageSupplier,
  queryAllotList,
  createAllotOrder,
  acceptAllot,
  cancelAllot,
  queryAllotPartList,
  querySameGarageList,
  queryGaragePurOrder,
  createPurOrder,
  updatePurOrder,
  getPurOrder,
  getGarageListBySupplier,
  garageAddPart,
  cancelPurOrder,
  querySupplierPart,
  addSupplierPart,
  sumForPartOrder,
  pageRecords,
  pageListPC,
  acceptPurOrderPart,
  queryPercentageClass,
  queryPercentageClassOne,
  addPercentageClass,
  deletePercentageClass,
  updatePercentageClass,
  getItemPercentage,
  queryItemPercentageList,
  setItemPercentage, 
  getPartPercentage,
  queryPartPercentageList,
  setPartPercentage,
  queryOrderPercentageList,
  getOrderPercentageDetail,
  getPurOrderSumReport,
  getPurOrderDetailReport,
  getAskPriceSumReport,
  getAskPriceDetailReport,
  getThirdPurOrder,
  paymentAccount,
  cancelPaymentAccount,
  getPartPurOrderDetail,
  batchPaymentAccount,
  setPercentageStatus,
  getDayRecordByMonthAndItem,
  getIncomeDetailByDayAndItem,
  getOtherOutDetailByDayAndItem,
  getOutDetailByDayAndItem,
  getPercentageDetailByDayAndItem,
  getWorkTypeList,

  form1,
  form2,
  form3,
  form4,
  form5,
  form6,
  form7,
  form8,
  form9,
  getPercentageReport,
  excel,
  excelDay,
  staffList,
  enterprisefList,
  staffpay,
  staffall,
  newlysave,
  uplodeURL,
  purOrderList,
  receiveGoods,
  cancelAccessories,
  afterSalePartList,
  afterSaleReceive,
  afterSaleCancel,
  afterSaleRequest,
  askPriceList,
  pcaskPriceList,
  pcpurOrder,
  systemReco,
  getAllPartTown,
  querySupplierByGid,
  askPricePull,
  unAskPriceList,
  afterSaleList,
  afterSaleDeliver
}
