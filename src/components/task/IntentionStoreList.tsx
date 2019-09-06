import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { View, Image, Text, TouchableOpacity, StatusBar, Alert, RefreshControl } from 'react-native'
import { connect, MapStateToPropsParam, MapDispatchToPropsParam } from 'react-redux'
import { ReduxStore, ReduxStoreAsyncItemState } from '../../reducers'
import { ThunkDispatch } from 'redux-thunk'
import { Action } from 'redux-actions'
import { NavigationScreenProp, FlatList, SafeAreaView } from 'react-navigation'
import { NavigationRoute } from 'react-navigation'
import Toast from 'react-native-root-toast'
import { TaskModel } from '../../types/task'
import { Line } from './FormOne';
import { PaginationData } from '../../types'
import Modal from 'react-native-modal';
import { AlertComponent } from '../common/Alert';
import { updateIntentionStores, deleteIntentionStores, UpdateIntentionStoresActionFunction, DeleteIntentionStoresActionFunction, fetchUserIntentionStores, FetchUserIntentionStoresActionFunction } from '../../actions/intention-stores';
import { IntentionStoreModel } from '../../types/intention-store';
import TaskListEmptyComponent from './TaskListEmptyView';

interface IntentionListItemComponentProps {
  model: IntentionStoreModel
  onPress: (task: IntentionStoreModel) => void
  onMorePress?: (task: IntentionStoreModel) => void
}

const IntentionListItemComponent: React.SFC<IntentionListItemComponentProps> = ({ model, onPress, onMorePress }) => {

  const _onPress = () => {
    onPress && onPress(model)
  }
  const _onMorePress = () => {
    onMorePress && onMorePress(model)
  }
  return (
    <View>
      <TouchableOpacity onPress={_onPress} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', justifyContent: 'space-between', marginBottom: 1, paddingTop: 15, paddingBottom: 15, }} >
        <Image source={require('../../assets/images/img_unopen_store_36x36.png')} style={{ marginLeft: 15, marginRight: 15 }} />
        <Text style={{ flex: 1, fontSize: 17, color: "#000000" }} >{model.name}</Text>
      </TouchableOpacity>
    </View>
  );
}


interface StateProps {
  intentionStoreList?: ReduxStoreAsyncItemState<PaginationData<IntentionStoreModel>>
}

interface DispatchProps {
  updateIntentionStores: UpdateIntentionStoresActionFunction
  deleteIntentionStores: DeleteIntentionStoresActionFunction
  fetchUserIntentionStores: FetchUserIntentionStoresActionFunction
}

interface OwnProps {
  navigation: NavigationScreenProp<NavigationRoute>
}

interface OwnState {
  isItemOperatorVisible: boolean
  isItemDeletePopupViewVisible: boolean
  isItemRenamePopupViewVisible: boolean
}

const mapStateToProps: MapStateToPropsParam<StateProps, OwnProps, ReduxStore> = state => ({
  intentionStoreList: state.get('intentionStores')
})
const mapDispatchToProps: MapDispatchToPropsParam<DispatchProps, OwnProps> = (dispatch: ThunkDispatch<ReduxStore, null, Action<any>>) => ({
  deleteIntentionStores: (taskId: string) => dispatch(deleteIntentionStores(taskId)),
  updateIntentionStores: (taskId: string, data: string) => dispatch(updateIntentionStores(taskId, data)),
  fetchUserIntentionStores: () => dispatch(fetchUserIntentionStores())
})

