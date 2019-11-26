import { Deserializable } from './Deserializable.model';

export class Notification implements Deserializable {
    id: string;
    company_id: number;
    user_id: number;
    channel_id: number;
    message: string;
    at: string;
    viewed: number;

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}