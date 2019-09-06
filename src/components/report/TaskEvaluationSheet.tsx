import React from 'react'
import { View, Text } from 'react-native'
import { connect, MapStateToPropsParam, MapDispatchToPropsParam } from 'react-redux'
import { ReduxStore } from '../../reducers'
import { ThunkDispatch } from 'redux-thunk'
import { Action } from 'redux-actions'
import { ReportModel } from '../../types/report';
import { Gap } from '../task/FormOne';

interface StoreInformationFieldProps {
  title: string
  score?: string | number
  reamrk?: string | number
  backgroundColor?: string
  titleColor?: string
  scroeColor?: string
  remartColor?: string
}

class StoreInformationField extends React.Component<StoreInformationFieldProps, any> {
  constructor(props: StoreInformationFieldProps) {
    super(props);
  }

  public render() {
    return (
      <View style={{ flexDirection: 'row', backgroundColor: this.props.backgroundColor ? this.props.backgroundColor : 'white', paddingTop: 5, paddingBottom: 5 }} >
        <View style={{ flex: 1, justifyContent: 'center', padding: 5, paddingLeft: 10, paddingRight: 10 }} >
          <Text style={{ color: this.props.titleColor ? this.props.titleColor : "#000000", fontSize: 15 }} >{this.props.title}</Text>
        </View>
        <View style={{ width: 50, justifyContent: 'center', padding: 5, paddingLeft: 10, paddingRight: 10 }} >
          <Text style={{ color: this.props.scroeColor ? this.props.scroeColor : "#000000", fontSize: 15 }} >{this.props.score || '/'}</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', padding: 5, paddingLeft: 10, paddingRight: 10 }} >
          <View style={{ flex: 1 }} >
            <Text style={{ color: this.props.remartColor ? this.props.remartColor : "#000000", fontSize: 15, flexWrap: 'wrap' }} >{this.props.reamrk || '/'}</Text>
          </View>
        </View>
      </View>
    );
  }
}

interface StateProps { }

interface DispatchProps { }

interface OwnProps {
  report: ReportModel
}

interface OwnState { }

const mapStateToProps: MapStateToPropsParam<StateProps, OwnProps, ReduxStore> = state => ({
})
const mapDispatchToProps: MapDispatchToPropsParam<DispatchProps, OwnProps> = (dispatch: ThunkDispatch<ReduxStore, null, Action<any>>) => ({
})
class TaskEvaluationSheetComponent extends React.Component<StateProps & DispatchProps & OwnProps, OwnState> {

  constructor(props: StateProps & DispatchProps & OwnProps) {
    super(props)

  }

