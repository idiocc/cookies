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

/** @type {TestSuite} */
const TS = {
  context: [Context],
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
  '.get(name, [options])': {
    async 'returns value of cookie'({ start, c }) {
      await start(c((req, res, cookies) => {
        res.end(String(cookies.get('foo')))
      }))
        .set('Cookie', 'foo=bar')
        .get('/')
        .assert(200, 'bar')
    },
    async 'works for cookie name with special characters'({ start, c }) {
      await start(c((req, res, cookies) => {
        res.end(String(cookies.get('foo*(#bar)?.|$')))
      }))
        .set('Cookie', 'foo*(#bar)?.|$=buzz')
        .get('/')
        .assert(200, 'buzz')
    },
    async 'returns undefined without cookie'({ start, c }) {
      await start(c((req, res, cookies) => {
        res.end(String(cookies.get('fizz')))
      }))
        .set('Cookie', 'foo=bar')
        .get('/')
        .assert(200, 'undefined')
    },
    async 'returns undefined without header'({ start, c }) {
      await start(c((req, res, cookies) => {
        res.end(String(cookies.get('foo')))
      }))
        .get('/')
        .assert(200, 'undefined')
    },
    '"signed" option': {
      'when true': {
        async 'throws without .keys'({ start, c }) {
          await start(c((req, res, cookies) => {
            res.end(String(cookies.get('foo', { signed: true })))
          }))
            .set('Cookie', 'foo=bar; foo.sig=iW2fuCIzk9Cg_rqLT1CAqrtdWs8')
            .get('/')
            .assert(500, 'Error: .keys required for signed cookies')
        },
        async 'returns signed cookie value'({ start, c }) {
          const opts = { keys: ['keyboard cat'] }
          await start(c(opts, (req, res, cookies) => {
            res.end(String(cookies.get('foo', { signed: true })))
          }))
            .set('Cookie', 'foo=bar; foo.sig=iW2fuCIzk9Cg_rqLT1CAqrtdWs8')
            .get('/')
            .assert(200, 'bar')
        },
        'when signature is invalid': {
          async 'returns undefined'({ start, c }) {
            const opts = { keys: ['keyboard cat'] }
            await start(c(opts, (req, res, cookies) => {
              res.end(String(cookies.get('foo', { signed: true })))
            }))
              .set('Cookie', 'foo=bar; foo.sig=v5f380JakwVgx2H9B9nA6kJaZNg')
              .get('/')
              .assert(200, 'undefined')
          },
          async 'deletes signature cookie'({ start, c }) {
            const opts = { keys: ['keyboard cat'] }
            await start(c(opts, (req, res, cookies) => {
              const t = String(cookies.get('foo', { signed: true }))
              res.end(t)
            }))
              .set('Cookie', 'foo=bar; foo.sig=v5f380JakwVgx2H9B9nA6kJaZNg')
              .get('/')
              .assert(200, 'undefined')
              .count(1)
              .attributeAndValue('foo.sig', 'expires', 'Thu, 01 Jan 1970 00:00:00 GMT')
          },
        },
        'when signature matches old key': {
          async 'returns signed value'({ start, c }) {
            const opts = { keys: ['keyboard cat a', 'keyboard cat b'] }
            await start(c(opts, (req, res, cookies) => {
              res.end(String(cookies.get('foo', { signed: true })))
            }))
              .set('Cookie', 'foo=bar; foo.sig=NzdRHeORj7MtAMhSsILYRsyVNI8')
              .get('/')
              .assert(200, 'bar')
          },
          async 'sets signature with new key'({ start, c }) {
            const opts = { keys: ['keyboard cat a', 'keyboard cat b'] }
            await start(c(opts, (req, res, cookies) => {
              res.end(String(cookies.get('foo', { signed: true })))
            }))
              .set('Cookie', 'foo=bar; foo.sig=NzdRHeORj7MtAMhSsILYRsyVNI8')
              .get('/')
              .assert(200, 'bar')
              .count(1)
              .value('foo.sig', 'tecF04p5ua6TnfYxUTDskgWSKJE')
          },
        },
      },
    },
  },
  '.set(name, value, [options])': {
    async 'sets cookie'({ start, c }) {
      await start(c((req, res, cookies) => {
        cookies.set('foo', 'bar')
        res.end()
      }))
        .get('/')
        .assert(200)
        .value('foo', 'bar')
    },
    async 'works for cookie name with special characters'({ start, c }) {
      await start(c((req, res, cookies) => {
        cookies.set('foo*(#bar)?.|$', 'buzz')
        res.end()
      }))
        .get('/')
        .assert(200)
        .value('foo*(#bar)?.|$', 'buzz')
    },
    async 'works for cookie value with special characters'({ start, c }) {
      await start(c((req, res, cookies) => {
        cookies.set('foo', '*(#bar)?.|$')
        res.end()
      }))
        .get('/')
        .assert(200)
        .value('foo', '*(#bar)?.|$')
    },
    'when value is falsy': {
      async 'deletes cookie'({ start, c, setCookieHandler }) {
        await start(c(setCookieHandler('foo', null)))
          .get('/')
          .assert(200)
          .count(1)
          .value('foo', '')
          .attributeAndValue('foo', 'expires', 'Thu, 01 Jan 1970 00:00:00 GMT')
      },
    },
    '"httpOnly" option': {
      async 'is set by default'({ start, c }) {
        await start(c((req, res, cookies) => {
          cookies.set('foo', 'bar')
          res.end()
        }))
          .get('/')
          .assert(200)
          .attribute('foo', 'httpOnly')
      },
      async 'sets to true'({ start, c }) {
        await start(c((req, res, cookies) => {
          cookies.set('foo', 'bar', { httpOnly: true })
          res.end()
        }))
          .get('/')
          .assert(200)
          .attribute('foo', 'httpOnly')
      },
      async 'sets to false'({ start, c }) {
        await start(c((req, res, cookies) => {
          cookies.set('foo', 'bar', { httpOnly: false })
          res.end()
        }))
          .get('/')
          .assert(200)
          .noAttribute('foo', 'httpOnly')
      },
    },
    '"domain" option': {
      async 'is not set by default'({ start, c }) {
        await start(c((req, res, cookies) => {
          cookies.set('foo', 'bar')
          res.end()
        }))
          .get('/')
          .assert(200)
          .noAttribute('foo', 'domain')
      },
      async 'sets to custom value'({ start, c }) {
        await start(c((req, res, cookies) => {
          cookies.set('foo', 'bar', { domain: 'foo.local' })
          res.end()
        }))
          .get('/')
          .assert(200)
          .attributeAndValue('foo', 'domain', 'foo.local')
      },
      async 'rejects invalid value'({ start, c }) {
        await start(c((req, res, cookies) => {
          cookies.set('foo', 'bar', { domain: 'foo\nbar' })
          res.end()
        }))
          .get('/')
          .assert(500, 'TypeError: option domain is invalid')
      },
    },
    '"maxAge" option': {
      async 'sets the "expires" attribute'({ start, c, getCookieForName }) {
        const maxAge = 86400000
        await start(c((req, res, cookies) => {
          cookies.set('foo', 'bar', { maxAge })
          res.end()
        }))
          .get('/')
          .assert(200)
          .attribute('foo', 'expires')
          .assert((res) => {
            const cookie = getCookieForName('foo')
            const expected = new Date(Date.parse(res.headers.date) + maxAge).toUTCString()
            strictEqual(cookie.expires, expected)
          })
      },
      async 'does not set the "maxAge" attribute'({ start, c }) {
        await start(c((req, res, cookies) => {
          cookies.set('foo', 'bar', { maxAge: 86400000 })
          res.end()
        }))
          .get('/')
          .assert(200)
          .attribute('foo', 'expires')
          .noAttribute('foo', 'maxAge')
      },
    },
    '"overwrite" option': {
      async 'is off by default'({ start, c }) {
        await start(c((req, res, cookies) => {
          cookies.set('foo', 'bar')
          cookies.set('foo', 'baz')
          res.end()
        }))
          .get('/')
          .assert(200)
          .count(2)
          .value('foo', 'bar')
      },
      async 'overwrites same cookie by name when true'({ start, c }) {
        await start(c((req, res, cookies) => {
          cookies.set('foo', 'bar')
          cookies.set('foo', 'baz', { overwrite: true })
          res.end()
        }))
          .get('/')
          .assert(200)
          .count(1)
          .value('foo', 'baz')
      },
      async 'overwrites based on name only'({ start, c }) {
        await start(c((req, res, cookies) => {
          cookies.set('foo', 'bar', { path: '/foo' })
          cookies.set('foo', 'baz', { path: '/bar', overwrite: true })
          res.end()
        }))
          .get('/')
          .assert(200)
          .count(1)
          .value('foo', 'baz')
          .attributeAndValue('foo', 'path', '/bar')
      },
    },
    '"path" option': {
      async 'defaults to "/"'({ start, c }) {
        await start(c((req, res, cookies) => {
          cookies.set('foo', 'bar')
          res.end()
        }))
          .get('/')
          .assert(200)
          .attributeAndValue('foo', 'path', '/')
      },
      async 'sets to custom value'({ start, c }) {
        await start(c((req, res, cookies) => {
          cookies.set('foo', 'bar', { path: '/admin' })
          res.end()
        }))
          .get('/')
          .assert(200)
          .attributeAndValue('foo', 'path', '/admin')
      },
      async 'sets to ""'({ start, c }) {
        await start(c((req, res, cookies) => {
          cookies.set('foo', 'bar', { path: '' })
          res.end()
        }))
          .get('/')
          .assert(200)
          .noAttribute('foo', 'path')
      },
      async 'rejects invalid value'({ start, c }) {
        await start(c((req, res, cookies) => {
          cookies.set('foo', 'bar', { path: 'foo\nbar' })
          res.end()
        }))
          .get('/')
          .assert(500, 'TypeError: option path is invalid')
      },
    },
    '"secure" option': {
      'when true': {
        async 'throws on unencrypted connection'({ start, c }) {
          await start(c((req, res, cookies) => {
            cookies.set('foo', 'bar', { secure: true })
            res.end()
          }))
            .get('/')
            .assert(500, 'Error: Cannot send secure cookie over unencrypted connection')
        },
        async 'sets secure attribute on encrypted connection'({ start, c }) {
          await start(c((req, res, cookies) => {
            cookies.set('foo', 'bar', { secure: true })
            res.end()
          }), true)
            .get('/')
            .assert(200)
            .attribute('foo', 'Secure')
        },
        'with "secure: true" constructor option': {
          async 'sets secure attribute on unencrypted connection'({ start, c }) {
            const opts = { secure: true }
            await start(c(opts, (req, res, cookies) => {
              cookies.set('foo', 'bar', { secure: true })
              res.end()
            }))
              .get('/')
              .assert(200)
              .attribute('foo', 'Secure')
          },
        },
        'with req.protocol === "https"': {
          async 'sets secure attribute on unencrypted connection'({ start, c }) {
            await start(c((req, res, cookies) => {
              req.protocol = 'https'
              cookies.set('foo', 'bar', { secure: true })
              res.end()
            }))
              .get('/')
              .assert(200)
              .attribute('foo', 'Secure')
          },
        },
      },
    },
    // '"secureProxy" option': {
    //   async 'sets secure attribute over http'({ start, attribute, c }) {
    //     await start(c((req, res, cookies) => {
    //       cookies.set('foo', 'bar', { secureProxy: true })
    //       res.end()
    //     }))
    //       .get('/')
    //       .assert(200)
    //       .assert(attribute('foo', 'Secure'))
    //   },
    // },
    '"signed" option': {
      'when true': {
        async 'throws without .keys'({ start, c }) {
          await start(c((req, res, cookies) => {
            cookies.set('foo', 'bar', { signed: true })
            res.end()
          }))
            .get('/')
            .assert(500, 'Error: .keys required for signed cookies')
        },
        async 'sets additional .sig cookie'({ start, c }) {
          const opts = { keys: ['keyboard cat'] }
          await start(c(opts, (req, res, cookies) => {
            cookies.set('foo', 'bar', { signed: true })
            res.end()
          }))
            .get('/')
            .assert(200)
            .count(2)
            .value('foo', 'bar')
            .value('foo.sig', 'iW2fuCIzk9Cg_rqLT1CAqrtdWs8')
        },
        async 'uses first key for signature'({ start, c }) {
          const opts = { keys: ['keyboard cat a', 'keyboard cat b'] }
          await start(c(opts, (req, res, cookies) => {
            cookies.set('foo', 'bar', { signed: true })
            res.end()
          }))
            .get('/')
            .assert(200)
            .count(2)
            .value('foo', 'bar')
            .value('foo.sig', 'tecF04p5ua6TnfYxUTDskgWSKJE')
        },
        'when value is falsy': {
          async 'deletes additional .sig cookie'({ start, c, setCookieHandler }) {
            const opts = { keys: ['keyboard cat'] }
            await start(c(opts, setCookieHandler('foo', null, { signed: true })))
              .get('/')
              .assert(200)
              .count(2)
              .value('foo', '')
              .attributeAndValue('foo', 'expires', 'Thu, 01 Jan 1970 00:00:00 GMT')
              .attributeAndValue('foo.sig', 'expires', 'Thu, 01 Jan 1970 00:00:00 GMT')
          },
        },
        'with "path"': {
          async 'sets additional .sig cookie with path'({ start, c }) {
            const opts = { keys: ['keyboard cat'] }
            await start(c(opts, (req, res, cookies) => {
              cookies.set('foo', 'bar', { signed: true, path: '/admin' })
              res.end()
            }))
              .get('/')
              .assert(200)
              .count(2)
              .attributeAndValue('foo', 'path', '/admin')
              .attributeAndValue('foo.sig', 'path', '/admin')
          },
        },
        'with "overwrite"': {
          async 'sets additional .sig cookie with httpOnly'({ start, c }) {
            const opts = { keys: ['keyboard cat'] }
            await start(c(opts, (req, res, cookies) => {
              cookies.set('foo', 'bar', { signed: true })
              cookies.set('foo', 'baz', { signed: true, overwrite: true })
              res.end()
            }))
              .get('/')
              .assert(200)
              .count(2)
              .value('foo', 'baz')
              .value('foo.sig', 'ptOkbbiPiGfLWRzz1yXP3XqaW4E')
          },
        },
        // '!with "secureProxy"': {
        //   async 'sets additional .sig cookie with secure'({ start, attribute, c }) {
        //     const opts = { keys: ['keyboard cat'] }
        //     await start(c(opts, (req, res, cookies) => {
        //       cookies.set('foo', 'bar', { signed: true, secureProxy: true })
        //       res.end()
        //     }))
        //       .get('/')
        //       .assert(200)
        //       .count(2)
        //       .assert(attribute('foo', 'Secure'))
        //       .assert(attribute('foo.sig', 'Secure'))
        //   },
        // },
      },
    },
  },
}

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

export default TS

/**
 * @typedef {import('../context').TestSuite} TestSuite
 */