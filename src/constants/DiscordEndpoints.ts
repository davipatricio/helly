// https://discord.com/developers/docs/reference#image-formatting-cdn-endpoints
export default {
  // API
  gatewayUrl: (version: number, encoding: string) => `wss://gateway.discord.gg/?v=${version}&encoding=${encoding}`,
  apiUrl: (version: number) => `https://discord.com/api/v${version}`,

  // User images
  userBanner: (userId: string, hash: string, size: string, format = 'png' as string) =>
    `https://cdn.discordapp.com/banners/${userId}/${hash}.${format}?size=${size}`,
  userAvatar: (userId: string, hash: string, size: number, format = 'png' as string) =>
    `https://cdn.discordapp.com/avatars/${userId}/${hash}.${format}?size=${size}`,
  userDefaultAvatar: (discriminator: number) => `https://cdn.discordapp.com/embed/avatars/${discriminator % 5}.png`,

  // Guild images
  guildIcon: (guildId: string, hash: string, size: number, format = 'png' as string) =>
    `https://cdn.discordapp.com/icons/${guildId}/${hash}.${format}?size=${size}`,
  guildSplash: (guildId: string, hash: string, size: number, format = 'png' as string) =>
    `https://cdn.discordapp.com/splashes/${guildId}/${hash}.${format}?size=${size}`,
  guildDiscoverySplash: (guildId: string, hash: string, size: number, format = 'png' as string) =>
    `https://cdn.discordapp.com/discovery-splashes/${guildId}/${hash}.${format}?size=${size}`,
  guildBanner: (guildId: string, hash: string, size: number, format = 'png' as string) =>
    `https://cdn.discordapp.com/banners/${guildId}/${hash}.${format}?size=${size}`,
};
