```## set => void
[["name","string"],
["value=", "?"],
["opts=", "CookieSetOptions&CookieAttributes"]]
```

This sets the given cookie in the response and returns the current context to allow chaining. If the value is omitted, an outbound header with an expired date is used to delete the cookie.

<typedef flatten>types/set.xml</typedef>

The [attributes](/wiki/Attributes) accepted by the cookie instance are listed in wiki.

%~%