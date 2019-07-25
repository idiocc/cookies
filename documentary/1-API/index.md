## API

The package is available by importing its default function:

```js
import Cookies, { Keygrip, express, connect } from '@goa/cookies'
```

The deprecated `secureProxy`, `maxage` attributes of a cookie have been removed. The constructor only accepts the `{ keys: Array<string>|Keygrip }` option, without being able to pass keys as an array, or _Keygrip_ as an object. Please make sure no middleware is using these options.

%~%

## class Cookies

_Cookies_ is a Node.JS module for getting and setting HTTP(S) cookies. Cookies can be signed to prevent tampering, using Keygrip. It can be used with the built-in _Node.JS_ HTTP library, or as _Connect/Express_ middleware.

```## constructor => Cookies
[
  ["request", "IncomingMessage"],
  ["response", "ServerResponse"],
  ["options", "CookiesOptions"]
]
```

This creates a cookie jar corresponding to the current _request_ and _response_, additionally passing an object options.

A [Keygrip](#class-keygrip) object or an array of keys can optionally be passed as _options.keys_ to enable cryptographic signing based on SHA1 HMAC, using rotated credentials.

A Boolean can optionally be passed as _options.secure_ to explicitly specify if the connection is secure, rather than this module examining request.

Note that since this only saves parameters without any other processing, it is very lightweight. Cookies are only parsed on demand when they are accessed.

%TYPEDEF types/options.xml%

<table>
<tr><th>Node.JS HTTP Server Example</th></tr>
<tr><td>

%EXAMPLE: example, ../src => @goa/cookies%
</td></tr>
<tr><td align="center">
<em>The output</em>
</td></tr>
<tr><td>

%FORK example%
</td></tr>
</table>

The overview of the _Cookies_ interface is found [in wiki](../../wiki/Cookies).

%~%