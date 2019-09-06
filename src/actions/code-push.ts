import { createAction } from "redux-actions"
import { CodePush as CodePushActionType } from "../constants/actionTypes"
import { ThunkAction } from "redux-thunk"
import { ReduxStore } from "../reducers"
import { Action } from "redux"
import { RemotePackage } from "react-native-code-push"
import CodePush from 'react-native-code-push'

export const checkUpdate = (): ThunkAction<Promise<RemotePackage | undefined | null>, ReduxStore, null, Action<any>> => {
  return async (dispatch) => {
    try {
      dispatch(createAction(CodePushActionType.ACTION_CODE_PUSH_UPDATE_CHEKECK_START)())
      const remotePackage = await CodePush.checkForUpdate(undefined, async (mismatchPackage) => {
        dispatch(createAction(CodePushActionType.ACTION_CODE_PUSH_MISMATCH_VERSION_FOUND)(mismatchPackage))
      })
      dispatch(createAction(CodePushActionType.ACTION_CODE_PUSH_UPDATE_CHEKECK_SUCCESS)(remotePackage))
      
      remotePackage && dispatch(downloadAndInstallPackage(remotePackage!))

      return remotePackage
    } catch (error) {
      dispatch(createAction(CodePushActionType.ACTION_CODE_PUSH_UPDATE_CHEKECK_ERROR)(error))
    }
  }
}

export const downloadAndInstallPackage = (remotePackage: RemotePackage): ThunkAction<any, ReduxStore, null, Action<any>> => {
  return async (dispatch) => {
    try {
      dispatch(createAction(CodePushActionType.ACTION_CODE_PUSH_UPDATE_DOWNLOAD_START)())
      const localPackage = await remotePackage.download((progress => {
        dispatch(createAction(CodePushActionType.ACTION_CODE_PUSH_UPDATE_DOWNLOAD_PROGRESS)(progress))
      }))
      dispatch(createAction(CodePushActionType.ACTION_CODE_PUSH_UPDATE_DOWNLOAD_SUCCESS)(localPackage))
      if (remotePackage.isMandatory) {
        localPackage.install(CodePush.InstallMode.IMMEDIATE)
      } else {
        localPackage.install(CodePush.InstallMode.ON_NEXT_RESTART)
      }
    } catch (error) {
      dispatch(createAction(CodePushActionType.ACTION_CODE_PUSH_UPDATE_DOWNLOAD_ERROR)(error))
    }
  }
}