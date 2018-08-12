import { Channels, ChannelType } from "../../../../../common/src/trading/channels";
import * as https from "https";
import { Logger } from "../../../../../common/src/logger";
import * as Q from "q";
import * as http from "http";
import { Channel } from "../../../../../common/src/trading/channel";
import { Trader } from '../common/trader';
import { Wallets } from "../../../../../common/src/trading/wallet/wallets";
import { OrderInfo } from '../../../../../common/src/trading/order/order-info';
import { HashObj } from '../../../../../common/src/utility/HashObj';
import { TraderNames } from '../../../../../common/src/trading/trader-names';
import { YobitIO } from './yobit-io';
import { Order } from '../../../../../common/src/trading/order/order';

export class Yobit extends Trader {

    private timerHandle: NodeJS.Timer = null;

    private yobitIo: YobitIO = null;

    constructor() {
        super();
        this.traderInfo.traderName = TraderNames.Yobit;
        this.yobitIo = new YobitIO(this.traderInfo);
        this.reset();
    }

    start(): void {
        this.stop();
        this.reset();

        this.traderInfo.channels.setByType(new Channel(ChannelType.book));
        Logger.log(`Trader [${this.traderInfo.traderName}] subscribing to chanel 'book'`);
        this.yobitIo.subscribeToBook();
        this.yobitIo.subscribeToActiveOrders();
        // this.yobitIo.getAccountsInfo();
    }

    stop(): void {
        this.yobitIo.stop();
        if (this.timerHandle != null) {
            clearTimeout(this.timerHandle );
            this.timerHandle  = null;
        }
    }

    private reset(): void {
        this.traderInfo.channels = new Channels();
        this.traderInfo.wallets = Wallets.create(this.traderInfo.traderName);
        this.traderInfo.orders = new HashObj<OrderInfo>();
    }

    public setOrder(order: Order): Q.Promise<string> {
        return this.yobitIo.setOrder(order);
    }





}