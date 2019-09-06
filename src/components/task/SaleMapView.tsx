import React from 'react'
import { View, TouchableOpacity, Dimensions, Image, Text, SafeAreaView, EventSubscription, ActivityIndicator, StatusBar, Alert, BackHandler, BackAndroid, Platform, InteractionManager } from 'react-native'
import { connect, MapStateToPropsParam, MapDispatchToPropsParam } from 'react-redux'
import { ReduxStore } from '../../reducers'
import { ThunkDispatch } from 'redux-thunk'
import { Action } from 'redux-actions'
import { NavigationScreenProp } from 'react-navigation'
import { NavigationRoute } from 'react-navigation'
import { MapView, LatLng, Marker, MultiPoint, HeatMap } from 'react-native-amap3d'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { reverseGeocode, LocationModel } from '../../services/reverse-geocode'
import MapViewHeaderComponent from './MapViewHeaderComponent'
import PopupFilterMenu from './PopupFilterMenu';
import { FetchTasksActionFunction, fetchTasks } from '../../actions/task';
import { TaskModel } from '../../types/task';
import { Gap } from './FormOne';
import { fetchAllOpenedStores, FetchAllOpenedStoresActionFunction } from '../../actions/opened-store';
import { OpenedStore } from '../../types/opened-store';
import { taskDraftValuesChange } from '../../actions/draft';
import { fetchAllOnlineOrdersActionFunction, fetchAllOnlineOrders } from '../../actions/online-orders';
import { GeolocationManager } from '../../services/location';
import Toast from 'react-native-root-toast';
import TaskInformationPopupComponent from './TaskInformationPopupComponent';
import { TaskDraftModel } from '../../types/task-draft';
import { IntentionShopsListActionFunction, intentionShopsList } from '../../actions/intention-stores';
import { IntentionStoreModel } from '../../types/intention-store';
import { User } from '../../types/user';

const { width: screenWidth } = Dimensions.get('window')
const statusBarHeight = getStatusBarHeight(true)

interface PoiInfoPopupComponentProps {
  location: LocationModel,
  onPress: () => void
}

class PoiInfoPopupComponent extends React.Component<PoiInfoPopupComponentProps, any> {
  constructor(props: PoiInfoPopupComponentProps) {
    super(props);
  }

