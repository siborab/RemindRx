export interface Prescription {
    id?: number,
    medication?: string | null,
    patient?: number | null,
    description?: string | null,
    amount?: number | null,
    frequency?: string | null,
    refills?: number | null,
    refill_time?: string | null,
    next_scheduled_time?: string | null,
    last_taken_at?: string | null,
    last_sent_time?: string | null,
    created_at?: string | null,
    updated_at?: string | null,
}

export interface RecommendedTimePrescription {
    recommended_time: string,
    prescription: Prescription,
    isTaken: boolean
}

export type PrescriptionList = Array<Partial<Prescription>>;
export type PrescriptionFilter = Partial<Prescription>;
