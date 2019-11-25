import { Deserializable } from './Deserializable.model';

export class ChannelMember implements Deserializable {
    id: number;
    company_id: number;
    role_id: number;
    profile_img: number;
    username: string;
    name: string;
    active: number;
    email: string;
    channel_id: number;
    channel_owner_id: number;
    channel_type: string;
    channel_title: string;

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}