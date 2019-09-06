import request from './request'
import { webKey as key } from '../constants/amap.json'

export interface LocationModel {
  latitude: Number // 经度
  longitude: Number // 纬度
  formattedAddress?: string
  addressComponent?: object
}

export const reverseGeocode = async (longitude: Number, latitude: Number): Promise<LocationModel | undefined> => {
  const location = `${longitude},${latitude}`
  const response = await request.get('https://restapi.amap.com/v3/geocode/regeo', {location, key, extensions: 'all'})
  if (response.status !== '1') throw new Error(response.info)
  if (response.regeocode.formatted_address && (typeof response.regeocode.formatted_address === 'string')) {
    return {
      longitude,
      latitude,
      formattedAddress: response.regeocode.formatted_address,
      addressComponent: response.regeocode.addressComponent
    }
  } else {
    return undefined
  }
}