import React from 'react'
import { View, StyleProp, Text, TextInput, TouchableOpacity, TextStyle, KeyboardAvoidingView } from "react-native";
import Modal from 'react-native-modal';
import { Func0, Func1 } from 'redux';
import { Line } from '../task/FormOne';

interface AlertComponentProps {
  title?: string
  textInputSubtitle?: boolean
  isVisible: boolean
  subtitle?: string
  cancelTitle?: string
  cancelTitleStyle?: StyleProp<TextStyle>
  confirmTitle?: string
  confirmTitleStyle?: StyleProp<TextStyle>
  onConfirmPress?: Func1<string, void>
  onCancelPress?: Func0<void>
}

export class AlertComponent extends React.Component<AlertComponentProps, any> {
  constructor(props: AlertComponentProps) {
    super(props);
  }

  private value?: string

  private onTextInputValueChange = (value: string) => {
    this.value = value
  }

  private onConfirmPress = () => {
    this.props.onConfirmPress && this.props.onConfirmPress(this.value!)
  }
  private onModalHide = () =>{
    this.value = ""
  }

  public render() {
    return (
      <Modal isVisible={this.props.isVisible} onBackdropPress={this.props.onCancelPress} backdropColor="rgba(0, 0, 0, 0.3)" onModalHide={this.onModalHide}>
        <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={10}>
          <View style={{borderRadius: 3, backgroundColor: 'white'}} >
            {
              this.props.title ?
              (
                <View style={{justifyContent: 'center', alignItems: 'center', margin: 20}} >
                  <Text style={{fontSize: 18,color:"#000000"}} >{this.props.title}</Text>
                </View>
              ) :
              null
            }
            {
              this.props.subtitle ?
              (
                <View style={{justifyContent: 'center', alignItems: 'center', margin: 20}} >
                  <Text>{this.props.subtitle}</Text>
                </View>
              ) :
              null
            }
            {
              this.props.textInputSubtitle ?
              (
                <View style={{margin: 20, borderColor: '#F1F1F1', borderWidth: 1, borderRadius: 2, paddingLeft: 5, paddingRight: 5}} >
                  <TextInput onChangeText={this.onTextInputValueChange} autoFocus returnKeyType='done'  />
                </View>
              ) :
              null
            }
            <View style={{height: 1, backgroundColor: '#F1F1F1'}} />
            <View style={{flexDirection: 'row'}} >
              <TouchableOpacity onPress={this.props.onCancelPress} style={{height: 50, justifyContent: 'center', alignItems: 'center', flex: 1}} >
                <Text style={[this.props.cancelTitleStyle,{fontSize:17}]} >{this.props.cancelTitle}</Text>
              </TouchableOpacity>
              <View style={{width: 1, backgroundColor: '#F1F1F1'}} />
              <TouchableOpacity onPress={this.onConfirmPress} style={{height: 50, justifyContent: 'center', alignItems: 'center', flex: 1}} >
                <Text style={[this.props.confirmTitleStyle,{color:"#1DB8F9",fontSize:17}]} >{this.props.confirmTitle}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  }
}
