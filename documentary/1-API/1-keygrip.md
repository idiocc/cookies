## class Keygrip

This module already comes with [_Keygrip_](https://www.npmjs.com/package/keygrip) built in. This is because they are meant to be used together, so they were optimised together as well. The API is the same.

> _In cookies, there is no need to use instantiate Keygrip manually, when the keys can just be passed, i.e., if the keys are array, the `new Keygrip(array)` will be called by the constructor._

%TYPEDEF types/keygrip.xml%

The API is exposed so that custom validation algorithms can be implemented by extending the _Keygrip_ class.

<details>
<summary>Show [Keygrip Implementation](t)</summary>

<table>
<tr><th><a href="src/Keygrip.js">Keygrip Class</a></th></tr>
<!-- block-start -->
<tr><td>

%EXAMPLE: src/Keygrip%
</td></tr>
<tr><td><md2html>
The implementation provides the _sign_, _verify_ and _index_ methods. The _Keygrip_ instances provide mechanisms to rotate credentials by modifying the **keys** array. Since cookies' encoding and decoding will be based on the keys, it's important to maintain them across server restarts, however when required, their rotation can be performed with `keylist.unshift("SEKRIT4"); keylist.pop()` without having to restart the server.
</md2html></td></tr>
<!-- /block-end -->
<!-- block-start -->
<!-- <tr><td>

%FORK %
</td></tr>
<tr><td><md2html>


</md2html></td></tr> -->
<!-- /block-end -->
</table>

</details>

%~%