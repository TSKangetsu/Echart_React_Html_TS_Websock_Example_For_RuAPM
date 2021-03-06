import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { EchartShowSys } from './EchartsShow';
import { NetServerMain } from './WebSocks'

let myServer: NetServerMain = new NetServerMain(27015, "192.168.137.24");

interface BProps {
}

interface BState {
    F_ESCARM: boolean;
    F_Error: boolean;
    F_RCDisconnect: boolean;
    F_GPSDisconnect: boolean;
    FlyMode: string;

    CHARTDEBUG1_1: number;
    CHARTDEBUG1_2: number;
    CHARTDEBUG1_3: number;
    CHARTDEBUG1_4: number;
    CHARTDEBUG2_1: number;
    CHARTDEBUG2_2: number;
    CHARTDEBUG2_3: number;
    CHARTDEBUG3_1: number;
    CHARTDEBUG3_2: number;
    CHARTDEBUG3_3: number;
    CHARTDEBUG4_1: number;
    CHARTDEBUG4_2: number;
    CHARTDEBUG4_3: number;
    CHARTDEBUG5_1: number;
    CHARTDEBUG5_2: number;
}

class Body extends React.Component<BProps, BState> {
    myChartReal: EchartShowSys;
    myChartGryo: EchartShowSys;
    myChartAccel: EchartShowSys;
    myChartRC: EchartShowSys;
    myChartAlt: EchartShowSys;
    myChartDEBUG1: EchartShowSys;
    myChartDEBUG2: EchartShowSys;
    myChartDEBUG3: EchartShowSys;
    myChartDEBUG4: EchartShowSys;
    myChartDEBUG5: EchartShowSys;
    timerID: NodeJS.Timeout;
    rcoption = {
        xAxis: {
            max: 500,
            min: -500
        },
        yAxis: {
            type: 'category',
            data: ['Picth', 'Roll', 'Throttle', 'Yaw'],
            inverse: true,
            animationDuration: 10,
            animationDurationUpdate: 10,
            max: 3
        },
        series: [{
            type: 'bar',
            data: [0, 0, 0, 0],
            label: {
                show: true,
                position: 'right',
                valueAnimation: true
            }
        }],
        legend: {
            show: true
        },
        grid: {
            show: true,
            x: 40,
            x2: 10,
            y: 10,
            y2: 20
        },
        animationDuration: 30,
        animationDurationUpdate: 30,
        animationEasing: 'linear',
        animationEasingUpdate: 'linear'
    };

