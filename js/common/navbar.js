/**
 * Created by ander on 25/09/18.
 */

let navbarSearch = new Vue({
    el: '#navbar-search',
    data: {
        lang: lang
    }
});

let navbarRightMenu = new Vue({
    el: '#navbar-right-menu',
    data: {
        lang: lang
    }
});

let navbarContainer = new Vue({
    el: '#navbar-container',
    data: {
        lang: lang,
        session: false
    },
    methods: {
        login: startLogin
    }
});

/**
 *
 * @param {Session} session
 */
function setNavbarSession(session) {
    navbarContainer.$data.session = session;
    localStorage.setItem(CREARY.SESSION, jsonstring(session));
}

function setUpNavbar() {
    let session = localStorage.getItem(CREARY.SESSION);
    session = jsonify(session);
    if (session) {
        setNavbarSession(session);
    }
}

setUpNavbar();