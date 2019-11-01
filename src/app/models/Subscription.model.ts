import { Deserializable } from './Deserializable.model';

export class Subscription implements Deserializable {
    id: number;
    company_id: number;
    active: number;
    creation_date: string;
    expiration_date: string;
    invoice_num: string;

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}