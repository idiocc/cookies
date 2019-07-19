'use strict';
let DEPACK_EXPORT;
const http = require('http');
const _crypto = require('crypto');'use strict';
const {createHmac:g} = _crypto;
/*
 keygrip
 Copyright(c) 2011-2014 Jed Schmidt
 MIT Licensed
*/
class k {
  constructor(a, b = "sha1", c = "base64") {
    if (!(a && 0 in a)) {
      throw Error("Keys must be provided.");
    }
    this.a = b;
    this.encoding = c;
    this.keys = a;
  }
  sign(a) {
    return l(a, this.a, this.keys[0], this.encoding);
  }
  verify(a, b) {
    return -1 < this.index(a, b);
  }
  index(a, b) {
    for (let c = 0, d = this.keys.length; c < d; c++) {
      const e = l(a, this.a, this.keys[c], this.encoding);
      if (m(b, e)) {
        return c;
      }
    }
    return -1;
  }
}
function l(a, b, c, d) {
  return g(b, c).update(a).digest(d).replace(/\/|\+|=/g, e => ({"/":"_", "+":"-", "=":""})[e]);
}
function m(a, b) {
  if (null == a && null != b || null == b && null != a) {
    return !1;
  }
  if (null == a && null == b) {
    return !0;
  }
  if (a.length != b.length) {
    return !1;
  }
  for (var c = 0, d = 0; d < a.length; d++) {
    c |= a.charCodeAt(d) ^ b.charCodeAt(d);
  }
  return 0 === c;
}
;const {OutgoingMessage:n} = http;
const p = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/, q = /^(?:lax|strict)$/i;
function r(a) {
  var b = a.toString();
  a.maxAge && (a.expires = new Date(Date.now() + a.maxAge));
  a.path && (b += "; path=" + a.path);
  a.expires && (b += "; expires=" + a.expires.toUTCString());
  a.domain && (b += "; domain=" + a.domain);
  a.sameSite && (b += "; samesite=", b = !0 === a.sameSite ? b + "strict" : b + a.sameSite.toLowerCase());
  a.secure && (b += "; secure");
  a.httpOnly && (b += "; httponly");
  return b;
}
class t {
  constructor(a, b, c) {
    this.path = "/";
    this.maxAge = this.domain = this.expires = void 0;
    this.httpOnly = !0;
    this.overwrite = this.secure = this.sameSite = !1;
    if (!p.test(a)) {
      throw new TypeError("argument name is invalid");
    }
    if (b && !p.test(b)) {
      throw new TypeError("argument value is invalid");
    }
    b || (this.expires = new Date(0));
    this.name = a;
    this.value = b || "";
    for (let d in c) {
      this[d] = c[d];
    }
    if (this.path && !p.test(this.path)) {
      throw new TypeError("option path is invalid");
    }
    if (this.domain && !p.test(this.domain)) {
      throw new TypeError("option domain is invalid");
    }
    if (this.sameSite && !0 !== this.sameSite && !q.test(this.sameSite)) {
      throw new TypeError("option sameSite is invalid");
    }
  }
  toString() {
    return this.name + "=" + this.value;
  }
}
;/*
 cookies
 Copyright(c) 2014 Jed Schmidt, http://jed.is/
 Copyright(c) 2015-2016 Douglas Christopher Wilson
 MIT Licensed
*/
const u = {};
class v {
  constructor(a, b, c) {
    this.secure = void 0;
    this.request = a;
    this.a = b;
    c && (this.keys = Array.isArray(c.keys) ? new k(c.keys) : c.keys, this.secure = c.secure);
  }
  get(a, b) {
    var c = a + ".sig", d, e = b && void 0 !== b.signed ? b.signed : !!this.keys;
    if (d = this.request.headers.cookie) {
      if (d = d.match(u[a] ? u[a] : u[a] = new RegExp("(?:^|;) *" + a.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") + "=([^;]*)"))) {
        d = d[1];
        if (!b || !e) {
          return d;
        }
        if (b = this.get(c)) {
          a = a + "=" + d;
          if (!this.keys) {
            throw Error(".keys required for signed cookies");
          }
          b = this.keys.index(a, b);
          if (0 > b) {
            this.set(c, null, {path:"/", signed:!1});
          } else {
            return b && this.set(c, this.keys.sign(a), {signed:!1}), d;
          }
        }
      }
    }
  }
  set(a, b, c) {
    const {a:d, request:e} = this;
    let f = d.getHeader("Set-Cookie") || [];
    "string" == typeof f && (f = [f]);
    var h = e.protocol;
    const y = e.connection.encrypted;
    h = void 0 !== this.secure ? !!this.secure : "https" == h || y;
    a = new t(a, b, c);
    b = c && void 0 !== c.signed ? c.signed : !!this.keys;
    if (!h && c && c.secure) {
      throw Error("Cannot send secure cookie over unencrypted connection");
    }
    a.secure = h;
    c && "secure" in c && (a.secure = c.secure);
    w(f, a);
    if (c && b) {
      if (!this.keys) {
        throw Error(".keys required for signed cookies");
      }
      a.value = this.keys.sign(a.toString());
      a.name += ".sig";
      w(f, a);
    }
    (d.set ? n.prototype.setHeader : d.setHeader).call(d, "Set-Cookie", f);
    return this;
  }
}
function w(a, b) {
  if (b.overwrite) {
    for (var c = a.length - 1; 0 <= c; c--) {
      0 === a[c].indexOf(b.name + "=") && a.splice(c, 1);
    }
  }
  a.push(r(b));
}
const x = a => (b, c, d) => {
  b.cookies = c.cookies = new v(b, c, {keys:a});
  d();
};
DEPACK_EXPORT = {Cookies:v, Keygrip:k, express:x, connect:x};


module.exports = DEPACK_EXPORT