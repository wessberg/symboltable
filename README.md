# symbol table [![NPM version][npm-image]][npm-url]
> A Generic Symbol Table implementation for JavaScript based on a Red-Black Binary Search Tree. Typed with Flow and exported as ES-modules.

## Installation
Simply do: `npm install symboltable`.

## What is it?

It is an ordered symbol table of generic key-value pairs based on a [Red-Black Binary Search Tree](https://en.wikipedia.org/wiki/Red%E2%80%93black_tree), inspired by the implementation of [Robert Sedgewick](https://www.cs.princeton.edu/~rs/) and [Kevin Wayne](https://www.cs.princeton.edu/~wayne/contact/).

You don't need a Computer Science degree to know about symbol tables. It is collections of key-value pairs.
An object literal in Javascript, for instance, is a symbol table - where only strings can be used as keys. In Python, a `Dictionary` is a Symbol table.

In ES2015, the [Map collection type](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) came to JavaScript which is an
actual, proper Symbol table where the keys can be of any type.

This is a powerful implementation which enables you to do *all* operations in *O(log(N)) time:

**Search**: *O(log(N))*

**Insert**: *O(log(N))*

**Delete**: *O(log(N))*

What this means is that you can `put`, `get` and `delete` incredibly fast for even large collections.
Because it is ordered, it also enables you to easily get the minimum and maximum values fast as well as other
cool things such as the `ceiling()`, `floor()`, `select()` and `rank()` operations which will be described in
the documentation below.

## Example

```javascript
import {SymbolTable} from "symboltable";

const map = new SymbolTable();

for (let child of Array.from(document.body.children)) {
	map.put(child.offsetTop, child);
}
// Produces a map between node positions and nodes.
```

## Changelog:

**v0.02**:

- Fixed a few typing errors.

**v0.01**:
- First release!

## Usage
Import it in your project like this:

```javascript
import {SymbolTable, FullSymbolTable} from "symboltable"; // (standard) Transpiled to ES5.
// or

import {SymbolTable, FullSymbolTable} from "symboltable/native" // Transpiled to ES5, native ES-modules.
// or

import {SymbolTable, FullSymbolTable} from "symboltable/typed" // Flow typings, ES-modules.
```

## Documentation

The Symbol Table comes in two flavors:

- `SymbolTable` - The standard version. Has the basic and most foundational features.

- `FullSymbolTable` - An extended version with the addition of `floor()`, `ceiling()`, `rank()`, `select()`, `deleteMin()` and `deleteMax()` operations.

### Types
```javascript
// All types in Javascript inherits the 'valueOf()' method from Object
// And can be extended. It is used to compare the value with other objects
// Of the same type. For instance, when comparing numbers, we know that
// 1 < 2 and 1 > 0. With custom types, we can override the 'valueOf' method
// To enable comparisons of object instances with the '<', '==' and '>' operators.
interface Comparable {
	valueOf(): number;
}
```

## SymbolTable<Key:Comparable, Value>

The standard version has the following getters and methods:

### `size`

*Returns the number of key-value pairs in this symbol table.*

**Signature:**

```javascript
get size (): number
```

**Returns**:

`number` - The size of the collection.

#### Example
```javascript
let map = new SymbolTable();
map.size; // Returns 0;
map.put("a", 0);
map.size; // Returns 1;
```

### `isEmpty`

*Returns true if the symbol table is empty.*

**Signature:**

```javascript
get isEmpty (): boolean
```

**Returns**:

`boolean` - Whether or not the symbol table is empty.

#### Example
```javascript
let map = new SymbolTable();
map.isEmpty; // Returns true;
map.put("a", 0);
map.isEmpty; // Returns false;
```

### `min`

*Returns the smallest key in the symbol table.*

**Signature:**

```javascript
get min (): Key
```

**Returns**:

`Key` - The smallest key in the collection.

**Throws**:

- `ReferenceError` - If the symbol table is empty.

#### Example
```javascript
let map = new SymbolTable();
map.put(2, "b");
map.put(1, "a");
map.min; // Returns 1;
```

### `max`

*Returns the largest key in the symbol table.*

**Signature:**

```javascript
get max (): Key
```

**Returns**:

`Key` - The largest key in the collection.

**Throws**:

- `ReferenceError` - If the symbol table is empty.

#### Example
```javascript
let map = new SymbolTable();
map.put(2, "b");
map.put(1, "a");
map.max; // Returns 2;
```

### `#get()`

*Gets the value associated with the given key, if any.*

**Signature:**

```javascript
get (key: Key): ?Value
```

**Arguments**:

- `key: Key` - The key to get the associated value for.

**Returns**:

`?Value`     - The associated value, if any.

**Throws**:

- `ReferenceError` - If the given argument is null or undefined.
- `TypeError`      - If the given key is of a different type than the existing keys.

#### Example
```javascript
let map = new SymbolTable();
map.put(2, "b");
map.put(1, "a");

map.get(2);     // returns "b";
map.get(null);  // Throws a 'ReferenceError'.
map.get(false); // Throws a 'TypeError'.
```

### `#contains()`

*Returns true if the symbol table contains the given key.*

**Signature:**

```javascript
contains (key: Key): boolean
```

**Arguments**:

- `key: Key`  - The key to check for the existence of in the collection.

**Returns**:

`boolean`     - Whether or not the key exists in the symbol table.

**Throws**:

- `ReferenceError` - If the given argument is null or undefined.
- `TypeError`      - If the given key is of a different type than the existing keys.

#### Example
```javascript
let map = new SymbolTable();
map.put(2, "b");
map.put(1, "a");

map.contains(2);     // returns true;
map.contains(3);     // returns false;
map.contains(null);  // Throws a 'ReferenceError'.
map.contains(false); // Throws a 'TypeError'.
```

### `#put()`

*Inserts the specified key-value pair into the symbol table, overwriting the old value with the new value if the symbol table already contains the specified key.
Deletes the specified key (and its associated value) from this symbol table if the specified value is null.*

**Signature:**

```javascript
put (key: Key, value: Value): void
```

**Arguments**:

- `key: Key`     - The key to insert in the symbol table.

- `value: Value` - The value to associate with the key.

**Returns**:

`void`

**Throws**:

- `ReferenceError` - If the given key is null or undefined.
- `TypeError`      - If the given key is of a different type than the existing keys.

#### Example
```javascript
let map = new SymbolTable();
map.put(2, "b"); // Puts the key 2 in the symbol table and associates it with the value 'b'.
map.put(1, "a"); // Puts the key 1 in the symbol table and associates it with the value 'a'.

map.put(2, "c"); // Updates the value associated with the key 2.
map.put(1, null); // Deletes the key-value pair associated with the key 1.

map.put("a", "d");  // Throws a 'TypeError', existing keys are of a different type.
map.put(null, "e"); // Throws a 'ReferenceError', keys can not be null or undefined.
```

### `#clear()`

*Empties the symbol table.*

**Signature:**

```javascript
clear (): void
```

**Returns**:

`void`

#### Example
```javascript
let map = new SymbolTable();
map.put(2, "b");
map.size; // Returns 1.

map.clear();
map.size; // Returns 0 - The call to clear() emptied the collection.
```

### `#delete()`

*Removes the specified key and its associated value from this symbol table (if the key is in this symbol table).*

**Signature:**

```javascript
delete (key: Key): void
```

**Arguments**:

- `key: Key`     - The key to delete from the symbol table.

**Returns**:

`void`

**Throws**:

- `ReferenceError` - If the given key is null or undefined.
- `TypeError`      - If the given key is of a different type than the existing keys.

#### Example
```javascript
let map = new SymbolTable();
map.put(2, "b");
map.put(1, "a");

map.delete(2); // Removes the key 2 and the associated value 'b' from the symbol table.

map.delete("a");    // Throws a 'TypeError', existing keys are of a different type.
map.delete(null);   // Throws a 'ReferenceError', keys can not be null or undefined.
```

### `keys`

*Returns all keys in the symbol table as an ordered array.*

**Signature:**

```javascript
get keys (): Array<Key>
```

**Returns**:

`Array<Key>` - An ordered array of keys.

#### Example
```javascript
let map = new SymbolTable();
map.put(2, "b");
map.put(1, "a");

map.keys; // Returns [1, 2]
```

### `values`

*Returns all values in the symbol table as an array.*

**Signature:**

```javascript
get values (): Array<Value>
```

**Returns**:

`Array<Value>` - An array of values.

#### Example
```javascript
let map = new SymbolTable();
map.put(2, "b");
map.put(1, "a");

map.values; // Returns ["a", "b"]
```

### `entries`

*Returns all values and entries in the symbol table as an array of tuples.*

**Signature:**

```javascript
get entries (): Array<[Value, Key]>
```

**Returns**:

`Array<[Value, Key]>` - An ordered array of tuples of values and keys.

#### Example
```javascript
let map = new SymbolTable();
map.put(2, "b");
map.put(1, "a");

map.entries; // Returns [ ["a", 1], ["b", 2] ]
```

### `#forEach()`

*Calls the given handler for all entries.*

**Signature:**

```javascript
forEach (handler: (value: Value, key: Key) => void): void
```

**Arguments**:

- `handler: (value: Value, key: Key) => void` - A callback function that will be called for each item in the collection with the value as the first argument and the key as the second.

**Returns**:

`void`

**Throws**:

- `ReferenceError` - If the given handler is not defined.

#### Example
```javascript
let map = new SymbolTable();
map.put(2, "b");
map.put(1, "a");

map.forEach((value, key) => console.log(value, key)); // Prints all values and keys out to the console.
```

## FullSymbolTable<Key:Comparable, Value>

The extended version has the following additional methods:

### `#deleteMin()`

*Removes the smallest key and associated value from the symbol table.*

**Signature:**

```javascript
deleteMin (): void
```

**Returns**:

`void`

**Throws**:

- `ReferenceError` - If the symbol table is empty.

#### Example
```javascript
let map = new FullSymbolTable();
map.put(2, "b");
map.put(1, "a");

map.deleteMin(); // Deletes the key 1 and the associated value from the symbol table.
```

### `#deleteMax()`

*Removes the largest key and associated value from the symbol table.*

**Signature:**

```javascript
deleteMax (): void
```

**Returns**:

`void`

**Throws**:

- `ReferenceError` - If the symbol table is empty.

#### Example
```javascript
let map = new FullSymbolTable();
map.put(2, "b");
map.put(1, "a");

map.deleteMax(); // Deletes the key 2 and the associated value from the symbol table.
```

### `#floor()`

*Returns the largest key in the symbol table less than or equal to the given key.*

**Signature:**

```javascript
floor (key: Key): ?Key
```

**Arguments**:

- `key: Key` - The key for which to find the largest key that is equal to or less than it.

**Returns**:

`?Key`       - The largest key that is equal to or less than the given key, if any.

**Throws**:

- `ReferenceError` - If the provided argument is null or undefined

- `ReferenceError` - If the symbol table is empty.

- `TypeError`      - If the provided key is of another type than the existing keys.

#### Example
```javascript
let map = new FullSymbolTable();
map.put(2, "b");
map.put(1, "a");

map.floor(1.8); // Returns the key 1.
map.floor(2);   // Returns the key 2.
map.floor(0.9); // Returns null, no keys are smaller than or equal to 0.9
```

### `#ceiling()`

*Returns the smallest key in the symbol table greater than or equal to the given key.*

**Signature:**

```javascript
ceiling (key: Key): ?Key
```

**Arguments**:

- `key: Key` - The key for which to find the smallest key that is equal to or greater than it.

**Returns**:

`?Key`       - The smallest key that is equal to or greater than the given key, if any.

**Throws**:

- `ReferenceError` - If the provided argument is null or undefined

- `ReferenceError` - If the symbol table is empty.

- `TypeError`      - If the provided key is of another type than the existing keys.

#### Example
```javascript
let map = new FullSymbolTable();
map.put(2, "b");
map.put(1, "a");

map.ceiling(1.8); // Returns the key 2.
map.ceiling(1);   // Returns the key 1.
map.floor(2.2);   // Returns null, no keys are equal to or greater than 2.2.
```

### `#select()`

*Returns the kth smallest key in the symbol table where k = position.
For instance, given 5 as input, it will return the 5th smallest key in the symbol table.*

**Signature:**

```javascript
select (k: number): Key
```

**Arguments**:

- `k: number`      - The kth position to match with a key ordered from low to high.

**Returns**:

`?Key`             - The kth smallest key

**Throws**:

- `RangeError`     - If k is out of bounds.

- `TypeError`      - If k is not of type 'number'.

#### Example
```javascript
let map = new FullSymbolTable();
map.put(0, "a");
map.put(1, "b");
map.put(2, "c");

map.select(1); // Returns 1, only 1 key is less than it.
```

### `#rank()`

*Returns the number of keys in the symbol table strictly less than the given key.*

**Signature:**

```javascript
rank (key: Key): number
```

**Arguments**:

- `key: Key`       - The key.

**Returns**:

`number`           - The number of keys in the symbol table strictly less than the given key.

**Throws**:

- `ReferenceError` - If the provided key is null or undefined.

- `TypeError`      - If the provided key is not of the same type as any existing keys.

#### Example
```javascript
let map = new FullSymbolTable();
map.put(0, "a");
map.put(1, "b");
map.put(2, "c");

map.rank(2); // Returns 2, only 0 and 1 is strictly less than the given key.
```


[npm-url]: https://npmjs.org/package/agentdetection
[npm-image]: https://badge.fury.io/js/agentdetection.svg
