"use strict";

/**
 * Created by ander on 25/09/18.
 */
(function () {
    let navbarContainer;

    let navbarSearch = new Vue({
        el: '#navbar-search',
        data: {
            lang: lang,
            search: null,
            page: 1
        },
        methods: {
            reset: function reset() {
                this.search = null;
                this.page = 1;
            },
            performSearch: function (_performSearch) {
                function performSearch(_x) {
                    return _performSearch.apply(this, arguments);
                }

                performSearch.toString = function () {
                    return _performSearch.toString();
                };

                return performSearch;
            }(function (event) {
                cancelEventPropagation(event);

                if (this.search) {
                    performSearch(this.search, this.page, isInHome());
                }
            })
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
        if (!navbarContainer) {
            navbarContainer = new Vue({
                el: '#navbar-container',
                data: {
                    lang: lang,
                    session: session,
                    user: userData ? userData.user : {},
                    nav: getPathPart(),
                    loginForm: {
                        xs: isSmallScreen(),
                        username: {
                            error: null,
                            value: ''
                        },
                        password: {
                            error: null,
                            value: ''
                        }
                    }
                },
                mounted: function mounted() {
                    this.applyRightMenuEvents($);
                    $('#modal-login').parent().removeAttr('modal-attached');
                },
                methods: {
                    applyRightMenuEvents: function applyRightMenuEvents($) {
                        /*                        mr.notifications.documentReady($);
                                                mr.tabs.documentReady($);
                                                mr.toggleClass.documentReady($);
                                                console.log('applying menus');*/
                    },
                    closeLogin: function closeLogin() {
                        hideModal('#modal-login');
                        hideModal('#modal-login-d');
                    },
                    logout: logout,
                    login: function (_login) {
                        function login(_x2) {
                            return _login.apply(this, arguments);
                        }

                        login.toString = function () {
                            return _login.toString();
                        };

                        return login;
                    }(function (event) {
                        cancelEventPropagation(event);
                        let that = this;

                        if (!this.loginForm.username.error) {
                            login(this.loginForm.username.value, this.loginForm.password.value, function (err) {
                                console.log(err);
                                if (err) {
                                    console.error(err);

                                    if (err === Errors.USER_LOGIN_ERROR) {
                                        that.loginForm.password.error = that.lang.ERROR[err].TITLE;
                                        console.error(that.lang.ERROR[err]);
                                    } else {
                                        that.loginForm.password.error = that.lang.ERROR.UNKNOWN_ERROR;
                                        console.error(that.lang.ERROR[err]);
                                    }
                                } else {
                                    that.closeLogin();
                                }
                            });
                        }
                    }),
                    isUserFeed: isUserFeed,
                    checkUsername: checkUsername,
                    goTo: goTo,
                    getDefaultAvatar: R.getAvatar,
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

    function checkUsername(event) {
        let target = event.target;
        let username = target.value.toLowerCase();
        navbarContainer.loginForm.username.value = username; //console.log(target.value, username);

        if (!crea.utils.validateAccountName(username)) {
            let accounts = [username];
            console.log("Checking", accounts);
            crea.api.lookupAccountNames(accounts, function (err, result) {
                if (err) {
                    console.error(err);
                    navbarContainer.loginForm.username.error = lang.ERROR.INVALID_USERNAME;
                } else if (result[0] == null) {
                    navbarContainer.loginForm.username.error = lang.ERROR.USERNAME_NOT_EXISTS;
                } else {
                    navbarContainer.loginForm.username.error = null;
                }
            });
        } else {
            navbarContainer.loginForm.username.error = lang.ERROR.INVALID_USERNAME;
        }
    }

    function retrieveContent(event, urlFilter) {
        if (isInHome()) {
            cancelEventPropagation(event);
        }

        let filter = resolveFilter(urlFilter);
        updateUrl(urlFilter);

        currentPage.pathname = urlFilter;

        crea.api.getState(filter, function (err, urlState) {
            if (!catchError(err)) {
                if (isUserFeed()) {
                    let http = new HttpClient(apiOptions.apiUrl + '/creary/feed');

                    let noFeedContent = function noFeedContent() {
                        //User not follows anything, load empty content
                        urlState.content = {};
                        creaEvents.emit('crea.posts', urlFilter, filter, urlState);
                    };

                    http.when('done', function (response) {
                        let data = jsonify(response).data;

                        if (data.length) {
                            let count = data.length;

                            let onContentFetched = function onContentFetched() {
                                count--;

                                if (count <= 0) {
                                    creaEvents.emit('crea.posts', urlFilter, filter, urlState);
                                }
                            };

                            urlState.content = {};
                            data.forEach(function (d) {
                                let permlink = d.author + '/' + d.permlink;

                                if (!urlState.content[permlink]) {
                                    crea.api.getContent(d.author, d.permlink, function (err, result) {
                                        if (err) {
                                            console.error('Error getting', permlink, err);
                                        } else {
                                            let p = parsePost(result);
                                            p.reblogged_by = d.reblogged_by;
                                            urlState.content[permlink] = p;
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
                    let username = getPathPart().replace('/', '').replace('@', '');
                    crea.api.getFollowing(username, '', 'blog', 1000, function (err, result) {
                        if (!catchError(err)) {
                            let followings = [];
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
                                        following: followings,
                                        reblogs: true,
                                        adult: navbarContainer.user.metadata.adult_content
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
        navbarContainer.nav = getPathPart();
    });

    creaEvents.on('crea.session.update', function (session, account) {
        updateNavbarSession(session, account);
    });

    creaEvents.on('crea.session.login', function (session, account) {
        updateNavbarSession(session, account);
    });

    creaEvents.on('crea.session.logout', function () {
        updateNavbarSession(false, false);
        creaEvents.emit('crea.modal.ready', true);
    });

    creaEvents.on('crea.content.filter', function (filter) {
        if (!filter.startsWith('/')) {
            filter = '/' + filter;
        }

        retrieveContent(null, filter);
    });

})();