import React from 'react'
import { View, Text, Image, TouchableOpacity, KeyboardAvoidingView, StatusBar, Platform, Keyboard, BackHandler } from 'react-native'
import { connect, MapStateToPropsParam, MapDispatchToPropsParam } from 'react-redux'
import { ReduxStore } from '../../reducers'
import { ThunkDispatch } from 'redux-thunk'
import { Action } from 'redux-actions'
import { NavigationScreenProp, ScrollView, Header } from 'react-navigation'
import { NavigationRoute } from 'react-navigation'
import { TaskFormLocationHeader, Line } from './FormOne'
import TaskItemSingleSelector from './TaskItemSingleSelector'
import TaskItemTextInput from './TaskItemTextInput'
import TaskItemTextArea from './TaskItemTextArea'
import TaskContinuteEditButton from './TaskContinuteEditButton'
import { CONSTANT_OPTION_STORE_INFO } from '../../constants'
import validateTask from '../../utility/validate-task';
import { taskDraftValuesChange, taskRemoteCreate, taskRemoteUpdate } from '../../actions/draft';
import Toast from 'react-native-root-toast'
import RivalItemComponent, { Corrival } from './RivalItemComponent'
import { HeaderItemComponent, HeaderLeftComponent } from '../home/Home';
import { TaskDraftModel } from '../../types/task-draft';
import { any } from 'prop-types';
import { IgnoreParametersActionFunction } from '../../actions';

interface RivalAddButtonProps {
  title: string
  onPress?: () => void
}

export class MultiItemAddButton extends React.Component<RivalAddButtonProps, any> {
  constructor(props: RivalAddButtonProps) {
    super(props);
  }

  public render() {
    return (
      <TouchableOpacity onPress={this.props.onPress} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, backgroundColor: 'white' }} >
        <Text style={{ color: "#000000", fontSize: 17 }}>{this.props.title}</Text>
        <Image source={require('../../assets/images/img_add2_38x38.png')} />
      </TouchableOpacity>
    )
  }
}

