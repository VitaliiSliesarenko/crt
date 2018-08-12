import { TraderPair } from '../trader-pair';

export class CurrencyPair {

    public static BTCUSD: TraderPair = {
        Bitfinex: 'tBTCUSD',
        Poloneix: 'BTC_USDT', // todo: what is the real currency for the usd, looks like poloneix doesn't trade for usd
        Yobit: 'btc_usd',
        Bitstamp: 'btcusd',
        Gdax: 'BTC-USD' // Country is not included in the list...
    };
}
