import { ImageModel } from "../../services/qiniu";
import { MapStateToPropsParam, MapDispatchToPropsParam, DispatchProp, connect } from "react-redux";
import { ReduxStore } from "../../reducers";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import React from 'react'
/// @ts-ignore
import { v4 } from 'uuid'
import ImagePicker from 'react-native-image-crop-picker'
import { uploadImagesInBackgroundMode } from "../../actions/upload-background-task";
import Toast from "react-native-root-toast";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import ImageSourceSelectorComponent from "../common/ImageSourceSelector";
import DeletableImageComponent from "../common/DeletableImageComponent";

interface StateProps {
}

interface DispatchProps {
  uploadImages2QiniuInBackgroundMode: (images: Array<ImageModel>) => void
}

interface OwnProps {
  values?: Array<ImageModel>
  onImagesChange: (images: Array<ImageModel>) => void
}

interface OwnState {
  isImagePickerSourceSelectorVisible: boolean
}

const mapStateToProps: MapStateToPropsParam<StateProps, OwnProps, ReduxStore> = (state, ownProps) => {
  return {
  }
}
const mapDispatchToProps: MapDispatchToPropsParam<DispatchProps, OwnProps> = (dispatch: ThunkDispatch<ReduxStore, null, Action<any>>, ownProps) => {
  return {
    uploadImages2QiniuInBackgroundMode: (images: Array<ImageModel>) => dispatch(uploadImagesInBackgroundMode(images))
  }
}

class TaskStoreImages extends React.Component<StateProps & DispatchProps & OwnProps, OwnState> {
  constructor(props: StateProps & DispatchProps & OwnProps) {
    super(props);

    this.state = {
      isImagePickerSourceSelectorVisible: false
    }

    this.images = this.props.values!
  }

  private images = new Array<ImageModel>()

  private showImageSourceSelector = () => {
    this.setState({ isImagePickerSourceSelectorVisible: true })
  }

  private hideImageSourceSelector = () => {
    this.setState({ isImagePickerSourceSelectorVisible: false })
  }

  private onImagesChange = () => {
    this.props.onImagesChange(this.images)
  }

  private pickImageFromAlbum = async () => {
    try {
      let maxFiles = 9
      maxFiles = maxFiles - (this.images ? this.images!.length : 0)
      let images = await ImagePicker.openPicker({
        multiple: true,
        maxFiles: maxFiles,
        compressImageQuality: 0.8,
        compressImageMaxHeight: 1200,
        compressImageMaxWidth: 800,
        mediaType: "photo"
      }) as Array<ImageModel>
      images = images.filter(function (item, index) {
        return index < maxFiles
      })
      this.images = this.images ? [...this.images] : []
      images.forEach((image, index) => {
        image.uniqueKey = v4()
        this.images.push(image)
      })
      this.onImagesChange()
      this.setState({ isImagePickerSourceSelectorVisible: false })
      this.props.uploadImages2QiniuInBackgroundMode(this.images)
    } catch (error) {
      if (error.message !== "User cancelled image selection")
        Toast.show((error.message.indexOf("allow")!=-1||error.message.indexOf("permission")!=-1)?"没有访问系统相册的权限":error.message, {
          position: Toast.positions.CENTER
        })
    }
  }

  private pickImageFromCamera = async () => {
    try {
      const image = await ImagePicker.openCamera({
        compressImageQuality: 0.8,
        compressImageMaxHeight: 1200,
        compressImageMaxWidth: 800
      }) as ImageModel
      image.uniqueKey = v4()
      this.images = this.images?[...this.images, image]:[image]
      this.onImagesChange()
      this.setState({ isImagePickerSourceSelectorVisible: false })
      this.props.uploadImages2QiniuInBackgroundMode(this.images)
    } catch (error) {
      if (error.message !== "User cancelled image selection")
        Toast.show((error.message.indexOf("allow")!=-1||error.message.indexOf("permission")!=-1)? "请先授权本应用相机权限" : error.message, {
          position: Toast.positions.CENTER
        })
    }
  }

  private deleteImage = (willDeleteImage: ImageModel) => {
    this.images = this.props.values!.filter(image => {
      return image.uniqueKey !== willDeleteImage.uniqueKey
    })
    this.onImagesChange()
  }

  public render() {
    return (
      <View style={{ padding: 10, backgroundColor: 'white' }} >
        <Modal backdropOpacity={0.2} onBackdropPress={this.hideImageSourceSelector} isVisible={this.state.isImagePickerSourceSelectorVisible} style={{ justifyContent: 'flex-end', margin: 0 }} >
          <ImageSourceSelectorComponent onAlbumSelect={this.pickImageFromAlbum} onCameSelect={this.pickImageFromCamera} onCancelPress={this.hideImageSourceSelector} />
        </Modal>
        <Text style={{ color: "#333333" }}>添加门店照片(最多9张)</Text>
        <View style={{ flexDirection: 'row', marginTop: 10, flexWrap: 'wrap' }} >
          {
            this.props.values && this.props.values.map(image => {
              return (<DeletableImageComponent key={image.uniqueKey} image={image} onDeletePress={this.deleteImage} />)
            })
          }
          {
            ((this.props.values && this.props.values.length < 9) || !this.props.values) &&
            <TouchableOpacity onPress={this.showImageSourceSelector} style={{ width: 70, height: 70, margin: 10, marginLeft: 0, marginBottom: 0 }} >
              <Image source={require('../../assets/images/img_add3_58x58.png')} style={{ flex: 1, width: undefined, height: undefined }} />
            </TouchableOpacity>
          }

        </View>
      </View>
    )
  }
}

export default connect<StateProps, DispatchProps, OwnProps, ReduxStore>(mapStateToProps, mapDispatchToProps)(TaskStoreImages)