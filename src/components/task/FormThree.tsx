import React from 'react'
import { View, Text, TextInput, KeyboardTypeOptions, KeyboardAvoidingView, StatusBar, Platform, TouchableOpacity, BackHandler, Image } from 'react-native'
import { connect, MapStateToPropsParam, MapDispatchToPropsParam } from 'react-redux'
import { ReduxStore } from '../../reducers'
import { ThunkDispatch } from 'redux-thunk'
import { Action } from 'redux-actions'
import { NavigationScreenProp, ScrollView, Header } from 'react-navigation'
import { NavigationRoute } from 'react-navigation'
import { TaskFormLocationHeader, Line } from './FormOne'
import TaskItemSingleSelector from './TaskItemSingleSelector'
import TaskItemTextInput from './TaskItemTextInput'
import validateTask from '../../utility/validate-task';
import TaskItemTextArea from './TaskItemTextArea'
import TaskContinuteEditButton from './TaskContinuteEditButton'
import { taskDraftValuesChange, taskRemoteCreate, taskRemoteUpdate } from '../../actions/draft'
import Toast from 'react-native-root-toast'
import { CONSTANT_OPTION_STORE_INFO } from '../../constants'
import { HeaderItemComponent, HeaderLeftComponent } from '../home/Home'
import OptionItemSingleSelector from './TaskItemSingleSelector'
import { TaskDraftModel } from '../../types/task-draft';
import { IgnoreParametersActionFunction } from '../../actions';


interface TaskOptionalTextInputProps {
  title: string
  optionalTitle?: string
  options?: Array<string>
  textInputTitle?: string
  textInputUnit?: string
  textInputValue?: string
  textInputOptionalValue?: string
  textInputPlaceholder?: string
  keyboardType?: KeyboardTypeOptions

  onChangeText?: (value?: string | null) => void
}

interface TaskOptionalTextInputStates {
  optionItem?: string
}

class TaskOptionalTextInput extends React.Component<TaskOptionalTextInputProps, TaskOptionalTextInputStates> {

  private options = ['需要改造', '无需改造']

  constructor(props: TaskOptionalTextInputProps) {
    super(props);

    if (props.options) this.options = props.options

    this.state = {
      optionItem: this.props.textInputValue ? this.options[0] : this.options[1],
    }
  }

  private value?: string

  public onBlur = () => {
    if (this.value && this.value !== this.props.textInputValue) {
      this.props.onChangeText && this.props.onChangeText(this.value)
    }
  }

  private onChangeText = (value: string) => {
    this.value = value
  }

  private onOptionItemChange = (optionItem: string) => {
    this.setState({ optionItem })
    optionItem === this.options[1] && this.props.onChangeText && this.props.onChangeText(null)
  }

