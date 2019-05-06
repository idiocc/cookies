import { equal } from 'assert'
import { createServer } from 'http'
import aqt from '@rqt/aqt'
import { readFileSync } from 'fs'
import { createServer as createSecureServer } from 'https'

const cert = readFileSync('test/fixture/server.crt', 'ascii')
const key = readFileSync('test/fixture/server.key', 'ascii')

export default class Server {
  /**
   * Creates a server.
   * @param {function(http.IncomingMessage, http.ServerResponse)} fn The server callback. If it does not throw an error, the 200 status code is set.
   * @param {boolean} [secure=false] Whether to start an https server.
   */
  async start(fn, secure = false) {
    let server
    const handler = (req, res) => {
      try {
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
    await new Promise(r => server.listen(r))
    this.server = server
    this.url = `http${secure ? 's' : ''}://0.0.0.0:${server.address().port}`
    this.headers = {}
    return server
  }
  /**
   * Navigate to the path and return the result.
   */
  async get(path = '') {
    const { statusCode, body, headers } = await aqt(`${this.url}${path}`, {
      headers: this.headers,
    })
    this.statusCode = statusCode
    this.body = body
    this.headers = headers
    this.response.headers = headers
    return { statusCode, body, headers }
  }
  /**
   * Sets the value for the header in the upcoming request.
   */
  set(header, value) {
    this.headers[header] = value
    return this
  }
  /**
   * Assert on the status code and body when a number is given.
   * Assert on the header when the string is given. If the second arg is null, asserts on the absence of the header.
   * @param {number|string|function(http.ServerResponse)} code The number of the status code, or name of the header, or the custom assertion function.
   * @param {String} message The body or header value (or null for no header).
   */
  assert(code, message) {
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
    return this
  }
  _destroy() {
    if (this.server) this.server.close()
  }
}

/**
 * @typedef {import('http').IncomingMessage} http.IncomingMessage
 * @typedef {import('http').ServerResponse} http.ServerResponse
 */