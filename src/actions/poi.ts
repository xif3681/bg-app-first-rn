import { ActionFunction } from "."
import { ThunkAction } from "redux-thunk"
import { Action, createAction } from "redux-actions"
import { ReduxStore } from "../reducers"
import { POI, Draft } from "../constants/actionTypes"
import { polygonPOISearch as _polygonPOISearch } from "../services/poi-search";
import { LatLng } from "react-native-amap3d"

export type PolygonPOISearchActionFunction = ActionFunction<typeof polygonPOISearch>

export const polygonPOISearch = (taskDraftId: string, coordinates: Array<LatLng>): ThunkAction<any, ReduxStore, null, Action<any>> => {
  return async (dispatch) => {
    try {
      dispatch(createAction(POI.FETCH_POI_START)({taskDraftId}))
      const subdistrict = await _polygonPOISearch(coordinates, '小区')
      subdistrict.forEach(poi => poi.type = 'subdistrict')
      const officebuilding = await _polygonPOISearch(coordinates, '写字楼')
      officebuilding.forEach(poi => poi.type = 'officebuilding')
      const market = await _polygonPOISearch(coordinates, '商场')
      market.forEach(poi => poi.type = 'market')
      const supermarket = await _polygonPOISearch(coordinates, '超市')
      supermarket.forEach(poi => poi.type = 'market')
      const busStation = await _polygonPOISearch(coordinates, '公交')
      busStation.forEach(poi => poi.type = 'busStation')
      const metro = await _polygonPOISearch(coordinates, '地铁站')
      metro.forEach(poi => poi.type = 'metro')
      const schllo = await _polygonPOISearch(coordinates, '学校')
      schllo.forEach(poi => poi.type = 'school')
      const pois = {
        subdistrict, 
        officebuilding, 
        market: market.concat(supermarket), 
        busStation, 
        metro, 
        schllo
      }
      dispatch(createAction(Draft.VALUE_CHANGE)({taskDraftId, keyValues: {pois}}))
      dispatch(createAction(POI.FETCH_POI_SUCCESS)({taskDraftId, pois}))
    } catch (error) {
      dispatch(createAction(POI.FETCH_POI_ERROR)({taskDraftId, error}))
    }
  }
}