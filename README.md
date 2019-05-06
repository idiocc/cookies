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
  * [`_goa.Cookies`](#type-_goacookies)
  * [`_goa.CookiesOptions`](#type-_goacookiesoptions)
  * [`_goa.CookieAttributes`](#type-_goacookieattributes)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/0.svg?sanitize=true"></a></p>

## API

The package is available by importing its default function:

```js
import Cookies from '@goa/cookies'
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/1.svg?sanitize=true"></a></p>

## class Cookies

_Cookies_ is a Node.JS module for getting and setting HTTP(S) cookies. Cookies can be signed to prevent tampering, using Keygrip. It can be used with the built-in _Node.JS_ HTTP library, or as _Connect/Express_ middleware.

## `constructor(`<br/>&nbsp;&nbsp;`request: IncomingMessage,`<br/>&nbsp;&nbsp;`response: ServerResponse,`<br/>&nbsp;&nbsp;`options: CookiesOptions,`<br/>`): Cookies`

This creates a cookie jar corresponding to the current request and response, additionally passing an object options.

A Keygrip object or an array of keys can optionally be passed as options.keys to enable cryptographic signing based on SHA1 HMAC, using rotated credentials.

A Boolean can optionally be passed as options.secure to explicitally specify if the connection is secure, rather than this module examining request.

Note that since this only saves parameters without any other processing, it is very lightweight. Cookies are only parsed on demand when they are accessed.

```js
/* alanode example/ */
import Cookies from '@goa/cookies'
import aqt from '@rqt/aqt'
import { createServer } from 'http'

// Optionally define keys to sign cookie values
// to prevent client tampering
const keys = ['keyboard cat']

const server = createServer(function (req, res) {
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
```
http://localhost:64337
Welcome, first time visitor! LastVisit=2019-05-06T04:32:54.296Z; path=/; httponly
LastVisit.sig=8JAKPzczSpT9bihiVG8IsLMEr0Q; path=/; httponly
Welcome back! Nothing much changed since your last visit at 2019-05-06T04:32:54.296Z.
```

__<a name="type-_goacookies">`_goa.Cookies`</a>__: Signed and unsigned cookies based on Keygrip.

|   Name    |                                                                           Type                                                                           |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| __keys*__ | <em>!_goa.Keygrip</em>                                                                                                                                   | The keys object constructed from passed keys.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| secure    | <em>boolean</em>                                                                                                                                         | Explicitly specifies if the connection is secure.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| __get*__  | <em>function(string, { signed: boolean }): string</em>                                                                                                   | This extracts the cookie with the given name from the Cookie header in the request. If such a cookie exists, its value is returned. Otherwise, nothing is returned. `{ signed: true }` can optionally be passed as the second parameter options. In this case, a signature cookie (a cookie of same name ending with the .sig suffix appended) is fetched. If no such cookie exists, nothing is returned.<br/>      If the signature cookie does exist, the provided Keygrip object is used to check whether the hash of cookie-name=cookie-value matches that of any registered key:<li>      If the signature cookie hash matches the first key, the original cookie value is returned.</li><li>      If the signature cookie hash matches any other key, the original cookie value is returned AND an outbound header is set to update the signature cookie's value to the hash of the first key. This enables automatic freshening of signature cookies that have become stale due to key rotation.</li><li>      If the signature cookie hash does not match any key, nothing is returned, and an outbound header with an expired date is used to delete the cookie.</li> |
| __set*__  | <em>function(string, string=, <a href="#type-_goacookieattributes" title="Used to generate the outbound cookie header.">_goa.CookieAttributes</a>=)</em> | This sets the given cookie in the response and returns the current context to allow chaining. If the value is omitted, an outbound header with an expired date is used to delete the cookie.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |

__<a name="type-_goacookiesoptions">`_goa.CookiesOptions`</a>__: Options for the constructor.

|   Name    |                      Type                       |                                         Description                                          |
| --------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------- |
| __keys*__ | <em>!(Array&lt;string&gt; \| _goa.Keygrip)</em> | The array of keys, or the `Keygrip` object.                                                  |
| secure    | <em>boolean</em>                                | Explicitly specifies if the connection is secure, rather than this module examining request. |

__<a name="type-_goacookieattributes">`_goa.CookieAttributes`</a>__: Used to generate the outbound cookie header.

|   Name    |             Type             |                                                                                                                                                                          Description                                                                                                                                                                           | Default |
| --------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| maxAge    | <em>number</em>              | Represents the milliseconds from Date.now() for expiry.                                                                                                                                                                                                                                                                                                        | -       |
| expires   | <em>Date</em>                | Indicates the cookie's expiration date (expires at the end of session by default).                                                                                                                                                                                                                                                                             | -       |
| path      | <em>string</em>              | Indicates the path of the cookie.                                                                                                                                                                                                                                                                                                                              | `/`     |
| domain    | <em>string</em>              | Indicates the domain of the cookie.                                                                                                                                                                                                                                                                                                                            | -       |
| secure    | <em>boolean</em>             | Indicates whether the cookie is only to be sent over HTTPS (false by default for HTTP, true by default for HTTPS).                                                                                                                                                                                                                                             | -       |
| httpOnly  | <em>number</em>              | Indicates whether the cookie is only to be sent over HTTP(S), and not made available to client JavaScript.                                                                                                                                                                                                                                                     | `true`  |
| sameSite  | <em>(boolean \| string)</em> | Indicates whether the cookie is a "same site" cookie. This can be set to `'strict'`, `'lax'`, or `true` (which maps to `'strict'`).                                                                                                                                                                                                                            | `false` |
| signed    | <em>boolean</em>             | Indicating whether the cookie is to be signed. If this is true, another cookie of the same name with the .sig suffix appended will also be sent, with a 27-byte url-safe base64 SHA1 value representing the hash of cookie-name=cookie-value against the first Keygrip key. This signature key is used to detect tampering the next time a cookie is received. | `false` |
| overwrite | <em>boolean</em>             | Indicates whether to overwrite previously set cookies of the same name. If this is true, all cookies set during the same request with the same name (regardless of path or domain) are filtered out of the Set-Cookie header when setting this cookie.                                                                                                         | `false` |

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/2.svg?sanitize=true"></a></p>



## Copyright

Original [source, documentation and testing](https://github.com/pillarjs/cookies) by [Jed Schmidt](http://jed.is/) & Douglas Christopher Wilson.

---

<table>
  <tr>
    <th>
      <a href="https://artd.eco">
        <img src="https://raw.githubusercontent.com/wrote/wrote/master/images/artdeco.png" alt="Art Deco" />
      </a>
    </th>
    <th>© <a href="https://artd.eco">Art Deco</a> for <a href="https://idio.cc">Idio</a> 2019</th>
    <th>
      <a href="https://idio.cc">
        <img src="https://avatars3.githubusercontent.com/u/40834161?s=100" width="100" alt="Idio" />
      </a>
    </th>
    <th>
      <a href="https://www.technation.sucks" title="Tech Nation Visa">
        <img src="https://raw.githubusercontent.com/artdecoweb/www.technation.sucks/master/anim.gif"
          alt="Tech Nation Visa" />
      </a>
    </th>
    <th><a href="https://www.technation.sucks">Tech Nation Visa Sucks</a></th>
  </tr>
</table>

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/-1.svg?sanitize=true"></a></p>