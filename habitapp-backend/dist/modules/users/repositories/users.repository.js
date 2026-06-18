"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var UsersRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRepository = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../../../common/supabase/supabase.service");
let UsersRepository = UsersRepository_1 = class UsersRepository {
    supabaseService;
    logger = new common_1.Logger(UsersRepository_1.name);
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async findById(id) {
        const supabase = this.supabaseService.getClient();
        const { data, error } = await supabase
            .schema('gestion')
            .from('usuarios')
            .select('*')
            .eq('idusuario', id)
            .single();
        if (error) {
            if (error.code === 'PGRST116') {
                throw new common_1.NotFoundException(`User with ID ${id} not found`);
            }
            this.logger.error(`Error fetching user profile: ${error.message}`);
            throw new common_1.InternalServerErrorException('Error retrieving user data from database');
        }
        return data;
    }
};
exports.UsersRepository = UsersRepository;
exports.UsersRepository = UsersRepository = UsersRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], UsersRepository);
//# sourceMappingURL=users.repository.js.map