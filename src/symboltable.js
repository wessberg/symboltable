// @flow

interface Comparable {
	valueOf(): number;
}

/**
 * A Node for a RedBlack tree.
 * @author Frederik Wessberg <fwe@dlmma.com>
 * @version 1.0.0
 */
class RedBlackNode<Key:Comparable, Value> {

	/**
	 * The key of the RedBlackNode.
	 * @template Key
	 * @type {Key}
	 */
	key: Key;

	/**
	 * The value of the RedBlackNode.
	 * @template Value
	 * @type {Value}
	 */
	value: Value;

	/**
	 * The left child of the RedBlackNode.
	 * @template Key, Value
	 * @type {?RedBlackNode<Key, Value>}
	 */
	left: ?RedBlackNode<Key, Value>;

	/**
	 * The right child of the RedBlackNode.
	 * @template Key, Value
	 * @type {?RedBlackNode<Key, Value>}
	 */
	right: ?RedBlackNode<Key, Value>;

	/**
	 * The color of the parent link.
	 * @type {boolean}
	 */
	color: boolean;

	/**
	 * The subtree count of the RedBlackNode.
	 * @type {number}
	 */
	size: number;

	/**
	 * Constructs a new RedBlackNode.
	 * @template Key, Value
	 * @param {Key} key
	 * @param {Value} value
	 * @param {string} color
	 * @param {number} size
	 */
	constructor (key: Key, value: Value, color: boolean, size: number) {
		this.key = key;
		this.value = value;
		this.color = color;
		this.size = size;
	}
}

/**
 * An ordered symbol table of generic key-value pairs.
 * Based on the implementation of
 * Robert Sedgewick and Kevin Wayne.
 * @author Frederik Wessberg <fwe@dlmma.com>
 * @version 1.0.0
 * @copyright MIT
 */
export class SymbolTable<Key:Comparable, Value> {

	/** @type {boolean} */
	static get RED 		() { return true; }

	/** @type {boolean} */
	static get BLACK 	() { return false; }

	/**
	 * The root of the tree.
	 * @template Key, Value
	 * @type {?RedBlackNode<Key, Value>}
	 */
	_root: ?RedBlackNode<Key, Value>;

	/**
	 * Returns true if the given node is red, false otherwise.
	 * @template Key, Value
	 * @param   {?RedBlackNode<Key, Value>} node - the node to check.
	 * @returns {boolean}              True if the given node is red.
	 * @private
	 */
	_isNodeRed (node: ?RedBlackNode<Key, Value>): boolean {
		if (node == null) return false;
		return node.color === SymbolTable.RED;
	}

	/**
	 * Returns the number of nodes in the subtree rooted at the given node.
	 * @template Key, Value
	 * @param   {?RedBlackNode<Key, Value>} node - The node to get the size for.
	 * @returns {number}                           The number of nodes in the subtree rooted at the given node.
	 */
	_nodeSize (node: ?RedBlackNode<Key, Value>): number {
		if (node == null) return 0;
		return node.size;
	}

	/**
	 * Returns the number of key-value pairs in this symbol table.
	 * @type {number}
	 */
	get size (): number {
		return this._nodeSize(this._root);
	}

	/**
	 * Returns true if the symbol table is empty.
	 * @type {boolean}
	 */
	get isEmpty (): boolean {
		return this._root == null;
	}

	/**
	 * Returns the smallest key in the symbol table.
	 * @template Key
	 * @type     {Key}
	 * @throws   {ReferenceError} If the symbol table is empty.
	 */
	get min (): Key {
		if (this.isEmpty || this._root == null) throw new ReferenceError(`Couldn't get min() for empty collection!`);
		return this._min(this._root).key;
	}

	/**
	 * Returns the largest key in the symbol table.
	 * @template Key
	 * @type     {Key}
	 * @throws   {ReferenceError} If the symbol table is empty.
	 */
	get max (): Key {
		if (this.isEmpty || this._root == null) throw new ReferenceError(`Couldn't get max() for empty collection!`);
		return this._max(this._root).key;
	}

