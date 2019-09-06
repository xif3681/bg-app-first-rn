import React from 'react'
import { View, StatusBar, Dimensions, TouchableOpacity, Image, Text, Alert, SafeAreaView as RNSafeAreaView, BackHandler, NetInfo } from 'react-native'
import { connect, MapStateToPropsParam, MapDispatchToPropsParam } from 'react-redux'
import { ReduxStore } from '../../reducers'
import { ThunkDispatch } from 'redux-thunk'
import { Action } from 'redux-actions'
import { NavigationScreenProp } from 'react-navigation'
import { NavigationRoute } from 'react-navigation'
import { MapView, Circle, Marker, LatLng, Polygon, Polyline, POI, MultiPoint } from 'react-native-amap3d'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { TaskDraftModel } from '../../types/task-draft'
import PopupFilterMenu from './PopupFilterMenu'
import { isEmpty } from 'lodash'
import { polygonPOISearch } from '../../actions/poi';
import Toast from 'react-native-root-toast';
import { taskDraftValuesChange, taskRemoteCreate, taskRemoteUpdate } from '../../actions/draft';
import Modal from 'react-native-modal';
import { fetchRealEstatePrice } from '../../services/poi-search';
import { BusinessDistrictAddNewPoiComponent } from './BusinessDistrictAddNewPoiComponent';
/// TODO poiinfo 适配iPhone x

const { width: screenWidth } = Dimensions.get('window')
const statusBarHeight = getStatusBarHeight(true)

interface HeaderComponentProps {
  title?: string
  onBackButtonPress?: () => void
  onSavePress?: () => void
  isEdit?: boolean
}

class HeaderComponent extends React.Component<HeaderComponentProps, any> {
  constructor(props: HeaderComponentProps) {
    super(props);
  }

  public render() {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} >
        <TouchableOpacity onPress={this.props.onBackButtonPress} >
          <View style={{ height: 40, width: 40, justifyContent: 'center' }}>
            <Image source={require('../../assets/images/img_back_60x60.png')} />
          </View>
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }} >
          <Text numberOfLines={2}>{this.props.title}</Text>
        </View>
        <TouchableOpacity onPress={this.props.onSavePress} style={{ paddingRight: 10 }} >
          {
            !this.props.isEdit &&
            <View style={{ height: 40, justifyContent: 'center' }}>
              <Text style={{ color: '#1ADF8E' }} >保存草稿</Text>
            </View>

          }

        </TouchableOpacity>
      </View>
    );
  }
}


interface BusinessDistrictEditButtonComponentProps {
  onClearPress?: () => void
  onDeletePress?: () => void
}

class BusinessDistrictEditButtonComponent extends React.Component<BusinessDistrictEditButtonComponentProps, any> {
  constructor(props: BusinessDistrictEditButtonComponentProps) {
    super(props);
  }

