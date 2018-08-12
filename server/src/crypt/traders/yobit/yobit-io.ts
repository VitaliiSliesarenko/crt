import * as request from 'request';
import * as Q from 'q';
import * as moment from 'moment';
import * as CryptoJS from 'crypto-js';
import { TraderInfo } from '../common/trader-info';
import { HashObj } from '../../../../../common/src/utility/HashObj';
import { CurrencyPair } from '../../../../../common/src/trading/currency/currency-pair';
import Timer = NodeJS.Timer;
import { Logger } from '../../../../../common/src/logger';
import { Order } from '../../../../../common/src/trading/order/order';
import { OrderBidAsk } from '../../../../../common/src/trading/order/order-bid-ask';
import * as https from "https";
import * as http from "http";
import { BookData } from '../../../../../common/src/trading/book-data';
import { BookRecord } from '../../../../../common/src/trading/book-record';
import { ChannelType } from '../../../../../common/src/trading/channels';

export class YobitIO {

    private static key = '8032DECC7ADDE49F040DAD22EE3CEA57';
    private static secret = '92535043d84d28ee1a09972cfb703d2b';
    private static authUrl = 'https://yobit.net/tapi';
    private static url = 'yobit.net';
    private static refreshInterval = 5000;
    private static requestInterval = 5000;
    private log: Logger = null;
    private intervals: HashObj<Timer> = new HashObj<Timer>();

    constructor(private traderInfo: TraderInfo) {
        this.log = new Logger(this.traderInfo.traderName);
    }

    public subscribeToActiveOrders() {
        this.stop('requestActiveOrders');
        const interval = setInterval(() => {
            return YobitIO.authRequest('ActiveOrders', {'pair': CurrencyPair.BTCUSD.Yobit}).then((data) => {
                this.log.logNamed(`requestActiveOrders: ${JSON.stringify(data)}`);
                return data; // todo transform to OrderInfo
                /*
                		"100025362":{
			"pair":"ltc_btc",
			"type":"sell",
			"amount":21.615,
			"rate":0.258,
			"timestamp_created":1418654530,
			"status":0
		},
                 */
            }).catch(error => {
                console.error(JSON.stringify(error));
            });
        }, YobitIO.requestInterval);
        this.intervals.set('requestActiveOrders', interval);
    }

    public getAccountsInfo(): Q.Promise<any> {
        return YobitIO.authRequest('getInfo', {}).then((data) => {
            return data; // todo transform to AccountInfo
        }).catch(error => {
            console.error(JSON.stringify(error));
        });
    }

    public setOrder(order: Order): Q.Promise<string> {
        return YobitIO.authRequest('Trade', {
            'pair': order.currency.Yobit,
            'type': order.bidAsk === OrderBidAsk.bid ? 'buy' : 'sell',
            'rate': order.price,
            'amount': order.amount
        }).then((data: any) => {
            return data;
        }).catch(error => {
            return Q.reject(JSON.stringify(error));
        });
    }

    public subscribeToBook() {
        this.stop('subscribeToBook');
        const bookInterval = setInterval(() => {
            this.requestBook().then((data: string) => {
                // Logger.log(`Trader [${this.traderName}] Book data: ${data}`);
                try {
                    const channel = this.traderInfo.channels.getByType(ChannelType.book);
                    channel.data = new BookData();
                    channel.data.traderName = this.traderInfo.traderName;
                    const channelData = channel.data as BookData;

                    const obj = JSON.parse(data);
                    obj.asks.slice(0, 25).forEach((ask: number[]) => { // we only need 25 records as on the bitfinex but cannot limit to 25 in query
                        channelData.askHash[ask[0]] = new BookRecord(ask[0], 1, ask[1]);
                    });
                    obj.bids.slice(0, 25).forEach((bid: number[]) => {
                        channelData.bidHash[bid[0]] = new BookRecord(bid[0], 1, bid[1]);
                    });
                } catch (error) {
                    Logger.log(`Trader [${this.traderInfo.traderName}] Incorrect Book data: ${error}; Data: ${data}`);
                }
            }).catch((error) => {
                Logger.log(`Trader [${this.traderInfo.traderName}] exception ${error}`);
            });
        }, YobitIO.refreshInterval);

        this.intervals.set('subscribeToBook', bookInterval);
    }



    public stop(intervalName?: string) {
        if (intervalName == null) {
            if (this.intervals.has(intervalName)) {
                clearInterval(this.intervals.get(intervalName));
            }
            return;
        }
        this.intervals.values().forEach(interval => {
            clearInterval(interval);
        });
    }

    private requestBook(): Q.Promise<string> {
        return Q.Promise<string>((resolve, reject) => {
            const options = {
                host: YobitIO.url,
                path: '/api/2/' + CurrencyPair.BTCUSD.Yobit + '/depth',
                method: 'GET'
            };

            try {
                let body = '';
                const request = https.request(options, (response: http.IncomingMessage) => {
                    response.setEncoding('utf8');
                    response.on('data', (chunk) => {
                        body += chunk;
                    });
                    response.on('end', () => {
                        resolve(body);
                    });
                });
                request.on('abort', () => {
                    reject('Aborted');
                });
                request.on('error', (e) => {
                    reject(e);
                });
                request.end();
            } catch (e) {
                reject(e);
            }
        });
    }

    private static authRequest(method: string, params: any): Q.Promise<any> {
        return Q.Promise<string>((resolve, reject) => {
            try {
                // string = "method=getInfo&nonce=" + (moment().unix() - moment('2018-02-01').unix());
                // const crypted = CryptoJS.HmacSHA512(parameters, this.secret).toString(CryptoJS.enc.Hex);

                params.method = method;
                params.nonce = YobitIO.generateNonce();

                const headers: any = {"User-Agent": "nodejs-7.5-api-client"};
                headers.key = YobitIO.key;
                headers.sign = YobitIO.signMessage(params);
                const options = {
                    url: YobitIO.authUrl,
                    method: 'POST',
                    headers: headers,
                    form: params
                };
                request(options, (error, response, data) => {
                    if (error != null) {
                        reject(error);
                        return;
                    }
                    resolve(data);
                });

                /*
                                const options = {
                                    host: this.url,
                                    path: '/tapi/', // /?' + parameters,
                                    method: 'POST',
                                    headers: {
                                        'Key': this.key,
                                        'Sign': crypted,
                                        'Content-Type': 'application/x-www-form-urlencoded'
                                    }
                                };
                                let body = '';
                                const request = https.request(options, (response: http.IncomingMessage) => {
                                    response.setEncoding('utf8');
                                    response.on('data', (chunk) => {
                                        body += chunk;
                                    });
                                    response.on('end', () => {
                                        resolve(body);
                                    });
                                });
                                request.on('abort', () => {
                                    reject('Aborted');
                                });
                                request.on('error', (e) => {
                                    reject(e);
                                });
                                const res = request.write(crypted, (a: any) => {
                                    const b = a;
                                });
                                request.end();
                                */
            } catch (e) {
                console.error(e);
                reject(e);
            }
        });
    }

    private static signMessage(params: any): string {
        const data = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
        return CryptoJS.HmacSHA512(data, YobitIO.secret).toString(CryptoJS.enc.Hex);
    }

    private static generateNonce(): string {
        return (moment().unix() - moment('2018-02-01').unix()).toString();
    }
}