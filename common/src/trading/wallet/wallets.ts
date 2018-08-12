import { Wallet } from './wallet';
import { CommonHelper } from '../../common-helper';
import { HashObj } from '../../utility/HashObj';

export class Wallets {
    public traderName: string = null;
    private wallets: HashObj<Wallet> = new HashObj<Wallet>();

    static copyAndVerify(source: Wallets, target?: Wallets): Wallets {
        return CommonHelper.copyAndVerifyLowLevelTypes(source, target, Wallets, (s, t) => {
            if (s.wallets != null) {
               t.wallets = HashObj.copyAndVerify(s.wallets);
            }
        });
    }

    static create(traderName: string): Wallets {
        const wallets = new Wallets();
        wallets.traderName = traderName;
        return wallets;
    }

    public getWallets(): Wallet[] {
        return this.wallets.values();
    }

    public getWallet(currency: string): Wallet {
        return this.wallets.get(currency);
    }

    public setWallet(currency: string, wallet: Wallet): void {
        this.wallets.set(currency, wallet);
    }
}
