The externs are provided via the `types/externs` directory.

<!-- <details>
<summary>Show [Externs](t)</summary> -->

<table>
<tr><th><a href="https://compiler.page">Compiler</a> <a href="../blob/master/types/externs">Externs</a></th></tr>
<!-- block-start -->
<tr><td>

%EXAMPLE: ../cookies/types/externs/cookies%
</td></tr>
<tr><td><md2html>
The externs provide the Cookies interface with the get and set methods.

</md2html></td></tr>

<!-- block-start -->
<!-- block-start -->
<tr><td>

%EXAMPLE: ../cookies/types/externs/options%
</td></tr>
<tr><td><md2html>
The Cookies Options can be used in the constructor method of the _Cookies_ class.
</md2html></td></tr>
<!-- block-start -->
<tr><td>

%EXAMPLE: ../cookies/types/externs/attributes%
</td></tr>
<tr><td><md2html>
The Cookies Attribute Records are the key-value pairs that are used to create string representation of the cookie, e.g., `httpOnly=true`.
</md2html></td></tr>

<!-- block-start -->
<tr><td>

%EXAMPLE: ../cookies/types/externs/keygrip%
</td></tr>
<tr><td><md2html>
_Keygrip_ is the class that implements _goa.Keygrip interface with the 3 methods declared in the API. It is then called by the
_Cookies_ instances to verify correct decoding of signed cookies.
</md2html></td></tr>

</table>

<!-- </details> -->