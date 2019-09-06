import { Action } from "redux-actions"
import { Map } from 'immutable'
import { BackgroundTask } from '../../constants/actionTypes'

export default (state=Map({}), { type, payload }: Action<{ id: string, data?: any, error?: Error }>) => {
  switch (type) {
    case BackgroundTask.TASK_BACKGROUND_PREPARE:
      return state.merge({
        [payload.id]: {
            ...payload.data,
            progress: 0,
            isLoading: true,
            error: undefined
        }
      })
    case BackgroundTask.TASK_BACKGROUND_START:
      return state.merge({
        [payload.id]: {
            ...state.get(payload.id),
            isLoading: true,
            error: undefined,
            uploadId: payload.data
        }
      })
    case BackgroundTask.TASK_BACKGROUND_PROGRESS:
      return state.merge({
        [payload.id]: {
            ...state.get(payload.id),
            isLoading: true,
            error: undefined,
            progress: payload.data
        }
      })
    case BackgroundTask.TASK_BACKGROUND_SUCCESS:
      return state.merge({
        [payload.id]: {
            ...state.get(payload.id),
            isLoading: false,
            data: payload.data,
            progress: 100
        }
      })
    case BackgroundTask.TASK_BACKGROUND_ERROR:
      return state.merge({
        [payload.id]: {
            ...state.get(payload.id),
            isLoading: false,
            error: payload.error,
            progress: undefined
        }
      })
    default:
      return state
  }
}