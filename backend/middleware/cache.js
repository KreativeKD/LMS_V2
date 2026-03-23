/**
 * Simple In-Memory Cache (Production: Replace with Redis)
 * This provides basic caching for frequently accessed data
 * In production, replace with Redis for distributed caching
 */

const cache = new Map();
const CACHE_DURATIONS = {
    COURSES_LIST: 5 * 60 * 1000,      // 5 minutes
    COURSE_DETAILS: 10 * 60 * 1000,   // 10 minutes
    USER_DATA: 15 * 60 * 1000,        // 15 minutes
    ENROLLMENT_REQUESTS: 3 * 60 * 1000 // 3 minutes
};

/**
 * Get cached value by key
 */
const getCache = (key) => {
    const cached = cache.get(key);
    if (!cached) return null;
    
    if (Date.now() > cached.expiresAt) {
        cache.delete(key);
        return null;
    }
    
    return cached.data;
};

/**
 * Set cache value with TTL
 */
const setCache = (key, data, durationMs = CACHE_DURATIONS.COURSES_LIST) => {
    cache.set(key, {
        data,
        expiresAt: Date.now() + durationMs
    });
};

/**
 * Invalidate cache by key or pattern
 */
const invalidateCache = (keyPattern) => {
    if (typeof keyPattern === 'string' && !keyPattern.includes('*')) {
        cache.delete(keyPattern);
        return;
    }
    
    // Pattern matching for keys like "courses:*"
    const regex = new RegExp(keyPattern.replace(/\*/g, '.*'));
    for (const [key] of cache) {
        if (regex.test(key)) {
            cache.delete(key);
        }
    }
};

/**
 * Clear all cache
 */
const clearCache = () => {
    cache.clear();
};

/**
 * Middleware: Caching layer for GET requests
 */
const cacheMiddleware = (cacheDuration = CACHE_DURATIONS.COURSES_LIST) => {
    return (req, res, next) => {
        // Only cache GET requests
        if (req.method !== 'GET') {
            return next();
        }

        // Never cache authenticated responses to avoid cross-user data leaks.
        if (req.headers.authorization) {
            return next();
        }
        
        // Create cache key from URL
        const cacheKey = `${req.method}:${req.originalUrl}`;
        
        // Check cache
        const cachedResponse = getCache(cacheKey);
        if (cachedResponse) {
            res.set('X-Cache', 'HIT');
            return res.json(cachedResponse);
        }
        
        // Store original res.json
        const originalJson = res.json.bind(res);
        
        // Override res.json to cache before sending
        res.json = function(data) {
            setCache(cacheKey, data, cacheDuration);
            res.set('X-Cache', 'MISS');
            return originalJson(data);
        };
        
        next();
    };
};

module.exports = {
    getCache,
    setCache,
    invalidateCache,
    clearCache,
    cacheMiddleware,
    CACHE_DURATIONS
};
