import { ActionFunction } from "."
import { ThunkAction } from "redux-thunk"
import { Action, createAction } from "redux-actions"
import { ReduxStore } from "../reducers"
import { IntentionStore } from "../constants/actionTypes"
import { IntentionMapStore } from "../constants/actionTypes"
import {
  fetchUserIntentionStores as _fetchUserIntentionStores, updateIntentionStores as _updateIntentionStores, deleteIntentionStores as _deleteIntentionStores
  , updateAllIntentionStores as _updateAllIntentionStores, intentionShops as _intentionShops
  , deleteCommunicate as _deleteCommunicate, insertCommunicate as _insertCommunicate, patchCommunicationRecords as _patchCommunicationRecords, intentionShopsList as _intentionShopsList
} from '../services/intention-store'
import { IntentionStoreModel } from "../types/intention-store";
import { PaginationData } from "../types";

export type FetchUserIntentionStoresActionFunction = ActionFunction<typeof fetchUserIntentionStores>

export const fetchUserIntentionStores = (): ThunkAction<Promise<PaginationData<IntentionStoreModel> | undefined>, ReduxStore, null, Action<any>> => {
  return async (dispatch, getState) => {
    try {
      const token = getState().get('token').get('data')
      dispatch(createAction(IntentionStore.FETCH_INTENTION_STORE_START)())
      const intentionStores: PaginationData<IntentionStoreModel> = await _fetchUserIntentionStores(token!, { pageCount: 1000 })
      dispatch(createAction(IntentionStore.FETCH_INTENTION_STORE_SUCCESS)(intentionStores))
      return intentionStores
    } catch (error) {
      dispatch(createAction(IntentionStore.FETCH_INTENTION_STORE_ERROR)({error}))
    }
  }
}

export type UpdateAllIntentionStoresActionFunction = ActionFunction<typeof updateAllIntentionStores>

export const updateAllIntentionStores = (taskId: string | undefined, data: any): ThunkAction<Promise<any>, ReduxStore, null, Action<any>> => {
  return async (dispatch, getState) => {
    try {
      const token = getState().get('token').get('data')
      dispatch(createAction(IntentionStore.FETCH_INTENTION_STORE_START)())
      const response = await _updateAllIntentionStores(token!, taskId, data)
      dispatch(createAction(IntentionStore.FETCH_INTENTION_STORE_SUCCESS)())
      dispatch(fetchUserIntentionStores())
      return response
    } catch (error) {
      if (`${error}`.indexOf("timeout") != -1) {
        error = new Error("网络环境不佳，修改失败")
      } else if(`${error}`.indexOf("Network Error") != -1) {
        error = new Error("当前无网络，修改失败")
      }
      dispatch(createAction(IntentionStore.FETCH_INTENTION_STORE_ERROR)({error}))
    }
  }
}

export type intentionShopsActionFunction = ActionFunction<typeof intentionShops>

export const intentionShops = (data: any): ThunkAction<any, ReduxStore, null, Action<any>> => {
  return async (dispatch, getState) => {
    try {
      const token = getState().get('token').get('data')
      dispatch(createAction(IntentionStore.FETCH_INTENTION_STORE_START)())
      const response = await _intentionShops(token!, data)
      dispatch(createAction(IntentionStore.FETCH_INTENTION_STORE_SUCCESS)())
      dispatch(fetchUserIntentionStores())
      return response
    } catch (error) {
      if (`${error}`.indexOf("timeout") != -1) {
        error = new Error("网络环境不佳，保存失败")
      } else if(`${error}`.indexOf("Network Error") != -1) {
        error = new Error("当前无网络，保存失败")
      }
      dispatch(createAction(IntentionStore.FETCH_INTENTION_STORE_ERROR)({error}))
    }
  }
}

export type UpdateIntentionStoresActionFunction = ActionFunction<typeof updateIntentionStores>

