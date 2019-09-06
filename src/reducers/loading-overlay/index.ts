import { Action } from "redux-actions"
import { IntentionStore, Task, OnlineOrder, OpenedStore, POI, Draft,Report, IntentionMapStore } from '../../constants/actionTypes'
import { List } from 'immutable'

export default (state = List(), { type, payload }: Action<{ message?: string }>) => {
  switch (type) {
    case IntentionStore.FETCH_INTENTION_STORE_START:
    case Task.FETCH_USER_TASK_LIST_START:
    case Task.FETCH_TASK_START:
    case Task.FETCH_TASK_PDF_START:
    case OnlineOrder.FETCH_ONLINE_ORDER_START:
    case OpenedStore.FETCH_OPENED_STORE_START:
    case POI.FETCH_POI_START:
    case Draft.REMOTE_CREATE_START:
    case IntentionMapStore.FETCH_INTENTION_STORE_MAP_START:
    case Draft.REMOTE_UPDATE_START:
    case Report.DOWNLOAD_PDF_START:
    case Report.FETCH_TASK_REPORT_START:

      return state.push(payload && payload.message || '加载中...')

    case IntentionStore.FETCH_INTENTION_STORE_SUCCESS:
    case IntentionMapStore.FETCH_INTENTION_STORE_MAP_SUCCESS:
    case IntentionMapStore.FETCH_INTENTION_STORE_MAP_ERROR:
    case IntentionStore.FETCH_INTENTION_STORE_ERROR:
    case Task.FETCH_USER_TASK_LIST_SUCCESS:
    case Task.FETCH_TASK_SUCCESS:
    case Task.FETCH_TASK_ERROR:
    case Task.FETCH_USER_TASK_LIST_ERROR:
    case Task.FETCH_TASK_PDF_SUCCESS:
    case Task.FETCH_TASK_PDF_ERROR:
    case OnlineOrder.FETCH_ONLINE_ORDER_SUCCESS:
    case OnlineOrder.FETCH_ONLINE_ORDER_ERROR:
    case OpenedStore.FETCH_OPENED_STORE_SUCCESS:
    case OpenedStore.FETCH_OPENED_STORE_ERROR:
    case POI.FETCH_POI_SUCCESS:
    case POI.FETCH_POI_ERROR:
    case Draft.REMOTE_CREATE_SUCCESS:
    case Draft.REMOTE_CREATE_ERROR:
    case Draft.REMOTE_UPDATE_SUCCESS:
    case Draft.REMOTE_UPDATE_ERROR:
    case Report.DOWNLOAD_PDF_SUCCESS:
    case Report.DOWNLOAD_PDF_ERROR:
    case Report.FETCH_TASK_REPORT_SUCCESS:
    case Report.FETCH_TASK_REPORT_ERROR:

      return state.pop()

    default:
      return state
  }
}