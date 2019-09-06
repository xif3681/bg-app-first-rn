import React, { Component } from 'react'
import { View, StyleSheet, ActivityIndicator, StatusBar, Alert, Linking } from 'react-native'
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';
import { MapStateToPropsParam, MapDispatchToPropsParam, connect } from 'react-redux';
import { ReduxStore, ReduxStoreAsyncItemState } from '../../reducers';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { localLogin } from '../../actions/user'
import { Text } from 'react-native-elements';
import { checkUpdate } from '../../actions/code-push';

interface StateProps {
  token?: ReduxStoreAsyncItemState<string>
}

interface DispatchProps {
  localLogin: () => void
  checkUpdate: () => void
}

interface OwnProps {
  navigation: NavigationScreenProp<NavigationRoute>
}

interface OwnState {
}
const mapStateToProps: MapStateToPropsParam<StateProps, OwnProps, ReduxStore> = state => ({
  token: state.get('token')
})
const mapDispatchToProps: MapDispatchToPropsParam<DispatchProps, OwnProps> = (dispatch: ThunkDispatch<ReduxStore, null, Action<any>>) => ({
  localLogin: () => dispatch(localLogin()),
  checkUpdate: () => dispatch(checkUpdate())
})
class BootLoadingScreen extends Component<StateProps & DispatchProps & OwnProps, OwnState> {
  static navigationOptions = {
    title: '检查',
    tabBarVisible: false
  }

  constructor(props: StateProps & DispatchProps & OwnProps) {
    super(props)
    
    this.props.checkUpdate()
    setTimeout(this.props.localLogin, 1000);
  }

  componentDidUpdate() {
    if (this.props.token && this.props.token.get('data')) {
      this.props.navigation.navigate('App')
    } else if (this.props.token && this.props.token.get('error')) {
      this.props.navigation.navigate('Auth');
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <Text style={{marginTop: 10}} >正在检查...</Text>
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

export default connect<StateProps, DispatchProps, OwnProps, ReduxStore>(mapStateToProps, mapDispatchToProps)(BootLoadingScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
