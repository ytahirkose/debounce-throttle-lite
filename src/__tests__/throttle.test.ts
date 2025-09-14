import { throttle } from '../throttle';

describe('throttle', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should limit function execution frequency', () => {
    const mockFn = jest.fn();
    const throttledFn = throttle(mockFn, 100);

    throttledFn();
    expect(mockFn).toHaveBeenCalledTimes(1);

    throttledFn();
    throttledFn();
    expect(mockFn).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it('should execute with leading option', () => {
    const mockFn = jest.fn();
    const throttledFn = throttle(mockFn, 100, { leading: true });

    throttledFn('first');
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('first');

    throttledFn('second');
    expect(mockFn).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenCalledWith('second');
  });

  it('should execute with trailing option', () => {
    const mockFn = jest.fn();
    const throttledFn = throttle(mockFn, 100, { trailing: true });

    throttledFn('first');
    expect(mockFn).toHaveBeenCalledTimes(1);

    throttledFn('second');
    expect(mockFn).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenCalledWith('second');
  });

  it('should not execute with both leading and trailing false', () => {
    const mockFn = jest.fn();
    const throttledFn = throttle(mockFn, 100, { 
      leading: false, 
      trailing: false 
    });

    throttledFn('first');
    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    expect(mockFn).not.toHaveBeenCalled();
  });

  it('should execute multiple times over longer periods', () => {
    const mockFn = jest.fn();
    const throttledFn = throttle(mockFn, 100);

    throttledFn('first');
    expect(mockFn).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(100);
    throttledFn('second');
    expect(mockFn).toHaveBeenCalledTimes(2);

    jest.advanceTimersByTime(100);
    throttledFn('third');
    expect(mockFn).toHaveBeenCalledTimes(3);
  });

  it('should cancel pending execution', () => {
    const mockFn = jest.fn();
    const throttledFn = throttle(mockFn, 100);

    throttledFn();
    expect(mockFn).toHaveBeenCalledTimes(1);

    throttledFn();
    throttledFn.cancel();
    jest.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should flush pending execution', () => {
    const mockFn = jest.fn();
    const throttledFn = throttle(mockFn, 100);

    throttledFn('first');
    expect(mockFn).toHaveBeenCalledTimes(1);

    throttledFn('second');
    const result = throttledFn.flush();
    
    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenCalledWith('second');
    expect(result).toBeUndefined(); // mockFn returns undefined
  });

  it('should track pending status', () => {
    const mockFn = jest.fn();
    const throttledFn = throttle(mockFn, 100, { leading: true, trailing: true });

    expect(throttledFn.pending).toBe(false);

    throttledFn();
    expect(throttledFn.pending).toBe(false); // Leading execution

    throttledFn();
    expect(throttledFn.pending).toBe(true); // Trailing execution pending

    jest.advanceTimersByTime(100);
    expect(throttledFn.pending).toBe(false);
  });

  it('should work with async functions', async () => {
    const mockAsyncFn = jest.fn().mockResolvedValue('result');
    const throttledAsyncFn = throttle(mockAsyncFn, 100);

    const promise1 = throttledAsyncFn('first');
    expect(mockAsyncFn).toHaveBeenCalledTimes(1);

    const promise2 = throttledAsyncFn('second');
    expect(mockAsyncFn).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(100);
    const result2 = await promise2;
    expect(mockAsyncFn).toHaveBeenCalledTimes(2);
    expect(result2).toBe('result');
  });

  it('should preserve this context', () => {
    const obj = {
      value: 'test',
      method: function() {
        return this.value;
      }
    };

    const throttledMethod = throttle(obj.method.bind(obj), 100);
    const result = throttledMethod();
    
    expect(result).toBe('test');
  });

  it('should handle rapid successive calls', () => {
    const mockFn = jest.fn();
    const throttledFn = throttle(mockFn, 100);

    // Rapid calls
    for (let i = 0; i < 10; i++) {
      throttledFn(`call-${i}`);
    }

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('call-0');

    jest.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenCalledWith('call-9');
  });
});
