import React from 'react'
import { ScrollView, View, Text, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, NetInfo } from 'react-native'
import { connect, MapStateToPropsParam, MapDispatchToPropsParam } from 'react-redux'
import { ReduxStoreAsyncItemState, ReduxStore } from '../../reducers'
import { ThunkDispatch } from 'redux-thunk'
import { Action } from 'redux-actions'
import { NavigationScreenProp, Header } from 'react-navigation'
import { NavigationRoute } from 'react-navigation'
import { TaskFormLocationHeader, Line } from './FormOne'
import TaskItemTextInput from './TaskItemTextInput'
import TaskContinuteEditButton from './TaskContinuteEditButton'
import { MultiItemAddButton } from './FormTwo'
import moment from 'moment'
import Toast from 'react-native-root-toast'
import { IntentionStoreModel } from '../../types/intention-store';
import { isEmpty } from 'lodash'
import {
  updateAllIntentionStores, UpdateAllIntentionStoresActionFunction, intentionShopsActionFunction, intentionShops,
  deleteCommunicate, DeleteCommunicateActionFunction, insertCommunicate, InsertCommunicateActionFunction, patchCommunicationRecords, PatchCommunicationRecordsActionFunction
} from '../../actions/intention-stores';
import { PaginationData } from '../../types';

interface CommunicateLogItemComponentProps {
  onDeletePress: () => void
  placeholder?: string
  OnInput?: (decs: string) => void
  time?: string
  value?: string
  editable?: boolean
}

let deleteCommunicateList: string[] = []//删除列表

const CommunicateLogItemComponent: React.FC<CommunicateLogItemComponentProps> = ({ onDeletePress, placeholder, OnInput, time, value, editable }) => {

  const OnDelete = () => {
    onDeletePress()
  }

  return (
    <View style={{ backgroundColor: 'white' }} >
      <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }} >
        <TouchableOpacity onPress={OnDelete} style={{ marginRight: 10, height: 20, width: 20 }} >
          <Image source={require('../../assets/images/img_delete_38x38.png')} style={{ flex: 1, height: undefined, width: undefined }} />
        </TouchableOpacity>
        <Text style={{ flex: 1 }} >沟通日期</Text>
        <Text style={{ color: "#C8C7CC" }}>{time}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10, marginTop: 0, marginLeft: 40 }} >
        <TextInput multiline={true} underlineColorAndroid="transparent" placeholder={placeholder} style={{ flex: 1, height: 100, marginTop: 10, borderColor: '#F1F1F1', borderWidth: 1, textAlignVertical: "top" }} onChangeText={OnInput} value={value} editable={editable} />
      </View>
    </View>
  );
}

interface StateProps {
  token: ReduxStoreAsyncItemState<string>,
  intentionStoreList?: ReduxStoreAsyncItemState<PaginationData<IntentionStoreModel>>
}

interface DispatchProps {
  updateAllIntentionStores: UpdateAllIntentionStoresActionFunction
  intentionShops: intentionShopsActionFunction
  deleteCommunicate: DeleteCommunicateActionFunction
  patchCommunicationRecords: PatchCommunicationRecordsActionFunction
  insertCommunicate: InsertCommunicateActionFunction
}

interface OwnProps {
  navigation: NavigationScreenProp<NavigationRoute>

}

interface OwnState {
  isEdit: boolean
}

