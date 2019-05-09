import { strictEqual } from 'assert'
import Cookies from '../../src'
import Keygrip from '../../src/Keygrip'
import Context from '../context'

/** @type {TestSuite} */
export const options = {
  context: Context,
  async 'accepts array of keys'({ assertServer }) {
    await assertServer((req, res) => {
      const cookies = new Cookies(req, res, { keys: ['keyboard cat'] })
      strictEqual(typeof cookies.keys, 'object')
      strictEqual(cookies.keys.sign('foo=bar'), 'iW2fuCIzk9Cg_rqLT1CAqrtdWs8')
    })
  },
  async 'accepts Keygrip instance'({ assertServer }) {
    await assertServer((req, res) => {
      const keys = new Keygrip(['keyboard cat'])
      const cookies = new Cookies(req, res, { keys })
      strictEqual(typeof cookies.keys, 'object')
      strictEqual(cookies.keys.sign('foo=bar'), 'iW2fuCIzk9Cg_rqLT1CAqrtdWs8')
    })
  },
  '.keys': {
    async 'accepts array of keys'({ assertServer }) {
      await assertServer((req, res) => {
        const cookies = new Cookies(req, res, { keys: ['keyboard cat'] })
        strictEqual(typeof cookies.keys, 'object')
        strictEqual(cookies.keys.sign('foo=bar'), 'iW2fuCIzk9Cg_rqLT1CAqrtdWs8')
      })
    },
    async 'accepts Keygrip instance'({ assertServer }) {
      await assertServer((req, res) => {
        const keys = new Keygrip(['keyboard cat'])
        const cookies = new Cookies(req, res, { keys })
        strictEqual(typeof cookies.keys, 'object')
        strictEqual(cookies.keys.sign('foo=bar'), 'iW2fuCIzk9Cg_rqLT1CAqrtdWs8')
      })
    },
  },
  '.secure': {
    async 'defaults to undefined'({ assertServer }) {
      await assertServer((req, res) => {
        const cookies = new Cookies(req, res)
        strictEqual(cookies.secure, undefined)
      })
    },
    async 'sets secure flag'({ assertServer }) {
      await assertServer((req, res) => {
        const cookies = new Cookies(req, res, { secure: true })
        strictEqual(cookies.secure, true)
      })
    },
  },
}

// /** @type {TestSuite} */
// const TS = {
// context: Context,
// async 'creates new cookies instance'({ assertServer }) {
//   await assertServer((req, res) => {
//     const cookies = new Cookies(req, res)
//     ok(cookies)
//     strictEqual(cookies.constructor, Cookies)
//     strictEqual(cookies.request, req)
//     strictEqual(cookies.response, res)
//     strictEqual(cookies.keys, undefined)
//   })
// },
// }

// 'Cookies(req, res, [options])': {
//   async 'creates new cookies instance'({ assertServer }) {
//     await assertServer((req, res) => {
//       const cookies = Cookies(req, res, { keys: ['a', 'b'] })
//       ok(cookies)
//       strictEqual(cookies.constructor, Cookies)
//       strictEqual(cookies.request, req)
//       strictEqual(cookies.response, res)
//       strictEqual(typeof cookies.keys, 'object')
//     })
//   })
// })

// export default TS

/**
 * @typedef {import('../context').TestSuite} TestSuite
 */