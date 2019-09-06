import { Action } from "redux-actions"
import { Map } from 'immutable'
import { POI } from '../../constants/actionTypes'

export default (state=Map({}), { type, payload }: Action<{ taskId: string, pois?: any, error?: Error }>) => {
  switch (type) {
    case POI.FETCH_POI_START:
      return state.merge({
        [payload.taskId]: Map({
            isLoading: true,
            error: undefined
        })
      })
    case POI.FETCH_POI_SUCCESS:
      return state.merge({
        [payload.taskId]: Map({
            isLoading: false,
            error: undefined,
            data: payload.pois
        })
      })
    case POI.FETCH_POI_ERROR:
      return state.merge({
        [payload.taskId]: Map({
            isLoading: false,
            error: payload.error
        })
      })
    default:
      return state
  }
}