const CACHE_PREFIX = 'ingredient_cache_';
// const CACHE_EXPIRATION = 24 * 60 * 60 * 1000; // 24 hours

export const getCache = (key) => {
  const cacheItem = localStorage.getItem(CACHE_PREFIX + key);
  if (!cacheItem) return null;

  const { value, expiry } = JSON.parse(cacheItem);
  if (Date.now() > expiry) {
    localStorage.removeItem(CACHE_PREFIX + key);
    return null;
  }
  return value;
};

export const setCache = (key, value) => {
  const item = {
    value: value,
    // expiry: Date.now() + CACHE_EXPIRATION,
  };
  localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(item));
};