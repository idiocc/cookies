import { ok, strictEqual } from 'assert'
import Cookies from '../../src'
import Keygrip from '../../src/Keygrip'
import Context from '../context'

/** @type {TestSuite} */
export const options = {
  context: Context,
  async 'accepts array of keys'({ assertServer }) {
    await assertServer((req, res) => {
      const cookies = new Cookies(req, res, ['keyboard cat'])
      strictEqual(typeof cookies.keys, 'object')
      strictEqual(cookies.keys.sign('foo=bar'), 'iW2fuCIzk9Cg_rqLT1CAqrtdWs8')
    })
  },
  async 'accepts Keygrip instance'({ assertServer }) {
    await assertServer((req, res) => {
      const keys = new Keygrip(['keyboard cat'])
      const cookies = new Cookies(req, res, keys)
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
        const cookies = new Cookies(req, res, { keys: keys })
        strictEqual(typeof cookies.keys, 'object')
        strictEqual(cookies.keys.sign('foo=bar'), 'iW2fuCIzk9Cg_rqLT1CAqrtdWs8')
      })
    },
  },
  '.secure': {
    async 'should default to undefined'({ assertServer }) {
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
  async 'creates new cookies instance'({ assertServer }) {
    await assertServer((req, res) => {
      const cookies = new Cookies(req, res)
      ok(cookies)
      strictEqual(cookies.constructor, Cookies)
      strictEqual(cookies.request, req)
      strictEqual(cookies.response, res)
      strictEqual(cookies.keys, undefined)
    })
  },
  '.get(name, [options])': {
    async 'returns value of cookie'({ start, set, get, assert, c }) {
      await start(c((req, res, cookies) => {
        res.end(String(cookies.get('foo')))
      }))
      set('Cookie', 'foo=bar')
      await get('/')
      assert(200, 'bar')
    },
    async 'works for cookie name with special characters'({ start, set, get, assert, c }) {
      await start(c((req, res, cookies) => {
        res.end(String(cookies.get('foo*(#bar)?.|$')))
      }))
      set('Cookie', 'foo*(#bar)?.|$=buzz')
      await get('/')
      assert(200, 'buzz')
    },
    async 'returns undefined without cookie'({ start, set, get, assert, c }) {
      await start(c((req, res, cookies) => {
        res.end(String(cookies.get('fizz')))
      }))
      set('Cookie', 'foo=bar')
      await get('/')
      assert(200, 'undefined')
    },
    async 'returns undefined without header'({ start, get, assert, c }) {
      await start(c((req, res, cookies) => {
        res.end(String(cookies.get('foo')))
      }))
      await get('/')
      assert(200, 'undefined')
    },
    '"signed" option': {
      'when true': {
        async 'should throw without .keys'({ start, set, get, assert, c }) {
          await start(c((req, res, cookies) => {
            res.end(String(cookies.get('foo', { signed: true })))
          }))
          set('Cookie', 'foo=bar; foo.sig=iW2fuCIzk9Cg_rqLT1CAqrtdWs8')
          await get('/')
          assert(500, 'Error: .keys required for signed cookies')
        },
        async 'returns signed cookie value'({ start, set, get, assert, c }) {
          const opts = { keys: ['keyboard cat'] }
          await start(c(opts, (req, res, cookies) => {
            res.end(String(cookies.get('foo', { signed: true })))
          }))
          set('Cookie', 'foo=bar; foo.sig=iW2fuCIzk9Cg_rqLT1CAqrtdWs8')
          await get('/')
          assert(200, 'bar')
        },
        'when signature is invalid': {
          async 'returns undefined'({ start, set, get, assert, c }) {
            const opts = { keys: ['keyboard cat'] }
            await start(c(opts, (req, res, cookies) => {
              res.end(String(cookies.get('foo', { signed: true })))
            }))
            set('Cookie', 'foo=bar; foo.sig=v5f380JakwVgx2H9B9nA6kJaZNg')
            await get('/')
            assert(200, 'undefined')
          },
          async 'deletes signature cookie'({ start, set, get, assert, c, count, attributeAndValue }) {
            const opts = { keys: ['keyboard cat'] }
            await start(c(opts, (req, res, cookies) => {
              res.end(String(cookies.get('foo', { signed: true })))
            }))
            set('Cookie', 'foo=bar; foo.sig=v5f380JakwVgx2H9B9nA6kJaZNg')
            await get('/')
            assert(200, 'undefined')
            assert(count(1))
            assert(attributeAndValue('foo.sig', 'expires', 'Thu, 01 Jan 1970 00:00:00 GMT'))
          },
        },
        'when signature matches old key': {
          async 'returns signed value'({ start, set, get, assert, c }) {
            const opts = { keys: ['keyboard cat a', 'keyboard cat b'] }
            await start(c(opts, (req, res, cookies) => {
              res.end(String(cookies.get('foo', { signed: true })))
            }))
            set('Cookie', 'foo=bar; foo.sig=NzdRHeORj7MtAMhSsILYRsyVNI8')
            await get('/')
            assert(200, 'bar')
          },
          async 'sets signature with new key'({ start, set, get, assert, c, count, value }) {
            const opts = { keys: ['keyboard cat a', 'keyboard cat b'] }
            await start(c(opts, (req, res, cookies) => {
              res.end(String(cookies.get('foo', { signed: true })))
            }))
            set('Cookie', 'foo=bar; foo.sig=NzdRHeORj7MtAMhSsILYRsyVNI8')
            await get('/')
            assert(200, 'bar')
            assert(count(1))
            assert(value('foo.sig', 'tecF04p5ua6TnfYxUTDskgWSKJE'))
          },
        },
      },
    },
  },
  '.set(name, value, [options])': {
    async 'sets cookie'({ start, value, get, assert, c }) {
      await start(c((req, res, cookies) => {
        cookies.set('foo', 'bar')
        res.end()
      }))
      await get('/')
      assert(200)
      assert(value('foo', 'bar'))
    },
    async 'should work for cookie name with special characters'({ start, value, get, assert, c }) {
      await start(c((req, res, cookies) => {
        cookies.set('foo*(#bar)?.|$', 'buzz')
        res.end()
      }))
      await get('/')
      assert(200)
      assert(value('foo*(#bar)?.|$', 'buzz'))
    },
    async 'should work for cookie value with special characters'({ start, value, get, assert, c }) {
      await start(c((req, res, cookies) => {
        cookies.set('foo', '*(#bar)?.|$')
        res.end()
      }))
      await get('/')
      assert(200)
      assert(value('foo', '*(#bar)?.|$'))
    },
    'when value is falsy': {
      async 'deletes cookie'({ start, value, get, assert, c, count, attributeAndValue, setCookieHandler }) {
        await start(c(setCookieHandler('foo', null)))
        await get('/')
        assert(200)
        assert(count(1))
        assert(value('foo', ''))
        assert(attributeAndValue('foo', 'expires', 'Thu, 01 Jan 1970 00:00:00 GMT'))
      },
    },
    '"httpOnly" option': {
      async 'should be set by default'({ start, attribute, get, assert, c }) {
        await start(c((req, res, cookies) => {
          cookies.set('foo', 'bar')
          res.end()
        }))
        await get('/')
        assert(200)
        assert(attribute('foo', 'httpOnly'))
      },
      async 'sets to true'({ start, attribute, get, assert, c }) {
        await start(c((req, res, cookies) => {
          cookies.set('foo', 'bar', { httpOnly: true })
          res.end()
        }))
        await get('/')
        assert(200)
        assert(attribute('foo', 'httpOnly'))
      },
      async 'sets to false'({ start, noAttribute, get, assert, c }) {
        await start(c((req, res, cookies) => {
          cookies.set('foo', 'bar', { httpOnly: false })
          res.end()
        }))
        await get('/')
        assert(200)
        assert(noAttribute('foo', 'httpOnly'))
      },
    },
    '"domain" option': {
      async 'should not be set by default'({ start, noAttribute, get, assert, c }) {
        await start(c((req, res, cookies) => {
          cookies.set('foo', 'bar')
          res.end()
        }))
        await get('/')
        assert(200)
        assert(noAttribute('foo', 'domain'))
      },
      async 'sets to custom value'({ start, attributeAndValue, get, assert, c }) {
        await start(c((req, res, cookies) => {
          cookies.set('foo', 'bar', { domain: 'foo.local' })
          res.end()
        }))
        await get('/')
        assert(200)
        assert(attributeAndValue('foo', 'domain', 'foo.local'))
      },
      async 'rejects invalid value'({ start, get, assert, c }) {
        await start(c((req, res, cookies) => {
          cookies.set('foo', 'bar', { domain: 'foo\nbar' })
          res.end()
        }))
        await get('/')
        assert(500, 'TypeError: option domain is invalid')
      },
    },
    '"maxAge" option': {
      async 'sets the "expires" attribute'({ start, attribute, get, assert, c, getCookieForName }) {
        const maxAge = 86400000
        await start(c((req, res, cookies) => {
          cookies.set('foo', 'bar', { maxAge: maxAge })
          res.end()
        }))
        await get('/')
        assert(200)
        assert(attribute('foo', 'expires'))
        assert((res) => {
          const cookie = getCookieForName(res, 'foo')
          const expected = new Date(Date.parse(res.headers.date) + maxAge).toUTCString()
          strictEqual(cookie.expires, expected)
        })
      },
      async 'should not set the "maxAge" attribute'({ start, attribute, noAttribute, get, assert, c }) {
        await start(c((req, res, cookies) => {
          cookies.set('foo', 'bar', { maxAge: 86400000 })
          res.end()
        }))
        await get('/')
        assert(200)
        assert(attribute('foo', 'expires'))
        assert(noAttribute('foo', 'maxAge'))
      },
    },
    '"overwrite" option': {
      async 'should be off by default'({ start, count, value, get, assert, c }) {
        await start(c((req, res, cookies) => {
          cookies.set('foo', 'bar')
          cookies.set('foo', 'baz')
          res.end()
        }))
        await get('/')
        assert(200)
        assert(count(2))
        assert(value('foo', 'bar'))
      },
      async 'overwrites same cookie by name when true'({ start, get, assert, c, count, value }) {
        await start(c((req, res, cookies) => {
          cookies.set('foo', 'bar')
          cookies.set('foo', 'baz', { overwrite: true })
          res.end()
        }))
        await get('/')
        assert(200)
        assert(count(1))
        assert(value('foo', 'baz'))
      },
      async 'overwrites based on name only'({ start, count, value, attributeAndValue, get, assert, c }) {
        await start(c((req, res, cookies) => {
          cookies.set('foo', 'bar', { path: '/foo' })
          cookies.set('foo', 'baz', { path: '/bar', overwrite: true })
          res.end()
        }))
        await get('/')
        assert(200)
        assert(count(1))
        assert(value('foo', 'baz'))
        assert(attributeAndValue('foo', 'path', '/bar'))
      },
    },
    '"path" option': {
      async 'should default to "/"'({ start, attributeAndValue, get, assert, c }) {
        await start(c((req, res, cookies) => {
          cookies.set('foo', 'bar')
          res.end()
        }))
        await get('/')
        assert(200)
        assert(attributeAndValue('foo', 'path', '/'))
      },
      async 'sets to custom value'({ start, attributeAndValue, get, assert, c }) {
        await start(c((req, res, cookies) => {
          cookies.set('foo', 'bar', { path: '/admin' })
          res.end()
        }))
        await get('/')
        assert(200)
        assert(attributeAndValue('foo', 'path', '/admin'))
      },
      async 'sets to ""'({ start, noAttribute, get, assert, c }) {
        await start(c((req, res, cookies) => {
          cookies.set('foo', 'bar', { path: '' })
          res.end()
        }))
        await get('/')
        assert(200)
        assert(noAttribute('foo', 'path'))
      },
      async 'rejects invalid value'({ start, get, assert, c }) {
        await start(c((req, res, cookies) => {
          cookies.set('foo', 'bar', { path: 'foo\nbar' })
          res.end()
        }))
        await get('/')
        assert(500, 'TypeError: option path is invalid')
      },
    },
    '"secure" option': {
      'when true': {
        async 'should throw on unencrypted connection'({ start, get, assert, c }) {
          await start(c((req, res, cookies) => {
            cookies.set('foo', 'bar', { secure: true })
            res.end()
          }))
          await get('/')
          assert(500, 'Error: Cannot send secure cookie over unencrypted connection')
        },
        async 'sets secure attribute on encrypted connection'({ start, attribute, get, assert, c }) {
          await start(c((req, res, cookies) => {
            cookies.set('foo', 'bar', { secure: true })
            res.end()
          }), true)
          await get('/')
          assert(200)
          assert(attribute('foo', 'Secure'))
        },
        'with "secure: true" constructor option': {
          async 'sets secure attribute on unencrypted connection'({ start, attribute, get, assert, c }) {
            const opts = { secure: true }
            await start(c(opts, (req, res, cookies) => {
              cookies.set('foo', 'bar', { secure: true })
              res.end()
            }))
            await get('/')
            assert(200)
            assert(attribute('foo', 'Secure'))
          },
        },
        'with req.protocol === "https"': {
          async 'sets secure attribute on unencrypted connection'({ start, attribute, get, assert, c }) {
            await start(c((req, res, cookies) => {
              req.protocol = 'https'
              cookies.set('foo', 'bar', { secure: true })
              res.end()
            }))
            await get('/')
            assert(200)
            assert(attribute('foo', 'Secure'))
          },
        },
      },
    },
    '"secureProxy" option': {
      async 'sets secure attribute over http'({ start, attribute, get, assert, c }) {
        await start(c((req, res, cookies) => {
          cookies.set('foo', 'bar', { secureProxy: true })
          res.end()
        }))
        await get('/')
        assert(200)
        assert(attribute('foo', 'Secure'))
      },
    },
    '"signed" option': {
      'when true': {
        async 'should throw without .keys'({ start, get, assert, c }) {
          await start(c((req, res, cookies) => {
            cookies.set('foo', 'bar', { signed: true })
            res.end()
          }))
          await get('/')
          assert(500, 'Error: .keys required for signed cookies')
        },
        async 'sets additional .sig cookie'({ start, count, value, get, assert, c }) {
          const opts = { keys: ['keyboard cat'] }
          await start(c(opts, (req, res, cookies) => {
            cookies.set('foo', 'bar', { signed: true })
            res.end()
          }))
          await get('/')
          assert(200)
          assert(count(2))
          assert(value('foo', 'bar'))
          assert(value('foo.sig', 'iW2fuCIzk9Cg_rqLT1CAqrtdWs8'))
        },
        async 'should use first key for signature'({ start, count, value, get, assert, c }) {
          const opts = { keys: ['keyboard cat a', 'keyboard cat b'] }
          await start(c(opts, (req, res, cookies) => {
            cookies.set('foo', 'bar', { signed: true })
            res.end()
          }))
          await get('/')
          assert(200)
          assert(count(2))
          assert(value('foo', 'bar'))
          assert(value('foo.sig', 'tecF04p5ua6TnfYxUTDskgWSKJE'))
        },
        'when value is falsy': {
          async 'deletes additional .sig cookie'({ start, count, value, attributeAndValue, get, assert, c, setCookieHandler }) {
            const opts = { keys: ['keyboard cat'] }
            await start(c(opts, setCookieHandler('foo', null, { signed: true })))
            await get('/')
            assert(200)
            assert(count(2))
            assert(value('foo', ''))
            assert(attributeAndValue('foo', 'expires', 'Thu, 01 Jan 1970 00:00:00 GMT'))
            assert(attributeAndValue('foo.sig', 'expires', 'Thu, 01 Jan 1970 00:00:00 GMT'))
          },
        },
        'with "path"': {
          async 'sets additional .sig cookie with path'({ start, count, attributeAndValue, get, assert, c }) {
            const opts = { keys: ['keyboard cat'] }
            await start(c(opts, (req, res, cookies) => {
              cookies.set('foo', 'bar', { signed: true, path: '/admin' })
              res.end()
            }))
            await get('/')
            assert(200)
            assert(count(2))
            assert(attributeAndValue('foo', 'path', '/admin'))
            assert(attributeAndValue('foo.sig', 'path', '/admin'))
          },
        },
        'with "overwrite"': {
          async 'sets additional .sig cookie with httpOnly'({ start, count, value, get, assert, c }) {
            const opts = { keys: ['keyboard cat'] }
            await start(c(opts, (req, res, cookies) => {
              cookies.set('foo', 'bar', { signed: true })
              cookies.set('foo', 'baz', { signed: true, overwrite: true })
              res.end()
            }))
            await get('/')
            assert(200)
            assert(count(2))
            assert(value('foo', 'baz'))
            assert(value('foo.sig', 'ptOkbbiPiGfLWRzz1yXP3XqaW4E'))
          },
        },
        'with "secureProxy"': {
          async 'sets additional .sig cookie with secure'({ start, count, attribute, get, assert, c }) {
            const opts = { keys: ['keyboard cat'] }
            await start(c(opts, (req, res, cookies) => {
              cookies.set('foo', 'bar', { signed: true, secureProxy: true })
              res.end()
            }))
            await get('/')
            assert(200)
            assert(count(2))
            assert(attribute('foo', 'Secure'))
            assert(attribute('foo.sig', 'Secure'))
          },
        },
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