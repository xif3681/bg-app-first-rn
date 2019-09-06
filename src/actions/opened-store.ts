import { ActionFunction } from "."
import { ThunkAction } from "redux-thunk"
import { Action, createAction } from "redux-actions"
import { ReduxStore } from "../reducers"
import { OpenedStore } from "../constants/actionTypes"
import { fetchAllOpenedStores as _fetchAllOpenedStores} from '../services/opened-store'
import moment from 'moment'
import AsyncStorage from "@react-native-community/async-storage"
import { OpenedStore as OpenedStoreModel } from "../types/opened-store";

export type FetchAllOpenedStoresActionFunction = ActionFunction<typeof fetchAllOpenedStores>

export const fetchAllOpenedStores = (): ThunkAction<Promise<Array<OpenedStoreModel> | undefined>, ReduxStore, null, Action<any>> => {
  return async (dispatch, getState) => {
    try {
      dispatch(createAction(OpenedStore.FETCH_OPENED_STORE_START)())
      let openedStores = getState().get('openedStores').get('data')
      if (openedStores) {
        dispatch(createAction(OpenedStore.FETCH_OPENED_STORE_SUCCESS)(openedStores))
        return openedStores
      }
      let openedStoresUpdateString = await AsyncStorage.getItem('opened-store-update')
      if (openedStoresUpdateString) {
        const date = moment(openedStoresUpdateString!, 'YYYYMMDD')
        if (date.isSame(new Date(), 'week')) {
          const openedStoresString = await AsyncStorage.getItem('opened-stores')
          if (openedStoresString) {
            openedStores = JSON.parse(openedStoresString)
            dispatch(createAction(OpenedStore.FETCH_OPENED_STORE_SUCCESS)(openedStores))
            return openedStores
          }
        }
      }
      openedStores = await _fetchAllOpenedStores()
      const openedStoresString = JSON.stringify(openedStores)
      openedStoresUpdateString = moment().format('YYYYMMDD')
      await AsyncStorage.setItem('opened-store-update', openedStoresUpdateString)
      await AsyncStorage.setItem('opened-stores', openedStoresString)
      dispatch(createAction(OpenedStore.FETCH_OPENED_STORE_SUCCESS)(openedStores))
      return openedStores
    } catch (error) {
      dispatch(createAction(OpenedStore.FETCH_OPENED_STORE_ERROR)({error}))
    }
  }
}