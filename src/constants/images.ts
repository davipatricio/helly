import { apiCdnUrl } from './gateway.js';

export const userAvatarUrl = (userId: string, hash: string, format: string, size: number) => `${apiCdnUrl}/avatars/${userId}/${hash}.${format}?size=${size}`;
export const userBannerUrl = (userId: string, hash: string, format: string, size: number) => `${apiCdnUrl}/banners/${userId}/${hash}.${format}?size=${size}`;
export const userGuildAvatarUrl = (guildId: string, userId: string, hash: string, format: string, size: number) =>
	`${apiCdnUrl}/guilds/${guildId}/users/${userId}/avatars/${hash}.${format}?size=${size}`;
export const defaultUserAvatarUrl = (discriminator: number) => `${apiCdnUrl}/embed/avatars/${discriminator % 5}.png`;