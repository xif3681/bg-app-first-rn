import React from 'react'
import { View, Text, Image, ImageSourcePropType, StyleProp, ViewStyle, TouchableOpacity, StatusBar } from 'react-native'
import ReactNativeModal from "react-native-modal"
import { getStatusBarHeight } from 'react-native-status-bar-height';
const statusBarHeight = getStatusBarHeight(true)

interface ItemComponentProps {
  selected?: boolean
  activeIcon: ImageSourcePropType
  inactiveIcon: ImageSourcePropType
  title?: string
  onItemPress?: (tag?: string) => void
  tag?: string
}

export class PopupFilterMenuItem extends React.Component<ItemComponentProps, any> {
  constructor(props: ItemComponentProps) {
    super(props);
  }

  public render() {
    return (
      <TouchableOpacity onPress={() => this.props.onItemPress && this.props.onItemPress(this.props.tag)} style={{ alignItems: 'center', margin: 10 }} >
        <Image source={this.props.selected ? this.props.activeIcon : this.props.inactiveIcon!} style={{ height: 50, width: 50, margin: 5 }} />
        <Text style={{ marginTop: 5, fontSize: 13, color: "#000000" }} >{this.props.title}</Text>
      </TouchableOpacity>
    );
  }
}

interface OwnProps {
  isVisible: boolean
  contentViewStyle?: StyleProp<ViewStyle>
  onCancelPress?: () => void
}

interface OwnState { }

export default class PopupFilterMenu extends React.Component<OwnProps, OwnState> {
  static Item = PopupFilterMenuItem
  constructor(props: OwnProps) {
    super(props)
  }
  render() {
    const Platform = require('Platform');
    return (
      <ReactNativeModal backdropOpacity={0.1} animationIn='fadeIn' animationOut='fadeOut' onBackdropPress={this.props.onCancelPress} isVisible={this.props.isVisible} style={{ alignItems: 'flex-start', justifyContent: 'flex-start', marginLeft: 10, marginTop: 0 }} >
        {
          Platform.OS === 'android' ? <StatusBar barStyle='light-content' backgroundColor='rgba(0, 0, 0, 0.1)' animated={false} /> : null
        }
        <View style={[{ marginTop: statusBarHeight + 44 + 5 }, this.props.contentViewStyle]} >
          <Image source={require('../../assets/images/img_triangle_24x18.png')} style={{ height: 8, width: 12, marginLeft: 12 }} />
        </View>
        <View style={{ backgroundColor: 'white', borderRadius: 2, overflow: 'hidden', flexDirection: 'row', width: 240, flexWrap: 'wrap' }} >
          {this.props.children}
        </View>
      </ReactNativeModal>
    )
  }
}