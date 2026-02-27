const NodeCache = require('node-cache');

// Create cache instance
// stdTTL: standard time to live in seconds (default: 1 hour)
// checkperiod: period in seconds to check for expired keys (default: 10 minutes)
const cache = new NodeCache({
  stdTTL: 3600, // 1 hour
  checkperiod: 600, // 10 minutes
});

/**
 * Get value from cache
 * @param {string} key - Cache key
 * @returns {any} Cached value or undefined
 */
const get = (key) => {
  return cache.get(key);
};

/**
 * Set value in cache
 * @param {string} key - Cache key
 * @param {any} value - Value to cache
 * @param {number} ttl - Time to live in seconds (optional)
 * @returns {boolean} Success status
 */
const set = (key, value, ttl) => {
  if (ttl) {
    return cache.set(key, value, ttl);
  }
  return cache.set(key, value);
};

/**
 * Delete value from cache
 * @param {string} key - Cache key
 * @returns {number} Number of deleted entries
 */
const del = (key) => {
  return cache.del(key);
};

/**
 * Delete multiple values from cache
 * @param {string[]} keys - Array of cache keys
 * @returns {number} Number of deleted entries
 */
const delMultiple = (keys) => {
  return cache.del(keys);
};

/**
 * Clear all cache
 */
const flush = () => {
  cache.flushAll();
};

/**
 * Get cache statistics
 * @returns {object} Cache stats
 */
const getStats = () => {
  return cache.getStats();
};

/**
 * Check if key exists in cache
 * @param {string} key - Cache key
 * @returns {boolean} True if key exists
 */
const has = (key) => {
  return cache.has(key);
};

/**
 * Get all keys in cache
 * @returns {string[]} Array of cache keys
 */
const keys = () => {
  return cache.keys();
};

/**
 * Invalidate cache by pattern
 * @param {string} pattern - Pattern to match keys (e.g., 'recommendations:*')
 */
const invalidatePattern = (pattern) => {
  const allKeys = cache.keys();
  const regex = new RegExp(pattern.replace('*', '.*'));
  const keysToDelete = allKeys.filter((key) => regex.test(key));
  return cache.del(keysToDelete);
};

module.exports = {
  get,
  set,
  del,
  delMultiple,
  flush,
  getStats,
  has,
  keys,
  invalidatePattern,
};
