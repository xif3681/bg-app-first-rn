import request from './request'
import { webKey, poiSearchOffset, radius } from '../constants/amap.json'
import { LatLng, AMapPOIPolygonSearch, POISearchResponse, POI } from 'react-native-amap3d';
import { SERVER } from '../constants';

export interface SearchedPoi {
  id: string
  address: string
  adname: string
  cityname: string
  location: string
  pname: string
  type: string
  shopinfo: string
  typecode: string
  name: string
}

export const poiSearch = async (keywords: string, coordinate:string) => {

  const pois = await poiAroundSearch(keywords, coordinate)
  if (pois && pois.length) return pois

  const response = await request.get('https://restapi.amap.com/v3/place/text', {
    keywords, 
    key: webKey, 
    offset: poiSearchOffset
  })
  if (response.status === '1') return response.pois
  throw new Error(response.info)
}

export const poiAroundSearch = async (keywords: string, coordinate: string) => {
  const response = await request.get('https://restapi.amap.com/v3/place/around', {
    keywords, 
    key: webKey, 
    offset: poiSearchOffset, 
    location: coordinate, 
    radius
  })
  if (response.status === '1') return response.pois
  return undefined
}

const fetchPolygonPOISearch = async (coordinates: Array<LatLng>, types: string, pageSize?: number, pageNum?: number): Promise<Array<POI>> => {
  await AMapPOIPolygonSearch.init()
  return new Promise((resolve, reject) => {
    AMapPOIPolygonSearch.onPOISearch({coordinates, types, pageSize, pageNum})
    const subscription = AMapPOIPolygonSearch.addPOISearchListener((response: POISearchResponse) => {
      subscription.remove()
      if (response.status === 'OK') {
        resolve(response.pois)
      } else {
        reject(response.error || new Error('获取数据出错'))
      }
    })
  })
}

const fetchAllPolygonPOIs = async (coordinates: Array<LatLng>, types: string, pageSize: number=20, pageNum: number=1, pois: POI[] = []): Promise<Array<POI>> => {
  let _pois = await fetchPolygonPOISearch(coordinates, types, pageSize, pageNum)
  if (_pois.length) {
    _pois = pois.concat(_pois) 
    return await fetchAllPolygonPOIs(coordinates, types, pageSize, pageNum+1, _pois)
  } else {
    return pois
  }
}

export const polygonPOISearch = async (coordinates: Array<LatLng>, types: string) => {
  return fetchAllPolygonPOIs(coordinates, types)
}

export const fetchRealEstatePrice = async (poi: POI) => {
  try {
    const response = await request.post(SERVER.poiWorm, poi)
    if (response.error) return undefined
    return response
  } catch (error) {
    return undefined
  }
}