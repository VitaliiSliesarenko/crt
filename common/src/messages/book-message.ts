import { CryptMessage, CryptMessageType, ICryptMessage } from './crypt-message';
import { CommonHelper } from "../common-helper";
import { BookData } from "../trading/book-data";

export class BookMessage extends CryptMessage {
    messageType: CryptMessageType = CryptMessageType.book;

    data: BookData[] = [];

    static copyAndVerify(source: BookMessage, target?: BookMessage): BookMessage {
        return CommonHelper.copyAndVerifyLowLevelTypes(source, target, BookMessage, (s, t) => {
            if (s.data != null) {
               t.data = s.data.map(d => BookData.copyAndVerify(d));
            }
        });
    }
}