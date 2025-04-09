import PrescriptionRepository from "../repository/prescriptionRepository"

class PrescriptionService {
    private prescriptions: PrescriptionRepository;

    constructor(prescriptions: PrescriptionRepository) {
        this.prescriptions = prescriptions
    }
}