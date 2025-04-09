import { PrescriptionFilter, PrescriptionList } from "@/types/PrecriptionData";
import { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/utils/supabase/client";
import PrescriptionRepository from "@/utils/repository/prescriptionRepository";

let prescriptionRepository: PrescriptionRepository;

const testId = Math.floor(Math.random() * 1000000);
const testPrescription: PrescriptionFilter = {
    id: testId,
    medication: 'ketamine test',
    patient: 1,
    description: 'prescription for ketamine',
    amount: 2,
    frequency: 'BID',
    refills: 3,
    refill_time: '2025-03-27',
    next_scheduled_time: '2025-03-28T18:15:22+00:00',
};

describe('PrescriptionRepository Unit Test', () => {
    const mockbase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        in: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
    }

    jest.mock('@supabase/supabase-js', () => ({
        createClient: jest.fn(() => mockbase),
    }));

    beforeAll(() => {
        prescriptionRepository = new PrescriptionRepository(mockbase as unknown as SupabaseClient);
    });

    test('read', async () => {
        (mockbase.from as jest.Mock).mockReturnThis();
        (mockbase.select as jest.Mock).mockReturnThis();
        (mockbase.eq as jest.Mock).mockResolvedValueOnce({
            data: [testPrescription],
            error: null
        });

        const prescription_info = await prescriptionRepository.read(testPrescription.id);

        expect(mockbase.from).toHaveBeenCalledWith('prescriptions');
        expect(mockbase.eq).toHaveBeenCalledWith('id', testPrescription.id);

        expect(prescription_info).toEqual({ data: [testPrescription], error: null });
        expect(prescription_info.data).toContain(testPrescription);
    });

    test('requirements for read', async () => {

    });

    test('create', async () => {
        (mockbase.from as jest.Mock).mockReturnThis();
        (mockbase.insert as jest.Mock).mockReturnThis();
        (mockbase.select as jest.Mock).mockResolvedValueOnce({
            data: [testPrescription],
            error: null
        });

        const prescription_info = await prescriptionRepository.create(testPrescription);

        expect(mockbase.from).toHaveBeenCalledWith('prescriptions');
        expect(mockbase.insert).toHaveBeenCalledWith(testPrescription);

        expect(prescription_info).toEqual({ data: [testPrescription], error: null });
        expect(prescription_info.data).toContain(testPrescription);
    });
});

// PrescriptionRepository Integration Test
describe('PrescriptionRepository Integration Test', () => {

    beforeAll(() => {
        prescriptionRepository = new PrescriptionRepository(supabase);
    })

    afterAll(async () => {
        await prescriptionRepository.delete(testId);
    })

    describe('create', () => {
        test('missing fields of insertion', async () => {
            const prescription_info = await prescriptionRepository.create(undefined);

            expect(prescription_info).toEqual({ data: null, error: 'Please provide content to insert' });
        });

        test('insertion of prescription', async () => {
            const prescription_info = await prescriptionRepository.create(testPrescription);

            expect(prescription_info.data).toMatchObject([testPrescription]);
            expect(prescription_info.error).toBeNull();
        });
    });

    describe('read', () => {
        test('missing fields of reading', async () => {
            const prescription_info = await prescriptionRepository.read(undefined);

            expect(prescription_info).toEqual({ data: null, error: 'Please provide a id for reading' });
        });

        test('reading of prescription', async () => {
            const prescription_info = await prescriptionRepository.read(testPrescription.id);

            expect(prescription_info.data).toMatchObject([testPrescription]);
            expect(prescription_info.error).toBeNull();
        });

        test('reading of non-existent prescription', async () => {
            const prescription_info = await prescriptionRepository.read(100000000000);

            expect(prescription_info.data).toEqual([]);
            expect(prescription_info.error).toBeNull();
        });
    })
});