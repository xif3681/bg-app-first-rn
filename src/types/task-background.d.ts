import { Image } from "react-native-image-crop-picker";

export interface BackgroundTaskModel {
  remoteUrl?: string
  sourceURL?: string
  estimatedRemoteUrl?: string
  uniqueKey?: string
  uploadId?: string
  progress?: number
  isLoading?: boolean
  error?: Error
}

export interface BackgroundImageTaskModel extends BackgroundTaskModel, Image {
  
}