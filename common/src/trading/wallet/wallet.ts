
export enum WalletType {
    exchang = <any>'exchang',
    margin = <any>'margin',
    funding = <any>'funding'
}

export class Wallet {
    walletType: WalletType;
    currency: string;
    balance: number;
    balanceAvailable: number;
}