import { CommonHelper } from '../../common-helper';

export class OrderInfo {
    id: string = null;
    gId: string = null;
    cId: string = null;
    symbol: string = null;
    mtsCreate: string = null;
    mtsUpdate: string = null;
    amount: number = null;
    amountOrig: number = null;
    type: string = null;
    typePrev: string = null;
    orderStatus: string = null;
    price: number = null;
    priceAvg: number = null;
    priceTrailing: number = null;
    priceAuxLimit: number = null;
    placeId: string = null;
    flags: number = null;

    public static fromJson(jsonObject: any): OrderInfo {
        const orderInfo = new OrderInfo();
        orderInfo.id = jsonObject['ID'];
        orderInfo.id = jsonObject['GID'];
        orderInfo.id = jsonObject['CID'];
        orderInfo.id = jsonObject['SYMBOL'];
        orderInfo.id = jsonObject['MTS_CREATE'];
        orderInfo.id = jsonObject['MTS_UPDATE'];
        orderInfo.id = jsonObject['AMOUNT'];
        orderInfo.id = jsonObject['AMOUNT_ORIG'];
        orderInfo.id = jsonObject['TYPE'];
        orderInfo.id = jsonObject['TYPE_PREV'];
        orderInfo.id = jsonObject['ORDER_STATUS'];
        orderInfo.id = jsonObject['PRICE'];
        orderInfo.id = jsonObject['PRICE_AVG'];
        orderInfo.id = jsonObject['PRICE_TRAILING'];
        orderInfo.id = jsonObject['PRICE_AUX_LIMIT'];
        orderInfo.id = jsonObject['PLACED_ID'];
        orderInfo.id = jsonObject['FLAGS'];
        return orderInfo;
    }

    static copyAndVerify(source: OrderInfo, target?: OrderInfo): OrderInfo {
        return CommonHelper.copyAndVerifyLowLevelTypes(source, target, OrderInfo, () => {});
    }
}