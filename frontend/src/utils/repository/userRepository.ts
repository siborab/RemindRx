import { SupabaseClient } from '@supabase/supabase-js';
import { User } from '@/types/UserData';

class UserRepository {
    private supabase: SupabaseClient;

    constructor(supabase: SupabaseClient) {
        this.supabase = supabase;
    }

    public async read(filter: number | undefined): Promise<{ data: User[] | null, error: any }> {
        const { data, error } = await this.supabase.from('users').select('*').eq('id', filter);

        if (error) {
            console.error('Error fetching users', error);
            return { data: null, error };
        }

        return { data, error };
    }

    public async create(filter: User | User[]): Promise<{ data: User[] | null, error: any }> {
        const { data, error } = await this.supabase.from('users').insert(filter).select();

        if (error) {
            console.error('Error creating user', error);
            return { data: null, error };
        }

        return { data, error };
    }

    public async update(filter: User): Promise<{ data: User[] | null, error: any }> {
        const { data, error } = await this.supabase.from('users').update(filter).select();

        if (error) {
            console.error('Error updating user', error);
            return { data: null, error };
        }

        return { data, error };
    }


    public async delete(filter: number | Array<number>): Promise<{ data: User[] | null, error: any }> {
        let query = this.supabase
            .from('users')
            .delete();
        if (typeof filter !== 'number') {
            query = query.in('id', filter);
        } else {
            query = query.eq('id', filter);
        }

        const { data, error } = await query.select();

        if (error) {
            console.error('Error deleting users', error);
            return { data: null, error };
        }

        return { data, error };
    }
}

export default UserRepository;