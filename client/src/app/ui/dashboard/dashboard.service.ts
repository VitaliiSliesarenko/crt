import { Injectable } from '@angular/core';
import { ExchangeMessage } from '../../../../../common/src/messages/exchange-message';
import { CryptTableData } from '../../business/components/crypt-table/crypt-table-data';
import { WalletsMessage } from '../../../../../common/src/messages/wallets-message';
import { BookData } from '../../../../../common/src/trading/book-data';
import { BookMessage } from '../../../../../common/src/messages/book-message';
import { OrdersMessage } from '../../../../../common/src/messages/orders-message';
import { OrderInfo } from '../../../../../common/src/trading/order/order-info';

@Injectable()
export class DashboardService {

  constructor() { }

  public transformExchangeData(message: ExchangeMessage): CryptTableData {
    const exchangeData = new CryptTableData(); // (message as ExchangeMessage).data;
    exchangeData.columns = ['Трейдер', 'Покупка', 'Продажа'];
    exchangeData.rows = (message as ExchangeMessage).data.map(e => [e.traderName, e.bid.toString(), e.ask.toString()]);
    return exchangeData;
  }

  public transformWalletsData(message: WalletsMessage): CryptTableData {
    const walletData = new CryptTableData();
    walletData.columns = ['Трейдер', 'Валюта', 'Баланс', 'Тип'];
    walletData.rows = [];
    (message as WalletsMessage).data.forEach(wallets => {
      wallets.getWallets().forEach(wallet => {
        walletData.rows.push([wallets.traderName, wallet.currency, wallet.balance.toString(), wallet.walletType.toString()]);
      });
    });
    return walletData;
  }

  public transformBookData(message: BookMessage): CryptTableData {

    const bookData = new CryptTableData();
    bookData.columns = ['Трейдер', 'Кол-во', 'Сумма', 'Цена', 'Цена', 'Сумма', 'Кол-во', 'Трейдер'];
    bookData.rows = [];

    const allAskKeys = message.data.reduce((keys, bData) => keys.concat(Object.keys(bData.askHash)), []);
    const allBidKeys = message.data.reduce((keys, bData) => keys.concat(Object.keys(bData.bidHash)), []);

    /*const askKeys = allAskKeys.sort((a, b) => +a <= +b ? -1 : 1);
    const bidKeys = allBidKeys.sort((a, b) => +a >= +b ? -1 : 1);
    */
    const allKeys = allAskKeys.concat(allBidKeys).sort((a, b) => +a >= +b ? -1 : 1);

    for (let i = 0; i < allKeys.length; i++) {
      for (let t = 0; t < message.data.length; t++) {
        if (message.data[t].askHash[allKeys[i]] == null && message.data[t].bidHash[allKeys[i]] == null) {
          continue;
        }
        const ask = message.data[t].askHash[allKeys[i]] || {price: 0, count: 0, amount: 0};
        const bid = message.data[t].bidHash[allKeys[i]] || {price: 0, count: 0, amount: 0};
        bookData.rows.push([
          message.data[t].traderName,
          bid.count,
          bid.amount,
          bid.price,
          ask.price,
          ask.amount,
          ask.count,
          message.data[t].traderName
        ]);
      }
    }
    return bookData;
  }

  public transformOrdersData(message: OrdersMessage): CryptTableData {
    const ordersData = new CryptTableData();
    ordersData.columns = ['Трейдер', 'Сумма', 'Тип'];
    ordersData.rows = [];
    (message as OrdersMessage).data.forEach(nv => {
      nv.value.forEach((o: OrderInfo) => {
        ordersData.rows.push([nv.name, o.amount.toString(), o.type]);
      });
    });
    return ordersData;
  }
}
