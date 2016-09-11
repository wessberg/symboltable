
import {FullSymbolTable} from "../symboltable";

describe("FullSymbolTable", function () {

	let map: FullSymbolTable<number, string>;
	let limit: number = 0;

	beforeEach(() => {
		limit = 1000;
		map = new FullSymbolTable();
		for (let i = 0; i < limit; i++) map.put(i, `string #${i}`);
	});

	context("#size", function () {

		it("returns the right size for the collection #1", function () {
			assert.equal(map.size, limit);
		});

		it("returns the right size for the collection #2", function () {
			map = new FullSymbolTable();
			assert.equal(map.size, 0);
		});

	});

	context("#isEmpty", function () {

		it("returns false if the collection isn't empty", function () {
			assert.isFalse(map.isEmpty);
		});

		it("returns true if the collection is empty", function () {
			map = new FullSymbolTable();
			assert.isTrue(map.isEmpty);
		});

	});

	context("min", function () {

		it("returns the minimum value for the collection and updates it when the the minimum value gets deleted. #1", function () {
			for (let i = 0; i < map.size; i++) {
				assert.equal(map.min, i);
				map.deleteMin();
			}
		});

		it("stays the same when other higher keys gets deleted. #1", function () {
			for (let i = 0; i < map.size; i++) {
				assert.equal(map.min, 0);
				map.deleteMax();
			}
		});

		it("throws a 'ReferenceError' if the collection is empty", function () {
			map = new FullSymbolTable();
			try {
				map.min;
				assert.fail(null, null, "should have thrown a 'ReferenceError'");
			} catch (e) {
				assert.instanceOf(e, ReferenceError);
			}
		});
	});

	context("max", function () {

		it("returns the maximum value for the collection and updates it when the the maximum value gets deleted. #1", function () {
			for (let i = map.size - 1; i >= 0; i--) {
				assert.equal(parseInt(map.max), i);
				map.deleteMax();
			}
		});

		it("stays the same when other smaller keys gets deleted. #1", function () {
			for (let i = map.size - 1; i >= 0; i--) {
				assert.equal(map.max, limit - 1);
				map.deleteMin();
			}
		});

		it("throws a 'ReferenceError' if the collection is empty", function () {
			map = new FullSymbolTable();
			try {
				map.max;
				assert.fail(null, null, "should have thrown a 'ReferenceError'");
			} catch (e) {
				assert.instanceOf(e, ReferenceError);
			}
		});
	});

	context("#contains", function () {

		it("returns false if the collection is empty", function () {
			map = new FullSymbolTable();
			assert.isFalse(map.contains(1));
		});

		it("returns false if the given key doesn't exist in the collection", function () {
			assert.isFalse(map.contains(-1));
		});

		it("returns true if the given key does exist in the collection", function () {
			assert.isTrue(map.contains(1));
		});

		it("throws a 'TypeError' if the given keys is of a different type than the existing keys", function () {
			try {
				map.contains(false);
				assert.fail(null, null, "a 'TypeError' should have been thrown!");
			} catch (e) {
				assert.instanceOf(e, TypeError);
			}
		});

	});

	context("#put", function () {

		it("should add the given value to the collection", function () {
			let oldSize = map.size;
			map.put(limit, {});
			assert.isAbove(map.size, oldSize);
		});

		it("should override existing keys with the new value if they exist", function () {
			let oldSize = map.size;
			map.put(limit - 1, "a string");
			assert.equal(map.size, oldSize);
			assert.equal(map.get(limit -1), "a string");
		});

		it("should remove an existing key from the collection if the value is null", function () {
			let oldSize = map.size;
			map.put(limit - 1, null);
			assert.isNull(map.get(limit - 1));
			assert.isBelow(map.size, oldSize);
		});

		it("throws a 'TypeError' if the given keys is of a different type than the existing keys", function () {
			try {
				map.put(false, {});
				assert.fail(null, null, "a 'TypeError' should have been thrown!");
			} catch (e) {
				assert.instanceOf(e, TypeError);
			}
		});
	});

	context("#clear", function () {

		it("should empty the collection and update the size", function () {

			map.clear();
			assert.equal(map.size, 0);

		});

	});

	context("#delete", function () {

		it("should delete the given key and associated value from the collection", function () {
			// First make sure that a value were previously associated with the given key.
			assert.isDefined(map.get(limit - 10));
			map.delete(limit - 10);
			assert.isNull(map.get(limit - 10));

		});

		it("should throw a 'ReferenceError' if the given key is null.", function () {
			try {
				map.delete(null);
				assert.fail(null, null, "should have thrown a 'ReferenceError'");
			} catch (e) {
				assert.instanceOf(e, ReferenceError);
			}
		});

		it("should throw a 'ReferenceError' if the given key is undefined.", function () {
			try {
				map.delete(undefined);
				assert.fail(null, null, "should have thrown a 'ReferenceError'");
			} catch (e) {
				assert.instanceOf(e, ReferenceError);
			}
		});

		it("should throw a 'TypeError' if the given keys is of a different type than the existing keys", function () {
			try {
				map.delete(false);
				assert.fail(null, null, "a 'TypeError' should have been thrown!");
			} catch (e) {
				assert.instanceOf(e, TypeError);
			}
		});

	});

	context("#deleteMin", function () {

		it ("should delete and update the min value", function () {
			let min = map.min;
			map.deleteMin();
			assert.isFalse(min === map.min);
		});

		it ("should throw a 'ReferenceError' if the collection is empty", function () {
			map = new FullSymbolTable();
			try {
				map.deleteMin();
				assert.fail(null, null, "a 'ReferenceError' should have been thrown!");
			} catch (e) {
				assert.instanceOf(e, ReferenceError);
			}
		});

	});

	context("#deleteMax", function () {

		it ("should delete and update the max value", function () {
			let max = map.max;
			map.deleteMax();
			assert.isFalse(max === map.max);
		});

		it ("should throw a 'ReferenceError' if the collection is empty", function () {
			map = new FullSymbolTable();
			try {
				map.deleteMax();
				assert.fail(null, null, "a 'ReferenceError' should have been thrown!");
			} catch (e) {
				assert.instanceOf(e, ReferenceError);
			}
		});

	});

	context("#get", function () {

		it("returns the right value for the key", function () {
			assert.equal(map.get(50), `string #50`);
		});

		it("doesn't affect the size of the collection", function () {
			let previousSize = map.size;
			map.get(50);
			assert.equal(map.size, previousSize);
		});

		it("throws a 'TypeError' if the given keys is of a different type than the existing keys", function () {
			try {
				map.get(false);
				assert.fail(null, null, "a 'TypeError' should have been thrown!");
			} catch (e) {
				assert.instanceOf(e, TypeError);
			}
		});
	});

	context("#ceiling", function () {

		it("returns the exact same key if given a key that exists in the tree", function () {
			assert.equal(map.ceiling(50), 50);
		});

		it("returns the key on position Math.floor(n) + 1 if given a floating point number", function () {
			assert.equal(map.ceiling(50.3), 51);
		});

		it("doesn't affect the size of the collection", function () {
			let previousSize = map.size;
			map.ceiling(50.3);
			assert.equal(map.size, previousSize);
		});

		it("throws a 'TypeError' if the given keys is of a different type than the existing keys", function () {
			try {
				map.ceiling(false);
				assert.fail(null, null, "a 'TypeError' should have been thrown!");
			} catch (e) {
				assert.instanceOf(e, TypeError);
			}
		});
	});

	context("#floor", function () {

		it("returns the exact same key if given a key that exists in the tree", function () {
			assert.equal(map.floor(50), 50);
		});

		it("returns the key on position Math.floor(n) if given a floating point number", function () {
			assert.equal(map.floor(50.3), 50);
		});

		it("doesn't affect the size of the collection", function () {
			let previousSize = map.size;
			map.floor(50.3);
			assert.equal(map.size, previousSize);
		});

		it("throws a 'TypeError' if the given keys is of a different type than the existing keys", function () {
			try {
				map.floor(false);
				assert.fail(null, null, "a 'TypeError' should have been thrown!");
			} catch (e) {
				assert.instanceOf(e, TypeError);
			}
		});

	});

	context("#select", function () {

		it("returns the 5th smallest key in the collection, if given 5", function () {
			assert.equal(map.select(5), 5);
		});

		it("returns the smallest key in the collection, if given 0", function () {
			assert.equal(map.select(0), map.min);
		});

		it("throws a 'RangeError' if the given position is less than 0", function () {
			try {
				map.select(-1);
				assert.fail(null, null, "a 'RangeError' should have been thrown!");
			} catch (e) {
				assert.instanceOf(e, RangeError);
			}
		});

		it("throws a 'RangeError' if the given position exceeds the size of the collection", function () {
			try {
				map.select(limit);
				assert.fail(null, null, "a 'RangeError' should have been thrown!");
			} catch (e) {
				assert.instanceOf(e, RangeError);
			}
		});

		it("throws a 'TypeError' if the given position is not of type 'number'.", function () {
			try {
				map.select(false);
				assert.fail(null, null, "a 'TypeError' should have been thrown!");
			} catch (e) {
				assert.instanceOf(e, TypeError);
			}
		});

	});

	context("#rank", function () {

		it("returns 5 when given 5 as key (5 being the amount of keys strictly less than the given key)", function () {
			assert.equal(map.rank(5), 5);
		});

		it("returns 0 when given 0 as key (0 being the amount of keys strictly less than the given key)", function () {
			assert.equal(map.rank(0), 0);
		});

		it("throws a 'ReferenceError' if null is given as key", function () {
			try {
				map.rank(null);
				assert.fail(null, null, "a 'ReferenceError' should have been thrown!");
			} catch (e) {
				assert.instanceOf(e, ReferenceError);
			}
		});

		it("throws a 'ReferenceError' if undefined is given as key", function () {
			try {
				map.rank(undefined);
				assert.fail(null, null, "a 'ReferenceError' should have been thrown!");
			} catch (e) {
				assert.instanceOf(e, ReferenceError);
			}
		});

		it("throws a 'TypeError' if the given keys is of a different type than the existing keys", function () {
			try {
				map.rank(false);
				assert.fail(null, null, "a 'TypeError' should have been thrown!");
			} catch (e) {
				assert.instanceOf(e, TypeError);
			}
		});

	});

	context("#keys", function () {

		it("returns an array of keys", function () {
			map.keys.forEach(key => assert.isTrue(typeof key === "number"));
		});

		it("has the correct size", function () {
			assert.equal(map.size, map.keys.length);
		});

		it("doesn't affect the size of the collection", function () {
			let previousSize = map.size;
			map.keys.forEach(() => {});
			assert.equal(map.size, previousSize);
		});

	});

	context("#values", function () {

		it("returns an array of values", function () {
			map.values.forEach(value => assert.isTrue(typeof value === "string"));
		});

		it("has the correct size", function () {
			assert.equal(map.size, map.values.length);
		});

		it("doesn't affect the size of the collection", function () {
			let previousSize = map.size;
			map.values.forEach(() => {});
			assert.equal(map.size, previousSize);
		});

		it("returns an empty array if the collection is empty", function () {
			map = new FullSymbolTable();
			assert.equal(map.values.length, 0);
		});

	});

	context("#entries", function () {

		it("returns an array of tuples of values and keys", function () {
			map.entries.forEach(entry => assert.isTrue(Array.isArray(entry) && typeof entry[0] === "string" && typeof entry[1] === "number"));
		});

		it("has the correct size", function () {
			assert.equal(map.size, map.entries.length);
		});

		it("doesn't affect the size of the collection", function () {
			let previousSize = map.size;
			map.entries.forEach(() => {});
			assert.equal(map.size, previousSize);
		});

		it("returns an empty array if the collection is empty", function () {
			map = new FullSymbolTable();
			assert.equal(map.entries.length, 0);
		});

	});

	context("#forEach", function () {

		it("calls the given handler for each entry with the value as the first argument and the key as the second", function () {
			map.forEach((value, key) => assert.isTrue(typeof value === "string" && typeof key === "number"));
		});

		it("has the correct size", function () {
			let counter = 0;
			map.forEach(() => counter++);
			assert.equal(map.size, counter);
		});

		it("doesn't affect the size of the collection", function () {
			let previousSize = map.size;
			map.forEach(() => {});
			assert.equal(map.size, previousSize);
		});

	});

});