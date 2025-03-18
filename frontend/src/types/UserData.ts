export interface UserInfo {
    'first_name': string
    'last_name': string
}

export interface Prescription {
    medication: string,
    patient: number,
    description: string,
    amount: number,
    frequency: string,
    refills: number,
    refill_time: string,
    next_scheduled_time: string,
    last_taken_at: string,
    created_at: string,
    updated_at: string,
    id: number
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