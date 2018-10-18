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
        if (err) {
            console.error(err);
        } else {
            session.save();
            creaEvents.emit('crea.login', session);
        }
    });

}

function logout() {
    Session.getAlive().logout();
    //updateNavbarSession(false);
    creaEvents.emit('crea.logout')
}

function formSubmit(event) {
    event.preventDefault();
    return startLogin();
}