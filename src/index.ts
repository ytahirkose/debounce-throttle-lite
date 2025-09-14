/**
 * debounce-throttle
 * 
 * Lightweight debounce and throttle utilities with TypeScript support
 * 
 * @author Yasar Tahir Kose
 * @version 1.0.0
 */

export { debounce } from './debounce';
export { throttle } from './throttle';
export type {
  DebounceOptions,
  ThrottleOptions,
  DebouncedThrottledFunction,
  AnyFunction
} from './types';

// Default export for convenience
export default {
  debounce: require('./debounce').debounce,
  throttle: require('./throttle').throttle
};
