import Toast from 'react-native-root-toast';
import { ActionFunction } from "."
import { ThunkAction } from "redux-thunk"
import { Action, createAction } from "redux-actions"
import { ReduxStore } from "../reducers"
import { OnlineOrder } from "../constants/actionTypes"
import { fetchAllOnlineOrders as _fetchAllOnlineOrders } from '../services/online-orders'
import moment from 'moment'
import AsyncStorage from "@react-native-community/async-storage";
import RNFetchBlob from "rn-fetch-blob";
import { InteractionManager, Platform } from 'react-native';


export type fetchAllOnlineOrdersActionFunction = ActionFunction<typeof fetchAllOnlineOrders>

export const fetchAllOnlineOrders = (): ThunkAction<any, ReduxStore, null, Action<any>> => {
  return async (dispatch, getState) => {
    try {
      dispatch(createAction(OnlineOrder.FETCH_ONLINE_ORDER_START)())
      let onlineOrders = getState().get('onlineOrders').get('data')
      if (onlineOrders) {
        dispatch(createAction(OnlineOrder.FETCH_ONLINE_ORDER_SUCCESS)(onlineOrders))
        return
      }
      let onlineOrdersUpdateString = await AsyncStorage.getItem('online-order-update')
      let PATH_OF_FILE = (Platform.OS === 'android' ? RNFetchBlob.fs.dirs.DownloadDir : RNFetchBlob.fs.dirs.DocumentDir) + "/onlineOrders.txt"
      console.log(PATH_OF_FILE)
      if (onlineOrdersUpdateString && await RNFetchBlob.fs.exists(PATH_OF_FILE)) {
        const date = moment(onlineOrdersUpdateString!, 'YYYYMMDD')
        if (date.isSame(new Date(), 'week')) {
          const fileData = await RNFetchBlob.fs.readFile(PATH_OF_FILE, 'utf8', 1024*512)
          onlineOrders = JSON.parse(fileData)
          dispatch(createAction(OnlineOrder.FETCH_ONLINE_ORDER_SUCCESS)(onlineOrders))
          return
        }
      }
      if (await RNFetchBlob.fs.exists(PATH_OF_FILE)) {
        await RNFetchBlob.fs.unlink(PATH_OF_FILE)
      }
      onlineOrders = await _fetchAllOnlineOrders()
      if (onlineOrders) {
        onlineOrdersUpdateString = moment().format('YYYYMMDD')
        await AsyncStorage.setItem('online-order-update', onlineOrdersUpdateString)
        dispatch(createAction(OnlineOrder.FETCH_ONLINE_ORDER_SUCCESS)(onlineOrders))
        RNFetchBlob.fs.writeFile(PATH_OF_FILE, JSON.stringify(onlineOrders), 'utf8')
      }
    } catch (error) {
      dispatch(createAction(OnlineOrder.FETCH_ONLINE_ORDER_ERROR)({ error }))
    }
  }
}