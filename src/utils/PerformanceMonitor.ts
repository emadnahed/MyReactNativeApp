/**
 * Performance Monitor Utility
 *
 * Provides utilities for monitoring app performance including:
 * - FPS (Frames Per Second) tracking
 * - Memory usage monitoring
 * - Performance markers for specific operations
 * - Component render time tracking
 *
 * @example
 * ```tsx
 * // Track FPS
 * PerformanceMonitor.startFPSMonitoring();
 *
 * // Mark performance points
 * PerformanceMonitor.mark('api-call-start');
 * await fetchData();
 * PerformanceMonitor.mark('api-call-end');
 * PerformanceMonitor.measure('api-call', 'api-call-start', 'api-call-end');
 * ```
 */

interface PerformanceMarker {
  name: string;
  timestamp: number;
}

interface PerformanceMeasure {
  name: string;
  duration: number;
  startTime: number;
  endTime: number;
}

interface MemoryInfo {
  jsHeapSizeLimit?: number;
  totalJSHeapSize?: number;
  usedJSHeapSize?: number;
}

class PerformanceMonitorClass {
  private markers: Map<string, PerformanceMarker> = new Map();
  private measures: PerformanceMeasure[] = [];
  private fpsFrames: number[] = [];
  private lastFrameTime: number = 0;
  private fpsMonitoringActive: boolean = false;
  private fpsCallback: ((fps: number) => void) | null = null;
  private rafId: number | null = null;

  /**
   * Create a performance marker at the current timestamp
   */
  mark(name: string): void {
    const marker: PerformanceMarker = {
      name,
      timestamp: Date.now(),
    };
    this.markers.set(name, marker);

    if (__DEV__) {
      console.log(`📍 Performance Mark: ${name} at ${marker.timestamp}ms`);
    }
  }

  /**
   * Measure the duration between two markers
   */
  measure(name: string, startMark: string, endMark: string): PerformanceMeasure | null {
    const start = this.markers.get(startMark);
    const end = this.markers.get(endMark);

    if (!start || !end) {
      console.warn(`Cannot measure ${name}: Missing markers`);
      return null;
    }

    const measure: PerformanceMeasure = {
      name,
      duration: end.timestamp - start.timestamp,
      startTime: start.timestamp,
      endTime: end.timestamp,
    };

    this.measures.push(measure);

    if (__DEV__) {
      console.log(`⏱️  Performance Measure: ${name} took ${measure.duration}ms`);
    }

    return measure;
  }

  /**
   * Get all performance measures
   */
  getMeasures(): PerformanceMeasure[] {
    return [...this.measures];
  }

  /**
   * Get a specific measure by name
   */
  getMeasureByName(name: string): PerformanceMeasure | undefined {
    return this.measures.find(m => m.name === name);
  }

  /**
   * Clear all markers and measures
   */
  clearMarks(): void {
    this.markers.clear();
    this.measures = [];
    if (__DEV__) {
      console.log('🧹 Performance marks cleared');
    }
  }

  /**
   * Start monitoring FPS
   */
  startFPSMonitoring(callback?: (fps: number) => void): void {
    if (this.fpsMonitoringActive) {
      return;
    }

    this.fpsMonitoringActive = true;
    this.fpsCallback = callback || null;
    this.lastFrameTime = Date.now();
    this.fpsFrames = [];

    const measureFPS = () => {
      if (!this.fpsMonitoringActive) {
        return;
      }

      const now = Date.now();
      const delta = now - this.lastFrameTime;
      this.lastFrameTime = now;

      // Calculate FPS (frames per second)
      const fps = Math.round(1000 / delta);
      this.fpsFrames.push(fps);

      // Keep only last 60 frames (1 second at 60fps)
      if (this.fpsFrames.length > 60) {
        this.fpsFrames.shift();
      }

      // Calculate average FPS
      const avgFPS = Math.round(
        this.fpsFrames.reduce((a, b) => a + b, 0) / this.fpsFrames.length
      );

      // Call callback with average FPS
      if (this.fpsCallback) {
        this.fpsCallback(avgFPS);
      }

      // Continue monitoring
      this.rafId = requestAnimationFrame(measureFPS);
    };

    this.rafId = requestAnimationFrame(measureFPS);

    if (__DEV__) {
      console.log('🎬 FPS Monitoring started');
    }
  }

