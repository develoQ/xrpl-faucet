import { LRUCache } from "lru-cache";

export const LimitChecker = () => {
  const tokenCache = new LRUCache<string, number>({
    max: 500, // 各intervalごとで何人のユーザーを許容するか
    ttl: 1000 * 60 * 5, // intervalの時間（ミリ秒）
  });

  return {
    check: (limit: number, token: string): Promise<void> =>
      new Promise((resolve, reject) => {
        const tokenCount = tokenCache.get(token) || 0;
        const currentUsage = tokenCount + 1;
        tokenCache.set(token, currentUsage);
        const isRateLimited = currentUsage > limit;
        const headersList = new Headers();
        headersList.set("X-RateLimit-Limit", String(limit));
        headersList.set(
          "X-RateLimit-Remaining",
          isRateLimited ? "0" : String(limit - currentUsage)
        );
        return isRateLimited ? reject() : resolve();
      }),
  };
};
