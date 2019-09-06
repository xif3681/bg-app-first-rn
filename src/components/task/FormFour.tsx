import React from 'react'
import { View, KeyboardAvoidingView, StatusBar, Platform, BackHandler, NetInfo } from 'react-native'
import { connect, MapStateToPropsParam, MapDispatchToPropsParam } from 'react-redux'
import { ReduxStore, ReduxStoreAsyncItemState } from '../../reducers'
import { ThunkDispatch } from 'redux-thunk'
import { Action } from 'redux-actions'
import { NavigationScreenProp, ScrollView, Header } from 'react-navigation'
import { NavigationRoute } from 'react-navigation'
import { TaskFormLocationHeader, Line } from './FormOne'
import TaskItemSingleSelector from './TaskItemSingleSelector'
import { HeaderItemComponent, HeaderLeftComponent } from '../home/Home'
import TaskItemTextInput from './TaskItemTextInput'
import TaskContinuteEditButton from './TaskContinuteEditButton'
import { taskDraftValuesChange, taskRemoteCreate, taskRemoteUpdate } from '../../actions/draft'
import { CONSTANT_OPTION_STORE_INFO } from '../../constants'
import Toast from 'react-native-root-toast'
import { TaskDraftModel } from '../../types/task-draft'
import validateTask from '../../utility/validate-task';
import TaskItemTextArea from './TaskItemTextArea';
import TaskStoreImagesComponent from './TaskStoreImagesComponent';
import { IgnoreParametersActionFunction } from '../../actions';
import { PaginationData } from '../../types';
import { ReportModel } from '../../types/report';
import { Map } from 'immutable';
import { BackgroundImageTaskModel } from '../../types/task-background';

interface StateProps {
  taskDraft?: ReduxStoreAsyncItemState<TaskDraftModel>,
  uploadBackgroundTask?:Map<string, BackgroundImageTaskModel>
}

interface DispatchProps {
  onLocalTaskValueChange: (object: { [key: string]: any }) => void
  createRemoteTask: IgnoreParametersActionFunction<typeof taskRemoteCreate>
  updateRemoteTask: IgnoreParametersActionFunction<typeof taskRemoteUpdate>
}

interface OwnProps {
  navigation: NavigationScreenProp<NavigationRoute>
}

interface OwnState { }

const mapStateToProps: MapStateToPropsParam<StateProps, OwnProps, ReduxStore> = (state, ownProps) => {
  const taskId = ownProps.navigation.state.params!.taskId
  return {
    taskDraft: state.get('taskDrafts').get(taskId),
    uploadBackgroundTask:state.get("uploadBackgroundTask")
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
class TaskFormFour extends React.Component<StateProps & DispatchProps & OwnProps, OwnState> {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<{ addTasks: () => {} }> }) => ({
    title: '门店信息（4/4）',
    headerTitleStyle: {
      textAlign: 'center',
      flex: 1,
      fontSize: 15
    },
    headerTintColor: 'black',
    headerBackTitle: null,
    headerLeft: (<HeaderLeftComponent navigation={navigation} back={navigation.state.params!.fromAdd ? 6 : 5} checkTask={navigation.getParam('isDirtyTask')} saveTask={navigation.getParam('saveDirtyTasks')}></HeaderLeftComponent>),
    headerRight: (<HeaderItemComponent text='保存草稿' onPress={navigation.getParam('saveDirtyTasks')} />)
  })

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

  private onTaskValueChangeCallbackCreater = (key: string) => (value: any) => {
    this.props.onLocalTaskValueChange({ [key]: value })
  }

  constructor(props: StateProps & DispatchProps & OwnProps) {
    super(props)

    this.props.navigation.setParams({
      saveDirtyTasks: this.saveDirtyTasks,
      isDirtyTask: this.isDirtyTask
    })
  }

  //检查是否有修改
  isDirtyTask = () => {
    return this.props.taskDraft ? this.props.taskDraft!.get('isDirty') : false
  }

  private saveDirtyTasks = async () => {
    let checkTask = validateTask(this.props.taskDraft!.get('data'), true, 3,this.props.uploadBackgroundTask)
    if (checkTask) {
      Toast.show(checkTask, {
        position: Toast.positions.CENTER
      })
      return
    }
    let task
    if (this.props.taskDraft!.get('data')!.createdAt) {
      task = await this.props.updateRemoteTask()
    } else {
      task = await this.props.createRemoteTask()
    }
    task && Toast.show("保存成功", {
      position: Toast.positions.CENTER
    })
  }

  private saveTasks = async () => {
    let checkTask = validateTask(this.props.taskDraft!.get('data'), true,4,this.props.uploadBackgroundTask)
    if (checkTask) {
      Toast.show(checkTask, {
        position: Toast.positions.CENTER
      })
      return
    }
    if (this.props.taskDraft!.get('data')!.createdAt) {
      if (!await this.props.updateRemoteTask()) {
        return
      }
    } else {
      if (!await this.props.createRemoteTask()) {
        return
      }
    }
    if (this.props.taskDraft && this.props.taskDraft.get('data')!._id) {
      this.props.navigation.navigate('ReportProfile', { taskId: this.props.taskDraft.get('data')!._id, fromAdd: this.props.navigation.state.params!.fromAdd })
    }
   
  }

  render() {
   
    const taskDraft = this.props.taskDraft!.get('data')
    return (
      <KeyboardAvoidingView behavior={Platform.OS === 'android' ? undefined : 'padding'} style={{ flex: 1 }} keyboardVerticalOffset={Header.HEIGHT} >
        <StatusBar barStyle='dark-content' backgroundColor='white' animated={false} />
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: '#F6F6F6' }} >
          <TaskFormLocationHeader location={taskDraft!.location} />
          <TaskItemTextInput value={taskDraft && taskDraft.transferorName} onChangeText={this.onTaskValueChangeCallbackCreater('transferorName')} title='转让人' placeholder='输入转让人姓名' />
          <Line />
          <TaskItemTextInput value={taskDraft && taskDraft.transferorPhone} keyboardType='phone-pad' onChangeText={this.onTaskValueChangeCallbackCreater('transferorPhone')} title='转让人电话' placeholder='输入转让人电话' />
          <Line />
          <TaskItemSingleSelector title='本人加分' selectedValue={taskDraft && taskDraft.personality} onValueChange={this.onTaskValueChangeCallbackCreater('personality')} values={CONSTANT_OPTION_STORE_INFO.personality} />
          <Line />
          <TaskItemTextArea value={taskDraft && taskDraft.personalityReason} onChangeText={this.onTaskValueChangeCallbackCreater('personalityReason')} title='加分原因' placeholder='输入加分原因' />
          <View style={{ height: 5 }} />
          <TaskStoreImagesComponent values={taskDraft && taskDraft.images} onImagesChange={this.onTaskValueChangeCallbackCreater('images')} />
          <TaskContinuteEditButton onPress={this.saveTasks} title='保存并预览报告' />
        </ScrollView>
      </KeyboardAvoidingView>
    )

  }
}
export default connect<StateProps, DispatchProps, OwnProps, ReduxStore>(mapStateToProps, mapDispatchToProps)(TaskFormFour)
