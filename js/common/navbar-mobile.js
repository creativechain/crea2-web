
(function () {
    var navbarMobile;

    function updateNavbarSession(session, userData) {

        if (!navbarMobile) {
            navbarMobile = new Vue({
                el: '#navbar-mobile',
                data: {
                    lang: lang,
                    session: session,
                    user: userData ? userData.user : {},
                    nav: getPathPart()
                },
                methods: {
                    isUserFeed: isUserFeed,
                    goTo: goTo,
                    getDefaultAvatar: R.getAvatar,
                    retrieveNowContent: retrieveNewContent,
                    retrieveTrendingContent: retrieveTrendingContent,
                    retrieveHotContent: retrieveHotContent,
                    retrievePromotedContent: retrievePromotedContent
                }
            });
        } else {
            navbarMobile.session = session;
            navbarMobile.user = userData ? userData.user : {};
        }
    }

    function retrieveContent(event, urlFilter) {
        if (isInHome()) {
            cancelEventPropagation(event);
        }

        var filter = resolveFilter(urlFilter);
        updateUrl(urlFilter);

        currentPage.pathname = urlFilter;

        crea.api.getState(filter, function (err, urlState) {
            if (!catchError(err)) {
                if (isUserFeed()) {
                    var http = new HttpClient(apiOptions.apiUrl + '/creary/feed');

                    var noFeedContent = function noFeedContent() {
                        //User not follows anything, load empty content
                        urlState.content = {};
                        creaEvents.emit('crea.posts', urlFilter, filter, urlState);
                    };

                    http.when('done', function (response) {
                        var data = jsonify(response).data;

                        if (data.length) {
                            var count = data.length;

                            var onContentFetched = function onContentFetched() {
                                count--;

                                if (count <= 0) {
                                    creaEvents.emit('crea.posts', urlFilter, filter, urlState);
                                }
                            };

                            urlState.content = {};
                            data.forEach(function (d) {
                                var permlink = d.author + '/' + d.permlink;

                                if (!urlState.content[permlink]) {
                                    crea.api.getContent(d.author, d.permlink, function (err, result) {
                                        if (err) {
                                            console.error('Error getting', permlink, err);
                                        } else {
                                            urlState.content[permlink] = result;
                                        }

                                        onContentFetched();
                                    });
                                }
                            });
                        } else {
                            noFeedContent();
                        }
                    });
                    http.when('fail', function (jqXHR, textStatus, errorThrown) {
                        catchError(textStatus);
                    });
                    var username = getPathPart().replace('/', '').replace('@', '');
                    crea.api.getFollowing(username, '', 'blog', 1000, function (err, result) {
                        if (!catchError(err)) {
                            var followings = [];
                            result.following.forEach(function (f) {
                                followings.push(f.following);
                            });

                            if (followings.length) {
                                followings = followings.join(',');
                                refreshAccessToken(function (accessToken) {
                                    http.headers = {
                                        Authorization: 'Bearer ' + accessToken
                                    };
                                    http.post({
                                        following: followings
                                    });
                                });
                            } else {
                                noFeedContent();
                            }
                        }
                    });
                } else {
                    creaEvents.emit('crea.posts', urlFilter, filter, urlState);
                }
            }
        });
    }

    function retrieveNewContent(event) {
        retrieveContent(event, "/now");
    }

    function retrieveTrendingContent(event) {
        retrieveContent(event, "/popular");
    }

    function retrieveHotContent(event) {
        retrieveContent(event, "/skyrockets");
    }

    function retrievePromotedContent(event) {
        retrieveContent(event, "/promoted");
    }

    creaEvents.on('crea.posts', function () {
        navbarMobile.nav = getPathPart();
    });

    creaEvents.on('crea.content.prepare', function () {
        updateNavbarSession(false, null);
    });

    creaEvents.on('crea.session.update', function (session, account) {
        updateNavbarSession(session, account);
    });

    creaEvents.on('crea.session.login', function (session, account) {
        updateNavbarSession(session, account);
    });

    creaEvents.on('crea.session.logout', function () {
        updateNavbarSession(false, false);
    });
})();
