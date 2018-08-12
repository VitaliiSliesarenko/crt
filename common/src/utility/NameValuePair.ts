import { CommonHelper } from '../common-helper';

export class NameValuePair {
    name: string = null;
    value: any = null;

    static fromJson(pair: any): NameValuePair {
        const n = new NameValuePair();
        n.name = pair.name;
        n.value = pair.value;
        return n;
    }

    static copyAndVerify(source: NameValuePair, target?: NameValuePair): NameValuePair {
        return CommonHelper.copyAndVerifyLowLevelTypes(source, target, NameValuePair, () => {});
    }
}