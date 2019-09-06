import React from 'react'
import { View, Text, TextInput } from 'react-native';

interface TaskItemTextAreaProps {
  title: string
  unit?: string
  value?: string
  placeholder?: string
  onChangeText?: (text: string) => void
}

export default class TaskItemTextArea extends React.Component<TaskItemTextAreaProps, any> {

  private onChangeText = (value: string) => {
    this.props.onChangeText && value && this.props.onChangeText(value)
  }

  public render() {
    return (
      <View style={{backgroundColor: 'white', padding: 10}} >
        <Text style={{color:"#000000",fontSize:17}}>{this.props.title}</Text>
        <TextInput maxLength={2000} defaultValue={this.props.value} underlineColorAndroid="transparent" onChangeText={this.onChangeText} multiline={true} placeholder={this.props.placeholder} style={{flex: 1, height: 130, marginTop: 15, borderColor: '#f1f1f1', borderWidth: 1,textAlign:"auto",fontSize:17,color:"#666666",padding:5}} />
      </View>
    );
  }
}
