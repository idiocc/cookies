## API

The package is available by importing its default function:

```js
import Cookies, { Keygrip } from '@goa/cookies'
```

The deprecated `secureProxy`, `maxage` attributes of a cookie has been removed. The constructor only accepts the `{ keys: Array<string>|Keygrip }` option, without being able to pass keys as an array, or _Keygrip_ as an object. Please make sure no middleware is using these options.

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

This creates a cookie jar corresponding to the current request and response, additionally passing an object options.

A Keygrip object or an array of keys can optionally be passed as options.keys to enable cryptographic signing based on SHA1 HMAC, using rotated credentials.

A Boolean can optionally be passed as options.secure to explicitally specify if the connection is secure, rather than this module examining request.

Note that since this only saves parameters without any other processing, it is very lightweight. Cookies are only parsed on demand when they are accessed.

%EXAMPLE: example, ../src => @goa/cookies%
%FORK example%

%TYPEDEF types/index.xml%

%~%