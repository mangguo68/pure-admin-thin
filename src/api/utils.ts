/**
 * API基础URL配置
 * 开发环境使用代理，生产环境使用真实地址
 */

export const baseUrlApi = (url: string) => `/api/${url}`;

// 或者根据环境区分（推荐使用代理配置）
// export const baseUrlApi = (url: string) =>
//   process.env.NODE_ENV === "development"
//     ? `/api/${url}`
//     : `https://vtdoptbzeqek.sealoshzh.site/api/admin/${url}`;
