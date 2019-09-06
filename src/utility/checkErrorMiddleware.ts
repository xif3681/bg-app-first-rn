import { ErrorMessage } from './../constants/actionTypes'
import AsyncStorage from '@react-native-community/async-storage'
import { UserActionTypes } from "../constants/actionTypes"
import { createAction } from 'redux-actions';
export default (store: any) => (next: any) => async (action: any) => {
	if (action.payload && action.payload.error) {
		let message = `${action.payload.error}`.replace("Error:", "")
		if (message.indexOf("timeout") != -1) {
			message = "网络环境不佳，请检查网络"
			store.dispatch(createAction(ErrorMessage.ACTION_SHOW_EOOR_MESSAGE)({ message, data: action.payload.error }))
		} else if (message.indexOf("422") != -1 || message.indexOf("404") != -1) {
			message = "服务器异常"
			store.dispatch(createAction(ErrorMessage.ACTION_SHOW_EOOR_MESSAGE)({ message, data: action.payload.error }))
		} else if (message.indexOf("Network Error") != -1 || message.indexOf("Unable to resolve host") != -1) {
			message = "当前无网络，请检查网络设置"
			store.dispatch(createAction(ErrorMessage.ACTION_SHOW_EOOR_MESSAGE)({ message, data: action.payload.error }))
		} else if (message.indexOf("401") != -1) {
			try {
				await AsyncStorage.removeItem('userToken')
				await AsyncStorage.removeItem('userProfile')
				store.dispatch(createAction(UserActionTypes.LOGOUT_SUCCESS)())
			} catch (error) {

			}
		}
	}
	return next(action)
}