const mapStateToProps: MapStateToPropsParam<StateProps, OwnProps, ReduxStore> = state => ({
  token: state.get('token'),
  intentionStoreList: state.get('intentionStores')
})
const mapDispatchToProps: MapDispatchToPropsParam<DispatchProps, OwnProps> = (dispatch: ThunkDispatch<ReduxStore, null, Action<any>>) => ({
  updateAllIntentionStores: (taskId: string | undefined, data: any) => dispatch(updateAllIntentionStores(taskId, data)),
  intentionShops: (data: any) => dispatch(intentionShops(data)),
  patchCommunicationRecords: (taskId: string | undefined, content: String) => dispatch(patchCommunicationRecords(taskId, content)),
  deleteCommunicate: (id: string) => dispatch(deleteCommunicate(id)),
  insertCommunicate: (taskId: string | undefined, data: any) => dispatch(insertCommunicate(taskId, data)),
})
class IntentionStore extends React.Component<StateProps & DispatchProps & OwnProps, OwnState & Partial<IntentionStoreModel>> {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<{ addTasks: () => {} }> }) => ({
    title: '意向店信息完善',
    headerTintColor: 'black',
    headerBackTitle: null
  });

  spinner = false

  constructor(props: StateProps & DispatchProps & OwnProps) {
    super(props)
    if (props.navigation.state.params && props.navigation.state.params!.task) {
      props.navigation.state.params!.communicationRecords.forEach((element: { key: number; }, index: number) => {
        element.key = new Date().getTime() + index
      });
      this.state = {
        ...props.navigation.state.params!.task,
        communicationRecords: props.navigation.state.params!.communicationRecords.length > 0 ? props.navigation.state.params!.communicationRecords : [],
        isEdit: true
      }
    } else {
      this.state = {
        communicationRecords: [],
        location: (this.props.navigation.state.params && this.props.navigation.state.params.location),
        isEdit: false
      }
    }
  }

  // componentDidUpdate() {
  //   if (this.props.intentionStoreList && this.spinner && !this.props.intentionStoreList.get("isLoading")) {
  //     const intentionStoreListError = this.props.intentionStoreList!.get('error')
  //     if (intentionStoreListError) {
  //       Toast.show(intentionStoreListError.message, {
  //         position: Toast.positions.CENTER
  //       })
  //       this.spinner = false
  //     }
  //   }
  // }

  private _addCommunicate = () => {
    const { communicationRecords } = this.state
    if (communicationRecords!.length == 0) {
      this.setState({
        communicationRecords: [{ time: moment().format('YYYY-MM-DD'), content: "", key: new Date().getTime() }].concat(communicationRecords!)
      })
      return
    }
    communicationRecords!.forEach((element, index, array) => {
      if (!element.content) {
        Toast.show("请填写沟通记录", {
          position: Toast.positions.CENTER
        })
        return
      }
      if (array.length - 1 == index) {
        this.setState({
          communicationRecords: [{ time: moment().format('YYYY-MM-DD'), content: "", key: new Date().getTime() }].concat(communicationRecords!)
        })
      }
    });

  }

  //修改input
  private _checkInput = (index: number) => (content: string) => {
    let list = this.state.communicationRecords!
    list[index].content = content
    list[index].isEdit = true
    this.setState({
      communicationRecords: list
    })
  }

  private _OnDeleteCommunication = (position: number) => () => {
    if (this.state.communicationRecords![position]._id != null) {
      deleteCommunicateList.push(this.state.communicationRecords![position]._id!)
    }
    let list = JSON.parse(JSON.stringify(this.state.communicationRecords))
    list.splice(position, 1)
    this.setState({
      communicationRecords: list
    })
  }

  //提交内容
  private _OnCommit = async () => {
    const {  assignor, isEdit, communicationRecords } = this.state
    let response = null
    if (this.spinner) {
      return
    }
    if (isEmpty(assignor)) {
      Toast.show("转让人不能为空", {
        position: Toast.positions.CENTER
      })
      return
    }
    let self = this
    this.spinner = true
    //批量删除
    if (deleteCommunicateList.length > 0) {
      deleteCommunicateList.forEach(v => {
        this.props.deleteCommunicate(v)
      })
    }
    if (isEdit) {
      communicationRecords!.forEach(element => {
        if (element._id == null) {
          this.props.insertCommunicate(this.state._id, element)
        } else {
          if (element.isEdit) {
            element.content ? this.props.patchCommunicationRecords(element._id, element.content)
              : this.props.deleteCommunicate(element._id)
          }
        }
      });
      response = await this.props.updateAllIntentionStores(this.state._id, this.state)
    } else {
      response = await this.props.intentionShops(this.state)
    }
    if (response) {
      Toast.show("提交成功", {
        position: Toast.positions.CENTER,
        duration: Toast.durations.SHORT,
        onHidden() {
          isEdit?self.props.navigation.pop(2):self.props.navigation.popToTop()
        }
      })
    }else{
      this.spinner = false
    }
  }

  _isPoneAvailable = (str: string) => {
    let myreg = /^[1][3,4,5,7,8][0-9]{9}$/
    if (str.length == 0 || str == null) {
      return false;
    } else if (!myreg.test(str)) {
      return false;
    } else {
      return true;
    }
  }

  render() {
    const { communicationRecords } = this.state
    return (
      <KeyboardAvoidingView behavior={Platform.OS === 'android' ? undefined : 'padding'} style={{ flex: 1 }} keyboardVerticalOffset={Header.HEIGHT} >
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: '#F6F6F6' }} >
          <TaskFormLocationHeader location={this.state.location} />
          <TaskItemTextInput title='转让人' placeholder='输入转让人姓名'
            onChangeText={(assignor: any) => this.setState({ assignor })} value={this.state.assignor} />
          <Line />
          <TaskItemTextInput title='转让人电话' keyboardType='phone-pad' placeholder='输入转让人电话'
            onChangeText={(assignorContactInformation: any) => this.setState({ assignorContactInformation })} value={this.state.assignorContactInformation} />
          <Line />
          <TaskItemTextInput title='租金' keyboardType='number-pad' placeholder='输入金额' unit='元'
            onChangeText={(rent: any) => this.setState({ rent })} value={this.state.rent} />
          <Line />
          <TaskItemTextInput title='转让费' keyboardType='number-pad' placeholder='输入金额' unit='元'
            onChangeText={(transferFee: any) => this.setState({ transferFee })} value={this.state.transferFee} />
          <Line />
          <TaskItemTextInput title='面积' keyboardType='number-pad' placeholder='输入面积' unit='平方米'
            onChangeText={(area: any) => this.setState({ area })} value={this.state.area} />
          <Line />
          <MultiItemAddButton title='沟通记录' onPress={this._addCommunicate} />
          {
            communicationRecords!.map((item, index) => {
              return (<CommunicateLogItemComponent placeholder='输入沟通内容及结论'
                time={item.time}
                onDeletePress={this._OnDeleteCommunication(index)}
                OnInput={this._checkInput(index)}
                key={item.key}
                // editable={item._id==null} 
                value={item.content} />)
            })
          }
          <TaskContinuteEditButton title={this.state.isEdit ? "修改" : "保存"} onPress={() => this._OnCommit()} />
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }
}
export default connect<StateProps, DispatchProps, OwnProps, ReduxStore>(mapStateToProps, mapDispatchToProps)(IntentionStore)
