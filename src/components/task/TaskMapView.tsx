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
  intentionMapStores?: Array<IntentionStoreModel>
  tasks?: Array<TaskModel>
  openedStores?: Array<OpenedStore>
  taskDraft?: TaskDraftModel
  profile?: User
}

interface DispatchProps {
  fetchTasks: FetchTasksActionFunction
  fetchAllOpenedStores: FetchAllOpenedStoresActionFunction
  fetchAllOnlineOrders: fetchAllOnlineOrdersActionFunction
  intentionShopsList: IntentionShopsListActionFunction
  onLocalTaskValueChange: (object: { [key: string]: any }) => void
}

interface OwnProps {
  navigation: NavigationScreenProp<NavigationRoute>
}

interface OwnState {
  isPopupFilterMenuVisible: boolean
  isTaskInformationPopupVisisble: boolean
  isPoiInformationPopupVisible: boolean
  isOpenedStoreInformationPopupVisible: boolean
  selectedIntentionStore?: IntentionStoreModel
  currentLocation?: LocationModel
  selectedTask?: TaskModel
  selectedOpenedStore?: OpenedStore
  isShowTopView: boolean
  showTasksLayer: boolean
  showAllOpenedStoreLayer: boolean
  showIntentionStoreLayer: boolean
}

const mapStateToProps: MapStateToPropsParam<StateProps, OwnProps, ReduxStore> = (state, ownProps) => {
  const taskId = ownProps.navigation.state.params && ownProps.navigation.state.params.taskId
  const tasks = state.get('tasks').get('data')
  const openedStores = state.get('openedStores').get('data')
  const taskDraft = state.get('taskDrafts').get(taskId) && state.get('taskDrafts').get(taskId)!.get('data')
  const intentionMapStores = state.get('intentionMapStores').get("data")
  const profile = state.get('profile').get("data")
  return { tasks, openedStores, taskDraft, intentionMapStores, profile }
}
const mapDispatchToProps: MapDispatchToPropsParam<DispatchProps, OwnProps> = (dispatch: ThunkDispatch<ReduxStore, null, Action<any>>, ownProps) => {
  const taskId = ownProps.navigation.state.params && ownProps.navigation.state.params.taskId
  return {
    onLocalTaskValueChange: (keyValues) => dispatch(taskDraftValuesChange(taskId, keyValues)),
    intentionShopsList: () => dispatch(intentionShopsList()),
    fetchTasks: () => dispatch(fetchTasks()),
    fetchAllOpenedStores: () => dispatch(fetchAllOpenedStores()),
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
      isPoiInformationPopupVisible: !!(props.taskDraft && props.taskDraft.location),
      isTaskInformationPopupVisisble: false,
      isOpenedStoreInformationPopupVisible: false,
      isShowTopView: true,
      showTasksLayer: true,
      showAllOpenedStoreLayer: false,
      showIntentionStoreLayer: false,

      currentLocation: props.taskDraft && props.taskDraft.location
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
    if (!(this.props.taskDraft && this.props.taskDraft.location)) { /// 修改草稿，用草稿的位置
      this.getCurrentLocation()
    }
    this.props.fetchTasks()
    this.props.intentionShopsList()
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
      this.setState({ currentLocation, isPoiInformationPopupVisible: true })
      currentLocation = (await reverseGeocode(longitude, latitude))!
      if (currentLocation) this.setState({ currentLocation, isPoiInformationPopupVisible: true, isOpenedStoreInformationPopupVisible: false, isTaskInformationPopupVisisble: false })
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

  private onMapViewPress = async ({ nativeEvent }: { nativeEvent: LatLng }) => {
    this.isNeedHandleMapPressEvent && this.props.navigation.state.params && this.props.navigation.state.params.intent && this.currentLocationChange(nativeEvent.longitude, nativeEvent.latitude)
    this.isNeedHandleMapPressEvent = true
  }

  private onMarkerDragEnd = ({ nativeEvent }: { nativeEvent: LatLng }) => {
    if (this.props.navigation.state.params && this.props.navigation.state.params.intent) this.currentLocationChange(nativeEvent.longitude, nativeEvent.latitude)
  }

  private onSelectNewLocation = (longitude: string, latitude: string) => {
    this.currentLocationChange(parseFloat(longitude), parseFloat(latitude))
  }

  private goStoreSearchPage = () => {
    this.props.navigation.navigate('MapSearch', {
      onOpenedStoreSelected: this.onOpendStoreSelected
    })
  }

  private onPoiInformationConfirmPress = () => {
    const location = this.state.currentLocation!
    if (this.props.navigation.state.params && this.props.navigation.state.params.intent === 'task') {
      const taskId = this.props.navigation.state.params && this.props.navigation.state.params.taskId
      if (!taskId) {
        Toast.show('创建任务失败，请稍后重试', {
          position: Toast.positions.CENTER
        })
        return
      }
      const changedValue: Partial<TaskModel> = { location }
      if (this.props.taskDraft && this.props.taskDraft.location && this.props.taskDraft.location.formattedAddress &&
        this.props.taskDraft.name.indexOf(this.props.taskDraft.location.formattedAddress) !== -1) {
        changedValue.name = location.formattedAddress
      }
      this.props.onLocalTaskValueChange(changedValue)
      this.props.navigation.navigate('BusinessDistrictMapView', { taskId, fromAdd: true })
    } else if (this.props.navigation.state.params && this.props.navigation.state.params.intent === 'intention-store') {
      this.props.navigation.navigate('IntentionStore', {
        location
      })
    }
  }

  private onFilterPress = (tag?: string) => {
    if (tag === 'tasks') {
      this.setState({
        showTasksLayer: !this.state.showTasksLayer,
        isPopupFilterMenuVisible: false
      })
    } else if (tag === 'intention-store') {
      this.setState({
        showIntentionStoreLayer: !this.state.showIntentionStoreLayer
      })
    } else if (tag === 'all-store') {
      this.setState({
        showAllOpenedStoreLayer: !this.state.showAllOpenedStoreLayer,
        isPopupFilterMenuVisible: false
      })
      !this.props.openedStores && this.props.fetchAllOpenedStores()
    }
  }

  private onTaskInformationAnnotationPressCallbackCreater = (selectedTask: TaskModel) => () => {
    this.setState({
      selectedIntentionStore: undefined,
      selectedTask,
      isPoiInformationPopupVisible: false,
      isTaskInformationPopupVisisble: true,
      isOpenedStoreInformationPopupVisible: false,
    })
  }


  private onIntentionInformationAnnotationPressCallbackCreater = (selectedIntentionStore: IntentionStoreModel) => () => {
    this.setState({
      selectedTask: undefined,
      selectedIntentionStore,
      isPoiInformationPopupVisible: false,
      isTaskInformationPopupVisisble: true,
      isOpenedStoreInformationPopupVisible: false,
    })
  }

  private closeTopView = () => {
    this.setState({
      isShowTopView: false
    })
  }

  private onOpendStoreSelected = (selectedOpenedStore: any) => {
    this.isNeedHandleMapPressEvent = false
    this.setState({
      selectedOpenedStore,
      isOpenedStoreInformationPopupVisible: true,
      isPoiInformationPopupVisible: false,
      isTaskInformationPopupVisisble: false,
      currentLocation: { longitude: selectedOpenedStore.longitude, latitude: selectedOpenedStore.latitude }
    })
  }

  private onShowMoreTaskInformationPress = (task: TaskModel) => {
    this.props.navigation.navigate('ReportProfile', { taskId: task._id })
  }

  private onShowIntentionStorePress = (intentionStore: IntentionStoreModel) => {
    this.props.navigation.navigate('IntentionStoreDetail', {
      task: intentionStore,
      userId: "0"
    })
  }

  render() {
    return (
      <View style={{ flex: 1 }} >
        <StatusBar barStyle='dark-content' backgroundColor='white' />
        <MapView zoomLevel={16} tiltEnabled={false} style={{ flex: 1 }} showsCompass={false} onPress={this.onMapViewPress} coordinate={this.state.currentLocation} showsScale={false} showsZoomControls={false}>
          {
            this.state.currentLocation ?
              (<Marker draggable={true} title='长按拖拽锚点' onDragEnd={this.onMarkerDragEnd} coordinate={this.state.currentLocation} />) :
              null
          }
          {
            this.state.showTasksLayer && this.props.tasks && this.props.tasks.map(task => {
              return (task.location && <Marker centerOffset={this.markerCenterOffset} onPress={this.onTaskInformationAnnotationPressCallbackCreater(task)} image={this.state.selectedTask && this.state.selectedTask.location === task.location ? 'img_padoda_store_66x80' : 'img_opened_strore_66x80'} infoWindowDisabled={true} key={task._id} coordinate={task.location!} />)
            })
          }
          {
            this.state.showTasksLayer && this.props.intentionMapStores && this.props.intentionMapStores.map(intentionShop => {
              return (<Marker centerOffset={this.markerCenterOffset} onPress={this.onIntentionInformationAnnotationPressCallbackCreater(intentionShop)} image={this.state.selectedIntentionStore && this.state.selectedIntentionStore.location === intentionShop.location ? 'img_padoda_store_66x80' : 'img_unopen_store_66x80'} infoWindowDisabled={true} key={intentionShop._id} coordinate={intentionShop.location!} />)
            })
          }
          {
            this.state.showAllOpenedStoreLayer && this.props.openedStores ?
              (<MultiPoint onItemPress={this.onOpendStoreSelected} image='img_store_66x80' points={this.props.openedStores as any} />) :
              null
          }
        </MapView>
        <PopupFilterMenu onCancelPress={this.hideFilterPopupMenu} isVisible={this.state.isPopupFilterMenuVisible} contentViewStyle={{ marginTop: 130 + statusBarHeight }} >
          <PopupFilterMenu.Item selected={this.state.showTasksLayer} inactiveIcon={require('../../assets/images/img_tasklight_100x100.png')} activeIcon={require('../../assets/images/img_task_100x100.png')} title='我的任务' onItemPress={this.onFilterPress} tag='tasks' />
          {/* <PopupFilterMenu.Item selected={this.state.showIntentionStoreLayer} inactiveIcon={require('../../assets/images/img_storelight_100x100.png')} activeIcon={require('../../assets/images/img_order_100x100.png')} title='意向店' onItemPress={this.onFilterPress} tag='intention-store' /> */}
          <PopupFilterMenu.Item selected={this.state.showAllOpenedStoreLayer} inactiveIcon={require('../../assets/images/img_orderlight_100x100.png')} activeIcon={require('../../assets/images/img_store_100x100.png')} title='所有门店' onItemPress={this.onFilterPress} tag='all-store' />
          {/* <PopupFilterMenu.Item selected={this.state.showAllOnlineOrderLayer} inactiveIcon={require('../../assets/images/img_storelight_100x100.png')} activeIcon={require('../../assets/images/img_order_100x100.png')} title='线上订单' onItemPress={this.onFilterPress} tag='online-order' /> */}
        </PopupFilterMenu>
        {
          this.state.isShowTopView ?
            (
              <View style={{ position: 'absolute', width: screenWidth, marginTop: statusBarHeight + 50, backgroundColor: '#FFFABD', padding: 10, display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ fontSize: 14, color: "#A58112", flex: 1, marginLeft: 10 }}>{this.props.navigation.state.params ? "请选取任务坐标位置" : "这里可查看个人拓展的所有任务分布"}</Text>
                {/* <TouchableOpacity onPress={this.closeTopView}>
                  <Image source={require('../../assets/images/img_close_28x28.png')} ></Image>
                </TouchableOpacity> */}
              </View>
            ) : null
        }
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
        <View style={{ position: 'absolute', bottom: 0, width: screenWidth, backgroundColor: 'white' }} >
          {
            this.state.isPoiInformationPopupVisible && this.props.navigation.state.params && this.props.navigation.state.params.intent && this.state.currentLocation && this.state.currentLocation.formattedAddress ?
              (
                <PoiInfoPopupComponent onPress={this.onPoiInformationConfirmPress} location={this.state.currentLocation} />
              ) : null
          }
          {
            this.state.isTaskInformationPopupVisisble && this.state.selectedTask ?
              (
                <TaskInformationPopupComponent key={this.state.selectedTask._id} onPress={this.onShowMoreTaskInformationPress} task={this.state.selectedTask!} />
              ) : null
          }
          {
            this.state.isTaskInformationPopupVisisble && this.state.selectedIntentionStore ?
              (
                <TaskInformationPopupComponent key={this.state.selectedIntentionStore._id} onIntentionStorePress={this.onShowIntentionStorePress} intentionStore={this.state.selectedIntentionStore!} />
              ) : null
          }
          {
            this.state.isOpenedStoreInformationPopupVisible && this.state.selectedOpenedStore ?
              (
                <OpenedStoreInformationPopupComponent openenStore={this.state.selectedOpenedStore} />
              ) : null
          }
        </View>
      </View>
    )
  }
}
export default connect<StateProps, DispatchProps, OwnProps, ReduxStore>(mapStateToProps, mapDispatchToProps)(MapComponent)
