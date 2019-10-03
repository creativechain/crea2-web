/**
 * Created by ander on 27/09/18.
 */

class Session {

    /**
     *
     * @param {Account} account
     * @param keepAlive
     */
    constructor(account, keepAlive=true) {
        this.account = account;
        this.keepAlive = keepAlive;
    }

    login(callback) {
        let that = this;
        crea.api.getState('@' + this.account.username, function (err, result) {
            if (err) {
                callback(err);
            } else {

                let accountData = result;

                if (accountData.accounts[that.account.username]) {
                    accountData.user = parseAccount(accountData.accounts[that.account.username]);

                    crea.formatter.estimateAccountValue(accountData.user)
                        .then(function (value) {
                            accountData.user.estimate_account_value = value;
                        });

                    let auths = Object.keys(that.account.keys);
                    let logged = true;

                    auths.some(function (r) {
                        let pubKey;
                        let auth = r;
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
                            })

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
        })
    }

    save() {
        let session = jsonstring(this);
        if (this.keepAlive) {
            localStorage.setItem(CREARY.SESSION, session);
            sessionStorage.setItem(CREARY.SESSION, false);
        } else {
            sessionStorage.setItem(CREARY.SESSION, session);
            localStorage.setItem(CREARY.SESSION, false);
        }
    }

    logout() {
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
    static create(username, password, role) {
        let account = Account.generate(username, password, role);
        return new Session(account);
    }

    /**
     *
     * @returns {Session}
     */
    static getAlive() {
        let session = jsonify(localStorage.getItem(CREARY.SESSION));

        if (session.account) {
            return new Session(session.account, session.keepAlive);
        }

        session = jsonify(sessionStorage.getItem(CREARY.SESSION));

        if (session.account) {
            return new Session(session.account, session.keepAlive);
        }

        return false;
    }
}