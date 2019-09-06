// @ts-ignore
import { Rpc } from 'react-native-qiniu'
import AsyncStorage from '@react-native-community/async-storage'
import request from './request'
import { SERVER, QINIU } from '../constants'
import { Image } from 'react-native-image-crop-picker'
/// @ts-ignore
import Upload from 'react-native-background-upload'
import { Platform } from 'react-native';

export interface ImageModel extends Image {
  remoteUrl?: string
  sourceURL?: string
  uniqueKey?: string
  estimatedRemoteUrl?: string
}

export const fetchQiniuUploadToken = async (token: string) => {
  return request.get(`${SERVER.host}/uploadToken`, undefined, {
    headers: {
      token
    }
  })
}

export const uploadFile2Qiniu = async (path: string, fileName: string, qiniuToken?: string) => {
  let userToken = await AsyncStorage.getItem('userToken')
  if (!userToken) throw new Error('获取用户token失败！')
  const token = qiniuToken || await fetchQiniuUploadToken(userToken) 
  // formInput对象如何配置请参考七牛官方文档“直传文件”一节
  const response = await Rpc.uploadFile(path, token, {
    key : fileName,
  })
  if (response.status !== 200) throw new Error('上传文件失败！')
  const responseText = response.responseText
  const { key } = JSON.parse(responseText)
  return `${QINIU.host}/${key}`
}

export const uploadFile2QiniuInBackgroundSession = (filePath: string, fileName: string, token?: string, startCallback?: (uploadId: string) => void, progressCallback?: (data: {progress: number}) => void, errorCallback?: (data: {error: Error}) => void, completeCallback?: (data: any) => void) => {
  if (!token) {
    errorCallback && errorCallback({error: new Error('缺少token参数')}) 
    return
  }

  const path = Platform.OS === 'android' ? filePath.replace('file://', '') : filePath

  // formInput对象如何配置请参考七牛官方文档“直传文件”一节
  const options = {
    url: QINIU.uploadUrl,
    path,
    method: 'POST',
    field: 'file',
    type: 'multipart',
    parameters: {
      token,
      key: fileName
    },
    notification: {
      enabled: false /// https://github.com/Vydia/react-native-background-upload/issues/154
    }
  }

  Upload.startUpload(options).then((uploadId: string) => {
    if (startCallback) startCallback(uploadId)
    if (progressCallback) Upload.addListener('progress', uploadId, progressCallback)
    if (errorCallback) Upload.addListener('error', uploadId, errorCallback)
    if (completeCallback) Upload.addListener('completed', uploadId, completeCallback)
    Upload.addListener('cancelled', uploadId, (data: any) => {
      console.log(`Cancelled!`)
    })
  }).catch((err: Error) => {
    if (errorCallback) errorCallback({error: err})
  })
}