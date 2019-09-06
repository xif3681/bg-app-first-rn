import { Action } from "redux-actions"
import { Map } from 'immutable'
import { OnlineOrder } from '../../constants/actionTypes'

export default (state=Map({}), { type, payload }: Action<any>) => {
  switch (type) {
    case OnlineOrder.FETCH_ONLINE_ORDER_START:
      return state.merge({
        isLoading: true,
        error: undefined
      })
    case OnlineOrder.FETCH_ONLINE_ORDER_SUCCESS:
      return state.merge({
        isLoading: false,
        error: undefined,
        data: payload,
        updateAt: new Date()
      })
    case OnlineOrder.FETCH_ONLINE_ORDER_ERROR:
      return state.merge({
        isLoading: false,
        error: payload.error
      })
    default:
      return state
  }
}