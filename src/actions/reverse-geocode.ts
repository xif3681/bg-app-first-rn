import { ActionFunction } from "."
import { ThunkAction } from "redux-thunk"
import { Action, createAction } from "redux-actions"
import { ReduxStore } from "../reducers"
import { Geocode } from "../constants/actionTypes"
import { reverseGeocode as _reverseGeocode } from '../services/reverse-geocode'

export type ReverseGeocodeActionFunction = ActionFunction<typeof reverseGeocode>

export const reverseGeocode = (longitude: string, latitude: string): ThunkAction<any, ReduxStore, null, Action<any>> => {
  return async (dispatch) => {
    try {
      const location = `${longitude}/${latitude}`
      dispatch(createAction(Geocode.REGEOCODE_START)({location}))
    } catch (error) {
      const location = `${longitude}/${latitude}`
      dispatch(createAction(Geocode.REGEOCODE_ERROR)({location, error}))
    }
  }
}