	/**
	 * Gets the value associated with the given key, if any.
	 * @template Key, Value
	 * @param    {Key}            key - The key to get the associated value for.
	 * @returns  {?Value}               The associated value, if any.
	 * @throws   {ReferenceError}       If no key is given.
	 */
	get (key: Key): ?Value {
		if (key == null) throw new ReferenceError("argument to get() is null");
		this._ensureKeyHasSameType(key);
		if (this.size === 0) return null;
		return this._get(this._root, key);
	}

	/**
	 * Returns true if the symbol table contains the given key.
	 * @template Key
	 * @param   {Key} key   The key to check for.
	 * @returns {boolean}   True if the key exists in the symbol table.
	 */
	contains (key: Key): boolean {
		return this.get(key) != null;
	}

	/**
	 * Inserts the specified key-value pair into the symbol table, overwriting the old
	 * value with the new value if the symbol table already contains the specified key.
	 * Deletes the specified key (and its associated value) from this symbol table
	 * if the specified value is null.
	 * @template Key, Value
	 * @param   {Key}   key      - The key to insert.
	 * @param   {Value} value    - The value to associate with the key.
	 * @returns {void}
	 * @throws  {ReferenceError}   If no key is given.
	 */
	put (key: Key, value: Value): void {
		if (key == null) throw new ReferenceError(`first argument to put() is null!`);
		this._ensureKeyHasSameType(key);

		if (value == null) {
			this.delete(key);
			return;
		}

		this._root = this._put(this._root, key, value);
		this._root.color = SymbolTable.BLACK;
	}

	/**
	 * Empties the symbol table.
	 * @returns {void}
	 */
	clear (): void {
		this._root = null;
	}

	/**
	 * Removes the specified key and its associated value from this symbol table
	 * (if the key is in this symbol table).
	 * @template Key
	 * @param    {Key} key        - The key to remove
	 * @returns  {void}
	 * @throws   {ReferenceError}   If no key is given.
	 */
	delete (key: Key): void {
		if (key == null) throw new ReferenceError(`argument to delete() is null!`);
		this._ensureKeyHasSameType(key);
		if (!this.contains(key)) return;

		if (this._root != null && !this._isNodeRed(this._root.left) && !this._isNodeRed(this._root.right)) {
			this._root.color = SymbolTable.RED;
		}

		if (this._root != null) 									this._root 				= this._delete(this._root, key);
		if (!this.isEmpty && this._root != null) 	this._root.color 	= SymbolTable.BLACK;
	}

	/**
	 * Returns all keys in the symbol table as an array.
	 * @template Key
	 * @returns  {Array<Key>} An ordered array of keys.
	 */
	get keys (): Array<Key> {
		if (this.size === 0) return [];
		return (this._toArray(this.min, this.max, "key"): Array<Key>);
	}

	/**
	 * Returns all values in the symbol table as an array.
	 * @template Value
	 * @returns  {Array<Value>} An array of values.
	 */
	get values (): Array<Value> {
		if (this.size === 0) return [];
		return (this._toArray(this.min, this.max, "value"): Array<Value>);
	}

	/**
	 * Returns all values and entries in the symbol table as an array.
	 * @template Key, Value
	 * @returns  {Array<[Value, Key]>} An ordered array of tuples of values and keys.
	 */
	get entries (): Array<[Value, Key]> {
		if (this.size === 0) return [];
		return (this._toArray(this.min, this.max): Array<[Value, Key]>);
	}

	/**
	 * Calls the given handler for all entries.
	 * @template Key, Value
	 * @param    {function(value: Value, key: Key)} handler
	 * @throws   {ReferenceError} if no handler is provided.
	 */
	forEach (handler: (value: Value, key: Key) => ?any): void {
		if (handler == null) throw new ReferenceError(`a handler must be provided to forEach()!`);
		this.entries.forEach(entry => handler(entry[0], entry[1]));
	}

