import * as echarts from 'echarts';


export class EchartShowSys {
    _echarts_Area: HTMLDivElement;
    _echartsMain: echarts.ECharts;
    _ehcartsSeriesCount: number = 0;
    _echartsOption = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                animation: false
            }
        },
        xAxis: {
            type: 'category',
            splitLine: {
                show: true
            }
        },
        yAxis: [
            {
                type: 'value',
                name: 'Gryo',
                max: 2000,
                min: -2000,
                boundaryGap: [1, 1]
            }
        ],
        grid: {
            show: true,
            x: 40,
            x2: 10,
            y: 10,
            y2: 10
        },
        series: []
    }

    constructor(htmlShowArea: HTMLElement, name: string,
        chartsSize: { ymax: any, ymin: any }, IsUseDefaultOption: boolean = true) {
        this._echarts_Area = <HTMLDivElement>htmlShowArea;
        this._echartsMain = echarts.init(this._echarts_Area, {
            renderer: 'canvas',
        });
        this._echartsOption.yAxis[0].name = name;
        this._echartsOption.yAxis[0].max = chartsSize.ymax;
        this._echartsOption.yAxis[0].min = chartsSize.ymin;
        if (IsUseDefaultOption)
            this._echartsMain.setOption(<echarts.EChartOption>this._echartsOption);
    }

    CustomOptionSet(option: any) {
        this._echartsOption = option;
        this._echartsMain.setOption(<echarts.EChartOption>this._echartsOption);
    }

    EchartsDataAdd(inputData: number, seriesNumber: number) {
        if (inputData > this._echartsOption.yAxis[0].max) {
            this._echartsOption.series[seriesNumber - 1].data.shift();
            this._echartsOption.series[seriesNumber - 1].data.push(this._echartsOption.yAxis[0].max - 1);
            this._echartsMain.setOption(<echarts.EChartOption>this._echartsOption);
        } else if (inputData < this._echartsOption.yAxis[0].min) {
            this._echartsOption.series[seriesNumber - 1].data.shift();
            this._echartsOption.series[seriesNumber - 1].data.push(this._echartsOption.yAxis[0].min + 1);
            this._echartsMain.setOption(<echarts.EChartOption>this._echartsOption);
        } else {
            this._echartsOption.series[seriesNumber - 1].data.shift();
            this._echartsOption.series[seriesNumber - 1].data.push(inputData);
            this._echartsMain.setOption(<echarts.EChartOption>this._echartsOption);
        }
    }

    EchartAreaUpdate() {
        this._echartsMain.resize();
    }

    EhcartSeriesAdd(option: any): number {
        this._ehcartsSeriesCount += 1;
        this._echartsOption.series.push(option);
        return this._ehcartsSeriesCount;
    }

    GetCurrentEchartsName() {
        return this._echartsOption.yAxis[0].name;
    }
}