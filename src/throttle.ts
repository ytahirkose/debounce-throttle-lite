import { AnyFunction, ThrottleOptions, DebouncedThrottledFunction } from './types';

/**
 * Creates a throttled function that only invokes func at most once per every wait milliseconds.
 * 
 * @param func - The function to throttle
 * @param wait - The number of milliseconds to throttle invocations to
 * @param options - Configuration options
 * @returns The throttled function
 * 
 * @example
 * ```typescript
 * const throttledScroll = throttle(handleScroll, 100);
 * window.addEventListener('scroll', throttledScroll);
 * ```
 */
export function throttle<T extends AnyFunction>(
  func: T,
  wait: number,
  options: ThrottleOptions = {}
): DebouncedThrottledFunction<T> {
  const {
    leading = true,
    trailing = true
  } = options;

  let timeoutId: NodeJS.Timeout | undefined;
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
    // Don't set timeoutId here for leading execution
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time: number): number {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;

    return timeWaiting;
  }

  function shouldInvoke(time: number): boolean {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;

    return (
      lastCallTime === 0 ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      timeSinceLastInvoke >= wait
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
    lastInvokeTime = 0;
    lastCallTime = 0;
    lastArgs = undefined;
    lastThis = undefined;
    timeoutId = undefined;
  }

  function flush(): ReturnType<T> | undefined {
    return timeoutId === undefined ? result : trailingEdge(Date.now());
  }

  function throttled(this: any, ...args: Parameters<T>): ReturnType<T> | undefined {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timeoutId === undefined) {
        return leadingEdge(lastCallTime);
      }
    }
    if (timeoutId === undefined && trailing) {
      timeoutId = setTimeout(timerExpired, wait);
    }
    return result;
  }

  throttled.cancel = cancel;
  throttled.flush = flush;
  Object.defineProperty(throttled, 'pending', {
    get: () => timeoutId !== undefined
  });

  return throttled as DebouncedThrottledFunction<T>;
}
