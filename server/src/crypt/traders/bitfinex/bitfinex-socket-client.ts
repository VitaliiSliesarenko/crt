import { Logger } from '../../../../../common/src/logger';
import * as webSocket from 'websocket';
import { IMessage } from 'websocket';
import { connection } from 'websocket';
import { client } from 'websocket';
import { TraderInfo } from '../common/trader-info';

export class BitfinexSocketClient {
    private wsClient: client = null;
    private wsConnection: connection = null;
    private url = 'wss://api.bitfinex.com/ws/2';
    private reconnectInterval: number = 5;
    private reconnectTimer: NodeJS.Timer = null;

    private log: Logger = null;

    constructor(private traderInfo: TraderInfo, private onMessage: Function, private onConnected: Function) {
        this.log = new Logger(`${this.traderInfo.traderName}.socket`);
    }
    
    public connect() {
        this.disconnect();

        this.wsClient = new webSocket.client();
        this.wsClient.on('connect', (webSocketConnection) => {
            this.wsConnection = webSocketConnection;

            this.wsConnection.on('message', (message: IMessage) => {
                if (message.type === 'utf8') {
                    this.onMessage(message.utf8Data);
                }
            });

            this.wsConnection.on('error', (error: any) => {
                this.log.logNamed(`Connection error: ${JSON.stringify(error)}`);
                this.reconnect();
            });

            this.wsConnection.on('close', () => {
                this.log.logNamed(`Connection closed.`);
                this.reconnect();
            });

            this.log.logNamed(`is connected, url [${this.url}]`);

            this.onConnected();
        });

        this.wsClient.on('connectFailed', () => {
            this.wsConnection = null;
            this.log.logNamed(`failed to connect to url [${this.url}]`);
            this.reconnect();
        });

        this.wsClient.connect(this.url, null, null, null, null);
    }

    public disconnect() {
        if (this.reconnectTimer != null) {
            clearTimeout(this.reconnectInterval);
            this.reconnectTimer = null;
        }
        if (this.wsConnection != null) {
            this.wsConnection.close();
            this.wsConnection = null;
        }
        if (this.wsClient != null) {
            this.wsClient = null;
        }
    }

    public reconnect() {
        if (this.reconnectTimer != null) {
            return;
        }
        this.disconnect();
        this.log.logNamed(`Reconnecting in ${this.reconnectInterval} seconds.`);
        this.reconnectTimer = setTimeout(() => { this.connect(); }, this.reconnectInterval);
    }

    public sendMessage(message: string) {
        this.wsConnection.sendUTF(message);
    }
    
}