import { UsersService } from '../services/users.service';
import { UserProfileDto, UserPointsDto } from '../dto/user-profile.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(id: string): Promise<UserProfileDto>;
    getPoints(id: string): Promise<UserPointsDto>;
}
