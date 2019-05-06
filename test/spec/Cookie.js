import { equal, throws } from 'assert'
import Cookie from '../../src/Cookie'

export default {
  'should have correct constructor'() {
    const cookie = new Cookie('foo', 'bar')
    equal(cookie.constructor, Cookie)
  },
  'should throw on invalid name'() {
    throws(function () {
      new Cookie('foo\n', 'bar')
    }, /argument name is invalid/)
  },
  'should throw on invalid value'() {
    throws(function () {
      new Cookie('foo', 'bar\n')
    }, /argument value is invalid/)
  },
  'should throw on invalid path'() {
    throws(function () {
      new Cookie('foo', 'bar', { path: '/\n' })
    }, /option path is invalid/)
  },
  'should throw on invalid domain'() {
    throws(function () {
      new Cookie('foo', 'bar', { domain: 'example.com\n' })
    }, /option domain is invalid/)
  },
  options: {
    'maxAge': {
      'should set the .maxAge property'() {
        const cookie = new Cookie('foo', 'bar', { maxAge: 86400 })
        equal(cookie.maxAge, 86400)
      },
    },
    'sameSite': {
      'should set the .sameSite property'() {
        const cookie = new Cookie('foo', 'bar', { sameSite: true })
        equal(cookie.sameSite, true)
      },
      'should default to false'() {
        const cookie = new Cookie('foo', 'bar')
        equal(cookie.sameSite, false)
      },
      'should throw on invalid value'() {
        throws(function () {
          new Cookie('foo', 'bar', { sameSite: 'foo' })
        }, /option sameSite is invalid/)
      },
      'when set to "false"': {
        'should not set "samesite" attribute in header'() {
          const cookie = new Cookie('foo', 'bar', { sameSite: false })
          equal(cookie.toHeader(), 'foo=bar; path=/; httponly')
        },
      },
      'when set to "true"': {
        'should set "samesite=strict" attribute in header'() {
          const cookie = new Cookie('foo', 'bar', { sameSite: true })
          equal(cookie.toHeader(), 'foo=bar; path=/; samesite=strict; httponly')
        },
      },
      'when set to "lax"': {
        'should set "samesite=lax" attribute in header'() {
          const cookie = new Cookie('foo', 'bar', { sameSite: 'lax' })
          equal(cookie.toHeader(), 'foo=bar; path=/; samesite=lax; httponly')
        },
      },
      'when set to "strict"': {
        'should set "samesite=strict" attribute in header'() {
          const cookie = new Cookie('foo', 'bar', { sameSite: 'strict' })
          equal(cookie.toHeader(), 'foo=bar; path=/; samesite=strict; httponly')
        },
      },
      'when set to "STRICT"': {
        'should set "samesite=strict" attribute in header'() {
          const cookie = new Cookie('foo', 'bar', { sameSite: 'STRICT' })
          equal(cookie.toHeader(), 'foo=bar; path=/; samesite=strict; httponly')
        },
      },
    },
  },
}