  render() {
    const corrivals = this.props.report.corrivals && this.props.report.corrivals.map((currentValue) => {
      return `${currentValue.name}，租金${currentValue.rent}元，销售额${currentValue.saleRoom}元`
    }).join(' ; ')
    return (
      <View style={{ flex: 1 }} >
        <View style={{ height: 40, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }} >
          <Text style={{ fontSize: 16, color: "#000000" }}>百果园新店选址商圈评估表</Text>
        </View>
        <StoreInformationField title='调查项目' score='评分' reamrk='商圈情况' backgroundColor='#E3F0F5' />
        <StoreInformationField title='开店类型' reamrk={`${this.props.report.type}`} backgroundColor='white' />
        {
          this.props.report.type != "内部加盟" && <View>
            <StoreInformationField title='加盟模式' reamrk={`${this.props.report.joinMode}`} backgroundColor='rgba(227,240,245,0.5)' />
            <StoreInformationField title='加盟区域' reamrk={`${this.props.report.joinRegion}`} backgroundColor='white' />
          </View>
        }
        <StoreInformationField title='自然辐射住户数' score={this.props.report.residentScore} reamrk={`${this.props.report.residenceNumber}户，商圈规模总住户数${this.props.report.businessDistrictResidenceNumber}户`} backgroundColor='rgba(227,240,245,0.5)' />
        <StoreInformationField title='小区档次' score={this.props.report.communityGrade} reamrk={`${this.props.report.subdistrictQuality}，楼盘均价${this.props.report.realEstatePrice}元，客单价${this.props.report.perTicketSales}元`} backgroundColor='white' />
        <StoreInformationField title='门前人流量' score={this.props.report.humanFlowScore} reamrk={`${this.props.report.peakTimeFlow}人/小时，预计每天来客数${parseInt(`${this.props.report.daliyHumanNumber}`)}人`} backgroundColor='rgba(227,240,245,0.5)' />
        <StoreInformationField title='门店展示' score={this.props.report.shopLocatioScore} reamrk={`${this.props.report.place},${this.props.report.adjacentStores}`} backgroundColor='white' />
        <StoreInformationField title='交通情况' score={this.props.report.trafficScore} reamrk={`${this.props.report.temporaryParking}`} backgroundColor='rgba(227,240,245,0.5)' />
        <StoreInformationField title='本人加分' score={this.props.report.personality} backgroundColor='white' reamrk={this.props.report.personalityReason} />
        <StoreInformationField title='总分数' score={this.props.report.totalScore} backgroundColor='rgba(227,240,245,0.5)' titleColor='#E13333' scroeColor='#E13333' remartColor='#E13333' reamrk="85分以上为优质铺；75-85分之间为中等铺；75分以下要慎重。" />
        <StoreInformationField title='商圈发展潜力' reamrk={this.props.report.overallPotential} backgroundColor='white' />
        <StoreInformationField title='商圈同行竞争情况' reamrk={corrivals} backgroundColor='rgba(227,240,245,0.5)' />
        <StoreInformationField title='商圈形态' reamrk={this.props.report.businissStatus} backgroundColor='white' />
        <StoreInformationField title='门店面积' reamrk={`门店面积${this.props.report.area}平方米,门店长度${this.props.report.length}米，门店宽度${this.props.report.width}米，${this.props.report.hasSecondFloor}二楼`} backgroundColor='rgba(227,240,245,0.5)' />
        <StoreInformationField title='上下水' reamrk={this.props.report.water ? `改造费用${this.props.report.water}元` : '无需改造'} backgroundColor='white' />
        <StoreInformationField title='用电量' reamrk={this.props.report.electricity ? `改造费用${this.props.report.electricity}元` : '无需改造'} backgroundColor='rgba(227,240,245,0.5)' />
        <StoreInformationField title='空调主机位' reamrk={this.props.report.airConditioner ? `改造费用${this.props.report.airConditioner}元` : '无需改造'} backgroundColor='white' />
        <StoreInformationField title='宽带' reamrk={this.props.report.broadband ? `改造费用${this.props.report.broadband}元` : '无需改造'} backgroundColor='rgba(227,240,245,0.5)' />
        <StoreInformationField title='预计稳定月销售额' reamrk={`${this.props.report.monthSale}元`} backgroundColor='white' />
        <StoreInformationField title='预计前6月销售额' reamrk={`${this.props.report.newStoreSales}元`} backgroundColor='rgba(227,240,245,0.5)' />
        <StoreInformationField title='店铺月租' reamrk={`${this.props.report.firstYearRent}元`} backgroundColor='white' />
        <StoreInformationField title='前6个月租金费用率' reamrk={`${this.props.report.rentRate && this.props.report.rentRate * 100}%`} backgroundColor='rgba(227,240,245,0.5)' />
        <StoreInformationField title='转让费' reamrk={`${this.props.report.transferFee}元`} backgroundColor='white' />
        <StoreInformationField title='进场费' reamrk={`${this.props.report.entryFee}元`} backgroundColor='rgba(227,240,245,0.5)' />
        <StoreInformationField title='中介费' reamrk={`${this.props.report.agencyFee}元`} backgroundColor='white' />
        <StoreInformationField title='租赁期限' reamrk={`${this.props.report.leaseTerm}个月`} backgroundColor='rgba(227,240,245,0.5)' />
        <StoreInformationField title='递增情况' reamrk={this.props.report.rentIncreases} backgroundColor='white' />
        <StoreInformationField title='拓展人' reamrk={this.props.report.userName} backgroundColor='rgba(227,240,245,0.5)' titleColor='#E13333' scroeColor='#E13333' remartColor='#E13333' />
        <StoreInformationField title='转让人及电话' reamrk={`${this.props.report.transferorName} ${this.props.report.transferorPhone}`} backgroundColor='white' titleColor='#E13333' scroeColor='#E13333' remartColor='#E13333' />
        <Gap />
      </View>
    )
  }
}
export default connect<StateProps, DispatchProps, OwnProps, ReduxStore>(mapStateToProps, mapDispatchToProps)(TaskEvaluationSheetComponent)
