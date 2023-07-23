# MicroLRU

A fast little LRU cache for Javascript.

## Example

```js
// Create an LRU cache object. The default capacity is 100 entries.
let cache = new MicroLRU();

// Change the capacity of the cache to allow for a maximum of 4 entries.
cache.capacity  = 4;

// Monitor evicted entries
cache.onevict = function(key, value) {
    console.log(key, value, '(EVICTED)');
}

// Add 5 entries
cache.set('user:746', 'Tom');
cache.set('user:827', 'Susan');
cache.set('user:345', 'Andy');
cache.set('user:291', 'Jon');
cache.set('user:671', 'Melinda'); // This call will evict Tom

// Loop through each entry in order of most to least recently used.
// Also available are "forEachMostRecent" and "forEachLeastRecent" iterators. 
cache.forEach(function(value, key) {
    console.log(key);
});

// Output:
// user:746 Tom (EVICTED)
// user:671 Melinda
// user:291 Jon
// user:345 Andy
// user:827 Susan
```

## API
```js
// Constructor
let cache = new MicroLRU();

// Methods
cache.get(key);         // Get a value and move entry to front of cache
cache.set(key, value);  // Set a key and value and move entry to front of cache
cache.delete(key);      // Delete a key and its value
cache.has(key);         // Check if a key exists
cache.peek(key);        // Get a value without moving the entry

// Iterators
cache.forEachMostRecent(callback)   // Iterate from most to least recently used
cache.forEachLeastRecent(callback)  // Iterate from least to most recently used
cache.forEach(callback)             // Same as forEachMostRecent

// Properties
cache.capacity  // Maximum number of entries before entries are evicted
cache.size      // Number of entries in cache

// Events 
cache.onevict  // Monitor evicted entries
```
