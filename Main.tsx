import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { EchartShowSys } from './EchartsShow';
import { NetServerMain } from './WebSocks'

let myServer: NetServerMain = new NetServerMain(27015, "192.168.137.89");

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

    RealAngleEnable: boolean;
    GryoAngleEnable: boolean;
    AccelAngleEnable: boolean;
    AltEnable: boolean;
    DEBUG1Enable: boolean;
    DEBUG2Enable: boolean;
    DEBUG3Enable: boolean;
    DEBUG4Enable: boolean;
    DEBUG5Enable: boolean;
    DEBUG6Enable: boolean;
    RCEnable: boolean
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
    myChartDEBUG6: EchartShowSys;
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
            RealAngleEnable: true,
            GryoAngleEnable: true,
            AccelAngleEnable: true,
            AltEnable: true,
            DEBUG1Enable: true,
            DEBUG2Enable: true,
            DEBUG3Enable: true,
            DEBUG4Enable: true,
            DEBUG5Enable: true,
            DEBUG6Enable: true,
            RCEnable: true,
        }
        this.checkBoxHandle = this.checkBoxHandle.bind(this);
    }

    public render(): JSX.Element {
        return (
            <>
                <div>
                    <label>
                        RealAngle
                        <input type="checkbox" value="RealAngle" onChange={this.checkBoxHandle} />
                    </label>
                    <label>
                        AccelAngle
                        <input type="checkbox" value="AccelAngle" onChange={this.checkBoxHandle} />
                    </label>
                    <label>
                        GryoAngle
                        <input type="checkbox" value="GryoAngle" onChange={this.checkBoxHandle} />
                    </label>
                    <label>
                        Alt
                        <input type="checkbox" value="Alt" onChange={this.checkBoxHandle} />
                    </label>
                    <label>
                        RC
                        <input type="checkbox" value="RC" onChange={this.checkBoxHandle} />
                    </label>
                    <label>
                        Debug1
                        <input type="checkbox" value="Debug1" onChange={this.checkBoxHandle} />
                    </label>
                    <label>
                        Debug2
                        <input type="checkbox" value="Debug2" onChange={this.checkBoxHandle} />
                    </label>
                    <label>
                        Debug3
                        <input type="checkbox" value="Debug3" onChange={this.checkBoxHandle} />
                    </label>
                    <label>
                        Debug4
                        <input type="checkbox" value="Debug4" onChange={this.checkBoxHandle} />
                    </label>
                    <label>
                        Debug5
                        <input type="checkbox" value="Debug5" onChange={this.checkBoxHandle} />
                    </label>
                    <label>
                        Debug6
                        <input type="checkbox" value="Debug6" onChange={this.checkBoxHandle} />
                    </label>
                </div>
                <div id="flyingStatus" style={this.statusCSS}>
                    <h4>ESC is ARM : {String(this.state.F_ESCARM)}</h4>
                    <h4>Controller is Error : {String(this.state.F_Error)}</h4>
                    <h4>RC connect: {String(!this.state.F_RCDisconnect)}</h4>
                    <h4>GPS connect : {String(!this.state.F_GPSDisconnect)}</h4>
                    <h4>FlyMode: {this.state.FlyMode}</h4>
                </div>

                {this.state.RealAngleEnable
                    ? <><div>RealAngle</div><div id="chartAreaReal" style={this.chartCSS}></div></>
                    : <><div id="chartAreaReal"></div></>
                }

                {
                    this.state.GryoAngleEnable
                        ? <><div>GryoAngle</div><div id="chartAreaGryo" style={this.chartCSS}></div></>
                        : <><div id="chartAreaGryo" style={{ display: "none" }}></div></>
                }
                {
                    this.state.AccelAngleEnable
                        ? <><div>AccelAngle</div><div id="chartAreaAccel" style={this.chartCSS}></div></>
                        : <><div id="chartAreaAccel" style={{ display: "none" }}></div></>
                }
                {
                    this.state.AltEnable
                        ? <div id="chartAreaAlt" style={this.altCSS}></div>
                        : <><div id="chartAreaAlt" style={{ display: "none" }}></div></>
                }
                {
                    this.state.DEBUG1Enable
                        ? <><div>DEBUG1_{this.state.CHARTDEBUG1_1}_{this.state.CHARTDEBUG1_2}_{this.state.CHARTDEBUG1_3}_{this.state.CHARTDEBUG1_4}</div>
                            <div id="chartAreaDEBUG1" style={this.chartCSS}></div></>
                        : <><div id="chartAreaDEBUG1" style={{ display: "none" }}></div></>
                }

                {
                    this.state.DEBUG2Enable
                        ? <><div>DEBUG2_{this.state.CHARTDEBUG2_1}_{this.state.CHARTDEBUG2_2}_{this.state.CHARTDEBUG2_3}</div>
                            <div id="chartAreaDEBUG2" style={this.chartCSS}></div></>
                        : <><div id="chartAreaDEBUG2" style={{ display: "none" }}></div></>
                }
                {
                    this.state.DEBUG3Enable
                        ? <><div>DEBUG3_{this.state.CHARTDEBUG3_1}_{this.state.CHARTDEBUG3_2}</div>
                            <div id="chartAreaDEBUG3" style={this.chartCSS}></div></>
                        : <><div id="chartAreaDEBUG3" style={{ display: "none" }}></div></>
                }
                {
                    this.state.DEBUG4Enable
                        ? <><div>DEBUG4_{this.state.CHARTDEBUG4_1}_{this.state.CHARTDEBUG4_2}_{this.state.CHARTDEBUG4_3}</div>
                            <div id="chartAreaDEBUG4" style={this.chartCSS}></div></>
                        : <><div id="chartAreaDEBUG4" style={{ display: "none" }}></div></>
                }
                {
                    this.state.DEBUG5Enable
                        ? <>
                            <div>DEBUG5_{this.state.CHARTDEBUG5_1}_{this.state.CHARTDEBUG5_2}</div>
                            <div id="chartAreaDEBUG5" style={this.chartCSS}></div></>
                        : <><div id="chartAreaDEBUG5" style={{ display: "none" }}></div></>
                }
                {
                    this.state.DEBUG6Enable
                        ? <>
                            <div>DEBUG6_</div>
                            <div id="chartAreaDEBUG6" style={this.chartCSS}></div></>
                        : <><div id="chartAreaDEBUG6" style={{ display: "none" }}></div></>
                }
                {
                    this.state.RCEnable
                        ? <>
                            <div>RCInput</div>
                            <div id="chartAreaRC" style={this.chartCSS}></div></>
                        : <><div id="chartAreaRC" style={{ display: "none" }}></div></>
                }
            </>
        )
    }

    checkBoxHandle(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.value == "RealAngle") {
            if (event.target.checked) {
                this.setState({ RealAngleEnable: true })
            }
            else {
                this.setState({ RealAngleEnable: false })
            }
        }
        else if (event.target.value == "AccelAngle") {
            if (event.target.checked) {
                this.setState({ AccelAngleEnable: true })
            }
            else {
                this.setState({ AccelAngleEnable: false })
            }
        }
        else if (event.target.value == "GryoAngle") {
            if (event.target.checked) {
                this.setState({ GryoAngleEnable: true })
            }
            else {
                this.setState({ GryoAngleEnable: false })
            }
        }
        else if (event.target.value == "Alt") {
            if (event.target.checked) {
                this.setState({ AltEnable: true })
            }
            else {
                this.setState({ AltEnable: false })
            }
        }
        else if (event.target.value == "RC") {
            if (event.target.checked) {
                this.setState({ RCEnable: true })
            }
            else {
                this.setState({ RCEnable: false })
            }
        }
        else if (event.target.value == "Debug1") {
            if (event.target.checked) {
                this.setState({ DEBUG1Enable: true })
            }
            else {
                this.setState({ DEBUG1Enable: false })
            }
        }
        else if (event.target.value == "Debug2") {
            if (event.target.checked) {
                this.setState({ DEBUG2Enable: true })
            }
            else {
                this.setState({ DEBUG2Enable: false })
            }
        }
        else if (event.target.value == "Debug3") {
            if (event.target.checked) {
                this.setState({ DEBUG3Enable: true })
            }
            else {
                this.setState({ DEBUG3Enable: false })
            }
        }
        else if (event.target.value == "Debug4") {
            if (event.target.checked) {
                this.setState({ DEBUG4Enable: true })
            }
            else {
                this.setState({ DEBUG4Enable: false })
            }
        }
        else if (event.target.value == "Debug5") {
            if (event.target.checked) {
                this.setState({ DEBUG5Enable: true })
            }
            else {
                this.setState({ DEBUG5Enable: false })
            }
        }
        else if (event.target.value == "Debug6") {
            if (event.target.checked) {
                this.setState({ DEBUG6Enable: true })
            }
            else {
                this.setState({ DEBUG6Enable: false })
            }
        }
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
        this.myChartDEBUG6 = new EchartShowSys(document.getElementById("chartAreaDEBUG6"), "DEBUGOuput", { ymax: (value) => { return value.max + 5 }, ymin: (value) => { return value.min - 5 } });
        //
        if (this.state.RealAngleEnable) {
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
            this.myChartReal.EhcartSeriesAdd({
                name: 'Charts',
                type: 'line',
                showSymbol: false,
                hoverAnimation: false,
                data: new Array(200),
                lineStyle: { color: 'green' }
            });
            this.myChartReal.EhcartSeriesAdd({
                name: 'Charts',
                type: 'line',
                showSymbol: false,
                hoverAnimation: false,
                data: new Array(200),
                lineStyle: { color: 'black' }
            });
        }
        //
        if (this.state.GryoAngleEnable) {
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
        }
        //
        if (this.state.AccelAngleEnable) {
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
        }
        //
        if (this.state.DEBUG1Enable) {
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
        }
        //
        if (this.state.DEBUG2Enable) {
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
        }
        //
        if (this.state.DEBUG3Enable) {
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
            this.myChartDEBUG3.EhcartSeriesAdd({
                name: 'Charts',
                type: 'line',
                showSymbol: false,
                hoverAnimation: false,
                data: new Array(200),
                lineStyle: { color: 'black' }
            });
        }
        //
        if (this.state.DEBUG4Enable) {
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
            this.myChartDEBUG4.EhcartSeriesAdd({
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
                lineStyle: { color: 'black' }
            });
        }
        //
        if (this.state.DEBUG5Enable) {
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
            this.myChartDEBUG5.EhcartSeriesAdd({
                name: 'Charts',
                type: 'line',
                showSymbol: false,
                hoverAnimation: false,
                data: new Array(200),
                lineStyle: { color: 'green' }
            });
            this.myChartDEBUG5.EhcartSeriesAdd({
                name: 'Charts',
                type: 'line',
                showSymbol: false,
                hoverAnimation: false,
                data: new Array(200),
                lineStyle: { color: 'black' }
            });
        }
        if (this.state.DEBUG6Enable) {
            this.myChartDEBUG6.EhcartSeriesAdd({
                name: 'Charts',
                type: 'line',
                showSymbol: false,
                hoverAnimation: false,
                data: new Array(200),
                lineStyle: { color: 'red' }
            });
            this.myChartDEBUG6.EhcartSeriesAdd({
                name: 'Charts',
                type: 'line',
                showSymbol: false,
                hoverAnimation: false,
                data: new Array(200),
                lineStyle: { color: 'blue' }
            });
            this.myChartDEBUG6.EhcartSeriesAdd({
                name: 'Charts',
                type: 'line',
                showSymbol: false,
                hoverAnimation: false,
                data: new Array(200),
                lineStyle: { color: 'green' }
            });
            this.myChartDEBUG6.EhcartSeriesAdd({
                name: 'Charts',
                type: 'line',
                showSymbol: false,
                hoverAnimation: false,
                data: new Array(200),
                lineStyle: { color: 'black' }
            });
        }

        this.timerID = setInterval(() => {
            if (this.state.RealAngleEnable) {
                this.myChartReal.EchartsDataAdd(parseInt(myServer.JSONData.RealPitch), 1);
                this.myChartReal.EchartsDataAdd(parseInt(myServer.JSONData.RealRoll), 2);
                this.myChartReal.EchartsDataAdd(parseInt(myServer.JSONData.PIDPitch), 3);
                this.myChartReal.EchartsDataAdd(parseInt(myServer.JSONData.PIDRoll), 4);
            }
            if (this.state.GryoAngleEnable) {
                this.myChartGryo.EchartsDataAdd(parseInt(myServer.JSONData.GRYOPitch), 1);
                this.myChartGryo.EchartsDataAdd(parseInt(myServer.JSONData.GRYORoll), 2);
                this.myChartGryo.EchartsDataAdd(parseInt(myServer.JSONData.GRYOYaw), 3);
            }
            if (this.state.AccelAngleEnable) {
                this.myChartAccel.EchartsDataAdd(parseInt(myServer.JSONData.AccelPitch), 1);
                this.myChartAccel.EchartsDataAdd(parseInt(myServer.JSONData.AccelRoll), 2);
            }
            if (this.state.RCEnable) {
                this.rcoption.series[0].data[0] = parseInt(myServer.JSONData.RCPitch);
                this.rcoption.series[0].data[1] = parseInt(myServer.JSONData.RCRoll);
                this.rcoption.series[0].data[2] = parseInt(myServer.JSONData.RCThrottle);
                this.rcoption.series[0].data[2] = (this.rcoption.series[0].data[2] - 1500)
                this.rcoption.series[0].data[3] = parseInt(myServer.JSONData.RCYaw);
                this.myChartRC.CustomOptionSet(this.rcoption);
            }
            if (this.state.AltEnable) {
                this.altoption.series[0].data[0] = parseInt(myServer.JSONData.MovementZ);
                this.altoption.series[0].data[1] = parseInt(myServer.JSONData.TargetAlttitude);
                this.myChartAlt.CustomOptionSet(this.altoption);
            }
            if (this.state.DEBUG1Enable) {
                this.myChartDEBUG1.EchartsDataAdd(parseInt(myServer.JSONData.RawADFY), 1);
                this.myChartDEBUG1.EchartsDataAdd(parseInt(myServer.JSONData.RawFAY), 2);
                this.myChartDEBUG1.EchartsDataAdd(parseInt(myServer.JSONData.RawADFZ) - 4096, 3);
                this.myChartDEBUG1.EchartsDataAdd(parseInt(myServer.JSONData.RawFAZ) - 4096, 4);
            }
            if (this.state.DEBUG2Enable) {
                this.myChartDEBUG2.EchartsDataAdd(parseInt(myServer.JSONData.AccelX), 1);
                this.myChartDEBUG2.EchartsDataAdd(parseInt(myServer.JSONData.AccelY), 2);
                this.myChartDEBUG2.EchartsDataAdd(parseInt(myServer.JSONData.AccelZ), 3);
            }
            if (this.state.DEBUG3Enable) {
                this.myChartDEBUG3.EchartsDataAdd(parseInt(myServer.JSONData.SpeedZ), 1);
                this.myChartDEBUG3.EchartsDataAdd(parseInt(myServer.JSONData.ClimbeRate), 2);
                this.myChartDEBUG3.EchartsDataAdd(parseInt(myServer.JSONData.SonarClimbeRate), 3);
                this.myChartDEBUG3.EchartsDataAdd(parseInt(myServer.JSONData.EKFClimbeRate), 4);
            }
            if (this.state.DEBUG4Enable) {
                this.myChartDEBUG4.EchartsDataAdd(parseInt(myServer.JSONData.MovementZ), 1);
                this.myChartDEBUG4.EchartsDataAdd(parseInt(myServer.JSONData.PressureAlttitude), 2);
                this.myChartDEBUG4.EchartsDataAdd(parseInt(myServer.JSONData.SonarAltitude), 3);
                this.myChartDEBUG4.EchartsDataAdd(parseInt(myServer.JSONData.EKFAltitude), 4);
            }
            if (this.state.DEBUG5Enable) {
                this.myChartDEBUG5.EchartsDataAdd(parseInt(myServer.JSONData.FlowOutX), 1);
                this.myChartDEBUG5.EchartsDataAdd(parseInt(myServer.JSONData.FlowOutY), 2);
                this.myChartDEBUG5.EchartsDataAdd(parseInt(myServer.JSONData.FlowOutXAsix), 3);
                this.myChartDEBUG5.EchartsDataAdd(parseInt(myServer.JSONData.FlowOutYAsix), 4);
            }
            if (this.state.DEBUG6Enable) {
                this.myChartDEBUG6.EchartsDataAdd(parseInt(myServer.JSONData.FlowSpeedX), 1);
                this.myChartDEBUG6.EchartsDataAdd(parseInt(myServer.JSONData.FlowSpeedY), 2);
                this.myChartDEBUG6.EchartsDataAdd(parseInt(myServer.JSONData.SpeedX), 3);
                this.myChartDEBUG6.EchartsDataAdd(parseInt(myServer.JSONData.SpeedY), 4);
            }
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
        }, 100)
    }
}

ReactDOM.render(<Body />, document.getElementById("app"));

