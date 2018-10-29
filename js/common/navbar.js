/**
 * Created by ander on 25/09/18.
 */
let navbarContainer;
(function () {


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
     * @param userData
     */
    function updateNavbarSession(session, userData) {
        console.log(session, userData);
        if (!navbarContainer) {
            navbarContainer = new Vue({
                el: '#navbar-container',
                data: {
                    lang: lang,
                    session: session,
                    user: userData ? userData.user : {},
                },
                methods: {
                    login: function (event) {
                        event.preventDefault();
                        startLogin();
                    },
                    goTo: goTo,
                    getDefaultAvatar: R.getDefaultAvatar,
                    retrieveNowContent: retrieveNewContent,
                    retrieveTrendingContent: retrieveTrendingContent,
                    retrieveHotContent: retrieveHotContent,
                    retrievePromotedContent: retrievePromotedContent
                }
            });
        } else {
            navbarContainer.session = session;
            navbarContainer.user = userData ? userData.user : {};
        }
    }

    function retrieveContent(filter) {

        crea.api.getState(filter, function (err, result) {
            if (err) {
                console.error(err);
            } else  {
                creaEvents.emit('crea.posts', filter, result);
            }
        })
    }

    function retrieveNewContent() {
        retrieveContent("created");
    }

    function retrieveTrendingContent() {

        retrieveContent("trending");
    }

    function retrieveHotContent() {

        retrieveContent("hot");
    }

    function retrievePromotedContent() {

        retrieveContent("promoted");
    }

    creaEvents.on('crea.session.update', function (session, account) {
        updateNavbarSession(session, account);
    });

    creaEvents.on('crea.session.login', function (session, account) {
        console.log('Executing login');
        updateNavbarSession(session, account)
    });

    creaEvents.on('crea.session.logout', function () {
        updateNavbarSession(false, false);
    });

    creaEvents.on('crea.content.filter', function (filter) {
        console.log('Retrieve', filter, 'content');
        retrieveContent(filter);
    })
})();


