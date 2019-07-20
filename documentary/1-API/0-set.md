```## async set => void
[["name","string"],
["value", "?"],
["opts", "CookieSetOptions?"]]
```

This sets the given cookie in the response and returns the current context to allow chaining. If the value is omitted, an outbound header with an expired date is used to delete the cookie.

%TYPEDEF types/set.xml%

The attributes accepted by the cookie instance are listed in wiki.

<table>
<tr><th><kbd>🍪 <a href="../../wiki/Cookie-Attributes">Cookie Attributes</a></kbd></th></tr>
<!-- block-start -->
<tr><td>
<img src="/wiki/cookies.gif" alt="Cookies Attributes: domain, expires, httpOnly, maxAge, overwrite, path, sameSite, secure">
</td></tr>
<!-- <tr><td><md2html>


</md2html></td></tr> -->
<!-- /block-end -->
</table>

%~%