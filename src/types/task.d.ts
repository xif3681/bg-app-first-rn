import { LocationModel } from "../services/reverse-geocode";
import { ImageModel } from "../services/qiniu";
import { POI } from "react-native-amap3d";
import { Corrival } from "../components/task/RivalItemComponent";

export interface TaskModel {
  
  _id?: string

  name?: string
  
  stuck?: boolean
  
  userId?: string
  
  newStoreApplyStatus?: 'preparing' | 'queueing' | 'pending' | 'approved' | 'rejecked' /// 新店申请状态 preparing: 收到前端申请，queueing: 插入到中间表，pending: 审核中，approved: 审核通过，rejecked: 审核不通过

  openStoreApplyStatus?: 'preparing' | 'queueing' | 'pending' | 'approved' | 'rejecked' /// 新店申请状态 preparing: 准备中，queueing: 插入到中间表，pending: 审核中，approved: 审核通过，rejecked: 审核不通过

  status?: string

  location?: LocationModel /// 位置信息
  
  businessDistrictPolygon?: Array<LocationModel>

  isFinish?: boolean /// 报告是否完成，排序时，完成的放在最后
      
  newPDFAvailableEstimateTime?: number /// 新pdf生成完成预估时间点

  overallPotential?: string /// 整体商圈潜力
  
  orientation?: string /// 门店类型
  
  type?: string /// 开店类型
  
  joinMode?: string /// 加盟模式

  joinType: string
  
  joinRegion: string
  
  subdistrictQuality?: string /// 小区档次
  
  peakTimeFlow?: string /// 高峰期人流
  
  businissStatus?: string /// 商圈形态
  
  residenceNumber?: string /// 门店住户户辐射数

  businessDistrictResidenceNumber?: number /// 商圈住户辐射数
  
  realEstatePrice?: string /// 楼盘均价
  
  place?: string /// 门店位置
  
  width?: string /// 门店宽度
  
  length?: string /// 门店长度

  hasSecondFloor: string /// 是否有二楼
  
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

  personalityReason?: string /// 个人加分原因
  
  transferorName?: string /// 转租人
  
  transferorPhone?: string /// 转租人手机号
  
  images?: Array<ImageModel> /// 店铺图片

  pois: {[key: string]: Array<POI>}
  extraPois: {[key: string]: Array<POI>}
  poiInfos: object
  updatedAt?:string//更新时间
}