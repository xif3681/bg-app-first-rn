import React from 'react'
import { View, Image, ImageSourcePropType, Text, TouchableOpacity, StatusBar, Alert, Linking, Platform } from 'react-native'
import { connect, MapStateToPropsParam, MapDispatchToPropsParam } from 'react-redux'
import { ReduxStore, ReduxStoreItemState } from '../../reducers'
import { ThunkDispatch } from 'redux-thunk'
import { Action } from 'redux-actions'
import { NavigationScreenProp, ScrollView } from 'react-navigation'
import { NavigationRoute } from 'react-navigation'
import { PopupMenu } from '../common'
import { isEmpty } from 'lodash'
import Toast from 'react-native-root-toast';
import { taskDraftCreate } from '../../actions/draft'
import { v4 } from 'uuid'
import { CodePush } from '../../reducers/code-push';

interface IProps {
  icon?: ImageSourcePropType
  title?: string
  onPress?: (event: any) => void
}

class ItemComponent extends React.Component<IProps, any> {
  constructor(props: IProps) {
    super(props);
  }
  public render() {
    return (
      <View>
        <TouchableOpacity onPress={this.props.onPress} style={{ height: 70, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white' }} >
          <View style={{ marginLeft: 15, marginTop: 10, marginBottom: 10, marginRight: 10, width: 50 }} >
            <Image source={this.props.icon!} style={{ flex: 1, width: undefined, height: undefined }} />
          </View>
          <View style={{ flex: 1 }} >
            <Text style={{ fontSize: 17, color: "rgba(0,0,0,1)" }} >{this.props.title}</Text>
          </View>
          <View style={{ margin: 10, width: 18, height: 18 }} >
            <Image source={require('../../assets/images/img_back_30x40.png')} style={{ flex: 1, width: undefined, height: undefined }} />
          </View>
        </TouchableOpacity>
        <View style={{ height: 1, backgroundColor: '#F1F1F1' }} />
      </View>
    );
  }
}

interface HeaderItemComponentProps {
  icon?: ImageSourcePropType
  text?: string
  onPress?: () => void
}

interface HeaderLeftComponentProps {
  navigation: any
  back: number
  checkTask?: () => boolean
  saveTask?: () => void
}

export class HeaderLeftComponent extends React.Component<HeaderLeftComponentProps,ReduxStore> {
  constructor(props: HeaderLeftComponentProps) {
    super(props);
  }
  _onBackPress = () => {
    if (this.props.checkTask&&this.props.checkTask()) {
      Alert.alert(
        '提示',
        '是否保存已更改信息',
        [
          {
            text: '直接关闭', onPress: () => {
              this.props.navigation.pop(this.props.back)
            }
          },
          {
            text: '保存并关闭', onPress: () => {
              this.props.saveTask && this.props.saveTask()
              this.props.navigation.pop(this.props.back)
            }
          },
        ],
        { cancelable: false }
      )
    } else {
      this.props.navigation.pop(this.props.back)
    }

  }
  public render() {
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity style={{ height: 25, width: 40 }} onPress={() => { this.props.navigation.goBack() }}>
          <Image source={require("../../assets/images/img_back_60x60.png")} style={{ height: 25, width: 25 }}></Image>
        </TouchableOpacity>
        <TouchableOpacity onPress={this._onBackPress}>
          <Text style={{ fontSize: 17, color: "#000" }}>关闭</Text>
        </TouchableOpacity>
      </View>
    )
  }

}

export class HeaderItemComponent extends React.Component<HeaderItemComponentProps, any> {
  constructor(props: HeaderItemComponentProps) {
    super(props);
  }
  public render() {
    return (
      <TouchableOpacity onPress={this.props.onPress} style={{ height: 40, justifyContent: 'center', alignItems: 'center' }} >
        {
          this.props.icon ?
            (<Image source={this.props.icon!} style={{ height: 26, marginRight: 10, marginLeft: 10, width: 26 }} />) :
            null
        }
        {
          this.props.text ?
            (
              <View style={{ marginRight: 10, marginLeft: 10, justifyContent: 'center', alignItems: 'center' }} >
                <Text style={{ color: '#1ADF8E', fontSize: 17 }}>{this.props.text}</Text>
              </View>
            ) :
            null
        }
      </TouchableOpacity>
    );
  }
}

interface StateProps {
  token?: string
  codePush?: ReduxStoreItemState<CodePush>
}

interface DispatchProps {
  taskDraftCreate: (taskId: string, draft?: any) => void
}

interface OwnProps {
  navigation: NavigationScreenProp<NavigationRoute>
}

interface OwnState {
  isPopupMenuVisible: boolean
}

const mapStateToProps: MapStateToPropsParam<StateProps, OwnProps, ReduxStore> = (state) => ({
  token: state.get('token').get('data'),
  codePush: state.get('codePush')
})
const mapDispatchToProps: MapDispatchToPropsParam<DispatchProps, OwnProps> = (dispatch: ThunkDispatch<ReduxStore, null, Action<any>>) => ({
  taskDraftCreate: (taskId, draft) => dispatch(taskDraftCreate(taskId, draft)),
})
class HomeScreen extends React.Component<StateProps & DispatchProps & OwnProps, OwnState> {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<{ addTasks: () => {} }> }) => ({
    title: '分析',
    // headerStyle: { borderBottomWidth: 0 },
    headerRight: (<HeaderItemComponent icon={require('../../assets/images/img_add_42x42.png')} onPress={navigation.getParam('addTasks')} />)
  });

  componentDidMount = () => {
    this.props.navigation.setParams({
      addTasks: this.showPopupMenu,
    })
  };

  componentDidUpdate(prevProps: StateProps & DispatchProps & OwnProps, prevState: OwnState) {
    if (isEmpty(this.props.token)) {
      Toast.show('权限失效，请重新登录', {
        position: Toast.positions.CENTER
      })
      this.props.navigation.navigate('Auth');
    }
    if (this.props.codePush && this.props.codePush.get('hasNewVersion')) {
      new Promise((resolve, reject) => {
        Alert.alert('发现新版本', this.props.codePush!.get('newVersionUpdatePackage')!.description, [{
          text: '下载',
          onPress: resolve
        }])
      }).then(() => {
        Linking.openURL('https://www.pgyer.com/ZX2g')
      })
    }
    if (this.props.codePush && this.props.codePush.get('updateRemotePackage') && this.props.codePush.get('updateRemotePackage')!.isMandatory) {
      this.props.navigation.navigate('CodePushMandatoryUpdateComponent')
    }
  }

  private onPopupViewDismissAction?: () => void

  constructor(props: StateProps & DispatchProps & OwnProps) {
    super(props)

    this.state = {
      isPopupMenuVisible: false
    }
  }

  private hidePopupMenu = () => {
    this.setState({ isPopupMenuVisible: false })
  }

  private showPopupMenu = () => {
    this.setState({ isPopupMenuVisible: true })
  }

  private onItemPress = (tag: 'task' | 'sale' | 'corrival') => () => {
    if (tag === 'task') {
      this.props.navigation.navigate('TaskMapView')
    } else if (tag === 'sale') {
      this.props.navigation.navigate('SaleMapView')
    } else if (tag === 'corrival') {

    }
  }

  private onPopupMenuItemPress = (tag?: string) => {
    if (tag === 'task') {
      const taskId = v4()
      this.props.taskDraftCreate(taskId)
      if (Platform.OS === 'ios') {
        this.onPopupViewDismissAction = () => {
          this.props.navigation.navigate('TaskMapView', {
            intent: 'task',
            taskId
          })
        }
      } else {
        this.props.navigation.navigate('TaskMapView', {
          intent: 'task',
          taskId
        })
      }
    } else if (tag === 'intention-store') {
      if (Platform.OS === 'ios') {
        this.onPopupViewDismissAction = () => {
          this.props.navigation.navigate('TaskMapView', {
            intent: 'intention-store'
          })
        }
      } else {
        this.props.navigation.navigate('TaskMapView', {
          intent: 'intention-store'
        })
      }
    }
    this.setState({ isPopupMenuVisible: false })
  }

  render() {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#F1F1F1' }} >
        <StatusBar barStyle='dark-content' backgroundColor='white' animated={false} />
        <PopupMenu onDismiss={this.onPopupViewDismissAction} isVisible={this.state.isPopupMenuVisible} onCancelPress={this.hidePopupMenu}>
          <PopupMenu.Item icon={require('../../assets/images/img_createtask_36x36.png')} title='创建拓店任务' onItemPress={this.onPopupMenuItemPress} tag='task' showBottomLine={true} />
          <PopupMenu.Item icon={require('../../assets/images/img_store_36x32.png')} title='添加意向店' onItemPress={this.onPopupMenuItemPress} tag='intention-store' />
        </PopupMenu>
        <View style={{ height: 5 }}></View>
        <ItemComponent icon={require('../../assets/images/img_map_82x82.png')} title='门店分析' onPress={this.onItemPress('task')} />
        <ItemComponent icon={require('../../assets/images/img_map_82x82.png')} title='线上销售分析' onPress={this.onItemPress('sale')} />
        <ItemComponent icon={require('../../assets/images/img_map_82x82.png')} title='竟品商户分析' onPress={this.onItemPress('corrival')} />
      </ScrollView>
    )
  }
}
export default connect<StateProps, DispatchProps, OwnProps, ReduxStore>(mapStateToProps, mapDispatchToProps)(HomeScreen)