	/**
	 * Gets the value for the given key.
	 * @template Key, Value
	 * @param    {RedBlackNode<Key, Value>} node
	 * @param    {Key}                      key
	 * @returns  {?Value}
	 * @private
	 */
	_get(node: ?RedBlackNode<Key, Value>, key: Key): ?Value {
		let x = node;
		while (x != null) {
			if 			(key.valueOf() < x.key.valueOf()) 	x = x.left;
			else if (key.valueOf() > x.key.valueOf()) 	x = x.right;
			else 										return x.value;
		}
		return null;
	}

	/**
	 * Inserts the key-value pair in the subtree rooted at h.
	 * @template Key, Value
	 * @param    {?RedBlackNode<Key, Value>} h
	 * @param    {Key}                       key
	 * @param    {Value}                     value
	 * @returns  {RedBlackNode<Key, Value>}
	 * @private
	 */
	_put (h: ?RedBlackNode<Key, Value>, key: Key, value: Value): RedBlackNode<Key, Value> {
		if (h == null) return new RedBlackNode(key, value, SymbolTable.RED, 1);

		if 			(key.valueOf() < h.key.valueOf()) h.left = this._put(h.left, key, value);
		else if (key.valueOf() > h.key.valueOf()) h.right = this._put(h.right, key, value);
		else																			h.value = value;

		if (this._isNodeRed(h.right) && !this._isNodeRed(h.left))												h = this._rotateLeft(h);
		if (this._isNodeRed(h.left) && h.left != null && this._isNodeRed(h.left.left)) 	h = this._rotateRight(h);
		if (this._isNodeRed(h.left) && this._isNodeRed(h.right))												this._flipColors(h);
		h.size = this._nodeSize(h.left) + this._nodeSize(h.right) + 1;

		return h;
	}

	/**
	 * Deletes the key-value pair with the minimum key rooted at h
	 * @template Key, Value
	 * @param    {?RedBlackNode<Key, Value>} h
	 * @returns  {?RedBlackNode<Key, Value>}
	 * @private
	 */
	_deleteMin(h: ?RedBlackNode<Key, Value>): ?RedBlackNode<Key, Value> {
		if (h == null || h.left == null) return null;
		if (!this._isNodeRed(h.left) && h.left != null && !this._isNodeRed(h.left.left)) {
			h = this._moveRedLeft(h);
		}

		h.left = this._deleteMin(h.left);
		return this._balance(h);
	}

	/**
	 * Deletes the key-value pair with the given key rooted at h
	 * @template Key, Value
	 * @param    {RedBlackNode<Key, Value>}   h
	 * @param    {Key}                        key
	 * @returns  {?RedBlackNode<Key, Value>}
	 * @private
	 */
	_delete (h: RedBlackNode<Key, Value>, key: Key): ?RedBlackNode<Key, Value> {
		if (key.valueOf() < h.key.valueOf()) {
			if (!this._isNodeRed(h.left) && h.left != null && !this._isNodeRed(h.left.left)) {
				h = this._moveRedLeft(h);
			}
			if (h.left != null) h.left = this._delete(h.left, key);
		} else {
			if (this._isNodeRed(h.left)) h = this._rotateRight(h);
			if (key === h.key && (h.right == null)) return null;
			if (!this._isNodeRed(h.right) && h.right != null && !this._isNodeRed(h.right.left)) {
				h = this._moveRedRight(h);
			}
			if (key === h.key && h.right != null) {
				let x = this._min(h.right);
				h.key = x.key;
				h.value = x.value;
				h.right = this._deleteMin(h.right);
			} else if (h.right != null) h.right = this._delete(h.right, key);
		}
		return this._balance(h);
	}

	/**
	 * Recursively returns the smallest key in the subtree rooted at x.
	 * @template Key, Value
	 * @param    {RedBlackNode<Key, Value>}  x
	 * @returns  {RedBlackNode.<Key, Value>}
	 * @private
	 */
	_min (x: RedBlackNode<Key, Value>): RedBlackNode<Key, Value> {
		if (x.left == null) return x;
		return this._min(x.left);
	}

