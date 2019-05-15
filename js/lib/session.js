"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Created by ander on 27/09/18.
 */
var Session =
    /*#__PURE__*/
    function () {
        /**
         *
         * @param {Account} account
         * @param keepAlive
         */
        function Session(account) {
            var keepAlive = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            _classCallCheck(this, Session);

            this.account = account;
            this.keepAlive = keepAlive;
        }

        _createClass(Session, [{
            key: "login",
            value: function login(callback) {
                var that = this;
                crea.api.getState('@' + this.account.username, function (err, result) {
                    if (err) {
                        callback(err);
                    } else {
                        var accountData = result;

                        if (accountData.accounts[that.account.username]) {
                            accountData.user = parseAccount(accountData.accounts[that.account.username]);
                            crea.formatter.estimateAccountValue(accountData.user).then(function (value) {
                                accountData.user.estimate_account_value = value;
                            });

                            var auths = Object.keys(that.account.keys);
                            var logged = true;
                            auths.some(function (r) {
                                var pubKey;
                                var auth = r;

                                if (auth === 'unknown') {
                                    console.log(DEFAULT_ROLES);
                                    DEFAULT_ROLES.some(function (role) {
                                        if (role === 'memo') {
                                            pubKey = accountData.user[role + '_key'];
                                        } else {
                                            pubKey = accountData.user[role].key_auths[0][0];
                                        }

                                        if (that.account.keys[auth].pub === pubKey) {
                                            that.account.keys[role] = clone(that.account.keys[auth]);
                                            delete that.account.keys[auth];
                                            auth = role;
                                            return true;
                                        }
                                    });
                                } else if (auth === 'memo') {
                                    pubKey = accountData.user[auth + '_key'];
                                } else {
                                    pubKey = accountData.user[auth].key_auths[0][0];
                                }

                                logged = that.account.keys[auth].pub === pubKey;
                                return logged;
                            });

                            if (logged) {
                                //Set Account lang
                                localStorage.setItem(CREARY.LANG, accountData.user.metadata.lang);
                                callback(null, accountData);
                            } else {
                                callback(Errors.USER_LOGIN_ERROR, accountData);
                            }
                        } else {
                            //User not exists
                            //Set default lang if it is not set
                            if (localStorage.getItem(CREARY.LANG) === null) {
                                localStorage.setItem(CREARY.LANG, getNavigatorLanguage());
                            }

                            callback(Errors.USER_NOT_FOUND);
                        }
                    }
                });
            }
        }, {
            key: "save",
            value: function save() {
                var session = jsonstring(this);

                if (this.keepAlive) {
                    localStorage.setItem(CREARY.SESSION, session);
                    sessionStorage.setItem(CREARY.SESSION, false);
                } else {
                    sessionStorage.setItem(CREARY.SESSION, session);
                    localStorage.setItem(CREARY.SESSION, false);
                }
            }
        }, {
            key: "logout",
            value: function logout() {
                localStorage.setItem(CREARY.SESSION, false);
                sessionStorage.setItem(CREARY.SESSION, false);
            }
            /**
             *
             * @param username
             * @param password
             * @param role
             * @returns {Session}
             */

        }], [{
            key: "create",
            value: function create(username, password, role) {
                var account = Account.generate(username, password, role);
                return new Session(account);
            }
            /**
             *
             * @returns {Session}
             */

        }, {
            key: "getAlive",
            value: function getAlive() {
                var session = jsonify(localStorage.getItem(CREARY.SESSION));

                if (session.account) {
                    return new Session(session.account, session.keepAlive);
                }

                session = jsonify(sessionStorage.getItem(CREARY.SESSION));

                if (session.account) {
                    return new Session(session.account, session.keepAlive);
                }

                return false;
            }
        }]);

        return Session;
    }();