import { Bitfinex } from "./traders/bitfinex/bitfinex";
import { ITrader } from "./traders/common/i-trader";
import { BookMessage } from "../../../common/src/messages/book-message";
import { BroadcastServer } from "../server/broadcast-server";
import { Yobit } from "./traders/yobit/yobit";
import { ExchangeMessage } from "../../../common/src/messages/exchange-message";
import { WalletsMessage } from "../../../common/src/messages/wallets-message";
import { Trader } from './traders/common/trader';
import { OrdersMessage } from '../../../common/src/messages/orders-message';
import { NameValuePair } from '../../../common/src/utility/NameValuePair';


export class CryptEngine {

    private static traders: ITrader[] = [new Bitfinex(), new Yobit()];
    private static timeoutHandler: NodeJS.Timer = null;

    public static start() {

        CryptEngine.traders.forEach((t) => {
            t.start();
        });

        CryptEngine.dataLoop();
    }

    public static stop() {
        CryptEngine.traders.forEach((t) => {
            t.stop();
        });
        if (CryptEngine.timeoutHandler != null) {
            clearInterval(CryptEngine.timeoutHandler);
            CryptEngine.timeoutHandler = null;
        }
    }

    public static getTraderNames(): string[] {
        return CryptEngine.traders.map(t => t.getTraderName());
    }

    public static getTrader(name: string): Trader {
        return CryptEngine.traders.find(t => t.getTraderName() === name) as Trader;
    }

    private static dataLoop() {
        CryptEngine.timeoutHandler = setInterval(() => {
            const m = new BookMessage();
            CryptEngine.traders.forEach((t) => {
                m.data.push(t.getBookData());
            });
            BroadcastServer.broadcast(m);

            const e = new ExchangeMessage();
            CryptEngine.traders.forEach((t) => {
                e.data.push(t.getExchange());
            });
            BroadcastServer.broadcast(e);

            const w = new WalletsMessage();
            CryptEngine.traders.forEach((t) => {
                w.data.push(t.getWallets());
            });
            BroadcastServer.broadcast(w);
            const o = new OrdersMessage();
            CryptEngine.traders.forEach((t) => {
                o.data.push(NameValuePair.fromJson({name: t.getTraderName(), value: t.getOrders()}));
            });
            BroadcastServer.broadcast(o);
        }, 5000);
    }
}