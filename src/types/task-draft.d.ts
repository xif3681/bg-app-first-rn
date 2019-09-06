import { LocationModel } from "../services/reverse-geocode";
import { Corrival } from "../components/task/RivalItemComponent";
import { ImageModel } from "../services/qiniu";
import { POI } from "react-native-amap3d";

export interface TaskDraftModel {

  overallPotential: string
  orientation: string
  type: string
  joinMode: string
  joinType: string
  joinRegion: string
  subdistrictQuality: string
  peakTimeFlow: number
  businissStatus: string
  residenceNumber: number
  businessDistrictResidenceNumber?: number
  realEstatePrice: number
  isDirty?:boolean
  place: string
  width: string
  length: string
  hasSecondFloor: string
  adjacentStores: string
  temporaryParking: string
  obstruction: string
  traffic: string
  corrivals: Array<Corrival>

  water: string
  electricity: string
  airConditioner: string
  broadband: string
  sublet: string
  firstYearRent: string
  leaseTerm: string
  rentIncreases: string
  estimatedRenovation: string
  transferFee: string
  entryFee: string
  agencyFee: string
  staffQuartersFee: string

  personality: string
  personalityReason: string
  transferorName: string
  transferorPhone: string
  images: Array<ImageModel>

  pois: {[key: string]: Array<POI>}
  extraPois: {[key: string]: Array<POI>}
  poiInfos: object
  
  createdAt: string
  _id: string
  name: string
  location: LocationModel
  businessDistrictPolygon?: Array<LocationModel>

  uniqueKey: string ///  本地缓存使用
}