import React from 'react'
import { TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-navigation'
import { Line } from '../task/FormOne';

interface ImageSourceSelectorComponentProps {
  onCameSelect: () => void
  onAlbumSelect: () => void
  onCancelPress: () => void
}

export default class ImageSourceSelectorComponent extends React.Component<ImageSourceSelectorComponentProps, any> {
  constructor(props: ImageSourceSelectorComponentProps) {
    super(props);
  }

  public render() {
    return (
      <SafeAreaView style={{backgroundColor: 'white'}} >
        <TouchableOpacity onPress={this.props.onAlbumSelect} style={{height: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}} >
          <Text>从相册选择</Text>
        </TouchableOpacity>
        <Line />
        <TouchableOpacity onPress={this.props.onCameSelect} style={{height: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}} >
          <Text>从相机选择</Text>
        </TouchableOpacity>
        <Line style={{height: 5, marginLeft: 0,}} />
        <TouchableOpacity onPress={this.props.onCancelPress} style={{height: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}} >
          <Text>取消</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}
