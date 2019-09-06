
declare module 'react-native-amap-geolocation' {
  import { EventSubscription } from "react-native";
  interface GeolocationOption {
    /**
     *  是否返回地址信息，默认 false
     */
    reGeocode: number
  
    /**
     *  是否启用后台定位，默认 false，仅用于 iOS
     */
    background: number
  
    /**
     * 最小更新距离，默认 0 米，即只要位置更新就立即返回，仅用于 iOS
     *
     * 更多请参考 https://bit.ly/2vPTXY7
     */
    distanceFilter: number
  
    /**
     * 定位请求间隔，默认 2000 毫秒，仅用于 Android
     *
     * 更多请参考 https://bit.ly/2KhmCbu
     */
    interval: number
  }
  interface Location {
    accuracy: number // 定位精度 (m)
    latitude: number // 经度
    longitude: number // 纬度
    altitude: number // 海拔 (m)，需要 GPS
    speed: number // 速度 (m/s)，需要 GPS
    direction: number // 移动方向，需要 GPS
    timestamp: number // 定位时间
    address?: string // 详细地址
    country?: string // 国家
    province?: string // 省份
    city?: string // 城市
    cityCode?: string // 城市编码
    district?: string // 区
    street?: string // 街道
    streetNumber?: string // 门牌号
    poiName?: string // 兴趣点
  }
  type LocationListener = (location: Location) => void
  export class Geolocation {
    static init: (key: {ios: string, android: string}) => Promise<void>
    static setOptions: (options: object) => void
    static start: () => void
    static stop: () => void
    static getLastLocation: () => Promise<Location>
    static addLocationListener: (listener: LocationListener) => EventSubscription
  }
}