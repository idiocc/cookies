import Cookies, { connect, express } from '../../src'
import { ok } from 'assert'
import Context from '../context'

/** @type {TestSuite} */
const TS = {
  context: Context,
  async 'express'({ start, get, assert }) {
    await start((req, res) => {
      const mw = express(['key'])
      mw(req, res, () => {
        ok(req.cookies && req.cookies.get && req.cookies.set)
        ok(res.cookies && res.cookies.get && res.cookies.set)
        res.end('ok')
      })
    })
    await get('/')
    assert(200, 'ok')
  },
  async 'connect'({ start, get, assert }) {
    await start((req, res) => {
      const mw = connect(['key'])
      mw(req, res, () => {
        ok(req.cookies && req.cookies.get && req.cookies.set)
        ok(res.cookies && res.cookies.get && res.cookies.set)
        res.end('ok')
      })
    })
    await get('/')
    assert(200, 'ok')
  },
}

export default TS

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../context').TestSuite} TestSuite
 */