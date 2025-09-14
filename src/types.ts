/**
 * Options for debounce function
 */
export interface DebounceOptions {
  /** Execute function on the leading edge of the timeout */
  leading?: boolean;
  /** Execute function on the trailing edge of the timeout */
  trailing?: boolean;
  /** Maximum time the function is allowed to be delayed */
  maxWait?: number;
}

/**
 * Options for throttle function
 */
export interface ThrottleOptions {
  /** Execute function on the leading edge of the timeout */
  leading?: boolean;
  /** Execute function on the trailing edge of the timeout */
  trailing?: boolean;
}

/**
 * Return type for debounce and throttle functions
 */
export interface DebouncedThrottledFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): ReturnType<T> | undefined;
  /** Cancel the pending execution */
  cancel(): void;
  /** Execute the function immediately and cancel any pending execution */
  flush(): ReturnType<T> | undefined;
  /** Check if there is a pending execution */
  readonly pending: boolean;
}

/**
 * Generic function type
 */
export type AnyFunction = (...args: any[]) => any;
