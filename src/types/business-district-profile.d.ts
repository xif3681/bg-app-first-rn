export interface AmapDataModel {
  data?: any,
  errcode: number
  errmsg: string
  errdetail: string | null
}

export interface BusinessDistrictProfileModel {
  population?: AmapDataModel
  workAgeProfile?: AmapDataModel
  workRankProfile?: AmapDataModel
  residentAgeProfile?: AmapDataModel
  residentRankProfile?: AmapDataModel
  flow?: AmapDataModel
  flowAgeProfile?: AmapDataModel
  flowRankProfile?: AmapDataModel
}