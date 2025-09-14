# debounce-throttle-lite

> Lightweight debounce and throttle utilities for JavaScript/TypeScript

[![npm version](https://img.shields.io/npm/v/debounce-throttle-lite.svg)](https://www.npmjs.com/package/debounce-throttle-lite)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/debounce-throttle-lite)](https://bundlephobia.com/package/debounce-throttle-lite)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A tiny, zero-dependency library that provides debounce and throttle functions to optimize your app's performance. Perfect for search inputs, scroll events, and API calls.

## Why This Library?

- **🚀 Zero Dependencies** - No external packages
- **📦 Tiny Size** - Only ~1KB gzipped
- **🔧 TypeScript Ready** - Full type support
- **⚡ High Performance** - Optimized for speed
- **🎯 Simple API** - Easy to use and understand

## Installation

```bash
npm install debounce-throttle-lite
```

```bash
yarn add debounce-throttle-lite
```

```bash
pnpm add debounce-throttle-lite
```

## Quick Start

```javascript
import { debounce, throttle } from 'debounce-throttle-lite';

// Debounce: Wait 300ms after user stops typing
const search = debounce((query) => {
  console.log('Searching for:', query);
}, 300);

// Throttle: Run max once every 100ms
const handleScroll = throttle(() => {
  console.log('User scrolled');
}, 100);

// Use them
search('hello world');
window.addEventListener('scroll', handleScroll);
```

## What's the Difference?

### Debounce
**"Wait until the user stops doing something"**
- Perfect for: Search inputs, form validation, API calls
- Example: User types "hello" → waits 300ms → searches

### Throttle  
**"Run at most once every X milliseconds"**
- Perfect for: Scroll events, resize events, button clicks
- Example: User scrolls → runs immediately → ignores for 100ms → runs again

## Real Examples

### React Hook
```jsx
import { debounce } from 'debounce-throttle-lite';
import { useState, useCallback } from 'react';

function SearchComponent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const search = useCallback(debounce(async (searchQuery) => {
    const response = await fetch(`/api/search?q=${searchQuery}`);
    const data = await response.json();
    setResults(data);
  }, 300), []);

  return (
    <input 
      value={query}
      onChange={(e) => {
        setQuery(e.target.value);
        search(e.target.value);
      }}
    />
  );
}
```

### Vue Composition API
```vue
<template>
  <input v-model="query" @input="handleSearch" />
</template>

<script setup>
import { ref } from 'vue';
import { debounce } from 'debounce-throttle-lite';

const query = ref('');
const results = ref([]);

const search = debounce(async (searchQuery) => {
  const response = await fetch(`/api/search?q=${searchQuery}`);
  results.value = await response.json();
}, 300);

const handleSearch = () => search(query.value);
</script>
```

### Angular Service
```typescript
import { Injectable } from '@angular/core';
import { debounce } from 'debounce-throttle-lite';

@Injectable()
export class SearchService {
  search = debounce(async (query: string) => {
    const response = await fetch(`/api/search?q=${query}`);
    return response.json();
  }, 300);
}
```

### jQuery Plugin
```javascript
import { throttle } from 'debounce-throttle-lite';

$(document).ready(function() {
  const handleScroll = throttle(() => {
    $('.scroll-indicator').text(`Scrolled: ${$(window).scrollTop()}px`);
  }, 100);
  
  $(window).on('scroll', handleScroll);
});
```

### Vanilla JavaScript
```javascript
import { debounce } from 'debounce-throttle-lite';

const searchInput = document.getElementById('search');
const searchResults = document.getElementById('results');

const performSearch = debounce(async (query) => {
  if (!query.trim()) return;
  
  const response = await fetch(`/api/search?q=${query}`);
  const results = await response.json();
  searchResults.innerHTML = results.map(r => `<div>${r.title}</div>`).join('');
}, 300);

searchInput.addEventListener('input', (e) => {
  performSearch(e.target.value);
});
```

## Advanced Usage

### Options
```javascript
// Debounce with options
const save = debounce(saveData, 1000, {
  leading: true,    // Run immediately on first call
  trailing: false   // Don't run after delay
});

// Throttle with options  
const resize = throttle(handleResize, 200, {
  leading: true,    // Run immediately
  trailing: true    // Run at the end too
});
```

### Control Functions
```javascript
const debouncedFn = debounce(myFunction, 300);

// Check if waiting to run
if (debouncedFn.pending) {
  console.log('Function is waiting...');
}

// Cancel waiting execution
debouncedFn.cancel();

// Run immediately
debouncedFn.flush();
```

### TypeScript
```typescript
import { debounce, throttle } from 'debounce-throttle-lite';

interface SearchResult {
  title: string;
  url: string;
}

const search = debounce(async (query: string): Promise<SearchResult[]> => {
  const response = await fetch(`/api/search?q=${query}`);
  return response.json();
}, 300);

// Usage
const results = await search('typescript');
```

## API Reference

### `debounce(func, wait, options?)`
- **func**: Function to debounce
- **wait**: Delay in milliseconds  
- **options**: `{ leading?: boolean, trailing?: boolean, maxWait?: number }`

### `throttle(func, wait, options?)`
- **func**: Function to throttle
- **wait**: Interval in milliseconds
- **options**: `{ leading?: boolean, trailing?: boolean }`

### Returned Function
- **`.pending`**: Boolean - is function waiting to run?
- **`.cancel()`**: Cancel pending execution
- **`.flush()`**: Run immediately and cancel pending

## Platform Support

### Frontend Frameworks
- **React** ✅ - Hooks, components, event handlers
- **Vue** ✅ - Methods, watchers, event listeners  
- **Angular** ✅ - Services, components, directives
- **Svelte** ✅ - Functions, stores, event handlers
- **Solid** ✅ - Effects, signals, event handlers

### Vanilla JavaScript
- **jQuery** ✅ - Event handlers, AJAX calls
- **Vanilla JS** ✅ - DOM events, fetch API
- **Web Components** ✅ - Custom elements, shadow DOM

### Backend & Tools
- **Node.js** ✅ - Server-side, CLI tools
- **Deno** ✅ - Modern JavaScript runtime
- **Bun** ✅ - Fast JavaScript runtime

### Build Tools
- **Webpack** ✅ - Module bundling
- **Vite** ✅ - Fast build tool
- **Rollup** ✅ - Library bundling
- **Parcel** ✅ - Zero-config bundler

## Browser Support

- Chrome 60+
- Firefox 55+ 
- Safari 12+
- Edge 79+

## License

MIT © [Yasar Tahir Kose](https://github.com/ytahirkose)

---

**Need help?** [Open an issue](https://github.com/ytahirkose/debounce-throttle-lite/issues) or [check the docs](https://github.com/ytahirkose/debounce-throttle-lite#readme)
