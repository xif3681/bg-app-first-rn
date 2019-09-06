import React, { useState } from 'react'
import { View, Image, Text, FlatList, TouchableOpacity, StatusBar, Platform, Alert, RefreshControl } from 'react-native'
import { connect, MapStateToPropsParam, MapDispatchToPropsParam } from 'react-redux'
import { ReduxStore, ReduxStoreAsyncItemState } from '../../reducers'
import { ThunkDispatch } from 'redux-thunk'
import { Action } from 'redux-actions'
import { NavigationScreenProp, SafeAreaView } from 'react-navigation'
import { NavigationRoute } from 'react-navigation'
import { TaskModel } from '../../types/task'
import { PaginationData } from '../../types'
import { taskDraftCreate, removeLocalTask } from '../../actions/draft';
import { FetchUserTasksActionFunction, fetchUserTasks, DeleteRemoteUserTaskActionFunction, deleteRemoteUserTask, UpdateRemoteUserTaskActionFunction, updateRemoteUserTask, FetchTaskPdfAsyncActionFunction, fetchTaskPdfAsync, FetchTaskActionFunction, fetchTask } from '../../actions/task';
import Modal from 'react-native-modal';
import { Line } from './FormOne';
import { AlertComponent } from '../common/Alert';
import Toast from 'react-native-root-toast';
import TaskListEmptyComponent from './TaskListEmptyView';
import validateTask from '../../utility/validate-task'
import { Map } from 'immutable'

interface TaskListItemComponentProps {
  model: TaskModel
  onPress: (task: TaskModel) => void
}

interface TaskListItemComponentStates {
  isOperatorPopupVisible: boolean
}

const TaskListItemComponent: React.FC<TaskListItemComponentProps> = ({ onPress, model }) => {
  const [state, setState] = useState<TaskListItemComponentStates>({
    isOperatorPopupVisible: false
  })

  const _onPress = () => {
    onPress && onPress(model)
  }
  return (
    <View>
      <TouchableOpacity onPress={_onPress} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', justifyContent: 'space-between', height: undefined, marginBottom: 1, paddingTop: 15, paddingBottom: 15, }} >
        <Image source={require('../../assets/images/img_tasklist2_36x36.png')} style={{ marginLeft: 15, marginRight: 15 }} />
        <Text style={{ flex: 1, color: "#000000", fontSize: 17 }} >{model.name}</Text>
      </TouchableOpacity>
    </View>
  );
}


interface StateProps {
  myTasks?: ReduxStoreAsyncItemState<PaginationData<TaskModel>>
  myTaskDetails: Map<string, ReduxStoreAsyncItemState<TaskModel>>
}

interface DispatchProps {
  taskDraftCreate: (taskId: string, draft: any) => void
  fetchUserTasks: FetchUserTasksActionFunction
  deleteRemoteUserTask: DeleteRemoteUserTaskActionFunction
  removeLocalTask: (taskId: string) => void
  updateRemoteUserTask: UpdateRemoteUserTaskActionFunction
  fetchTaskPdfAsync: FetchTaskPdfAsyncActionFunction
  fetchTask: FetchTaskActionFunction
}

interface OwnProps {
  navigation: NavigationScreenProp<NavigationRoute>
}

interface OwnState {
  isItemOperatorVisible: boolean
  isItemDeletePopupViewVisible: boolean
  isItemRenamePopupViewVisible: boolean
  isItemCommitViewVisible: boolean
}

