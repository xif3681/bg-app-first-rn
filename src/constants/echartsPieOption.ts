export default (names: Array < string > , values: Array < string >, title?: string) => {
    const series = names.map((name, index) => ({value: values[index], name: names[index]}))
    return {
        color: ['#CEE131', '#28EE9D', '#31CEE1', '#3184E1'],
        title: {
            text: title
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            data: names,
            top: 30
        },
        grid: {
            left: '15%'
        },
        series: [{
            type: 'pie',
            radius: ['50%', '70%'],

            label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontWeight: 'bold'
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data: series
        }]
    }
}