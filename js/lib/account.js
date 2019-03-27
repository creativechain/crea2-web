"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Created by ander on 27/09/18.
 */
var DEFAULT_ROLES = ['posting', 'active', 'owner', 'memo'];

var Account =
    /*#__PURE__*/
    function () {
        function Account(username, keys) {
            _classCallCheck(this, Account);

            this.username = username;
            this.keys = keys;
        }
        /**
         *
         * @param username
         * @param password
         * @param role
         * @returns {Account}
         */


        _createClass(Account, null, [{
            key: "generate",
            value: function generate(username, password) {
                var role = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'posting';
                var neededRoles = [];
                var keys = {};

                if (crea.auth.isWif(password)) {
                    if (role == null) {
                        role = 'unknown';
                    }

                    keys[role] = {
                        prv: password,
                        pub: crea.auth.wifToPublic(password)
                    };
                    return new Account(username, keys);
                } else {
                    if (DEFAULT_ROLES.indexOf(role) > -1) {
                        neededRoles.push(role);
                    } else {
                        throw 'Role not valid: ' + role;
                    }

                    var privKeys = crea.auth.getPrivateKeys(username, password, neededRoles);
                    neededRoles.forEach(function (r) {
                        keys[r] = {
                            prv: privKeys[r],
                            pub: privKeys[r + 'Pubkey']
                        };
                    });
                    return new Account(username, keys);
                } //TODO: LOGIN ERROR

            }
        }]);

        return Account;
    }();