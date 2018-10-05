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

    function updateProfile(session, account) {
        if (!profileContainer) {
            profileContainer = new Vue({
                el: '#profile-container',
                data: {
                    lang: lang,
                    session: session,
                    account: account
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

            profileContainer.$forceUpdate();
        }
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
            //toHome('profile.php');
        }
    }

    setUpProfile();
})();
