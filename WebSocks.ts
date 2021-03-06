export class NetServerMain {
    JSONData: any = { "null": "null" };
    private serverMain: WebSocket;
    private SendClock: NodeJS.Timeout;
    RemotePortList: Array<number> = new Array<number>();
    RemoteAddressList: Array<string> = new Array<string>();
    deviceRTDataBuffer: Array<Array<string>> = new Array<Array<string>>();

    public getUseableID(): number[] {
        let indexid = 0;
        let useableID: Array<number> = new Array<number>();
        for (let index = 0; index < 255; index++) {
            if (this.RemoteAddressList[index] != null) {
                useableID[indexid] = Number(this.IPDeviceIDParese(this.RemoteAddressList[index]));
                indexid++;
            }
        }
        return useableID;
    }

    constructor(localport: number, localaddress: string) {
        let stringbuffer: Array<string> = new Array<string>();
        for (let index = 0; index < 10; index++) {
            stringbuffer[index] = "0";
        }
        for (let index = 0; index < 10; index++) {
            this.deviceRTDataBuffer[index] = stringbuffer;
        }

        this.serverMain = new WebSocket('ws://' + localaddress + ':' + localport);
        this.serverMain.onopen = (event) => {
            this.SendClock = setInterval(() => {
                this.serverMain.send("4350");
            }, 50);
        };
        this.serverMain.onmessage = (event) => {
            this.PreDataExend(<string><unknown>event.data, this.serverMain);
        }
        this.serverMain.onclose = (event) => {
            console.log("has disconnect");
            this.SendClock.unref();
        }
    }

    private PreDataExend(DataExe: string, socket: WebSocket) {
        if (DataExe.slice(0, 4) == "4000") {
            socket.send("4010");
        };
        if (DataExe.slice(0, 4) == "4110") {
            socket.send("4110");
        };
        if (DataExe.slice(0, 4) == "4200") {
            let TmpBuffer: string[] = this.SearchAllMatch_str(DataExe.toString());
            // console.log(TmpBuffer);
            this.JSONData = JSON.parse(TmpBuffer[2]);
        }
    }

    private IPDeviceIDParese(ip: string): number {
        let index = 0;
        let count = 0;
        let dataBuff: Array<string> = new Array<string>();
        while (ip.indexOf(".", index + 1) != -1) {
            dataBuff[count] = ip.slice(index, ip.indexOf(".", index + 1));
            dataBuff[count] = dataBuff[count].slice(1);
            index = ip.indexOf(".", index + 1);
            count++;
        }
        dataBuff[3] = ip.slice(index + 1);
        return Number(dataBuff[3]);
    }

    private SearchAllMatch_str(data: string): string[] {
        let index = 0;
        let count = 0;
        let dataBuff: Array<string> = new Array<string>();
        while (data.indexOf("/", index + 1) != -1) {
            dataBuff[count] = data.slice(index, data.indexOf("/", index + 1));
            dataBuff[count] = dataBuff[count].slice(1);
            index = data.indexOf("/", index + 1);
            count++;
        }
        return dataBuff;
    }
}