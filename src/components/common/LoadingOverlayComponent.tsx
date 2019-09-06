import React from 'react'
import { View, Dimensions, ActivityIndicator, Text } from 'react-native'

const { width, height } = Dimensions.get('window')

interface LoadingOverlayComponentProps {
  textContent?: string
}

export default class LoadingOverlayComponent extends React.Component<LoadingOverlayComponentProps, any> {
  constructor(props: LoadingOverlayComponentProps) {
    super(props);
  }

  public render() {
    return (
      <View style={{position: 'absolute', height, width, justifyContent: 'center', alignItems: 'center'}} >
        <View style={{height: 115, width: 110, backgroundColor: 'rgba(0, 0, 0, 0.4)', borderRadius: 3, justifyContent: 'center', alignItems: 'center'}} >
          <ActivityIndicator animating hidesWhenStopped color='white' size='large' />
          <Text style={{marginTop: 15, color: 'white'}} >{this.props.textContent || '加载中...'}</Text>
        </View>
      </View>
    );
  }
}
