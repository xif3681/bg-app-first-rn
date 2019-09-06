import { ActionFunction } from "."
import { ThunkAction } from "redux-thunk"
import { Action, createAction } from "redux-actions"
import { ReduxStore } from "../reducers"
import { BusinessDistrictProfile } from "../constants/actionTypes"
import { fetchBusinessDistrictPopulation, fetchBusinessDistrictBaseProfile, fetchBusinessDistrictFlow, fetchBusinessDistrictFlowProfile } from '../services/business-district-profile'

export type FetchBusinessDistrictProfileActionFunction = ActionFunction<typeof fetchBusinessDistrictProfile>

export const fetchBusinessDistrictProfile = (taskId: string): ThunkAction<any, ReduxStore, null, Action<any>> => {
  return async (dispatch, getState) => {
    try {
      const token = getState().get('token').get('data')!
      dispatch(createAction(BusinessDistrictProfile.FETCH_BUSINESS_DISTRICT_PROFILE_START)({id: taskId}))
      const [ population, workAgeProfile, workRankProfile, residentAgeProfile, residentRankProfile, flow, flowAgeProfile, flowRankProfile ] = await Promise.all([
        fetchBusinessDistrictPopulation(token, taskId).catch(error => error),
        fetchBusinessDistrictBaseProfile(token, taskId, 'company', 'age').catch(error => error),
        fetchBusinessDistrictBaseProfile(token, taskId, 'company', 'rank').catch(error => error),
        fetchBusinessDistrictBaseProfile(token, taskId, 'home', 'age').catch(error => error),
        fetchBusinessDistrictBaseProfile(token, taskId, 'home', 'rank').catch(error => error),
        fetchBusinessDistrictFlow(token, taskId).catch(error => error),
        fetchBusinessDistrictFlowProfile(token, taskId, 'age').catch(error => error),
        fetchBusinessDistrictFlowProfile(token, taskId, 'rank').catch(error => error)
      ])
      /// 如果全部都出错 throw error
      const result = [population, workAgeProfile, workRankProfile, residentAgeProfile, residentRankProfile, flow, flowAgeProfile, flowRankProfile]
      if (!result.some(res => !!res.data)) throw new Error('获取商圈数据失败')
      dispatch(createAction(BusinessDistrictProfile.FETCH_BUSINESS_DISTRICT_PROFILE_SUCCESS)({id: taskId, data: {population, workAgeProfile, workRankProfile, residentAgeProfile, residentRankProfile, flow, flowAgeProfile, flowRankProfile}}))
    } catch (error) {
      dispatch(createAction(BusinessDistrictProfile.FETCH_BUSINESS_DISTRICT_PROFILE_ERROR)({id: taskId, error}))
    }
  }
}