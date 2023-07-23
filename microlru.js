// https://github.com/tidwall/microlru
//
// Copyright 2023 Joshua J Baker. All rights reserved.
// Use of this source code is governed by an MIT-style
// license that can be found in the LICENSE file.
function MicroLRU() {
    let capacity = 100;
    let onevict;
    let map = new Map();
    let head = {};
    let tail = {};
    head.next = tail;
    tail.prev = head;
    function pop(entry) {
        entry.prev.next = entry.next;
        entry.next.prev = entry.prev;
    }
    function push(entry) {
        entry.prev = head;
        entry.next = head.next;
        head.next.prev = entry;
        head.next = entry;
    }
    function evict(size) {
        while (map.size > size) {
            let evicted = tail.prev;
            map.delete(evicted.key);
            pop(evicted);
            if (onevict) {
                onevict(evicted.key, evicted.value);
            }
        }
    }
    this.has = function(key) {
        return map.has(key);
    }
    this.peek = function(key) {
        let entry = map.get(key);
        if (entry) return entry.value;
    }
    this.set = function(key, value) {
        let entry = map.get(key);
        if (entry) {
            entry.value = value;
            pop(entry);
        } else {
            entry = { key, value };
            map.set(key, entry);
        }
        push(entry);
        evict(capacity);
    }
    this.delete = function(key) {
        let entry = map.get(key);
        if (entry) {
            pop(entry);
            map.delete(key);
        }
    }
    this.get = function(key) {
        let entry = map.get(key);
        if (entry) {
            pop(entry);
            push(entry);
            return entry.value;
        }
    }
    this.forEachMostRecent = function(callbackFn) {
        let entry = head.next;
        while (entry != tail) {
            callbackFn(entry.value, entry.key, this);
            entry = entry.next;
        }
    }
    this.forEachLeastRecent = function(callbackFn) {
        let entry = tail.prev;
        while (entry != head) {
            callbackFn(entry.value, entry.key, this);
            entry = entry.prev;
        }
    }
    this.forEach = function(callbackFn) {
        this.forEachMostRecent(callbackFn);
    }
    Object.defineProperty(this, 'capacity', {
        get() { return capacity; }, 
        set(value) {
            capacity = value <= 0 ? 1 : value;
            evict(capacity);
        }
    });
    Object.defineProperty(this, 'size', { 
        get() { return map.size; },
        set(value) { evict(value); }
    });
    Object.defineProperty(this, 'onevict', { 
        get() { return map.onevict; },
        set(value) { onevict = value; }
    });
}
