import { Injectable } from '@angular/core';
import { LogService } from '../../../business/log.service';
import { WebSocketService } from '../../../business/web-socket.service';
import { CryptMessageType } from '../../../../../../common/src/messages/crypt-message';
import { ServerInfoMessage } from '../../../../../../common/src/messages/server-info-message';
import { CurrencyPair } from '../../../../../../common/src/trading/currency/currency-pair';
import { OrderBidAsk } from '../../../../../../common/src/trading/order/order-bid-ask';
import { NameValuePair } from '../../../../../../common/src/utility/NameValuePair';
import { OrderType } from '../../../../../../common/src/trading/order/order-type';
import { Order } from '../../../../../../common/src/trading/order/order';
import { NewOrderMessage } from '../../../../../../common/src/messages/new-order-message';
import { ResponseMessage } from '../../../../../../common/src/messages/response-message';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { TimeoutPoolService } from '../../../business/timeout-pool.service';

@Injectable()
export class NewOrderFormService {

  private serverInfoMessage: ServerInfoMessage = new ServerInfoMessage();

  constructor(private webSocketService: WebSocketService, private logService: LogService,
              private timeoutPoolService: TimeoutPoolService) {

    this.webSocketService.getMessage().subscribe(message => {
      try {
        switch (message.messageType) {
          case CryptMessageType.serverInfo:
            this.serverInfoMessage = message as ServerInfoMessage;
            break;
          case CryptMessageType.responseMessage:
            this.processResponseMessage(message as ResponseMessage);
            break;
        }
      }catch (error) {
        this.logService.error(`DashboardComponent: message processing error ${JSON.stringify(error)}`);
      }
    });
  }

  getTraders(): string[] {
    return this.serverInfoMessage.traders;
  }

  getCurrencies(): NameValuePair[] {
    return [
      NameValuePair.fromJson({name: 'BTCUSD', value: CurrencyPair.BTCUSD})
    ];
  }

  getBidask(): NameValuePair[] {
    return [
      NameValuePair.fromJson({name: 'Покупка (Bid)', value: OrderBidAsk.bid}),
      NameValuePair.fromJson({name: 'Продажа (Ask)', value: OrderBidAsk.ask})
    ];
  }

  getOrderTypes(): OrderType[] {
    return [
      OrderType.LIMIT,
      OrderType.MARKET,
      OrderType.STOP
    ];
  }


  sendOrder(order: Order): Observable<ResponseMessage> {
    const orderMessage = new NewOrderMessage();
    orderMessage.data = order;
    const observable = Observable.create((observer: Observer<ResponseMessage>) => {
      this.webSocketService.sendMessage(JSON.stringify(orderMessage));
      this.timeoutPoolService.register(orderMessage.id, observer);
    });

    return observable;
  }

  processResponseMessage(message: ResponseMessage): void {
    this.timeoutPoolService.confirm(message.requestMessageId, message);
  }

}