	/**
	 * Recursively returns the largest key in the subtree rooted at x.
	 * @template Key, Value
	 * @param    {RedBlackNode<Key, Value>}  x
	 * @returns  {RedBlackNode.<Key, Value>}
	 * @private
	 */
	_max (x: RedBlackNode<Key, Value>): RedBlackNode<Key, Value> {
		if (x.right == null) return x;
		return this._max(x.right);
	}

	/**
	 * Makes a left-leaning link lean to the right
	 * @template Key, Value
	 * @param    {RedBlackNode<Key, Value>} h
	 * @returns  {RedBlackNode<Key, Value>}
	 * @throws   {ReferenceError}           If the left child of h is null.
	 * @private
	 */
	_rotateRight (h: RedBlackNode<Key, Value>): RedBlackNode<Key, Value> {
		let x = h.left;
		if (x == null) throw new ReferenceError(`Couldn't rotate right. Left child of h is null!`);
		h.left = x.right;
		x.right = h;
		x.color = x.right.color;
		x.right.color = SymbolTable.RED;
		x.size = h.size;
		h.size = this._nodeSize(h.left) + this._nodeSize(h.right) + 1;
		return x;
	}

	/**
	 * Makes a right-leaning link lean to the left
	 * @template Key, Value
	 * @param    {RedBlackNode<Key, Value>} h
	 * @returns  {RedBlackNode<Key, Value>}
	 * @throws   {ReferenceError}           If the right child of h is null.
	 * @private
	 */
	_rotateLeft (h: RedBlackNode<Key, Value>): RedBlackNode<Key, Value> {
		let x = h.right;
		if (x == null) throw new ReferenceError(`Couldn't rotate left. Right child of h is null!`);
		h.right = x.left;
		x.left = h;
		x.color = x.left.color;
		x.left.color = SymbolTable.RED;
		x.size = h.size;
		h.size = this._nodeSize(h.left) + this._nodeSize(h.right) + 1;
		return x;
	}

	/**
	 * Flips the colors of a node and its two children
	 * @template Key, Value
	 * @param    {RedBlackNode<Key, Value>} h
	 * @returns  {void}
	 * @private
	 */
	_flipColors (h: RedBlackNode<Key, Value>): void {
		h.color = !h.color;
		if (h.left != null)		h.left.color = !h.left.color;
		if (h.right != null)	h.right.color = !h.right.color;
	}

	/**
	 * Assuming that h is red and both h.left and h.left.left
	 * are black, make h.left or one of its children red.
	 * @template Key, Value
	 * @param    {RedBlackNode<Key, Value>} h
	 * @returns  {RedBlackNode<Key, Value>}
	 * @private
	 */
	_moveRedLeft (h: RedBlackNode<Key, Value>): RedBlackNode<Key, Value> {
		this._flipColors(h);
		if (h.right != null && this._isNodeRed(h.right.left)) {
			h.right = this._rotateRight(h.right);
			h = this._rotateLeft(h);
			this._flipColors(h);
		}
		return h;
	}

	/**
	 * Assuming that h is red and both h.right and h.right.left
	 * are black, make h.right or one of its children red.
	 * @template Key, Value
	 * @param    {RedBlackNode<Key, Value>} h
	 * @returns  {RedBlackNode<Key, Value>}
	 * @private
	 */
	_moveRedRight (h: RedBlackNode<Key, Value>): RedBlackNode<Key, Value> {
		this._flipColors(h);
		if (h.left != null && this._isNodeRed(h.left.left)) {
			h = this._rotateRight(h);
			this._flipColors(h);
		}
		return h;
	}

