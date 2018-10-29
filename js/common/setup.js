/**
 * Created by ander on 11/10/18.
 */

(function () {
    let session = Session.getAlive();
    if (session) {
        session.login(function (err, account) {
            if (err) {
                console.error(err);
            } else {
                let followings = [];
                crea.api.getFollowing(session.account.username, '', 'blog', 1000, function (err, result) {
                    if (err) {
                        console.error(err);
                    } else {
                        result.following.forEach(function (f) {
                            followings.push(f.following);
                        });
                        account.user.followings = followings;
                        creaEvents.emit('crea.session.login', session, account);
                    }
                });
            }
        })

    } else {
        creaEvents.emit('crea.session.login', false);
    }

    new ClipboardJS('.btn_copy');
})();
