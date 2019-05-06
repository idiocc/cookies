import { ok, equal } from 'assert'
import Cookies from '../../src'
import Server from './server'

/**
 * A testing context for the package.
 */
export default class Context extends Server {
  /**
   * Returns the handler.
   * @returns {function(http.IncomingMessage, http.ServerResponse, Cookies)}
   */
  setCookieHandler(name, value, options) {
    return (req, res, cookies) => {
      cookies.set(name, value, options)
      res.end()
    }
  }

  /**
   * Assert on the number of times the cookie was set.
   * @param {number} num The expected count.
   */
  count(num) {
    return (res) => {
      const count = this.getCookies(res).length
      equal(count, num, 'should set cookie ' + num + ' times')
    }
  }

  /**
   * Asserts on the value of the cookie.
   * @param {string} name The name of the cookie.
   * @param {string} val The value of the cookie.
   */
  value(name, val) {
    return (res) => {
      const cookie = this.getCookieForName(res, name)
      ok(cookie, 'should set cookie ' + name)
      equal(cookie.value, val, 'should set cookie ' + name + ' to ' + val)
    }
  }

  /**
   * Asserts on the presence of an attribute in the cookie.
   * @param {string} name The name of the cookie.
   * @param {string} attrib The name of the attribute.
   */
  attribute(name, attrib) {
    return (res) => {
      const cookie = this.getCookieForName(res, name)
      ok(cookie, 'should set cookie ' + name)
      ok((attrib.toLowerCase() in cookie), 'should set cookie with attribute ' + attrib)
    }
  }

  /**
   * Asserts on the value of the cookie's attribute.
   * @param {string} name The name of the cookie.
   * @param {string} attrib The name of the attribute.
   * @param {string} value The value of the attribute.
   */
  attributeAndValue(name, attrib, value) {
    return (res) => {
      const cookie = this.getCookieForName(res, name)
      ok(cookie, 'should set cookie ' + name)
      ok((attrib.toLowerCase() in cookie), 'should set cookie with attribute ' + attrib)
      equal(cookie[attrib.toLowerCase()], value, 'should set cookie with attribute ' + attrib + ' set to ' + value)
    }
  }
  /**
   * Asserts on the absence of an attribute in the cookie.
   * @param {string} name The name of the cookie.
   * @param {string} attrib The name of the attribute.
   */
  noAttribute(name, attrib) {
    return (res) => {
      const cookie = this.getCookieForName(res, name)
      ok(cookie, 'should set cookie ' + name)
      ok(!(attrib.toLowerCase() in cookie), 'should set cookie without attribute ' + attrib)
    }
  }
  // createSecureServer(options, handler) {
  //   return createSecureServer()
  //     .on('request', this.createRequestListener(options, handler))
  // }
  /**
   * @param {http.ServerResponse} res
   */
  getCookieForName(res, name) {
    const cookies = this.getCookies(res)

    for (let i = 0; i < cookies.length; i++) {
      if (cookies[i].name === name) {
        return cookies[i]
      }
    }
  }
  /**
   * Parses the `set-cookie` header.
   * @param {string} header
   */
  parseSetCookie(header) {
    var match
    var pairs = []
    var pattern = /\s*([^=;]+)(?:=([^;]*);?|;|$)/g

    while ((match = pattern.exec(header))) {
      pairs.push({ name: match[1], value: match[2] })
    }

    const cookie = pairs.shift()

    for (let i = 0; i < pairs.length; i++) {
      match = pairs[i]
      cookie[match.name.toLowerCase()] = (match.value || true)
    }

    return cookie
  }
  /**
   * Returns the parsed `set-cookie` header from the response or an empty array.
   * @param {http.ServerResponse} res
   */
  getCookies(res) {
    const setCookies = res.getHeader('set-cookie') || []
    return setCookies.map(this.parseSetCookie)
  }

  /**
   * Creates a request listener (createRequestListener). The passed handler will be called with the cookies instance.
   * @returns {function(http.IncomingMessage, http.ServerResponse)}
   */
  c(options, handler) {
    const next = handler || options
    const opts = next === options ? undefined : options

    return (req, res) => {
      const cookies = new Cookies(req, res, opts)

      try {
        next(req, res, cookies)
      } catch (e) {
        res.statusCode = 500
        res.end(e.name + ': ' + e.message)
      }
    }
  }
  /** @param {function(http.IncomingMessage, http.ServerResponse)} test */
  async assertServer(test) {
    await this.start((req, res) => {
      test(req, res)
      res.end('OK')
    })
    await this.get()
    this.assert(200, 'OK')
  }
}

/**
 * @typedef {import('http').IncomingMessage} http.IncomingMessage
 * @typedef {import('http').ServerResponse} http.ServerResponse
 */

/** @typedef {Object<string, Test & TestSuite4>} TestSuite */
/** @typedef {Object<string, Test & TestSuite3>} TestSuite4 */
/** @typedef {Object<string, Test & TestSuite2>} TestSuite3 */
/** @typedef {Object<string, Test & TestSuite1>} TestSuite2 */
/** @typedef {Object<string, Test & TestSuite0>} TestSuite1 */
/** @typedef {Object<string, Test>} TestSuite0 */
/** @typedef {(c: Context)} Test */