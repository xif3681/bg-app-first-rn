import React from 'react'
import { View, Image, Text, FlatList, TouchableOpacity, StatusBar, Platform, RefreshControl } from 'react-native'
import { connect, MapStateToPropsParam, MapDispatchToPropsParam } from 'react-redux'
import { ReduxStore, ReduxStoreAsyncItemState } from '../../reducers'
import { ThunkDispatch } from 'redux-thunk'
import { Action } from 'redux-actions'
import { NavigationScreenProp, SafeAreaView } from 'react-navigation'
import { NavigationRoute } from 'react-navigation'
import { PaginationData } from '../../types'
import { fetchTaskOpenedStores, FetchTaskOpenedStoresActionFunction, fetchTaskOpenedStoresList, FetchTaskOpenedStoresListActionFunction } from '../../actions/task';
import Modal from 'react-native-modal';
import TaskListEmptyComponent from './TaskListEmptyView';
import { ReportModel } from '../../types/report';
import { downloadReportPDF, fetchReport } from '../../actions/report';
import Toast from 'react-native-root-toast';
import Share from 'react-native-share';
import { User } from '../../types/user';
import { fetchUserInferiors } from '../../actions/user';
import { PopupMenu } from '../common';
import { HeaderItemComponent } from '../home/Home';

interface OpenedStoreListItemComponentProps {
  model: ReportModel
  onPress: (report: ReportModel) => void
}

interface OpenedStoreListItemComponentStates {
  isOperatorPopupVisible: boolean
}

class TaskOpenedStoreListItemComponent extends React.Component<OpenedStoreListItemComponentProps, OpenedStoreListItemComponentStates> {
  constructor(props: OpenedStoreListItemComponentProps) {
    super(props);

    this.state = {
      isOperatorPopupVisible: false
    }
  }

  private onPress = () => {
    this.props.onPress && this.props.onPress(this.props.model)
  }

