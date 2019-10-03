"use strict";

/**
 * Created by ander on 11/10/18.
 */
(function () {
    window.addEventListener('load', function (ev) {
        console.log("Resources loaded");
        creaEvents.emit('crea.content.loaded');
    });

    document.addEventListener('DOMContentLoaded', function () {
        console.log("DOM loaded");
        creaEvents.emit('crea.content.prepare');

        var session = Session.getAlive();

        if (session) {
            session.login(function (err, account) {
                if (err) {
                    console.error(err);

                    if (err === Errors.USER_LOGIN_ERROR) {
                        session.logout();
                    }

                    creaEvents.emit('crea.session.login', false);
                } else {
                    var count = 2;
                    var onTaskEnded = function onTaskEnded(session, account) {
                        --count;

                        if (count === 0) {
                            creaEvents.emit('crea.session.login', session, account);
                        }
                    };

                    var followings = [];
                    var blockeds = [];
                    crea.api.getFollowing(session.account.username, '', 'blog', 1000, function (err, result) {
                        if (!catchError(err)) {
                            result.following.forEach(function (f) {
                                followings.push(f.following);
                            });
                            account.user.followings = followings;
                            onTaskEnded(session, account);
                        }
                    });

                    crea.api.getFollowing(session.account.username, '', 'ignore', 1000, function (err, result) {
                        if (!catchError(err)) {
                            result.following.forEach(function (f) {
                                blockeds.push(f.following);
                            });
                            account.user.blockeds = blockeds;
                            onTaskEnded(session, account);
                        }
                    });
                }
            });
        } else {
            creaEvents.emit('crea.session.login', false);
        }
    });

    function updateCookies(session) {
        console.log('Cookie session', session);
        if (session) {
            CreaCookies.set('creary.username', session.account.username);
        } else {
            CreaCookies.remove('creary.username')
        }

        //Send language
        //console.log('cookies');
        var navLang = navigator.language.toLowerCase().split('-')[0];
        CreaCookies.set('creary.language', navLang);

        //console.log(navLang, CreaCookies.get('creary.language'));
    }
    creaEvents.on('crea.session.login', function (session) {
        globalLoading.show = false;
        updateCookies(session);
    });

    creaEvents.on('crea.session.update', updateCookies);

    creaEvents.on('crea.session.logout', updateCookies);

    creaEvents.on('crea.modal.ready', function (remove) {
        setTimeout(function () {

            if (remove) {
                //Remove login modals to prevent id conflicts
                $('.all-page-modals #modal-login').remove();
                $('.all-page-modals #modal-login-d').remove();
            }

            mr.modals.documentReady($);
        }, 500);

    });

    creaEvents.on('crea.dom.ready', function () {
        $.holdReady(false);
        $(window).scroll(function (event) {
            var scrollHeight = $(document).height();
            var scrollPosition = $(window).height() + $(window).scrollTop();
            var bottom = (scrollHeight - scrollPosition) / scrollHeight;

            if (bottom <= 0.01) {
                // when scroll to bottom of the page
                creaEvents.emit('crea.scroll.bottom');
            }
        }); //Inputs length validations;

        $('input, textarea').each(function (index, element) {
            var limit = parseInt($(element).attr('maxlength'));
            $(element).keypress(function (e) {
                var length = e.target.value.length;

                if (e.charCode > 0 && length === limit) {
                    cancelEventPropagation(e);
                }
            });
        });
        $('[data-toggle="popover"]').popover();

        //Build modals
        creaEvents.emit('crea.modal.ready');
    });

})();