interface StateProps {
  taskDraft?: TaskDraftModel
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
    taskDraft: state.get('taskDrafts').get(taskId) && state.get('taskDrafts').get(taskId)!.get('data')
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
class TaskFormTwo extends React.Component<StateProps & DispatchProps & OwnProps, OwnState> {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<{ addTasks: () => {} }> }) => ({
    title: '门店信息（2/4）',
    headerTitleStyle: {
      textAlign: 'center',
      flex: 1,
      fontSize: 15,
    },
    headerTintColor: 'black',
    headerBackTitle: null,
    headerLeft: (<HeaderLeftComponent navigation={navigation} back={navigation.state.params!.fromAdd ? 4 : 3} checkTask={navigation.getParam('checkTasks')} saveTask={navigation.getParam('saveTasks')}></HeaderLeftComponent>),
    headerRight: (<HeaderItemComponent text='保存草稿' onPress={navigation.getParam('saveTasks')} />)
  })

  constructor(props: StateProps & DispatchProps & OwnProps) {
    super(props)

    this.props.navigation.setParams({
      saveTasks: this.saveTasks,
      checkTasks: this.checkTasks
    })
  }
  //检查是否有修改
  checkTasks = () => {
    return this.props.taskDraft ? this.props.taskDraft!.isDirty : false
  }

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

  private saveTasks = async () => {
    let checkTask = validateTask(this.props.taskDraft, true, 1)
    if (checkTask) {
      Toast.show(checkTask, {
        position: Toast.positions.CENTER
      })
      return
    }
    let task
    if (this.props.taskDraft!.createdAt) {
      task = await this.props.updateRemoteTask()
    } else {
      task = await this.props.createRemoteTask()
    }
    task && Toast.show("保存成功", {
      position: Toast.positions.CENTER
    })


  }

  private onTaskValueChangeCallbackCreater = (key: string) => (value: any) => {
    this.props.onLocalTaskValueChange({ [key]: value })
  }

  private goNextPage = () => {
    this.props.navigation.navigate('TaskFormThree', {
      taskId: this.props.navigation.state.params!.taskId,
      fromAdd: this.props.navigation.state.params!.fromAdd,
    })
  }

  private onAddRivalButtonPress = () => {
    let corrivals: Array<Corrival> = this.props.taskDraft!.corrivals
    if (!corrivals) corrivals = new Array<Corrival>()
    let lastCorrival = corrivals[corrivals.length - 1]
    if (lastCorrival === undefined || lastCorrival.name) {
      lastCorrival = ({ key: `${Date.now()}` } as Corrival)
      corrivals.push(lastCorrival)
      this.props.onLocalTaskValueChange({ corrivals })
    }
  }

  private onItemDeleteRivalCallbackCreater = (index: number) => () => {
    let corrivals: Array<Corrival> = []
    this.props.taskDraft!.corrivals.forEach((corrival, i) => {
      if (i !== index) {
        corrivals.push(corrival)
      }
    })
    this.props.onLocalTaskValueChange({ corrivals })
  }

  private onCorrivalValueChangeCallbackCreater = (index: number) => (rival: Corrival) => {
    const corrivals = this.props.taskDraft!.corrivals.map((corrival, i) => {
      return i === index ? rival : corrival
    })
    this.props.onLocalTaskValueChange({ corrivals })
  }

  render() {
    return (
      <KeyboardAvoidingView behavior={Platform.OS === 'android' ? undefined : 'padding'} style={{ flex: 1 }} keyboardVerticalOffset={Header.HEIGHT} >
        <StatusBar barStyle='dark-content' backgroundColor='white' animated={false} />
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: '#F6F6F6' }} >
          <TaskFormLocationHeader location={this.props.taskDraft!.location} />
          <TaskItemSingleSelector onValueChange={this.onTaskValueChangeCallbackCreater('place')} selectedValue={this.props.taskDraft && this.props.taskDraft.place} title='门店位置' values={CONSTANT_OPTION_STORE_INFO.place} />
          <Line />
          <TaskItemTextInput value={this.props.taskDraft && this.props.taskDraft.width} onChangeText={this.onTaskValueChangeCallbackCreater('width')} title='门店宽度' keyboardType='numeric' placeholder='输入门店宽度' unit='米' />
          <Line />
          <TaskItemTextInput value={this.props.taskDraft && this.props.taskDraft.length} onChangeText={this.onTaskValueChangeCallbackCreater('length')} title='门店长度' keyboardType='numeric' placeholder='输入门店长度' unit='米' />
          <Line />
          <TaskItemSingleSelector onValueChange={this.onTaskValueChangeCallbackCreater('hasSecondFloor')} selectedValue={this.props.taskDraft && this.props.taskDraft.hasSecondFloor} title='是否有二楼' values={CONSTANT_OPTION_STORE_INFO.hasSecondFloor} />
          <Line />
          <TaskItemTextArea value={this.props.taskDraft && this.props.taskDraft.adjacentStores} onChangeText={this.onTaskValueChangeCallbackCreater('adjacentStores')} title='左右相邻分别2-4个店铺名称' placeholder='输入店铺名称' />
          <TaskItemSingleSelector onValueChange={this.onTaskValueChangeCallbackCreater('temporaryParking')} selectedValue={this.props.taskDraft && this.props.taskDraft.temporaryParking} title='临时停车情况' values={CONSTANT_OPTION_STORE_INFO.temporaryParking} />
          <Line />
          <TaskItemSingleSelector onValueChange={this.onTaskValueChangeCallbackCreater('traffic')} selectedValue={this.props.taskDraft && this.props.taskDraft.traffic} title='门前整体交通便利性' values={CONSTANT_OPTION_STORE_INFO.traffic} />
          {/* <Line /> */}
          {/* <TaskItemSingleSelector onValueChange={this.onTaskValueChangeCallbackCreater('obstruction')} selectedValue={this.props.taskDraft && this.props.taskDraft.obstruction} title='门店周围遮挡情况' values={CONSTANT_OPTION_STORE_INFO.obstruction} /> */}
          <View style={{ height: 5 }} />
          <MultiItemAddButton onPress={this.onAddRivalButtonPress} title='竞争门店' />
          <Line />
          {
            this.props.taskDraft && this.props.taskDraft.corrivals && this.props.taskDraft.corrivals.map((corrival, index) => {
              return (<RivalItemComponent taskDraft={this.props.taskDraft} onCorrivalValueChange={this.onCorrivalValueChangeCallbackCreater(index)} corrival={corrival} onDeletePress={this.onItemDeleteRivalCallbackCreater(index)} key={corrival.key} maxCount={2} />)
            })
          }
          <TaskContinuteEditButton onPress={this.goNextPage} title='下一页' />
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }
}
export default connect<StateProps, DispatchProps, OwnProps, ReduxStore>(mapStateToProps, mapDispatchToProps)(TaskFormTwo)
