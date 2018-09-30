/**
 * Created by ander on 29/09/18.
 */

function startLogin() {
    let username = $('#login-username').val();
    let password = $('#login-password').val();

    login(username, password);

    return false;
}

function login(username, password) {
    //Check user exists

    let session = Session.create(username, password);
    session.login(function (err, account) {
        if (err) {
            console.error(err);
        } else {
            console.log(account)
            setNavbarSession(session);
        }
    });
}

function logout() {
    localStorage.setItem(CREARY.SESSION, false);
    setNavbarSession(false)
}

function formSubmit(event) {
    event.preventDefault();
    return startLogin();
}