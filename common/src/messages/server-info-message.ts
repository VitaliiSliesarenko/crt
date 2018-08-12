import { CryptMessage, CryptMessageType, ICryptMessage } from './crypt-message';
import { CommonHelper } from '../common-helper';

export class ServerInfoMessage extends CryptMessage {
    messageType: CryptMessageType = CryptMessageType.serverInfo;

    traders: string[] = [];

    static copyAndVerify(source: ServerInfoMessage, target?: ServerInfoMessage): ServerInfoMessage {
        return CommonHelper.copyAndVerifyLowLevelTypes(source, target, ServerInfoMessage, () => {});
    }
}