import React from 'react'
import { View, TouchableOpacity, Image, Text, ImageSourcePropType, ActivityIndicator, RefreshControl } from 'react-native'
import { connect, MapStateToPropsParam, MapDispatchToPropsParam } from 'react-redux'
import { ReduxStore, ReduxStoreAsyncItemState } from '../../reducers'
import { ThunkDispatch } from 'redux-thunk'
import { Action } from 'redux-actions'
import { NavigationScreenProp, ScrollView } from 'react-navigation'
import { NavigationRoute } from 'react-navigation'
import { TaskModel } from '../../types/task'
import { PaginationData } from '../../types'
import { FetchUserTasksActionFunction, fetchUserTasks, fetchTaskOpenedStores, FetchTaskOpenedStoresActionFunction } from '../../actions/task'
import { IntentionStoreModel } from '../../types/intention-store';
import { fetchUserIntentionStores, FetchUserIntentionStoresActionFunction } from '../../actions/intention-stores';
import { fetchUserReports, FetchUserReportsActionFunction } from '../../actions/report';
import { ReportModel } from '../../types/report';
import { Badge } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment'
import taskOpenedStore from '../../reducers/task-opened-store';

interface TaskItemComponentProps {
  icon?: ImageSourcePropType
  title?: string
  subData?: ReduxStoreAsyncItemState<PaginationData<any>>
  subtitleColor?: string
  onPress?: (event: any) => void
  showDot?: boolean
}

interface TaskItemComponentState {
}

class TaskItemComponent extends React.Component<TaskItemComponentProps, TaskItemComponentState> {

