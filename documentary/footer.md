<!-- ## TODO

- [ ] Add a new item to the todo list. -->

<!-- <table> -->
<!-- <tr><th> -->

<!-- <kbd>🚄 [Cookies' Attributes](../../wiki/Cookie-Attributes)</kbd> -->
<!-- --- -->

<table>
<tr><th>

<kbd>🍪 [Cookie Attributes](../../wiki/Cookie-Attributes)</kbd>
---
</th></tr>
<!-- block-start -->
<tr><td>
<img src="/wiki/cookies.gif" alt="Cookies Attributes: domain, expires, httpOnly, maxAge, overwrite, path, sameSite, secure">
</td></tr>
</table>

Cookies can be used via express and connect easily by calling the middleware constructor functions to get middleware that can be installed on the app.

<kbd>🚄 [Express And Connect Middleware Constructor](../../wiki/Express-And-Connect)</kbd>
---

Cookies can be used via express and connect easily by calling the middleware constructor functions to get middleware that can be installed on the app.

<kbd>⚜️ [Keygrip](../../wiki/Keygrip)</kbd>
---

The _Keygrip_ can be passed in the _`keys`_ property of the constructor. By default, the new instance of _Keygrip_ will be created when an array of keys is passed, but custom implementations of _Keygrip_ which override the sign and verify functions can be passed to cookies.

<kbd>🔗 [View Compiler Externs](../../wiki/Compiler-Externs)</kbd>
---

The externs are required to compile the package yet keep the options' properties in tact, i.e. without renaming the properties. The API is preserved for 2nd level compilation in other packages, such as Goa, and is tested on the 1st level compilation of the package itself.

<!-- </th></tr> -->
<!-- block-start -->
<!-- <tr><td> -->
<!-- <img src="/wiki/cookies.gif" alt="Cookies Attributes: domain, expires, httpOnly, maxAge, overwrite, path, sameSite, secure"> -->
<!-- </td></tr> -->
<!-- <tr><td><md2html>


<!-- </md2html></td></tr> -->
<!-- /block-end -->
<!-- </table> -->

%~%

## Copyright & Status

Original [source, documentation and testing](https://github.com/pillarjs/cookies) by [Jed Schmidt](http://jed.is/) & Douglas Christopher Wilson.

Forked Off `cookies` 0.7.3 _Apr 24_

Current:
%NPM: cookies%

---

<IdioFooter />

%~ -1%