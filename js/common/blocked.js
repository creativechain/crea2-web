/**
 * Created by ander on 2/01/19.
 */

let blockedContainer;

(function () {

    function setUp(session, account, blocked) {

        if (!blockedContainer) {
            blockedContainer = new Vue({
                el: '#blocked-container',
                data: {
                    lang: lang,
                    session: session,
                    account: account,
                    blocked: blocked
                },
                methods: {

                }
            })
        } else {
            blockedContainer.session = session;
            blockedContainer.account = account;
            blockedContainer.blocked = blocked;
        }
    }

    function fetchBlockeds(session, account) {

        crea.api.getFollowing(session.account.username, '', 'ignore', 1000, function (err, result) {
            if (!catchError(err)) {
                let accounts = [];

                result = result.following;

                result.forEach(function (r) {
                    if (r.follower === session.account.username) {
                        if (!accounts.includes(r.following)) {
                            accounts.push(r.following);
                        }
                    }
                });

                //Get blocked accounts;
                if (accounts.length) {
                    crea.api.getAccounts(accounts, function (err, result) {
                        if (!catchError(err)) {

                            for (let x = 0; x < result.length; x++) {
                                let c = result[x];

                                c.metadata = jsonify(c.json_metadata);
                                result[x] = c;
                            }

                            setUp(session, account, result);
                        }
                    })
                } else {
                    //Not blockeds
                    setUp(session, account, accounts);
                }

            }
        })
    }

    creaEvents.on('crea.session.login', function (s, a) {
        fetchBlockeds(s, a);
    })
})();