const mapStateToProps: MapStateToPropsParam<StateProps, OwnProps, ReduxStore> = state => ({
  myTasks: state.get('taskList'),
  myTaskDetails: state.get('task')
})
const mapDispatchToProps: MapDispatchToPropsParam<DispatchProps, OwnProps> = (dispatch: ThunkDispatch<ReduxStore, null, Action<any>>) => ({
  fetchUserTasks: () => dispatch(fetchUserTasks()),
  taskDraftCreate: (taskId: string, draft: any) => dispatch(taskDraftCreate(taskId, draft)),
  deleteRemoteUserTask: (taskId: string) => dispatch(deleteRemoteUserTask(taskId)),
  removeLocalTask: (taskId: string) => dispatch(removeLocalTask(taskId)),
  updateRemoteUserTask: (taskId: string, name: string) => dispatch(updateRemoteUserTask(taskId, name)),
  fetchTaskPdfAsync: (taskId: string) => dispatch(fetchTaskPdfAsync(taskId)),
  fetchTask: (taskId: string) => dispatch(fetchTask(taskId))
})
class TaskListComponent extends React.Component<StateProps & DispatchProps & OwnProps, OwnState> {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<{ saveTasks: () => {} }> }) => ({
    title: '拓店任务列表',
    headerTintColor: 'black',
    headerBackTitle: null
  })

  private selectedTask?: TaskModel
  private operatingAction?: () => void

  constructor(props: StateProps & DispatchProps & OwnProps) {
    super(props)

    this.state = {
      isItemOperatorVisible: false,
      isItemDeletePopupViewVisible: false,
      isItemRenamePopupViewVisible: false,
      isItemCommitViewVisible: false
    }
  }
  // componentDidUpdate() {
  //   if (this.props.myTaskDetails && this.selectedTask && this.selectedTask._id && this.props.myTaskDetails.get(this.selectedTask._id) && !this.state.isItemOperatorVisible) {
  //     const taskDraftOperatingError = this.props.myTaskDetails!.get(this.selectedTask._id!)!.get('error')
  //     if (taskDraftOperatingError) {
  //       Toast.show(taskDraftOperatingError.message, {
  //         position: Toast.positions.CENTER
  //       })
  //     }
  //   }
  // }

  private hiddeItemOperatorPopupView = () => {
    this.setState({
      isItemOperatorVisible: false,
      isItemDeletePopupViewVisible: false,
      isItemRenamePopupViewVisible: false,
      isItemCommitViewVisible: false
    })
  }

  private onTaskItemPress = (task: TaskModel) => {
    this.selectedTask = task
    this.setState({ isItemOperatorVisible: true })
  }

  private onTaskItemRenamePress = () => {
    if (!this.selectedTask) return
    this.setState({ isItemOperatorVisible: false })
    this.operatingAction = () => this.setState({ isItemRenamePopupViewVisible: true })
  }


  private onTaskItemEditPress = async () => {
    if (!this.selectedTask) return
    this.hiddeItemOperatorPopupView()
    const task = await this.props.fetchTask(this.selectedTask._id!)
    if (!task) {
      return
    }
    this.props.taskDraftCreate(this.selectedTask._id!, task)
    this.props.navigation.navigate('TaskMapView', {
      taskId: this.selectedTask._id,
      intent: 'task'
    })
    this.selectedTask = undefined
  }

  private onTaskItemReportPreviewPress = async () => {
    this.setState({ isItemOperatorVisible: false })
    if (!this.selectedTask) return
    const task = await this.props.fetchTask(this.selectedTask._id!)
    if (task) {
      let checkTask = validateTask(task)
      if (checkTask) {
        Toast.show(checkTask, {
          position: Toast.positions.CENTER
        })
        return
      }
      this.props.navigation.navigate('ReportProfile', { taskId: this.selectedTask._id, fromList: true })
    }
  }

  private onTaskItemReportGeneratePress = async () => {
    if (!this.selectedTask || !this.selectedTask._id) return
    const task = await this.props.fetchTask(this.selectedTask._id!)
    if (task) {
      let checkTask = validateTask(task)
      if (checkTask) {
        Toast.show(checkTask, {
          position: Toast.positions.CENTER
        })
        return
      }
      this.setState({ isItemOperatorVisible: false })
      this.operatingAction = () => this.setState({ isItemCommitViewVisible: true })
    }
  }

  private onTaskItemDeletePress = () => {
    if (!this.selectedTask) return
    this.setState({ isItemOperatorVisible: false })
    this.operatingAction = () => this.setState({ isItemDeletePopupViewVisible: true })
  }

  private onTaskItemDeleteConfirmPress = () => {
    if (!this.selectedTask) return
    if (this.selectedTask._id) {
      this.props.deleteRemoteUserTask(this.selectedTask._id!)
    } else {
      const taskId = `${this.selectedTask.location!.longitude},${this.selectedTask.location!.latitude}`
      this.props.removeLocalTask(taskId)
      /// 刷新本地任务草稿
    }
    this.hiddeItemOperatorPopupView()
  }

  private onTaskRenameConfirmPress = (name: string) => {
    if (!name) {
      Toast.show('重命名不能为空', {
        position: Toast.positions.BOTTOM
      })
      return
    }
    if (!this.selectedTask) return
    if (this.selectedTask._id) {
      this.props.updateRemoteUserTask(this.selectedTask._id, name)
    } else {
      const taskId = `${this.selectedTask.location!.longitude},${this.selectedTask.location!.latitude}`
      /// 刷新本地任务草稿
    }
    this.hiddeItemOperatorPopupView()
  }

  private onTaskCommitConfirmPress = async () => {
    const response = await this.props.fetchTaskPdfAsync(this.selectedTask!._id!)
    if (response) {
      Toast.show('报告生成请求成功', {
        position: Toast.positions.CENTER
      })
    } else {
      Toast.show('报告生成请求失败，请稍后重试', {
        position: Toast.positions.CENTER
      })
    }
    this.hiddeItemOperatorPopupView()
  }

  private onRefresh = () => {
    this.props.fetchUserTasks()
  }

  private onTaskItemOperatorPopupViewHide = () => {
    this.operatingAction && this.operatingAction()
    this.operatingAction = undefined
  }

  private renderItem = ({ item }: { item: TaskModel }) => (<TaskListItemComponent model={item} onPress={this.onTaskItemPress} />)

  private keyExtractor = (item: TaskModel) => item._id || item.location!.formattedAddress!

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#F1F1F1' }} >
        <AlertComponent onCancelPress={this.hiddeItemOperatorPopupView} onConfirmPress={this.onTaskItemDeleteConfirmPress} title='确定删除该任务吗？' confirmTitle='确定' cancelTitle='取消' isVisible={this.state.isItemDeletePopupViewVisible} />
        <AlertComponent onCancelPress={this.hiddeItemOperatorPopupView} onConfirmPress={this.onTaskRenameConfirmPress} title='重命名' textInputSubtitle confirmTitle='修改' cancelTitle='取消' isVisible={this.state.isItemRenamePopupViewVisible} />
        <AlertComponent onCancelPress={this.hiddeItemOperatorPopupView} onConfirmPress={this.onTaskCommitConfirmPress} title='将报告提交至OA发起新店流程，报告内容将不可修改，是否继续？' confirmTitle='确定' cancelTitle='取消' isVisible={this.state.isItemCommitViewVisible} />
        <Modal onBackdropPress={this.hiddeItemOperatorPopupView} backdropOpacity={0.1} isVisible={this.state.isItemOperatorVisible} onModalHide={this.onTaskItemOperatorPopupViewHide} style={{ margin: 0, justifyContent: 'flex-end' }} >
          <SafeAreaView style={{ backgroundColor: 'white' }} >
            {
              Platform.OS === 'android' ? <StatusBar barStyle='light-content' backgroundColor='rgba(0, 0, 0, 0.1)' animated={false} /> : null
            }
            <TouchableOpacity onPress={this.onTaskItemEditPress} style={{ height: 45, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }} >
              <Text style={{ fontSize: 16, color: "#000000" }}>编辑</Text>
            </TouchableOpacity>
            <Line />
            <TouchableOpacity onPress={this.onTaskItemReportPreviewPress} style={{ height: 45, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }} >
              <Text style={{ fontSize: 16, color: "#000000" }}>预览报告</Text>
            </TouchableOpacity>
            <Line />
            <TouchableOpacity onPress={this.onTaskItemReportGeneratePress} style={{ height: 45, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }} >
              <Text style={{ fontSize: 16, color: "#000000" }}>提交报告流程</Text>
            </TouchableOpacity>
            <Line />
            <TouchableOpacity onPress={this.onTaskItemRenamePress} style={{ height: 45, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }} >
              <Text style={{ fontSize: 16, color: "#000000" }}>重命名</Text>
            </TouchableOpacity>
            <Line />
            <TouchableOpacity onPress={this.onTaskItemDeletePress} style={{ height: 45, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }} >
              <Text style={{ fontSize: 16, color: "#E13333" }} >删除</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </Modal>
        <FlatList
          data={this.props.myTasks && this.props.myTasks.get('data') && this.props.myTasks.get('data')!.data || null}
          renderItem={this.renderItem}
          ListHeaderComponent={<View style={{ height: 5 }} />}
          ListEmptyComponent={<TaskListEmptyComponent content="这里列表为空..." />}
          // refreshing={false}
          showsVerticalScrollIndicator={false}
          // onRefresh={this.onRefresh}
          keyExtractor={this.keyExtractor}
          refreshControl={
            <RefreshControl
              title={'下拉刷新'}
              refreshing={false}
              onRefresh={this.onRefresh} />
          }

        />
      </View>
    )
  }
}
export default connect<StateProps, DispatchProps, OwnProps, ReduxStore>(mapStateToProps, mapDispatchToProps)(TaskListComponent)
