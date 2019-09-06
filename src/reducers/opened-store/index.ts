import { Action } from "redux-actions"
import { Map } from 'immutable'
import { OpenedStore } from '../../constants/actionTypes'

export default (state=Map({}), { type, payload }: Action<any>) => {
  switch (type) {
    case OpenedStore.FETCH_OPENED_STORE_START:
      return state.merge({
        isLoading: true,
        error: undefined
      })
    case OpenedStore.FETCH_OPENED_STORE_SUCCESS:
      return state.merge({
        isLoading: false,
        error: undefined,
        data: payload,
        updateAt: new Date()
      })
    case OpenedStore.FETCH_OPENED_STORE_ERROR:
      return state.merge({
        isLoading: false,
        error: payload.error
      })
    default:
      return state
  }
}