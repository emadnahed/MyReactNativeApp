/**
 * usePerformanceMonitor Hook
 *
 * React hook for monitoring component and app performance.
 * Provides FPS tracking, memory monitoring, and render time tracking.
 *
 * @example
 * ```tsx
 * const {
 *   fps,
 *   startMonitoring,
 *   stopMonitoring,
 *   measureRender,
 *   logSummary
 * } = usePerformanceMonitor('MyComponent');
 *
 * useEffect(() => {
 *   startMonitoring();
 *   return () => stopMonitoring();
 * }, []);
 * ```
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { PerformanceMonitor } from '../utils/PerformanceMonitor';

interface UsePerformanceMonitorOptions {
  /** Automatically start monitoring on mount */
  autoStart?: boolean;
  /** Track render count */
  trackRenders?: boolean;
  /** Log performance summary on unmount */
  logOnUnmount?: boolean;
}

interface UsePerformanceMonitorResult {
  /** Current FPS */
  fps: number;
  /** Start FPS monitoring */
  startMonitoring: () => void;
  /** Stop FPS monitoring */
  stopMonitoring: () => void;
  /** Measure an async operation */
  measureAsync: <T>(name: string, fn: () => Promise<T>) => Promise<T>;
  /** Measure a sync operation */
  measureSync: <T>(name: string, fn: () => T) => T;
  /** Mark a performance point */
  mark: (name: string) => void;
  /** Measure duration between two marks */
  measure: (name: string, startMark: string, endMark: string) => void;
  /** Log memory usage */
  logMemory: () => void;
  /** Log performance summary */
  logSummary: () => void;
  /** Component render count */
  renderCount: number;
  /** Measure component render time */
  measureRender: () => void;
}

/**
 * Custom hook for performance monitoring
 */
export function usePerformanceMonitor(
  componentName: string,
  options: UsePerformanceMonitorOptions = {}
): UsePerformanceMonitorResult {
  const {
    autoStart = false,
    trackRenders = false,
    logOnUnmount = false,
  } = options;

  const [fps, setFps] = useState(0);
  const renderCountRef = useRef(0);
  const mountTimeRef = useRef<number>(Date.now());

  // Track renders
  useEffect(() => {
    if (trackRenders) {
      renderCountRef.current += 1;

      if (__DEV__) {
        console.log(`🔄 ${componentName} render #${renderCountRef.current}`);
      }
    }
  });

  // Measure component mount time
  useEffect(() => {
    const mountDuration = Date.now() - mountTimeRef.current;

    if (__DEV__ && trackRenders) {
      console.log(`⚡ ${componentName} mounted in ${mountDuration}ms`);
    }

    PerformanceMonitor.mark(`${componentName}-mount`);

    return () => {
      PerformanceMonitor.mark(`${componentName}-unmount`);
      PerformanceMonitor.measure(
        `${componentName}-lifetime`,
        `${componentName}-mount`,
        `${componentName}-unmount`
      );

      if (logOnUnmount && __DEV__) {
        console.log(`\n📊 ${componentName} Performance Summary:`);
        PerformanceMonitor.logSummary();
      }
    };
  }, [componentName, trackRenders, logOnUnmount]);

  // Start FPS monitoring
  const startMonitoring = useCallback(() => {
    PerformanceMonitor.startFPSMonitoring((currentFps) => {
      setFps(currentFps);
    });
  }, []);

  // Stop FPS monitoring
  const stopMonitoring = useCallback(() => {
    PerformanceMonitor.stopFPSMonitoring();
    setFps(0);
  }, []);

  // Auto-start monitoring if enabled
  useEffect(() => {
    if (autoStart) {
      startMonitoring();
      return () => stopMonitoring();
    }
  }, [autoStart, startMonitoring, stopMonitoring]);

  // Measure async operation
  const measureAsync = useCallback(
    async <T,>(name: string, fn: () => Promise<T>): Promise<T> => {
      return PerformanceMonitor.timeAsync(`${componentName}-${name}`, fn);
    },
    [componentName]
  );

  // Measure sync operation
  const measureSync = useCallback(
    <T,>(name: string, fn: () => T): T => {
      return PerformanceMonitor.timeSync(`${componentName}-${name}`, fn);
    },
    [componentName]
  );

  // Mark a performance point
  const mark = useCallback(
    (name: string) => {
      PerformanceMonitor.mark(`${componentName}-${name}`);
    },
    [componentName]
  );

  // Measure duration between marks
  const measure = useCallback(
    (name: string, startMark: string, endMark: string) => {
      PerformanceMonitor.measure(
        `${componentName}-${name}`,
        `${componentName}-${startMark}`,
        `${componentName}-${endMark}`
      );
    },
    [componentName]
  );

  // Log memory usage
  const logMemory = useCallback(() => {
    PerformanceMonitor.logMemoryUsage();
  }, []);

  // Log performance summary
  const logSummary = useCallback(() => {
    console.log(`\n📊 ${componentName} Performance:`);
    PerformanceMonitor.logSummary();
  }, [componentName]);

  // Measure component render
  const measureRender = useCallback(() => {
    if (__DEV__) {
      const renderTime = Date.now() - mountTimeRef.current;
      console.log(`⚡ ${componentName} render took ${renderTime}ms`);
    }
  }, [componentName]);

  return {
    fps,
    startMonitoring,
    stopMonitoring,
    measureAsync,
    measureSync,
    mark,
    measure,
    logMemory,
    logSummary,
    renderCount: renderCountRef.current,
    measureRender,
  };
}

export default usePerformanceMonitor;
