import React from 'react'
import { View, Text, Image, KeyboardAvoidingView, StatusBar, Platform, Keyboard, TextInput, BackHandler } from 'react-native'
import { connect, MapStateToPropsParam, MapDispatchToPropsParam } from 'react-redux'
import { ReduxStore, ReduxStoreAsyncItemState } from '../../reducers'
import { ThunkDispatch } from 'redux-thunk'
import { Action } from 'redux-actions'
import { NavigationScreenProp, ScrollView, Header } from 'react-navigation'
import { NavigationRoute } from 'react-navigation'
import TaskItemSingleSelector from './TaskItemSingleSelector'
import validateTask from '../../utility/validate-task';
import TaskItemTextInput from './TaskItemTextInput'
import TaskItemTextArea from './TaskItemTextArea'
import TaskContinuteEditButton from './TaskContinuteEditButton'
import Toast from 'react-native-root-toast'
import { CONSTANT_OPTION_STORE_INFO } from '../../constants';
import { taskDraftValuesChange, taskRemoteCreate, taskRemoteUpdate, TaskRemoteUpdateActionFunction, TaskRemoteCreateActionFunction } from '../../actions/draft';
import { HeaderItemComponent, HeaderLeftComponent } from '../home/Home';
import { TaskDraftModel } from '../../types/task-draft'
import { IgnoreParametersActionFunction } from '../../actions';

export const Line = (props: any) => {
  return (<View style={{ height: 1, backgroundColor: '#F1F1F1', marginLeft: 15, ...props.style }} />)
}

export const Gap = () => {
  return (<View style={{ height: 5 }} />)
}

interface TaskFormLocationHeaderProps {
  location?: {
    latitude: Number // 经度
    longitude: Number // 纬度
    formattedAddress?: string
  }
}

export class TaskFormLocationHeader extends React.Component<TaskFormLocationHeaderProps, any> {
  constructor(props: TaskFormLocationHeaderProps) {
    super(props);
  }

  public render() {
    return (
      <View style={{ flexDirection: 'row', backgroundColor: 'white', padding: 10, marginTop: 10, marginBottom: 10, alignItems: 'center' }} >
        <View style={{ height: 18, width: 18, marginLeft: 3 }} >
          <Image source={require('../../assets/images/img_location_36x36.png')} style={{ flex: 1, width: undefined, height: undefined }} />
        </View>
        <Text style={{ marginLeft: 8, flex: 1, fontSize: 14, color: "#000000" }} >{this.props.location && this.props.location.formattedAddress ? this.props.location.formattedAddress : '未知地址'}</Text>
      </View>
    );
  }
}

interface StateProps {
  taskDraft?: ReduxStoreAsyncItemState<TaskDraftModel>
}

interface DispatchProps {
  onLocalTaskValueChange: (object: { [key: string]: any }) => void
  createRemoteTask: IgnoreParametersActionFunction<typeof taskRemoteCreate>
  updateRemoteTask: IgnoreParametersActionFunction<typeof taskRemoteUpdate>
}

interface OwnProps {
  navigation: NavigationScreenProp<NavigationRoute>
}

interface OwnState {
}

