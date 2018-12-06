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

        if (!navbarContainer) {
            navbarContainer = new Vue({
                el: '#navbar-container',
                data: {
                    lang: lang,
                    session: session,
                    user: userData ? userData.user : {},
                    loginForm: {
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
                mounted: function () {
                    this.applyRightMenuEvents($);
                },
                methods: {
                    applyRightMenuEvents: function ($) {
                        mr.notifications.documentReady($);
                        mr.tabs.documentReady($);
                        mr.toggleClass.documentReady($);
                    },
                    closeLogin: function () {
                        $('#modal-login').removeClass('modal-active');
                    },
                    logout: logout,
                    login: function (event) {
                        event.preventDefault();
                        let that = this;
                        if (!this.loginForm.username.error) {
                            login(this.loginForm.username.value, this.loginForm.password.value, function (err) {
                                if (err) {
                                    console.error(err);
                                    if (err === Errors.USER_LOGIN_ERROR) {
                                        that.loginForm.password.error = that.lang.ERROR[err];
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
                    },
                    checkUsername: checkUsername,
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

    function checkUsername(event) {
        let username = event.target.value;
        console.log("Checking", username);
        if (!crea.utils.validateAccountName(username)) {
            let accounts = [ username ];
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
            })
        } else {
            navbarContainer.loginForm.username.error = lang.ERROR.INVALID_USERNAME;
        }
    }

    /**
     *
     * @returns {boolean}
     */
    function isInHome() {
        let filters = ['/hot', '/trending', '/trending30', '/created', '/promoted', '/votes', '/actives', '/cashout',
            '/responses', '/payout', '/payout_comments', '/skyrockets', '/popular'];

        //Check if path is user feed
        let s = Session.getAlive();
        if (s && isUserFeed(s.account.username)) {
            return true;
        }

        return filters.includes(window.location.pathname);
    }

    function retrieveContent(event, urlFilter) {
        if (event && isInHome()) {
            event.preventDefault();
        }

        let filter = resolveFilter(urlFilter);

        updateUrl(urlFilter);
        crea.api.getState(filter, function (err, result) {
            if (err) {
                console.error(err);
            } else  {
                creaEvents.emit('crea.posts', urlFilter, filter, result);
            }
        })
    }

    function retrieveNewContent(event) {
        retrieveContent(event, "/created");
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

    creaEvents.on('crea.session.update', function (session, account) {
        updateNavbarSession(session, account);
    });

    creaEvents.on('crea.session.login', function (session, account) {
        updateNavbarSession(session, account)
    });

    creaEvents.on('crea.session.logout', function () {
        updateNavbarSession(false, false);
    });

    creaEvents.on('crea.content.filter', function (filter) {
        if (!filter.startsWith('/')) {
            filter = '/' + filter;
        }
        console.log('Retrieve', filter, 'content');
        retrieveContent(null, filter);
    })
})();


