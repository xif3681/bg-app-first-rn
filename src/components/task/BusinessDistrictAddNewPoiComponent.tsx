import React from 'react'
import { View, Text, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, StatusBar } from 'react-native';
import Modal from 'react-native-modal';
import { LatLng, POI } from 'react-native-amap3d';
import { Line } from './FormOne';
import Toast from 'react-native-root-toast';
import { SafeAreaView, ScrollView } from 'react-navigation';

interface BusinessDistrictAddNewPoiComponentProps {
  onConfirmPress: (poi: POI) => void
  onCancelPress: () => void
  poi?: LatLng
}

interface BusinessDistrictAddNewPoiComponentStates {
  isAddingMoreInformation: boolean
  type: string,
  name?: string
}

export class BusinessDistrictAddNewPoiComponent extends React.Component<BusinessDistrictAddNewPoiComponentProps, BusinessDistrictAddNewPoiComponentStates> {
  constructor(props: BusinessDistrictAddNewPoiComponentProps) {
    super(props);

    this.state = {
      isAddingMoreInformation: false,
      type: 'subdistrict',
      name: ""
    }
  }


  private poiTypes = [{
    name: '小区',
    value: 'subdistrict'
  }, {
    name: '办公楼',
    value: 'officebuilding'
  }, {
    name: '引流商超',
    value: 'market'
  }, {
    name: '公交站',
    value: 'busStation'
  }, {
    name: '地铁站',
    value: 'metro'
  }, {
    name: '学校',
    value: 'schllo'
  }]

  private showAddInformationView = () => {
    if (!this.props.poi) {
      Toast.show('请点击地图选择地标', {
        position: Toast.positions.CENTER
      })
      return
    }
    this.setState({ isAddingMoreInformation: true })
  }

  private onConfirmPress = () => {
    if (!this.state.name) {
      Toast.show('请输入地标名称', {
        position: Toast.positions.CENTER
      })
      return
    }
    const poi = {} as POI
    poi.type = this.state.type
    poi.name = this.state.name
    poi.latitude = this.props.poi!.latitude as number
    poi.longitude = this.props.poi!.longitude as number
    poi.source = 'manual'
    this.props.onConfirmPress && this.props.onConfirmPress(poi)
    this.setState({ isAddingMoreInformation: false })
    Toast.show('添加地标成功', {
      position: Toast.positions.CENTER
    })
  }

  private onCancelPress = () => {
    this.setState({ isAddingMoreInformation: false })
    this.props.onCancelPress && this.props.onCancelPress()
  }

  private onTypePressCallbackCreater = (type: string) => () => {
    this.setState({ type })
  }

  private onPoiNameChange = (name: string) => {
    this.setState({
      name
    })
  }

  
  public render() {
    const Platform = require('Platform');
    return (
      <SafeAreaView>
        <Modal isVisible={this.state.isAddingMoreInformation} style={{ flex: 1 }} >
          {
            Platform.OS === 'android' ? <StatusBar barStyle='light-content' backgroundColor='rgba(0, 0, 0, 0.1)' animated={false} /> : null
          }
          <KeyboardAvoidingView behavior='padding' style={{ backgroundColor: 'white', borderRadius: 2, height: 350 }}  >
            <View>
              <View style={{ height: 50, justifyContent: 'center', alignItems: 'center' }} >
                <Text style={{ color: "#000000", fontSize: 17 }}>选择新增地标类型</Text>
              </View>
              <Line />
              <View style={{ flexDirection: 'row', display: "flex", flexWrap: 'wrap', paddingLeft: 10, paddingRight: 10 }}>
                {
                  this.poiTypes.map((poiType, index) => {
                    return (
                      <View key={poiType.name} style={[{ width: "50%" }, index % 2 != 0 ? { borderLeftColor: "#eee", borderLeftWidth: 1, borderStyle: "solid" } : null]}>
                        <TouchableOpacity onPress={this.onTypePressCallbackCreater(poiType.value)} style={{ flexDirection: 'row', height: 40, justifyContent: 'space-between', alignItems: 'center', width: "100%", paddingLeft: 10, paddingRight: 10 }} >
                          <Text style={{ color: "#000000", fontSize: 16 }}>{poiType.name}</Text>
                          {
                            this.state.type === poiType.value ?
                              (
                                <Image source={require('../../assets/images/img_right_36x36.png')} />
                              ) :
                              null
                          }
                        </TouchableOpacity>
                        <View style={{ height: 1, backgroundColor: '#F1F1F1', }} />
                      </View>
                    )
                  })
                }
              </View>
              <View style={{ height: 50, justifyContent: 'center', alignItems: 'center' }} >
                <Text style={{ fontSize: 17, color: "#000000" }}>地标名称</Text>
              </View>
              <Line />
              <TextInput returnKeyType='done' placeholder='输入地标名称' onChangeText={this.onPoiNameChange} style={{ height: 40, marginLeft: 10, marginRight: 10, fontSize: 15, color: "#000000" }} />
              <Line />
              <View style={{ flexDirection: 'row', marginBottom: 10, marginTop: 10 }} >
                <TouchableOpacity onPress={this.onCancelPress} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                  <View style={{ width: 80, height: 35, justifyContent: 'center', alignItems: 'center', borderRadius: 20, borderColor: '#A0A0A0', borderWidth: 1, backgroundColor: 'white' }} >
                    <Text style={{ color: '#A0A0A0', fontSize: 17 }} >取消</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.state.name ? this.onConfirmPress : undefined} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                  <View style={{ width: 80, height: 35, justifyContent: 'center', alignItems: 'center', borderRadius: 20, backgroundColor: this.state.name ? '#1ADF8E' : '#eeeeee' }} >
                    <Text style={{ color: 'white', fontSize: 17 }} >完成</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
        <View style={{ flexDirection: 'row', marginBottom: 45 }} >
          <TouchableOpacity onPress={this.onCancelPress} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
            <View style={{ width: 80, height: 35, justifyContent: 'center', alignItems: 'center', borderRadius: 20, borderColor: '#A0A0A0', borderWidth: 1, backgroundColor: 'white' }} >
              <Text style={{ color: '#A0A0A0' }} >取消</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.showAddInformationView} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
            <View style={{ width: 80, height: 35, justifyContent: 'center', alignItems: 'center', borderRadius: 20, backgroundColor: '#1ADF8E' }} >
              <Text style={{ color: 'white' }} >确定</Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}
