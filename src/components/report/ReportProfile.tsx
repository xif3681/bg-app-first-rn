import React from 'react'
import { View, TouchableOpacity, Text, Alert, BackHandler } from 'react-native'
import { connect, MapStateToPropsParam, MapDispatchToPropsParam } from 'react-redux'
import { ReduxStore, ReduxStoreAsyncItemState } from '../../reducers'
import { ThunkDispatch } from 'redux-thunk'
import { Action } from 'redux-actions'
import StoreReport from './StoreReport'
import BusinessDistrictProfile from './BusinessDistrictProfile'
import { NavigationScreenProp } from 'react-navigation'
import { HeaderItemComponent, HeaderLeftComponent } from '../home/Home'
import { ReportModel } from '../../types/report';
import { TaskModel } from '../../types/task';
import { NavigationRoute } from 'react-navigation';
import { taskDraftCreate } from '../../actions/draft';
import { fetchTaskReport } from '../../actions/report';
import { fetchTask } from '../../actions/task';
import Toast from 'react-native-root-toast';
import { isEmpty } from 'lodash'
import { fetchBusinessDistrictProfile } from '../../actions/business-district-profile';
import { BusinessDistrictProfileModel } from '../../types/business-district-profile';
import businessDistrictProfile from '../../reducers/business-district-profile';

interface StoreProfileSegmentProps {
  onValueChange?: (index: number) => void
  value?: number
}

interface StoreProfileSegmentStates {
  index: number
}

class StoreProfileSegment extends React.Component<StoreProfileSegmentProps, StoreProfileSegmentStates> {
  constructor(props: StoreProfileSegmentProps) {
    super(props);

    this.state = {
      index: 0
    }
  }


  private onItemPressCallbackCreater = (index: number) => () => {
    this.setState({ index })
    this.props.onValueChange && this.props.onValueChange(index)
  }