export const updateIntentionStores = (taskId: string, data: string): ThunkAction<any, ReduxStore, null, Action<any>> => {
  return async (dispatch, getState) => {
    try {
      const token = getState().get('token').get('data')
      dispatch(createAction(IntentionStore.FETCH_INTENTION_STORE_START)())
      await _updateIntentionStores(token!, taskId, data)
      dispatch(createAction(IntentionStore.FETCH_INTENTION_STORE_SUCCESS)())
      dispatch(fetchUserIntentionStores())
    } catch (error) {
      if (`${error}`.indexOf("timeout") != -1) {
        error = new Error("网络环境不佳，修改失败")
      } else if(`${error}`.indexOf("Network Error") != -1) {
        error = new Error("当前无网络，修改失败")
      }
      dispatch(createAction(IntentionStore.FETCH_INTENTION_STORE_ERROR)({error}))
    }
  }
}

export type InsertCommunicateActionFunction = ActionFunction<typeof insertCommunicate>

export const insertCommunicate = (id: string | undefined, data: any): ThunkAction<any, ReduxStore, null, Action<any>> => {
  return async (dispatch, getState) => {
    try {
      const token = getState().get('token').get('data')
      dispatch(createAction(IntentionStore.FETCH_INTENTION_STORE_START)())
      await _insertCommunicate(token!, id, data)
      dispatch(createAction(IntentionStore.FETCH_INTENTION_STORE_SUCCESS)())
    } catch (error) {
      dispatch(createAction(IntentionStore.FETCH_INTENTION_STORE_ERROR)({error}))
    }
  }
}

export type DeleteCommunicateActionFunction = ActionFunction<typeof deleteCommunicate>

export const deleteCommunicate = (id: string): ThunkAction<any, ReduxStore, null, Action<any>> => {
  return async (dispatch, getState) => {
    try {
      const token = getState().get('token').get('data')
      dispatch(createAction(IntentionStore.FETCH_INTENTION_STORE_START)())
      await _deleteCommunicate(token!, id)
      dispatch(createAction(IntentionStore.FETCH_INTENTION_STORE_SUCCESS)())
      dispatch(fetchUserIntentionStores())
    } catch (error) {
      dispatch(createAction(IntentionStore.FETCH_INTENTION_STORE_ERROR)({error}))
    }
  }
}

export type DeleteIntentionStoresActionFunction = ActionFunction<typeof deleteIntentionStores>

export const deleteIntentionStores = (taskId: string): ThunkAction<any, ReduxStore, null, Action<any>> => {
  return async (dispatch, getState) => {
    try {
      let data
      const token = getState().get('token').get('data')
      dispatch(createAction(IntentionStore.FETCH_INTENTION_STORE_START)())
      data = await _deleteIntentionStores(token!, taskId)
      dispatch(createAction(IntentionStore.FETCH_INTENTION_STORE_SUCCESS)())
      dispatch(fetchUserIntentionStores())
      return data
    } catch (error) {
      dispatch(createAction(IntentionStore.FETCH_INTENTION_STORE_ERROR)({error}))
    }
  }
}

export type PatchCommunicationRecordsActionFunction = ActionFunction<typeof patchCommunicationRecords>

export const patchCommunicationRecords = (taskId: string | undefined, content: String): ThunkAction<any, ReduxStore, null, Action<any>> => {
  return async (dispatch, getState) => {
    try {
      const token = getState().get('token').get('data')
      dispatch(createAction(IntentionStore.FETCH_INTENTION_STORE_START)())
      await _patchCommunicationRecords(token!, taskId, content)
      dispatch(createAction(IntentionStore.FETCH_INTENTION_STORE_SUCCESS)())
      dispatch(fetchUserIntentionStores())
    } catch (error) {
      dispatch(createAction(IntentionStore.FETCH_INTENTION_STORE_ERROR)({error}))
    }
  }
}

export type IntentionShopsListActionFunction = ActionFunction<typeof intentionShopsList>

export const intentionShopsList = (): ThunkAction<any, ReduxStore, null, Action<any>> => {
  return async (dispatch, getState) => {
    try {
      const token = getState().get('token').get('data')
      dispatch(createAction(IntentionMapStore.FETCH_INTENTION_STORE_MAP_START)())
      const intentionShopList = await _intentionShopsList(token!)
      dispatch(createAction(IntentionMapStore.FETCH_INTENTION_STORE_MAP_SUCCESS)(intentionShopList))
    } catch (error) {
      dispatch(createAction(IntentionMapStore.FETCH_INTENTION_STORE_MAP_ERROR)({error}))
    }
  }
}