  public render() {
    return (
      <View>
        <TouchableOpacity onPress={this.props.onPress} style={{ height: 70, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', marginBottom: 1 }} >
          <View style={{ marginLeft: 15, marginTop: 10, marginBottom: 10, marginRight: 10, width: 50 }} >
            <Image source={this.props.icon!} style={{ flex: 1, width: undefined, height: undefined, marginTop: 2, marginRight: 2 }} />
            {
              this.props.showDot && <Badge status="error" containerStyle={{ position: 'absolute', right: 0 }}></Badge>
            }
          </View>
          <View style={{ flex: 1 }} >
            <Text style={{ fontSize: 17, color: "#000000" }} >{this.props.title}</Text>
          </View>
          {
            this.props.subData&&this.props.subData.get("data")  ?
              (
                <Text style={{ color: this.props.subtitleColor ? this.props.subtitleColor : 'black', fontSize: 17 }} >{this.props.subData!.get("data")!.dataCount}</Text>
              ) :
              (
                this.props.subData&&this.props.subData.get("isLoading")&&<ActivityIndicator animating hidesWhenStopped />
              )
          }
          <View style={{ margin: 10, width: 18, height: 18 }} >
            <Image source={require('../../assets/images/img_back_30x40.png')} style={{ flex: 1, width: undefined, height: undefined }} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

interface StateProps {
  tasks?: ReduxStoreAsyncItemState<PaginationData<TaskModel>>
  intentionStores?: ReduxStoreAsyncItemState<PaginationData<IntentionStoreModel>>
  reports?: ReduxStoreAsyncItemState<PaginationData<ReportModel>>
  taskOpenedStore?: ReduxStoreAsyncItemState<PaginationData<TaskModel>>
}

interface DispatchProps {
  fetchUserTasks: FetchUserTasksActionFunction
  fetchUserIntentionStores: FetchUserIntentionStoresActionFunction
  fetchUserReports: FetchUserReportsActionFunction
  fetchTaskOpenedStores: FetchTaskOpenedStoresActionFunction
}

interface OwnProps {
  navigation: NavigationScreenProp<NavigationRoute>
}

interface OwnState {
  hasNewReportReocrd: boolean
  hasNewOpenedStoreReocrd: boolean
  latestRerportListPreviewTime?: moment.Moment
  latestOpenedStoreListPreviewTime?: moment.Moment
}

const mapStateToProps: MapStateToPropsParam<StateProps, OwnProps, ReduxStore> = state => ({
  tasks: state.get('taskList'),
  reports: state.get('userReports').get('this') && state.get('userReports').get('this')!,
  intentionStores: state.get('intentionStores'),
  taskOpenedStore: state.get('taskOpenedStores')
})
const mapDispatchToProps: MapDispatchToPropsParam<DispatchProps, OwnProps> = (dispatch: ThunkDispatch<ReduxStore, null, Action<any>>) => ({
  fetchUserTasks: () => dispatch(fetchUserTasks()),
  fetchUserIntentionStores: () => dispatch(fetchUserIntentionStores()),
  fetchUserReports: () => dispatch(fetchUserReports()),
  fetchTaskOpenedStores: () => dispatch(fetchTaskOpenedStores())
})
class TaskComponent extends React.PureComponent<StateProps & DispatchProps & OwnProps, OwnState> {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<{ addTasks: () => {} }> }) => ({
    title: '任务',
    headerBackTitle: null
  })

  static getDerivedStateFromProps(props: StateProps & DispatchProps & OwnProps, state: OwnState) {
    let newState = null
    if (props.reports &&props.reports.get("data")&& props.reports.get("data")!.data.some(value => {
      return moment(value.updatedAt).isAfter(state.latestRerportListPreviewTime)
    })) {
      if (!newState) newState = {} as any
      newState.hasNewReportReocrd = true
    }

    if (props.taskOpenedStore &&props.taskOpenedStore.get("data")&& props.taskOpenedStore.get("data")!.data.some(value => {
      return moment(value.updatedAt).isAfter(state.latestOpenedStoreListPreviewTime)
    })) {
      if (!newState) newState = {} as any
      newState.hasNewOpenedStoreReocrd = true
    }

    return newState
  }

  constructor(props: StateProps & DispatchProps & OwnProps) {
    super(props)

    this.state = {
      hasNewReportReocrd: false,
      hasNewOpenedStoreReocrd: false
    }
  }

  async componentDidMount() {
    const latestRerportListPreviewTimeString = await AsyncStorage.getItem('latestRerportListPreviewTime')
    const latestRerportListPreviewTime = moment(parseInt(latestRerportListPreviewTimeString || '0'))
    const latestOpenedStoreListPreviewTimeString = await AsyncStorage.getItem('latestOpenedStoreListPreviewTime')
    const latestOpenedStoreListPreviewTime = moment(parseInt(latestOpenedStoreListPreviewTimeString || '0'))
    this.setState({ latestRerportListPreviewTime, latestOpenedStoreListPreviewTime })
    this.props.fetchUserTasks()
    this.props.fetchUserIntentionStores()
    this.props.fetchUserReports()
    this.props.fetchTaskOpenedStores()
  }

  private onTaskItemPressCallbackCreater = (tag: string) => async () => {
    if (tag === 'task') {
      this.props.navigation.navigate('TaskList')
    } else if (tag === 'intention-store') {
      this.props.navigation.navigate('IntentionStoreList')
    }
  }

  private onReportListPress = async () => {
    await AsyncStorage.setItem("latestRerportListPreviewTime", `${Date.now()}`)
    this.setState({ hasNewReportReocrd: false, latestRerportListPreviewTime: moment() })
    this.props.navigation.navigate('ReportList')
  }

  private onOpenedStoreListPress = async () => {
    await AsyncStorage.setItem("latestOpenedStoreListPreviewTime", `${Date.now()}`)
    this.setState({ hasNewOpenedStoreReocrd: false, latestOpenedStoreListPreviewTime: moment() })
    this.props.navigation.navigate('TaskOpenedStoreList')
  }

  render() {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#F1F1F1' }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            title={'下拉刷新'}
            refreshing={false}
            onRefresh={this.componentDidMount.bind(this)}
          />
        }>
        <View style={{ height: 5 }}></View>
        <TaskItemComponent onPress={this.onTaskItemPressCallbackCreater('task')} icon={require('../../assets/images/img_task_100x100.png')} title='拓店任务列表' subData={this.props.tasks}/>
        <TaskItemComponent onPress={this.onReportListPress} icon={require('../../assets/images/img_reportlisk_82x82.png')} title='报告列表' subData={this.props.reports} showDot={this.state.hasNewReportReocrd} />
        <TaskItemComponent onPress={this.onOpenedStoreListPress} icon={require('../../assets/images/img_opened_store_82x82.png')} title='已开门店' subData={this.props.taskOpenedStore} showDot={this.state.hasNewOpenedStoreReocrd} subtitleColor='#F5BA04' />
        <TaskItemComponent onPress={this.onTaskItemPressCallbackCreater('intention-store')} icon={require('../../assets/images/img_unopen_store2_82x82.png')} title='意向店' subData={this.props.intentionStores} subtitleColor='#1ADF8E' />
      </ScrollView>
    )
  }
}
export default connect<StateProps, DispatchProps, OwnProps, ReduxStore>(mapStateToProps, mapDispatchToProps)(TaskComponent)
