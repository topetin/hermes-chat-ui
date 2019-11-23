import { Deserializable } from './Deserializable.model';

export class Channel implements Deserializable {
    id: number;
    owner_id: number;
    type: string;
    title: string;

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}