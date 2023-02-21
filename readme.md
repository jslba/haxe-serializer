# [Serializer][index] implement of [haxe.Serializer][02]

![npm](https://img.shields.io/npm/v/haxe-serializer?color=blue&style=flat)
![tests](https://img.shields.io/static/v1?label=tests&message=23%20passed&color=brightgreen&style=flat)
![GitHub](https://img.shields.io/github/license/jslba/haxe-serializer?style=flat)

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
   - StringMap (haxe.ds.StringMap)
   - Enum (experimental)
   - Class (experimental)

**List of unsupported formats**
 - ObjectMap (haxe.ds.ObjectMap)
 - custom

> **Note**   
> If you are looking  for how to  use it, you  can look at some  examples in the
> [unit tests][unittests].

## Constructor

```hx
new Serializer(?useCache: Boolean = false, ?useEnumIndex: Boolean = false)
```

## Variables

```hx
// cache setting for `this` Serializer instance.
public USE_CACHE: Boolean
```

```hx
// enum index setting for `this` Serializer instance.
USE_ENUM_INDEX: Boolean
```

```hx
// `String` cache for `this` Serializer instance.
StringCache: Array
```

```hx
// `Object` cache for `this` Serializer instance.
ObjectCache: Array
```

## Methods

```hx
// Serializes `data` and returns the `String` representation.
static serialize(data: Mixed): String
```

```hx
// return serialized `data`
public run(data: Mixed): String
```

```hx
// return a string representation of `v` type (internal function)
public typeof(v: Mixed): String
```

```hx
public cache(type: String, v: Mixed): String | false
```

```hx
// return a string representation of `s` (internal function)
public serializeString(s: String): String
```

```hx
// return a string representation of `d` (internal function)
public serializeDate(d: Date): String
```

```hx
// return a string representation of `n` (internal function)
public serializeNumber(n: Int): String
```

```hx
// return a string representation of `o` according to `type` (internal function)
public serializeObject(o: Object, type: String): String
```

```hx
// return a string representation of `e` (internal function)
public serializeEnum(e: Enum): String
```

```hx
// return a string representation of `b` (internal function)
public serializeBytes(b: Bytes): String
```

[index]: /source/index.js
[unittests]: /test/by_serialize.test.js
[02]: https://api.haxe.org/haxe/Serializer.html
[03]: https://haxe.org/manual/std-serialization-format.html