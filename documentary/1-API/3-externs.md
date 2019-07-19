## Externs

The externs are provided via the `types/externs.js` file.

<details>
<summary>Show [Externs](t)</summary>

<table>
<tr><th><a href="types/externs.js">Cookies Externs</a></th></tr>
<!-- block-start -->
<tr><td>

%EXAMPLE: src/Keygrip%
</td></tr>
<tr><td><md2html>
The implementation provides the _sign_, _verify_ and _index_ methods. The _Keygrip_ instances provide mechanisms to rotate credentials by modifying the **keys** array. Since cookies' encoding and decoding will be based on the keys, it's important to maintain them across server restarts, however when required, their rotation can be performed with `keylist.unshift("SEKRIT4"); keylist.pop()` without having to restart the server.
</md2html></td></tr>

</table>

</details>

%~%