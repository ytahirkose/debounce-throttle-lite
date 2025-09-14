# debounce-throttle

[![npm version](https://badge.fury.io/js/debounce-throttle.svg)](https://badge.fury.io/js/debounce-throttle)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/debounce-throttle)](https://bundlephobia.com/package/debounce-throttle)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Lightweight debounce and throttle utilities with TypeScript support. Zero dependencies, tree-shakable, and optimized for performance.

## Features

- 🚀 **Zero Dependencies** - No external dependencies
- 📦 **Tree Shakeable** - Only import what you need
- 🔧 **TypeScript Support** - Full type definitions included
- ⚡ **High Performance** - Optimized for speed and memory usage
- 🎯 **Flexible Options** - Leading/trailing edge control
- 🔄 **Promise Support** - Works with async functions
- 🛠️ **Utility Methods** - Cancel, flush, and pending status

## Installation

```bash
npm install debounce-throttle
```

```bash
yarn add debounce-throttle
```

```bash
pnpm add debounce-throttle
```

## Quick Start

```typescript
import { debounce, throttle } from 'debounce-throttle';

// Debounce - delays execution until after wait time has passed
const debouncedSearch = debounce(searchFunction, 300);

// Throttle - limits execution to once per wait time
const throttledScroll = throttle(handleScroll, 100);
```

## API Reference

### `debounce(func, wait, options?)`

Creates a debounced function that delays invoking `func` until after `wait` milliseconds have elapsed since the last time the debounced function was invoked.

**Parameters:**
- `func` - The function to debounce
- `wait` - The number of milliseconds to delay
- `options` - Configuration options (optional)

**Options:**
- `leading` (boolean) - Execute function on the leading edge of the timeout (default: `false`)
- `trailing` (boolean) - Execute function on the trailing edge of the timeout (default: `true`)
- `maxWait` (number) - Maximum time the function is allowed to be delayed

**Returns:** A debounced function with `cancel()`, `flush()`, and `pending` properties.

### `throttle(func, wait, options?)`

Creates a throttled function that only invokes `func` at most once per every `wait` milliseconds.

**Parameters:**
- `func` - The function to throttle
- `wait` - The number of milliseconds to throttle invocations to
- `options` - Configuration options (optional)

**Options:**
- `leading` (boolean) - Execute function on the leading edge of the timeout (default: `true`)
- `trailing` (boolean) - Execute function on the trailing edge of the timeout (default: `true`)

**Returns:** A throttled function with `cancel()`, `flush()`, and `pending` properties.

## Usage Examples

### Basic Debounce

```typescript
import { debounce } from 'debounce-throttle';

// Search input example
const searchInput = document.getElementById('search');
const debouncedSearch = debounce((query: string) => {
  console.log('Searching for:', query);
  // Perform search...
}, 300);

searchInput.addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});
```

### Basic Throttle

```typescript
import { throttle } from 'debounce-throttle';

// Scroll event example
const throttledScroll = throttle(() => {
  console.log('Scrolled!');
  // Handle scroll...
}, 100);

window.addEventListener('scroll', throttledScroll);
```

### Advanced Options

```typescript
import { debounce } from 'debounce-throttle';

// Debounce with leading edge
const debouncedSave = debounce(saveData, 1000, {
  leading: true,
  trailing: false
});

// Throttle with custom options
const throttledResize = throttle(handleResize, 200, {
  leading: true,
  trailing: true
});
```

### Working with Async Functions

```typescript
import { debounce } from 'debounce-throttle';

const debouncedApiCall = debounce(async (id: string) => {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}, 500);

// Usage
const userData = await debouncedApiCall('123');
```

### Control Methods

```typescript
import { debounce } from 'debounce-throttle';

const debouncedFn = debounce(myFunction, 300);

// Check if there's a pending execution
if (debouncedFn.pending) {
  console.log('Function is waiting to execute');
}

// Cancel pending execution
debouncedFn.cancel();

// Execute immediately and cancel pending
const result = debouncedFn.flush();
```

## Real-world Examples

### Search with Debounce

```typescript
import { debounce } from 'debounce-throttle';

class SearchComponent {
  private searchInput: HTMLInputElement;
  private debouncedSearch: (query: string) => void;

  constructor() {
    this.searchInput = document.getElementById('search') as HTMLInputElement;
    this.debouncedSearch = debounce(this.performSearch.bind(this), 300);
    
    this.searchInput.addEventListener('input', (e) => {
      this.debouncedSearch((e.target as HTMLInputElement).value);
    });
  }

  private async performSearch(query: string) {
    if (!query.trim()) return;
    
    try {
      const results = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then(res => res.json());
      this.displayResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    }
  }

  private displayResults(results: any[]) {
    // Display search results
  }
}
```

### Scroll Performance with Throttle

```typescript
import { throttle } from 'debounce-throttle';

class ScrollHandler {
  private throttledScroll: () => void;
  private lastScrollY = 0;

  constructor() {
    this.throttledScroll = throttle(this.handleScroll.bind(this), 16); // ~60fps
    window.addEventListener('scroll', this.throttledScroll);
  }

  private handleScroll() {
    const currentScrollY = window.scrollY;
    
    // Show/hide header based on scroll direction
    if (currentScrollY > this.lastScrollY) {
      document.body.classList.add('header-hidden');
    } else {
      document.body.classList.remove('header-hidden');
    }
    
    this.lastScrollY = currentScrollY;
  }

  destroy() {
    this.throttledScroll.cancel();
    window.removeEventListener('scroll', this.throttledScroll);
  }
}
```

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```typescript
import { debounce, DebounceOptions } from 'debounce-throttle';

interface SearchParams {
  query: string;
  filters: string[];
}

const searchFunction = (params: SearchParams): Promise<SearchResult[]> => {
  // Search implementation
};

const options: DebounceOptions = {
  leading: true,
  trailing: false,
  maxWait: 2000
};

const debouncedSearch = debounce(searchFunction, 500, options);
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Bundle Size

- **Minified**: ~2.1 KB
- **Minified + Gzipped**: ~1.1 KB

## Performance

This library is optimized for performance with:
- Minimal memory allocations
- Efficient timer management
- Optimized function call patterns
- Tree-shaking support

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [Yasar Tahir Kose](https://github.com/yasartahirkose)

## Changelog

### 1.0.0
- Initial release
- Debounce and throttle functions
- TypeScript support
- Zero dependencies
- Tree-shaking support
