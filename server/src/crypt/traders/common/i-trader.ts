import { BookData } from "../../../../../common/src/trading/book-data";
import { Exchange } from "../../../../../common/src/trading/exchange";
import { Wallets } from "../../../../../common/src/trading/wallet/wallets";
import { OrderInfo } from '../../../../../common/src/trading/order/order-info';

export interface ITrader {

    // getTicker(traderPair: TraderPair): Q.Promise<Ticker>;
    start(): void;
    stop(): void;
    getTraderName(): string;
    getBookData: () => BookData;
    getExchange: () => Exchange;
    getWallets: () => Wallets;
    getOrders: () => OrderInfo[];
}
