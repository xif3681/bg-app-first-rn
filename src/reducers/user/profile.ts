import { Action } from "redux-actions"
import { Map } from 'immutable'
import { UserActionTypes } from '../../constants/actionTypes'

export default (state=Map({}), { type, payload }: Action<any>) => {
  switch (type) {
      case UserActionTypes.FETCH_PROFILE_START:
          return state.merge({
              isLoading: true, 
              error: undefined
          })
      case UserActionTypes.FETCH_PROFILE_SUCCESS:
          return state.merge({
              isLoading: false, 
              data: payload, 
              updateAt: new Date()
          })
      case UserActionTypes.FETCH_PROFILE_ERROR:
          return state.merge({
              isLoading: false,
              error: payload
          })
      default:
          return state
  }
}