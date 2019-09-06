export default (xData: Array<string>, yData: Array<number>, title?: string) => {
	return {
		title: {
			text: title
		},
		color: ['#3EC2FA'],
		tooltip: {
			trigger: 'axis',
			axisPointer: {            // 坐标轴指示器，坐标轴触发有效
				type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
			}
		},
		grid: {
			left: '15%'
		},
		xAxis: [
			{
				type: 'category',
				data: xData,
				axisLine: { show: false },
				axisTick: { show: false },
				axisLabel: {
					color: '#3F3F3F'
				}
			},
		],
		yAxis: [
			{
				type: 'value',
				axisLine: { show: false },
				axisTick: { show: false },
				axisLabel: {
					color: '#3F3F3F'
				}
			}
		],
		series: [
			{
				type: 'bar',
				barWidth: '60%',
				data: yData
			}
		]
	}
}
