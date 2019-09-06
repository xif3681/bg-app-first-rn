import React, { Component } from 'react'
import { StyleSheet, View, StatusBar, Text, TouchableOpacity, Dimensions, Modal } from 'react-native'
import { ThunkDispatch } from 'redux-thunk';
import { MapStateToPropsParam, MapDispatchToPropsParam, connect } from 'react-redux';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation'
import { logout } from '../../actions/user';
import { ReduxStore } from '../../reducers';
import { Action } from 'redux';

const { width: windowWidth } = Dimensions.get('window')

interface StateProps { }
interface OwnProps {
  navigation: NavigationScreenProp<NavigationRoute>
}

interface DispatchProps {
  logout: () => void
}
interface OwnState {
}
const mapDispatchToProps: MapDispatchToPropsParam<DispatchProps, OwnProps> = (dispatch: ThunkDispatch<ReduxStore, null, Action<any>>) => ({
  logout: () => dispatch(logout())
})
const mapStateToProps: MapStateToPropsParam<StateProps, OwnProps, ReduxStore> = state => ({
})
class UserScreen extends Component<StateProps & DispatchProps & OwnProps, OwnState> {
  static navigationOptions = {
    title: '我的',
  };
  state = {
    modalVisible: false,
    appVersion: "测试",
  };

  componentDidMount = () => {
    this.setState({ appVersion: "当前版本：" + '1.6.0' })
  }

  _setModalVisible = () => {
    this.setState({ modalVisible: !this.state.modalVisible })
  }

  _signOutAsync = async () => {
    await this.props.logout()
    this.props.navigation.navigate('Auth');
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle='dark-content' backgroundColor='white' animated={false} />
        <Modal animationType={"fade"} transparent={true} visible={this.state.modalVisible} >
          <View style={{ justifyContent: 'center', flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }} >
            <View style={{ width: 270, height: 120, alignSelf: "center", backgroundColor: 'white', borderRadius: 3, display: "flex", flexDirection: "column" }}>
              <Text style={{ color: "#000000", fontSize: 16, alignSelf: "center", flex: 1, display: "flex", justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>确定退出登录?</Text>
              <View style={{ backgroundColor: "#C8C7CC", height: 1, width: 270 }}></View>
              <View style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 270, flexDirection: "row" }}>
                <TouchableOpacity onPress={this._signOutAsync} style={styles.button}>
                  <Text style={[styles.btn_text, { color: "#1DB8F9" }]}>确定</Text>
                </TouchableOpacity>
                <View style={{ width: 1, backgroundColor: "#C8C7CC", height: 45 }}></View>
                <TouchableOpacity onPress={this._setModalVisible} style={[styles.button]}>
                  <Text style={styles.btn_text}>取消</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Text style={styles.version}>{this.state.appVersion}</Text>
        <View style={{ flex: 1 }}></View>
        <TouchableOpacity onPress={this._setModalVisible} style={styles.loginout}><Text>退出登录</Text></TouchableOpacity>
      </View>
    );
  }
}
export default connect<StateProps, DispatchProps, OwnProps, ReduxStore>(mapStateToProps, mapDispatchToProps)(UserScreen)
const styles = StyleSheet.create({
  btn_text: {
    fontSize: 17,
    color: "#000000"
  },
  button: {
    flex: 1,
    display: "flex",
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
  },
  container: {
    flex: 1,
    display: "flex",
    flexDirection: 'column',
    backgroundColor: "#F1F1F1",
    overflow: "hidden",
  },
  version: {
    marginTop: 5,
    fontSize: 16,
    lineHeight: 44,
    backgroundColor: "white",
    fontWeight: "600",
    paddingLeft: 17,
    color: '#000000',
  },
  loginout: {
    alignSelf: "flex-end",
    width: windowWidth - 30,
    marginBottom: 20,
    marginRight: 15,
    display: "flex",
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    borderRadius: 3,
    fontSize: 17,
    fontWeight: "500",
    borderWidth: 1,
    color: '#FF000000',
    borderColor: "rgba(210,210,210,1)",
    backgroundColor: "#ffffffff",
  }
});