  /**
   * Stop monitoring FPS
   */
  stopFPSMonitoring(): void {
    this.fpsMonitoringActive = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.fpsFrames = [];

    if (__DEV__) {
      console.log('⏹️  FPS Monitoring stopped');
    }
  }

  /**
   * Get current FPS
   */
  getCurrentFPS(): number {
    if (this.fpsFrames.length === 0) {
      return 0;
    }
    return Math.round(
      this.fpsFrames.reduce((a, b) => a + b, 0) / this.fpsFrames.length
    );
  }

  /**
   * Get memory usage information (web only)
   */
  getMemoryInfo(): MemoryInfo | null {
    // @ts-ignore - performance.memory is not in TypeScript types
    if (typeof performance !== 'undefined' && performance.memory) {
      // @ts-ignore
      const memory = performance.memory;
      return {
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
        totalJSHeapSize: memory.totalJSHeapSize,
        usedJSHeapSize: memory.usedJSHeapSize,
      };
    }
    return null;
  }

  /**
   * Log memory usage
   */
  logMemoryUsage(): void {
    const memory = this.getMemoryInfo();
    if (memory) {
      const usedMB = (memory.usedJSHeapSize || 0) / 1024 / 1024;
      const totalMB = (memory.totalJSHeapSize || 0) / 1024 / 1024;
      const limitMB = (memory.jsHeapSizeLimit || 0) / 1024 / 1024;

      console.log('💾 Memory Usage:');
      console.log(`   Used: ${usedMB.toFixed(2)} MB`);
      console.log(`   Total: ${totalMB.toFixed(2)} MB`);
      console.log(`   Limit: ${limitMB.toFixed(2)} MB`);
    } else {
      console.log('💾 Memory usage not available on this platform');
    }
  }

  /**
   * Time a function execution
   */
  async timeAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    this.mark(`${name}-start`);
    try {
      const result = await fn();
      this.mark(`${name}-end`);
      this.measure(name, `${name}-start`, `${name}-end`);
      return result;
    } catch (error) {
      this.mark(`${name}-error`);
      this.measure(`${name}-error`, `${name}-start`, `${name}-error`);
      throw error;
    }
  }

  /**
   * Time a synchronous function execution
   */
  timeSync<T>(name: string, fn: () => T): T {
    this.mark(`${name}-start`);
    try {
      const result = fn();
      this.mark(`${name}-end`);
      this.measure(name, `${name}-start`, `${name}-end`);
      return result;
    } catch (error) {
      this.mark(`${name}-error`);
      this.measure(`${name}-error`, `${name}-start`, `${name}-error`);
      throw error;
    }
  }

  /**
   * Get a performance summary
   */
  getSummary(): string {
    const measures = this.getMeasures();
    const fps = this.getCurrentFPS();
    const memory = this.getMemoryInfo();

    let summary = '\n📊 Performance Summary\n';
    summary += '━━━━━━━━━━━━━━━━━━━━\n';

    if (fps > 0) {
      summary += `FPS: ${fps}\n`;
    }

    if (memory) {
      const usedMB = (memory.usedJSHeapSize || 0) / 1024 / 1024;
      summary += `Memory: ${usedMB.toFixed(2)} MB\n`;
    }

    if (measures.length > 0) {
      summary += '\nMeasures:\n';
      measures.forEach(m => {
        summary += `  ${m.name}: ${m.duration}ms\n`;
      });
    }

    summary += '━━━━━━━━━━━━━━━━━━━━\n';

    return summary;
  }

  /**
   * Log the performance summary
   */
  logSummary(): void {
    console.log(this.getSummary());
  }
}

// Export singleton instance
export const PerformanceMonitor = new PerformanceMonitorClass();

export default PerformanceMonitor;
