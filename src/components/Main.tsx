import React, { Component } from 'react'
import { createStackNavigator, createSwitchNavigator, createAppContainer, createBottomTabNavigator, NavigationScreenConfigProps } from 'react-navigation'
import { HomeScreen } from './home'
import { LoginScreen } from './login'
import BootLoading from './common/BootLoading'
import { Task, TaskFormOne, TaskFormTwo, TaskFormThree, TaskFormFour, IntentionStore, IntentionStoreList, IntentionStoreDetail, SaleMapView, MapSearch, TaskMapView, TaskList, BusinessDistrictMapView } from './task'
import { UserScreen } from './user'
import { Image, View, StyleSheet } from 'react-native'
import { ReportList, ReportProfile } from './report'
import WebView from './common/WebView'
import LoadingOverlay from './common/LoadingOverlayComponent'
import { MapStateToPropsParam, MapDispatchToPropsParam, connect } from 'react-redux';
import { ReduxStore, ReduxStoreItemState } from '../reducers';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux'
import { List } from 'immutable'
import TaskOpenedStoreList from './task/TaskOpenedStoreList'
import CodePushMandatoryUpdateComponent from './home/CodePushMandatoryUpdateComponent';
import Toast from 'react-native-root-toast';
import { ErrorEntity } from '../reducers/error-message';

const AuthStack = createStackNavigator({ Login: LoginScreen })

const HomeStackNavigator = createStackNavigator(
  {
    Home: { screen: HomeScreen },
    SaleMapView: {screen: SaleMapView},
    TaskMapView: { screen: TaskMapView },
    TaskFormOne: { screen: TaskFormOne },
    TaskFormTwo: { screen: TaskFormTwo },
    TaskFormThree: { screen: TaskFormThree },
    TaskFormFour: { screen: TaskFormFour },
    IntentionStore: { screen: IntentionStore },
    IntentionStoreDetail: { screen: IntentionStoreDetail },
    MapSearch: { screen: MapSearch },
    ReportProfile: { screen: ReportProfile },
    BusinessDistrictMapView: { screen: BusinessDistrictMapView },
  }, {
    initialRouteName: 'Home',
    cardOverlayEnabled: true,
    headerMode: 'screen'
  }
)

HomeStackNavigator.navigationOptions = ({ navigation }: NavigationScreenConfigProps) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
    tabBarIcon: ({ focused }: { focused: boolean }) => {
      return <Image source={focused ? require('../assets/images/img_homelight_44x41.png') : require('../assets/images/img_home_44x41.png')} style={{ height: 20, width: 20 }} />
    }
  };
};

const TaskStackNavigator = createStackNavigator(
  {
    Task: { screen: Task },
    TaskList: { screen: TaskList },
    TaskMapView: { screen: TaskMapView },
    TaskFormOne: { screen: TaskFormOne },
    TaskFormTwo: { screen: TaskFormTwo },
    TaskFormThree: { screen: TaskFormThree },
    TaskFormFour: { screen: TaskFormFour },
    IntentionStoreList: {
      screen: IntentionStoreList, navigationOptions: () => ({
        title: '意向店',
        headerTintColor: 'black',
        headerBackTitle: null
      }),
    },
    IntentionStoreDetail: { screen: IntentionStoreDetail },
    IntentionStore: { screen: IntentionStore },
    BusinessDistrictMapView: { screen: BusinessDistrictMapView },
    ReportProfile: { screen: ReportProfile },
    ReportList: { screen: ReportList },
    WebView: { screen: WebView },
    TaskOpenedStoreList: { screen: TaskOpenedStoreList }
  }, {
    initialRouteName: 'Task',
    cardOverlayEnabled: true,
    headerMode: 'screen'
  }
)

TaskStackNavigator.navigationOptions = ({ navigation }: NavigationScreenConfigProps) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
    tabBarIcon: ({ focused }: { focused: boolean }) => {
      return <Image source={focused ? require('../assets/images/img_missionlight_36x44.png') : require('../assets/images/img_mission_36x44.png')} style={{ height: 20, width: 20 }} />
    }
  };
};

const UserStackNavigator = createStackNavigator(
  { "USER": { screen: UserScreen } }
)

UserStackNavigator.navigationOptions = ({ navigation }: NavigationScreenConfigProps) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
    tabBarIcon: ({ focused }: { focused: boolean }) => {
      return <Image source={focused ? require('../assets/images/img_minelight_39x44.png') : require('../assets/images/img_people_39x44.png')} style={{ height: 20, width: 18 }} />
    }
  };
};

const bottomTabNavigator = createBottomTabNavigator({
  '分析': { screen: HomeStackNavigator },
  '任务': { screen: TaskStackNavigator },
  '我的': { screen: UserStackNavigator },
}, {
    backBehavior: 'history',
    tabBarOptions: {
      activeTintColor: '#12B5F9',
      inactiveTintColor: '#A3A3A3'
    },
  });

const AppContainer = createAppContainer(createSwitchNavigator(
  {
    BootLoading: BootLoading,
    App: bottomTabNavigator,
    Auth: AuthStack,
    CodePushMandatoryUpdateComponent: CodePushMandatoryUpdateComponent
  }, {
    initialRouteName: 'BootLoading',
  }
))

interface StateProps {
  loadingOverlay: List<string>,
  errorMessage: ReduxStoreItemState<ErrorEntity>
}



interface DispatchProps { }

interface OwnProps {
}

interface OwnState {
}

const mapStateToProps: MapStateToPropsParam<StateProps, OwnProps, ReduxStore> = state => ({
  loadingOverlay: state.get('loadingOverlay'),
  errorMessage: state.get("errorMessage")
})
const mapDispatchToProps: MapDispatchToPropsParam<DispatchProps, OwnProps> = (dispatch: ThunkDispatch<ReduxStore, null, Action<any>>) => ({
})
class App extends Component<StateProps & DispatchProps & OwnProps, OwnState> {

  componentDidUpdate(prevProps: StateProps & DispatchProps & OwnProps) {
    if (this.props.errorMessage.get('data') !== prevProps.errorMessage.get('data')) {
      Toast.show(this.props.errorMessage.get("message"), {
        position: Toast.positions.CENTER
      })
    }
  }

  render() {
    return (
      <View style={styles.mainContainer} >
        <AppContainer />
        {
          this.props.loadingOverlay.size ?
            (
              <LoadingOverlay textContent={this.props.loadingOverlay.last()} />
            ) :
            null
        }
      </View>
    )
  }
}

export default connect<StateProps, DispatchProps, OwnProps, ReduxStore>(mapStateToProps, mapDispatchToProps)(App)

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },
  overlayTextStyle: {
    color: '#3EC2FA'
  }
})