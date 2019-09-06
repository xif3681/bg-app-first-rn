import { ErrorMessage } from './../../constants/actionTypes';
import { Action } from "redux-actions"
import { Map } from 'immutable'

export interface ErrorEntity {
	data: any,
	message: string,
}
export default (state = Map({}), { type, payload }: Action<ErrorEntity>) => {
	switch (type) {
		case ErrorMessage.ACTION_SHOW_EOOR_MESSAGE:
			return state.merge({
				...payload
			})
		default:
			return state
	}
}