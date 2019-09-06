import React from 'react'
import { View } from 'react-native';
import { NumberChartItem } from './NumberChartItem';
import EchartItem from './EchartItem'
import echartsBarOption from '../../constants/echartsBarOption'
import echartsPieOption from '../../constants/echartsPieOption'
import { BusinessDistrictProfileModel } from '../../types/business-district-profile';
import { age as ageFields, rank as rankFields } from '../../constants/amapFieldText'

interface WorkPeopleProfileProps {
  businessDistrictProfile?: BusinessDistrictProfileModel
}

export default class WorkPeopleProfile extends React.Component<WorkPeopleProfileProps, any> {
  constructor(props: WorkPeopleProfileProps) {
    super(props);
  }

  public render() {
    const population = this.props.businessDistrictProfile && this.props.businessDistrictProfile.population && this.props.businessDistrictProfile.population.data
    const workAgeProfile = this.props.businessDistrictProfile && this.props.businessDistrictProfile.workAgeProfile && this.props.businessDistrictProfile.workAgeProfile.data
    const workRankProfile = this.props.businessDistrictProfile && this.props.businessDistrictProfile.workRankProfile && this.props.businessDistrictProfile.workRankProfile.data
    let ageKeys = new Array()
    let ageValues = new Array()
    if (workAgeProfile) {
      const { company : { index: { age } } } = workAgeProfile
      ageKeys = ['juvenile', 'youth', 'adult', 'midage', 'oldage', 'highage']
      ageValues = ageKeys.map(key => age[key])
      ageKeys = ageKeys.map((key: keyof typeof ageFields) => ageFields[key])
    }
    let rankKeys = new Array()
    let rankValues = new Array()
    if (workRankProfile) {
      const { company : { index: { rank } } } = workRankProfile
      rankKeys = ['salariat', 'midclass', 'plutocrat']
      rankValues = rankKeys.map(key => rank[key])
      rankKeys = rankKeys.map((key: keyof typeof rankFields) => rankFields[key])
    }
    return (
      <View>
        <NumberChartItem value={population && population.company} title='总人口' />
        <EchartItem options={echartsBarOption(ageKeys, ageValues, '年龄段人数分布')} />
        <EchartItem options={echartsPieOption(rankKeys, rankValues, '阶级人数占比')} />
      </View>
    );
  }
}