  public render() {
    return (
      <View style={{ alignItems: 'flex-end' }} >
        {/* <View style={{ backgroundColor: 'white', justifyContent: 'center', borderRadius: 3, height: 30 }} >
          <Text style={{ marginLeft: 10, marginRight: 10, color: '#1CAFEC' }} >可拖动图标更改地点</Text>
        </View> */}
        <TouchableOpacity onPress={this.props.onClearPress} style={{ height: 31, width: 44, justifyContent: 'center', alignItems: 'center', borderRadius: 5, backgroundColor: '#1CAFEC', marginTop: 10 }} >
          <Text style={{ color: 'white', fontSize: 14 }} >清空</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.props.onDeletePress} style={{ height: 31, width: 44, justifyContent: 'center', alignItems: 'center', borderRadius: 5, backgroundColor: '#1CAFEC', marginTop: 15 }} >
          <Text style={{ color: 'white', fontSize: 14 }} >撤回</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

interface BusinessDistrictOperatorPopupComponentProps {
  isEditing: boolean
  onBeginEditPress: () => void
  onEndEditPress?: () => void
  onNextStepPress?: () => void
}

class BusinessDistrictOperatorPopupComponent extends React.Component<BusinessDistrictOperatorPopupComponentProps, any> {
  constructor(props: BusinessDistrictOperatorPopupComponentProps) {
    super(props);
  }

  private onEditPress = () => {
    if (this.props.isEditing) {
      this.props.onEndEditPress && this.props.onEndEditPress()
    } else {
      this.props.onBeginEditPress && this.props.onBeginEditPress()
    }
  }

  public render() {
    return (
      <RNSafeAreaView>
        <View style={{ flexDirection: 'row', marginBottom: 45 }} >
          <TouchableOpacity onPress={this.onEditPress} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
            <View style={[{ width: 115, height: 36, justifyContent: 'center', alignItems: 'center', borderRadius: 20 }, this.props.isEditing ? { backgroundColor: '#1CAFEC' } : { backgroundColor: 'white', borderColor: '#1CAFEC', borderWidth: 2 }]} >
              <Text style={[this.props.isEditing ? { color: 'white' } : { color: '#1CAFEC' }, { fontSize: 17 }]} >{this.props.isEditing ? '完成编辑' : '编辑商圈'}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity disabled={this.props.isEditing} onPress={this.props.onNextStepPress} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
            <View style={[{ width: 115, height: 36, justifyContent: 'center', alignItems: 'center', borderRadius: 20 }, this.props.isEditing ? { backgroundColor: '#CCCCCC' } : { backgroundColor: '#1ADF8E' }]} >
              <Text style={{ color: 'white', fontSize: 17 }} >下一步</Text>
            </View>
          </TouchableOpacity>
        </View>
      </RNSafeAreaView>
    );
  }
}

interface BusinessDistrictPoiInformationComponentProps {
  onDeleteButtonPress?: (poi: POI) => void
  poi: POI
  isVisible: boolean
  onCancelPress: () => void
}

interface BusinessDistrictPoiInformationComponentStates {
  realEstatePrice?: {
    id: string
    name: string
    number_households: string
    avg_price: string
  }
}

class BusinessDistrictPoiInformationComponent extends React.Component<BusinessDistrictPoiInformationComponentProps, BusinessDistrictPoiInformationComponentStates> {
  constructor(props: BusinessDistrictPoiInformationComponentProps) {
    super(props);

    this.state = {}
  }

  async componentDidMount() {
    if (this.props.poi.type !== 'subdistrict') return
    const realEstatePrice = await fetchRealEstatePrice(this.props.poi)
    this.setState({ realEstatePrice })
  }

  private onDeleteButtonPress = () => {
    this.props.onDeleteButtonPress && this.props.onDeleteButtonPress(this.props.poi)
  }

  public render() {
    let image
    if (this.props.poi.type === 'subdistrict') {
      image = require('../../assets/images/img_house_74x74.png')
    } else if (this.props.poi.type === 'officebuilding') {
      image = require('../../assets/images/img_building_74x74.png')
    } else if (this.props.poi.type === 'market') {
      image = require('../../assets/images/img_market_74x74.png')
    } else if (this.props.poi.type === 'station') {
      image = require('../../assets/images/img_busstation_74x74.png')
    } else if (this.props.poi.type === 'metro') {
      image = require('../../assets/images/img_metro_74x74.png')
    } else if (this.props.poi.type === 'school') {
      image = require('../../assets/images/img_school_74x74.png')
    } else {
      image = require('../../assets/images/img_pagoda_store2_74x74.png')
    }
    const Platform = require('Platform');
    return (
      <Modal onBackdropPress={this.props.onCancelPress} backdropColor='transparent' isVisible={this.props.isVisible} style={{ margin: 0, justifyContent: 'flex-end' }} >
        <RNSafeAreaView style={{ backgroundColor: 'white' }} >
          {
            Platform.OS === 'android' ? <StatusBar barStyle='light-content' backgroundColor='rgba(0, 0, 0, 0.1)' animated={false} /> : null
          }
          <View style={{ flexDirection: 'row', margin: 10 }} >
            <Image source={image} />
            <View style={{ flex: 1, marginLeft: 10, justifyContent: 'center' }} >
              <Text style={{ fontSize: 17, color: "#000000" }} >{this.props.poi.name}</Text>
            </View>
            <TouchableOpacity onPress={this.onDeleteButtonPress} style={{ backgroundColor: 'white', height: 32, width: 81, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderColor: '#E13333', borderWidth: 2, marginLeft: 5 }} >
              <Text style={{ color: '#E13333', fontSize: 17 }} >删除</Text>
            </TouchableOpacity>
          </View>
          {
            this.state.realEstatePrice ?
              (
                <Text style={{ margin: 10, marginTop: 0 }} >{this.state.realEstatePrice.number_households} | {this.state.realEstatePrice.avg_price}</Text>
              ) :
              (
                <Text style={{ margin: 10, marginTop: 0 }} >{this.props.poi.provinceName} {this.props.poi.cityName} {this.props.poi.address}</Text>
              )
          }
          <Text style={{ margin: 10, marginTop: 0, color: '#8F8F8F' }} >数据仅供参考 以实际拓展为准</Text>
        </RNSafeAreaView>
      </Modal>
    );
  }
}


interface StateProps {
  taskDraft?: TaskDraftModel
}

interface DispatchProps {
  polygonPOISearch: (coordinates: Array<LatLng>) => void
  onLocalTaskValueChange: (object: { [key: string]: any }) => void
  createRemoteTask: () => void
  updateRemoteTask: () => void
}

interface OwnProps {
  navigation: NavigationScreenProp<NavigationRoute>
}

interface OwnState {
  polygonCoordinates?: Array<LatLng> | null
  isPoiInformationPopupViewVisible: boolean
  isBusinessDistrictEditing: boolean
  isPopupFilterMenuVisible: boolean

  isSelectingNewPoi: boolean

  selectedNewPoint?: LatLng

  selectedPoi?: POI
  isShowTopView: boolean
  showSubdistrictLayer: boolean
  showOfficebuildingLayer: boolean
  showMarketLayer: boolean
  showBusStationLayer: boolean
  showMetroLayer: boolean
  showSchoolLayer: boolean
}

const mapStateToProps: MapStateToPropsParam<StateProps, OwnProps, ReduxStore> = (state, ownProps) => {
  const taskId = ownProps.navigation.state.params && ownProps.navigation.state.params.taskId
  return {
    taskDraft: state.get('taskDrafts').get(taskId) && state.get('taskDrafts').get(taskId)!.get('data'),
    taskPOIs: state.get('taskPOIs').get(taskId),
  }
}
const mapDispatchToProps: MapDispatchToPropsParam<DispatchProps, OwnProps> = (dispatch: ThunkDispatch<ReduxStore, null, Action<any>>, ownProps) => {
  const taskId = ownProps.navigation.state.params && ownProps.navigation.state.params.taskId
  return {
    onLocalTaskValueChange: (keyValues) => dispatch(taskDraftValuesChange(taskId, keyValues)),
    polygonPOISearch: (coordinates: Array<LatLng>) => dispatch(polygonPOISearch(taskId, coordinates)),
    createRemoteTask: () => dispatch(taskRemoteCreate(taskId)),
    updateRemoteTask: () => dispatch(taskRemoteUpdate(taskId))
  }
}
class BusinessDistrictMapView extends React.Component<StateProps & DispatchProps & OwnProps, OwnState> {
  static navigationOptions = {
    header: () => false,
    headerBackTitle: null,
  }

  private markerCenterOffset = { x: 0, y: -20 }

  constructor(props: StateProps & DispatchProps & OwnProps) {
    super(props)

    this.state = {
      isPoiInformationPopupViewVisible: false,
      isBusinessDistrictEditing: false,
      isPopupFilterMenuVisible: false,
      isShowTopView: true,
      isSelectingNewPoi: false,

      showSubdistrictLayer: false,
      showOfficebuildingLayer: false,
      showMarketLayer: false,
      showBusStationLayer: false,
      showMetroLayer: false,
      showSchoolLayer: false,

      polygonCoordinates: this.props.taskDraft && this.props.taskDraft.businessDistrictPolygon
    }
  }

  private onMapViewPress = ({ nativeEvent }: { nativeEvent: LatLng }) => {
    if (this.state.isBusinessDistrictEditing) {
      const polygonCoordinates = [...(this.state.polygonCoordinates || []), nativeEvent]
      this.setState({ polygonCoordinates })
    } else if (this.state.isSelectingNewPoi) {
      this.setState({ selectedNewPoint: nativeEvent })
    }
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
  }
  onBackAndroid = () => {
    if (this.state.isBusinessDistrictEditing) {
      Alert.alert('提示', "当前未保存辐射商圈，是否确定离开？", [
        {
          text: '确定',
          onPress: () => {
            this.props.navigation.goBack()
          }
        },
        {
          text: '取消',
          style: 'cancel'
        }
      ])
    } else {
      this.props.navigation.goBack()
    }
    return true
  };

  private onDelteTheLastPolygonCoordinatePress = () => {
    if (!this.state.polygonCoordinates) return
    const polygonCoordinates = this.state.polygonCoordinates.filter((_, index, array) => {
      return index < (array.length - 1)
    })
    this.setState({ polygonCoordinates })
  }

  private onClearAllPolygonCoordinatesPress = () => {
    this.setState({ polygonCoordinates: null })
  }

  private exitCurrentPage = () => {
    if (this.state.isBusinessDistrictEditing) {
      Alert.alert('提示', "当前未保存辐射商圈，是否确定离开？", [
        {
          text: '确定',
          onPress: () => {
            this.props.navigation.goBack()
          }
        },
        {
          text: '取消',
          style: 'cancel'
        }
      ])
    } else {
      this.props.navigation.goBack()
    }
  }

  private showAddNewPoiOpeartorView = () => {
    this.setState({
      isSelectingNewPoi: true,
      isPoiInformationPopupViewVisible: false,
      isBusinessDistrictEditing: false,
      isPopupFilterMenuVisible: false
    })
  }

  private hideAddNewPoiOpeartorView = () => {
    this.setState({
      isSelectingNewPoi: false
    })
  }

  private addNewPoi = (poi: POI) => {
    let extraPois = this.props.taskDraft && this.props.taskDraft.extraPois
    if (!extraPois) extraPois = {}
    let pois = (this.props.taskDraft && this.props.taskDraft.extraPois && this.props.taskDraft.extraPois[poi.type]) || []
    extraPois[poi.type] = [...pois, poi]
    this.props.onLocalTaskValueChange({ extraPois })
    this.setState({
      isSelectingNewPoi: false
    })
  }

  private beginEditBusinessDistrict = () => {
    this.setState({ isBusinessDistrictEditing: true })
  }

  private endEditBusinessDistrict = async () => {
    if (isEmpty(this.state.polygonCoordinates)) {
      this.setState({ isBusinessDistrictEditing: false })
      this.props.onLocalTaskValueChange({ 'businessDistrictPolygon': this.state.polygonCoordinates! })
      return
    }
    Alert.alert('获取商圈地标？', undefined, [
      {
        text: '确定',
        onPress: () => {

          NetInfo.isConnected.fetch().then((isConnected: boolean) => {
            if (isConnected) {
              this.props.onLocalTaskValueChange({ 'businessDistrictPolygon': this.state.polygonCoordinates! })
              this.props.polygonPOISearch(this.state.polygonCoordinates!)
              this.setState({ isBusinessDistrictEditing: false, showBusStationLayer: true, showSubdistrictLayer: true, showMarketLayer: true, showMetroLayer: true, showOfficebuildingLayer: true, showSchoolLayer: true })
            } else {
              Toast.show("当前无网络，请检查网络设置", { position: Toast.positions.CENTER })
            }
          })

        }
      },
      {
        text: '取消',
        style: 'cancel',
        onPress: () => {
          this.setState({ isBusinessDistrictEditing: false })
        }
      }
    ])
  }

  private onContinuteEditReportPress = () => {
    this.props.navigation.state.params && this.props.navigation.state.params.taskId && this.props.navigation.navigate('TaskFormOne', {
      taskId: this.props.navigation.state.params.taskId,
      fromAdd: this.props.navigation.state.params.fromAdd
    })
  }

  private showPOIFilterPopupMenu = () => {
    if (isEmpty(this.state.polygonCoordinates)) {
      Toast.show('请先划定商圈', {
        position: Toast.positions.BOTTOM
      })
      return
    }
    this.setState({ isPopupFilterMenuVisible: true })
  }

  private hidePOIFilterPopupMenu = () => {
    this.setState({ isPopupFilterMenuVisible: false })
  }

  private hidePoiInformationPopupView = () => {
    this.setState({ isPoiInformationPopupViewVisible: false })
  }

  private onDeletePOIPress = (poi: POI) => {
    Alert.alert('', `确定删除 "${poi.name}"`, [
      {
        text: '确定',
        onPress: () => {
          if (!this.props.taskDraft!.pois || isEmpty(poi)) return
          if (poi.source !== "manual") {
            const typedPois = this.props.taskDraft!.pois[poi.type]
            if (!typedPois || !typedPois.length) return
            const newTypedPois = typedPois.filter(typedPoi => {
              return typedPoi !== poi
            })
            const pois = {
              ...this.props.taskDraft!.pois,
              [poi.type]: newTypedPois
            }
            this.props.onLocalTaskValueChange({ pois })
          } else {
            const typedExtraPois = this.props.taskDraft!.extraPois[poi.type]
            if (!typedExtraPois || !typedExtraPois.length) return
            const newTypedExtraPois = typedExtraPois.filter(typedExtraPoi => {
              return typedExtraPoi !== poi
            })
            const extraPois = {
              ...this.props.taskDraft!.extraPois,
              [poi.type]: newTypedExtraPois
            }
            this.props.onLocalTaskValueChange({ extraPois })
          }
          this.setState({ isPoiInformationPopupViewVisible: false })
        }
      },
      {
        text: '取消',
        style: 'cancel'
      }
    ])
  }

  private onPOIFilterItemPress = (tag?: string) => {
    if (tag === 'new-poi') {
      this.showAddNewPoiOpeartorView()
    } else if (isEmpty(this.state.polygonCoordinates)) {
      Toast.show('请先划定商圈', {
        position: Toast.positions.BOTTOM
      })
    } else if (tag === 'subdistrict') {
      this.setState({ showSubdistrictLayer: !this.state.showSubdistrictLayer })
    } else if (tag === 'officebuilding') {
      this.setState({ showOfficebuildingLayer: !this.state.showOfficebuildingLayer })
    } else if (tag === 'market') {
      this.setState({ showMarketLayer: !this.state.showMarketLayer })
    } else if (tag === 'busStation') {
      this.setState({ showBusStationLayer: !this.state.showBusStationLayer })
    } else if (tag === 'metro') {
      this.setState({ showMetroLayer: !this.state.showMetroLayer })
    } else if (tag === 'school') {
      this.setState({ showSchoolLayer: !this.state.showSchoolLayer })
    }
  }

  private saveTasks = () => {
    if (this.props.taskDraft!.createdAt) {
      this.props.updateRemoteTask()
    } else {
      this.props.createRemoteTask()
    }
  }

  private onPointItemPressCallbackCreater = (selectedPoi: any) => () => {
    this.setState({ isPoiInformationPopupViewVisible: true, selectedPoi })
  }

  private onPolylinePointDragEndCallbackCreater = (coordinate: LatLng) => ({ nativeEvent }: { nativeEvent: LatLng }) => {
    const polygonCoordinates = this.state.polygonCoordinates && this.state.polygonCoordinates.map(polygonCoordinate => {
      return (polygonCoordinate.latitude === coordinate.latitude && polygonCoordinate.longitude === coordinate.longitude) ? nativeEvent : polygonCoordinate
    })
    this.setState({ polygonCoordinates })
  }

  private closeTopView = () => {
    this.setState({
      isShowTopView: false
    })
  }

  private extractPoisFromTask = (key: string): Array<POI> => {
    let pois = (this.props.taskDraft && this.props.taskDraft.pois && this.props.taskDraft.pois[key]) || []
    const manualAddedPois = (this.props.taskDraft && this.props.taskDraft.extraPois && this.props.taskDraft.extraPois[key]) || []
    return pois.concat(manualAddedPois)
  }

  render() {
    let subdistrictPois
    if (this.state.showSubdistrictLayer) {
      subdistrictPois = this.extractPoisFromTask('subdistrict')
    }

    let officebuildingPois
    if (this.state.showOfficebuildingLayer) {
      officebuildingPois = this.extractPoisFromTask('officebuilding')
    }

    let marketPois
    if (this.state.showMarketLayer) {
      marketPois = this.extractPoisFromTask('market')
    }

    let busStationPois
    if (this.state.showBusStationLayer) {
      busStationPois = this.extractPoisFromTask('bus-station')
    }

    let metroPois
    if (this.state.showMetroLayer) {
      metroPois = this.extractPoisFromTask('metro')
    }

    let schoolPois
    if (this.state.showSchoolLayer) {
      schoolPois = this.extractPoisFromTask('school')
    }

    return (
      <View style={{ flex: 1 }} >
        <StatusBar barStyle='dark-content' backgroundColor='white' />
        <MapView showsScale={false} zoomLevel={16} onPress={this.onMapViewPress} coordinate={this.props.taskDraft && this.props.taskDraft.location} tiltEnabled={false} style={{ flex: 1 }} showsCompass={false} showsZoomControls={false}>
          {
            this.props.taskDraft ?
              (
                <Marker image='img_task_66x80' centerOffset={this.markerCenterOffset} clickDisabled coordinate={this.props.taskDraft && this.props.taskDraft.location} />
              ) :
              null
          }
          {
            this.state.isSelectingNewPoi && this.state.selectedNewPoint ?
              (
                <Marker clickDisabled coordinate={this.state.selectedNewPoint} />
              ) :
              null
          }
          {
            this.props.taskDraft ?
              (
                <Circle coordinate={this.props.taskDraft && this.props.taskDraft.location} fillColor='rgba(26, 223, 142, 0.3)' radius={500} />
              ) :
              null
          }
          {
            this.state.polygonCoordinates && this.state.polygonCoordinates.map(polygonCoordinate => {
              return (<Marker infoWindowDisabled draggable={this.state.isBusinessDistrictEditing} onDragEnd={this.onPolylinePointDragEndCallbackCreater(polygonCoordinate)} key={`${polygonCoordinate.latitude},${polygonCoordinate.longitude}, ${Math.random()}`} coordinate={polygonCoordinate} image='img_dot_40x40' />)
            })
          }
          {
            this.state.isBusinessDistrictEditing && this.state.polygonCoordinates && this.state.polygonCoordinates.length ?
              (
                <Polyline coordinates={this.state.polygonCoordinates} width={3} color='#1CAFEC' />
              ) :
              null
          }
          {
            !this.state.isBusinessDistrictEditing && this.state.polygonCoordinates && this.state.polygonCoordinates.length ?
              (
                <Polygon coordinates={this.state.polygonCoordinates} strokeWidth={3} strokeColor='#1CAFEC' fillColor='rgba(62, 194, 250, 0.3)' />
              ) :
              null
          }
          {
            subdistrictPois && subdistrictPois.length ?
              (
                subdistrictPois.map(subdistrictPoi => {
                  return (<Marker infoWindowDisabled image='img_house_40x40' key={subdistrictPoi.uid || subdistrictPoi.name} onPress={this.onPointItemPressCallbackCreater(subdistrictPoi)} coordinate={subdistrictPoi} />)
                })
                // <MultiPoint key={`subdistrict${subdistrictPois.length}`} image='img_house_40x40' onItemPress={this.onMultipointItemPress} points={subdistrictPois} />
              ) :
              null
          }
          {
            officebuildingPois && officebuildingPois.length ?
              (
                officebuildingPois.map(officebuildingPoi => {
                  return (<Marker infoWindowDisabled image='img_building_40x40' key={officebuildingPoi.uid || officebuildingPoi.name} onPress={this.onPointItemPressCallbackCreater(officebuildingPoi)} coordinate={officebuildingPoi} />)
                })
                // <MultiPoint key={`officebuilding${officebuildingPois.length}`} image='img_building_40x40' onItemPress={this.onMultipointItemPress} points={officebuildingPois} />
              ) :
              null
          }
          {
            marketPois && marketPois.length ?
              (
                marketPois.map(marketPoi => {
                  return (<Marker infoWindowDisabled image='img_market_40x40' key={marketPoi.uid || marketPoi.name} onPress={this.onPointItemPressCallbackCreater(marketPoi)} coordinate={marketPoi} />)
                })
                // <MultiPoint key={`market${marketPois.length}`} image='img_market_40x40' onItemPress={this.onMultipointItemPress} points={marketPois} />
              ) :
              null
          }
          {
            busStationPois && busStationPois.length ?
              (
                busStationPois.map(busStationPoi => {
                  return (<Marker infoWindowDisabled image='img_busstation_40x40' key={busStationPoi.uid || busStationPoi.name} onPress={this.onPointItemPressCallbackCreater(busStationPoi)} coordinate={busStationPoi} />)
                })
                // <MultiPoint key={`busStation${busStationPois.length}`} image='img_busstation_40x40' onItemPress={this.onMultipointItemPress} points={busStationPois} />
              ) :
              null
          }
          {
            metroPois && metroPois.length ?
              (
                metroPois.map(metroPoi => {
                  return (<Marker infoWindowDisabled image='img_metro_40x40' key={metroPoi.uid || metroPoi.name} onPress={this.onPointItemPressCallbackCreater(metroPoi)} coordinate={metroPoi} />)
                })
                // <MultiPoint key={`metro${metroPois.length}`} image='img_metro_40x40' onItemPress={this.onMultipointItemPress} points={metroPois} />
              ) :
              null
          }
          {
            schoolPois && schoolPois.length ?
              (
                schoolPois.map(schoolPoi => {
                  return (<Marker infoWindowDisabled image='img_school_40x40' key={schoolPoi.uid || schoolPoi.name} onPress={this.onPointItemPressCallbackCreater(schoolPoi)} coordinate={schoolPoi} />)
                })
                // <MultiPoint key={`schllo${schoolPois.length}`} image='img_school_40x40' onItemPress={this.onMultipointItemPress} points={schoolPois} />
              ) :
              null
          }
        </MapView>
        <PopupFilterMenu onCancelPress={this.hidePOIFilterPopupMenu} isVisible={this.state.isPopupFilterMenuVisible} contentViewStyle={{ marginTop: 135 + statusBarHeight }} >
          <PopupFilterMenu.Item inactiveIcon={require('../../assets/images/img_housedark_60x60.png')} activeIcon={require('../../assets/images/img_house_60x60.png')} onItemPress={this.onPOIFilterItemPress} title='小区' selected={this.state.showSubdistrictLayer} tag='subdistrict' />
          <PopupFilterMenu.Item inactiveIcon={require('../../assets/images/img_buildingdark_60x60.png')} activeIcon={require('../../assets/images/img_building_60x60.png')} onItemPress={this.onPOIFilterItemPress} title='办公楼' selected={this.state.showOfficebuildingLayer} tag='officebuilding' />
          <PopupFilterMenu.Item inactiveIcon={require('../../assets/images/img_marketdark_60x60.png')} activeIcon={require('../../assets/images/img_market_60x60.png')} onItemPress={this.onPOIFilterItemPress} title='引流商超' selected={this.state.showMarketLayer} tag='market' />
          <PopupFilterMenu.Item inactiveIcon={require('../../assets/images/img_busstationdark_60x60.png')} activeIcon={require('../../assets/images/img_busstation_60x60.png')} onItemPress={this.onPOIFilterItemPress} title='公交站' selected={this.state.showBusStationLayer} tag='busStation' />
          <PopupFilterMenu.Item inactiveIcon={require('../../assets/images/img_metrodark_60x60.png')} activeIcon={require('../../assets/images/img_metro_60x60.png')} onItemPress={this.onPOIFilterItemPress} title='地铁站' selected={this.state.showMetroLayer} tag='metro' />
          <PopupFilterMenu.Item inactiveIcon={require('../../assets/images/img_schooldark_60x60.png')} activeIcon={require('../../assets/images/img_school_60x60.png')} onItemPress={this.onPOIFilterItemPress} title='学校' selected={this.state.showSchoolLayer} tag='school' />
          <PopupFilterMenu.Item inactiveIcon={require('../../assets/images/img_add_llocation_60x60.png')} activeIcon={require('../../assets/images/img_add_llocation_60x60.png')} onItemPress={this.onPOIFilterItemPress} title='新增地标' selected={true} tag='new-poi' />
        </PopupFilterMenu>
        <View style={{ position: 'absolute', width: screenWidth, paddingTop: statusBarHeight, backgroundColor: 'white' }} >
          <HeaderComponent title={this.props.taskDraft && this.props.taskDraft.name || '编辑商圈'} onSavePress={this.saveTasks} onBackButtonPress={this.exitCurrentPage} isEdit={this.state.isBusinessDistrictEditing} />
        </View>
        {
          this.state.isShowTopView ? (<View style={{ position: 'absolute', width: screenWidth, marginTop: statusBarHeight + 40, backgroundColor: '#FFFABD', padding: 10, display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ fontSize: 14, color: "#A58112", flex: 1, marginLeft: 10 }}>{this.state.isBusinessDistrictEditing ? "可拖动图标更改地点" : this.state.isSelectingNewPoi ? "请选取新增地标的位置" : "可点击“编辑商圈”绘制商圈范围"}</Text>
            {/* <TouchableOpacity onPress={this.closeTopView}>
              <Image source={require('../../assets/images/img_close_28x28.png')} ></Image>
            </TouchableOpacity> */}
          </View>) : null
        }

        {
          !this.state.isBusinessDistrictEditing ?
            (<View style={{ position: 'absolute', left: 10, justifyContent: 'space-around', top: statusBarHeight + 90 }}>
              <TouchableOpacity onPress={this.showPOIFilterPopupMenu} style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }} >
                <Image source={require('../../assets/images/img_screen_72x72.png')} style={{ marginLeft: 5, marginRight: 5 }} />
              </TouchableOpacity>
            </View>) :
            null
        }
        {
          this.state.isBusinessDistrictEditing ?
            (
              <View style={{ position: 'absolute', right: 10, justifyContent: 'space-around', top: statusBarHeight + 80 }}>
                <BusinessDistrictEditButtonComponent onClearPress={this.onClearAllPolygonCoordinatesPress} onDeletePress={this.onDelteTheLastPolygonCoordinatePress} />
              </View>
            ) :
            null
        }
        <View style={{ position: 'absolute', bottom: 0, width: screenWidth }} >
          {
            this.state.isSelectingNewPoi ?
              (
                <BusinessDistrictAddNewPoiComponent poi={this.state.selectedNewPoint} onCancelPress={this.hideAddNewPoiOpeartorView} onConfirmPress={this.addNewPoi} />
              ) :
              (
                <BusinessDistrictOperatorPopupComponent onNextStepPress={this.onContinuteEditReportPress} onBeginEditPress={this.beginEditBusinessDistrict} onEndEditPress={this.endEditBusinessDistrict} isEditing={this.state.isBusinessDistrictEditing} />
              )
          }
        </View>
        <View style={{ position: 'absolute', bottom: 0, width: screenWidth, backgroundColor: 'white' }} >
          {
            this.state.isPoiInformationPopupViewVisible && this.state.selectedPoi ?
              (
                <BusinessDistrictPoiInformationComponent onCancelPress={this.hidePoiInformationPopupView} isVisible={this.state.isPoiInformationPopupViewVisible} poi={this.state.selectedPoi} onDeleteButtonPress={this.onDeletePOIPress} />
              ) :
              null
          }
        </View>
      </View>
    )
  }
}
export default connect<StateProps, DispatchProps, OwnProps, ReduxStore>(mapStateToProps, mapDispatchToProps)(BusinessDistrictMapView)