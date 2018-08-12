import { Component, OnInit } from '@angular/core';
import { CryptTableData } from '../../business/components/crypt-table/crypt-table-data';
import { CryptMessageType } from '../../../../../common/src/messages/crypt-message';
import { ExchangeMessage } from '../../../../../common/src/messages/exchange-message';
import { WebSocketService } from '../../business/web-socket.service';
import { DashboardService } from './dashboard.service';
import { WalletsMessage } from '../../../../../common/src/messages/wallets-message';
import { LogService } from '../../business/log.service';
import { BookMessage } from '../../../../../common/src/messages/book-message';
import { OrdersMessage } from '../../../../../common/src/messages/orders-message';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  exchangeData: CryptTableData = null;
  walletsData: CryptTableData = null;
  bookData: CryptTableData = null;
  ordersData: CryptTableData = null;

  constructor(private webSocketService: WebSocketService, private dashboardService: DashboardService,
              private logService: LogService) { }

  ngOnInit() {
    this.webSocketService.getMessage().subscribe(message => {
      try {
        switch (message.messageType) {
          case CryptMessageType.exchange:
            this.exchangeData = this.dashboardService.transformExchangeData(message as ExchangeMessage);
            break;
          case CryptMessageType.wallets:
            this.walletsData = this.dashboardService.transformWalletsData(message as WalletsMessage);
            break;
          case CryptMessageType.book:
            this.bookData = this.dashboardService.transformBookData(message as BookMessage);
            break;
          case CryptMessageType.orders:
            this.ordersData = this.dashboardService.transformOrdersData(message as OrdersMessage);
            break;
        }
      }catch (error) {
        this.logService.error(`DashboardComponent: message processing error ${JSON.stringify(error)}`);
      }
    });
  }
}
