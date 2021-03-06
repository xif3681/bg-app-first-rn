import { Action } from "redux-actions"
import { Map } from 'immutable'
import { Report } from '../../constants/actionTypes'

export default (state=Map({}), { type, payload }: Action<{ id: string, data?: any, error?: Error }>) => {
  switch (type) {
    case Report.DOWNLOAD_PDF_START:
      return state.merge({
        [payload.id]: Map({
            isLoading: true,
            error: undefined
        })
      })
    case Report.DOWNLOAD_PDF_SUCCESS:
      return state.merge({
        [payload.id]: Map({
            isLoading: false,
            error: undefined,
            data: payload.data
        })
      })
    case Report.DOWNLOAD_PDF_ERROR:
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