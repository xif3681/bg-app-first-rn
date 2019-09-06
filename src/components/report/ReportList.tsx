import React from 'react'
import { View, FlatList, TouchableOpacity, Image, Text, StatusBar, Alert, Dimensions, Platform, RefreshControl } from 'react-native'
import { Map } from 'immutable'
import { connect, MapStateToPropsParam, MapDispatchToPropsParam } from 'react-redux'
import { ReduxStore, ReduxStoreAsyncItemState } from '../../reducers'
import { ThunkDispatch } from 'redux-thunk'
import { Action } from 'redux-actions'
import { NavigationScreenProp, SafeAreaView } from 'react-navigation'
import { NavigationRoute } from 'react-navigation'
import { PaginationData } from '../../types'
import { ReportModel } from '../../types/report'
import { User } from '../../types/user'
import { fetchUserReports, deleteReport, shareReport2Wechatwork, shareReport2Wechat, downloadReportPDF, fetchReport } from '../../actions/report'
import { fetchUserInferiors } from '../../actions/user'
import { PopupMenu } from '../common'
import { HeaderItemComponent } from '../home/Home'
import Toast from 'react-native-root-toast'
import Modal from 'react-native-modal'
import { Line } from '../task/FormOne'
import TaskListEmptyComponent from '../task/TaskListEmptyView'
import Share from 'react-native-share';

const { width: screenWidth } = Dimensions.get('window')

interface ReportListItemComponentProps {
  model: ReportModel
  onPress: (task: ReportModel) => void
}

interface ReportListItemComponentStates {
  isOperatorPopupVisible: boolean
}

class ReportListItemComponent extends React.Component<ReportListItemComponentProps, ReportListItemComponentStates> {
  constructor(props: ReportListItemComponentProps) {
    super(props);

    this.state = {
      isOperatorPopupVisible: false
    }
  }

  private onPress = () => {
    this.props.onPress && this.props.onPress(this.props.model)
  }

