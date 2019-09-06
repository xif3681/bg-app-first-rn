import { Action } from "redux-actions"
import { Map } from 'immutable'
import { Task } from '../../constants/actionTypes'

export default (state=Map({}), { type, payload }: Action<any>) => {
  switch (type) {
    case Task.FETCH_USER_TASK_LIST_START:
      return state.merge({
        isLoading: true,
        error: undefined
      })
    case Task.FETCH_USER_TASK_LIST_SUCCESS:
      return state.merge({
        isLoading: false,
        error: undefined,
        data: payload,
        updateAt: new Date()
      })
    case Task.FETCH_USER_TASK_LIST_ERROR:
      return state.merge({
        isLoading: false,
        error: payload.error
      })
    default:
      return state
  }
}