import DataManager from './DataManager';

import type Client from '../client/Client';

export type GuildFeatures = 'ANIMATED_ICON' | 'BANNER' | 'COMMERCE' | 'COMMUNITY' | 'DISCOVERABLE' | 'FEATURABLE' |
    'INVITE_SPLASH' | 'MEMBER_VERIFICATION_GATE_ENABLED' | 'NEWS' | 'PARTNERED' | 'PREVIEW_ENABLED' | 'VANITY_URL' | 'VERIFIED' | 'VIP_REGIONS' |
    'WELCOME_SCREEN_ENABLED' | 'TICKETED_EVENTS_ENABLED' | 'MONETIZATION_ENABLED' | 'MORE_STICKERS' |
    'THREE_DAY_THREAD_ARCHIVE' | 'SEVEN_DAY_THREAD_ARCHIVE' | 'PRIVATE_THREADS' | 'ROLE_ICONS'

class Guild extends DataManager {
    // Guild properties
    name!: string | null;
    id!: string | null;
    features!: GuildFeatures[];

    constructor(client: Client, data: object) {
        super(client);
        this.parseData(data);
    }

    override parseData(data: Record<string, any>): any {
        if (!data) return null;

        this.name = data.name;
        this.id = data.id;
        this.features = data.features;
        return data;
    }
}

export default Guild;
