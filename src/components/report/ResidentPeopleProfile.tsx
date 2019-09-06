import React from 'react'
import { View } from 'react-native'
import EchartItem from './EchartItem'
import { NumberChartItem } from './NumberChartItem'
import echartsBarOption from '../../constants/echartsBarOption'
import echartsPieOption from '../../constants/echartsPieOption'
import { BusinessDistrictProfileModel } from '../../types/business-district-profile'
import { age as ageFields, rank as rankFields } from '../../constants/amapFieldText'

interface ResidentPeopleProfileProps {
  businessDistrictProfile?: BusinessDistrictProfileModel
}

export default class ResidentPeopleProfile extends React.Component<ResidentPeopleProfileProps, any> {
  constructor(props: ResidentPeopleProfileProps) {
    super(props);
  }

  public render() {
    const population = this.props.businessDistrictProfile && this.props.businessDistrictProfile.population && this.props.businessDistrictProfile.population.data
    const residentAgeProfile = this.props.businessDistrictProfile && this.props.businessDistrictProfile.residentAgeProfile && this.props.businessDistrictProfile.residentAgeProfile.data
    const residentRankProfile = this.props.businessDistrictProfile && this.props.businessDistrictProfile.residentRankProfile && this.props.businessDistrictProfile.residentRankProfile.data
    let ageKeys = new Array<any>()
    let ageValues = new Array()
    if (residentAgeProfile) {
      const { home : { index: { age } } } = residentAgeProfile
      ageKeys = ['juvenile', 'youth', 'adult', 'midage', 'oldage', 'highage']
      ageValues = ageKeys.map(key => age[key])
      ageKeys = ageKeys.map((key: keyof typeof ageFields) => ageFields[key])
    }
    let rankKeys = new Array()
    let rankValues = new Array()
    if (residentRankProfile) {
      const { home : { index: { rank } } } = residentRankProfile
      rankKeys = ['salariat', 'midclass', 'plutocrat']
      rankValues = rankKeys.map(key => rank[key])
      rankKeys = rankKeys.map((key: keyof typeof rankFields) => rankFields[key])
    }
    return (
      <View style={{}} >
        <NumberChartItem value={population && population.home} title='总人口' />
        <EchartItem options={echartsBarOption(ageKeys, ageValues, '年龄段人数分布')} />
        <EchartItem options={echartsPieOption(rankKeys, rankValues, '阶级人数占比')} />
      </View>
    );
  }
}
