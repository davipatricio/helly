export type AnimatedImageFormats = 'png' | 'jpg' | 'gif' | 'webp';
export type StaticImageFormats = 'png' | 'jpg' | 'webp';
export type AllowedImageSizes = 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096;

const CDNEndpoints = {
  userAvatar: (id: string, hash: string, format: AnimatedImageFormats, size = 1024 as AllowedImageSizes) => `avatars/${id}/${hash}.${format}?size=${size}`,
  defaultUserAvatar: (discriminator: string) => `default_avatars/${Number(discriminator) % 5}.png`,
  userBanner: (id: string, hash: string, format: AnimatedImageFormats, size = 1024 as AllowedImageSizes) => `banners/${id}/${hash}.${format}?size=${size}`,
};

export { CDNEndpoints };
