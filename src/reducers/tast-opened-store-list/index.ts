import { Action } from "redux-actions"
import { Map } from 'immutable'
import { OpenedStoreList } from '../../constants/actionTypes'

export default (state=Map({}), { type, payload }: Action<any>) => {
  switch (type) {
    case OpenedStoreList.FETCH_OPENED_STORE_LIST_START:
      return state.merge({
        isLoading: true,
        error: undefined
      })
    case OpenedStoreList.FETCH_OPENED_STORE_LIST_SUCCESS:
      return state.merge({
        isLoading: false,
        error: undefined,
        data: payload,
        updateAt: new Date()
      })
    case OpenedStoreList.FETCH_OPENED_STORE_LIST_ERROR:
      return state.merge({
        isLoading: false,
        error: payload.error
      })
    default:
      return state
  }
}