import { SettingsService, PlatformSettings } from './settings.service.js';
import { ChatGateway } from '../chat/chat.gateway.js';
export declare class SettingsController {
    private readonly settingsService;
    private readonly chatGateway;
    constructor(settingsService: SettingsService, chatGateway: ChatGateway);
    getSettings(): Promise<PlatformSettings>;
    updateSettings(dto: Partial<PlatformSettings>): Promise<PlatformSettings>;
}
