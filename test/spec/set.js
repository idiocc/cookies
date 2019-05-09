import { strictEqual } from 'assert'
import Context from '../context'

/** @type {TestSuite} */
const TS = {
  context: Context,
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
        .assert(500, 'option domain is invalid')
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
        .assert(500, 'option path is invalid')
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
          .assert(500, 'Cannot send secure cookie over unencrypted connection')
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
          await start(c((req, res, cookies) => {
            cookies.set('foo', 'bar', { secure: true })
            res.end()
          }, opts))
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
          .assert(500, '.keys required for signed cookies')
      },
      async 'sets additional .sig cookie'({ start, c }) {
        const opts = { keys: ['keyboard cat'] }
        await start(c((req, res, cookies) => {
          cookies.set('foo', 'bar', { signed: true })
          res.end()
        }, opts))
          .get('/')
          .assert(200)
          .count(2)
          .value('foo', 'bar')
          .value('foo.sig', 'iW2fuCIzk9Cg_rqLT1CAqrtdWs8')
      },
      async 'uses first key for signature'({ start, c }) {
        const opts = { keys: ['keyboard cat a', 'keyboard cat b'] }
        await start(c((req, res, cookies) => {
          cookies.set('foo', 'bar', { signed: true })
          res.end()
        }, opts))
          .get('/')
          .assert(200)
          .count(2)
          .value('foo', 'bar')
          .value('foo.sig', 'tecF04p5ua6TnfYxUTDskgWSKJE')
      },
      'when value is falsy': {
        async 'deletes additional .sig cookie'({ start, c, setCookieHandler }) {
          const opts = { keys: ['keyboard cat'] }
          await start(c(setCookieHandler('foo', null, { signed: true }), opts))
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
          await start(c((req, res, cookies) => {
            cookies.set('foo', 'bar', { signed: true, path: '/admin' })
            res.end()
          }, opts))
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
          await start(c((req, res, cookies) => {
            cookies.set('foo', 'bar', { signed: true })
            cookies.set('foo', 'baz', { signed: true, overwrite: true })
            res.end()
          }, opts))
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
}

export default TS

/**
 * @typedef {import('../context').TestSuite} TestSuite
 */