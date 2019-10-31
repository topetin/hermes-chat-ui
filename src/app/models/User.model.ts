import { Deserializable } from './Deserializable.model';

export class User implements Deserializable {
    id: number;
    company_id: number;
    role_id: string;
    profile_img: string;
    username: string;
    password: string;
    name: string;
    active: number;
    created_at: string;
    email?: string;

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}