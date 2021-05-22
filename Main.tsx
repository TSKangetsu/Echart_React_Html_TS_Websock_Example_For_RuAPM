import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { EchartShowSys } from './EchartsShow';
import { NetServerMain } from './WebSocks';
import { ResizeObserver } from 'resize-observer'
import 'bootstrap/dist/js/bootstrap.js'
import 'bootstrap/dist/css/bootstrap.css';

let TargetServer: NetServerMain;
let ChartConfig: string | ArrayBuffer;
let ChartConfigAsJson: any;

class SoftController extends React.Component {
    TargetIP: string = "192.168.137.254";
    TargetPort: number = 27015;
    Speed: number = 20;
    constructor(props) {
        super(props);
        this.ConfigRead = this.ConfigRead.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.ServerConnectSet = this.ServerConnectSet.bind(this);
    };

    public render(): JSX.Element {
        return (
            <>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <div className="container-fluid">
                        <a className="navbar-brand" href="#">WebSockChart</a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <div className="navbar-nav me-auto mb-2 mb-lg-0">
                                <input type="text" className="form-control me-2 my-1" name="ipaddr" placeholder="IPAddress" onChange={this.handleChange}></input>
                                <input type="text" className="form-control me-2 my-1" name="ipport" placeholder="Port" onChange={this.handleChange}></input>
                                <input type="text" className="form-control me-2 my-1" name="speed" placeholder="FreshRateMS" onChange={this.handleChange}></input>
                                <button className="btn btn-outline-success mx-2 my-1" onClick={this.ServerConnectSet}>connect!</button>
                            </div>
                            <div className="d-flex mb-lg-0">
                                <input id="fileUP" type="file" name="ConfigFile" onChange={this.ConfigRead} style={{ display: 'none' }}></input>
                                <label className="btn btn-outline-success form-control mx-2 my-1" htmlFor="fileUP">SelectConfig</label>
                            </div>
                        </div>
                    </div>
                </nav>
                <div id="ChartArea" className="mt-sm-1 mt-md-3 px-1 mx-0 row"></div>
            </>
        )
    }

    protected ConfigRead(event: React.ChangeEvent<HTMLInputElement>) {
        event.preventDefault()
        var FileReaderSet = new FileReader();
        FileReaderSet.onload = async (event) => {
            ChartConfig = (event.target.result);
            console.log("ConfigReadComfirm");
            console.log(ChartConfig.toString());
            ChartConfigAsJson = JSON.parse(ChartConfig.toString());
            ReactDOM.unmountComponentAtNode(document.getElementById("ChartArea"));
            ReactDOM.render(<ChartCreator UpdateTime={this.Speed} />, document.getElementById("ChartArea"));
        }
        FileReaderSet.readAsText(event.target.files[0])
    }

    protected ServerConnectSet() {
        TargetServer = new NetServerMain(this.TargetPort, this.TargetIP, this.Speed);
        console.log("Connect2->" + this.TargetIP + ":" + this.TargetPort);
    }

    handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.name == "ipaddr")
            this.TargetIP = e.target.value;
        else if (e.target.name == "ipport")
            this.TargetPort = Number(e.target.value);
        else if (e.target.name == "speed")
            this.Speed = Number(e.target.value);
    };
}

interface CCprops { UpdateTime: number }
class ChartCreator extends React.Component<CCprops> {
    private ChartAreaMain: Array<JSX.Element> = [];
    private Charts: Array<EchartShowSys> = [];
    private ChartResizeMon: Array<ResizeObserver> = [];
    private DataUpdator: NodeJS.Timeout;
    constructor(props) {
        super(props);
    }

    public render(): JSX.Element {
        ChartConfigAsJson.configuration.forEach(element => {
            if (element.enable) {
                this.ChartAreaMain.push((
                    <>
                        <div className="px-0 col-sm-12 col-md-6">
                            <h6>{element.Name}</h6>
                            <div className="px-0" id={element.Name} key={element.Name}
                                style={{ height: element.height }}></div>
                        </div>
                    </>
                ))
            }
        });
        return (
            <>
                {this.ChartAreaMain}
            </>
        )
    }

    componentDidMount() {
        ChartConfigAsJson.configuration.forEach(element => {
            if (element.enable) {
                var Charts: EchartShowSys;
                Charts = new EchartShowSys(document.getElementById(element.Name), element.Name,
                    {
                        ymax: element.IsDynamicY ? (value) => { return value.max + element.YMax } : element.YMax,
                        ymin: element.IsDynamicY ? (value) => { return value.min + element.YMin } : element.YMin
                    });
                Object.keys(element.Index).forEach(key => {
                    Charts.EhcartSeriesAdd({
                        name: key,
                        hoverAnimation: false,
                        type: element.Index[key].type,
                        showSymbol: element.Index[key].showSymbol,
                        data: new Array(element.Index[key].dataSize),
                        lineStyle: { color: element.Index[key].color }
                    });
                });
                let ChartResizeMon = new ResizeObserver(entries => {
                    Charts.EchartAreaUpdate();
                })
                ChartResizeMon.observe(document.getElementById("ChartArea"));
                this.Charts.push(Charts);
                this.ChartResizeMon.push(ChartResizeMon);
            }
        });

        this.DataUpdator = setInterval(() => {
            this.Charts.forEach(element => {
                ChartConfigAsJson.configuration.forEach(key => {
                    if (key.enable) {
                        if (element.GetCurrentEchartsName() == key.Name) {
                            let i = 1;
                            Object.keys(key.Index).forEach(index => {
                                element.EchartsDataAdd(Number(TargetServer.JSONData[index]), i);
                                i = i + 1;
                            });
                        }
                    }
                });
            });
        }, this.props.UpdateTime);
    }

    componentWillUnmount() {
        clearInterval(this.DataUpdator);

        this.ChartResizeMon.forEach(element => {
            element.unobserve(document.getElementById("ChartArea"));
        });
    }
}

ReactDOM.render(<SoftController />, document.getElementById("app"));