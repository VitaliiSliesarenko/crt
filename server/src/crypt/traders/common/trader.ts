import { Channels, ChannelType } from "../../../../../common/src/trading/channels";
import { BookRecord } from "../../../../../common/src/trading/book-record";
import { BookData } from "../../../../../common/src/trading/book-data";
import { Exchange } from "../../../../../common/src/trading/exchange";
import { ITrader } from "./i-trader";
import { Wallets } from "../../../../../common/src/trading/wallet/wallets";
import { TraderInfo } from './trader-info';
import { Order } from '../../../../../common/src/trading/order/order';
import { OrderInfo } from '../../../../../common/src/trading/order/order-info';
import * as Q from 'q';

export class Trader implements ITrader {
    protected traderInfo: TraderInfo = new TraderInfo();

    public start(): void { }

    public stop(): void { }

    public getTraderName(): string {
        return this.traderInfo.traderName;
    }

    public getBookData(): BookData {
        if (this.traderInfo.channels != null && this.traderInfo.channels.getByType(ChannelType.book) != null) {
            return this.traderInfo.channels.getByType(ChannelType.book).data as BookData;
        }
        return new BookData();
    }

    public getExchange(): Exchange {
        const bookData = this.getBookData();
        const emptyExchange = {bid: 0, ask: 0, traderName: ''};
        if (bookData == null) {
            return emptyExchange;
        }
        const sortedAsks = Object.keys(bookData.askHash).sort((a, b) => +a <= +b ? -1 : 1);
        const sortedBids = Object.keys(bookData.bidHash).sort((a, b) => +a >= +b ? -1 : 1);
        if (sortedAsks.length === 0 || sortedBids.length === 0) {
            return emptyExchange;
        }
        return {
            bid: (bookData.bidHash[sortedBids[0]] as BookRecord).price,
            ask: (bookData.askHash[sortedAsks[0]] as BookRecord).price,
            traderName: this.traderInfo.traderName
        };
    }

    public getWallets(): Wallets {
        return this.traderInfo.wallets;
    }

    public getOrders(): OrderInfo[] {
        return this.traderInfo.orders.values();
    }

    public setOrder(order: Order): Q.Promise<string> {
        throw new Error('Not implemented');
    }
}