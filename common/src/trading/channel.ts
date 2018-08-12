import { ChannelType } from "./channels";
import { BookData } from "./book-data";

export class Channel {
    public id: number = 0;
    public subscribed: boolean = false;
    public data: void | BookData = null;

    constructor(public type: ChannelType) { }
}