import React from 'react'
import { View, TouchableOpacity, Text, StyleSheet, ScrollView, Image } from 'react-native'
import { ReduxStoreAsyncItemState } from '../../reducers'
import { TaskFormLocationHeader } from '../task/FormOne'
import { TaskModel } from '../../types/task'
import { ReportModel } from '../../types/report';
import WorkPeopleProfile from './WorkPeopleProfile'
import ResidentPeopleProfile from './ResidentPeopleProfile'
import FlowPeopleProfile from './FlowPeopleProfile'
import { BusinessDistrictProfileModel } from '../../types/business-district-profile';
import moment from 'moment'

interface BusinessDistrictProfileSegmentProps {
  onValueChange?: (index: number) => void
}

interface BusinessDistrictProfileSegmentStates {
  index: number
}

class BusinessDistrictProfileSegment extends React.Component<BusinessDistrictProfileSegmentProps, BusinessDistrictProfileSegmentStates> {
  constructor(props: BusinessDistrictProfileSegmentProps) {
    super(props);

    this.state = {
      index: 0
    }
  }

  private onItemPressCallbackCreater = (index: number) => () => {
    this.setState({ index })
    this.props.onValueChange && this.props.onValueChange(index)
  }

  public render() {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', margin: 5 }} >
        <TouchableOpacity onPress={this.onItemPressCallbackCreater(0)} style={this.state.index === 0 ? styles.BusinessDistrictProfileSelectedBackground : styles.BusinessDistrictProfileUnselectedBackground} >
          <Text style={this.state.index === 0 ? styles.BusinessDistrictProfileSelectedText : styles.BusinessDistrictProfileUnselectedText}>工作人口</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onItemPressCallbackCreater(1)} style={this.state.index === 1 ? styles.BusinessDistrictProfileSelectedBackground : styles.BusinessDistrictProfileUnselectedBackground} >
          <Text style={this.state.index === 1 ? styles.BusinessDistrictProfileSelectedText : styles.BusinessDistrictProfileUnselectedText}>居住人口</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onItemPressCallbackCreater(2)} style={this.state.index === 2 ? styles.BusinessDistrictProfileSelectedBackground : styles.BusinessDistrictProfileUnselectedBackground} >
          <Text style={this.state.index === 2 ? styles.BusinessDistrictProfileSelectedText : styles.BusinessDistrictProfileUnselectedText}>流动人口</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  BusinessDistrictProfileSelectedBackground: { backgroundColor: '#3EC2FA', borderRadius: 3 },
  BusinessDistrictProfileSelectedText: { margin: 5, marginLeft: 15, marginRight: 15, fontSize: 17, color: 'white' },
  BusinessDistrictProfileUnselectedText: { margin: 5, marginLeft: 15, marginRight: 15, fontSize: 17, color: 'rgba(0, 0, 0, 0.2)' },
  BusinessDistrictProfileUnselectedBackground: { borderColor: 'rgba(0, 0, 0, 0.2)', borderWidth: 1, borderRadius: 3 }
})

interface BusinessDistrictProfileProps {
  task?: ReduxStoreAsyncItemState<TaskModel>
  taskReport?: ReduxStoreAsyncItemState<ReportModel>
  businessDistrictProfile?: BusinessDistrictProfileModel
  permission?: boolean
  OnGetInfo: Function,
  isFirst?: boolean
}

interface BusinessDistrictProfileState {
  segmentIndex: number,
}

export default class BusinessDistrictProfile extends React.Component<BusinessDistrictProfileProps, BusinessDistrictProfileState> {

  private task?: TaskModel
  private = true//第一次进来

  constructor(props: BusinessDistrictProfileProps) {
    super(props)

    this.state = {
      segmentIndex: 0,
    }
  }

  private onBusinessDistrictProfileSegmentValueChange = (segmentIndex: number) => {
    this.setState({ segmentIndex })
  }

  //没有权限
  private getNoPermission = () => {
    return (
      <View style={{ height: 509, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "#fff", marginTop: 5 }}>
        <Image source={require("../../assets/images/no_permission.png")} />
        <Text style={{ marginTop: 40, fontSize: 16, color: "#000" }}>该门店不支持获取商圈数据</Text>
      </View>
    )
  }

  //如果到了85分但是没有画商圈
  private getNoPolygon = () => {
    return (<View style={{ height: 509, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "#fff", marginTop: 5 }}>
      <Image source={require("../../assets/images/img_defaultpage5_358x326.png")} />
      <Text style={{ marginTop: 40, fontSize: 16, color: "#000" }}>该门店未划定辐射商圈范围</Text>
    </View>)
  }

  private firstView = () => {
    return (<View style={{ height: 509, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "#fff", marginTop: 5 }}>
      <Image source={require("../../assets/images/no_permission.png")} />
      <Text style={{ marginTop: 40, fontSize: 16, color: "#000" }}>是否查看该门店商圈数据？</Text>
      <TouchableOpacity style={{ marginTop: 58 }} onPress={() => {
        this.props.OnGetInfo()
      }}>
        <Text style={{ width: 81, height: 32, fontSize: 17, color: "#fff", textAlign: "center", lineHeight: 32, backgroundColor: "#3EC2FA" }}>查看</Text>
      </TouchableOpacity>
    </View>)
  }

  //主布局2
  private mainView = () => {
    return (
      <View style={{ flex: 1 }}>
        <BusinessDistrictProfileSegment onValueChange={this.onBusinessDistrictProfileSegmentValueChange} />
        <View style={{ marginLeft: 15, marginTop: 10 }} >
          <Text style={{ color: "#000000", fontSize: 12 }}>统计时间:{moment().format('YYYY年MM月')}</Text>
        </View>
        {
          this.state.segmentIndex === 0 ?
            (
              <WorkPeopleProfile businessDistrictProfile={this.props.businessDistrictProfile} />
            ) :
            null
        }
        {
          this.state.segmentIndex === 1 ?
            (
              <ResidentPeopleProfile businessDistrictProfile={this.props.businessDistrictProfile} />
            ) :
            null
        }
        {
          this.state.segmentIndex === 2 ?
            (
              <FlowPeopleProfile businessDistrictProfile={this.props.businessDistrictProfile} />
            ) :
            null
        }
      </View>
    )
  }

  render() {
    let task = this.props.task!.get("data")!
    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#F1F1F1' }} >
        <TaskFormLocationHeader location={this.props.task && this.props.task.get('data') && this.props.task.get('data')!.location} />
        {
          this.props.permission ?
            //如果到了85分但是没有画商圈
            (task.businessDistrictPolygon == null || task.businessDistrictPolygon.length <= 0) ? this.getNoPolygon()
              //如果到了85分并且画了商圈如果第一次进来
              : this.props.isFirst ? this.firstView()
                //显示主布局
                : this.mainView()
            //没有到85分
            : this.getNoPermission()

        }

      </ScrollView>
    )
  }
}
