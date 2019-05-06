import { equal, ok } from 'assert'
import erotic from 'erotic'
import Server, { Tester } from './Http'

class CookieTester extends Tester {
  constructor() {
    super()
    /** @type {CookieServer} */
    this.context = null
  }
  /**
   * Assert on the number of times the cookie was set.
   * @param {number} num The expected count.
   */
  count(num) {
    const e = erotic(true)
    this._addLink(async () => {
      const count = this.context.getCookies().length
      equal(count, num, 'should set cookie ' + num + ' times')
    }, e)
    return this
  }

  /**
   * Asserts on the value of the cookie.
   * @param {string} name The name of the cookie.
   * @param {string} val The value of the cookie.
   */
  value(name, val) {
    const e = erotic(true)
    this._addLink(() => {
      const cookie = this.context.getCookieForName(name)
      ok(cookie, 'should set cookie ' + name)
      equal(cookie.value, val, 'should set cookie ' + name + ' to ' + val)
    }, e)
    return this
  }

  /**
   * Asserts on the presence of an attribute in the cookie.
   * @param {string} name The name of the cookie.
   * @param {string} attrib The name of the attribute.
   */
  attribute(name, attrib) {
    const e = erotic(true)
    this._addLink(() => {
      const cookie = this.context.getCookieForName(name)
      ok(cookie, 'should set cookie ' + name)
      ok((attrib.toLowerCase() in cookie), 'should set cookie with attribute ' + attrib)
    }, e)
    return this
  }

  /**
   * Asserts on the value of the cookie's attribute.
   * @param {string} name The name of the cookie.
   * @param {string} attrib The name of the attribute.
   * @param {string} value The value of the attribute.
   */
  attributeAndValue(name, attrib, value) {
    const e = erotic(true)
    this._addLink(() => {
      const cookie = this.context.getCookieForName(name)
      ok(cookie, 'should set cookie ' + name)
      ok((attrib.toLowerCase() in cookie), 'should set cookie with attribute ' + attrib)
      equal(cookie[attrib.toLowerCase()], value, 'should set cookie with attribute ' + attrib + ' set to ' + value)
    }, e)
    return this
  }
  /**
   * Asserts on the absence of an attribute in the cookie.
   * @param {string} name The name of the cookie.
   * @param {string} attrib The name of the attribute.
   */
  noAttribute(name, attrib) {
    const e = erotic(true)
    this._addLink(() => {
      const cookie = this.context.getCookieForName(name)
      ok(cookie, 'should set cookie ' + name)
      ok(!(attrib.toLowerCase() in cookie), 'should set cookie without attribute ' + attrib)
    }, e)
    return this
  }
}

export default class CookieServer extends Server {
  constructor() {
    super()
    this.TesterConstructor = CookieTester
  }
  /**
   * @param {function(http.IncomingMessage, http.ServerResponse)} test
   * @param {boolean} secure
   */
  start(fn, secure) {
    const tester = /** @type {CookieTester} */ (super.start(fn, secure))
    return tester
  }
  getCookies() {
    const setCookies = /** @type {Array<string>} */ (this.response.getHeader('set-cookie')) || []
    return setCookies.map(this.parseSetCookie)
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
   * Returns the cookie record for the given name.
   * @param {string} name
   */
  getCookieForName(name) {
    const cookies = this.getCookies()

    for (let i = 0; i < cookies.length; i++) {
      if (cookies[i].name === name) {
        return cookies[i]
      }
    }
  }
}