import UserRepository from '@/utils/repository/userRepository';
import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '@/utils/supabase/client';
import { User, UserFilter, UserList } from '@/types/UserData';

let userRepository: UserRepository;

// Unit test
describe('UserRepository Unit Test', () => {

    const mockbase = {
        from: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        in: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
    };

    const mockUser: Partial<User> = {
        id: 1,
        first_name: 'Ben',
        last_name: 'Oviedo',
        phone_number: '11231333',
        date_of_birth: '2020-01-20',
        email: 'beno123@gmail.com'
    };

    jest.mock('@supabase/supabase-js', () => ({
        createClient: jest.fn(() => mockbase),
    }));

    beforeAll(() => {
        userRepository = new UserRepository(mockbase as unknown as SupabaseClient);
    });

    describe('read', () => {
        const mockError = { message: `error fetching user ${mockUser.first_name}` };

        test('retrieving the user by id', async () => {
            (mockbase.from as jest.Mock).mockReturnThis();
            (mockbase.select as jest.Mock).mockReturnThis();
            (mockbase.eq as jest.Mock).mockReturnThis();

            (mockbase.eq as jest.Mock).mockResolvedValueOnce({
                data: [mockUser],
                error: null,
            });

            const user = await userRepository.read(1);

            expect(user).toEqual({ data: [mockUser], error: null });
            expect(mockbase.eq).toHaveBeenCalledWith('id', 1);
        });

        test('failed to retrieve user by id', async () => {
            (mockbase.from as jest.Mock).mockReturnThis();
            (mockbase.select as jest.Mock).mockReturnThis();
            (mockbase.eq as jest.Mock).mockResolvedValueOnce({
                data: null,
                error: mockError,
            });

            const user = await userRepository.read(1);

            expect(user.data).toBeNull();
            expect(user.error).toEqual(mockError);
        });
    });

    describe('create', () => {
        const mockError = { message: `error inserting user ${mockUser.first_name}` };

        test('insert the user and return it', async () => {
            (mockbase.from as jest.Mock).mockReturnThis();
            (mockbase.insert as jest.Mock).mockReturnThis();
            (mockbase.select as jest.Mock).mockResolvedValueOnce({
                data: [mockUser],
                error: null,
            });

            const user = await userRepository.create(mockUser);

            expect(user).toEqual({ data: [mockUser], error: null });
            expect(mockbase.insert).toHaveBeenCalledWith(mockUser);
        });

        test('insertion failed, returning an error message', async () => {
            (mockbase.from as jest.Mock).mockReturnThis();
            (mockbase.insert as jest.Mock).mockReturnThis();
            (mockbase.select as jest.Mock).mockResolvedValueOnce({
                data: null,
                error: mockError,
            });

            const result = await userRepository.create(mockUser);

            expect(result.data).toBeNull();
            expect(result.error).toEqual(mockError);
        });
    })

    describe('update', () => {
        const mockError = { message: `error updating user ${mockUser.first_name}` };
        const updateUser = { ...mockUser, first_name: 'Ivan', last_name: 'Chen' };

        test('update the user and return it', async () => {
            (mockbase.from as jest.Mock).mockReturnThis();
            (mockbase.update as jest.Mock).mockReturnThis();
            (mockbase.select as jest.Mock).mockResolvedValueOnce({
                data: [updateUser],
                error: null,
            });

            const user = await userRepository.update(mockUser.id, updateUser);

            expect(user.data).toEqual([updateUser]);

            expect(mockbase.update).toHaveBeenCalledWith(updateUser);
            expect(mockbase.eq).toHaveBeenCalledWith('id', mockUser.id);
        });

        test('failed to update user data', async () => {
            (mockbase.from as jest.Mock).mockReturnThis();
            (mockbase.update as jest.Mock).mockReturnThis();
            (mockbase.select as jest.Mock).mockResolvedValueOnce({
                data: null,
                error: mockError,
            });

            const user = await userRepository.update(mockUser.id, updateUser);

            expect(user.data).toBeNull();
            expect(user.error).toEqual(mockError);

            expect(mockbase.update).toHaveBeenCalledWith(updateUser);
            expect(mockbase.eq).toHaveBeenCalledWith('id', mockUser.id);
        });
    });

    describe('delete', () => {
        const mockError = { message: `error deleting user ${mockUser.first_name}` };

        test('delete single user and return user information', async () => {
            (mockbase.from as jest.Mock).mockReturnThis();
            (mockbase.delete as jest.Mock).mockReturnThis();
            (mockbase.eq as jest.Mock).mockReturnThis();
            (mockbase.select as jest.Mock).mockResolvedValueOnce({
                data: mockUser,
                error: null,
            });

            const user = await userRepository.delete(1);

            expect(user.data).toEqual(mockUser);
            expect(user.error).toBeNull();
            expect(mockbase.eq).toHaveBeenCalledWith('id', 1);
        });

        test('delete multiple users and return deleted users', async () => {
            const mockUsers = [
                mockUser,
                { ...mockUser, id: 2, first_name: 'Sour' },
            ];
            (mockbase.from as jest.Mock).mockReturnThis();
            (mockbase.delete as jest.Mock).mockReturnThis();
            (mockbase.in as jest.Mock).mockReturnThis();
            (mockbase.select as jest.Mock).mockResolvedValueOnce({
                data: mockUsers,
                error: null,
            });
            const user = await userRepository.delete([1, 2]);

            expect(user.data).toEqual(mockUsers);
            expect(user.error).toBeNull();
            expect(mockbase.in).toHaveBeenCalledWith('id', [1, 2]);
        });

        test('failed to delete user', async () => {
            (mockbase.from as jest.Mock).mockReturnThis();
            (mockbase.delete as jest.Mock).mockReturnThis();
            (mockbase.eq as jest.Mock).mockReturnThis();
            (mockbase.select as jest.Mock).mockResolvedValueOnce({
                data: null,
                error: mockError,
            });

            const user = await userRepository.delete(1);

            expect(user.data).toBeNull();
            expect(user.error).toEqual(mockError);
        });
    });
});

// Integration Test
describe('UserRepository Integration Test', () => {
    const testId = Math.floor(Math.random() * 100);
    const testUser: UserFilter = {
        id: testId,
        auth_id: null,
        created_at: '2025-03-18T04:19:14.794006+00:00',
        date_of_birth: '2025-03-20',
        email: 'johnwow@gmail.com',
        first_name: 'John',
        last_name: 'Doe',
    };

    beforeAll(() => {
        userRepository = new UserRepository(supabase);
    });

    afterAll(async () => {
        await userRepository.delete(testId);
    });

    describe('create', () => {
        test('creating a new user', async () => {
            const user = await userRepository.create(testUser);

            expect(user.data).toMatchObject([testUser]);
            expect(user.error).toBeNull();
        });

        test('creating duplicate users', async () => {
            const user = await userRepository.create(testUser);

            expect(user.data).toBeNull();
            expect(user.error).not.toBeNull();
            expect(user.error.message).toContain('duplicate key value violates unique constraint');
        });
    });

    describe('read', () => {
        test('retrieving user by id', async () => {
            const user = await userRepository.read(testUser.id);

            expect(user.data).toMatchObject([testUser]);
            expect(user.error).toBeNull();
        });

        test('failed to retrieve user by id', async () => {
            const user = await userRepository.read(10000000000000);

            expect(user.data).toEqual([]);
            expect(user.error).toBeNull();
        });
    });
});
