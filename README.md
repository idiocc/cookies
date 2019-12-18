# @goa/cookies

[![npm version](https://badge.fury.io/js/%40goa%2Fcookies.svg)](https://www.npmjs.com/package/@goa/cookies)

`@goa/cookies` is a fork of <kbd>🗝 [Signed And Unsigned Cookies Based On Keygrip](https://github.com/pillarjs/cookies)</kbd> Written In ES6, Annotated With [Externs](/types/externs) And Optimised With [JavaScript Compiler](https://www.compiler.page).

```sh
yarn add @goa/cookies
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [class Cookies](#class-cookies)
  * [`constructor(request, response, options=): Cookies`](#constructorrequest-httpincomingmessageresponse-httpserverresponseoptions-cookiesoptions-cookies)
    * [`CookiesOptions`](#type-cookiesoptions)
  * [`set(name, value=, attributes=): void`](#setname-stringvalue-stringattributes-cookiesetoptions-void)
    * [`CookieSetOptions`](#type-cookiesetoptions)
  * [`get(name, opts): string|undefined`](#getname-stringopts--signed-boolean--stringundefined)
- [Wiki](#wiki)
- [Copyright & Status](#copyright--status)

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/0.svg?sanitize=true">
</a></p>

## API

The package is available by importing its default function:

```js
import Cookies, { Keygrip, express, connect } from '@goa/cookies'
```

The deprecated `secureProxy`, `maxage` attributes of a cookie have been removed. The constructor only accepts the `{ keys: Array<string>|Keygrip }` option, without being able to pass keys as an array, or _Keygrip_ as an object. Please make sure no middleware is using these options.

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/1.svg?sanitize=true">
</a></p>

## class Cookies

_Cookies_ is a Node.JS module for getting and setting HTTP(S) cookies. Cookies can be signed to prevent tampering, using Keygrip. It can be used with the built-in _Node.JS_ HTTP library, or as _Connect/Express_ middleware.

### <code><ins>constructor</ins>(</code><sub><br/>&nbsp;&nbsp;`request: !http.IncomingMessage,`<br/>&nbsp;&nbsp;`response: !http.ServerResponse,`<br/>&nbsp;&nbsp;`options=: !CookiesOptions,`<br/></sub><code>): <i>Cookies</i></code>

This creates a cookie jar corresponding to the current _request_ and _response_, additionally passing an object options.

A [Keygrip](#class-keygrip) object or an array of keys can optionally be passed as _options.keys_ to enable cryptographic signing based on SHA1 HMAC, using rotated credentials.

A Boolean can optionally be passed as _options.secure_ to explicitly specify if the connection is secure, rather than this module examining request.

Note that since this only saves parameters without any other processing, it is very lightweight. Cookies are only parsed on demand when they are accessed.

__<a name="type-cookiesoptions">`CookiesOptions`</a>__: Options for the constructor.

|  Name  |                    Type                    |                                         Description                                          |
| ------ | ------------------------------------------ | -------------------------------------------------------------------------------------------- |
| keys   | <em>!(Array&lt;string&gt; \| Keygrip)</em> | The array of keys, or the `Keygrip` object.                                                  |
| secure | <em>boolean</em>                           | Explicitly specifies if the connection is secure, rather than this module examining request. |

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
http://localhost:55787
Welcome, first time visitor! LastVisit=2019-12-18T21:05:54.405Z; path=/; httponly
LastVisit.sig=RosnWirAT9-4bEgbxceOxUEQv-c; path=/; httponly
Welcome back! Nothing much changed since your last visit at 2019-12-18T21:05:54.405Z.
```
</td></tr>
</table>

The overview of the _Cookies_ interface is found [in wiki](../../wiki/Cookies).

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/2.svg?sanitize=true">
</a></p>

### <code><ins>set</ins>(</code><sub><br/>&nbsp;&nbsp;`name: string,`<br/>&nbsp;&nbsp;`value=: ?string,`<br/>&nbsp;&nbsp;`attributes=: !CookieSetOptions,`<br/></sub><code>): <i>void</i></code>

This sets the given cookie in the response and returns the current context to allow chaining. If the value is omitted, an outbound header with an expired date is used to delete the cookie.

__<a name="type-cookiesetoptions">`CookieSetOptions`</a> extends `CookieAttributes`__: How the cookie will be set.


|  Name  |       Type       |                                                                                                                                                                          Description                                                                                                                                                                           | Default |
| ------ | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| signed | <em>boolean</em> | Indicating whether the cookie is to be signed. If this is true, another cookie of the same name with the .sig suffix appended will also be sent, with a 27-byte url-safe base64 SHA1 value representing the hash of cookie-name=cookie-value against the first Keygrip key. This signature key is used to detect tampering the next time a cookie is received. | `false` |

The [attributes](/wiki/Attributes) accepted by the cookie instance are listed in wiki.

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/3.svg?sanitize=true">
</a></p>

### <code><ins>get</ins>(</code><sub><br/>&nbsp;&nbsp;`name: string,`<br/>&nbsp;&nbsp;`opts: { signed: boolean },`<br/></sub><code>): <i>string|undefined</i></code>

Returns the cookie with the given name if it was previously set. The `signed` option might be passed to specify if a signed cookie is being accessed.

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/4.svg?sanitize=true">
</a></p>

## Wiki

Wiki contains the following pages with additional information about the package.

<table>
<tr><td align="center">

<kbd>🍪 [Cookie Attributes](../../wiki/Attributes)</kbd>
===
</td></tr>
<tr><td>
<a href="https://github.com/idiocc/cookies/wiki/Cookie-Attributes"><img src="/wiki/cookies.gif" alt="Cookies Attributes: domain, expires, httpOnly, maxAge, overwrite, path, sameSite, secure"></a>
</td></tr>
</table>

<table>
<tr><td align="center">

<kbd>🚄 [Express And Connect Middleware Constructor](../../wiki/Express-And-Connect)</kbd>
===
</td></tr>
<tr><td>
Cookies can be used via express and connect easily by calling the middleware constructor functions to get middleware that can be installed on the app.
</td></tr>

<tr><td align="center">

<kbd>⚜️ [Keygrip](../../wiki/Keygrip)</kbd>
===
</td></tr>
<tr><td>The <em>Keygrip</em> can be passed in the <em><code>keys</code></em> property of the constructor. By default, the new instance of <em>Keygrip</em> will be created when an array of keys is passed, but custom implementations of <em>Keygrip</em> which override the sign and verify functions can be passed to cookies.
</td></tr>

<tr><td align="center">

<kbd>🔗 [View Compiler Externs](../../wiki/Externs)</kbd>
===
</td></tr>
<tr><td>
The externs are required to compile the package yet keep the options' properties in tact, i.e. without renaming the properties. The API is preserved for 2nd level compilation in other packages, such as Goa, and is tested on the 1st level compilation of the package itself.
</td></tr>
</table>


---

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/5.svg?sanitize=true">
</a></p>


## Copyright & Status

Original [source, documentation and testing](https://github.com/pillarjs/cookies) by [Jed Schmidt](http://jed.is/) & Douglas Christopher Wilson.

Forked Off `cookies` 0.7.3 _Apr 24_

Current:
[![npm version](https://badge.fury.io/js/cookies.svg)](https://www.npmjs.com/package/cookies)

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

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/-1.svg?sanitize=true">
</a></p>