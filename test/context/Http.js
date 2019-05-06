import { equal } from 'assert'
import { createServer } from 'http'
import aqt from '@rqt/aqt'
import { createServer as createSecureServer } from 'https'
import { readFileSync } from 'fs'
import erotic from 'erotic'

const cert = readFileSync('test/fixture/server.crt', 'ascii')
const key = readFileSync('test/fixture/server.key', 'ascii')

export class Tester extends Promise {
  constructor() {
    super(() => {})
    /**
     * After the request listener is called, the response will be set to the server response which comes as the second argument to the request lister callback.
     * @type {http.ServerResponse}
     */
    this.response = null
    /**
     * The HTTP(S) server will be set on the tester after the `start` method is called.
     * @type {http.Server}
     */
    this.server = null
    /**
     * The headers to send with the request, must be set before the `get` method is called.
     * @type {http.OutgoingHttpHeaders}
     */
    this.headers = {}

    /**
     * @private
     */
    this._chain = Promise.resolve(true)
  }
  /**
   * Adds the action to the list.
   * @private
   */
  _addLink(fn, e) {
    this._chain = this._chain.then(async (res) => {
      if (res === false) return
      try {
        return await fn()
      } catch (err) {
        if (e) throw e(err)
        throw err
      }
    })
  }
  then(ok, notOk) {
    return this._chain.then(() => {
      ok()
    }, (err) => {
      notOk(err)
    })
  }
  /**
   * Navigate to the path and return the result.
   * @param {string} path The path to navigate, empty by default.
   */
  get(path = '') {
    this._addLink(async () => {
      const { statusCode, body, headers } = await aqt(`${this.url}${path}`, {
        headers: this.headers,
      })
      this.statusCode = statusCode
      this.body = body
      this.headers = headers
      this.response.headers = headers
      return { statusCode, body, headers }
    })
    return this
  }
  /**
   * Assert on the status code and body when a number is given.
   * Assert on the header when the string is given. If the second arg is null, asserts on the absence of the header.
   * @param {number|string|function(http.ServerResponse)} code The number of the status code, or name of the header, or the custom assertion function.
   * @param {String} message The body or header value (or null for no header).
   */
  assert(code, message) {
    const e = erotic(true)
    this._addLink(() => {
      if (typeof code == 'function') {
        code(this.response)
        return
      }
      if (typeof code == 'string' && message) {
        equal(this.headers[code.toLowerCase()], message)
        return
      } else if (typeof code == 'string' && message === null) {
        const v = this.headers[code.toLowerCase()]
        if (v)
          throw new Error(`The response had header ${code}: ${v}`)
        return
      }
      try {
        equal(this.statusCode, code)
      } catch (err) {
        err.message = err.message + ' ' + this.body || ''
        throw err
      }
      if (message) equal(this.body, message)
    }, e)
    return this
  }
  /**
   * Sets the value for the header in the upcoming request.
   * @param {string} header The name of the header to set.
   * @param {string} value The value to set.
   */
  set(header, value) {
    this.headers[header] = value
    return this
  }
}

export default class Server {
  constructor() {
    /**
     * The constructor for the tester that will be returned by the `start` method. Additional assertions can be implemented by extending the `Tester` class that comes with the server.
     */
    this.TesterConstructor = Tester
    /**
     * The created server.
     * @type {http.Server}
     */
    this.server = null
    /**
     * After the request listener is called, the response will be set to the server response which comes as the second argument to the request lister callback.
     * @type {http.ServerResponse}
     */
    this.response = null
  }
  /**
   * Creates a server.
   * @param {function(http.IncomingMessage, http.ServerResponse)} fn The server callback. If it does not throw an error, the 200 status code is set.
   * @param {boolean} [secure=false] Whether to start an https server.
   */
  start(fn, secure = false) {
    let server
    const handler = (req, res) => {
      try {
        tester.response = res
        this.response = res
        fn(req, res)
        res.statusCode = 200
      } catch (err) {
        res.statusCode = 500
        res.write(err.stack)
      } finally {
        res.end()
      }
    }
    if (secure) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED=0
      server = createSecureServer({ cert, key }, handler)
    } else {
      server = createServer(handler)
    }
    const tester = new this.TesterConstructor()
    tester._addLink(async () => {
      await new Promise(r => server.listen(r))
      if (this._destroyed) { // guard against errors in the test case
        server.close()
        return false
      }
      tester.server = server
      tester.url = `http${secure ? 's' : ''}://0.0.0.0:${server.address().port}`
      this.server = server
    })
    tester.context = this
    return tester
  }
  async _destroy() {
    this._destroyed = true
    if (this.server) await new Promise(r => {
      this.server.close(r)
    })
  }
}

/**
 * @typedef {import('http').IncomingMessage} http.IncomingMessage
 * @typedef {import('http').ServerResponse} http.ServerResponse
 * @typedef {import('http').OutgoingHttpHeaders} http.OutgoingHttpHeaders
 * @typedef {import('http').Server} http.Server
 */