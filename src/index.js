/*!
 * cookies
 * Copyright(c) 2014 Jed Schmidt, http://jed.is/
 * Copyright(c) 2015-2016 Douglas Christopher Wilson
 * MIT Licensed
 */

import Keygrip from './keygrip'
import { OutgoingMessage } from 'http'

const cache = {}

const deprecate = (msg) => {
  process.emitWarning(msg, 'DeprecationWarning')
}

/**
 * RegExp to match field-content in RFC 7230 sec 3.2
 *
 * field-content = field-vchar [ 1*( SP / HTAB ) field-vchar ]
 * field-vchar   = VCHAR / obs-text
 * obs-text      = %x80-FF
 */
const fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/

/**
 * RegExp to match Same-Site cookie attribute value.
 */
const sameSiteRegExp = /^(?:lax|strict)$/i

/**
 * @implements {_goa.Cookies}
 */
export default class Cookies {
  /**
   * @param {http.IncomingMessage} request
   * @param {http.ServerResponse} response
   */
  constructor(request, response, options) {
    this.secure = undefined
    this.request = request
    this.response = response
    if (options) {
      if (Array.isArray(options)) {
        // array of key strings
        deprecate('"keys" argument; provide using options {"keys": [...]}')
        this.keys = new Keygrip(options)
      } else if (options.constructor && options.constructor.name === 'Keygrip') {
        // any keygrip constructor to allow different versions
        deprecate('"keys" argument; provide using options {"keys": keygrip}')
        this.keys = options
      } else {
        this.keys = Array.isArray(options.keys) ? new Keygrip(options.keys) : options.keys
        this.secure = options.secure
      }
    }
  }
  get(name, opts) {
    var sigName = name + ".sig"
      , header, match, value, remote, data, index
      , signed = opts && opts.signed !== undefined ? opts.signed : !!this.keys

    header = this.request.headers["cookie"]
    if (!header) return

    match = header.match(getPattern(name))
    if (!match) return

    value = match[1]
    if (!opts || !signed) return value

    remote = this.get(sigName)
    if (!remote) return

    data = name + "=" + value
    if (!this.keys) throw new Error('.keys required for signed cookies')
    index = this.keys.index(data, remote)

    if (index < 0) {
      this.set(sigName, null, { path: "/", signed: false })
    } else {
      index && this.set(sigName, this.keys.sign(data), { signed: false })
      return value
    }
  }
  set(name, value, opts) {
    var res = this.response
      , req = this.request
      , headers = res.getHeader("Set-Cookie") || []
      , secure = this.secure !== undefined ? !!this.secure : req.protocol == 'https' || req.connection.encrypted
      , cookie = new Cookie(name, value, opts)
      , signed = opts && opts.signed !== undefined ? opts.signed : !!this.keys

    if (typeof headers == "string") headers = [headers]

    if (!secure && opts && opts.secure) {
      throw new Error('Cannot send secure cookie over unencrypted connection')
    }

    cookie.secure = secure
    if (opts && "secure" in opts) cookie.secure = opts.secure

    if (opts && "secureProxy" in opts) {
      deprecate('"secureProxy" option; use "secure" option, provide "secure" to constructor if needed')
      cookie.secure = opts.secureProxy
    }

    pushCookie(headers, cookie)

    if (opts && signed) {
      if (!this.keys) throw new Error('.keys required for signed cookies')
      cookie.value = this.keys.sign(cookie.toString())
      cookie.name += ".sig"
      pushCookie(headers, cookie)
    }

    var setHeader = res.set ? OutgoingMessage.prototype.setHeader : res.setHeader
    setHeader.call(res, 'Set-Cookie', headers)
    return this
  }
}

export class Cookie {
  constructor(name, value, attrs) {
    this.path = "/"
    this.expires = undefined
    this.domain = undefined
    this.httpOnly = true
    this.sameSite = false
    this.secure = false
    this.overwrite = false

    if (!fieldContentRegExp.test(name)) {
      throw new TypeError('argument name is invalid')
    }

    if (value && !fieldContentRegExp.test(value)) {
      throw new TypeError('argument value is invalid')
    }

    value || (this.expires = new Date(0))

    this.name = name
    this.value = value || ""

    for (let n in attrs) {
      this[n] = attrs[n]
    }

    if (this.path && !fieldContentRegExp.test(this.path)) {
      throw new TypeError('option path is invalid')
    }

    if (this.domain && !fieldContentRegExp.test(this.domain)) {
      throw new TypeError('option domain is invalid')
    }

    if (this.sameSite && this.sameSite !== true && !sameSiteRegExp.test(this.sameSite)) {
      throw new TypeError('option sameSite is invalid')
    }
  }
  toHeader() {
    var header = this.toString()

    if (this.maxAge) this.expires = new Date(Date.now() + this.maxAge)

    if (this.path) header += "; path=" + this.path
    if (this.expires) header += "; expires=" + this.expires.toUTCString()
    if (this.domain) header += "; domain=" + this.domain
    if (this.sameSite) header += "; samesite=" + (this.sameSite === true ? 'strict' : this.sameSite.toLowerCase())
    if (this.secure) header += "; secure"
    if (this.httpOnly) header += "; httponly"

    return header
  }
  toString() {
    return this.name + "=" + this.value
  }
  get maxage() {
    deprecate('maxage', '"maxage"; use "maxAge" instead')
    return this.maxAge
  }
  set maxage(value) {
    deprecate('maxage', '"maxage"; use "maxAge" instead')
    this.maxAge = value
  }
}

function getPattern(name) {
  if (cache[name]) return cache[name]

  return cache[name] = new RegExp(
    "(?:^|;) *" +
    name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") +
    "=([^;]*)"
  )
}

/**
 * @param {!Object} headers
 * @param {!Cookie} cookie
 */
function pushCookie(headers, cookie) {
  if (cookie.overwrite) {
    for (var i = headers.length - 1; i >= 0; i--) {
      if (headers[i].indexOf(cookie.name + '=') === 0) {
        headers.splice(i, 1)
      }
    }
  }

  headers.push(cookie.toHeader())
}

export const connect = (keys) => {
  return function(req, res, next) {
    req.cookies = res.cookies = new Cookies(req, res, {
      keys: keys,
    })

    next()
  }
}
export const express = connect


/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('http').IncomingMessage} http.IncomingMessage
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('http').ServerResponse} http.ServerResponse
 */