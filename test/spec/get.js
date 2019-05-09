import Context from '../context'

/** @type {TestSuite} */
const TS = {
  context: Context,
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
          .assert(500, '.keys required for signed cookies')
      },
      async 'returns signed cookie value'({ start, c }) {
        const opts = { keys: ['keyboard cat'] }
        await start(c((req, res, cookies) => {
          res.end(String(cookies.get('foo', { signed: true })))
        }, opts))
          .set('Cookie', 'foo=bar; foo.sig=iW2fuCIzk9Cg_rqLT1CAqrtdWs8')
          .get('/')
          .assert(200, 'bar')
      },
      'when signature is invalid': {
        async 'returns undefined'({ start, c }) {
          const opts = { keys: ['keyboard cat'] }
          await start(c((req, res, cookies) => {
            res.end(String(cookies.get('foo', { signed: true })))
          }, opts))
            .set('Cookie', 'foo=bar; foo.sig=v5f380JakwVgx2H9B9nA6kJaZNg')
            .get('/')
            .assert(200, 'undefined')
        },
        async 'deletes signature cookie'({ start, c }) {
          const opts = { keys: ['keyboard cat'] }
          await start(c((req, res, cookies) => {
            const t = String(cookies.get('foo', { signed: true }))
            res.end(t)
          }, opts))
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
          await start(c((req, res, cookies) => {
            res.end(String(cookies.get('foo', { signed: true })))
          }, opts))
            .set('Cookie', 'foo=bar; foo.sig=NzdRHeORj7MtAMhSsILYRsyVNI8')
            .get('/')
            .assert(200, 'bar')
        },
        async 'sets signature with new key'({ start, c }) {
          const opts = { keys: ['keyboard cat a', 'keyboard cat b'] }
          await start(c((req, res, cookies) => {
            res.end(String(cookies.get('foo', { signed: true })))
          }, opts))
            .set('Cookie', 'foo=bar; foo.sig=NzdRHeORj7MtAMhSsILYRsyVNI8')
            .get('/')
            .assert(200, 'bar')
            .count(1)
            .value('foo.sig', 'tecF04p5ua6TnfYxUTDskgWSKJE')
        },
      },
    },
  },
}

export default TS

/**
 * @typedef {import('../context').TestSuite} TestSuite
 */