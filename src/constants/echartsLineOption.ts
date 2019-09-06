export default (names: Array < string > , values: Array < string >, title?: string) => {
    return {
        color: ['#3EC2FA'],
        title: {
            text: title
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        grid: {
            left: '15%'
        },
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            data: names,
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            }
        }],
        yAxis: [{
            type: 'value',
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            }
        }, ],
        series: [{
            type: 'line',
            areaStyle: {
                normal: {}
            },
            data: values
        }]
    }
}