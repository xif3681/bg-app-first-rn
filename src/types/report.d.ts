import { LocationModel } from "../services/reverse-geocode";
import { Corrival } from "../components/task/RivalItemComponent";

export interface ReportModel {
  
  _id?: string

  name?: string
  
  taskId?: string
  
  userId?: string

  userName?: string

  location?: LocationModel /// 位置信息

  newStoreApplyStatus?: 'preparing' | 'queueing' | 'pending' | 'approved' | 'rejecked' /// 新店申请状态 preparing: 收到前端申请，queueing: 插入到中间表，pending: 审核中，approved: 审核通过，rejecked: 审核不通过

  openStoreApplyStatus?: 'preparing' | 'queueing' | 'pending' | 'approved' | 'rejecked' /// 新店申请状态 preparing: 准备中，queueing: 插入到中间表，pending: 审核中，approved: 审核通过，rejecked: 审核不通过

  pdfAttachment?: {
    url?: string
    type?: string
    size?: number
  } /// pdf的ID

  attachments?: {
    url: string
  }

  overallPotential?: string /// 整体商圈潜力
  
  orientation?: string /// 门店类型
  
  type?: string /// 开店类型
  
  joinMode?: string /// 加盟模式

  joinType: string
  
  joinRegion: string
  
  subdistrictQuality?: string /// 小区档次
  
  peakTimeFlow?: string /// 高峰期人流
  
  businissStatus?: string /// 商圈形态
  
  residenceNumber?: string /// 门店住户辐射数

  businessDistrictResidenceNumber?: number /// 商圈住户辐射数
  
  realEstatePrice?: string /// 楼盘均价
  
  place?: string /// 门店位置
  
  width?: string /// 门店宽度
  
  length?: string /// 门店长度

  hasSecondFloor: string /// 是否有二楼

  area?: number /// 门店面积
  
  adjacentStores?: string /// 相邻2-4个店铺名称
  
  temporaryParking?: string /// 临时停车情况
  
  obstruction?: string /// 门前整体交通便利性
  
  traffic?: string /// 门店周围遮挡情况
  
  corrivals?: Array<Corrival> /// 竞争门店
  
  water?: string /// 上下水
  
  electricity?: string /// 用电
  
  airConditioner?: string /// 空调主机位
  
  broadband?: string /// 带宽
  
  sublet?: string /// 分租
  
  firstYearRent?: string /// 首年租金
  
  leaseTerm?: string /// 租赁期限
  
  rentIncreases?: string /// 租金递增情况
  
  estimatedRenovation?: string /// 预估装修
  
  transferFee?: string /// 转让费
  
  entryFee?: string /// 入场费
  
  agencyFee?: string /// 中介费

  staffQuartersFee?: string /// 员工宿舍费
  
  personality?: string /// 个人加分

  personalityReason?: string 

  transferorName?: string /// 转租人
  
  transferorPhone?: string /// 转租人手机号

  communityGrade?: number  /// 商圈评分
  
  electricityBill?: number /// 月均电费
  
  humanFlowScore?: number /// 人流评分

  licenseCost?: number /// 特许权费用
  
  monthSale?: number /// 预计稳定期销售额

  monthyWage?: number /// 工资
  
  netProfit?: number /// 净利润
  
  newStoreSales?: number /// 预计前六个月销售额
  
  otherFee?: number /// 其他费用

  profitNewStoreSales?: number /// 利润预算表门店月销售额

  renovationCosts?: number /// 装修设备按60个月均摊

  rentRate?: number /// 前六个月租金费用率
  
  residentScore?: number /// 居民户数评分
  
  shopLocatioScore?: number /// 门店展示评分
  
  totalCost?: number /// 费用总计
  
  totalGrossProfit?: number /// 毛利润合计
  
  totalScore?: number /// 总得分
  
  trafficScore?: number /// 交通情况评分

  perTicketSales?: number /// 客单价

  daliyHumanNumber?: number /// 日均来客数

  grossMargin?: number /// 月净利率

  updatedAt?:string//更新时间
}