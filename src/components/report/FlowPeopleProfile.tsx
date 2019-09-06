import React from 'react'
import { View } from 'react-native';
import { NumberChartItem } from './NumberChartItem';
import EchartItem from './EchartItem';
import echartsLineOption from '../../constants/echartsLineOption'
import echartsBarOption from '../../constants/echartsBarOption'
import echartsPieOption from '../../constants/echartsPieOption'
import { BusinessDistrictProfileModel } from '../../types/business-district-profile'
import { keys } from 'lodash'
import { age as ageFields, rank as rankFields } from '../../constants/amapFieldText'

interface FlowPeopleProfileProps {
  businessDistrictProfile?: BusinessDistrictProfileModel
}

export default class FlowPeopleProfile extends React.Component<FlowPeopleProfileProps, any> {
  constructor(props: FlowPeopleProfileProps) {
    super(props);
  }

  public render() {
    const flow = this.props.businessDistrictProfile && this.props.businessDistrictProfile.flow && this.props.businessDistrictProfile.flow.data
    const flowAgeProfile = this.props.businessDistrictProfile && this.props.businessDistrictProfile.flowAgeProfile && this.props.businessDistrictProfile.flowAgeProfile.data
    const flowRankProfile = this.props.businessDistrictProfile && this.props.businessDistrictProfile.flowRankProfile && this.props.businessDistrictProfile.flowRankProfile.data
    let population = 0
    let hourkeys = new Array()
    let hourValues = new Array()
    if (flow) {
      const { month : { hour } } = flow
      hourkeys = keys(hour)
      hourkeys = hourkeys.map(key => {
        population += hour[key]
        hourValues.push(hour[key])
        return key + ':00'
      })

    }
    let ageKeys = new Array()
    let ageValues = new Array()
    if (flowAgeProfile) {
      const { month : { index: { age } } } = flowAgeProfile
      ageKeys = ['juvenile', 'youth', 'adult', 'midage', 'oldage', 'highage']
      ageValues = ageKeys.map(key => age[key])
      ageKeys = ageKeys.map((key: keyof typeof ageFields) => ageFields[key])
    }
    let rankKeys = new Array()
    let rankValues = new Array()
    if (flowRankProfile) {
      const { month : { index: { rank } } } = flowRankProfile
      rankKeys = ['salariat', 'midclass', 'plutocrat']
      rankValues = rankKeys.map(key => rank[key])
      rankKeys = rankKeys.map((key: keyof typeof rankFields) => rankFields[key])
    }
    return (
      <View>
        <NumberChartItem value={population} title='总人口' />
        <EchartItem options={echartsLineOption(hourkeys, hourValues, '每时段客流趋势')} />
        <EchartItem options={echartsBarOption(ageKeys, ageValues, '年龄段人数分布')} />
        <EchartItem options={echartsPieOption(rankKeys, rankValues, '阶级人数占比')} />
      </View>
    );
  }
}
