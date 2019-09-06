import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { connect, MapStateToPropsParam, MapDispatchToPropsParam } from 'react-redux'
import { ReduxStore, ReduxStoreAsyncItemState } from '../../reducers'
import { ThunkDispatch } from 'redux-thunk'
import { Action } from 'redux-actions'
import { NavigationScreenProp, ScrollView } from 'react-navigation'
import { NavigationRoute } from 'react-navigation'
import { } from '../../actions/intention-stores';
import { HeaderItemComponent } from '../home/Home';
import { Line } from './FormOne';
import { intentionShopCommunicationRecords } from '../../services/intention-store';
import { Communication } from '../../types/intention-store';


interface StateProps {
  token: ReduxStoreAsyncItemState<string>
}

export const IntentionStoreDetailItem = ({index,local,item}:{index:number,local:Communication[],item:Communication}) => {
  return (<View style={{ display: "flex", flexDirection: "column", backgroundColor: "#ffffff", paddingLeft: 15, paddingRight: 15 }} >
  <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
    <Image source={require('../../assets/images/img_choose_42x42.png')} style={{ height: 15, width: 15 }} />
    <Text style={{ fontSize: 12, color: "#000000", marginLeft: 11 }}>{item.time}</Text>
  </View>
  <View style={{ display: "flex", flexDirection: "row", paddingLeft: 7 }}>
    <View style={{ height:"auto",width: 2, backgroundColor: (index == local.length - 1)?"#ffffff":"#1DB8F9", marginRight: 18 }}></View>
    <Text style={{ fontSize: 14, color: "#666", flex: 1, marginTop: 10 }}>{item.content}</Text>
  </View>
</View>)
}



interface DispatchProps {

}

interface OwnProps {
  navigation: NavigationScreenProp<NavigationRoute>

}

interface OwnState {
  messageList: Communication[]
}



const mapStateToProps: MapStateToPropsParam<StateProps, OwnProps, ReduxStore> = state => ({
  token: state.get('token'),

})
const mapDispatchToProps: MapDispatchToPropsParam<DispatchProps, OwnProps> = (dispatch: ThunkDispatch<ReduxStore, null, Action<any>>) => ({

})
let that:IntentionStoreDetailComponent;//外部申明
class IntentionStoreDetailComponent extends React.Component<StateProps & DispatchProps & OwnProps, OwnState> {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<{}> }) => {
    return ({
      title: navigation.state.params!.task.name,
      headerTintColor: 'black',
      headerBackTitle: null,
      headerRight:  (!navigation.state.params!.userId||navigation.state.params!.task.userId===navigation.state.params!.userId)?(<HeaderItemComponent icon={require('../../assets/images/img_edit_60x60.png')} onPress={()=> {
        navigation.navigate("IntentionStore",{
          task:{...navigation.state.params!.task},
          communicationRecords:that.state.messageList,
          refresh: function () {
            that.getList()
        }
        })
      }} />):null
    })
  }

  constructor(props: StateProps & DispatchProps & OwnProps) {
    super(props)
    this.state = {
      messageList: []
    }
    that=this;
    this.getList()
  }

  private getList = async () => {
    let intentionShopCommunication = await intentionShopCommunicationRecords(this.props.token.get('data'), this.props.navigation.state.params!.task._id)
    this.setState({
      messageList: intentionShopCommunication.intentionShops,
    })
  }
 


  render() {
    return (
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: '#F6F6F6', paddingTop: 10, paddingBottom: 10 }}>
        <View style={styles.normal_item}>
          <Text style={styles.title}>转让人</Text>
          <Text style={styles.desc}>{this.props.navigation.state.params!.task.assignor}</Text>
        </View>
        <Line></Line>
        <View style={styles.normal_item}>
          <Text style={styles.title}>转让人电话</Text>
          <Text style={styles.desc}>{this.props.navigation.state.params!.task.assignorContactInformation}</Text>
        </View>
        <Line></Line>
        <View style={styles.normal_item}>
          <Text style={styles.title}>租金</Text>
          <Text style={styles.desc}>{this.props.navigation.state.params!.task.rent}</Text>
        </View>
        <Line></Line>
        <View style={styles.normal_item}>
          <Text style={styles.title}>转让费</Text>
          <Text style={styles.desc}>{this.props.navigation.state.params!.task.transferFee}</Text>
        </View>
        <Line></Line>
        <View style={styles.normal_item}>
          <Text style={styles.title}>面积</Text>
          <Text style={styles.desc}>{this.props.navigation.state.params!.task.area}平米</Text>
        </View>
        {(this.state.messageList.length > 0) &&
          <View style={{ marginTop: 10, backgroundColor: "#ffffff", paddingBottom: 10, flex: 1 }}>
            <View style={styles.normal_item}>
              <Text style={styles.title}>沟通记录</Text>
            </View>
            <Line style={{ marginBottom: 10 }}></Line>
            {this.state.messageList.map((item, index,local) => {
              return <IntentionStoreDetailItem local={local} index={index} item ={item} key={index}/>
            }
            )}
          </View>
        }

      </ScrollView>
    )
  }
}
const styles = StyleSheet.create({
  normal_item: {
    backgroundColor: "#ffffffff",
    display: "flex",
    flexDirection: 'row',
    padding: 15,
    justifyContent: "space-between",
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    color: "#000",
  },
  desc:{
    fontSize: 17,
    color: "#666",
  }
})
export default connect<StateProps, DispatchProps, OwnProps, ReduxStore>(mapStateToProps, mapDispatchToProps)(IntentionStoreDetailComponent)