  public render() {
    return (
      <SafeAreaView>
        <View style={{ flexDirection: 'row', margin: 10, alignItems: "flex-start" }} >
          <View style={{ height: 18, width: 18, marginTop: 4 }} >
            <Image source={require('../../assets/images/img_location_36x36.png')} style={{ flex: 1, width: undefined, height: undefined, }} />
          </View>
          {
            this.props.location && this.props.location.formattedAddress ?
              (<Text style={{ marginLeft: 7, flex: 1, fontSize: 16, color: "#000000" }} >{this.props.location.formattedAddress}</Text>) :
              (<ActivityIndicator animating hidesWhenStopped style={{ marginLeft: 5 }} />)
          }

        </View>
        <View style={{ alignItems: 'center' }} >
          <TouchableOpacity onPress={this.props.onPress} style={{ height: 32, width: 81, margin: 20, borderRadius: 16, backgroundColor: '#1ADF8E', justifyContent: 'center', alignItems: 'center' }} >
            <Text style={{ color: 'white', fontSize: 17, fontWeight: "400" }} >确定</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

interface TaskInformationPopupComponentProps {
  task: TaskModel
  onPress?: (task: TaskModel) => void
}

interface OpenedStoreInformationPopupComponentProps {
  openenStore: OpenedStore
}

class OpenedStoreInformationPopupComponent extends React.Component<OpenedStoreInformationPopupComponentProps, any> {
  constructor(props: OpenedStoreInformationPopupComponentProps) {
    super(props);
  }

  public render() {
    return (
      <View style={{}} >
        <View style={{ flexDirection: 'row', margin: 10 }} >
          <Image source={require('../../assets/images/img_pagoda_store2_74x74.png')} />
          <View style={{ flex: 1, marginLeft: 8, justifyContent: 'space-between' }} >
            <Text style={{ color: '#000000', fontSize: 16 }}>{this.props.openenStore.storeName}（代码：{this.props.openenStore.storeCode}）</Text>
            <Gap />
            <Text style={{ color: '#1ADF8E', fontSize: 14 }} >经营中</Text>
          </View>
        </View>
        <Text style={{ margin: 15, marginTop: 5, fontSize: 15, color: "#000000" }} >{this.props.openenStore.address}</Text>
      </View>
    );
  }
}


interface StateProps {
  onlineOrders?: Array<LatLng>
  profile?: User
}

interface DispatchProps {
  fetchAllOnlineOrders: fetchAllOnlineOrdersActionFunction
}

interface OwnProps {
  navigation: NavigationScreenProp<NavigationRoute>
}

interface OwnState {
  isPopupFilterMenuVisible: boolean
  currentLocation?: LocationModel
  showAllOnlineOrderLayer: boolean
}

const mapStateToProps: MapStateToPropsParam<StateProps, OwnProps, ReduxStore> = (state, ownProps) => {
  const onlineOrders = state.get('onlineOrders').get('data')
  const profile = state.get('profile').get("data")
  return { onlineOrders, profile }
}
const mapDispatchToProps: MapDispatchToPropsParam<DispatchProps, OwnProps> = (dispatch: ThunkDispatch<ReduxStore, null, Action<any>>, ownProps) => {
  return {
    fetchAllOnlineOrders: () => dispatch(fetchAllOnlineOrders())
  }
}
class MapComponent extends React.PureComponent<StateProps & DispatchProps & OwnProps, OwnState> {
  static navigationOptions = {
    header: () => false,
    headerBackTitle: null,
  }

  constructor(props: StateProps & DispatchProps & OwnProps) {
    super(props)
    this.state = {
      isPopupFilterMenuVisible: false,
      showAllOnlineOrderLayer: false,
    }
  }

  private markerCenterOffset = { x: 0, y: -20 }
  private isNeedHandleMapPressEvent = true

  private getCurrentLocation = async () => {
    try {
      const isAuthorized = await GeolocationManager.checkPermission()
      if (isAuthorized === 'undetermined') {
        await GeolocationManager.requestPermission()
      } else if (isAuthorized === 'denied') {
        Alert.alert('温馨提示', '您已禁止获取地理位置权限，请前往设置开启', [{
          text: '前往设置',
          onPress: () => {
            GeolocationManager.goSetting()
          }
        }])
        return
      }
      const location = await GeolocationManager.fetchOne()
      location && this.currentLocationChange(location.longitude, location.latitude)
    } catch (error) {
      Toast.show(error.message, {
        position: Toast.positions.CENTER
      })
    }
  }

  async componentDidMount() {
    this.getCurrentLocation()
  }

  private exitCurrentPage = () => {
    this.props.navigation.goBack()
  }

  private showFilterPopupMenu = () => {
    this.setState({ isPopupFilterMenuVisible: true })
  }

  private hideFilterPopupMenu = () => {
    this.setState({ isPopupFilterMenuVisible: false })
  }

  private currentLocationChange = async (longitude: Number, latitude: Number) => {
    if (!longitude || !latitude) return
    try {
      let currentLocation = { longitude, latitude }
      this.setState({ currentLocation })
      currentLocation = (await reverseGeocode(longitude, latitude))!
      if (currentLocation) this.setState({ currentLocation })
    } catch (error) {
      if (`${error}`.indexOf("timeout") != -1) {
        error = new Error("网络繁忙，请稍后再试")
      } else if (`${error}`.indexOf("Network Error") != -1) {
        error = new Error("网络不可用，请检查网络设置")
      }
      Toast.show(error.message, {
        position: Toast.positions.CENTER
      })
    }

  }

  private onMarkerDragEnd = ({ nativeEvent }: { nativeEvent: LatLng }) => {
    if (this.props.navigation.state.params && this.props.navigation.state.params.intent) this.currentLocationChange(nativeEvent.longitude, nativeEvent.latitude)
  }

  private onSelectNewLocation = (longitude: string, latitude: string) => {
    this.currentLocationChange(parseFloat(longitude), parseFloat(latitude))
  }

  private goStoreSearchPage = () => {
    this.props.navigation.navigate('MapSearch', {
    })
  }

  private onFilterPress = (tag?: string) => {
    if (tag === 'online-order') {
      this.setState({
        showAllOnlineOrderLayer: !this.state.showAllOnlineOrderLayer,
        isPopupFilterMenuVisible: false
      })
      !this.props.onlineOrders && this.props.fetchAllOnlineOrders()
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }} >
        <StatusBar barStyle='dark-content' backgroundColor='white' />
        <MapView zoomLevel={16} tiltEnabled={false} style={{ flex: 1 }} showsCompass={false} coordinate={this.state.currentLocation} showsScale={false} showsZoomControls={false}>
          {
            this.state.currentLocation ?
              (<Marker draggable={true} title='长按拖拽锚点' onDragEnd={this.onMarkerDragEnd} coordinate={this.state.currentLocation} />) :
              null
          }
          {
            this.state.showAllOnlineOrderLayer && this.props.onlineOrders ?
              (<HeatMap coordinates={this.props.onlineOrders as any} opacity={(this.state.showAllOnlineOrderLayer && this.props.onlineOrders) ? 1 : 0} />) :
              null
          }
        </MapView>
        <PopupFilterMenu onCancelPress={this.hideFilterPopupMenu} isVisible={this.state.isPopupFilterMenuVisible} contentViewStyle={{ marginTop: 130 + statusBarHeight }} >
          <PopupFilterMenu.Item selected={this.state.showAllOnlineOrderLayer} inactiveIcon={require('../../assets/images/img_storelight_100x100.png')} activeIcon={require('../../assets/images/img_order_100x100.png')} title='线上订单' onItemPress={this.onFilterPress} tag='online-order' />
        </PopupFilterMenu>
        <View style={{ position: 'absolute', left: 10, justifyContent: 'space-around', top: statusBarHeight + 90 }}>
          <TouchableOpacity onPress={this.showFilterPopupMenu} style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }} >
            <Image source={require('../../assets/images/img_screen_72x72.png')} style={{ marginLeft: 5, marginRight: 5 }} />
          </TouchableOpacity>
        </View>
        <View style={{ position: 'absolute', right: 10, justifyContent: 'space-around', top: statusBarHeight + 90 }}>
          <TouchableOpacity onPress={this.getCurrentLocation} style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }} >
            <Image source={require('../../assets/images/img_my_location_72x72.png')} style={{ marginLeft: 5, marginRight: 5 }} />
          </TouchableOpacity>
        </View>
        <View style={{ position: 'absolute', justifyContent: 'center', width: screenWidth, paddingTop: statusBarHeight, backgroundColor: 'white' }} >
          <MapViewHeaderComponent currentLocation={this.state.currentLocation} fullStyle={true} onSelectNewLocation={this.onSelectNewLocation} onBackPress={this.exitCurrentPage} onSearchClick={(this.props.navigation.state.params ? undefined : this.goStoreSearchPage)} placeholder={this.props.navigation.state.params ? '搜索' : '门店地址/门店名称/门店代码'} />
        </View>
      </View>
    )
  }
}
export default connect<StateProps, DispatchProps, OwnProps, ReduxStore>(mapStateToProps, mapDispatchToProps)(MapComponent)
