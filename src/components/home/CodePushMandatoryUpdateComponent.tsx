import React, { Component } from 'react'
import { View, StyleSheet, ActivityIndicator, StatusBar, Alert, Linking } from 'react-native'
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';
import { MapStateToPropsParam, MapDispatchToPropsParam, connect } from 'react-redux';
import { ReduxStore, ReduxStoreItemState } from '../../reducers';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { Text } from 'react-native-elements';
import { CodePush } from '../../reducers/code-push';
import { DownloadProgress } from 'react-native-code-push'
import { isEmpty } from 'lodash'

interface StateProps {
  codePush?: ReduxStoreItemState<CodePush>
}

interface DispatchProps {
}

interface OwnProps {
  navigation: NavigationScreenProp<NavigationRoute>
}

interface OwnState {
}
const mapStateToProps: MapStateToPropsParam<StateProps, OwnProps, ReduxStore> = state => ({
  codePush: state.get('codePush')
})
const mapDispatchToProps: MapDispatchToPropsParam<DispatchProps, OwnProps> = (dispatch: ThunkDispatch<ReduxStore, null, Action<any>>) => ({
})
class CodePushMandatoryUpdateComponent extends Component<StateProps & DispatchProps & OwnProps, OwnState> {
  static navigationOptions = {
    title: '版本更新',
    tabBarVisible: false
  }
  
  constructor(props: StateProps & DispatchProps & OwnProps) {
    super(props)
  }
  
  private updateDownloadProgress = (progress?: DownloadProgress) => {
    if (!progress || isEmpty(progress)) return '等待中...'
    return `更新包正在下载：${Math.floor(progress.receivedBytes/progress.totalBytes * 100)}%`
  }

  render() {
    const updateText = this.updateDownloadProgress(this.props.codePush && this.props.codePush.get('updateDownloadProgress'))
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <Text style={{marginTop: 10}} >{updateText}</Text>
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

export default connect<StateProps, DispatchProps, OwnProps, ReduxStore>(mapStateToProps, mapDispatchToProps)(CodePushMandatoryUpdateComponent)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
