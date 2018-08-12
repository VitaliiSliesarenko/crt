import { Component, OnInit } from '@angular/core';
import { Order } from '../../../../../../common/src/trading/order/order';
import { NewOrderFormService } from './new-order-form.service';
import { NameValuePair } from '../../../../../../common/src/utility/NameValuePair';
import { OrderType } from '../../../../../../common/src/trading/order/order-type';
import { NgForm } from '@angular/forms';
import { ResponseMessage } from '../../../../../../common/src/messages/response-message';
import { LogService } from '../../../business/log.service';
import { TraderNames } from '../../../../../../common/src/trading/trader-names';
import { CurrencyPair } from '../../../../../../common/src/trading/currency/currency-pair';
import { OrderBidAsk } from '../../../../../../common/src/trading/order/order-bid-ask';

@Component({
  selector: 'app-new-order-form',
  templateUrl: './new-order-form.component.html',
  styleUrls: ['./new-order-form.component.css']
})
export class NewOrderFormComponent implements OnInit {

  model = new Order();
  submitted = false;
  orderTypes: OrderType[] = [];
  currencies: NameValuePair[] = [];
  bidasks: NameValuePair[] = [];
  sending = false;

  constructor(private newOrderFormService: NewOrderFormService, private logService: LogService) {
    this.currencies = this.newOrderFormService.getCurrencies();
    this.bidasks = this.newOrderFormService.getBidask();
    this.orderTypes = this.newOrderFormService.getOrderTypes();

    this.model.trader = TraderNames.Bitfinex;
    this.model.currency = CurrencyPair.BTCUSD;
    this.model.orderType = OrderType.LIMIT;
    this.model.bidAsk = OrderBidAsk.bid;
  }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    this.submitted = true;
    if (!form.valid) {
      return;
    }
    this.sending = true;
    this.newOrderFormService.sendOrder(this.model).subscribe({
      next: (response: ResponseMessage) => { this.logService.log(`Got response ${JSON.stringify(response)}`); },
      error: (error) => { this.logService.error(`Got error: ${JSON.stringify(error)}`);  this.sending = false; },
      complete: () => { this.sending = false; }
    });
  }


  get traders(): string[] {
    return this.newOrderFormService.getTraders();
  }
}
