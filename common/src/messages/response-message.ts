import { CryptMessage, CryptMessageType } from './crypt-message';
import { CommonHelper } from '../common-helper';

export enum ResponseCode {
    ok = 0,
    error = 1
}

export class ResponseMessage extends CryptMessage {
    messageType: CryptMessageType = CryptMessageType.responseMessage;

    code: ResponseCode = ResponseCode.ok;
    message: string = '';
    requestMessageId: string = null;

    static copyAndVerify(source: ResponseMessage, target?: ResponseMessage): ResponseMessage {
        return CommonHelper.copyAndVerifyLowLevelTypes(source, target, ResponseMessage, () => {});
    }

    static create(code: ResponseCode, message: string, requestMessageId: string): ResponseMessage {
        const rm = new ResponseMessage();
        rm.code = code;
        rm.message = message;
        rm.requestMessageId = requestMessageId;
        return rm;
    }
}
