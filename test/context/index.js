import Cookies from '../../src'
import CookieContext from '@contexts/http/cookies'

/**
 * A testing context for the package.
 */
export default class Context extends CookieContext {
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
   * @param {function(http.IncomingMessage, http.ServerResponse)} handler
   * @param {_goa.CookiesOptions} options
   * @returns {function(http.IncomingMessage, http.ServerResponse)}
   */
  c(handler, options) {
    return (req, res) => {
      const cookies = new Cookies(req, res, options)

      handler(req, res, cookies)
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

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../../types').CookiesOptions} _goa.CookiesOptions
 */