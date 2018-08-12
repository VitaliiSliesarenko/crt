import { CommonHelper } from "../common-helper";

export class BookData {
    public traderName: string = null;
    public bidHash: any = {};
    public askHash: any = {};

    static copyAndVerify(source: BookData, target?: BookData): BookData {
        return CommonHelper.copyAndVerifyLowLevelTypes(source, target, BookData, () => {});
    }
}