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
            console.log(result.length);
            if (err) {
                callback(err);
            } else {

                let accountData = result;
                accountData.user = accountData.accounts[that.account.username];
                let auths = Object.keys(that.account.keys);
                let logged = true;

                auths.forEach(function (auth) {
                    if (that.account.keys[auth]) {
                        let pubKey;
                        if (auth == 'memo') {
                            pubKey = accountData.user[auth + '_key'];
                        } else {
                            pubKey = accountData.user[auth].key_auths[0][0];
                        }
                        logged = logged && that.account.keys[auth].pub == pubKey;
                        console.log('Checking', auth, pubKey, '==', that.account.keys[auth].pub, logged);
                    }
                });

                if (logged) {
                    callback(null, accountData);
                } else {
                    callback(Errors.USER_LOGIN_ERROR);
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
    static create(username, password, role='owner') {
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