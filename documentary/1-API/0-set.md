```## set => void
[["name","string"],
["value=", "?"],
["opts=", "CookieSetOptions&CookieAttributes"]]
```

This sets the given cookie in the response and returns the current context to allow chaining. If the value is omitted, an outbound header with an expired date is used to delete the cookie.

%TYPEDEF types/set.xml%

The [attributes](/wiki/Cookie-Attribute) accepted by the cookie instance are listed in wiki.

%~%