	/**
	 * Restore red-black tree invariant.
	 * @template Key, Value
	 * @param    {RedBlackNode<Key, Value>} h
	 * @returns  {RedBlackNode<Key, Value>}
	 * @private
	 */
	_balance (h: RedBlackNode<Key, Value>): RedBlackNode<Key, Value> {
		if (this._isNodeRed(h.right))																										h = this._rotateLeft(h);
		if (this._isNodeRed(h.left) && h.left != null && this._isNodeRed(h.left.left)) 	h = this._rotateRight(h);
		if (this._isNodeRed(h.left) && this._isNodeRed(h.right))												this._flipColors(h);

		h.size = this._nodeSize(h.left) + this._nodeSize(h.right) + 1;
		return h;
	}

	/**
	 * Recursively generates an array of all keys, values or both.
	 * @template Key
	 * @param    {Key} lo
	 * @param    {Key} hi
	 * @param    {string} [field]
	 * @returns  {Array<*>}
	 * @private
	 */
	_toArray (lo: Key, hi: Key, field?: "key"|"value"): Array<*> {
		if (lo == null) throw new ReferenceError(`first argument is null!`);
		if (hi == null) throw new ReferenceError(`second argument is null!`);
		let arr = [];
		this.__toArray(this._root, lo, hi, arr, field);
		return arr;
	}

	/**
	 * The recursive step in the __toArray() method.
	 * @template Key, Value
	 * @param    {?RedBlackNode<Key, Value>} x
	 * @param    {Key} lo
	 * @param    {Key} hi
	 * @param    {Array<*>} collection
	 * @param    {string} [field]
	 * @private
	 */
	__toArray (x: ?RedBlackNode<Key, Value>, lo: Key, hi: Key, collection: Array<*>, field?: "key"|"value"): void {
		if (x == null) 													return;
		if (lo.valueOf() < x.key.valueOf()) 		this.__toArray(x.left, lo, hi, collection, field);

		if (lo.valueOf() <= x.key.valueOf() && hi.valueOf() >= x.key.valueOf())	{
			if (field === "key") 									collection.push(x.key);
			else if (field === "value")						collection.push(x.value);
			else																	collection.push([x.value, x.key]);
		}
		if (hi.valueOf() > x.key.valueOf()) 		this.__toArray(x.right, lo, hi, collection, field);
	}

	/**
	 * Ensures that the given key is of the same type as the key of the root.
	 * @param   {any}       key - The given key to check.
	 * @returns {void}
	 * @throws  {TypeError}       If the given key isn't of the same type as the key of the root.
	 * @private
	 */
	_ensureKeyHasSameType (key: any): void {
		const message = "Given key must be of same type as existing keys";
		if (this.size === 0) return;
		if (typeof key === "string" 	&& typeof this._root.key !== "string") 			throw new TypeError(message);
		if (typeof key === "boolean" 	&& typeof this._root.key !== "boolean") 		throw new TypeError(message);
		if (typeof key === "number" 	&& typeof this._root.key !== "number") 			throw new TypeError(message);
		if (typeof key === "function" && typeof this._root.key !== "function") 		throw new TypeError(message);
		if (typeof key === "symbol" 	&& typeof this._root.key !== "symbol") 			throw new TypeError(message);
		if (Object.getPrototypeOf(key) !== Object.getPrototypeOf(this._root.key))	throw new TypeError(message);
	}
}

/**
 * An ordered symbol table of generic key-value pairs.
 * Extends the base Symbol Table with 'floor()', 'ceiling()', 'rank()',
 * 'select()', 'deleteMin()' and 'deleteMax()' operations.
 * @author Frederik Wessberg <fwe@dlmma.com>
 * @version 1.0.0
 * @copyright MIT
 */
export class FullSymbolTable<Key:Comparable, Value> extends SymbolTable<Key, Value> {

