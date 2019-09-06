import { ActionFunction } from "."
import { ThunkAction } from "redux-thunk"
import { Action, createAction } from "redux-actions"
import { ReduxStore } from "../reducers"
import { UserActionTypes } from "../constants/actionTypes"
import AsyncStorage from '@react-native-community/async-storage'
// @ts-ignore
import * as WechatWork from 'react-native-wechat-work'
import { login as _login, fetchUserInferiors as _fetchUserInferiors, debugLoginWithPhoneNumber } from '../services/user'

export type LoginActionFunction = ActionFunction<typeof login>

export const login = (): ThunkAction<any, ReduxStore, null, Action<any>> => {
  return async (dispatch) => {
    try {
      dispatch(createAction(UserActionTypes.LOGIN_START)())
      if (__DEV__) {

          // await WechatWork.registerApp('wwauthf89009662322d93e000033', 'wxf89009662322d93e', '1000033') /// 企业证书
          // const isAppInstalled = await WechatWork.isAppInstalled()
          // if (!isAppInstalled) throw new Error('请先安装企业微信后再登录')
          // const { code } = await WechatWork.SSOAuth()
          // console.log(code)
          // const { token, user } = await _login(code)
          // console.log(token)
        
        // const { token, user } = await debugLoginWithPhoneNumber('15607047168')
        const { token, user } = await debugLoginWithPhoneNumber('13162583810')

        AsyncStorage.setItem('userToken', token)
        AsyncStorage.setItem('userProfile', JSON.stringify(user))
        dispatch(createAction(UserActionTypes.FETCH_PROFILE_SUCCESS)(user))
        dispatch(createAction(UserActionTypes.LOGIN_SUCCESS)(token))
      } else {
        await WechatWork.registerApp('wwauthf89009662322d93e000033', 'wxf89009662322d93e', '1000033') /// 企业证书
        // await WechatWork.registerApp('wwauthf89009662322d93e000054', 'wxf89009662322d93e', '1000054') /// 发布证书
        const isAppInstalled = await WechatWork.isAppInstalled()
        if (!isAppInstalled) throw new Error('请先安装企业微信后再登录')
        const { code } = await WechatWork.SSOAuth()
        const { token, user } = await _login(code)
        AsyncStorage.setItem('userToken', token);
        AsyncStorage.setItem('userProfile', JSON.stringify(user));
        dispatch(createAction(UserActionTypes.FETCH_PROFILE_SUCCESS)(user))
        dispatch(createAction(UserActionTypes.LOGIN_SUCCESS)(token))
      }
    } catch (error) {
      dispatch(createAction(UserActionTypes.LOGIN_ERROR)(error))
    }
  }
}

export const localLogin = (): ThunkAction<any, ReduxStore, null, Action<any>> => {
  return async (dispatch) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) throw new Error('token失效,请重新登录')
      dispatch(createAction(UserActionTypes.LOGIN_SUCCESS)(userToken))
      const userProfileString = await AsyncStorage.getItem('userProfile');
      const userProfile = userProfileString && JSON.parse(userProfileString)
      userProfile && dispatch(createAction(UserActionTypes.FETCH_PROFILE_SUCCESS)(userProfile))
      return userToken
    } catch (error) {
      dispatch(createAction(UserActionTypes.LOGIN_ERROR)(error))
    }
  }
}

export const logout = (): ThunkAction<any, ReduxStore, null, Action<any>> => {
  return async (dispatch) => {
    try {
      // await AsyncStorage.clear()
      await AsyncStorage.removeItem('userToken')
      dispatch(createAction(UserActionTypes.LOGOUT_SUCCESS)())
    } catch (error) {
      dispatch(createAction(UserActionTypes.LOGOUT_ERROR)(error))
    }
  }
}

export type FetchUserInferiorsActionFunction = ActionFunction<typeof fetchUserInferiors>

export const fetchUserInferiors = (): ThunkAction<any, ReduxStore, null, Action<any>> => {
  return async (dispatch, getState) => {
    try {
      dispatch(createAction(UserActionTypes.FETCH_USER_INFERIORS_START)())
      const token = getState().get('token').get('data')!
      const data = await _fetchUserInferiors(token)
      const currentUserString = await AsyncStorage.getItem('userProfile')
      if (currentUserString) {
        data.unshift(JSON.parse(currentUserString))
      }
      dispatch(createAction(UserActionTypes.FETCH_USER_INFERIORS_SUCCESS)(data))
    } catch (error) {
      dispatch(createAction(UserActionTypes.FETCH_USER_INFERIORS_ERROR)(error))
    }
  }
}