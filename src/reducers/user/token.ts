import { Action } from 'redux-actions'
import { UserActionTypes } from '../../constants/actionTypes'
import { Map } from 'immutable'

export default (state = Map({}), { type, payload }: Action<any>) => {
  switch (type) {
    case UserActionTypes.LOGIN_START:
    case UserActionTypes.LOGOUT_START:
      return state.merge({
        isLoading: true,
        error: undefined
      })
    case UserActionTypes.LOGIN_SUCCESS:
    case UserActionTypes.LOGOUT_SUCCESS:
      return state.merge({
        isLoading: false,
        data: payload,
        updatedAt: new Date()
      })
    case UserActionTypes.LOGIN_ERROR:
    case UserActionTypes.LOGOUT_ERROR:
      return state.merge({
        isLoading: false,
        error: payload
      })
    default:
      return state
  }
}
