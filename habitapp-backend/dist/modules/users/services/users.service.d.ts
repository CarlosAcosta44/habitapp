import { UsersRepository } from '../repositories/users.repository';
import { UserProfileDto, UserPointsDto } from '../dto/user-profile.dto';
export declare class UsersService {
    private readonly usersRepository;
    constructor(usersRepository: UsersRepository);
    getUserProfile(id: string): Promise<UserProfileDto>;
    getUserPoints(id: string): Promise<UserPointsDto>;
}
