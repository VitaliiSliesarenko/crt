import { TraderPair } from '../trader-pair';
import { OrderBidAsk } from './order-bid-ask';
import { OrderType } from './order-type';
import { CommonHelper } from '../../common-helper';

export class Order {
    trader: string = null;
    amount: number = null;
    price: number = null;
    bidAsk: OrderBidAsk = null;
    orderType: OrderType = null;
    currency: TraderPair = null;

    static copyAndVerify(source: Order, target?: Order): Order {
        return CommonHelper.copyAndVerifyLowLevelTypes(source, target, Order, () => {});
    }
}
