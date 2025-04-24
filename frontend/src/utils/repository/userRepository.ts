import { SupabaseClient } from '@supabase/supabase-js';
import { User, UserFilter, UserList } from '@/types/UserData';

class UserRepository {
    private supabase: SupabaseClient;

    constructor(supabase: SupabaseClient) {
        this.supabase = supabase;
    }

    public async read(id: number | undefined): Promise<{ data: User[] | null, error: any }> {

        if (id === undefined) {
            return { data: null, error: 'Please provide a id for the filter' };
        }

        const { data, error } = await this.supabase.from('users').select('*').eq('id', id);

        if (error) {
            console.error('Error fetching users', error);
            return { data: null, error };
        }

        return { data, error };
    }

    public async create(filter: UserFilter | UserList | undefined): Promise<{ data: User[] | null, error: any }> {
        if (filter === undefined) {
            return { data: null, error: 'Please provide content to insert' };
        }

        const { data, error } = await this.supabase.from('users').insert(filter).select();

        if (error) {
            console.error('Error creating user', error);
            return { data: null, error };
        }

        return { data, error };
    }

    public async update(id: number | undefined, filter: UserFilter | undefined): Promise<{ data: User[] | null, error: any }> {
        if (id === undefined || filter === undefined) {
            return { data: null, error: 'Missing fields for id or content to update' };
        }

        const { data, error } = await this.supabase.from('users').update(filter).eq('id', id).select();

        if (error) {
            console.error('Error updating user', error);
            return { data: null, error };
        }

        return { data, error };
    }


    public async delete(id: number | Array<number> | undefined): Promise<{ data: User[] | null, error: any }> {
        if (id === undefined) {
            return { data: null, error: 'Please provide a filter for deletion' };
        }

        let query = this.supabase
            .from('users')
            .delete();
        if (typeof id !== 'number') {
            query = query.in('id', id);
        } else {
            query = query.eq('id', id);
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