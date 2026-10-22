import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface PlatformSettings {
  amazonTag: string;
  currency: string;
  platformName: string;
  supportEmail: string;
  enableSoundAlerts: boolean;
  maintenanceMode: boolean;
}

const DEFAULT_SETTINGS: PlatformSettings = {
  amazonTag: 'bwbh00-20',
  currency: 'USD ($)',
  platformName: 'FreeProducts.online',
  supportEmail: 'support@freeproducts.online',
  enableSoundAlerts: true,
  maintenanceMode: false,
};

@Injectable()
export class SettingsService {
  private readonly logger = new Logger(SettingsService.name);
  private readonly filePath = path.resolve(process.cwd(), 'data', 'platform-settings.json');
  private memorySettings: PlatformSettings = { ...DEFAULT_SETTINGS };

  constructor() {
    this.initSettings();
  }

  private initSettings() {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        this.memorySettings = { ...DEFAULT_SETTINGS, ...parsed };
      } else {
        fs.writeFileSync(this.filePath, JSON.stringify(DEFAULT_SETTINGS, null, 2), 'utf-8');
      }
    } catch (e) {
      this.logger.warn(`Could not read settings from disk, using memory default: ${e}`);
    }
  }

  getSettings(): PlatformSettings {
    return { ...this.memorySettings };
  }

  updateSettings(dto: Partial<PlatformSettings>): PlatformSettings {
    this.memorySettings = {
      ...this.memorySettings,
      ...(dto.amazonTag !== undefined && { amazonTag: dto.amazonTag.trim() }),
      ...(dto.currency !== undefined && { currency: dto.currency.trim() }),
      ...(dto.platformName !== undefined && { platformName: dto.platformName.trim() }),
      ...(dto.supportEmail !== undefined && { supportEmail: dto.supportEmail.trim().toLowerCase() }),
      ...(dto.enableSoundAlerts !== undefined && { enableSoundAlerts: Boolean(dto.enableSoundAlerts) }),
      ...(dto.maintenanceMode !== undefined && { maintenanceMode: Boolean(dto.maintenanceMode) }),
    };

    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.filePath, JSON.stringify(this.memorySettings, null, 2), 'utf-8');
      this.logger.log(`✅ Platform settings updated successfully.`);
    } catch (e) {
      this.logger.error(`Failed to persist settings to disk: ${e}`);
    }

    return { ...this.memorySettings };
  }
}
