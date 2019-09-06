import React from 'react'
import { View, Image, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import { connect, MapStateToPropsParam, MapDispatchToPropsParam } from 'react-redux'
import { ReduxStore, ReduxStoreAsyncItemState } from '../../reducers'
import { ThunkDispatch } from 'redux-thunk'
import { Action } from 'redux-actions'
import { TaskModel } from '../../types/task'
import { Gap } from './FormOne'
import { fetchTask } from '../../actions/task'
import taskValidate from '../../utility/validate-task'
import { IntentionStoreModel } from '../../types/intention-store';
import Toast from 'react-native-root-toast';
import validateTask from '../../utility/validate-task';

interface StateProps {
  taskDetals?: ReduxStoreAsyncItemState<TaskModel>
}

interface DispatchProps {
  fetchTask: () => void
}

interface OwnProps {
  task?: TaskModel
  intentionStore?: IntentionStoreModel
  onPress?: (task: TaskModel) => void
  onIntentionStorePress?: (task: IntentionStoreModel) => void
}

interface OwnState { }

const mapStateToProps: MapStateToPropsParam<StateProps, OwnProps, ReduxStore> = (state, ownProps) => {
  if (!ownProps.task) {
    return {
      taskDetals: undefined
    }
  }
  const taskId = ownProps.task._id
  return {
    taskDetals: state.get('task').get(taskId!)
  }
}
const mapDispatchToProps: MapDispatchToPropsParam<DispatchProps, OwnProps> = (dispatch: ThunkDispatch<ReduxStore, null, Action<any>>, ownProps) => {
  if (!ownProps.task) {
    return {
      fetchTask: () => { }
    }
  }
  const taskId = ownProps.task._id
  return {
    
    fetchTask: () => dispatch(fetchTask(taskId!))
  }
}
class TaskInformationPopupComponent extends React.PureComponent<StateProps & DispatchProps & OwnProps, OwnState> {

  constructor(props: StateProps & DispatchProps & OwnProps) {
    super(props)
  }

  componentDidMount() {
    this.props.fetchTask()
  }

  private onShowMorePress = () => {
    if (this.props.intentionStore && this.props.onIntentionStorePress) {
      this.props.onIntentionStorePress(this.props.intentionStore)
      return
    }
    try {
      if (!this.props.taskDetals || !this.props.taskDetals.get('data')) throw new Error('获取任务详情错误，请重试')
      taskValidate(this.props.taskDetals.get('data'))
      this.props.onPress && this.props.onPress(this.props.taskDetals.get('data')!)
    } catch (error) {
      Toast.show(error.message, {
        position: Toast.positions.CENTER
      })
    }
  }

  public render() {
   
    const isTaskDetailVisible = this.props.taskDetals && !validateTask(this.props.taskDetals.get('data'))
    return (
      <View style={{ flexDirection: 'row', margin: 10 }} >
        <Image source={require('../../assets/images/img_pagoda_store2_74x74.png')} />
        <View style={{ flex: 1, marginLeft: 10, justifyContent: 'space-between' }} >
          {
            this.props.task && (<Text style={{ color: '#000000', fontSize: 16 }}>{this.props.task.name}</Text>)
          }
          {
            this.props.intentionStore && (<Text style={{ color: '#000000', fontSize: 16 }}>{this.props.intentionStore.name}</Text>)
          }
          <Gap />
          {
            this.props.task && <Text style={{ color: '#1ADF8E', fontSize: 14 }} >拓展中</Text>
          }
        </View>
        {
          this.props.task && this.props.taskDetals && this.props.taskDetals.get('data') ?
            (
              <TouchableOpacity onPress={this.onShowMorePress} style={{ backgroundColor: isTaskDetailVisible ? '#F5BA04' : '#eeeeee', height: 32, width: 81, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginLeft: 5 }}  disabled={!isTaskDetailVisible}>
                <Text style={{ color: 'white', fontSize: 17 }} >详情</Text>
              </TouchableOpacity>
            ) : this.props.task && (
              <View style={{ backgroundColor: '#F5BA04', height: 32, width: 81, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginLeft: 5 }} >
                <ActivityIndicator animating={this.props.taskDetals && this.props.taskDetals.get('isLoading')} hidesWhenStopped />
              </View>
            )
        }
        {
          this.props.intentionStore ?
            (
              <TouchableOpacity onPress={this.onShowMorePress} style={{ backgroundColor: '#F5BA04', height: 32, width: 81, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginLeft: 5 }} >
                <Text style={{ color: 'white', fontSize: 17 }} >详情</Text>
              </TouchableOpacity>
            ) : null
        }
      </View>
    )
  }
}
export default connect<StateProps, DispatchProps, OwnProps, ReduxStore>(mapStateToProps, mapDispatchToProps)(TaskInformationPopupComponent)
