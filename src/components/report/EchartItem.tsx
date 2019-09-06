import React from 'react'
import { View, ActivityIndicator, Dimensions, Image } from 'react-native'
import EchartComponent from '../../lib/echarts'
import { BaseItemComponent } from './BaseItem';

const { width: screenWidth } = Dimensions.get('window');

interface OwnProps {
    options: any
}

interface OwnState {
}
export default class EchartItemComponent extends BaseItemComponent<OwnProps, OwnState> {
    
	private chart? = React.createRef<EchartComponent>()
	private itemHeight: number

	constructor(props: OwnProps) {
		super(props)

		this.itemHeight = 400
	}

	componentDidMount() {
		this.refreshData()
	}

	componentDidUpdate() {
		this.refreshData()
	}

	public refreshData(option?: object) {
		this.chart && this.chart.current && this.props.options && this.chart.current.setNewOption(this.props.options)
	}

	render() {
		return (
			<View style={{backgroundColor: 'white', height: this.itemHeight, margin: 10}} >
				<EchartComponent ref={this.chart} height={this.itemHeight} width={screenWidth} />
				{
					!this.props.options ? 
					(<View style={{position: 'absolute', alignItems: 'center', justifyContent: 'center', top: 0, right: 0, bottom: 0, left: 0, height: this.itemHeight}} >
							<ActivityIndicator size='large' color='#38adff' hidesWhenStopped={true} animating={true} />
					</View>) : 
					null
				}
				{
					!this.props.options ? 
					(<View style={{position: 'absolute', alignItems: 'center', justifyContent: 'center', top: 0, right: 0, bottom: 0, left: 0, height: this.itemHeight}} >
							<Image source={require('../../assets/images/img_defaultpage4_358x326.png')} />
					</View>) : 
					null
				}
			</View>
		)
	}
}