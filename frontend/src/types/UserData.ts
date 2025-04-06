export interface UserInfo {
    'first_name' : string
    'last_name' : string
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