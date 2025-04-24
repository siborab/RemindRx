import UserRepository from "../repository/userRepository";

class UserService {
    private users: UserRepository;

    constructor(users: UserRepository) {
        this.users = users;
    }

}