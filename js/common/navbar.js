/**
 * Created by ander on 25/09/18.
 */

(function () {
    let navbarContainer;

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

    /**
     *
     * @param {Session} session
     */
    function updateNavbarSession(session) {
        if (!navbarContainer) {
            navbarContainer = new Vue({
                el: '#navbar-container',
                data: {
                    lang: lang,
                    session: session
                },
                methods: {
                    login: startLogin,
                    goTo: goTo
                }
            });
        } else {
            navbarContainer.session = session;
        }
    }

    function setUpNavbar() {
        let session = Session.getAlive();
        updateNavbarSession(session);
    }

    setUpNavbar();
})();

