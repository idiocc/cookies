# @goa/cookies

[![npm version](https://badge.fury.io/js/@goa/cookies.svg)](https://npmjs.org/package/@goa/cookies)

`@goa/cookies` is [fork] Signed And Unsigned Cookies Based On Keygrip Written In ES6 And Optimised With JavaScri

```sh
yarn add @goa/cookies
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [`cookies(arg1: string, arg2?: boolean)`](#mynewpackagearg1-stringarg2-boolean-void)
  * [`_@goa/cookies.Config`](#type-_@goa/cookiesconfig)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/0.svg?sanitize=true"></a></p>

## API

The package is available by importing its default function:

```js
import cookies from '@goa/cookies'
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/1.svg?sanitize=true"></a></p>

## `cookies(`<br/>&nbsp;&nbsp;`arg1: string,`<br/>&nbsp;&nbsp;`arg2?: boolean,`<br/>`): void`

Call this function to get the result you want.

__<a name="type-_@goa/cookiesconfig">`_@goa/cookies.Config`</a>__: Options for the program.

|   Name    |       Type       |    Description    | Default |
| --------- | ---------------- | ----------------- | ------- |
| shouldRun | <em>boolean</em> | A boolean option. | `true`  |
| __text*__ | <em>string</em>  | A text to return. | -       |

```js
/* alanode example/ */
import cookies from '@goa/cookies'

(async () => {
  const res = await cookies({
    text: 'example',
  })
  console.log(res)
})()
```
```
example
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/2.svg?sanitize=true"></a></p>

## Copyright

(c) [Idio][1] 2019

[1]: https://idio.cc

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/-1.svg?sanitize=true"></a></p>