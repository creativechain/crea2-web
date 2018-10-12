/**
 * Created by ander on 25/09/18.
 */
(function () {
    let profileContainer;

    let profileMenu = new Vue({
        el: '#profile-menu',
        data: {
            lang: lang
        }
    });

    /**
     *
     * @param {Session} session
     * @param account
     */
    function updateProfile(session, account) {
        let usernameFilter = '/@' + session.account.username;

        crea.api.getState(usernameFilter, function (err, data) {
            if (err) {
                console.error(err);
            } else  {
                console.log(data);

                data.discussion_idx = {};
                let posts = Object.keys(data.content);

                posts.sort(function (k1, k2) {
                    let d1 = new Date(data.content[k1].created);
                    let d2 = new Date(data.content[k2].created);

                    return d2.getTime() - d1.getTime();
                });

                data.discussion_idx[''] = posts;

                if (!profileContainer) {
                    profileContainer = new Vue({
                        el: '#profile-container',
                        data: {
                            lang: lang,
                            session: session,
                            account: account,
                            data: data,
                            filter: usernameFilter
                        },
                        methods: {
                            getJoinDate: function () {
                                let date = new Date(this.account.created);
                                return this.lang.PROFILE.JOINED + moment(date.getTime(), 'x').format('MMMM YYYY');
                            }
                        }
                    });
                } else {
                    if (session) {
                        profileContainer.$data.session = session;
                    }

                    if (account) {
                        profileContainer.$data.account = account;
                    }

                    profileContainer.$data.data = data;
                    profileContainer.$data.filter = usernameFilter;
                    profileContainer.$forceUpdate();
                }
            }
        });
    }

    function updateProfileAccount(session, account) {
        if (!session) {
            session = Session.getAlive();
        }
        crea.api.getFollowCount(session.account.username, function(err, result) {
            if (err) {
                console.error(err);
            } else {

                account.followers_count = result.follower_count;
                account.following_count = result.following_count;
                updateProfile(session, account);
            }
        });
    }

    function setUpProfile() {
        let session = Session.getAlive();
        if (session) {
            crea.api.getAccounts([session.account.username], function (err, result) {

                if (err) {
                    console.error(err);
                    //TODO: Show an error
                } else if (result.length > 0) {
                    let account = result[0];
                    account.cgy_balance = '0.000 ' + apiOptions.symbol.CGY;
                    updateProfileAccount(session, account);
                } else {
                    //TODO: Account not exists
                }
            });

        } else {
            //Not logged, redirect to Home if location is wallet.php
            toHome('profile.php');
        }
    }

    setUpProfile();
})();
