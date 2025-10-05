import { useCallback } from 'react';

interface UseToolApiReturn {
  get: <T = any>(endpoint: string) => Promise<T>;
  post: <T = any>(endpoint: string, data?: any) => Promise<T>;
  put: <T = any>(endpoint: string, data?: any) => Promise<T>;
  delete: <T = any>(endpoint: string) => Promise<T>;
}

export function useToolApi(basePath: string): UseToolApiReturn {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const request = useCallback(async <T = any>(
    method: string,
    endpoint: string,
    data?: any
  ): Promise<T> => {
    const url = `${baseUrl}${basePath}${endpoint}`;
    
    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${method} ${url}`, error);
      throw error;
    }
  }, [baseUrl, basePath]);

  return {
    get: useCallback(<T = any>(endpoint: string) => request<T>('GET', endpoint), [request]),
    post: useCallback(<T = any>(endpoint: string, data?: any) => request<T>('POST', endpoint, data), [request]),
    put: useCallback(<T = any>(endpoint: string, data?: any) => request<T>('PUT', endpoint, data), [request]),
    delete: useCallback(<T = any>(endpoint: string) => request<T>('DELETE', endpoint), [request]),
  };
}