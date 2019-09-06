import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Button } from 'react-native-elements'

interface TaskContinuteEditButtonProps {
  title: string
  onPress?: () => void
  disabled?: boolean
}



export default class TaskContinuteEditButton extends React.Component<TaskContinuteEditButtonProps, any> {
  constructor(props: TaskContinuteEditButtonProps) {
    super(props);
  }

  checkDisable = () => {
    return this.props.disabled
  }

  public render() {
    const backgroundColor = this.props.disabled ? 'gray' : '#1ADF8E'
    return (
      <View style={{height: 82, justifyContent: 'center', alignItems: 'center'}} >
        <Button 
          disabled={this.checkDisable()} 
          titleStyle={{marginLeft: 40, marginRight: 40, color: 'white', fontSize: 16}} 
          onPress={this.props.onPress} 
          title={this.props.title} 
          buttonStyle={{backgroundColor, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center'}} 
        />
      </View>
    );
  }
}
