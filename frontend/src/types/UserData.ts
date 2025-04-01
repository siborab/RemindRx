export interface UserInfo {
    'first_name': string
    'last_name': string
}

export interface User {
    id?: number;
    first_name?: string | null;
    last_name?: string | null;
    phone_number?: string | null;
    date_of_birth?: string | null;
    timezone?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    email?: string | null;
    auth_id?: string | null;
}

export type UserList = Array<Partial<User>>;
export type UserFilter = Partial<User>; 