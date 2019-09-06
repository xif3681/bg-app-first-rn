import { ActionFunction } from "."
import { ThunkAction } from "redux-thunk"
import { Action, createAction } from "redux-actions"
import { ReduxStore } from "../reducers"
import { BackgroundTask } from "../constants/actionTypes"
import { ImageModel, uploadFile2QiniuInBackgroundSession, fetchQiniuUploadToken } from "../services/qiniu"
import { isEmpty } from 'lodash'
import { Platform, NetInfo, Alert } from "react-native";
import { QINIU } from "../constants";

export type UploadImagesInBackgroundModeActionFunction = ActionFunction<typeof uploadImagesInBackgroundMode>

export const uploadImagesInBackgroundMode = (images: Array<ImageModel>): ThunkAction<any, ReduxStore, null, Action<any>> => {
  return async (dispatch, getState) => {
    const userProfile = getState().get('profile').get('data')!
    const userToken = getState().get('token').get('data')!
    for (const image of images) {
      try {
        if (!isEmpty(image.remoteUrl)) continue
        const qiniuToken = await fetchQiniuUploadToken(userToken)
        const fileName = `${Date.now()}_${Platform.OS}_${userProfile._id}_${image.filename}`
        image.estimatedRemoteUrl = `${QINIU.host}/${fileName}`
        dispatch(createAction(BackgroundTask.TASK_BACKGROUND_PREPARE)({id: image.uniqueKey, data: image}))
        uploadFile2QiniuInBackgroundSession(image.path, fileName, qiniuToken, (uploadId) => {
          dispatch(createAction(BackgroundTask.TASK_BACKGROUND_START)({id: image.uniqueKey, data: uploadId}))
        }, (progressData) => {
          dispatch(createAction(BackgroundTask.TASK_BACKGROUND_PROGRESS)({id: image.uniqueKey, data: progressData.progress}))
        }, (errorData) => {
          /// TODO 错误信息本地化
          dispatch(createAction(BackgroundTask.TASK_BACKGROUND_ERROR)({id: image.uniqueKey, error: errorData.error}))
        }, (completeData) => {
          if (completeData.responseCode !== 200) {
            dispatch(createAction(BackgroundTask.TASK_BACKGROUND_ERROR)({id: image.uniqueKey, error: new Error('上传失败')}))
          } else {
            const responseText = completeData.responseBody
            const { key } = JSON.parse(responseText)
            image.remoteUrl = `${QINIU.host}/${key}`
            dispatch(createAction(BackgroundTask.TASK_BACKGROUND_SUCCESS)({id: image.uniqueKey, data: image.remoteUrl}))
          }
        })
      } catch (error) {
        dispatch(createAction(BackgroundTask.TASK_BACKGROUND_ERROR)({id: image.uniqueKey, error}))
      }
    }
  }
}