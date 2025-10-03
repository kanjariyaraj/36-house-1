import { useState, useEffect, useCallback, useRef } from 'react';
import { ApiEndpoints } from '../types';

// A simple global cache
const cache = new Map<keyof ApiEndpoints, any>();
// A global registry of mutators to update components
const mutators = new Map<keyof ApiEndpoints, Set<() => void>>();

type ApiUrl = keyof ApiEndpoints | null;

export function useApi<T extends ApiUrl>(url: T) {
    type DataType = T extends keyof ApiEndpoints ? ApiEndpoints[T] : undefined;
    
    const [data, setData] = useState<DataType | undefined>(url ? cache.get(url) : undefined);
    const [error, setError] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(!!url && !cache.has(url));

    const mounted = useRef(true);
    useEffect(() => {
        mounted.current = true;
        return () => { mounted.current = false; };
    }, []);

    const fetchData = useCallback(async () => {
        if (!url) return;

        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch(url);
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ message: `HTTP error! status: ${res.status}` }));
                throw new Error(errorData.message || `Failed to fetch ${url}`);
            }
            const fetchedData = await res.json();
            if (mounted.current) {
                cache.set(url, fetchedData);
                setData(fetchedData as DataType);
            }
        } catch (err) {
             if (mounted.current) {
                setError(err);
                console.error(`Error fetching ${url}:`, err);
            }
        } finally {
            if (mounted.current) {
                setIsLoading(false);
            }
        }
    }, [url]);

    useEffect(() => {
        if (!url) {
            setData(undefined);
            setIsLoading(false);
            return;
        }

        // Register the mutator for this URL
        if (!mutators.has(url)) {
            mutators.set(url, new Set());
        }
        const currentMutators = mutators.get(url)!;
        currentMutators.add(fetchData);

        // Fetch data if not in cache
        if (!cache.has(url)) {
            fetchData();
        } else {
             // Ensure state is up to date with cache on mount
            setData(cache.get(url));
            setIsLoading(false);
        }

        // Cleanup: unregister mutator
        return () => {
            currentMutators.delete(fetchData);
        };
    }, [url, fetchData]);

    // Mutate function for re-fetching or optimistic updates
    const mutate = useCallback((newData?: DataType | ((currentData: DataType | undefined) => DataType), revalidate = true) => {
        if (!url) return;

        let updatedData: DataType | undefined;
        if (typeof newData === 'function') {
            const updater = newData as (currentData: DataType | undefined) => DataType;
            updatedData = updater(data);
        } else {
            updatedData = newData;
        }

        if (updatedData !== undefined) {
             if (mounted.current) {
                setData(updatedData);
            }
            cache.set(url, updatedData);
        }
        
        // Re-trigger fetch for all subscribers to this endpoint
        if (revalidate) {
            const subscribers = mutators.get(url);
            if (subscribers) {
                subscribers.forEach(m => m());
            }
        }
    }, [url, data]);
    
    return { data, error, isLoading, mutate };
}