  public render() {
    let reportStatusTitle = '正在处理'
    let reportStatusColor = '#4CCAFF'
    if (this.props.model.newStoreApplyStatus === 'pending') {
      reportStatusTitle = '已申请'
      reportStatusColor = '#FF8787'
    } else if (this.props.model.newStoreApplyStatus === 'approved') {
      reportStatusTitle = '已通过'
      reportStatusColor = '#3BEBA3'
    } else if (this.props.model.newStoreApplyStatus === 'rejecked') {
      reportStatusTitle = '已拒绝'
      reportStatusColor = '#CCCCCC'
    }
    return (
      <View>
        <TouchableOpacity onPress={this.onPress} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', justifyContent: 'space-between', marginBottom: 1, paddingTop: 15, paddingBottom: 15, }} >
          <Image source={require('../../assets/images/img_report_36x36.png')} style={{ marginLeft: 15, marginRight: 15 }} />
          <Text style={{ flex: 1, fontSize: 17, color: "#000000" }} >{this.props.model.name}</Text>
          <Text style={{ color: 'white', backgroundColor: reportStatusColor, borderRadius: 3, overflow: 'hidden', padding: 3, marginRight: 15,minWidth:70,textAlign:"center" }} >{reportStatusTitle}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

interface StateProps {
  userReports: Map<string, ReduxStoreAsyncItemState<PaginationData<ReportModel>>>
  inferiors?: Array<User>
}

interface DispatchProps {
  fetchUserReports: (userId?: string) => void
  fetchInferiors: () => void
  fetchReport: (userId: string, reportId: string) => Promise<ReportModel>
  deleteReport: (reportId: string) => void
  wechatworkShare: (userId: string, reportId: string) => void
  wechatShare: (userId: string, reportId: string) => void
  downloadReportPDF: (userId: string, reportId: string) => Promise<string>
}

interface OwnProps {
  navigation: NavigationScreenProp<NavigationRoute>
}

interface OwnState {
  currentUser?: User
  isUserFilterPopupMenuVisible: boolean
  isItemOperatorVisible: boolean
  isShareDestinateSelectorVisible: boolean
}

const mapStateToProps: MapStateToPropsParam<StateProps, OwnProps, ReduxStore> = state => ({
  userReports: state.get('userReports'),
  inferiors: state.get('inferiors').get('data')
})
const mapDispatchToProps: MapDispatchToPropsParam<DispatchProps, OwnProps> = (dispatch: ThunkDispatch<ReduxStore, null, Action<any>>) => ({
  fetchUserReports: (userId?: string) => dispatch(fetchUserReports(userId)),
  fetchInferiors: () => dispatch(fetchUserInferiors()),
  fetchReport: (userId: string, reportId: string) => dispatch(fetchReport(userId, reportId)),
  deleteReport: (reportId: string) => dispatch(deleteReport(reportId)),
  wechatworkShare: (userId: string, reportId: string) => dispatch(shareReport2Wechatwork(userId, reportId)),
  wechatShare: (userId: string, reportId: string) => dispatch(shareReport2Wechat(userId, reportId)),
  downloadReportPDF: (userId: string, reportId: string) => dispatch(downloadReportPDF(userId, reportId))
})
class ReportList extends React.Component<StateProps & DispatchProps & OwnProps, OwnState> {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<{ addTasks: () => {} }> }) => ({
    title: '报告列表',
    headerBackTitle: null,
    headerTintColor: 'black',
    headerRight: (<HeaderItemComponent icon={require('../../assets/images/img_screen_60x60.png')} onPress={navigation.getParam('showUserFilterPopupMenu')} />)
  });

  constructor(props: StateProps & DispatchProps & OwnProps) {
    super(props)

    this.state = {
      isUserFilterPopupMenuVisible: false,
      isItemOperatorVisible: false,
      isShareDestinateSelectorVisible: false
    }
  }

  private selectedReport?: ReportModel
  private operatingAction?: () => void

  componentDidMount = () => {
    this.props.navigation.setParams({
      showUserFilterPopupMenu: this.showUserFilterPopupMenu,
    })
    this.props.fetchUserReports()
    this.props.fetchInferiors()
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

  private hideUserFilterPopupMenu = () => {
    this.setState({ isUserFilterPopupMenuVisible: false })
  }

  private onUserSelectCallbackCreater = (user: User) => () => {
    this.setState({ isUserFilterPopupMenuVisible: false, currentUser: user })
    this.props.fetchUserReports(user._id)
  }

  private onTaskItemOperatorPopupViewHide = () => {
    this.operatingAction && this.operatingAction()
    this.operatingAction = undefined
  }

  private onShareReportPress = () => {
    this.setState({ isItemOperatorVisible: false })
    this.operatingAction = async () => {
      if (!this.selectedReport || !this.selectedReport.userId || !this.selectedReport._id) return
      const filePath = await this.props.downloadReportPDF(this.selectedReport.userId!, this.selectedReport._id!)
      if (!filePath) {
        // Toast.show('获取PDF信息失败', {
        //   position: Toast.positions.CENTER
        // })
        return
      }
      Share.open({ url: Platform.OS === 'android' ? 'file://' + filePath : filePath, type: 'application/pdf' })
    }
  }

  private onPreviewReportPress = async () => {
    if (!this.selectedReport) return
    let report = await this.props.fetchReport(this.selectedReport.userId!, this.selectedReport._id!)
    if (report.pdfAttachment && report.pdfAttachment.url) {
      this.props.navigation.navigate('WebView', {
        uri: report.pdfAttachment!.url
      })
    } else {
      Toast.show(`报告申请中`, {
        position: Toast.positions.CENTER
      })
    }
    this.hiddeItemOperatorPopupView()
  }

  private hiddeItemOperatorPopupView = () => {
    this.setState({ isItemOperatorVisible: false })
  }

  private onReportItemPress = (item: ReportModel) => {
    this.selectedReport = item
    if(this.selectedReport.newStoreApplyStatus !== "preparing" 
    && this.selectedReport.newStoreApplyStatus !== "queueing" ){
      this.setState({ isItemOperatorVisible: true })
    }
  }

  private renderItem = ({ item }: { item: ReportModel }) => (<ReportListItemComponent model={item} onPress={this.onReportItemPress} />)
  private keyExtractor = (item: ReportModel) => item._id || item.location!.formattedAddress!

  render() {
    const userReports = this.props.userReports.get(this.state.currentUser && this.state.currentUser._id || 'this')
    const Platform = require('Platform');
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
            <TouchableOpacity onPress={this.onPreviewReportPress} style={{ height: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }} >
                <Text>查看</Text>
              </TouchableOpacity>
            <Line />
            <TouchableOpacity onPress={this.onShareReportPress} style={{ height: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }} >
              <Text>分享</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </Modal>
        <FlatList
          data={userReports && userReports.get('data') && userReports.get('data')!.data || null}
          ListHeaderComponent={<View style={{ height: 5 }} />}
          ListEmptyComponent={(userReports&&!userReports.get("isLoading"))?<TaskListEmptyComponent content="这里列表为空..." />:null}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
          // onRefresh={this.props.fetchUserReports}
          // refreshing={false}
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl
              title={'下拉刷新'}
              refreshing={false}
              onRefresh={this.props.fetchUserReports} />
          }
        />
      </View>
    )
  }
}
export default connect<StateProps, DispatchProps, OwnProps, ReduxStore>(mapStateToProps, mapDispatchToProps)(ReportList)
