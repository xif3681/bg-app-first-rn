import React from 'react'
import { View, Text, Image, ImageSourcePropType, StyleProp, ViewStyle, TouchableOpacity, Platform, StatusBar } from 'react-native'
import ReactNativeModal from "react-native-modal"
import { getStatusBarHeight } from 'react-native-status-bar-height';
const statusBarHeight = getStatusBarHeight(true)

const popupOffset = Platform.OS === 'ios' ? 44 : 56

interface ItemComponentProps {
  icon?: ImageSourcePropType
  title?: string
  onItemPress?: (tag?: string) => void
  tag?: string
  selected?: boolean
  showBottomLine?: boolean
}

export class PopupMenuItem extends React.Component<ItemComponentProps, any> {
  constructor(props: ItemComponentProps) {
    super(props);
  }

  public render() {
    return (
      <View>
        <TouchableOpacity onPress={() => this.props.onItemPress && this.props.onItemPress(this.props.tag)} style={{ flexDirection: 'row', height: 50, alignItems: 'center' }} >
          <Image source={this.props.icon!} style={{ height: 18, width: 18, margin: 10 }} />
          <Text style={{ marginRight: 10, color: this.props.selected ? '#000000' : undefined, fontSize: 17 }} >{this.props.title}</Text>
        </TouchableOpacity>
        {
          this.props.showBottomLine && <View style={{ height: 1, backgroundColor: '#C8C7CC', marginLeft: 10, marginRight: 10 }} />
        }
      </View>
    );
  }
}

interface PoppuMenuItem1Props {
  title: string
  onPress?: () => void
  selected?: boolean
  showLine?: boolean
}

export class PoppuMenuItem1 extends React.Component<PoppuMenuItem1Props, any> {
  constructor(props: PoppuMenuItem1Props) {
    super(props);
  }

  public render() {
    return (
      <View>
        <TouchableOpacity onPress={this.props.onPress} style={{ height: 40, justifyContent: 'center', alignItems: 'center' }} >
          <Text style={{ width: 80, textAlign: "center", color: this.props.selected === undefined ? "#000000" : this.props.selected === true ? '#1DB8F9' : "#000000" }} >{this.props.title}</Text>
        </TouchableOpacity>
        {
          this.props.showLine && <View style={{ height: 1, backgroundColor: '#C8C7CC', marginLeft: 10, marginRight: 10, }} />
        }

      </View>
    );
  }
}

interface OwnProps {
  isVisible: boolean
  contentViewStyle?: StyleProp<ViewStyle>
  onCancelPress?: () => void
  onDismiss?: () => void
}

interface OwnState { }

export default class PopupMenu extends React.Component<OwnProps, OwnState> {

  static Item = PopupMenuItem
  static Item1 = PoppuMenuItem1

  render() {
    const Platform = require('Platform');
    return (
      <ReactNativeModal onDismiss={this.props.onDismiss} backdropOpacity={0.1} animationIn='fadeIn' animationOut='fadeOut' onBackdropPress={this.props.onCancelPress} isVisible={this.props.isVisible} style={{ alignItems: 'flex-end', justifyContent: 'flex-start', marginRight: 10, marginTop: 0 }} >
        {
          Platform.OS === 'android' ? <StatusBar barStyle='light-content' backgroundColor='rgba(0, 0, 0, 0.1)' animated={false} /> : null
        }
        <View style={{ marginTop: statusBarHeight + popupOffset, alignItems: 'flex-end' }} >
          <Image source={require('../../assets/images/img_triangle_24x18.png')} style={{ height: 8, width: 12, marginRight: 8 }} />
          <View style={[{ backgroundColor: 'white', borderRadius: 3, overflow: 'hidden' }, this.props.contentViewStyle]} >
            {this.props.children}
          </View>
        </View>
      </ReactNativeModal>
    )
  }
}