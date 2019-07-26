"use strict";

/**
 * Created by ander on 7/01/19.
 */
(function () {
    var errorContainer;

    function setUp() {
        if (!errorContainer) {
            errorContainer = new Vue({
                el: '#error-container',
                data: {
                    lang: lang,
                    url: window.location.pathname
                }
            });
        }
    }

    creaEvents.on('crea.session.login', function () {
        setUp();
    });
})();