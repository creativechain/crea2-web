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
                    goTo: goTo,
                    retrieveNowContent: retrieveNewContent,
                    retrieveTrendingContent: retrieveTrendingContent,
                    retrieveHotContent: retrieveHotContent,
                    retrievePromotedContent: retrievePromotedContent
                }
            });
        } else {
            navbarContainer.session = session;
        }
    }

    function retrieveContent(filter) {

        crea.api.getState(filter, function (err, result) {
            if (err) {
                console.error(err);
            } else  {
                //console.log(result);
                showPosts(filter, result);
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

    creaEvents.on('crea.login', function (session) {
        console.log('Executing login');
        updateNavbarSession(session)
    });

    creaEvents.on('crea.logout', function () {
        updateNavbarSession(false);
    });

    creaEvents.on('crea.content.filter', function (filter) {
        retrieveContent(filter);
    })
})();


