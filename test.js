// Run: "node test.js"

// include the microlru.js file
eval(String(require('fs').readFileSync('microlru.js')));

function assert(cond) {
    if (!cond) {
        console.trace("assert failed");
        throw "assert failed";
    }
}

let lru = new MicroLRU();
function getall() {
    let all = '(';
    lru.forEachMostRecent(function(value, key) {
        if (all.length > 1) all += ',';
        all += '(' + key + ' ' + value + ')';
    })
    all += '):' + lru.size + ':' + lru.capacity;
    return all;
}

function getallrev() {
    let all = '(';
    lru.forEachLeastRecent(function(value, key) {
        if (all.length > 1) all += ',';
        all += '(' + key + ' ' + value + ')';
    })
    all += '):' + lru.size + ':' + lru.capacity;
    return all;
}


lru.capacity = 3;
let evicted = '';
lru.onevict = function(key, value) {
    if (evicted.length > 0) evicted += ',';
    evicted += '(' + key + ' ' + value + ')';
}

assert(getall() == '():0:3');
lru.set(1, 1);
lru.set(2, 2);
lru.set(3, 3);
assert(getall() == '((3 3),(2 2),(1 1)):3:3');
assert(getallrev() == '((1 1),(2 2),(3 3)):3:3');
lru.set(4, 4);
assert(evicted == '(1 1)');
assert(getall() == '((4 4),(3 3),(2 2)):3:3');
assert(getallrev() == '((2 2),(3 3),(4 4)):3:3');
lru.set(2, 20);
assert(getall() == '((2 20),(4 4),(3 3)):3:3');
assert(getallrev() == '((3 3),(4 4),(2 20)):3:3');
lru.delete(4);
assert(getall() == '((2 20),(3 3)):2:3');
assert(getallrev() == '((3 3),(2 20)):2:3');
lru.delete(2);
assert(getall() == '((3 3)):1:3');
assert(getallrev() == '((3 3)):1:3');
lru.delete(1);
assert(getall() == '((3 3)):1:3');
assert(getallrev() == '((3 3)):1:3');
lru.delete(3);
assert(getall() == '():0:3');
assert(getallrev() == '():0:3');

lru.set(1, 1);
lru.set(2, 2);
lru.set(3, 3);

lru.capacity = 2;
assert(getall() == '((3 3),(2 2)):2:2');
lru.capacity = 10;
assert(getall() == '((3 3),(2 2)):2:10');
lru.capacity = -1;
assert(getall() == '((3 3)):1:1');
lru.capacity = 1;
assert(getall() == '((3 3)):1:1');
lru.capacity = 0;
assert(getall() == '((3 3)):1:1');
lru.size = 0;
assert(getall() == '():0:1');
assert(evicted == '(1 1),(1 1),(2 2),(3 3)');
console.log("PASSED");
