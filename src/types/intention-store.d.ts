import { LocationModel } from "../services/reverse-geocode";

export interface Communication {
  time: string,
  content: string,
  key: number,
  _id?:string,
  isEdit?:boolean,
}

export interface IntentionStoreModel {
  communicationRecords?: Communication[]
  assignorContactInformation: string
  rent?: string
  transferFee?: string
  area?: string
  assignor: string
  spinner?: boolean
  createdAt?: string
  _id?: string
  name?: string
  location: LocationModel
  updatedAt?:string//更新时间
}
