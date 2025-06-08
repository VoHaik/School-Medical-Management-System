import { useState, useEffect, useCallback, useRef } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Simple cache implementation
const cache = new Map();

export const useFetch = (url, options = {}) => {
  const { getAuthAxios } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shouldRefetch, setShouldRefetch] = useState(0);
  
  // Store the latest options in a ref to avoid unnecessary re-fetches
  const optionsRef = useRef(options);
  optionsRef.current = options;
  
  // Cache key generation
  const getCacheKey = useCallback(() => {
    const { skipCache, cacheKey } = optionsRef.current;
    if (skipCache) return null;
    return cacheKey || url;
  }, [url]);
  
  // Fetch function
  const fetchData = useCallback(async () => {
    const cacheKey = getCacheKey();
    
    // Check cache first
    if (cacheKey && cache.has(cacheKey) && !optionsRef.current.forceRefresh) {
      const cachedData = cache.get(cacheKey);
      setData(cachedData);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const axios = getAuthAxios();
      const response = await axios(url, {
        ...optionsRef.current.axiosOptions
      });
      
      const responseData = response.data;
      setData(responseData);
      
      // Cache the response if caching is enabled
      if (cacheKey && !optionsRef.current.skipCache) {
        cache.set(cacheKey, responseData);
        
        // Set cache expiry if specified
        if (optionsRef.current.cacheExpiry) {
          setTimeout(() => {
            cache.delete(cacheKey);
          }, optionsRef.current.cacheExpiry);
        }
      }
      
      setError(null);
    } catch (err) {
      setError(err);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [url, getCacheKey, getAuthAxios]);
  
  // Refetch data function
  const refetch = useCallback(() => {
    setShouldRefetch(prev => prev + 1);
  }, []);
  
  // Clear cache function
  const clearCache = useCallback(() => {
    const cacheKey = getCacheKey();
    if (cacheKey) {
      cache.delete(cacheKey);
    }
  }, [getCacheKey]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData, shouldRefetch]);
  
  return { data, loading, error, refetch, clearCache };
};