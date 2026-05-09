const isDev = import.meta.env.DEV;

export const logger = {
  error: (message: string, ...args: unknown[]) => {
    if (isDev) {
      console.error(`[Plot Error] ${message}`, ...args);
    }
    // In production, could send to Sentry/LogRocket here
  },
  warn: (message: string, ...args: unknown[]) => {
    if (isDev) console.warn(`[Plot Warn] ${message}`, ...args);
  },
  info: (message: string, ...args: unknown[]) => {
    if (isDev) console.info(`[Plot Info] ${message}`, ...args);
  },
};
