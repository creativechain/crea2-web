"use strict";

/**
 * Created by ander on 28/12/18.
 */
(function () {
    var faqContainer;

    function setUp() {
        faqContainer = new Vue({
            el: '#faq-container',
            data: {
                lang: lang,
                faq: faq
            },
            methods: {
                linkfy: linkfy,
                toPermalink: toPermalink
            }
        });
        creaEvents.emit('crea.dom.ready');
    }

    creaEvents.on('crea.session.login', function (s, a) {
        setUp();
    });
})();