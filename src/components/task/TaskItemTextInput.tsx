import React from 'react'
import { View, Text, TextInput, KeyboardTypeOptions } from 'react-native';

interface TaskItemTextInputProps {
  title: string
  unit?: string
  value?: string | number
  placeholder?: string
  keyboardType?: KeyboardTypeOptions
  regexp?: RegExp
  onChangeText?: (text: string|null|number|undefined) => void
}

interface TaskItemTextInputStates {
}

export default class TaskItemTextInput extends React.Component<TaskItemTextInputProps, TaskItemTextInputStates> {

  private onChangeText = (value: string) => {
    if(!value){
      this.props.onChangeText && this.props.onChangeText(null)
    }else{
      this.props.onChangeText && this.props.onChangeText(value)
    }
  }

  public render() {
    return (
      <View style={{flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white', alignItems: 'center', paddingLeft: 10, paddingRight: 10}} >
        <Text style={{color:"#000000",fontSize:17}}>{this.props.title}</Text>
        <TextInput maxLength={2000} defaultValue={`${this.props.value || ''}`} underlineColorAndroid="transparent" onChangeText={this.onChangeText} placeholder={this.props.placeholder} keyboardType={this.props.keyboardType} style={{height: 45, flex: 1, textAlign: 'right', fontSize: 15,color:"#666666"}} />
        {
          this.props.unit ?
          (<Text style={{marginLeft: 11,color:"#666666",fontSize:17}} >{this.props.unit}</Text>) :
          null
        }
      </View>
    );
  }
}
