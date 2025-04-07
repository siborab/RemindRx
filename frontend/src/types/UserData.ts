export interface UserInfo {
    'first_name' : string
    'last_name' : string
}

export interface Prescription {
    medication: string,
    patient: number, 
    description: string,
    amount: number,
    refill_time: string,
    last_taken_at: string | null,
    id: number,
    recommended_time: string
}