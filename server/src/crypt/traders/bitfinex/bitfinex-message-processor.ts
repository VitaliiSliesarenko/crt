import { BookRecord } from '../../../../../common/src/trading/book-record';
import { Wallet } from '../../../../../common/src/trading/wallet/wallet';
import { BookData } from '../../../../../common/src/trading/book-data';
import { Channels, ChannelType } from '../../../../../common/src/trading/channels';
import { Logger } from '../../../../../common/src/logger';
import { TraderInfo } from '../common/trader-info';
import { Wallets } from '../../../../../common/src/trading/wallet/wallets';
import { OrderInfo } from '../../../../../common/src/trading/order/order-info';
import { HashObj } from '../../../../../common/src/utility/HashObj';

export class BitfinexMessageProcessor {

    private protocolVersion: number = null;
    private isMaintenanceTime: boolean = false;
    private log: Logger = null;

    constructor (private traderInfo: TraderInfo, private onError: Function) {
        this.log = new Logger(`${this.traderInfo.traderName}.message.processor`);
        this.traderInfo.channels = new Channels();
        this.traderInfo.orders = new HashObj<OrderInfo>();
    }

    public process(rawMessage: string): void {

        // this.log.logNamed(rawMessage);
        const message = JSON.parse(rawMessage);
        if (message == null) {
            return;
        }
        if (message.event) {
            this.processEventMessage(message);
            return;
        }
        if (Array.isArray(message) && message.length > 0) {
            this.processUpdateMessage(message);
            return;
        }
        this.log.logNamed(`Unknown Message ${rawMessage}`);
    }

    private processUpdateMessage(message: any): void {

        const channel = this.traderInfo.channels.getById(message[0]);
        if (channel == null) {
            this.log.logNamed(`Wrong channel`);
            return;
        }

        if (message[1] === 'hb') {
            return;
        }

        if (channel.id === 0) {
            this.processUpdateAuthMessage(message);
        }

        switch (channel.type) {
            case ChannelType.book:
                this.processUpdateMessageBook(message[1], channel.data as BookData);
                break;
        }

    }

    private processUpdateMessageBook(messageData: number[][], channelData: BookData) {
        let data: number[][] = messageData;
        if (!Array.isArray(data[0])) {
            data = ([data] as any) as number[][];
        }

        data.forEach((u: number[]) => {
            const bookRecord = new BookRecord(u[0], u[1], u[2]);
            const side = bookRecord.amount > 0 ? channelData.bidHash : channelData.askHash;

            if (bookRecord.count === 0) {
                if (side[bookRecord.price] == null) {
                    Logger.log(`Unknown price ${bookRecord.price}`);
                }
                delete side[bookRecord.price];
                return;
            }

            bookRecord.amount = Math.abs(bookRecord.amount);
            side[bookRecord.price] = bookRecord;
        });
    }

    private processEventMessage(message: any): void {
        switch (message.event) {
            case 'info':
                this.processEventMessageInfo(message);
                break;
            case 'auth':
                this.processAuthMessage(message);
                break;
            case 'error':
                this.processErrorMessage(message);
                break;
            case 'pong':
                // todo process pong message
                break;
            case 'subscribed':
                this.processEventMessageSubscribed(message);

        }
    }

    private processEventMessageSubscribed(message: any) {
        const channel = this.traderInfo.channels.getByType(message.channel);
        if (channel == null) {
            Logger.log('Unexpected subscription');
            return;
        }
        if (channel.subscribed === true) {
            Logger.log('Already subscribed');
            return;
        }

        channel.id = message.chanId;
        channel.subscribed = true;
        channel.data = new BookData();
        channel.data.traderName = this.traderInfo.traderName;
        this.traderInfo.channels.setById(channel);
    }

    private processEventMessageInfo(message: any): void { // todo set proper message type
        if (message.version) {
            this.protocolVersion = message.version;
            return;
        }
        if (message.code) {
            switch (message.code) {
                case 20051:
                    this.processErrorMessage(message);
                    break;
                case 20060:
                    this.isMaintenanceTime = true;
                    this.log.logNamed(`enter maintenance mode.`);
                    break;
                case 20061:
                    this.isMaintenanceTime = false;
                    this.log.logNamed(`exit maintenance mode.`);
                    break;
                default:
                    this.log.logNamed(`Unknown info code: ${message.code}`);
            }
        }
    }

    private processAuthMessage(message: any): void {
        this.log.logNamed(`authentication status ${message.status}`);

        if (message.status !== 'OK') {
            return;
        }

        const channel = this.traderInfo.channels.getByType(ChannelType.empty);
        if (channel == null) {
            this.log.logNamed(`Unexpected authentication.`);
            return;
        }
        if (channel.subscribed === true) {
            this.log.logNamed(`Already authenticated.`);
            return;
        }

        channel.id = message.chanId;
        channel.subscribed = true;
        this.traderInfo.channels.setById(channel);

        // todo fill all auth data
    }

    private processUpdateAuthMessage(message: any): void {
        this.log.logNamed(`${JSON.stringify(message)}`);
        let data = message[2];
        if (!Array.isArray(data)) {
            this.log.logNamed(`Wrong auth update message ${JSON.stringify(message)}`);
            return;
        }

        if (!Array.isArray(data[0])) {
            data = [data];
        }
        switch (message[1]) {
            case 'ps':
                break;
            case 'ws':
            case 'wu':
                this.processUpdateAuthWalletMessage(data);
                break;
            case 'os':
            case 'on':
            case 'ou':
            case 'oc':
                this.processUpdateAuthOrdersMessage(data);
                break;
            case 'fos':
                break;
            case 'fcs':
                break;
            case 'fls':
                break;
            case 'ats':
                break;
            case 'n':
                break;
            default:
                this.log.logNamed(`Wrong auth code ${message[1]}`);
        }
    }

    private processUpdateAuthWalletMessage(data: any[][]): void {
        data.forEach(d => {
            if (!Array.isArray(d) || d.length === 0) {
                return;
            }
            const wallet = new Wallet();
            wallet.walletType = d[0];
            wallet.currency = d[1];
            wallet.balance = d[2];
            wallet.balanceAvailable = d[4];
            this.traderInfo.wallets.setWallet(wallet.currency, wallet);
        });
    }

    private processUpdateAuthOrdersMessage(data: any[][]): void {
        data.forEach(d => {
            if (!Array.isArray(d) || d.length === 0) {
                return;
            }
            const orderInfo = OrderInfo.fromJson(d);
            this.traderInfo.orders.set(orderInfo.id, orderInfo);
        });
    }

    private processErrorMessage(message: any): void {
        if (this.onError) {
            this.onError(`got error code: ${message.code}; message: ${message.msg}`);
        }
    }
}