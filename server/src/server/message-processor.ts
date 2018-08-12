import { CryptMessage, CryptMessageType } from '../../../common/src/messages/crypt-message';
import { NewOrderMessage } from '../../../common/src/messages/new-order-message';
import { ResponseCode, ResponseMessage } from '../../../common/src/messages/response-message';
import { CryptEngine } from '../crypt/crypt-engine';
import * as Q from "q";

export class MessageProcessor {
    public static process(message: string): Q.Promise<ResponseMessage> {
        const rawMessage = JSON.parse(message) as CryptMessage;
        switch (rawMessage.messageType) {
            case CryptMessageType.newOrder:
                return MessageProcessor.processNewOrderMessage(NewOrderMessage.copyAndVerify(rawMessage as any));
            default:
                return Q.when(ResponseMessage.create(ResponseCode.error, 'Unknown Message Type: ' + rawMessage.messageType, rawMessage.id));
        }
    }

    private static processNewOrderMessage(message: NewOrderMessage): Q.Promise<ResponseMessage> {
        switch (message.data.trader) {
            case "Bitfinex":
            case "Yobit":
                return CryptEngine.getTrader(message.data.trader).setOrder(message.data).then(id => {
                    return ResponseMessage.create(ResponseCode.ok, id, message.id);
                }).catch((error) => {
                    return ResponseMessage.create(ResponseCode.error, error, message.id);
                });
            default:
                return Q.when(ResponseMessage.create(ResponseCode.error, 'Unknown trader: ' + message.data.trader , message.id));
        }
    }
}