  public render() {
    return (
      <View>
        <TouchableOpacity onPress={this.onPress} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', justifyContent: 'space-between', height: undefined, marginBottom: 1, paddingTop: 15, paddingBottom: 15, }} >
          <Image source={require('../../assets/images/img_opend_store3_36x36.png')} style={{ marginLeft: 15, marginRight: 15 }} />
          <Text style={{ flex: 1, color: "#000000", fontSize: 17 }} >{this.props.model.name}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

interface StateProps {
  taskOpenedStoresList?: ReduxStoreAsyncItemState<PaginationData<ReportModel>>
  inferiors?: Array<User>
}

interface DispatchProps {
  fetchTaskOpenedStoresList: FetchTaskOpenedStoresListActionFunction
  fetchReport: (userId: string, reportId: string) => Promise<ReportModel>
  downloadReportPDF: (userId: string, reportId: string) => Promise<string>
  fetchInferiors: () => void
}

interface OwnProps {
  navigation: NavigationScreenProp<NavigationRoute>
}

interface OwnState {
  currentUser?: User
  isUserFilterPopupMenuVisible: boolean
  isItemOperatorVisible: boolean
}

const mapStateToProps: MapStateToPropsParam<StateProps, OwnProps, ReduxStore> = state => ({
  taskOpenedStoresList: state.get('taskOpenedStoresList'),
  inferiors: state.get('inferiors').get('data')
})
const mapDispatchToProps: MapDispatchToPropsParam<DispatchProps, OwnProps> = (dispatch: ThunkDispatch<ReduxStore, null, Action<any>>) => ({
  fetchTaskOpenedStoresList: (userId) => dispatch(fetchTaskOpenedStoresList(userId)),
  fetchReport: (userId: string, reportId: string) => dispatch(fetchReport(userId, reportId)),
  downloadReportPDF: (userId: string, reportId: string) => dispatch(downloadReportPDF(userId, reportId)),
  fetchInferiors: () => dispatch(fetchUserInferiors()),
})
class TaskOpenedStoreListComponent extends React.Component<StateProps & DispatchProps & OwnProps, OwnState> {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<{ saveTasks: () => {} }> }) => ({
    title: '已开门店',
    headerTintColor: 'black',
    headerBackTitle: null,
    headerRight: (<HeaderItemComponent icon={require('../../assets/images/img_screen_60x60.png')} onPress={navigation.getParam('showUserFilterPopupMenu')} />)
  })

  private selectedOpenedStoreReport?: ReportModel
  private operatingAction?: () => void

  constructor(props: StateProps & DispatchProps & OwnProps) {
    super(props)

    this.state = {
      isItemOperatorVisible: false,
      isUserFilterPopupMenuVisible: false,
    }
  }

  componentDidMount = () => {
    this.props.navigation.setParams({
      showUserFilterPopupMenu: this.showUserFilterPopupMenu,
    })
    this.props.fetchInferiors()
    this.props.fetchTaskOpenedStoresList()
  };

  private showUserFilterPopupMenu = () => {
    if (this.props.inferiors && this.props.inferiors.length) {
      this.setState({ isUserFilterPopupMenuVisible: true })
    } else {
      Toast.show('没有找到下级信息', {
        position: Toast.positions.CENTER
      })
    }
  }

  private hiddeItemOperatorPopupView = () => {
    this.setState({
      isItemOperatorVisible: false,
    })
  }

  private onReportItemPress = (report: ReportModel) => {
    this.selectedOpenedStoreReport = report
    this.setState({ isItemOperatorVisible: true })
  }

  private hideUserFilterPopupMenu = () => {
    this.setState({ isUserFilterPopupMenuVisible: false })
  }

  private onUserSelectCallbackCreater = (user: User) => () => {
    this.setState({ isUserFilterPopupMenuVisible: false, currentUser: user })
    this.props.fetchTaskOpenedStoresList(user._id)
  }

  private onPreviewPress = async () => {
    this.setState({ isItemOperatorVisible: false })
    if (!this.selectedOpenedStoreReport) return
    let report = await this.props.fetchReport(this.selectedOpenedStoreReport.userId!, this.selectedOpenedStoreReport._id!)
    if (report.pdfAttachment && report.pdfAttachment.url) {
      this.props.navigation.navigate('WebView', {
        uri: report.pdfAttachment!.url,
        report
      })
    } else {
      Toast.show(`报告申请中`, {
        position: Toast.positions.CENTER
      })
    }
  }

  private onSharePress = () => {
    this.setState({ isItemOperatorVisible: false })
    if (!this.selectedOpenedStoreReport) return
    this.operatingAction = async () => {
      if (!this.selectedOpenedStoreReport || !this.selectedOpenedStoreReport.userId || !this.selectedOpenedStoreReport._id) return
      const filePath = await this.props.downloadReportPDF(this.selectedOpenedStoreReport.userId!, this.selectedOpenedStoreReport._id!)
      if (!filePath) {
        // Toast.show('获取PDF信息失败', {
        //   position: Toast.positions.CENTER
        // })
        return
      }
      Share.open({ url: Platform.OS === 'android' ? 'file://' + filePath : filePath, type: 'application/pdf' })
    }
  }

  private onTaskItemOperatorPopupViewHide = () => {
    this.operatingAction && this.operatingAction()
    this.operatingAction = undefined
  }

  private renderItem = ({ item }: { item: ReportModel }) => (<TaskOpenedStoreListItemComponent model={item} onPress={this.onReportItemPress} />)
  private keyExtractor = (item: ReportModel) => item._id || item.location!.formattedAddress!

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#F1F1F1' }} >
        <PopupMenu onCancelPress={this.hideUserFilterPopupMenu} isVisible={this.state.isUserFilterPopupMenuVisible} >
          {
            this.props.inferiors && this.props.inferiors.map((inferior, index) => {
              return (
                <PopupMenu.Item1 onPress={this.onUserSelectCallbackCreater(inferior)} selected={this.state.currentUser && this.state.currentUser.name === inferior!.name} key={inferior._id} title={inferior.name!} showLine={index !== this.props.inferiors!.length - 1} />
              )
            })
          }
        </PopupMenu>
        <Modal onBackdropPress={this.hiddeItemOperatorPopupView} backdropOpacity={0.1} isVisible={this.state.isItemOperatorVisible} onModalHide={this.onTaskItemOperatorPopupViewHide} style={{ margin: 0, justifyContent: 'flex-end' }} >
          <SafeAreaView style={{ backgroundColor: 'white' }} >
            {
              Platform.OS === 'android' ? <StatusBar barStyle='light-content' backgroundColor='rgba(0, 0, 0, 0.1)' animated={false} /> : null
            }
            <TouchableOpacity onPress={this.onPreviewPress} style={{ height: 45, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }} >
              <Text style={{ fontSize: 16, color: "#000000" }}>查看</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.onSharePress} style={{ height: 45, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }} >
              <Text style={{ fontSize: 16, color: "#000000" }}>分享</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </Modal>
        <FlatList
          data={this.props.taskOpenedStoresList && this.props.taskOpenedStoresList.get('data') && this.props.taskOpenedStoresList.get('data')!.data || null}
          renderItem={this.renderItem}
          ListHeaderComponent={<View style={{ height: 5 }} />}
          ListEmptyComponent={<TaskListEmptyComponent content="这里列表为空..." />}
          // refreshing={false}
          showsVerticalScrollIndicator={false}
          // onRefresh={this.props.fetchTaskOpenedStoresList}
          keyExtractor={this.keyExtractor}
          refreshControl={
            <RefreshControl
              title={'下拉刷新'}
              refreshing={false}
              onRefresh={this.props.fetchTaskOpenedStoresList} />
          }
        />
      </View>
    )
  }
}
export default connect<StateProps, DispatchProps, OwnProps, ReduxStore>(mapStateToProps, mapDispatchToProps)(TaskOpenedStoreListComponent)
