const { List, Bytes, IntMap, StringMap, Enum, Class } = require('haxe-type');
const Serializer = require("../source/index");

/******************************************************************************
 * JavaScript native type :                                                   *
 ******************************************************************************/

/* Array
 ******************************************************************************/
test('serialize array', function () {
	let result = Serializer.serialize([4, 5, null, null, null, 7, null, 1, 2]);
	expect(result).toStrictEqual("ai4i5u3i7ni1i2h");
});

/* Boolean
 ******************************************************************************/
test('serialize true', function () {
	let result = Serializer.serialize(true);
	expect(result).toStrictEqual("t");
});

test('serialize false', function () {
	let result = Serializer.serialize(false);
	expect(result).toStrictEqual("f");
});

/* Date
 ******************************************************************************/
test('serialize date', function () {
	let result = Serializer.serialize(new Date(1669140557415));
	expect(result).toStrictEqual("v2022-11-22 19:09:17");
});

/* Null
 ******************************************************************************/
test('serialize null', function () {
	let result = Serializer.serialize(null);
	expect(result).toStrictEqual("n");
});

/* Number (Zero, Integer, Float, Positive / Negative infinity, NaN)
 ******************************************************************************/
test('serialize zero', function () {
	let result = Serializer.serialize(0);
	expect(result).toStrictEqual("z");
});

test('serialize positive int', function () {
	let result = Serializer.serialize(53);
	expect(result).toStrictEqual("i53");
});

test('serialize negative int', function () {
	let result = Serializer.serialize(-53);
	expect(result).toStrictEqual("i-53");
});

test('serialize positive float', function () {
	let result = Serializer.serialize(53.333);
	expect(result).toStrictEqual("d53.333");
});

test('serialize negative float', function () {
	let result = Serializer.serialize(-53.333);
	expect(result).toStrictEqual("d-53.333");
});

test('serialize positive infinity', function () {
	let result = Serializer.serialize(Infinity);
	expect(result).toStrictEqual("p");
});

test('serialize negative infinity', function () {
	let result = Serializer.serialize(-Infinity);
	expect(result).toStrictEqual("m");
});

test('serialize NaN', function () {
	let result = Serializer.serialize(NaN);
	expect(result).toStrictEqual("k");
});

/* Object
 ******************************************************************************/
test('serialize object', function () {
	let test = {
		foo: "Foo",
		bar: {
			Bar: "BAR"
		},
		baz: "Baz"
	};
	let result = Serializer.serialize(test);
	expect(result).toStrictEqual("oy3:fooy3:Fooy3:baroy3:Bary3:BARgy3:bazy3:Bazg");
});

test('serialize circular reference', function () {
	let test = {};
	test.self = test;
	expect(() =>
		Serializer.serialize(test)
	).toThrow(new RangeError("Maximum call stack size exceeded"));
})

/* String
 ******************************************************************************/
test('serialize string', function () {
	let result = Serializer.serialize("Hello World !");
	expect(result).toStrictEqual("y17:Hello%20World%20!");
});

/* Error (Exception).
 ******************************************************************************/
test('serialize Error', function () {
	let result;
	try { throw "Sample error serialized" } catch (e) {
		result = Serializer.serialize(new Error(e));
	}
	expect(result).toStrictEqual("xy27:Sample%20error%20serialized");
});

/* Bonus
 ******************************************************************************/
// test('serialize complexe object', function () {
// 	let date = new Date(1669140557415),
// 		test = {
// 			// Array
// 			array: [4, 5, 1, 3],
// 			// Boolean
// 			bool: [true, false],

// 		}, result;
// 	test.self = test;
// 	result = Serializer.serialize(test);
// 	expect(result).toStrictEqual("ai1i2i3i4h");
// });

/******************************************************************************
 * « haxe-type » type :                                                       *
 ******************************************************************************/

/* List (haxe.ds.List)
 ******************************************************************************/
test('serialize list', function () {
	let result, list = new List();
	list.push(4, 5, null, null, null, 7, null, 1, 2);
	result = Serializer.serialize(list);
	expect(result).toStrictEqual("li4i5nnni7ni1i2h");
});

/* Bytes (haxe.io.Bytes)
 ******************************************************************************/
test('serialize bytes', function () {
	let byte = Bytes.ofString("Hello World!"),
		result = Serializer.serialize(byte);
	expect(result).toStrictEqual("s16:SGVsbG8gV29ybGQh");
});

/* IntMap (haxe.ds.IntMap)
 ******************************************************************************/
test('serialize intmap', function () {
	let imap = new IntMap({ 4: null, 5: 45, 6: 7 }),
		result = Serializer.serialize(imap);
	expect(result).toStrictEqual("q:4n:5i45:6i7h");
});

/* ObjectMap (haxe.ds.ObjectMap)
 ******************************************************************************/
// test('serialize objectmap', function () {
// 	// haxe :
// 	// var omap = new haxe.ds.ObjectMap();
// 	// omap.set({"foo": "Foo"}, "bar");
// 	// var s = haxe.Serializer.run(omap);
// 	// ouput : Moy3:fooy3:Foogy3:barh 
// 	let result, omap = new ObjectMap();
// 	omap.push({1: "foo", 2: "bar"}, {3: "baz"});
// 	result = Serializer.serialize(omap);
// 	expect(result).toStrictEqual("");
// });

/* StringMap (haxe.ds.StringMap)
 ******************************************************************************/
test('serialize stringmap', function () {
	let smap = new StringMap({ x: 2, k: null }),
		result = Serializer.serialize(smap);
	expect(result).toStrictEqual("by1:xi2y1:knh");
});

/* Enum (experimental)
 ******************************************************************************/
test('serialize enum', function () {
	class Foo extends Enum {
		static __construct__ = ['Bar'];
		static Bar = new this('Bar', 0);
	}
	Foo.resolve();
	let result = Serializer.serialize(Foo.Bar);
	expect(result).toStrictEqual("wy3:Fooy3:Bar:0");
});

/* Class (experimental)
 ******************************************************************************/
test('serialize class', function () {
	class Point extends Class {
		constructor(x, y) {
			super();
			this.x = x;
			this.y = y;
		}
	}
	Point.resolve();
	let result = Serializer.serialize(new Point(0, 0));
	expect(result).toStrictEqual("cy5:Pointy1:xzy1:yzg");
});