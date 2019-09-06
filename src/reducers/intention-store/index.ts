import { Action } from "redux-actions"
import { Map } from 'immutable'
import { IntentionStore } from '../../constants/actionTypes'

export default (state=Map({}), { type, payload }: Action<any>) => {
  switch (type) {
    case IntentionStore.FETCH_INTENTION_STORE_START:
      return state.merge({
        isLoading: true,
        error: undefined
      })
    case IntentionStore.FETCH_INTENTION_STORE_SUCCESS:
      return state.merge({
        isLoading: false,
        error: undefined,
        data: payload,
        updateAt: new Date()
      })
    case IntentionStore.FETCH_INTENTION_STORE_ERROR:
      return state.merge({
        isLoading: false,
        error: payload.error
      })
    default:
      return state
  }
}