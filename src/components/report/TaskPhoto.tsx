import React from 'react'
import { View, Dimensions, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native'
import { connect, MapStateToPropsParam, MapDispatchToPropsParam } from 'react-redux'
import { ReduxStore } from '../../reducers'
import { ThunkDispatch } from 'redux-thunk'
import { Action } from 'redux-actions'
import { TaskModel } from '../../types/task'
import Swiper from 'react-native-swiper'
import FastImage from 'react-native-fast-image'
import { Gap } from '../task/FormOne';
import ImageZoomView from './ImageZoomView';
import { ImageModel } from '../../services/qiniu';

interface StateProps { }

interface DispatchProps { }

interface OwnProps {
  task: TaskModel
}

interface OwnState {
  visible: boolean,
  images: Array<ImageModel>,
  choose: number
}

const mapStateToProps: MapStateToPropsParam<StateProps, OwnProps, ReduxStore> = state => ({
})
const mapDispatchToProps: MapDispatchToPropsParam<DispatchProps, OwnProps> = (dispatch: ThunkDispatch<ReduxStore, null, Action<any>>) => ({
})
class TaskPhotoComponent extends React.Component<StateProps & DispatchProps & OwnProps, OwnState> {

  constructor(props: StateProps & DispatchProps & OwnProps) {
    super(props)
    this.state = {
      visible: false,
      images: [],
      choose: 0
    }
  }

  _OnImageClick = (images: Array<ImageModel>, choose: number) => {
    this.setState({
      visible: true,
      choose,
      images
    })
  }

  render() {
    const { visible, images, choose } = this.state
    return (
      <View style={{ flex: 1, backgroundColor: "#ffffff" }} >
        {
          Platform.OS === 'android' && visible ? <StatusBar barStyle='light-content' backgroundColor='rgba(0, 0, 0, 1)' animated={false} /> : null
        }
        <View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', margin: 10 }} >
            <Text style={{ fontSize: 16, color: "#000000" }} >商铺照片</Text>
          </View>
          {/* {this.props.task.name && <Text style={{ margin: 10 ,fontSize: 14,color:"#000000"}} >{this.props.task.name}</Text>} */}
        </View>
        {
          (this.props.task.images && this.props.task.images.length) ?
            (
              <Swiper autoplay={false} showsButtons style={{ height: 200 }} nextButton={<View><Image source={require('../../assets/images/img_down_40x78.png')} /></View>} prevButton={<View><Image source={require('../../assets/images/img_up_40x78.png')} /></View>}>
                {
                  this.props.task.images.map((image, index) => {
                    return (
                      <TouchableOpacity style={{ flex: 1 }} key={image.path} onPress={() => this._OnImageClick(this.props.task.images!, index)}>
                        {(image.remoteUrl || image.path) && <FastImage source={{ uri: image.remoteUrl || 'file://' + image.path }} style={{ flex: 1 }} />}
                      </TouchableOpacity>
                    )
                  })
                }
              </Swiper>
            ) :
            (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', margin: 10 }} >
                <Image source={require('../../assets/images/img_no_pic_714x315.png')} />
              </View>
            )
        }
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', margin: 10 }} >
          <Text style={{ fontSize: 16, color: "#000000" }} >竞争店照片</Text>
        </View>
        {
          (this.props.task.corrivals && this.props.task.corrivals.length) ? (this.props.task.corrivals.map(corrival => {
            return (
              <View key={corrival.name} >
                {corrival.name && <Text style={{ margin: 10 }} >{corrival.name}</Text>}
                {(corrival.images && corrival.images.length) ? <Swiper autoplay={false} showsButtons style={{ height: 200 }} nextButton={<View><Image source={require('../../assets/images/img_down_40x78.png')} /></View>} prevButton={<View><Image source={require('../../assets/images/img_up_40x78.png')} /></View>}>
                  {
                    corrival.images && corrival.images.map((image, index) => {
                      return (
                        <TouchableOpacity style={{ flex: 1 }} key={image.path || image.remoteUrl} onPress={() => this._OnImageClick(corrival.images!, index)}>
                          {
                            (image.remoteUrl || image.path) && <FastImage source={{ uri: image.remoteUrl || 'file://' + image.path }} style={{ flex: 1 }} />
                          }
                        </TouchableOpacity>
                      )
                    })
                  }
                </Swiper> : (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', margin: 10 }} >
                  <Image source={require('../../assets/images/img_no_pic_714x315.png')} />
                </View>)}

              </View>
            )
          })) :
            (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', margin: 10 }} >
              <Image source={require('../../assets/images/img_no_pic_714x315.png')} />
            </View>)
        }
        <Gap />
        <ImageZoomView imageList={images} nowChoose={choose} show={visible} onRequestClose={() => {
          this.setState({
            visible: false
          })
        }} />
      </View>
    )
  }
}
export default connect<StateProps, DispatchProps, OwnProps, ReduxStore>(mapStateToProps, mapDispatchToProps)(TaskPhotoComponent)
const styles = StyleSheet.create({
  nextButton: {
    height: 39,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
});
