# [Serializer][01] implement of [haxe.Serializer][02]
The Serializer  class can be used to encode values and  objects into a `String`,
from which the `Unserializer` class can recreate the original representation.   
This class can be used in two ways :
 - create a  `new Serializer()`  instance,  call  its `run()`  method  with  any
argument to retrieve it `String` representation.
 - call  `Serializer.serialize()` to  obtain the serialized  representation of a
single argument.

The specification of the serialization format can be found [here][03].

**List of supported formats**
 - JavaScript native type :
   - Array
   - Boolean
   - Date
   - Null
   - Number (Zero, Integer, Float, Positive / Negative infinity, NaN)
   - Object
   - String
   - Error (Exception).
 - « haxe-type » type :
   - List (haxe.ds.List)
   - Bytes (haxe.io.Bytes)
   - IntMap (haxe.ds.IntMap)
   - ObjectMap (haxe.ds.ObjectMap)
   - StringMap (haxe.ds.StringMap)
   - Enum (experimental)
   - Class (experimental)

**List of unsupported formats**
 - custom

## Static methods
```haxe
/* Serializes `data` and returns the `String` representation. */
static serialize(data: Any): String
```
## Constructor
```haxe
new Serializer(useCache?: Boolean, useEnumIndex?: Boolean)
```
## Variables
```haxe
/* The individual cache setting for `this` Serializer instance. */
USE_CACHE: Boolean
```
```haxe
/* The individual enum index setting for `this` Serializer instance. */
USE_ENUM_INDEX: Boolean
```
```haxe
/* The individual `String` cache for `this` Serializer instance. */
StringCache: Array
```
```haxe
/* The individual `Object` cache for `this` Serializer instance. */
ObjectCache: Array
```
## Methods
```haxe
/* Serializes `data` */
run(data: Any): String
```

# Some examples of use
```js
// Classic use
Serializer.serialize("Sample"); // ouput : "y6:Sample"
```
```js
// With USE_CACHE
var s = new Serializer(true);
var obj = { x : 5, y : null };
obj.self = obj;
s.run(obj); // output : "oy1:xi5y1:yny4:selfr0g"
```
```js
// Enum serialization :
class SampleEnum extends Enum {
	static __construct__ = ['Enum1', 'Enum2'];
	static Enum1() = new this('Enum1', 0);
	static Enum2(args) {
		return new this('Enum2', 1, args);
	}
}
SampleEnum.resolve();

Serializer.serialize(SampleEnum.Enum1); // output : "wy10:SampleEnumy5:Enum1:0"

var s = new Serializer(undefined, true); // With USE_ENUM_INDEX
s.run(SampleEnum.Enum1); // output : "jy10:SampleEnum:0:0"
```

[01]: /source/index.js
[02]: https://api.haxe.org/haxe/Serializer.html
[03]: https://haxe.org/manual/std-serialization-format.html