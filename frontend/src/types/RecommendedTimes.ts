import { Prescription } from "./PrecriptionData";

export interface RecommendedTimes {
    id?: number,
    patient_id?: number | null,
    prescription_id?: number | null,
    recommended_time?: string | null,
    isTaken?: boolean | null,
    created_at?: string | null,
}

export interface RecommendedTimes_PillsPage {
    id?: number,
    patient_id?: number | null,
    prescription_id?: number | null,
    recommended_time?: string | null,
    prescriptions?: Prescription | null,
    isTaken?: boolean | null,
    created_at?: string | null,
}