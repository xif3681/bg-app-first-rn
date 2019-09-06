import { Action } from "redux-actions"
import { Map } from 'immutable'
import { Geocode } from '../../constants/actionTypes'

export default (state=Map({}), { type, payload }: Action<{location?: string, message?: string, error?: Error, geocode?: object}>) => {
  switch (type) {
      case Geocode.REGEOCODE_START:
          return state.merge({
            [payload.location!]: Map({
                isLoading: true,
                error: undefined,
                message: payload!.message
            })
          })
      case Geocode.REGEOCODE_SUCCESS:
          return state.merge({
            [payload.location!]: Map({
                isLoading: false,
                error: undefined,
                data: payload.geocode,
                updateAt: new Date()
            })
          })
      case Geocode.REGEOCODE_ERROR:
          return state.merge({
            [payload.location!]: Map({
                isLoading: false,
                error: payload.error,
            })
          })
      default:
          return state
  }
}