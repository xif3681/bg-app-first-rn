import { CodePush } from '../../constants/actionTypes'
import { Map } from 'immutable'
import { RemotePackage, LocalPackage, DownloadProgress } from 'react-native-code-push';

export interface CodePush {
	isUpdateChecking?: boolean,
	updateRemotePackage?: RemotePackage,
	updateCheckingError?: Error,
	
	hasNewVersion?: boolean,
	newVersionUpdatePackage?: RemotePackage,

	isUpdatePackageDowloading?: boolean
	updateDownloadProgress?: DownloadProgress
	updateLockagePackage?: LocalPackage,
	updateDownloadError?: Error
}

export const codePush = (state=Map({} as any), { type, payload }: any) => {
	switch (type) {
		case CodePush.ACTION_CODE_PUSH_UPDATE_CHEKECK_START:
			return state.merge({
				isUpdateChecking: true,
				updateCheckingError: undefined
			})
		case CodePush.ACTION_CODE_PUSH_UPDATE_CHEKECK_SUCCESS:
			return state.merge({
				isUpdateChecking: false,
				updateRemotePackage: payload
			})
		case CodePush.ACTION_CODE_PUSH_UPDATE_CHEKECK_ERROR:
			return state.merge({
				isUpdateChecking: false,
				updateCheckingError: payload
			})

		case CodePush.ACTION_CODE_PUSH_MISMATCH_VERSION_FOUND:
			return state.merge({
				hasNewVersion: true,
				newVersionUpdatePackage: payload
			})

		case CodePush.ACTION_CODE_PUSH_UPDATE_DOWNLOAD_START:
			return state.merge({
				isUpdatePackageDowloading: true,
				updateDownloadError: undefined
			})
		case CodePush.ACTION_CODE_PUSH_UPDATE_DOWNLOAD_PROGRESS:
			return state.merge({
				updateDownloadProgress: payload
			})
		case CodePush.ACTION_CODE_PUSH_UPDATE_DOWNLOAD_SUCCESS:
			return state.merge({
				isUpdatePackageDowloading: false,
				updateLockagePackage: payload
			})
		case CodePush.ACTION_CODE_PUSH_UPDATE_DOWNLOAD_ERROR:
			return state.merge({
				isUpdatePackageDowloading: false,
				updateDownloadError: payload
			})

		default:
			return state;
	}
}