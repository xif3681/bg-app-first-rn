import { Action } from "redux-actions"
import { Map } from 'immutable'
import { Report } from '../../constants/actionTypes'

export default (state=Map({}), { type, payload }: Action<{ id: string, data?: any, error?: Error }>) => {
  switch (type) {
    case Report.FETCH_USER_REPORTS_START:
      return state.merge({
        [payload.id]: Map({
            isLoading: true,
            error: undefined
        })
      })
    case Report.FETCH_USER_REPORTS_SUCCESS:
      return state.merge({
        [payload.id]: Map({
            isLoading: false,
            error: undefined,
            data: payload.data
        })
      })
    case Report.FETCH_USER_REPORTS_ERROR:
      return state.merge({
        [payload.id]: Map({
            isLoading: false,
            error: payload.error
        })
      })
    default:
      return state
  }
}