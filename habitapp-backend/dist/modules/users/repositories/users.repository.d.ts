import { SupabaseService } from '../../../common/supabase/supabase.service';
import { UserProfileDto } from '../dto/user-profile.dto';
export declare class UsersRepository {
    private readonly supabaseService;
    private readonly logger;
    constructor(supabaseService: SupabaseService);
    findById(id: string): Promise<UserProfileDto>;
}
