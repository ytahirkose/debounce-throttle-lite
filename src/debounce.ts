import { AnyFunction, DebounceOptions, DebouncedThrottledFunction } from './types';

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * have elapsed since the last time the debounced function was invoked.
 * 
 * @param func - The function to debounce
 * @param wait - The number of milliseconds to delay
 * @param options - Configuration options
 * @returns The debounced function
 * 
 * @example
 * ```typescript
 * const debouncedSearch = debounce(searchFunction, 300);
 * debouncedSearch('query'); // Will only execute after 300ms of inactivity
 * ```
 */
export function debounce<T extends AnyFunction>(
  func: T,
  wait: number,
  options: DebounceOptions = {}
): DebouncedThrottledFunction<T> {
  const {
    leading = false,
    trailing = true,
    maxWait
  } = options;

  let timeoutId: NodeJS.Timeout | undefined;
  let maxTimeoutId: NodeJS.Timeout | undefined;
  let lastCallTime = 0;
  let lastInvokeTime = 0;
  let lastArgs: Parameters<T> | undefined;
  let lastThis: any;
  let result: ReturnType<T> | undefined;

  function invokeFunc(time: number): ReturnType<T> | undefined {
    const args = lastArgs!;
    const thisArg = lastThis;

    lastArgs = undefined;
    lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time: number): ReturnType<T> | undefined {
    lastInvokeTime = time;
    timeoutId = setTimeout(timerExpired, wait);
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time: number): number {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;

    return maxWait ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
  }

  function shouldInvoke(time: number): boolean {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;

    return (
      lastCallTime === 0 ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
    );
  }

  function timerExpired(): ReturnType<T> | undefined {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    timeoutId = setTimeout(timerExpired, remainingWait(time));
    return undefined;
  }

  function trailingEdge(time: number): ReturnType<T> | undefined {
    timeoutId = undefined;

    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = undefined;
    lastThis = undefined;
    return result;
  }

  function cancel(): void {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    if (maxTimeoutId !== undefined) {
      clearTimeout(maxTimeoutId);
    }
    lastInvokeTime = 0;
    lastCallTime = 0;
    lastArgs = undefined;
    lastThis = undefined;
    timeoutId = undefined;
    maxTimeoutId = undefined;
  }

  function flush(): ReturnType<T> | undefined {
    return timeoutId === undefined ? result : trailingEdge(Date.now());
  }

  function debounced(this: any, ...args: Parameters<T>): ReturnType<T> | undefined {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timeoutId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxWait) {
        timeoutId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timeoutId === undefined) {
      timeoutId = setTimeout(timerExpired, wait);
    }
    return result;
  }

  debounced.cancel = cancel;
  debounced.flush = flush;
  Object.defineProperty(debounced, 'pending', {
    get: () => timeoutId !== undefined
  });

  return debounced as DebouncedThrottledFunction<T>;
}
