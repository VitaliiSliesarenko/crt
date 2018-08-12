import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CryptMessageType, ICryptMessage } from '../../../../common/src/messages/crypt-message';
import { LogService } from './log.service';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
import { BookMessage } from '../../../../common/src/messages/book-message';
import { Subject } from 'rxjs/Subject';
import { ExchangeMessage } from '../../../../common/src/messages/exchange-message';
import { WalletsMessage } from '../../../../common/src/messages/wallets-message';
import { ServerInfoMessage } from '../../../../common/src/messages/server-info-message';
import { ResponseMessage } from '../../../../common/src/messages/response-message';
import { OrdersMessage } from '../../../../common/src/messages/orders-message';

@Injectable()
export class WebSocketService {

  private wsObservable: Observable<ICryptMessage> = null;
  private wsSubscription: Subscription = null;
  private url = 'ws://localhost:8080/';
  private outSubject: Subject<ICryptMessage> = null;
  private webSocket: WebSocket = null;

  constructor(private logService: LogService) {
    this.initExternalObservable();
    this.initWebSocket(this.url);
  }

  getMessage(): Observable<ICryptMessage> {
    return this.outSubject;
  }

  sendMessage(message: string): void {
    this.webSocket.send(message);
  }

  private initExternalObservable() {
    this.outSubject = new Subject<ICryptMessage>();
  }

  private initWebSocket(url): void {
    this.wsObservable = Observable.create((observer: Observer<ICryptMessage>) => {
      this.webSocket = new WebSocket(url, 'crypt-protocol');

      this.webSocket.onopen = (e) => { this.socketOnOpen(e); };
      this.webSocket.onclose = (e) => { this.socketOnClose(e, observer); };
      this.webSocket.onerror = (e) => { this.socketOnError(e, observer); };
      this.webSocket.onmessage = (e) => { this.socketOnMessage(e, observer); };

      return () => {
        this.webSocket.close();
      };
    });
    this.connect();
  }

  private socketOnOpen(e: Event): void {
    this.logService.log(`Web Socket: ${e.timeStamp}`);
  }

  private socketOnClose(e: CloseEvent, observer: Observer<ICryptMessage>): void {
    this.logService.log(`Web Socket: ${e.timeStamp}`);
    if (e.wasClean) {
      observer.complete();
    } else {
      observer.error(e);
    }
    this.logService.error(`Web Socket: closed`);
  }

  private socketOnError(e: Event, observer: Observer<ICryptMessage>): void {
    this.logService.error(`Web Socket: ${JSON.stringify(e)}`);
    observer.error(e);
  }

  private socketOnMessage(e: MessageEvent, observer: Observer<ICryptMessage>): void {
      observer.next(JSON.parse(e.data));
  }

  private processMessage(message: ICryptMessage): void {
    let instance: ICryptMessage = null;
    switch (message.messageType) {
      case CryptMessageType.book:
        instance = BookMessage.copyAndVerify(message as any);
        break;
      case CryptMessageType.exchange:
        instance = ExchangeMessage.copyAndVerify(message as any);
        break;
      case CryptMessageType.wallets:
        instance = WalletsMessage.copyAndVerify(message as any);
        break;
      case CryptMessageType.serverInfo:
        instance = ServerInfoMessage.copyAndVerify(message as any);
        break;
      case CryptMessageType.responseMessage:
        instance = ResponseMessage.copyAndVerify(message as any);
        break;
      case CryptMessageType.orders:
        instance = OrdersMessage.copyAndVerify(message as any);
        break;
      default:
        this.logService.log(`Unknown message type: ${message.messageType}`);
        return;
    }
    this.outSubject.next(instance);
  }

  private connect(): void {
    if (this.wsSubscription) {
      this.wsSubscription.unsubscribe();
    }
    this.wsSubscription = this.wsObservable.subscribe({
      next: (message: ICryptMessage) => { this.processMessage(message); },
      error: () => { setTimeout(() => { this.connect(); }, 0); },
      complete: () => { setTimeout(() => { this.connect(); }, 0); }
    });
  }

}
