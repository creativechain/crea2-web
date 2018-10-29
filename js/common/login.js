/**
 * Created by ander on 29/09/18.
 */

function startLogin() {
    let username = $('#login-username').val();
    let password = $('#login-password').val();

    login(username, password);

    return false;
}

/**
 *
 * @param {string} username
 * @param {string} password
 */
function login(username, password) {
    //Check roles;
    let roles = username.split('/');

    let session;
    if (roles.length > 1) {
        username = roles[0]; //First must be a username
        let role = roles[1];

        session = Session.create(username, password, role);
    } else {
        session = Session.create(username, password);
    }

    session.login(function (err, account) {
        console.log(err, account);
        if (err) {
            console.error(err);
        } else {
            session.save();
            let followings = [];
            crea.api.getFollowing(session.account.username, '', 'blog', 1000, function (err, result) {
                if (err) {
                    console.error(err);
                } else {
                    result.forEach(function (f) {
                        followings.push(f.following);
                    });
                    account.user.followings = followings;
                    creaEvents.emit('crea.session.login', session, account);
                }
            });

        }
    });

}

function logout() {
    Session.getAlive().logout();
    //updateNavbarSession(false);
    creaEvents.emit('crea.session.logout')
}