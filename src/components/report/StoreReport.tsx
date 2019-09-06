import React from 'react'
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native'
import { ReduxStoreAsyncItemState } from '../../reducers'
import { TaskFormLocationHeader, Gap } from '../task/FormOne'
import { TaskModel } from '../../types/task'
import TaskEvaluationSheet from './TaskEvaluationSheet'
import TaskBudgetSheet from './TaskBudgetSheet'
import TaskPhoto from './TaskPhoto';
import { ReportModel } from '../../types/report';

interface StoreInformationSegmentProps {
  onValueChange?: (index: number) => void
}

interface StoreInformationSegmentStates {
  index: number
}

class StoreInformationSegment extends React.Component<StoreInformationSegmentProps, StoreInformationSegmentStates> {
  constructor(props: StoreInformationSegmentProps) {
    super(props);

    this.state = {
      index: 0
    }
  }

  private onItemPressCallbackCreater = (index: number) => () => {
    this.setState({index})
    this.props.onValueChange && this.props.onValueChange(index)
  }

  public render() {
    return (
      <View style={{flexDirection: 'row', justifyContent: 'space-around', margin: 5}} >
        <TouchableOpacity onPress={this.onItemPressCallbackCreater(0)} style={this.state.index === 0 ? styles.StoreInformationSelectedBackground : styles.StoreInformationUnselectedBackground} >
          <Text style={this.state.index === 0 ? styles.StoreInformationSelectedText : styles.StoreInformationUnselectedText}>评估表</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onItemPressCallbackCreater(1)} style={this.state.index === 1 ? styles.StoreInformationSelectedBackground : styles.StoreInformationUnselectedBackground} >
          <Text style={this.state.index === 1 ? styles.StoreInformationSelectedText : styles.StoreInformationUnselectedText}>预算表</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onItemPressCallbackCreater(2)} style={this.state.index === 2 ? styles.StoreInformationSelectedBackground : styles.StoreInformationUnselectedBackground} >
          <Text style={this.state.index === 2 ? styles.StoreInformationSelectedText : styles.StoreInformationUnselectedText}>照片</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  StoreInformationSelectedBackground: {backgroundColor: '#3EC2FA', borderRadius: 3},
  StoreInformationSelectedText: {margin: 5, marginLeft: 15, marginRight: 15, fontSize: 16, color: 'white'},
  StoreInformationUnselectedText: {margin: 5, marginLeft: 15, marginRight: 15, fontSize: 16, color: 'rgba(0, 0, 0, 0.2)'},
  StoreInformationUnselectedBackground: {borderColor: 'rgba(0, 0, 0, 0.2)', borderWidth: 1, borderRadius: 3}
})

interface StoreReportProps {
  taskReport?: ReduxStoreAsyncItemState<ReportModel>
  task?: ReduxStoreAsyncItemState<TaskModel>
}

interface StoreReportState {
  segmentIndex: number
}

export default class StoreReport extends React.Component<StoreReportProps, StoreReportState> {

  constructor(props: StoreReportProps) {
    super(props)

    this.state = {
      segmentIndex: 0
    }
  }

  private onStoreInformationSegmentValueChange = (segmentIndex: number) => {
    this.setState({segmentIndex})
  }

  render() {
    return (
      <ScrollView style={{flex: 1, backgroundColor: '#F1F1F1'}} >
        <TaskFormLocationHeader location={this.props.task && this.props.task.get('data') && this.props.task.get('data')!.location} />
        <StoreInformationSegment onValueChange={this.onStoreInformationSegmentValueChange} />
        <Gap />
        {
          this.state.segmentIndex === 0 && this.props.taskReport && this.props.taskReport.get('data') ? 
          (
            <TaskEvaluationSheet report={this.props.taskReport.get('data')!} />
          ) :
          null
        }
        {
          this.state.segmentIndex === 1 && this.props.taskReport && this.props.taskReport.get('data') ?
          (
            <TaskBudgetSheet report={this.props.taskReport.get('data')!} />
          ) : 
          null
        }
        {
          this.state.segmentIndex === 2 && this.props.task && this.props.task.get('data') ?
          (
            <TaskPhoto task={this.props.task.get('data')!} />
          ) :
          null
        }
      </ScrollView>
    )
  }
}
