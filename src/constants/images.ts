import { apiCdnUrl } from './gateway';

export const userAvatarUrl = (userId: string, hash: string, format: string, size: number): string => `${apiCdnUrl}/avatars/${userId}/${hash}.${format}?size=${size}`;
export const userBannerUrl = (userId: string, hash: string, format: string, size: number): string => `${apiCdnUrl}/banners/${userId}/${hash}.${format}?size=${size}`;
export const userGuildAvatarUrl = (guildId: string, userId: string, hash: string, format: string, size: number): string =>
	`${apiCdnUrl}/guilds/${guildId}/users/${userId}/avatars/${hash}.${format}?size=${size}`;
export const defaultUserAvatarUrl = (discriminator: number): string => `${apiCdnUrl}/embed/avatars/${discriminator % 5}.png`;