import { Deserializable } from './Deserializable.model';

export class ChannelMessage implements Deserializable {
    id: number;
    company_id: number;
    channel_id: number;
    message: any;
    user_from_id: number;
    at: string;

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}