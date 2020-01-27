"use strict";

/**
 * Created by ander on 30/12/18.
 */
(function () {
    let recoverContainer;

    function setUp() {
        recoverContainer = new Vue({
            el: '#recover-container',
            data: {
                lang: lang
            }
        });
    }

    creaEvents.on('crea.session.login', function (s, a) {
        setUp();
        creaEvents.emit('crea.dom.ready', 'publish');
    });

})();