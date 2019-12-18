Keygrip is a tool to encrypt sessions using a set of keys. This module already comes with [_Keygrip_](https://www.npmjs.com/package/keygrip) built in. This is because they are meant to be used together, so they were optimised together as well.

> _In cookies, there is no need to use instantiate Keygrip manually, when the keys can just be passed, i.e., if the keys are array, the `new Keygrip(array)` will be called by the constructor._

<typedef narrow flatten slimFunctions>types/keygrip.xml</typedef>

The API is exposed so that custom signing and validation algorithms can be implemented by extending the _Keygrip_ class.

<table>
<tr><th><a href="../blob/master/src/Keygrip.js">Keygrip Class</a></th></tr>
<!-- block-start -->
<tr><td>

%EXAMPLE: src/Keygrip%
</td></tr>
<tr><td><md2html>
The implementation provides the _sign_, _verify_ and _index_ methods. The _Keygrip_ instances provide mechanisms to rotate credentials by modifying the **keys** array. Since cookies' encoding and decoding will be based on the keys, it's important to maintain them across server restarts, however when required, their rotation can be performed with `keylist.unshift("SEKRIT4"); keylist.pop()` without having to restart the server.
</md2html></td></tr>
<!-- block-start -->
<tr><td>

%EXAMPLE: src/keygrip-lib/sign%
</td></tr>
<tr><td><md2html>
The signing consists of generating a hash for the given object with an algorithm (default is `sha1`.)
</md2html></td></tr>

<!-- block-start -->
<tr><td>

%EXAMPLE: src/keygrip-lib/ctc%
</td></tr>
<tr><td><md2html>
The verification is performed by finding a key for which the given digest (hash) of data exists. The comparison is done in constant time to prevent attacks.
</md2html></td></tr>

</table>

Original package:
%NPM: keygrip%