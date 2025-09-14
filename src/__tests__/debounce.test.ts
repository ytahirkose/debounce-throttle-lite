import { debounce } from '../debounce';

describe('debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should delay function execution', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn();
    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should only execute the last call', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn('first');
    debouncedFn('second');
    debouncedFn('third');

    jest.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('third');
  });

  it('should execute with leading option', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100, { leading: true, trailing: false });

    debouncedFn('first');
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('first');

    debouncedFn('second');
    jest.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledTimes(1); // Only leading call
  });

  it('should execute with trailing option', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100, { trailing: true });

    debouncedFn('first');
    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('first');
  });

  it('should not execute with both leading and trailing false', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100, { 
      leading: false, 
      trailing: false 
    });

    debouncedFn('first');
    jest.advanceTimersByTime(100);
    expect(mockFn).not.toHaveBeenCalled();
  });

  it('should respect maxWait option', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100, { maxWait: 200 });

    debouncedFn('first');
    jest.advanceTimersByTime(50);
    debouncedFn('second');
    jest.advanceTimersByTime(50);
    debouncedFn('third');
    jest.advanceTimersByTime(50);
    debouncedFn('fourth');

    // Should execute due to maxWait
    jest.advanceTimersByTime(50);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should cancel pending execution', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn();
    debouncedFn.cancel();
    jest.advanceTimersByTime(100);
    expect(mockFn).not.toHaveBeenCalled();
  });

  it('should flush pending execution', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn('test');
    const result = debouncedFn.flush();
    
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('test');
    expect(result).toBeUndefined(); // mockFn returns undefined
  });

  it('should track pending status', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);

    expect(debouncedFn.pending).toBe(false);

    debouncedFn();
    expect(debouncedFn.pending).toBe(true);

    jest.advanceTimersByTime(100);
    expect(debouncedFn.pending).toBe(false);
  });

  it('should work with async functions', () => {
    const mockAsyncFn = jest.fn().mockResolvedValue('result');
    const debouncedAsyncFn = debounce(mockAsyncFn, 100);

    debouncedAsyncFn('test');
    jest.advanceTimersByTime(100);
    
    expect(mockAsyncFn).toHaveBeenCalledWith('test');
  });

  it('should preserve this context', () => {
    const mockFn = jest.fn();
    const obj = {
      value: 'test',
      method: function() {
        mockFn();
        return this.value;
      }
    };

    const debouncedMethod = debounce(obj.method.bind(obj), 100);
    debouncedMethod();
    
    jest.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalled();
  });
});
