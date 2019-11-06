import { Deserializable } from './Deserializable.model';

export class Feed implements Deserializable {
    id: number;
    company_id: number;
    message: string;
    at: string;

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}