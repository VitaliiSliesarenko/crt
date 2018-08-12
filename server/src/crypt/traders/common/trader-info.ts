import { Wallets } from '../../../../../common/src/trading/wallet/wallets';
import { Channels } from '../../../../../common/src/trading/channels';
import { OrderInfo } from '../../../../../common/src/trading/order/order-info';
import { HashObj } from '../../../../../common/src/utility/HashObj';

export class TraderInfo {
    public traderName: string = '';
    public channels: Channels = null;
    public wallets: Wallets = null;
    public orders: HashObj<OrderInfo> = null;
}