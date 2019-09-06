import { Action } from "redux-actions"
import { Map } from 'immutable'
import { Draft } from '../../constants/actionTypes'

export default (state=Map<string, any>({} as any), { type, payload }: Action<{taskDraftId: string, error?: Error, draft?: any, keyValues?: {[key: string]: any}}>) => {
  switch (type) {
    case Draft.CREATE_LOCAL:
      return state.merge({
        [payload.taskDraftId]: Map({
          isLoading: false,
          error: undefined,
          data: payload.draft
        })
      })
    case Draft.VALUE_CHANGE:
      const task = state.get(payload.taskDraftId).get('data')
      return state.merge({
        [payload.taskDraftId]: Map({
          data: {...task, ...payload.keyValues},
          isLoading: false,
          isDirty: true,
          error: undefined
        })
      })
    // case Draft.REMOTE_CREATE_START:
    // case Draft.REMOTE_UPDATE_START:
    //   return state
    case Draft.REMOTE_CREATE_SUCCESS:
    case Draft.REMOTE_UPDATE_SUCCESS:
      return state.merge({
        [payload.taskDraftId]: Map({
          data: payload.draft,
          isLoading: false,
          error: undefined
        })
      })
    case Draft.REMOTE_CREATE_ERROR:
    case Draft.REMOTE_UPDATE_ERROR:
      return state.merge({
        [payload.taskDraftId]: state.get(payload.taskDraftId).merge({
            isLoading: false,
            error: payload.error
        })
      })
    default:
      return state
  }
}