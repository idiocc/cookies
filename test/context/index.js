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
  // createSecureServer(options, handler) {
  //   return createSecureServer()
  //     .on('request', this.createRequestListener(options, handler))
  // }

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
      .get()
      .assert(200, 'OK')
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