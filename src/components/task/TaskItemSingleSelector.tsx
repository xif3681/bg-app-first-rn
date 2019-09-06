import React from 'react'
import { View, Text, Image, TouchableOpacity, StatusBar, ScrollView } from 'react-native'
import Modal from 'react-native-modal'
import { SafeAreaView } from 'react-navigation';

interface ValueItemCompoentProps {
  value: string
  selected?: boolean
  onPress?: (value: string) => void
}

class ValueItemCompoent extends React.Component<ValueItemCompoentProps, any> {
  constructor(props: ValueItemCompoentProps) {
    super(props);
  }

  private onPress = () => {
    this.props.onPress!(this.props.value)
  }

  public render() {
    return (
      <View>
        <TouchableOpacity onPress={this.onPress}  style={{flexDirection: 'row', height: 45, justifyContent: 'space-between', marginLeft: 15, marginRight: 15, alignItems: 'center'}} >
          <Text style={{color:"#000000",fontSize:16}}>{this.props.value}</Text>
          {
            this.props.selected ? 
            (<View style={{height: 18, width: 18}} >
              <Image source={require('../../assets/images/img_right_36x36.png')} style={{flex: 1, width: undefined, height: undefined}} />
            </View>) :
            null
          }
        </TouchableOpacity>
        <View style={{height: 1, backgroundColor: '#eeeeee', marginLeft: 15}} />
      </View>
    );
  }
}


interface ItemComponentProps {
  values: Array<string>
  title: string
  selectedValue?: string
  onValueChange?: (value: string) => void
}

interface ItemComponentStates {
  isValueSelectModalVisible: boolean
}

export default class ItemComponent extends React.Component<ItemComponentProps, ItemComponentStates> {

  constructor(props: ItemComponentProps) {
    super(props);

    this.state = {
      isValueSelectModalVisible: false
    }
  }

  private showModal = () => {
    this.setState({isValueSelectModalVisible: true})
  }

  private hideModal = () => {
    this.setState({isValueSelectModalVisible: false})
  }

  private onItemPress = (value: string) => {
    this.setState({isValueSelectModalVisible: false})
    this.props.onValueChange && this.props.onValueChange(value)
  }

  public render() {
    return (
      <View style={{backgroundColor: 'white'}} >
        <Modal backdropOpacity={0.2} onBackdropPress={this.hideModal} isVisible={this.state.isValueSelectModalVisible} style={{margin: 0, justifyContent: 'flex-end'}} >
          <StatusBar barStyle='dark-content' backgroundColor='rgba(0, 0, 0, 0.1)' animated={false} />
          <View style={{height: 60}} />
          <ScrollView style={{borderRadius: 4}} showsVerticalScrollIndicator={false} contentContainerStyle={{flexGrow: 1, justifyContent: 'flex-end'}} >
            <View style={{backgroundColor: 'white'}} >
              <View style={{alignItems: 'center', height: 40, justifyContent: 'center'}} >
                <Text style={{fontSize:17,color:"#000000"}}>{this.props.title}</Text>
              </View>
              <View style={{height: 1, backgroundColor: '#eeeeee', marginLeft: 15}} />
              {
                this.props.values.map((value, index) => {
                  return (<ValueItemCompoent onPress={this.onItemPress} selected={value === this.props.selectedValue} value={value} key={`${index}`} />)
                })
              }
            </View>
          </ScrollView>
        </Modal>
        <TouchableOpacity onPress={this.showModal} style={{flexDirection: 'row', alignItems: 'center', marginLeft: 10, marginRight: 10, justifyContent: 'space-between', height: 45}} >
          <Text style={{color:"#000000",fontSize:17}}>{this.props.title}</Text>
          <Text style={{color:"#666666",fontSize:17}}>{this.props.selectedValue}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
