import React, { Component } from 'react'
import { StyleSheet, View, ImageBackground, Image, TouchableOpacity, Alert } from 'react-native'
import { NavigationScreenProp, NavigationRoute } from 'react-navigation'
import { ReduxStoreAsyncItemState, ReduxStore } from '../../reducers';
import { LoginActionFunction, login } from '../../actions/user';
import { MapStateToPropsParam, MapDispatchToPropsParam, connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux-actions'
import Toast from 'react-native-root-toast'

const LoginBackground = require('../../assets/login.jpg')

interface StateProps {
  token: ReduxStoreAsyncItemState<string>
}

interface DispatchProps {
  wechatWorkLogin: LoginActionFunction
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
  wechatWorkLogin: () => dispatch(login())
})
class LoginScreen extends Component<StateProps & DispatchProps & OwnProps, OwnState> {
  static navigationOptions = {
    title: '登录',
    header: null
  };

  componentDidUpdate = () => {
    if (this.props.token && this.props.token.get('data')) this.props.navigation.navigate('App')
    if (this.props.token && this.props.token.get('error')) {
      let errorMessage = (this.props.token.get('error')+"").replace("Error: ","")
      if(errorMessage.indexOf("403")!=-1){
        errorMessage = "你没有该权限，请联系管理员"
      }
      if(errorMessage.toLowerCase().indexOf("cancel")!=-1){
        errorMessage = "已取消微信授权登录"
      }
      Toast.show(`${errorMessage}`, {
        position: Toast.positions.CENTER
      })
    }
  }

  _signInAsync = async () => {
    this.props.wechatWorkLogin()
  };

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground source={LoginBackground} style={{width: '100%', height: '100%'}}>
          <View style={{ ...styles.container, flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 20}}>
            {/* <TouchableOpacity onPress={this._signInAsync}>
              <Image source={require('../../assets/wechatwork/login_white_big/login_white_big.png')} />
            </TouchableOpacity> */}
            <TouchableOpacity onPress={this._signInAsync}>
              <Image source={require('../../assets/wechatwork/login_white_big/login_white_big.png')} />
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

export default connect<StateProps, DispatchProps, OwnProps, ReduxStore>(mapStateToProps, mapDispatchToProps)(LoginScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
