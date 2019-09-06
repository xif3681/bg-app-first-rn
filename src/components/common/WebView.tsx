import React from 'react'
import { View, WebView, Platform, Text, ScrollView, Dimensions, StyleSheet } from 'react-native'
import { NavigationScreenProp } from 'react-navigation';
import { NavigationRoute } from 'react-navigation';
const Pdf = Platform.OS === 'android' ? require('react-native-pdf').default : null

interface OwnProps {
  uri: string
  navigation: NavigationScreenProp<NavigationRoute>
}

interface OwnState { }
export default class WebViewComponent extends React.Component<OwnProps, OwnState> {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<{ addTasks: () => {} }> }) => ({
    title: '报告预览',
    headerBackTitle: null,
    headerTintColor: 'black'
  });

  constructor(props: OwnProps) {
    super(props)

  }

  render() {
    const uri = this.props.navigation.state.params && this.props.navigation.state.params.uri
    const report = this.props.navigation.state.params && this.props.navigation.state.params.report
    const source = { uri, cache: true };
    var Platform = require('Platform');
    return (
      <View style={{
        flex: 1,
      }}>
        {
          report && <View style={{ position: "absolute", top: 0, left: 0, width: "100%", zIndex: 10, backgroundColor: "#fff" }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', paddingLeft: 15, height: 50, width: "100%", lineHeight: 50, borderBottomColor: "#eeeeee", borderBottomWidth: 1, }}>基本信息</Text>
            <View style={styles.content_title}><Text style={{ flex: 1 }}>门店名称：</Text><Text style={{ flex: 2 }}>{report.actualStoreName}</Text></View>
            <View style={styles.content_title}><Text style={{ flex: 1 }}>门店地址：</Text><Text style={{ flex: 2 }}>{report.actualAddress}</Text></View>
            <View style={styles.content_title}><Text style={{ flex: 1 }}>开业时间：</Text><Text style={{ flex: 2 }}>{report.setupTime}</Text></View>
            <Text style={{ fontSize: 16, fontWeight: 'bold', paddingLeft: 15, height: 50, width: "100%", lineHeight: 50, borderBottomColor: "#eeeeee", borderBottomWidth: 1, borderTopColor: "#eeeeee", borderTopWidth: 1, }}>拓展报告</Text>
          </View>
        }
        {
          (Platform.OS === 'android' && uri.indexOf(".pdf") != -1) ?
            (<Pdf source={source} style={[report ? styles.reopor : { flex: 1 }]} fitWidth={true} />) :
            (<WebView source={{ uri }} style={[report ? styles.reopor : { flex: 1 }]} />)
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  reopor: {
    width: "100%",
    height: Dimensions.get('window').height - 220,
    position: "absolute",
    top: 0,
    marginTop: 220,
    left: 0
  },
  content_title: {
    height: 40,
    color: "#333333",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 15,
  }
});