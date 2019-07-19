## Externs

The externs are provided via the `types/externs.js` file.

<details>
<summary>Show [Externs](t)</summary>

<table>
<tr><th><a href="https://compiler.page">Compiler</a> <a href="types/externs.js">Externs</a></th></tr>
<!-- block-start -->
<tr><td>

%EXAMPLE: types/externs/cookies.js%
</td></tr>
<tr><td><md2html>
The externs provide the Cookies interface, the Cookies Options and the Cookies Attribute Records. Those are needed to ensure the contract implementation, configurable inputs and to ensure correct serialisation of cookies when writing the response.
</md2html></td></tr>

<!-- block-start -->
<tr><td>

%EXAMPLE: types/externs/keygrip.js%
</td></tr>
<tr><td><md2html>
_Keygrip_ is the class that implements _goa.Keygrip interface with the 3 methods declared in the API. It is then called by the
_Cookies_ instances to verify correct decoding of signed cookies.
</md2html></td></tr>

</table>

</details>

%~%