    altoption = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                animation: false
            }
        },
        xAxis: {
            type: 'category',
            data: ['Current', 'Target'],
            inverse: true,
            animationDuration: 30,
            animationDurationUpdate: 30,
            splitLine: {
                show: true
            }
        },
        yAxis: {
            max: function (value) {
                return value.max + 50
            },
            min: function (value) {
                return value.min - 50
            },
            name: 'Altitude',
            type: 'value',
        },
        series: [{
            data: [0, 0],
            type: 'bar',
            label: {
                show: true,
                valueAnimation: true
            }
        }],
        grid: {
            show: true,
            x: 60,
            x2: 20,
            y: 10,
            y2: 20
        },

        animationDuration: 30,
        animationDurationUpdate: 30,
        animationEasing: 'linear',
        animationEasingUpdate: 'linear'
    }

    private chartCSS: React.CSSProperties = {
        height: "150px",
        width: "800px",
        paddingTop: "20px",
    }

    private altCSS: React.CSSProperties = {
        position: "absolute",
        height: "500px",
        width: "250px",
        display: "inline-block",
        border: "0px",
        left: "850px",
        top: "300px"
    }

    private statusCSS: React.CSSProperties = {
        position: "absolute",
        height: "300px",
        width: "250px",
        paddingTop: "20px",
        border: "0px",
        display: "inline-block",
        left: "850px",
        top: "0px"
    }

    constructor(props) {
        super(props);
        this.state = {
            F_ESCARM: true,
            F_Error: true,
            F_GPSDisconnect: true,
            F_RCDisconnect: true,
            FlyMode: "AutoStable",
            CHARTDEBUG1_1: 0,
            CHARTDEBUG1_2: 0,
            CHARTDEBUG1_3: 0,
            CHARTDEBUG1_4: 0,
            CHARTDEBUG2_1: 0,
            CHARTDEBUG2_2: 0,
            CHARTDEBUG2_3: 0,
            CHARTDEBUG3_1: 0,
            CHARTDEBUG3_2: 0,
            CHARTDEBUG3_3: 0,
            CHARTDEBUG4_1: 0,
            CHARTDEBUG4_2: 0,
            CHARTDEBUG4_3: 0,
            CHARTDEBUG5_1: 0,
            CHARTDEBUG5_2: 0,
        }
    }

    public render(): JSX.Element {
        return (
            <>
                <div id="flyingStatus" style={this.statusCSS}>
                    <h4>ESC is ARM : {String(this.state.F_ESCARM)}</h4>
                    <h4>Controller is Error : {String(this.state.F_Error)}</h4>
                    <h4>RC connect: {String(!this.state.F_RCDisconnect)}</h4>
                    <h4>GPS connect : {String(!this.state.F_GPSDisconnect)}</h4>
                    <h4>FlyMode: {this.state.FlyMode}</h4>
                </div>

                <div>RealAngle</div>
                <div id="chartAreaReal" style={this.chartCSS}></div>
                <div>GryoAngle</div>
                <div id="chartAreaGryo" style={this.chartCSS}></div>
                <div>AccelAngle</div>
                <div id="chartAreaAccel" style={this.chartCSS}></div>
                <div id="chartAreaAlt" style={this.altCSS}></div>
                <div>DEBUG1_{this.state.CHARTDEBUG1_1}_{this.state.CHARTDEBUG1_2}_{this.state.CHARTDEBUG1_3}_{this.state.CHARTDEBUG1_4}</div>
                <div id="chartAreaDEBUG1" style={this.chartCSS}></div>
                <div>DEBUG2_{this.state.CHARTDEBUG2_1}_{this.state.CHARTDEBUG2_2}_{this.state.CHARTDEBUG2_3}</div>
                <div id="chartAreaDEBUG2" style={this.chartCSS}></div>
                <div>DEBUG3_{this.state.CHARTDEBUG3_1}_{this.state.CHARTDEBUG3_2}</div>
                <div id="chartAreaDEBUG3" style={this.chartCSS}></div>
                <div>DEBUG4_{this.state.CHARTDEBUG4_1}_{this.state.CHARTDEBUG4_2}_{this.state.CHARTDEBUG4_3}</div>
                <div id="chartAreaDEBUG4" style={this.chartCSS}></div>
                <div>DEBUG5_{this.state.CHARTDEBUG5_1}_{this.state.CHARTDEBUG5_2}</div>
                <div id="chartAreaDEBUG5" style={this.chartCSS}></div>
                <div>RCInput</div>
                <div id="chartAreaRC" style={this.chartCSS}></div>
            </>
        )
    }

    componentDidMount() {
        this.myChartReal = new EchartShowSys(document.getElementById("chartAreaReal"), "DEBUGOuput", { ymax: 70, ymin: -70 });
        this.myChartAccel = new EchartShowSys(document.getElementById("chartAreaAccel"), "DEBUGOuput", { ymax: 70, ymin: -70 });
        this.myChartGryo = new EchartShowSys(document.getElementById("chartAreaGryo"), "DEBUGOuput", { ymax: 500, ymin: -500 });
        this.myChartRC = new EchartShowSys(document.getElementById("chartAreaRC"), "DEBUGOuput", { ymax: 0, ymin: 0 }, false);
        this.myChartRC.CustomOptionSet(this.rcoption);
        this.myChartAlt = new EchartShowSys(document.getElementById("chartAreaAlt"), "DEBUGOuput", { ymax: 0, ymin: 0 }, false);
        this.myChartAlt.CustomOptionSet(this.altoption);
        this.myChartDEBUG1 = new EchartShowSys(document.getElementById("chartAreaDEBUG1"), "DEBUGOuput", { ymax: (value) => { return value.max + 200 }, ymin: (value) => { return value.min - 200 } });
        this.myChartDEBUG2 = new EchartShowSys(document.getElementById("chartAreaDEBUG2"), "DEBUGOuput", { ymax: (value) => { return value.max + 200 }, ymin: (value) => { return value.min - 200 } });
        this.myChartDEBUG3 = new EchartShowSys(document.getElementById("chartAreaDEBUG3"), "DEBUGOuput", { ymax: (value) => { return value.max + 20 }, ymin: (value) => { return value.min - 20 } });
        this.myChartDEBUG4 = new EchartShowSys(document.getElementById("chartAreaDEBUG4"), "DEBUGOuput", { ymax: (value) => { return value.max + 5 }, ymin: (value) => { return value.min - 5 } });
        this.myChartDEBUG5 = new EchartShowSys(document.getElementById("chartAreaDEBUG5"), "DEBUGOuput", { ymax: (value) => { return value.max + 5 }, ymin: (value) => { return value.min - 5 } });
        //
        this.myChartReal.EhcartSeriesAdd({
            name: 'Charts',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: new Array(200),
            lineStyle: { color: 'red' }
        });
        this.myChartReal.EhcartSeriesAdd({
            name: 'Charts',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: new Array(200),
            lineStyle: { color: 'blue' }
        });
        //
        this.myChartGryo.EhcartSeriesAdd({
            name: 'Charts',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: new Array(200),
            lineStyle: { color: 'red' }
        });
        this.myChartGryo.EhcartSeriesAdd({
            name: 'Charts',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: new Array(200),
            lineStyle: { color: 'blue' }
        });
        this.myChartGryo.EhcartSeriesAdd({
            name: 'Charts',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: new Array(200),
            lineStyle: { color: 'green' }
        });
        //
        this.myChartAccel.EhcartSeriesAdd({
            name: 'Charts',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: new Array(200),
            lineStyle: { color: 'red' }
        });
        this.myChartAccel.EhcartSeriesAdd({
            name: 'Charts',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: new Array(200),
            lineStyle: { color: 'blue' }
        });
        //
        this.myChartDEBUG1.EhcartSeriesAdd({
            name: 'Charts',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: new Array(200),
            lineStyle: { color: 'red' }
        });
        this.myChartDEBUG1.EhcartSeriesAdd({
            name: 'Charts',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: new Array(200),
            lineStyle: { color: 'blue' }
        });
        this.myChartDEBUG1.EhcartSeriesAdd({
            name: 'Charts',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: new Array(200),
            lineStyle: { color: 'yellow' }
        });
        this.myChartDEBUG1.EhcartSeriesAdd({
            name: 'Charts',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: new Array(200),
            lineStyle: { color: 'green' }
        });

        //
        this.myChartDEBUG2.EhcartSeriesAdd({
            name: 'Charts',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: new Array(200),
            lineStyle: { color: 'red' }
        });
        this.myChartDEBUG2.EhcartSeriesAdd({
            name: 'Charts',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: new Array(200),
            lineStyle: { color: 'blue' }
        });
        this.myChartDEBUG2.EhcartSeriesAdd({
            name: 'Charts',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: new Array(200),
            lineStyle: { color: 'green' }
        });
        //
        this.myChartDEBUG3.EhcartSeriesAdd({
            name: 'Charts',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: new Array(200),
            lineStyle: { color: 'red' }
        });
        this.myChartDEBUG3.EhcartSeriesAdd({
            name: 'Charts',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: new Array(200),
            lineStyle: { color: 'blue' }
        });
        this.myChartDEBUG3.EhcartSeriesAdd({
            name: 'Charts',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: new Array(200),
            lineStyle: { color: 'green' }
        });
        this.myChartDEBUG4.EhcartSeriesAdd({
            name: 'Charts',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: new Array(200),
            lineStyle: { color: 'red' }
        });
        this.myChartDEBUG4.EhcartSeriesAdd({
            name: 'Charts',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: new Array(200),
            lineStyle: { color: 'blue' }
        });
        this.myChartDEBUG5.EhcartSeriesAdd({
            name: 'Charts',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: new Array(200),
            lineStyle: { color: 'red' }
        });
        this.myChartDEBUG5.EhcartSeriesAdd({
            name: 'Charts',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: new Array(200),
            lineStyle: { color: 'blue' }
        });
        //
        this.timerID = setInterval(() => {
            this.myChartReal.EchartsDataAdd(parseInt(myServer.JSONData.RealPitch), 1);
            this.myChartReal.EchartsDataAdd(parseInt(myServer.JSONData.RealRoll), 2);
            this.myChartGryo.EchartsDataAdd(parseInt(myServer.JSONData.GRYOPitch), 1);
            this.myChartGryo.EchartsDataAdd(parseInt(myServer.JSONData.GRYORoll), 2);
            this.myChartGryo.EchartsDataAdd(parseInt(myServer.JSONData.GRYOYaw), 3);
            this.myChartAccel.EchartsDataAdd(parseInt(myServer.JSONData.AccelPitch), 1);
            this.myChartAccel.EchartsDataAdd(parseInt(myServer.JSONData.AccelRoll), 2);
            this.rcoption.series[0].data[0] = parseInt(myServer.JSONData.RCPitch);
            this.rcoption.series[0].data[1] = parseInt(myServer.JSONData.RCRoll);
            this.rcoption.series[0].data[2] = parseInt(myServer.JSONData.RCThrottle);
            this.rcoption.series[0].data[2] = (this.rcoption.series[0].data[2] - 1500)
            this.rcoption.series[0].data[3] = parseInt(myServer.JSONData.RCYaw);
            this.myChartRC.CustomOptionSet(this.rcoption);
            this.altoption.series[0].data[0] = parseInt(myServer.JSONData.MovementZ);
            this.altoption.series[0].data[1] = parseInt(myServer.JSONData.DiffAlttitude);
            this.myChartAlt.CustomOptionSet(this.altoption);
            this.myChartDEBUG1.EchartsDataAdd(parseInt(myServer.JSONData.RawADFY), 1);
            this.myChartDEBUG1.EchartsDataAdd(parseInt(myServer.JSONData.RawFAY), 2);
            this.myChartDEBUG1.EchartsDataAdd(parseInt(myServer.JSONData.RawADFZ) - 4096, 3);
            this.myChartDEBUG1.EchartsDataAdd(parseInt(myServer.JSONData.RawFAZ) - 4096, 4);
            this.myChartDEBUG2.EchartsDataAdd(parseInt(myServer.JSONData.RawSAX), 1);
            this.myChartDEBUG2.EchartsDataAdd(parseInt(myServer.JSONData.RawSAY), 2);
            this.myChartDEBUG2.EchartsDataAdd(parseInt(myServer.JSONData.RawSAZ), 3);
            this.myChartDEBUG3.EchartsDataAdd(parseInt(myServer.JSONData.SpeedZ), 1);
            this.myChartDEBUG3.EchartsDataAdd(parseInt(myServer.JSONData.ClimbeRate), 2);
            this.myChartDEBUG3.EchartsDataAdd(parseInt(myServer.JSONData.AltThrottle), 3);
            this.myChartDEBUG4.EchartsDataAdd(parseInt(myServer.JSONData.MovementZ), 1);
            this.myChartDEBUG4.EchartsDataAdd(parseInt(myServer.JSONData.DiffAlttitude), 2);
            this.myChartDEBUG5.EchartsDataAdd(parseInt(myServer.JSONData.FlowOutX), 1);
            this.myChartDEBUG5.EchartsDataAdd(parseInt(myServer.JSONData.FlowOutY), 2);
            //
            this.setState({
                F_Error: myServer.JSONData.F_Error,
                F_ESCARM: myServer.JSONData.F_ESCARM,
                F_GPSDisconnect: myServer.JSONData.F_GPSDisconnect,
                F_RCDisconnect: myServer.JSONData.F_RCDisconnect,
                CHARTDEBUG3_1: parseInt(myServer.JSONData.SpeedZ),
                CHARTDEBUG3_2: parseInt(myServer.JSONData.ClimbeRate),
                CHARTDEBUG3_3: parseInt(myServer.JSONData.AltThrottle),
            });
            if (myServer.JSONData.flyMode == 2) {
                this.setState({ FlyMode: "AutoStable" })
            }
            if (myServer.JSONData.flyMode == 1) {
                this.setState({ FlyMode: "AltHold" })
            }
            if (myServer.JSONData.flyMode == 3) {
                this.setState({ FlyMode: "PositionHold" })
            }
        }, 50)
    }
}

ReactDOM.render(<Body />, document.getElementById("app"));

