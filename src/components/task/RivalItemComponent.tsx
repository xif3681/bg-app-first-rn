import { View, TouchableOpacity, Image, Text, TextInput } from "react-native";
import React from 'react'
import { Line } from "./FormOne"
import ImagePicker from 'react-native-image-crop-picker'
import Modal from "react-native-modal"
import ImageSourceSelectorComponent from '../common/ImageSourceSelector'
import Toast from "react-native-root-toast"
/// @ts-ignore
import { v4 } from 'uuid'
import { ImageModel } from "../../services/qiniu";
import { TaskDraftModel } from "../../types/task-draft";
import { MapStateToPropsParam, MapDispatchToPropsParam, connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { ReduxStore } from "../../reducers";
import { Action } from "redux-actions";
import { uploadImagesInBackgroundMode } from "../../actions/upload-background-task";
import DeletableImageComponent from "../common/DeletableImageComponent";

export interface Corrival {
  name: string
  rent: string
  saleRoom: string
  images?: Array<ImageModel>
  key: string
}

interface StateProps {
}

interface DispatchProps {
  uploadImages2QiniuInBackgroundMode: (images: Array<ImageModel>) => void
}

interface OwnProps {
  onDeletePress?: () => void
  corrival: Corrival
  onCorrivalValueChange: (corrival: Corrival) => void
  maxCount?: number
  taskDraft?: TaskDraftModel
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

class RivalItemComponent extends React.Component<StateProps & DispatchProps & OwnProps, OwnState> {
  constructor(props: StateProps & DispatchProps & OwnProps) {
    super(props);
    this.state = {
      isImagePickerSourceSelectorVisible: false
    }

    this.name = this.props.corrival.name
    this.rent = this.props.corrival.rent
    this.saleRoom = this.props.corrival.saleRoom
    this.images = this.props.corrival.images || []
  }

  private name?: string
  private rent?: string
  private saleRoom?: string
  private images?: Array<ImageModel>

  private onNameChange = (name: string) => {
    this.name = name
    this.onCorrivalValueChange()
  }

  private onRentChange = (rent: string) => {
    this.rent = rent
    this.onCorrivalValueChange()
  }

  private onSaleRoomChange = (saleRoom: string) => {
    this.saleRoom = saleRoom
    this.onCorrivalValueChange()
  }

  private onValueChange = () => {
    if (this.name !== this.props.corrival.name || this.rent !== this.props.corrival.rent || this.saleRoom !== this.props.corrival.saleRoom) this.onCorrivalValueChange()
  }

  private onCorrivalValueChange = () => {
    const corival = { ...this.props.corrival, name: this.name, rent: this.rent, saleRoom: this.saleRoom, images: this.images }
    this.props.onCorrivalValueChange(corival as Corrival)
  }

  private pickImageFromAlbum = async () => {
    try {
      let maxFiles = this.props.maxCount ? this.props.maxCount : 2
      maxFiles = maxFiles - (this.images ? this.images.length : 0)
      let images = await ImagePicker.openPicker({
        multiple: true,
        maxFiles: maxFiles,
        compressImageQuality:0.8,
        compressImageMaxHeight:1200,
        compressImageMaxWidth:800,
        mediaType:"photo"
      }) as Array<ImageModel>
      images = images.filter(function (item, index) {
        return index < maxFiles
      })
      this.images = this.images ? [...this.images] : []
      images.forEach((image, index) => {
        image.uniqueKey = v4()
        this.images!.push(image)
      })
      this.onCorrivalValueChange()
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
        compressImageQuality:0.8,
        compressImageMaxHeight:1200,
        compressImageMaxWidth:800
      }) as ImageModel
      image.uniqueKey = v4()
      this.images = this.images?[...this.images, image]:[image]
      this.onCorrivalValueChange()
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
    this.images = this.images!.filter(image => {
      return image.uniqueKey !== willDeleteImage.uniqueKey
    })
    this.onCorrivalValueChange()
  }

  private showImageSourceSelector = () => {
    this.setState({ isImagePickerSourceSelectorVisible: true })
  }

  private hideImageSourceSelector = () => {
    this.setState({ isImagePickerSourceSelectorVisible: false })
  }

  public render() {
    return (
      <View style={{ backgroundColor: 'white' }} >
        <Modal backdropOpacity={0.2} onBackdropPress={this.hideImageSourceSelector} isVisible={this.state.isImagePickerSourceSelectorVisible} style={{ justifyContent: 'flex-end', margin: 0 }} >
          <ImageSourceSelectorComponent onAlbumSelect={this.pickImageFromAlbum} onCameSelect={this.pickImageFromCamera} onCancelPress={this.hideImageSourceSelector} />
        </Modal>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10, marginRight: 10 }} >
          <TouchableOpacity onPress={this.props.onDeletePress} style={{ marginRight: 10, height: 20, width: 20 }} >
            <Image source={require('../../assets/images/img_delete_38x38.png')} style={{ flex: 1, height: undefined, width: undefined }} />
          </TouchableOpacity>
          <Text style={{ color: "#000000", fontSize: 17 }}>门店名称</Text>
          <TextInput value={this.props.corrival.name} onBlur={this.onValueChange} onChangeText={this.onNameChange} placeholder='输入竞争门店名称' style={{ flex: 1, height: 40, textAlign: 'right', color: "#666666" }} />
        </View>
        <Line />
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, marginLeft: 40 }} >
          <Text style={{ color: "#000000", fontSize: 17 }}>租金</Text>
          <TextInput value={this.props.corrival.rent} onBlur={this.onValueChange} placeholder='输入数值' onChangeText={this.onRentChange} keyboardType='numeric' style={{ flex: 1, height: 40, textAlign: 'right', marginRight: 5, fontSize: 15, color: "#666666" }} />
          <Text style={{ color: "#666666", fontSize: 17 }}>元</Text>
        </View>
        <Line />
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, marginLeft: 40 }} >
          <Text style={{ color: "#000000", fontSize: 17 }}>月销售额</Text>
          <TextInput value={this.props.corrival.saleRoom} onBlur={this.onValueChange} placeholder='输入数值' onChangeText={this.onSaleRoomChange} keyboardType='numeric' style={{ flex: 1, height: 40, textAlign: 'right', marginRight: 5, fontSize: 15, color: "#666666" }} />
          <Text style={{ color: "#666666", fontSize: 17 }}>元</Text>
        </View>
        <Line />
        <View style={{ margin: 10, marginLeft: 40 }} >
          <Text style={{ color: "#000000", fontSize: 17 }}>竞争门店照片（最多2张）</Text>
          <View style={{ flexDirection: 'row', marginTop: 10, flexWrap: 'wrap' }} >
            {
              this.props.corrival.images && this.props.corrival.images.map((image, index) => {
                return (<DeletableImageComponent key={image.uniqueKey} image={image} onDeletePress={this.deleteImage} />)
              })
            }
            {
              !this.props.maxCount || (this.props.corrival.images ? (this.props.maxCount > this.props.corrival.images.length) : true) &&
              <TouchableOpacity onPress={this.showImageSourceSelector} style={{ width: 70, height: 70, margin: 10, marginLeft: 0, marginBottom: 0 }} >
                <Image source={require('../../assets/images/img_add3_58x58.png')} style={{ flex: 1, width: undefined, height: undefined, borderRadius: 3 }} />
              </TouchableOpacity>
            }
          </View>
        </View>
      </View>
    );
  }
}

export default connect<StateProps, DispatchProps, OwnProps, ReduxStore>(mapStateToProps, mapDispatchToProps)(RivalItemComponent)