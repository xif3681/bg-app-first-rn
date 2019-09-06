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
  details: string | number
  backgroundColor?: string
}

class StoreInformationField extends React.Component<StoreInformationFieldProps, any> {
  constructor(props: StoreInformationFieldProps) {
    super(props);
  }

  public render() {
    return (
      <View style={{flexDirection: 'row', justifyContent: 'space-between', padding: 10, alignItems: 'center', backgroundColor: this.props.backgroundColor}} >
        <Text style={{flex: 1, fontSize:15, color:"#000000"}} >{this.props.title}</Text>
        <Text style={{flex: 1, textAlign: 'right', fontSize: 15, color: "#000000"}} >{`${this.props.details}`}</Text>
      </View>
    )
  }
}

interface StateProps {}

interface DispatchProps {}

interface OwnProps {
  report: ReportModel
}

interface OwnState {}

const mapStateToProps: MapStateToPropsParam<StateProps, OwnProps, ReduxStore> = state => ({
})
const mapDispatchToProps: MapDispatchToPropsParam<DispatchProps, OwnProps> = (dispatch: ThunkDispatch<ReduxStore, null, Action<any>>) => ({
})
class BudgetSheetComponent extends React.Component<StateProps & DispatchProps & OwnProps, OwnState> {

  constructor(props: StateProps & DispatchProps & OwnProps) {
    super(props)

  }

  render() {
    return (
      <View style={{flex: 1}} >
        <View style={{height: 40, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}} >
          <Text style={{fontSize:16,color:"#000000"}}>百果园加盟店利润预算表</Text>
        </View>
        <View style={{flexDirection: 'row', backgroundColor: '#E3F0F5'}} >
          <View style={{width: 120, justifyContent: 'center', padding: 5, paddingLeft: 10, paddingRight: 10}} >
            <Text style={{fontSize:15,color:"#000000"}}>调查项目</Text>
          </View>
          <View style={{justifyContent: 'center', padding: 5, paddingLeft: 10, paddingRight: 10}} >
            <Text style={{fontSize:15,color:"#000000"}}>指标（元）</Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', backgroundColor: 'rgba(227,240,245,0.5)'}} >
          <View style={{width: 120, padding: 10, justifyContent: 'center'}} >
            <Text style={{fontSize:15,color:"#000000"}}>预计门店毛利额</Text>
          </View>
          <View style={{flex: 1}} >
            <StoreInformationField title='门店月销售额' details={this.props.report.profitNewStoreSales!} />
            <StoreInformationField title='门店净利率' details={this.props.report.grossMargin!+"%"} backgroundColor='white' />
            <StoreInformationField title='毛利额合计' details={this.props.report.totalGrossProfit!} />
          </View>
        </View>
        <View style={{height: 1, backgroundColor: 'white'}} />
        <View style={{flexDirection: 'row', backgroundColor: 'rgba(227,240,245,0.5)'}} >
          <View style={{width: 120, padding: 10, justifyContent: 'center'}} >
            <Text style={{fontSize:15,color:"#000000"}}>预计门店费用</Text>
          </View>
          <View style={{flex: 1}} >
            <StoreInformationField title='门店月租金' details={this.props.report.firstYearRent!} backgroundColor='white' />
            {/* <StoreInformationField title='装修设备折旧按60个月平均分摊' details={this.props.report.renovationCosts!} /> */}
            <StoreInformationField title='宿舍月租金' details={this.props.report.staffQuartersFee!}  />
            <StoreInformationField title='工资' details={this.props.report.monthyWage!} backgroundColor='white'/>
            <StoreInformationField title='月均电费' details={this.props.report.electricityBill!}  />
            <StoreInformationField title='其他费用' details={this.props.report.otherFee!} backgroundColor='white'/>
            <StoreInformationField title='特许权使用费' details={this.props.report.licenseCost!}  />
            {/* <StoreInformationField title='装修设备折旧分摊' details={this.props.report.renovationCosts!} /> */}
            <StoreInformationField title='费用合计' details={this.props.report.totalCost!} backgroundColor='white' />
          </View>
        </View>
        <View style={{height: 1, backgroundColor: 'white'}} />
        <View style={{flexDirection: 'row', backgroundColor: 'rgba(227,240,245,0.5)'}} >
          <View style={{width: 120, padding: 10, justifyContent: 'center'}} >
            <Text style={{fontSize:15,color:"#000000"}}>门店月净利润</Text>
          </View>
          <View style={{flex: 1}} >
          <StoreInformationField title='' details={this.props.report.netProfit!} />
          </View>
        </View>
        <Gap />
      </View>
    )
  }
}
export default connect<StateProps, DispatchProps, OwnProps, ReduxStore>(mapStateToProps, mapDispatchToProps)(BudgetSheetComponent)
