import { CryptMessage, CryptMessageType, ICryptMessage } from './crypt-message';
import { CommonHelper } from "../common-helper";
import { Wallets } from "../trading/wallet/wallets";

export class WalletsMessage extends CryptMessage {
    messageType: CryptMessageType = CryptMessageType.wallets;

    data: Wallets[] = [];

    static copyAndVerify(source: WalletsMessage, target?: WalletsMessage): WalletsMessage {
        return CommonHelper.copyAndVerifyLowLevelTypes(source, target, WalletsMessage, (s, t) => {
            if (s.data != null) {
               t.data = s.data.map(d => Wallets.copyAndVerify(d));
            }
        });
    }
}