	/**
	 * Removes the smallest key and associated value from the symbol table.
	 * @throws {ReferenceError} if the symbol table is empty
	 */
	deleteMin (): void {
		if (this.isEmpty) throw new ReferenceError(`Collection is empty. No element can be deleted!`);

		if (this._root != null && !this._isNodeRed(this._root.left) && !this._isNodeRed(this._root.right)) {
			this._root.color = FullSymbolTable.RED;
		}

		this._root = this._deleteMin(this._root);
		if (!this.isEmpty && this._root != null) this._root.color = FullSymbolTable.BLACK;
	}

	/**
	 * Removes the largest key and associated value from the symbol table.
	 * @throws {ReferenceError} if the symbol table is empty
	 */
	deleteMax (): void {
		if (this.isEmpty || this._root == null) throw new ReferenceError(`Collection is empty. No element can be deleted!`);

		if (!this._isNodeRed(this._root.left) && this._root != null && !this._isNodeRed(this._root.right)) {
			this._root.color = FullSymbolTable.RED;
		}

		this._root = this._deleteMax(this._root);
		if (!this.isEmpty && this._root != null) this._root.color = FullSymbolTable.BLACK;
	}

	/**
	 * Returns the largest key in the symbol table less than or equal to the given key.
	 * @template Key
	 * @param    {Key}            key - The key for which to find the largest key that is equal to or less than it.
	 * @returns  {?Key}                 The largest key that is equal to or less than the given key, if any.
	 * @throws   {ReferenceError}       If the provided argument is null or undefined.
	 * @throws   {ReferenceError}       If the symbol table is empty.
	 */
	floor (key: Key): ?Key {
		if (key == null) 	throw new ReferenceError(`argument to floor() is null!`);
		if (this.isEmpty)	throw new ReferenceError(`called floor() on empty collection!`);
		this._ensureKeyHasSameType(key);

		let x = this._floor(this._root, key);
		if (x == null) return null;
		return x.key;
	}

	/**
	 * Returns the smallest key in the symbol table greater than or equal to the given key.
	 * @template Key
	 * @param    {Key}            key - The key for which to find the smallest key that is equal to or greater than it.
	 * @returns  {?Key}                 The smallest key that is equal to or greater than the given key, if any.
	 * @throws   {ReferenceError}       If the provided argument is null or undefined.
	 * @throws   {ReferenceError}       If the symbol table is empty.
	 */
	ceiling (key: Key): ?Key {
		if (key == null) 	throw new ReferenceError(`argument to ceiling() is null!`);
		if (this.isEmpty)	throw new ReferenceError(`called ceiling() on empty collection!`);
		this._ensureKeyHasSameType(key);

		let x = this._ceiling(this._root, key);
		if (x == null) return null;
		return x.key;
	}

	/**
	 * Returns the kth smallest key in the symbol table.
	 * For instance, given 5 as input, it will return the 5th smallest key in the symbol table.
	 * @template Key
	 * @param    {number}        k - The kth position to match with a key ordered from low to high.
	 * @returns  {Key}               The kth smallest key
	 * @throws   {RangeError}        If k is out of bounds.
	 * @throws   {ReferenceError}    If the tree doesn't contain a root.
	 * @throws   {TypeError}         If the given position isn't of type 'number'.
	 */
	select (k: number): Key {
		if (k < 0 || k >= this.size) 					throw new RangeError(`${k} is out of bounds!`);
		if (this._root == null)								throw new ReferenceError(`no root node was found in the tree. Couldn't select()`);
		if (typeof k !== "number")						throw new TypeError(`argument given to select() must be of type 'number'!`);
		let x = this._select(this._root, k);
		return x.key;
	}

	/**
	 * Returns the number of keys in the symbol table strictly less than the given key.
	 * @template Key
	 * @param    {Key} key      - The key
	 * @returns  {number}       - The number of keys in the symbol table strictly less than the given key.
	 * @throws   {ReferenceError} If no key is given.
	 */
	rank (key: Key): number {
		if (key == null) throw new ReferenceError(`argument to rank() is null!`);
		this._ensureKeyHasSameType(key);
		return this._rank(key, this._root);
	}