const mapStateToProps: MapStateToPropsParam<StateProps, OwnProps, ReduxStore> = (state, ownProps) => {
  const taskId = ownProps.navigation.state.params!.taskId
  return {
    taskDraft: state.get('taskDrafts').get(taskId)
  }
}
const mapDispatchToProps: MapDispatchToPropsParam<DispatchProps, OwnProps> = (dispatch: ThunkDispatch<ReduxStore, null, Action<any>>, ownProps) => {
  const taskId = ownProps.navigation.state.params!.taskId
  return {
    onLocalTaskValueChange: (keyValues) => dispatch(taskDraftValuesChange(taskId, keyValues)),
    createRemoteTask: () => dispatch(taskRemoteCreate(taskId)),
    updateRemoteTask: () => dispatch(taskRemoteUpdate(taskId))
  }
}
class TaskFormOne extends React.Component<StateProps & DispatchProps & OwnProps, OwnState> {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<{ saveTasks: () => {} }> }) => ({
    title: '门店信息（1/4）',
    headerTitleStyle: {
      textAlign: 'center',
      flex: 1,
      fontSize: 15,
    },
    headerTintColor: 'black',
    headerBackTitle: null,
    headerLeft: (<HeaderLeftComponent navigation={navigation} back={navigation.state.params!.fromAdd ? 3 : 2} checkTask={navigation.getParam('checkTasks')} saveTask={navigation.getParam('saveTasks')}></HeaderLeftComponent>),
    headerRight: (<HeaderItemComponent text='保存草稿' onPress={navigation.getParam('saveTasks')} />)
  })
  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
  }
  // componentDidUpdate() {
  //   if (this.props.taskDraft) {
  //     const taskDraftOperatingError = this.props.taskDraft!.get('error')
  //     if (taskDraftOperatingError) {
  //       Toast.show(taskDraftOperatingError.message, {
  //         position: Toast.positions.CENTER
  //       })
  //     }
  //   }
  // }

  onBackAndroid = () => {
    this.props.navigation.goBack()
    return true
  };

  constructor(props: StateProps & DispatchProps & OwnProps) {
    super(props)

    this.props.navigation.setParams({
      saveTasks: this.saveTasks,
      checkTasks: this.checkTasks
    })
  }

  //检查是否有修改
  checkTasks = () => {
    return this.props.taskDraft ? this.props.taskDraft.get('isDirty') : false
  }

  private saveTasks = async () => {
    const taskDraft = this.props.taskDraft!.get('data')
    let checkTask = validateTask(taskDraft, true, 0)
    if (checkTask) {
      Toast.show(checkTask, {
        position: Toast.positions.CENTER
      })
      return
    }
    let task
    if (taskDraft!.createdAt) {
      task = await this.props.updateRemoteTask()
    } else {
      task = await this.props.createRemoteTask()
    }
    task && Toast.show("保存成功", {
      position: Toast.positions.CENTER
    })
  }

  private goNextPage = () => {
    this.props.navigation.navigate('TaskFormTwo', {
      taskId: this.props.navigation.state.params!.taskId,
      fromAdd: this.props.navigation.state.params!.fromAdd,
    })
  }

  private onTaskValueChangeCallbackCreater = (key: string) => (value: any) => {
    this.props.onLocalTaskValueChange({ [key]: value })
  }

  render() {
    const taskDraft = this.props.taskDraft && this.props.taskDraft.get('data')
    return (
      <KeyboardAvoidingView behavior={Platform.OS === 'android' ? undefined : 'padding'} style={{ flex: 1 }} keyboardVerticalOffset={Header.HEIGHT} >
        <StatusBar barStyle='dark-content' backgroundColor='white' />
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: '#F6F6F6' }} >
          <TaskFormLocationHeader location={taskDraft!.location} />
          <TaskItemSingleSelector onValueChange={this.onTaskValueChangeCallbackCreater('overallPotential')} title='整体商圈潜力' selectedValue={taskDraft && taskDraft.overallPotential} values={CONSTANT_OPTION_STORE_INFO.overallPotential} />
          <Line />
          <TaskItemSingleSelector onValueChange={this.onTaskValueChangeCallbackCreater('orientation')} title='门店类型' selectedValue={taskDraft && taskDraft.orientation} values={CONSTANT_OPTION_STORE_INFO.orientation} />
          <Line />
          <TaskItemSingleSelector onValueChange={this.onTaskValueChangeCallbackCreater('type')} title='开店类型' selectedValue={taskDraft && taskDraft.type} values={CONSTANT_OPTION_STORE_INFO.type} />
          {
            taskDraft && taskDraft.type === '外部加盟' ?
              (
                <View>
                  <Line />
                  <TaskItemSingleSelector onValueChange={this.onTaskValueChangeCallbackCreater('joinMode')} title='加盟模式' selectedValue={taskDraft && taskDraft.joinMode} values={CONSTANT_OPTION_STORE_INFO.joinMode} />
                  <Line />
                  {/* <TaskItemSingleSelector onValueChange={this.onTaskValueChangeCallbackCreater('joinType')} title='店铺类型' selectedValue={taskDraft && taskDraft.joinType} values={CONSTANT_OPTION_STORE_INFO.joinType} /> */}
                  {/* <Line /> */}
                  <TaskItemSingleSelector onValueChange={this.onTaskValueChangeCallbackCreater('joinRegion')} title='加盟区域' selectedValue={taskDraft && taskDraft.joinRegion} values={CONSTANT_OPTION_STORE_INFO.joinRegion} />
                </View>
              ) :
              null
          }
          <Gap />
          <TaskItemTextInput value={taskDraft && taskDraft.peakTimeFlow} onChangeText={this.onTaskValueChangeCallbackCreater('peakTimeFlow')} title='高峰期人流' keyboardType='numeric' placeholder='建议18:30-19:30门前人流' unit='人/小时' />
          <Line />
          <TaskItemTextArea value={taskDraft && taskDraft.businissStatus} onChangeText={this.onTaskValueChangeCallbackCreater('businissStatus')} title='商圈形态' placeholder='输入周边500米内企业、事业单位、大型购物广场、学校、酒店等。' />
          <TaskItemTextInput value={taskDraft && taskDraft.residenceNumber} onChangeText={this.onTaskValueChangeCallbackCreater('residenceNumber')} title='自然辐射住户' keyboardType='numeric' placeholder='输入自然辐射住户数' unit='户' />
          <Line />
          <TaskItemTextInput value={taskDraft && taskDraft.businessDistrictResidenceNumber} onChangeText={this.onTaskValueChangeCallbackCreater('businessDistrictResidenceNumber')} title='商圈规模总住户数' keyboardType='numeric' placeholder='输入商圈规模总住户数' unit='户' />
          <Line />
          <TaskItemSingleSelector onValueChange={this.onTaskValueChangeCallbackCreater('subdistrictQuality')} title='小区档次' selectedValue={taskDraft && taskDraft.subdistrictQuality} values={CONSTANT_OPTION_STORE_INFO.subdistrictQuality} />
          <Line />
          <TaskItemTextInput value={taskDraft && taskDraft.realEstatePrice} onChangeText={this.onTaskValueChangeCallbackCreater('realEstatePrice')} title='楼盘均价' keyboardType='numeric' placeholder='输入数值' />
          <TaskContinuteEditButton title='下一页' onPress={this.goNextPage} />
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }
}
export default connect<StateProps, DispatchProps, OwnProps, ReduxStore>(mapStateToProps, mapDispatchToProps)(TaskFormOne)
