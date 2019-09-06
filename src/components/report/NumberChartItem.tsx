import React from 'react'
import { View, Text } from 'react-native'

interface NumberChartItemProps {
  title?: string
  value: number | string
}

interface NumberChartItemStates {

}

export class NumberChartItem extends React.Component<NumberChartItemProps, NumberChartItemStates> {
  constructor(props: NumberChartItemProps) {
    super(props)
  }
  render() {
    return (
      <View style={{margin: 10, backgroundColor: 'white'}} >
        <View style={{justifyContent: 'center', alignItems: 'center', margin: 10}} >
          <Text style={{color: '#3EC2FA', fontSize: 24,fontWeight:"500"}} >{this.props.value}</Text>
        </View>
        {
          this.props.title ?
          (
            <View style={{justifyContent: 'center', alignItems: 'center', margin: 11, marginTop: 0}} >
              <Text style={{color:"#000000",fontSize:16}}>{this.props.title}</Text>
            </View>
          ) :
          null
        }
      </View>
    )
  }
}
