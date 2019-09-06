import { Action } from "redux-actions"
import { Map } from 'immutable'
import { IntentionMapStore } from '../../constants/actionTypes'

export default (state = Map({}), { type, payload }: Action<any>) => {
  switch (type) {
    case IntentionMapStore.FETCH_INTENTION_STORE_MAP_START:
      return state.merge({
        isLoading: true,
        error: undefined
      })
    case IntentionMapStore.FETCH_INTENTION_STORE_MAP_SUCCESS:
      return state.merge({
        isLoading: false,
        error: undefined,
        data: payload.data,
        updateAt: new Date()
      })
    case IntentionMapStore.FETCH_INTENTION_STORE_MAP_ERROR:
      return state.merge({
        isLoading: false,
        error: payload.error
      })
    default:
      return state
  }
}