  public render() {
    return (
      <View style={{ backgroundColor: 'white' }} >
        <OptionItemSingleSelector selectedValue={this.state.optionItem} onValueChange={this.onOptionItemChange} title={this.props.title} values={this.options} />
        {
          this.state.optionItem && this.state.optionItem === this.options[0] ?
            (
              <View style={{ marginLeft: 20, marginRight: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
                <TextInput returnKeyType='done' defaultValue={this.props.textInputValue} onBlur={this.onBlur} onChangeText={this.onChangeText} keyboardType={this.props.keyboardType} placeholder={this.props.textInputPlaceholder} style={{ flex: 1, textAlign: 'right', marginRight: 5, height: 45 }} />
                <Text>{this.props.textInputUnit}</Text>
              </View>
            ) :
            null
        }
      </View>
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
class TaskFormThree extends React.Component<StateProps & DispatchProps & OwnProps, OwnState> {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<{ addTasks: () => {} }> }) => ({
    title: '门店信息（3/4）',
    headerTitleStyle: {
      textAlign: 'center',
      flex: 1,
      fontSize: 15,
    },
    headerTintColor: 'black',
    headerBackTitle: null,
    headerLeft: (<HeaderLeftComponent navigation={navigation} back={navigation.state.params!.fromAdd ? 5 : 4} checkTask={navigation.getParam('checkTasks')} saveTask={navigation.getParam('saveTasks')}></HeaderLeftComponent>),
    headerRight: (<HeaderItemComponent text='保存草稿' onPress={navigation.getParam('saveTasks')} />)
  });

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
    let checkTask = validateTask(this.props.taskDraft, true, 2)
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

  private onTaskValueChangeCallbackCreater = (key: string) => (value?: any) => {
    this.props.onLocalTaskValueChange({ [key]: value })
  }

  private goNextPage = () => {
    this.props.navigation.navigate('TaskFormFour', {
      taskId: this.props.navigation.state.params!.taskId,
      fromAdd: this.props.navigation.state.params!.fromAdd,
    })
  }

  render() {
    return (
      <KeyboardAvoidingView behavior={Platform.OS === 'android' ? undefined : 'padding'} style={{ flex: 1 }} keyboardVerticalOffset={Header.HEIGHT} >
        <StatusBar barStyle='dark-content' backgroundColor='white' animated={false} />
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: '#F6F6F6' }} >
          <TaskFormLocationHeader location={this.props.taskDraft!.location} />
          <TaskOptionalTextInput textInputValue={this.props.taskDraft && this.props.taskDraft.water} onChangeText={this.onTaskValueChangeCallbackCreater('water')} title='上下水' keyboardType='number-pad' optionalTitle='无需改造' textInputPlaceholder='输入改造费用' textInputTitle='需要改造' textInputUnit='元' />
          <Line />
          <TaskOptionalTextInput textInputValue={this.props.taskDraft && this.props.taskDraft.electricity} onChangeText={this.onTaskValueChangeCallbackCreater('electricity')} title='用电' keyboardType='number-pad' optionalTitle='无需改造' textInputPlaceholder='输入改造费用' textInputTitle='需要改造' textInputUnit='元' />
          <Line />
          <TaskOptionalTextInput textInputValue={this.props.taskDraft && this.props.taskDraft.airConditioner} onChangeText={this.onTaskValueChangeCallbackCreater('airConditioner')} title='空调主机位' keyboardType='number-pad' optionalTitle='无需改造' textInputPlaceholder='输入改造费用' textInputTitle='需要改造' textInputUnit='元' />
          <Line />
          <TaskOptionalTextInput textInputValue={this.props.taskDraft && this.props.taskDraft.broadband} onChangeText={this.onTaskValueChangeCallbackCreater('broadband')} title='宽带' keyboardType='number-pad' optionalTitle='无需改造' textInputPlaceholder='输入改造费用' textInputTitle='需要改造' textInputUnit='元' />
          <View style={{ height: 5 }} />
          <TaskItemTextInput value={this.props.taskDraft && this.props.taskDraft.firstYearRent} onChangeText={this.onTaskValueChangeCallbackCreater('firstYearRent')} title='店铺首年月租金' keyboardType='numeric' placeholder='输入金额' unit='元' />
          <Line />
          <TaskOptionalTextInput textInputValue={this.props.taskDraft && this.props.taskDraft.sublet} onChangeText={this.onTaskValueChangeCallbackCreater('sublet')} title='是否分租' optionalTitle='否' textInputPlaceholder='输入分租明细' options={['需要分租', '不分租']} textInputTitle='是' />
          <Line />
          <TaskItemTextInput value={this.props.taskDraft && this.props.taskDraft.leaseTerm} onChangeText={this.onTaskValueChangeCallbackCreater('leaseTerm')} title='租赁期限' keyboardType='numeric' placeholder='输入合同期限' unit='月' />
          <Line />
          <TaskItemTextArea value={this.props.taskDraft && this.props.taskDraft.rentIncreases} onChangeText={this.onTaskValueChangeCallbackCreater('rentIncreases')} title='租金递增情况' placeholder='输入递增情况，注明是否为二房东' />
          <TaskItemSingleSelector title='预计装修情况' selectedValue={this.props.taskDraft && this.props.taskDraft.estimatedRenovation} onValueChange={this.onTaskValueChangeCallbackCreater('estimatedRenovation')} values={CONSTANT_OPTION_STORE_INFO.estimatedRenovation} />
          <TaskItemTextInput value={this.props.taskDraft && this.props.taskDraft.transferFee} onChangeText={this.onTaskValueChangeCallbackCreater('transferFee')} title='转让费' keyboardType='numeric' placeholder='输入金额' unit='元' />
          <Line />
          <TaskItemTextInput value={this.props.taskDraft && this.props.taskDraft.entryFee} onChangeText={this.onTaskValueChangeCallbackCreater('entryFee')} title='进场费' keyboardType='numeric' placeholder='输入金额' unit='元' />
          <Line />
          <TaskItemTextInput value={this.props.taskDraft && this.props.taskDraft.agencyFee} onChangeText={this.onTaskValueChangeCallbackCreater('agencyFee')} title='中介费' keyboardType='numeric' placeholder='输入金额' unit='元' />
          <Line />
          <TaskItemTextInput value={this.props.taskDraft && this.props.taskDraft.staffQuartersFee} onChangeText={this.onTaskValueChangeCallbackCreater('staffQuartersFee')} title='宿舍预估月租金' keyboardType='numeric' placeholder='输入金额' unit='元' />
          <TaskContinuteEditButton onPress={this.goNextPage} title='下一页' />
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }
}
export default connect<StateProps, DispatchProps, OwnProps, ReduxStore>(mapStateToProps, mapDispatchToProps)(TaskFormThree)
