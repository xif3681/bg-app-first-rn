import { Action } from "redux-actions"
import { Map } from 'immutable'
import { BusinessDistrictProfile } from '../../constants/actionTypes'

export default (state=Map({}), { type, payload }: Action<any>) => {
  switch (type) {
    case BusinessDistrictProfile.FETCH_BUSINESS_DISTRICT_PROFILE_START:
      return state.merge({
        [payload.id]: Map({
            isLoading: true,
            error: undefined
        })
      })
    case BusinessDistrictProfile.FETCH_BUSINESS_DISTRICT_PROFILE_SUCCESS:
      return state.merge({
        [payload.id]: Map({
            isLoading: false,
            error: undefined,
            data: payload.data
        })
      })
    case BusinessDistrictProfile.FETCH_BUSINESS_DISTRICT_PROFILE_ERROR:
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