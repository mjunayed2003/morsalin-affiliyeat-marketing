export interface PlatformSettings {
    amazonTag: string;
    currency: string;
    platformName: string;
    supportEmail: string;
    enableSoundAlerts: boolean;
    maintenanceMode: boolean;
}
export declare class SettingsService {
    private readonly logger;
    private readonly filePath;
    private memorySettings;
    constructor();
    private initSettings;
    getSettings(): PlatformSettings;
    updateSettings(dto: Partial<PlatformSettings>): PlatformSettings;
}
