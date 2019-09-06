import React from 'react';
import { Image, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { connect, MapDispatchToPropsParam, MapStateToPropsParam } from 'react-redux';
import { Action } from 'redux-actions';
import { ThunkDispatch } from 'redux-thunk';
import { uploadImagesInBackgroundMode } from '../../actions/upload-background-task';
import { ReduxStore } from '../../reducers';
import { ImageModel } from '../../services/qiniu';
import { BackgroundImageTaskModel } from '../../types/task-background';

interface StateProps {
  imageBackgroundUploadTask?: BackgroundImageTaskModel

}

interface DispatchProps {
  restartBackgroundUploadTask: (model: ImageModel) => void
}

interface OwnProps {
  image: ImageModel

  onDeletePress?: (image: ImageModel) => void
}

interface OwnState {
  errorUrl?: string
}

const mapStateToProps: MapStateToPropsParam<StateProps, OwnProps, ReduxStore> = (state, ownProps) => {
  const BackgroundImageTaskId = ownProps.image.uniqueKey
  return {
    imageBackgroundUploadTask: state.get('uploadBackgroundTask').get(BackgroundImageTaskId!)
  }
}
const mapDispatchToProps: MapDispatchToPropsParam<DispatchProps, OwnProps> = (dispatch: ThunkDispatch<ReduxStore, null, Action<any>>) => ({
  restartBackgroundUploadTask: (model) => dispatch(uploadImagesInBackgroundMode([model]))
})
class DeletableImageComponent extends React.Component<StateProps & DispatchProps & OwnProps, OwnState> {

  constructor(props: StateProps & DispatchProps & OwnProps) {
    super(props)
    this.state = {
      errorUrl: ""
    }
  }

  private onDeletePress = () => {
    this.props.onDeletePress && this.props.onDeletePress(this.props.image)
  }

  private onReuploadPressCallbackCreater = (imageBackgroundUploadTask: BackgroundImageTaskModel) => () => {
    this.props.restartBackgroundUploadTask(imageBackgroundUploadTask)
  }

  private onLoadError = () => {
    if (!this.state.errorUrl)
      this.setState({
        errorUrl: this.props.image.remoteUrl
      })
  }


  public render() {
    const { errorUrl } = this.state
    return (
      <View style={{ width: 70, height: 70, margin: 10, marginLeft: 0, marginBottom: 0 }} >
        <FastImage source={{ uri: errorUrl ? errorUrl : this.props.image.path ? 'file://' + this.props.image.path : this.props.image.remoteUrl }} style={{ flex: 1, width: undefined, height: undefined, borderRadius: 3 }} onError={this.onLoadError} />
        {
          this.props.imageBackgroundUploadTask && this.props.imageBackgroundUploadTask.isLoading && this.props.imageBackgroundUploadTask.progress ?
            (
              <View style={{ position: 'absolute', bottom: 0, width: 70, height: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(188, 188, 188, 0.3)' }} >
                <Text style={{ color: 'white' }} >{Math.floor(this.props.imageBackgroundUploadTask.progress)}%</Text>
              </View>
            ) :
            null
        }
        {
          this.props.imageBackgroundUploadTask && !this.props.imageBackgroundUploadTask.isLoading && this.props.imageBackgroundUploadTask.error ?
            (
              <TouchableWithoutFeedback onPress={this.onReuploadPressCallbackCreater(this.props.image)} >
                <View style={{ position: 'absolute', width: 70, height: 70, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(188, 188, 188, 0.3)' }} >
                  <Image source={require('../../assets/images/img_upload2_24x24.png')} />
                  <Text style={{ color: 'white', marginTop: 5 }} >重新上传</Text>
                </View>
              </TouchableWithoutFeedback>
            ) :
            null
        }
        <TouchableOpacity onPress={this.onDeletePress} style={{ position: 'absolute', right: 0, top: 0, backgroundColor: 'gray', height: 20, width: 20, justifyContent: 'center', alignItems: 'center', borderTopRightRadius: 3 }} >
          <Image source={require('../../assets/images/img_delete_16x16.png')} />
        </TouchableOpacity>
      </View>
    );
  }
}
export default connect<StateProps, DispatchProps, OwnProps, ReduxStore>(mapStateToProps, mapDispatchToProps)(DeletableImageComponent)