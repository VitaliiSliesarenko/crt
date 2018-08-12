import * as uuid from 'uuid';


export enum CryptMessageType {
    book = <any>'book',
    exchange = <any>'exchange',
    wallets = <any>'wallets',
    serverInfo = <any>'serverInfo',
    newOrder = <any>'newOrder',
    orders = <any>'orders',
    responseMessage = <any>'responseMessage'
}

export interface ICryptMessage {
    id: string;
    messageType: CryptMessageType;
}

export class CryptMessage implements ICryptMessage {
    id: string;
    messageType: CryptMessageType;
    constructor() {
        this.id = uuid.v4();
    }
}
