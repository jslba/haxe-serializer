const { List, Bytes, IntMap, StringMap, ObjectMap, Enum, Class } = require('haxe-type');
const BaseCode = require('haxe-basecode');

class Serializer {
	constructor(
		useCache = false,
		useEnumIndex = false
	) {
		this.StringCache = [];
		this.ObjectCache = [];
		this.USE_CACHE = useCache;
		this.USE_ENUM_INDEX = useEnumIndex;
	}

	typeof(v) {
		/* eslint-disable indent */
		switch (true) {
			case v instanceof Bytes		: return 'Bytes';
			case v instanceof Enum		: return 'Enum';
			case v instanceof Class		: return 'Object';
			default:
				let type = Object.prototype.toString.call(v);
				return type.replace(/^.*? (.*?)\]$/, '$1');
		}
		/* eslint-enable indent */
	}

	static serialize(data) {
		let _s = new Serializer();
		return _s.run(data);
	}

	run(data) {
		let type = this.typeof(data);
		/* eslint-disable indent */
		switch(type) {
			case 'Array'		: return this.serializeObject(data);
			case 'Boolean'		: return data ? 't' : 'f';
			case 'Bytes'		: return this.serializeBytes(data);
			case 'Date'			: return this.serializeDate(data);
			case 'Null'			: return 'n';
			case 'Number'		: return this.serializeNumber(data);
			case 'Object'		: return this.serializeObject(data);
			case 'String'		: return this.serializeString(data);
			case 'Enum'			: return this.serializeEnum(data);
			case 'Error'		: return `x${this.run(data.message)}`;
			default:
				throw `Unknow type ${type}`;
		}
		/* eslint-enable indent */
	}

	cache(type, v) {
		let buffer = type == "String" ? "R" : "r";
		if(this.USE_CACHE || type == "String") {
			let i = this[`${type}Cache`].indexOf(v);
			if(i > -1) {
				return buffer + i;
			} else {
				this[`${type}Cache`].push(v);
			}
		}
		return false;
	}

	serializeString(s) {
		let cached = this.cache('String', s);
		if(cached != false) {
			return cached;
		}
		s = encodeURIComponent(s);
		return `y${s.length}:${s}`;
	}

	serializeDate(d) {
		let Y = "0" + d.getFullYear(),
			M = "0" + (d.getMonth() + 1),
			D = "0" + d.getDate(),
			H = "0" + d.getHours(),
			m = "0" + d.getMinutes(),
			s = "0" + d.getSeconds();
		// eslint-disable-next-line max-len
		return `v${Y.slice(-4)}-${M.slice(-2)}-${D.slice(-2)} ${H.slice(-2)}:${m.slice(-2)}:${s.slice(-2)}`;
	}

	serializeNumber(n) {
		if(Number.isNaN(n)) {
			return "k";
		}
		if(!Number.isFinite(n)) {
			return (Math.sign(n) > 0) ? "p" : "m";
		}
		if(!Number.isSafeInteger(n)) {
			if(Number.isInteger(n)) {
				return `d${n.toExponential()}`;
			} return `d${n}`;
		}
		return (n == 0) ? 'z' : `i${n}`;
	}

	serializeObject(o, type) {
		let cached = this.cache('Object', o);
		if(cached != false) {
			return cached;
		}
		let buffer = o instanceof Class ? this.run(o.constructor.name) : "",
			consecutive_null = 0;
		for(let [k, v] of Object.entries(o)) {
			if(o instanceof Class && k == '__name__') {
				continue;
			}
			if(o instanceof ObjectMap) {}
			else if(o instanceof Array) {
				let t = this.typeof(v);
				if(t == "Null") {
					consecutive_null++;
					if((!(o instanceof List)) && ((o.length - 1) > k)) {
						continue;
					}
				}
				if(consecutive_null > 0) {
					buffer += consecutive_null > 1 ? `u${consecutive_null}` : 'n';
					consecutive_null = 0;
				}
				if(t == "Null") {
					continue;
				}
			} else {
				buffer += o instanceof IntMap ? `:${k}` : this.run(k);
			}
			buffer += this.run(v);
		}
		/* eslint-disable indent */
		switch (true) {
			case o instanceof Class		: return `c${buffer}g`;
			case o instanceof IntMap	: return `q${buffer}h`;
			case o instanceof ObjectMap	: return `M${buffer}h`;
			case o instanceof StringMap	: return `b${buffer}h`;
			case o instanceof List		: return `l${buffer}h`;
			case o instanceof Array		: return `a${buffer}h`;
			default:
				return `o${buffer}g`;
		}
		/* eslint-enable indent */
	}

	serializeEnum(e) {
		let cached = this.cache('Object', e);
		if(cached != false) {
			return cached;
		}
		let buffer = this.USE_ENUM_INDEX ? "j" : "w",
			i = 2;
		buffer += this.run(e.constructor.name);
		buffer += this.USE_ENUM_INDEX ? `:${e[1]}` : this.run(e[0]);
		buffer += `:${e.length - 2}`;
		while(i < e.length) {
			buffer += this.run(e[i++]);
		}
		return buffer;
	}

	serializeBytes(b) {
		// eslint-disable-next-line max-len
		let b64 = new BaseCode(Bytes.ofString("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:")),
			r = b64.encodeBytes(b);
		return `s${r.length}:${r}`;
	}
}

module.exports = Serializer;