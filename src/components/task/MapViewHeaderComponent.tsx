import { throttle } from 'lodash';
import React from 'react';
import { ActivityIndicator, Image, Text, TextInput, TouchableOpacity, View, StatusBar, Platform } from 'react-native';
import Modal from 'react-native-modal';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { poiSearch, SearchedPoi } from '../../services/poi-search';
import { LocationModel } from '../../services/reverse-geocode'

const statusBarHeight = getStatusBarHeight(true)

interface PoiItemProps {
  poi: SearchedPoi
  onPress?: (poi: SearchedPoi) => void
}

class PoiItem extends React.Component<PoiItemProps, any> {
  constructor(props: PoiItemProps) {
    super(props);
  }

  private onPress = () => {
    this.props.onPress && this.props.onPress(this.props.poi)
  }

  public render() {
    return (
      <TouchableOpacity onPress={this.onPress} style={{ margin: 10, display: "flex", flexDirection: "row",width:300 }} >
        <Text style={{ color: "#000000", fontSize: 16 }}>{this.props.poi.name}</Text>
        <Text style={{ marginLeft: 5, fontSize: 16, color: "#aaaaaa",flex:1}} numberOfLines={1} >{this.props.poi.pname}{this.props.poi.cityname}{this.props.poi.adname}</Text>
      </TouchableOpacity>
    );
  }
}

interface MapPoiSearchComponentProps {
  onLocationSelect?: (location: SearchedPoi) => void
  placeholder?: string
  onBackPress?: () => void
  location:string
}

interface MapPoiSearchComponentStates {
  searchedPois?: Array<SearchedPoi>
  isSearch: boolean,
}

class MapPoiSearchComponent extends React.Component<MapPoiSearchComponentProps, MapPoiSearchComponentStates> {
  constructor(props: MapPoiSearchComponentProps) {
    super(props);
    this.state = {
      searchedPois: [],
      isSearch: false
    }
  }

  private fetchPoiInfo?: (text: string) => Promise<Array<SearchedPoi>>

  private onChangeText = async (text: string) => {
    if (!this.fetchPoiInfo) {
      this.fetchPoiInfo = throttle(async (text: string) => {
        return poiSearch(text,this.props.location)
      }, 500)
    }
    this.setState({ isSearch: true })
    const searchedPois = await this.fetchPoiInfo(text)
    this.setState({ searchedPois, isSearch: false })
  }

  public render() {
    return (
      <View>
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, paddingLeft: 5, paddingBottom: 0 }} >
          <TouchableOpacity onPress={this.props.onBackPress} >
            <View style={{ height: 40, width: 30, justifyContent: 'center' }}>
              <Image source={require('../../assets/images/img_back_60x60.png')} />
            </View>
          </TouchableOpacity>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', marginLeft: 5, borderRadius: 2 }} >
            <Image source={require('../../assets/images/img_search_36x36.png')} style={{ marginLeft: 9, marginRight: 10, width: 17, height: 18 }} />
            <TextInput autoFocus={true} onChangeText={this.onChangeText} placeholder={this.props.placeholder || '搜索'} style={{ height: 40, flex: 1, fontSize: 17, color: "#000000" }} />
            {
              this.state.isSearch ?
                (<ActivityIndicator animating={true} style={{ marginRight: 5 }} />) :
                null
            }
          </View>
        </View>
        <View style={{ backgroundColor: 'white', marginLeft: 40, marginRight: 10 }} >
          {
            this.state.searchedPois && this.state.searchedPois.map((poi, index) => {
              return (<PoiItem poi={poi} key={`${index}`} onPress={this.props.onLocationSelect} />)
            })
          }
        </View>
      </View>
    );
  }
}

interface MapViewHeaderProps {
  onBackPress?: () => void
  onAddTaskPress?: () => void
  onSearchClick?: () => void
  onBlur?: Function
  fullStyle?:boolean
  onSelectNewLocation?: (longitude: string, latitude: string) => void,
  placeholder?: string
  currentLocation?:LocationModel
}

interface MapViewHeaderStates {
  isSearchComponentVisible: boolean,
  searchKey?: string
}

export default class MapViewHeader extends React.Component<MapViewHeaderProps, MapViewHeaderStates> {
  constructor(props: MapViewHeaderProps) {
    super(props);
    this.state = {
      isSearchComponentVisible: false
    }
  }

  private showPoiSearchPage = () => {
    this.setState({ isSearchComponentVisible: true })
  }
  hide() {
    this.setState({ isSearchComponentVisible: false });
  }

  private hidePoiSearchPage = () => {
    this.setState({ isSearchComponentVisible: false })
  }

  private onSelectNewLocation = (searchedPoi: SearchedPoi) => {
    const [longitude, latitude] = searchedPoi.location.split(',')
    if (longitude && latitude && this.props.onSelectNewLocation) {
      this.props.onSelectNewLocation(longitude, latitude)
      this.setState({ isSearchComponentVisible: false, searchKey: searchedPoi.address })
    }
  }
  private onBackExit = () => {
    this.setState({
      isSearchComponentVisible: false
    })
    this.props.onBackPress!()
  }


  public render() {
    return (
      <View>
        <Modal animationIn='fadeIn' animationOut='fadeOut' backdropOpacity={0.1} onBackdropPress={this.hidePoiSearchPage} isVisible={this.state.isSearchComponentVisible} style={{ marginLeft: 0, marginRight: 0, justifyContent: 'flex-start', marginTop: statusBarHeight }} onBackButtonPress={this.hide.bind(this)}>
          {
            Platform.OS === 'android' ? <StatusBar barStyle='light-content' backgroundColor='rgba(0, 0, 0, 0.1)' animated={false} /> : null
          }
          <MapPoiSearchComponent placeholder={this.state.searchKey} onLocationSelect={this.onSelectNewLocation} onBackPress={this.onBackExit} location={this.props.currentLocation ? `${this.props.currentLocation.longitude},${this.props.currentLocation.latitude}` : ""}/>
        </Modal>
        <View style={[{flexDirection: 'row', alignItems: 'center', padding: 10, paddingLeft: 5, paddingBottom: 0},this.props.fullStyle?{backgroundColor:"#fff"}:null]} >
          <TouchableOpacity onPress={this.props.onBackPress} >
            <View style={{ height: 40, width: 30, justifyContent: 'center' }}>
              <Image source={require('../../assets/images/img_back_60x60.png')} />
            </View>
          </TouchableOpacity>
          <View style={[{ flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 5, backgroundColor: 'white', borderRadius: 2,height:32 },this.props.fullStyle?{borderColor:"#eee",borderWidth:1,borderStyle:"solid"}:null]} >
            <Image source={require('../../assets/images/img_search_36x36.png')} style={{ marginLeft: 5, marginRight: 5 }} />
            <TouchableOpacity onPress={this.props.onSearchClick ? this.props.onSearchClick : this.showPoiSearchPage} style={{ height: 40, flex: 1, justifyContent: 'center' }}>
              <Text style={{ color: 'gray' }} >{this.props.placeholder || '搜索'}</Text>
            </TouchableOpacity>
          </View>
          {
            this.props.onAddTaskPress ?
              (<TouchableOpacity onPress={this.props.onAddTaskPress} style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-end' }} >
                <Image source={require('../../assets/images/img_add_42x42.png')} style={{ height: 26, width: 26 }} />
              </TouchableOpacity>) :
              null
          }
        </View>
      </View>

    );
  }
}