const IntentionListComponent: React.FC<StateProps & DispatchProps & OwnProps> = ({ navigation, updateIntentionStores, deleteIntentionStores, fetchUserIntentionStores, intentionStoreList }) => {
  // static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<{}> }) => ({
  //   title: '意向店',
  //   headerTintColor: 'black',
  //   headerBackTitle: null
  // })

  const selectedTask = useRef<IntentionStoreModel>()

  const operatingAction = useRef<() => void>()

  const [state, setState] = useState<OwnState>({
    isItemOperatorVisible: false,
    isItemDeletePopupViewVisible: false,
    isItemRenamePopupViewVisible: false
  })

  const hiddeItemOperatorPopupView = useCallback(() => {
    setState({
      isItemOperatorVisible: false,
      isItemDeletePopupViewVisible: false,
      isItemRenamePopupViewVisible: false
    })
  }, [])

  const onIntentionStoreItemPress = (task: IntentionStoreModel) => {
    selectedTask.current = task
    setState({ ...state, isItemOperatorVisible: true })
  }

  const onIntentionStoreItemMorePress = (task: IntentionStoreModel) => {
    selectedTask.current = task
    setState({ ...state, isItemOperatorVisible: true })

  }



  const onTaskItemDetailPress = useCallback(() => {
    if (!selectedTask) return
    navigation.navigate('IntentionStoreDetail', {
      task: selectedTask.current
    })
    hiddeItemOperatorPopupView()
  }, [])

  const onTaskItemRenamePress = useCallback(() => {
    if (!selectedTask) return
    setState({ ...state, isItemOperatorVisible: false })
    operatingAction.current = () => setState({ ...state, isItemOperatorVisible: false, isItemRenamePopupViewVisible: true })

  }, [])

  const onTaskRenameConfirmPress = useCallback((name: string) => {
    if (!name) {
      Toast.show('重命名不能为空', {
        position: Toast.positions.BOTTOM
      })
      return
    }
    if (!selectedTask) return
    if (selectedTask.current!._id) {
      updateIntentionStores(selectedTask.current!._id, name)
    } else {
      const taskId = `${selectedTask.current!.location!.longitude},${selectedTask.current!.location!.latitude}`
      /// 刷新本地任务草稿
    }
    hiddeItemOperatorPopupView()
  }, [])

  const onTaskItemOperatorPopupViewHide = () => {
    console.log(operatingAction)
    operatingAction && operatingAction.current!()
    operatingAction.current = undefined
  }



  const onTaskItemDeletePress = useCallback(() => {
    if (!selectedTask) return
    setState({ ...state, isItemOperatorVisible: false })
    operatingAction.current = () => setState({ ...state, isItemOperatorVisible: false, isItemDeletePopupViewVisible: true })
  }, [])

  const onTaskItemDeleteConfirmPress = useCallback(async () => {
    if (!selectedTask) return
    setState({ ...state, isItemOperatorVisible: false })
    hiddeItemOperatorPopupView()
    if (await deleteIntentionStores(selectedTask.current!._id!)) {
      Toast.show("删除成功", {
        position: Toast.positions.CENTER,
        duration: Toast.durations.SHORT,
      })
    }
  }, [])

  const renderItem = ({ item }: { item: IntentionStoreModel }) => (<IntentionListItemComponent model={item} onPress={onIntentionStoreItemPress} onMorePress={onIntentionStoreItemMorePress} />)

  const keyExtractor = (item: IntentionStoreModel) => item._id || item.location!.formattedAddress!

  const Platform = require('Platform');


  return (
    <View style={{ flex: 1, backgroundColor: '#F1F1F1' }} >
      <FlatList
        data={intentionStoreList && intentionStoreList.get('data') && intentionStoreList.get('data')!.data || null}
        renderItem={renderItem}
        // onRefresh={fetchUserIntentionStores}
        // refreshing={false}
        ListHeaderComponent={<View style={{ height: 5 }} />}
        ListEmptyComponent={(intentionStoreList && !intentionStoreList.get("isLoading")) ? <TaskListEmptyComponent content="这里列表为空..." /> : null}
        keyExtractor={keyExtractor}
        refreshControl={
          <RefreshControl
            title={'下拉刷新'}
            refreshing={false}
            onRefresh={fetchUserIntentionStores} />
        }
      />
      <AlertComponent onCancelPress={hiddeItemOperatorPopupView} onConfirmPress={onTaskItemDeleteConfirmPress} title='确定删除该任务吗？' confirmTitle='确定' cancelTitle='取消' isVisible={state.isItemDeletePopupViewVisible} />
      <AlertComponent onCancelPress={hiddeItemOperatorPopupView} onConfirmPress={onTaskRenameConfirmPress} title='重命名' textInputSubtitle confirmTitle='修改' cancelTitle='取消' isVisible={state.isItemRenamePopupViewVisible} />
      <Modal onBackdropPress={hiddeItemOperatorPopupView} isVisible={state.isItemOperatorVisible} onModalHide={onTaskItemOperatorPopupViewHide} style={{ margin: 0, justifyContent: 'flex-end' }} >
        {
          Platform.OS === 'android' ? <StatusBar barStyle='light-content' backgroundColor='rgba(0, 0, 0, 0.1)' animated={false} /> : null
        }
        <SafeAreaView style={{ backgroundColor: 'white' }} >
          <TouchableOpacity onPress={onTaskItemDetailPress} style={{ height: 45, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }} >
            <Text style={{ fontSize: 16, color: "#000000" }} >查看</Text>
          </TouchableOpacity>
          <Line />
          <TouchableOpacity onPress={onTaskItemRenamePress} style={{ height: 45, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }} >
            <Text style={{ fontSize: 16, color: "#000000" }}>重命名</Text>
          </TouchableOpacity>
          <Line />
          <TouchableOpacity onPress={onTaskItemDeletePress} style={{ height: 45, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }} >
            <Text style={{ color: '#E13333', fontSize: 16 }} >删除</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </View>
  )
}
export default connect<StateProps, DispatchProps, OwnProps, ReduxStore>(mapStateToProps, mapDispatchToProps)(IntentionListComponent)
