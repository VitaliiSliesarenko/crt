import { CryptMessage, CryptMessageType } from './crypt-message';
import { CommonHelper } from '../common-helper';
import { Order } from '../trading/order/order';

export class NewOrderMessage extends CryptMessage {
    messageType: CryptMessageType = CryptMessageType.newOrder;

    data: Order = null;

    static copyAndVerify(source: NewOrderMessage, target?: NewOrderMessage): NewOrderMessage {
        return CommonHelper.copyAndVerifyLowLevelTypes(source, target, NewOrderMessage, (s, t) => {
            if (s.data != null) {
                t.data = Order.copyAndVerify(s.data);
            }
        });
    }
}
