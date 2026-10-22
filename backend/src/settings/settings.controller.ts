import { 
  Controller, 
  Get, 
  Patch, 
  Body, 
  UseGuards 
} from '@nestjs/common';
import { SettingsService, PlatformSettings } from './settings.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Public } from '../auth/decorators/public.decorator.js';
import { ChatGateway } from '../chat/chat.gateway.js';

@Controller('settings')
export class SettingsController {
  constructor(
    private readonly settingsService: SettingsService,
    private readonly chatGateway: ChatGateway,
  ) {}

  // Public: Any client can fetch active platform configuration
  @Get()
  @Public()
  async getSettings(): Promise<PlatformSettings> {
    return this.settingsService.getSettings();
  }

  // Admin Only: Save and broadcast updated settings
  @Patch()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateSettings(
    @Body() dto: Partial<PlatformSettings>,
  ): Promise<PlatformSettings> {
    const updated = this.settingsService.updateSettings(dto);

    // Broadcast instant settings update event to all connected clients
    if (this.chatGateway.server) {
      this.chatGateway.server.emit('settingsUpdated', updated);

      if (dto.maintenanceMode !== undefined) {
        this.chatGateway.server.emit('notification', {
          id: `notif-maint-${Date.now()}`,
          title: updated.maintenanceMode ? '🛠️ Maintenance Mode Activated' : '✅ Store Restored Online',
          body: updated.maintenanceMode 
            ? 'The public catalog is temporarily restricted for updates.' 
            : 'Welcome back! FreeProducts.online is fully active.',
          isBroadcast: true,
          type: 'system',
          timestamp: 'Just now',
          link: '/',
        });
      }
    }

    return updated;
  }
}
