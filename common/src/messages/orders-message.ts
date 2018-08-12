import { CryptMessage, CryptMessageType } from './crypt-message';
import { CommonHelper } from '../common-helper';
import { OrderInfo } from '../trading/order/order-info';
import { NameValuePair } from '../utility/NameValuePair';

export class OrdersMessage extends CryptMessage {
    messageType: CryptMessageType = CryptMessageType.orders;

    data: NameValuePair[] = [];

    static copyAndVerify(source: OrdersMessage, target?: OrdersMessage): OrdersMessage {
        return CommonHelper.copyAndVerifyLowLevelTypes(source, target, OrdersMessage, (s, t) => {
            if (s.data != null) {
                t.data = s.data.map(o => NameValuePair.fromJson({
                    name: o.name,
                    value: o.value.map((v: OrderInfo) => OrderInfo.copyAndVerify(v))
                }));
            }
        });
    }
}
