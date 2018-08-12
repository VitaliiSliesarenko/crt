import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { HashObj } from '../../../../common/src/utility/HashObj';
import { KeyValuePair } from '../../../../common/src/utility/KeyValuePair';
import { Observer } from 'rxjs/Observer';

@Injectable()
export class TimeoutPoolService {

  private pool = new HashObj<KeyValuePair<number, Observer<any>>>();

  constructor() {
    setInterval(() => { this.checkTimeout(); }, 1000);
  }

  public register(id: string, observer: Observer<any>, timeout: number = 5): void {
    const expired = moment().valueOf() + timeout * 1000;
    this.pool.set(id, new KeyValuePair<number, Observer<any>>(expired, observer));
  }

  public confirm(id: string, value: any): boolean {
    if (this.pool.has(id)) {
      this.pool.get(id).value.next(value);
      this.pool.get(id).value.complete();
      this.pool.delete(id);
      return true;
    }
    return false; // expired
  }

  private checkTimeout(): void {
    const threshold = moment().valueOf();
    const expired = this.pool.keys().filter(key => this.pool.get(key).key < threshold);
    expired.forEach(key => {
      const item = this.pool.get(key);
      item.value.error(`Timeout error, id: ${key}, time: (${Math.ceil((threshold - item.key) / 1000)})`) ;
      item.value.complete();
      this.pool.delete(key);
    });
  }

}
