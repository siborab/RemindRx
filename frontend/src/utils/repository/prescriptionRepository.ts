import { SupabaseClient } from "@supabase/supabase-js";
import { Prescription, PrescriptionFilter, PrescriptionList } from "@/types/PrecriptionData";

class PrescriptionRepository {
    private prescription: SupabaseClient;

    constructor(prescription: SupabaseClient) {
        this.prescription = prescription;
    }

    public async read(id: number | undefined): Promise<{ data: Prescription[] | null, error: any }> {
        if (id === undefined) {
            return { data: null, error: 'Please provide a id for reading' };
        }

        const { data, error } = await this.prescription.from('prescriptions').select('*').eq('id', id);

        if (error) {
            console.error('Error fetching prescriptions', error);
            return { data: null, error };
        }

        return { data, error };
    }

    public async create(filter: PrescriptionFilter | PrescriptionList | undefined): Promise<{ data: Prescription[] | null, error: any }> {
        if (filter === undefined) {
            return { data: null, error: 'Please provide content to insert' };
        }

        const { data, error } = await this.prescription.from('prescriptions').insert(filter).select();

        if (error) {
            console.error('Error creating prescription', error);
            return { data: null, error };
        }

        return { data, error };
    }

    public async update(id: number | undefined, filter: PrescriptionFilter | undefined): Promise<{ data: Prescription[] | null, error: any }> {
        if (id === undefined || filter === undefined) {
            return { data: null, error: 'Missing fields for id or content to update' };
        }

        const { data, error } = await this.prescription.from('prescriptions').update(filter).select();

        if (error) {
            console.error('Error updating prescription', error);
            return { data: null, error };
        }

        return { data, error };
    }

    public async delete(filter: number | Array<number> | undefined): Promise<{ data: Prescription[] | null, error: any }> {
        if (filter === undefined) {
            return { data: null, error: 'Please provide a filter for deletion' };
        }

        let query = this.prescription
            .from('prescriptions')
            .delete();
        if (typeof filter !== 'number') {
            query = query.in('id', filter);
        } else {
            query = query.eq('id', filter);
        }

        const { data, error } = await query.select();

        if (error) {
            console.error('Error deleting prescriptions', error);
            return { data: null, error };
        }

        return { data, error };
    }
}

export default PrescriptionRepository;