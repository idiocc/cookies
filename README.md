# @goa/cookies

[![npm version](https://badge.fury.io/js/%40goa%2Fcookies.svg)](https://npmjs.org/package/@goa/cookies)

`@goa/cookies` is a [fork](https://github.com/pillarjs/cookies) of Signed And Unsigned Cookies Based On Keygrip Written In ES6 And Optimised With JavaScript Compiler.

The original module has been updated to be used in [`@goa/koa`](https://artdecocode.com/goa/): _Koa_ web server compiled with _Google Closure Compiler_ using [**Depack**](https://artdecocode.com/depack/) into a single file library (0 dependencies).

```sh
yarn add @goa/cookies
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [class Cookies](#class-cookies)
- [`constructor(request: IncomingMessage, response: ServerResponse, options: CookiesOptions): Cookies`](#constructorrequest-incomingmessageresponse-serverresponseoptions-cookiesoptions-cookies)
  * [`Cookies`](#type-cookies)
  * [`CookiesOptions`](#type-cookiesoptions)
  * [`CookieSetOptions`](#type-cookiesetoptions)
  * [`CookieAttributes`](#type-cookieattributes)
- [class Keygrip](#class-keygrip)
  * [`Keygrip`](#type-keygrip)
  * [Keygrip Implementation](#keygrip-implementation)
- [Express/Connect](#expressconnect)
- [Externs](#externs)
  * [Externs](#externs)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents"><img src="/.documentary/section-breaks/0.svg?sanitize=true"></a></p>

## API

The package is available by importing its default function:

```js
import Cookies, { Keygrip, express, connect } from '@goa/cookies'
```

The deprecated `secureProxy`, `maxage` attributes of a cookie have been removed. The constructor only accepts the `{ keys: Array<string>|Keygrip }` option, without being able to pass keys as an array, or _Keygrip_ as an object. Please make sure no middleware is using these options.

<p align="center"><a href="#table-of-contents"><img src="/.documentary/section-breaks/1.svg?sanitize=true"></a></p>

## class Cookies

_Cookies_ is a Node.JS module for getting and setting HTTP(S) cookies. Cookies can be signed to prevent tampering, using Keygrip. It can be used with the built-in _Node.JS_ HTTP library, or as _Connect/Express_ middleware.

## `constructor(`<br/>&nbsp;&nbsp;`request: IncomingMessage,`<br/>&nbsp;&nbsp;`response: ServerResponse,`<br/>&nbsp;&nbsp;`options: CookiesOptions,`<br/>`): Cookies`

This creates a cookie jar corresponding to the current _request_ and _response_, additionally passing an object options.

A [Keygrip](#class-keygrip) object or an array of keys can optionally be passed as _options.keys_ to enable cryptographic signing based on SHA1 HMAC, using rotated credentials.

A Boolean can optionally be passed as _options.secure_ to explicitly specify if the connection is secure, rather than this module examining request.

Note that since this only saves parameters without any other processing, it is very lightweight. Cookies are only parsed on demand when they are accessed.

<table>
<tr><th>Node.JS HTTP Server Example</th></tr>
<tr><td>

```js
import Cookies from '@goa/cookies'
import aqt from '@rqt/aqt'
import { createServer } from 'http'

// Optionally define keys to sign cookie values
// to prevent client tampering
const keys = ['keyboard cat']

const server = createServer((req, res) => {
  // Create a cookies object
  const cookies = new Cookies(req, res, { keys: keys })

  // Get a cookie
  const lastVisit = cookies.get('LastVisit', { signed: true })

  // Set the cookie to a value
  cookies.set('LastVisit', new Date().toISOString(), { signed: true })

  if (!lastVisit) {
    res.setHeader('Content-Type', 'text/plain')
    res.end('Welcome, first time visitor!')
  } else {
    res.setHeader('Content-Type', 'text/plain')
    res.end('Welcome back! Nothing much changed since your last visit at ' + lastVisit + '.')
  }
})

server.listen(async () => {
  const url = `http://localhost:${server.address().port}`
  console.log(url)
  let { body, headers } = await aqt(url)
  console.log(body, headers['set-cookie'].join('\n'))
  ;({ body } = await aqt(url, {
    headers: { Cookie: headers['set-cookie'] },
  }))
  console.log(body)
  server.close()
})
```
</td></tr>
<tr><td align="center">
<em>The output</em>
</td></tr>
<tr><td>

```
http://localhost:50525
Welcome, first time visitor! LastVisit=2019-07-19T22:56:14.046Z; path=/; httponly
LastVisit.sig=IfYMKanzOXmbYjRDQ1_igX5C8Hs; path=/; httponly
Welcome back! Nothing much changed since your last visit at 2019-07-19T22:56:14.046Z.
```
</td></tr>
</table>

`import('http').IncomingMessage` __<a name="type-httpincomingmessage">`http.IncomingMessage`</a>__: The client request.

`import('http').ServerResponse` __<a name="type-httpserverresponse">`http.ServerResponse`</a>__: The server response.

__<a name="type-cookies">`Cookies`</a>__: The interface for Cookies: signed and unsigned cookies based on Keygrip.

|   Name   |                                                                       Type                                                                        |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| keys     | <em><a href="#type-keygrip" title="Signing and verifying data (such as cookies or URLs) through a rotating credential system.">!Keygrip</a></em>  | The keys object constructed from passed keys (private, will be installed from options).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| secure   | <em>boolean</em>                                                                                                                                  | Explicitly specifies if the connection is secure (private, will be installed from options).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| __get*__ | <em>function(string, { signed: boolean }): (string \| undefined)</em>                                                                             | This extracts the cookie with the given name from the Cookie header in the request. If such a cookie exists, its value is returned. Otherwise, nothing is returned. `{ signed: true }` can optionally be passed as the second parameter options. In this case, a signature cookie (a cookie of same name ending with the .sig suffix appended) is fetched. If no such cookie exists, nothing is returned. If the signature cookie does exist, the provided Keygrip object is used to check whether the hash of cookie-name=cookie-value matches that of any registered key:<li>      If the signature cookie hash matches the first key, the original cookie value is returned.</li><li>      If the signature cookie hash matches any other key, the original cookie value is returned AND an outbound header is set to update the signature cookie's value to the hash of the first key. This enables automatic freshening of signature cookies that have become stale due to key rotation.</li><li>      If the signature cookie hash does not match any key, nothing is returned, and an outbound header with an expired date is used to delete the cookie.</li> |
| __set*__ | <em>function(string, ?string=, <a href="#type-cookieattributes" title="Used to generate the outbound cookie header.">!CookieAttributes</a>=)</em> | This sets the given cookie in the response and returns the current context to allow chaining. If the value is omitted, an outbound header with an expired date is used to delete the cookie.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

__<a name="type-cookiesoptions">`CookiesOptions`</a>__: Options for the constructor.

|  Name  |                                                                                   Type                                                                                    |                                         Description                                          |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| keys   | <em>!(Array&lt;string&gt; \| <a href="#type-keygrip" title="Signing and verifying data (such as cookies or URLs) through a rotating credential system.">Keygrip</a>)</em> | The array of keys, or the `Keygrip` object.                                                  |
| secure | <em>boolean</em>                                                                                                                                                          | Explicitly specifies if the connection is secure, rather than this module examining request. |

__<a name="type-cookiesetoptions">`CookieSetOptions`</a>__: How the cookie will be set.

|  Name  |       Type       |                                                                                                                                                                          Description                                                                                                                                                                           | Default |
| ------ | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| signed | <em>boolean</em> | Indicating whether the cookie is to be signed. If this is true, another cookie of the same name with the .sig suffix appended will also be sent, with a 27-byte url-safe base64 SHA1 value representing the hash of cookie-name=cookie-value against the first Keygrip key. This signature key is used to detect tampering the next time a cookie is received. | `false` |

__<a name="type-cookieattributes">`CookieAttributes`</a>__: Used to generate the outbound cookie header.

|   Name    |             Type             |                                                                                                                      Description                                                                                                                       | Default |
| --------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| maxAge    | <em>number</em>              | Represents the milliseconds from `Date.now()` for expiry.                                                                                                                                                                                              | -       |
| expires   | <em>!Date</em>               | Indicates the cookie's expiration date (expires at the end of session by default).                                                                                                                                                                     | -       |
| path      | <em>string</em>              | Indicates the path of the cookie.                                                                                                                                                                                                                      | `/`     |
| domain    | <em>string</em>              | Indicates the domain of the cookie.                                                                                                                                                                                                                    | -       |
| secure    | <em>boolean</em>             | Indicates whether the cookie is only to be sent over HTTPS (false by default for HTTP, true by default for HTTPS).                                                                                                                                     | -       |
| httpOnly  | <em>boolean</em>             | Indicates whether the cookie is only to be sent over HTTP(S), and not made available to client JavaScript.                                                                                                                                             | `true`  |
| sameSite  | <em>(boolean \| string)</em> | Indicates whether the cookie is a "same site" cookie. This can be set to `'strict'`, `'lax'`, or `true` (which maps to `'strict'`).                                                                                                                    | `false` |
| overwrite | <em>boolean</em>             | Indicates whether to overwrite previously set cookies of the same name. If this is true, all cookies set during the same request with the same name (regardless of path or domain) are filtered out of the Set-Cookie header when setting this cookie. | `false` |

<p align="center"><a href="#table-of-contents"><img src="/.documentary/section-breaks/2.svg?sanitize=true"></a></p>

## class Keygrip

This module already comes with [_Keygrip_](https://www.npmjs.com/package/keygrip) built in. This is because they are meant to be used together, so they were optimised together as well. The API is the same.

> _In cookies, there is no need to use instantiate Keygrip manually, when the keys can just be passed, i.e., if the keys are array, the `new Keygrip(array)` will be called by the constructor._

__<a name="type-keygrip">`Keygrip`</a>__: Signing and verifying data (such as cookies or URLs) through a rotating credential system.

|    Name     |                 Type                  |                                                                                                                                                                                                  Description                                                                                                                                                                                                  |
| ----------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| __sign*__   | <em>function(?): string</em>          | This creates a SHA1 HMAC based on the _first_ key in the keylist, and outputs it as a 27-byte url-safe base64 digest (base64 without padding, replacing `+` with `-` and `/` with `_`).                                                                                                                                                                                                                       |
| __index*__  | <em>function(?, string): number</em>  | This loops through all of the keys currently in the keylist until the digest of the current key matches the given digest, at which point the current index is returned. If no key is matched, -1 is returned. The idea is that if the index returned is greater than `0`, the data should be re-signed to prevent premature credential invalidation, and enable better performance for subsequent challenges. |
| __verify*__ | <em>function(?, string): boolean</em> | This uses `index` to return true if the digest matches any existing keys, and false otherwise.                                                                                                                                                                                                                                                                                                                |

The API is exposed so that custom validation algorithms can be implemented by extending the _Keygrip_ class.

<details>
<summary>Show <a name="keygrip-implementation">Keygrip Implementation</a></summary>

<table>
<tr><th><a href="src/Keygrip.js">Keygrip Class</a></th></tr>
<tr><td>

```js
/**
 * @implements {_goa.Keygrip}
 */
export default class Keygrip {
  constructor(keys, algorithm = 'sha1', encoding = 'base64') {
    if (!keys || !(0 in keys)) {
      throw new Error('Keys must be provided.')
    }
    this.algorithm = algorithm
    this.encoding = encoding
    this.keys = keys
  }
  sign(data) {
    return sign(data, this.algorithm, this.keys[0], this.encoding)
  }
  verify(data, digest) {
    return this.index(data, digest) > -1
  }
  index(data, digest) {
    for (let i = 0, l = this.keys.length; i < l; i++) {
      const sig = sign(data, this.algorithm, this.keys[i], this.encoding)
      if (constantTimeCompare(digest, sig)) return i
    }

    return -1
  }
}
```
</td></tr>
<tr><td>The implementation provides the <em>sign</em>, <em>verify</em> and <em>index</em> methods. The <em>Keygrip</em> instances provide mechanisms to rotate credentials by modifying the <strong>keys</strong> array. Since cookies' encoding and decoding will be based on the keys, it's important to maintain them across server restarts, however when required, their rotation can be performed with <code>keylist.unshift("SEKRIT4"); keylist.pop()</code> without having to restart the server.</td></tr>

</table>

</details>

<p align="center"><a href="#table-of-contents"><img src="/.documentary/section-breaks/3.svg?sanitize=true"></a></p>

## Express/Connect

The `express` and `connect` methods can be used to create middleware for the _Express_ and _Connect_ servers.

<table>
<tr><th>Connect Example</th></tr>
<tr><td>

```js
import connect from 'connect'
import aqt from '@rqt/aqt'
import { express as cookies } from '@goa/cookies'

const app = connect()

app.use(cookies(['keyboard cat']))
app.use('/', (req, res) => {
  // Get a cookie
  const lastVisit = req.cookies.get('LastVisit', { signed: true })

  // Set the cookie to a value
  res.cookies.set('LastVisit', new Date().toISOString(), { signed: true })

  if (!lastVisit) {
    res.setHeader('Content-Type', 'text/plain')
    res.end('Welcome, first time visitor!')
  } else {
    res.setHeader('Content-Type', 'text/plain')
    res.end('Welcome back! Nothing much changed since your last visit at ' + lastVisit + '.')
  }
})

const server = app.listen(0, async () => {
  const url = `http://localhost:${server.address().port}`
  console.log(url)
  let { body, headers } = await aqt(url)
  console.log(body, headers['set-cookie'].join('\n'))
  ;({ body } = await aqt(url, {
    headers: { Cookie: headers['set-cookie'] },
  }))
  console.log(body)
  server.close()
})
```
</td></tr>
<tr><td align="center">
<em>The output</em>
</td></tr>
<tr><td>

```
http://localhost:50528
Welcome, first time visitor! LastVisit=2019-07-19T22:56:14.654Z; path=/; httponly
LastVisit.sig=xihLkXgQ4sIQ7TyJ4hKYpoMnnAQ; path=/; httponly
Welcome back! Nothing much changed since your last visit at 2019-07-19T22:56:14.654Z.
```
</td></tr>
</table>

<p align="center"><a href="#table-of-contents"><img src="/.documentary/section-breaks/4.svg?sanitize=true"></a></p>

## Externs

The externs are provided via the `types/externs.js` file.

<details>
<summary>Show <a name="externs">Externs</a></summary>

<table>
<tr><th><a href="https://compiler.page">Compiler</a> <a href="types/externs.js">Externs</a></th></tr>
<tr><td>

```js
/**
 * @fileoverview
 * @externs
 */
/* typal types/index.xml externs */
/** @const */
var _goa = {}
/**
 * The interface for Cookies: signed and unsigned cookies based on Keygrip.
 * @interface
 */
_goa.Cookies
/**
 * The keys object constructed from passed keys (private, will be installed from options).
 * @type {(!_goa.Keygrip)|undefined}
 */
_goa.Cookies.prototype.keys
/**
 * Explicitly specifies if the connection is secure (private, will be installed from options).
 * @type {boolean|undefined}
 */
_goa.Cookies.prototype.secure
/**
 * This extracts the cookie with the given name from the Cookie header in the request. If such a cookie exists, its value is returned. Otherwise, nothing is returned. `{ signed: true }` can optionally be passed as the second parameter options. In this case, a signature cookie (a cookie of same name ending with the .sig suffix appended) is fetched. If no such cookie exists, nothing is returned. If the signature cookie does exist, the provided Keygrip object is used to check whether the hash of cookie-name=cookie-value matches that of any registered key:
      - If the signature cookie hash matches the first key, the original cookie value is returned.
      - If the signature cookie hash matches any other key, the original cookie value is returned AND an outbound header is set to update the signature cookie's value to the hash of the first key. This enables automatic freshening of signature cookies that have become stale due to key rotation.
      - If the signature cookie hash does not match any key, nothing is returned, and an outbound header with an expired date is used to delete the cookie.
 * @type {function(string, { signed: boolean }): (string|undefined)}
 */
_goa.Cookies.prototype.get
/**
 * This sets the given cookie in the response and returns the current context to allow chaining. If the value is omitted, an outbound header with an expired date is used to delete the cookie.
 * @type {function(string, ?string=, !_goa.CookieAttributes=)}
 */
_goa.Cookies.prototype.set
```
</td></tr>
<tr><td>The externs provide the Cookies interface with the get and set methods.</td></tr>

<tr><td>

```js
/**
 * @fileoverview
 * @externs
 */
/* typal types/options.xml externs */
/** @const */
var _goa = {}
/**
 * Options for the constructor.
 * @record
 */
_goa.CookiesOptions
/**
 * The array of keys, or the `Keygrip` object.
 * @type {(!(Array<string>|_goa.Keygrip))|undefined}
 */
_goa.CookiesOptions.prototype.keys
/**
 * Explicitly specifies if the connection is secure, rather than this module examining request.
 * @type {boolean|undefined}
 */
_goa.CookiesOptions.prototype.secure
/**
 * How the cookie will be set.
 * @typedef {{ signed: (boolean|undefined) }}
 */
_goa.CookieSetOptions
```
</td></tr>
<tr><td>The Cookies Options can be used in the constructor method of the <em>Cookies</em> class.</td></tr>
<tr><td>

```js
/**
 * @fileoverview
 * @externs
 */
/* typal types/attributes.xml externs */
/** @const */
var _goa = {}
/**
 * Used to generate the outbound cookie header.
 * @record
 */
_goa.CookieAttributes
/**
 * Represents the milliseconds from `Date.now()` for expiry.
 * @type {number|undefined}
 */
_goa.CookieAttributes.prototype.maxAge
/**
 * Indicates the cookie's expiration date (expires at the end of session by default).
 * @type {(!Date)|undefined}
 */
_goa.CookieAttributes.prototype.expires
/**
 * Indicates the path of the cookie. Default `/`.
 * @type {string|undefined}
 */
_goa.CookieAttributes.prototype.path
/**
 * Indicates the domain of the cookie.
 * @type {string|undefined}
 */
_goa.CookieAttributes.prototype.domain
/**
 * Indicates whether the cookie is only to be sent over HTTPS (false by default for HTTP, true by default for HTTPS).
 * @type {boolean|undefined}
 */
_goa.CookieAttributes.prototype.secure
/**
 * Indicates whether the cookie is only to be sent over HTTP(S), and not made available to client JavaScript. Default `true`.
 * @type {boolean|undefined}
 */
_goa.CookieAttributes.prototype.httpOnly
/**
 * Indicates whether the cookie is a "same site" cookie. This can be set to `'strict'`, `'lax'`, or `true` (which maps to `'strict'`).
 * @type {(boolean|string)|undefined}
 */
_goa.CookieAttributes.prototype.sameSite
/**
 * Indicates whether to overwrite previously set cookies of the same name. If this is true, all cookies set during the same request with the same name (regardless of path or domain) are filtered out of the Set-Cookie header when setting this cookie.
 * @type {boolean|undefined}
 */
_goa.CookieAttributes.prototype.overwrite
```
</td></tr>
<tr><td>The Cookies Attribute Records are the key-value pairs that are used to create string representation of the cookie, e.g., <code>httpOnly=true</code>.</td></tr>

<tr><td>

```js
/**
 * @fileoverview
 * @externs
 */
/* typal types/keygrip.xml externs */
/** @const */
var _goa = {}
/**
 * Signing and verifying data (such as cookies or URLs) through a rotating credential system.
 * @interface
 */
_goa.Keygrip
/**
 * This creates a SHA1 HMAC based on the _first_ key in the keylist, and outputs it as a 27-byte url-safe base64 digest (base64 without padding, replacing `+` with `-` and `/` with `_`).
 * @type {function(?): string}
 */
_goa.Keygrip.prototype.sign
/**
 * This loops through all of the keys currently in the keylist until the digest of the current key matches the given digest, at which point the current index is returned. If no key is matched, -1 is returned. The idea is that if the index returned is greater than `0`, the data should be re-signed to prevent premature credential invalidation, and enable better performance for subsequent challenges.
 * @type {function(?, string): number}
 */
_goa.Keygrip.prototype.index
/**
 * This uses `index` to return true if the digest matches any existing keys, and false otherwise.
 * @type {function(?, string): boolean}
 */
_goa.Keygrip.prototype.verify
```
</td></tr>
<tr><td><em>Keygrip</em> is the class that implements _goa.Keygrip interface with the 3 methods declared in the API. It is then called by the
<em>Cookies</em> instances to verify correct decoding of signed cookies.</td></tr>

</table>

</details>

<p align="center"><a href="#table-of-contents"><img src="/.documentary/section-breaks/5.svg?sanitize=true"></a></p>

## Copyright

Original [source, documentation and testing](https://github.com/pillarjs/cookies) by [Jed Schmidt](http://jed.is/) & Douglas Christopher Wilson.

---

<table>
  <tr>
    <th>
      <a href="https://artd.eco">
        <img src="https://raw.githubusercontent.com/wrote/wrote/master/images/artdeco.png" alt="Art Deco">
      </a>
    </th>
    <th>© <a href="https://artd.eco">Art Deco</a> for <a href="https://idio.cc">Idio</a> 2019</th>
    <th>
      <a href="https://idio.cc">
        <img src="https://avatars3.githubusercontent.com/u/40834161?s=100" width="100" alt="Idio">
      </a>
    </th>
    <th>
      <a href="https://www.technation.sucks" title="Tech Nation Visa">
        <img src="https://raw.githubusercontent.com/artdecoweb/www.technation.sucks/master/anim.gif"
          alt="Tech Nation Visa">
      </a>
    </th>
    <th><a href="https://www.technation.sucks">Tech Nation Visa Sucks</a></th>
  </tr>
</table>

<p align="center"><a href="#table-of-contents"><img src="/.documentary/section-breaks/-1.svg?sanitize=true"></a></p>