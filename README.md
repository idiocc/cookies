# @goa/cookies

[![npm version](https://badge.fury.io/js/%40goa%2Fcookies.svg)](https://npmjs.org/package/@goa/cookies)

`@goa/cookies` is a fork of <kbd>🗝 [Signed And Unsigned Cookies Based On Keygrip](https://github.com/pillarjs/cookies)</kbd> Written In ES6, Annotated With [Externs](/types/externs) And Optimised With [JavaScript Compiler](https://compiler.page).

<table><tr><td>
  
  The original module was edited with annotations and other changes required for it to be used in [`@goa/koa`](https://artdecocode.com/goa/): _Koa_ web server [compiled](https://compiler.page) with _Closure Compiler_ using [**Depack**](https://artdecocode.com/depack/) into a single file library (with 1 dependency such as mime-db).

  <details><summary>Read more about the compilation.</summary>

  All dependencies are specified as dev dependencies because they are flattened into a single JS file by the compiler, unless the special `require(/* depack ok */ 'modulejs')` was called, which will require the package at run-time, for instance this is how mime-db is required by Goa.

  The package specifies the following entry points:

  - <kbd>[commonjs/main](/compile/index.js)</kbd>: the _require_ entry optimised with compiler. Used for individual consumption of the package's API.
      ```m
      compile
      ├── cookies.js
      ├── cookies.js.map
      └── index.js
      ```
  - <kbd>[es6/module](/src/index.js)</kbd>: the source code that can be used in compilation of other packages, e.g., `@goa/goa`.
      ```m
      src
      ├── Cookie.js
      ├── Keygrip.js
      ├── depack.js
      └── index.js
      ```

  </details></td><td>

The tests were rewritten using [context testing](https://contexttesting.com). The [Http Context](https://npmjs.org/@contexts/http), in particular the Cookie Tester was used to assert on presence of entries, and their attributes.<details><summary>Show the tests.</summary>

```js
'with "secure: true" constructor option': {
  async 'sets secure attribute on unencrypted connection'(
    { start, c }) {
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
  async 'sets secure attribute on unencrypted connection'(
    { start, c }) {
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
```
</details></td></tr></table>

```sh
yarn add @goa/cookies
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [class Cookies](#class-cookies)
- [`constructor(request: IncomingMessage, response: ServerResponse, options: CookiesOptions): Cookies`](#constructorrequest-incomingmessageresponse-serverresponseoptions-cookiesoptions-cookies)
  * [`CookiesOptions`](#type-cookiesoptions)
- [`async set(name: string, value: ?, opts: CookieSetOptions?): void`](#async-setname-stringvalue-opts-cookiesetoptions-void)
  * [`CookieSetOptions`](#type-cookiesetoptions)
- [class Keygrip](#class-keygrip)
  * [`Keygrip`](#type-keygrip)
  * [Keygrip Implementation](#keygrip-implementation)
- [<kbd>🚄 Express And Connect Middleware Constructor</kbd>](#-express-and-connect-middleware-constructor)
- [Copyright & Status](#copyright--status)

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

`import('http').IncomingMessage` __<a name="type-httpincomingmessage">`http.IncomingMessage`</a>__: The client request.

`import('http').ServerResponse` __<a name="type-httpserverresponse">`http.ServerResponse`</a>__: The server response.

__<a name="type-cookiesoptions">`CookiesOptions`</a>__: Options for the constructor.

|  Name  |                                                                                   Type                                                                                    |                                         Description                                          |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| keys   | <em>!(Array&lt;string&gt; \| <a href="#type-keygrip" title="Signing and verifying data (such as cookies or URLs) through a rotating credential system.">Keygrip</a>)</em> | The array of keys, or the `Keygrip` object.                                                  |
| secure | <em>boolean</em>                                                                                                                                                          | Explicitly specifies if the connection is secure, rather than this module examining request. |

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
http://localhost:52300
Welcome, first time visitor! LastVisit=2019-07-19T23:33:16.481Z; path=/; httponly
LastVisit.sig=pGJqx5mfYbdnHFP4goSOsWkvomk; path=/; httponly
Welcome back! Nothing much changed since your last visit at 2019-07-19T23:33:16.481Z.
```
</td></tr>
</table>

The overview of the _Cookies_ interface is found [in wiki](../../wiki/Cookies-Class).

<p align="center"><a href="#table-of-contents"><img src="/.documentary/section-breaks/2.svg?sanitize=true"></a></p>

## `async set(`<br/>&nbsp;&nbsp;`name: string,`<br/>&nbsp;&nbsp;`value: ?,`<br/>&nbsp;&nbsp;`opts: CookieSetOptions?,`<br/>`): void`

This sets the given cookie in the response and returns the current context to allow chaining. If the value is omitted, an outbound header with an expired date is used to delete the cookie.

__<a name="type-cookiesetoptions">`CookieSetOptions`</a>__: How the cookie will be set.

|  Name  |       Type       |                                                                                                                                                                          Description                                                                                                                                                                           | Default |
| ------ | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| signed | <em>boolean</em> | Indicating whether the cookie is to be signed. If this is true, another cookie of the same name with the .sig suffix appended will also be sent, with a 27-byte url-safe base64 SHA1 value representing the hash of cookie-name=cookie-value against the first Keygrip key. This signature key is used to detect tampering the next time a cookie is received. | `false` |

The attributes accepted by the cookie instance are listed in wiki.

<table>
<tr><th><kbd>🍪 <a href="../../wiki/Cookie-Attributes">Cookie Attributes</a></kbd></th></tr>
<tr><td>
<img src="/wiki/cookies.gif" alt="Cookies Attributes: domain, expires, httpOnly, maxAge, overwrite, path, sameSite, secure">
</td></tr>
</table>

<p align="center"><a href="#table-of-contents"><img src="/.documentary/section-breaks/3.svg?sanitize=true"></a></p>

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

<p align="center"><a href="#table-of-contents"><img src="/.documentary/section-breaks/4.svg?sanitize=true"></a></p>

<kbd>🚄 [Express And Connect Middleware Constructor](../../wiki/Express-And-Connect)</kbd>
---

</table>


## Copyright & Status

Original [source, documentation and testing](https://github.com/pillarjs/cookies) by [Jed Schmidt](http://jed.is/) & Douglas Christopher Wilson.

Forked Off `cookies` 0.7.3 _Apr 24_

Current:
[![npm version](https://badge.fury.io/js/cookies.svg)](https://npmjs.org/package/cookies)

---

<table>
  <tr>
    <th>
      <a href="https://artd.eco">
        <img width="100" src="https://raw.githubusercontent.com/wrote/wrote/master/images/artdeco.png"
          alt="Art Deco">
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
        <img width="100" src="https://raw.githubusercontent.com/idiocc/cookies/master/wiki/arch4.jpg"
          alt="Tech Nation Visa">
      </a>
    </th>
    <th><a href="https://www.technation.sucks">Tech Nation Visa Sucks</a></th>
  </tr>
</table>

<p align="center"><a href="#table-of-contents"><img src="/.documentary/section-breaks/-1.svg?sanitize=true"></a></p>