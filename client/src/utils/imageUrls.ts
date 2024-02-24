export const getBackgroundUrl = (fileName: string) =>
  `${import.meta.env.VITE_API_BASE}/static/images/backgrounds/${fileName}`;

export const getAvatarUrl = (fileName: string) =>
  `${import.meta.env.VITE_API_BASE}/static/images/avatars/${fileName}`;

export const getGameUrl = (fileName: string) =>
  `${import.meta.env.VITE_API_BASE}/static/images/games/${fileName}`;
