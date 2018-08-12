import { CryptMessage, CryptMessageType, ICryptMessage } from './crypt-message';
import { CommonHelper } from "../common-helper";
import { Exchange } from "../trading/exchange";

export class ExchangeMessage extends CryptMessage {
    messageType: CryptMessageType = CryptMessageType.exchange;

    data: Exchange[] = [];

    static copyAndVerify(source: ExchangeMessage, target?: ExchangeMessage): ExchangeMessage {
        return CommonHelper.copyAndVerifyLowLevelTypes(source, target, ExchangeMessage, () => {});
    }
}