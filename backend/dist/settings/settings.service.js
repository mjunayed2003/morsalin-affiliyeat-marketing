var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SettingsService_1;
import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
const DEFAULT_SETTINGS = {
    amazonTag: 'bwbh00-20',
    currency: 'USD ($)',
    platformName: 'FreeProducts.online',
    supportEmail: 'support@freeproducts.online',
    enableSoundAlerts: true,
    maintenanceMode: false,
};
let SettingsService = SettingsService_1 = class SettingsService {
    logger = new Logger(SettingsService_1.name);
    filePath = path.resolve(process.cwd(), 'data', 'platform-settings.json');
    memorySettings = { ...DEFAULT_SETTINGS };
    constructor() {
        this.initSettings();
    }
    initSettings() {
        try {
            const dir = path.dirname(this.filePath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            if (fs.existsSync(this.filePath)) {
                const raw = fs.readFileSync(this.filePath, 'utf-8');
                const parsed = JSON.parse(raw);
                this.memorySettings = { ...DEFAULT_SETTINGS, ...parsed };
            }
            else {
                fs.writeFileSync(this.filePath, JSON.stringify(DEFAULT_SETTINGS, null, 2), 'utf-8');
            }
        }
        catch (e) {
            this.logger.warn(`Could not read settings from disk, using memory default: ${e}`);
        }
    }
    getSettings() {
        return { ...this.memorySettings };
    }
    updateSettings(dto) {
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
        }
        catch (e) {
            this.logger.error(`Failed to persist settings to disk: ${e}`);
        }
        return { ...this.memorySettings };
    }
};
SettingsService = SettingsService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], SettingsService);
export { SettingsService };
//# sourceMappingURL=settings.service.js.map