/**
 * Created by ander on 11/10/18.
 */

(function () {

    document.addEventListener('DOMContentLoaded', function () {

        creaEvents.emit('crea.content.prepare');
        creaEvents.emit('crea.content.loaded');

        let session = Session.getAlive();
        if (session) {
            session.login(function (err, account) {
                if (err) {
                    console.error(err);

                    if (err == Errors.USER_LOGIN_ERROR) {
                        session.logout();
                    }

                    creaEvents.emit('crea.session.login', false);
                } else {
                    let followings = [];
                    crea.api.getFollowing(session.account.username, '', 'blog', 1000, function (err, result) {
                        if (!catchError(err)) {
                            result.following.forEach(function (f) {
                                followings.push(f.following);
                            });
                            account.user.followings = followings;
                            creaEvents.emit('crea.session.login', session, account);
                        }
                    });
                }
            })

        } else {
            creaEvents.emit('crea.session.login', false);
        }
    });

    creaEvents.on('crea.dom.ready', function (script) {
        $.holdReady(false);

        $(window).scroll(function (event) {

            let scrollHeight = $(document).height();
            let scrollPosition = $(window).height() + $(window).scrollTop();

            let bottom = (scrollHeight - scrollPosition) / scrollHeight;
            if (bottom <= 0.01) {
                // when scroll to bottom of the page
                creaEvents.emit('crea.scroll.bottom');
            }
        });

        //Inputs length validations;
        $('input, textarea').each(function (index, element) {
            let limit = parseInt($(element).attr('maxlength'));
            $(element).keypress(function (e) {
                let length = e.target.value.length;
                if (e.charCode > 0 && length === limit) {
                    cancelEventPropagation(e);
                }
            })
        })

        $('[data-toggle="popover"]').popover();
    })

})();