  public render() {
    return (
      <View style={{ marginTop: 5, backgroundColor: 'white', flexDirection: 'row' }} >
        <TouchableOpacity onPress={this.onItemPressCallbackCreater(0)} style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center', height: 40 }} >
          <View style={{ flex: 1, justifyContent: 'center' }} >
            <Text style={{ fontSize: 17, color: this.state.index === 0 ? 'black' : 'gray' }} >门店报告</Text>
          </View>
          <View style={{ backgroundColor: this.state.index === 0 ? '#3EC2FA' : 'white', height: 2, margin: 2 }} >
            <Text style={{ height: 0 }} >门店报告</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onItemPressCallbackCreater(1)} style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center', height: 40 }} >
          <View style={{ flex: 1, justifyContent: 'center' }} >
            <Text style={{ fontSize: 17, color: this.state.index === 1 ? 'black' : 'gray' }} >商圈画像</Text>
          </View>
          <View style={{ backgroundColor: this.state.index === 1 ? '#3EC2FA' : 'white', height: 2, margin: 2 }} >
            <Text style={{ height: 0 }} >商圈画像</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

interface StateProps {
  taskReport?: ReduxStoreAsyncItemState<ReportModel>
  task?: ReduxStoreAsyncItemState<TaskModel>
  businessDistrictProfile?: ReduxStoreAsyncItemState<BusinessDistrictProfileModel>
}

interface DispatchProps {
  taskDraftCreate: (taskId: string, draft: any) => void
  fetchTaskReport: () => void
  fetchTask: () => void
  fetchBusinessDistrictProfile: () => void
}

interface OwnProps {
  navigation: NavigationScreenProp<NavigationRoute>
}

interface OwnState {
  segmentIndex: number,
  havePermission: boolean,
  isFirst: boolean
}

const mapStateToProps: MapStateToPropsParam<StateProps, OwnProps, ReduxStore> = (state, ownProps) => {
  const taskId = ownProps.navigation.state.params && ownProps.navigation.state.params.taskId
  return {
    taskReport: state.get('taskReport').get(taskId),
    task: state.get('task').get(taskId),
    businessDistrictProfile: state.get('businessDistrictProfile').get(taskId),
  }
}
const mapDispatchToProps: MapDispatchToPropsParam<DispatchProps, OwnProps> = (dispatch: ThunkDispatch<ReduxStore, null, Action<any>>, ownProps) => {
  const taskId = ownProps.navigation.state.params && ownProps.navigation.state.params.taskId
  return {
    taskDraftCreate: (taskId: string, draft: any) => dispatch(taskDraftCreate(taskId, draft)),
    fetchTaskReport: () => dispatch(fetchTaskReport(taskId)),
    fetchTask: () => dispatch(fetchTask(taskId)),
    fetchBusinessDistrictProfile: () => dispatch(fetchBusinessDistrictProfile(taskId))
  }
}
class StoreProfile extends React.Component<StateProps & DispatchProps & OwnProps, OwnState> {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<{ editTask: () => {} }> }) => ({
    title: '门店详情',
    headerTitleStyle: {
      textAlign: 'center',
      flex: 1,
      fontSize: 15,
    },
    headerTintColor: 'black',
    headerBackTitle: null,
    headerLeft: (<HeaderLeftComponent navigation={navigation} back={((navigation.state.params && navigation.state.params.fromAdd) ? 10 : (navigation.state.params && navigation.state.params.fromList) ? 1 : 6)}></HeaderLeftComponent>),
    // headerRight: (navigation.state.params && navigation.state.params.fromList?<HeaderItemComponent icon={require('../../assets/images/img_edit_60x60.png')} onPress={navigation.getParam('editTask')} />:null)
  });

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
  }
  onBackAndroid = () => {
    this.props.navigation.goBack()
    return true
  };

  constructor(props: StateProps & DispatchProps & OwnProps) {
    super(props)

    this.state = {
      segmentIndex: 0,
      isFirst: true,
      havePermission: false
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({
      editTask: this.editTask
    })

    this.props.fetchTaskReport && this.props.fetchTaskReport()
    this.props.fetchTask && this.props.fetchTask()
  }

  componentDidUpdate() {
    if (this.props.taskReport && this.props.taskReport.get('error')) {
      // Toast.show(`${(this.props.taskReport.get('error') + "").replace("Error: ", "").replace("Network Error", "网络不可用 请检查网络设置")}`, {
      //   position: Toast.positions.CENTER
      // })
      this.props.navigation.goBack()
    }
  }

  private editTask = () => {
    const task = this.props.task && this.props.task.get('data')
    if (task) {
      this.props.taskDraftCreate(task._id!, task)
      this.props.navigation.navigate('TaskFormOne', {
        taskId: task._id
      })
    }
  }

  private onStoreProfileSegmentValueChange = (segmentIndex: number) => {
 
    if(segmentIndex == 1){
      this.setState({
        havePermission:this.props.taskReport!.get("data")!.totalScore! >= 85 ? true : false,
        segmentIndex
      })
    }else{
      this.setState({ segmentIndex })
    }
  }

  private onGetStoreInfo = () => {
    Alert.alert('获取商圈数据', undefined, [{
      text: '确认',
      onPress: () => {
        this.props.fetchBusinessDistrictProfile()
        this.setState({  isFirst: false })
      }
    }, {
      text: '取消',
      style: 'cancel'
    }])
  }

  render() {
    return (
      <View style={{ flex: 1 }} >
        <StoreProfileSegment onValueChange={this.onStoreProfileSegmentValueChange} />
        {
          this.state.segmentIndex === 0 ?
            (
              <StoreReport taskReport={this.props.taskReport} task={this.props.task} />
            ) :
            (
              <BusinessDistrictProfile businessDistrictProfile={this.props.businessDistrictProfile && this.props.businessDistrictProfile.get('data')} task={this.props.task} taskReport={this.props.taskReport} permission={this.state.havePermission} OnGetInfo={this.onGetStoreInfo} isFirst={this.state.isFirst} />
            )
        }
      </View>
    )
  }
}
export default connect<StateProps, DispatchProps, OwnProps, ReduxStore>(mapStateToProps, mapDispatchToProps)(StoreProfile)
