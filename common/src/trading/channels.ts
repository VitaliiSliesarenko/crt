import { Channel } from "./channel";

export enum ChannelType {
    empty = <any>'empty',
    book = <any>'book'
}

export class Channels {
    private channelsByType: Map<ChannelType, Channel> = new Map<ChannelType, Channel>();
    private channelsById: Map<number, Channel> = new Map<number, Channel>();

    public getByType(name: ChannelType): Channel {
        return this.channelsByType.get(name);
    }

    public getById(id: number): Channel {
        return this.channelsById.get(id);
    }

    public setByType(channel: Channel) {
        this.channelsByType.set(channel.type, channel);
    }

    public setById(channel: Channel) {
        this.channelsById.set(channel.id, channel);
    }

    public remove(channel: Channel) {
        this.channelsByType.delete(channel.type);
        this.channelsById.delete(channel.id);
    }
}