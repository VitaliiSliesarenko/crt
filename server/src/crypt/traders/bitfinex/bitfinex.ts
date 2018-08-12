import { Trader } from '../common/trader';
import { BitfinexSocketClient } from './bitfinex-socket-client';
import { BitfinexMessageProcessor } from './bitfinex-message-processor';
import { Channel } from '../../../../../common/src/trading/channel';
import * as CryptoJS from 'crypto-js';
import { ChannelType } from '../../../../../common/src/trading/channels';
import { Logger } from '../../../../../common/src/logger';
import { OrderBidAsk } from '../../../../../common/src/trading/order/order-bid-ask';
import { Order } from '../../../../../common/src/trading/order/order';
import { TraderNames } from '../../../../../common/src/trading/trader-names';
import * as Q from 'q';

export class Bitfinex extends Trader {

    private socketClient: BitfinexSocketClient = null;
    private messageProcessor: BitfinexMessageProcessor = null;
    private apiKey = 'PUVGJpbkMEH4RL4gE804vPDy9c1YkGXzdDIXS9hFVzB';
    private apiSecret = 'v0s8utsJq0uZZZJ6dyMXq7pIONefk3JFScJEiEmSDd8';
    private log: Logger = null;

    constructor() {
        super();
        this.traderInfo.traderName = TraderNames.Bitfinex;
        this.log = new Logger(this.traderInfo.traderName);
    }

    public start() {
        this.stop();

        this.socketClient = new BitfinexSocketClient(this.traderInfo,
            (message: any) => { this.messageProcessor.process(message); },
            () => { this.subscribe(); }
        );

        this.socketClient.connect();
    }

    public stop(): void {
        if (this.socketClient != null) {
            this.socketClient.disconnect();
            this.socketClient = null;
        }
    }

    public setOrder(order: Order): Q.Promise<string> {
        const cid = Date.now();
        this.socketClient.sendMessage(JSON.stringify([
            0,
            "on",
            null,
            {
                "gid": 1,
                "cid": cid,
                "type": order.orderType,
                "symbol": order.currency.Bitfinex,
                "amount": order.amount * (order.bidAsk === OrderBidAsk.bid ? 1 : -1),
                "price": order.price,
                "hidden": 0
            }
        ]));

        return Q.when(cid.toString());
    }

    private subscribe(): void {
        this.log.logNamed('Subscribing...');
        this.messageProcessor = new BitfinexMessageProcessor(this.traderInfo, (error: string) => {
            this.log.errorNamed(error);
            this.socketClient.reconnect();
        });
        this.sendAuth();
        this.subscribeToBook();
    }

    private sendAuth(): void {
        this.traderInfo.channels.setByType(new Channel(ChannelType.empty));

        const authNonce = Date.now() * 1000;
        const authPayload = 'AUTH' + authNonce;
        const authSig = CryptoJS.HmacSHA384(authPayload, this.apiSecret).toString(CryptoJS.enc.Hex);

        const payload = {
            apiKey: this.apiKey,
            authSig,
            authNonce,
            authPayload,
            event: 'auth'
        };

        this.socketClient.sendMessage(JSON.stringify(payload));
    }

    private subscribeToBook(): void {
        this.log.logNamed(`subscribing to chanel 'book'`);
        this.traderInfo.channels.setByType(new Channel(ChannelType.book));
        this.socketClient.sendMessage(JSON.stringify({
            "event": "subscribe",
            "channel": ChannelType.book,
            "pair": "BTCUSD"
        }));
    }
}
