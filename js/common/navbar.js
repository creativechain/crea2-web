/**
 * Created by ander on 25/09/18.
 */

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
                retrieveNowContent: retrieveNowContent,
                retrieveTrendingContent: retrieveTrendingContent,
                retrieveHotContent: retrieveHotContent,
                retrievePromotedContent: retrievePromotedContent
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

function retrieveNowContent(limit = 20) {
    let params = {
        limit: limit
    };

    crea.api.getDiscussionsByCreatedWith(params, function (err, result) {
        if (err) {
            console.error(err);
        } else if (result.discussions) {
            result = result.discussions;
            console.log(result);
            showPosts(result);

        }
    })
}

function retrieveTrendingContent(limit = 20) {
    let params = {
        limit: limit
    };

    crea.api.getDiscussionsByTrendingWith(params, function (err, result) {
        if (err) {
            console.error(err);
        } else if (result.discussions) {
            result = result.discussions;
            console.log(result);
            showPosts(result);

        }
    })
}

function retrieveHotContent(limit = 20) {
    let params = {
        limit: limit
    };

    crea.api.getDiscussionsByHotWith(params, function (err, result) {
        if (err) {
            console.error(err);
        } else if (result.discussions) {
            result = result.discussions;
            console.log(result);
            showPosts(result);

        }
    })
}

function retrievePromotedContent(limit = 20) {
    let params = {
        limit: limit
    };

    crea.api.getDiscussionsByPromotedWith(params, function (err, result) {
        if (err) {
            console.error(err);
        } else if (result.discussions) {
            result = result.discussions;
            console.log(result);
            showPosts(result);

        }
    })
}

setUpNavbar();

