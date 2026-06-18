import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private supabase: SupabaseClient;

  constructor(private readonly configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      this.logger.error('Supabase URL or Service Role Key is missing in environment variables');
      throw new Error('Supabase configuration is incomplete');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    
    this.logger.log('Supabase client initialized with Service Role');
  }

  /**
   * Obtiene el cliente global de Supabase con privilegios administrativos (Service Role)
   * Úsalo únicamente en capas de repositorio.
   */
  getClient(): SupabaseClient {
    return this.supabase;
  }
}