	/**
	 * Deletes the key-value pair with the minimum key rooted at h
	 * @template Key, Value
	 * @param    {?RedBlackNode<Key, Value>} h
	 * @returns  {?RedBlackNode<Key, Value>}
	 * @private
	 */
	_deleteMin(h: ?RedBlackNode<Key, Value>): ?RedBlackNode<Key, Value> {
		if (h == null || h.left == null) return null;
		if (!this._isNodeRed(h.left) && h.left != null && !this._isNodeRed(h.left.left)) {
			h = this._moveRedLeft(h);
		}

		h.left = this._deleteMin(h.left);
		return this._balance(h);
	}

	/**
	 * Delete the key-value pair with the maximum key rooted at h
	 * @template Key, Value
	 * @param    {?RedBlackNode<Key, Value>} h
	 * @returns  {?RedBlackNode<Key, Value>}
	 * @private
	 */
	_deleteMax (h: ?RedBlackNode<Key, Value>): ?RedBlackNode<Key, Value> {
		if (h == null) return null;

		if (this._isNodeRed(h.left)) h = this._rotateRight(h);
		if (h.right == null) return null;

		if (!this._isNodeRed(h.right) && h.right != null && !this._isNodeRed(h.right.left)) {
			h = this._moveRedRight(h);
		}

		h.right = this._deleteMax(h.right);
		return this._balance(h);
	}

	/**
	 * Gets the largest key in the subtree rooted at x less than or equal to the given key, if any.
	 * @template Key, Value
	 * @param    {?RedBlackNode<Key, Value>} x
	 * @param    {Key} key
	 * @returns  {?RedBlackNode<Key, Value>}
	 * @private
	 */
	_floor (x: ?RedBlackNode<Key, Value>, key: Key): ?RedBlackNode<Key, Value> {
		if (x == null) 			return null;
		if (key.valueOf() === x.key.valueOf()) 	return x;
		if (key.valueOf() < x.key.valueOf()) 		return this._floor(x.left, key);
		let t = this._floor(x.right, key);
		if (t != null) return t;
		return x;
	}

	/**
	 * Gets the smallest key in the subtree rooted at x greater than or equal to the given key, if any.
	 * @template Key, Value
	 * @param    {?RedBlackNode<Key, Value>} x
	 * @param    {Key} key
	 * @returns  {?RedBlackNode<Key, Value>}
	 * @private
	 */
	_ceiling (x: ?RedBlackNode<Key, Value>, key: Key): ?RedBlackNode<Key, Value> {
		if (x == null) return null;
		if (key.valueOf() === x.key.valueOf()) 	return x;
		if (key.valueOf() > x.key.valueOf()) 		return this._ceiling(x.right, key);
		let t = this._ceiling(x.left, key);
		if (t != null) return t;
		return x;
	}

	/**
	 * Returns the key of rank k in the subtree rooted at x.
	 * @template Key, Value
	 * @param    {RedBlackNode<Key, Value>} x
	 * @param    {number} k
	 * @returns  {RedBlackNode<Key, Value>}
	 * @private
	 */
	_select (x: RedBlackNode<Key, Value>, k: number): RedBlackNode<Key, Value> {
		let t = this._nodeSize(x.left);
		if (t > k && x.left != null)		return this._select(x.left, k);
		if (t < k && x.right != null) 	return this._select(x.right, k - t - 1);
		return x;
	}

	/**
	 * Returns the number of keys less than the given key in the subtree rooted at x.
	 * @template Key, Value
	 * @param    {Key} key
	 * @param    {RedBlackNode<Key, Value>} x
	 * @returns  {number}
	 * @private
	 */
	_rank (key: Key, x: ?RedBlackNode<Key, Value>): number {
		if (x == null) return 0;
		if (key.valueOf() < x.key.valueOf()) return this._rank(key, x.left);
		if (key.valueOf() > x.key.valueOf()) return 1 + this._nodeSize(x.left) + this._rank(key, x.right);
		return this._nodeSize(x.left);
	}

}